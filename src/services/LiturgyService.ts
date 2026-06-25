import { ILiturgia } from "@/types/Liturgy";
import { getLiturgyCache, setLiturgyCache } from "@/storage/asyncStorage";
import { normalizeText } from "@/utils/helper";
import axios from "axios";

const LITURGY_BASE = "https://liturgia.up.railway.app";

function first<T>(value: T | T[]): T | undefined {
  if (Array.isArray(value)) return value.length > 0 ? value[0] : undefined;
  return value;
}

function normalizeLiturgy(raw: any): ILiturgia {
  const normalizeReading = (r: any) =>
    r
      ? {
          ...r,
          texto: normalizeText(r.texto ?? ""),
          titulo: normalizeText(r.titulo ?? ""),
        }
      : undefined;

  const salmo = first(raw.leituras?.salmo);

  return {
    ...raw,
    leituras: {
      primeiraLeitura: normalizeReading(first(raw.leituras?.primeiraLeitura)),
      salmo: salmo
        ? {
            ...salmo,
            texto: normalizeText(salmo.texto ?? ""),
            refrao: normalizeText(salmo.refrao ?? ""),
          }
        : undefined,
      segundaLeitura: normalizeReading(first(raw.leituras?.segundaLeitura)),
      evangelho: normalizeReading(first(raw.leituras?.evangelho)),
    },
    oracoes: raw.oracoes
      ? {
          coleta: normalizeText(raw.oracoes.coleta ?? ""),
          oferendas: normalizeText(raw.oracoes.oferendas ?? ""),
          comunhao: normalizeText(raw.oracoes.comunhao ?? ""),
        }
      : undefined,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const LiturgyService = {
  // `force` bypasses the daily cache — use only for explicit user refresh.
  async getToday(force = false): Promise<ILiturgia> {
    const key = todayKey();

    if (!force) {
      const cached = await getLiturgyCache(key);
      if (cached) return cached;
    }

    const { data } = await axios.get(`${LITURGY_BASE}/v2/`);
    const liturgy = normalizeLiturgy(data);
    await setLiturgyCache(key, liturgy);
    return liturgy;
  },

  async getByDate(date: Date): Promise<ILiturgia> {
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const { data } = await axios.get(
      `${LITURGY_BASE}/v2/?dia=${day}&mes=${month}&ano=${year}`,
    );
    return normalizeLiturgy(data);
  },
};
