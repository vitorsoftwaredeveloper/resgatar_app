import axios from "axios";
import { ILiturgia } from "@/types/Liturgy";
import { normalizeText } from "@/utils/helper";

const LITURGY_BASE = "https://liturgia.up.railway.app";

function normalizeLiturgy(data: ILiturgia): ILiturgia {
  const normalizeReading = (r: any) =>
    r
      ? {
          ...r,
          texto: normalizeText(r.texto ?? ""),
          titulo: normalizeText(r.titulo ?? ""),
        }
      : r;

  return {
    ...data,
    leituras: {
      ...data.leituras,
      primeiraLeitura: normalizeReading(data.leituras.primeiraLeitura),
      salmo: data.leituras.salmo
        ? {
            ...data.leituras.salmo,
            texto: normalizeText(data.leituras.salmo.texto ?? ""),
            refrao: normalizeText(data.leituras.salmo.refrao ?? ""),
          }
        : data.leituras.salmo,
      segundaLeitura: normalizeReading(data.leituras.segundaLeitura),
      evangelho: normalizeReading(data.leituras.evangelho),
    },
    oracoes: data.oracoes
      ? {
          coleta: normalizeText(data.oracoes.coleta ?? ""),
          oferendas: normalizeText(data.oracoes.oferendas ?? ""),
          comunhao: normalizeText(data.oracoes.comunhao ?? ""),
        }
      : undefined,
  };
}

export const LiturgyService = {
  async getToday(): Promise<ILiturgia> {
    const { data } = await axios.get<ILiturgia>(`${LITURGY_BASE}/v2/`);
    console.log("Raw liturgy data:", JSON.stringify(data));
    return normalizeLiturgy(data);
  },
};
