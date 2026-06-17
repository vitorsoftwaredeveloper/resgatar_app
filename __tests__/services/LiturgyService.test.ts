jest.mock("axios");
jest.mock("@/utils/helper", () => ({
  normalizeText: (text: string) => text.trim().replace(/\s+/g, " "),
}));

import axios from "axios";
import { LiturgyService } from "@/services/LiturgyService";

const mockedAxios = axios as jest.Mocked<typeof axios>;

const makeRaw = (overrides: any = {}) => ({
  data: "17/06/2026",
  dia: "Quarta-feira",
  cor: "Verde",
  tempo: "Tempo Comum",
  semana: "11ª Semana do Tempo Comum",
  santo: "",
  leituras: {
    primeiraLeitura: {
      referencia: "2Rs 2,1.6-14",
      titulo: "  Primeira leitura  ",
      texto: "  Texto da primeira leitura  ",
    },
    salmo: {
      referencia: "Sl 30",
      refrao: "  Refrao do salmo  ",
      texto: "  Texto do salmo  ",
    },
    segundaLeitura: null,
    evangelho: {
      referencia: "Mt 6,1-6.16-18",
      titulo: "  Evangelho  ",
      texto: "  Texto do evangelho  ",
    },
  },
  oracoes: {
    coleta: "  Oração coleta  ",
    oferendas: "  Oração oferendas  ",
    comunhao: "  Oração comunhão  ",
  },
  ...overrides,
});

describe("LiturgyService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getToday", () => {
    it("faz GET para /v2/ e retorna liturgia normalizada", async () => {
      mockedAxios.get.mockResolvedValue({ data: makeRaw() });

      const result = await LiturgyService.getToday();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v2/"),
      );
      expect(result.leituras.primeiraLeitura?.titulo).toBe(
        "Primeira leitura",
      );
    });

    it("propaga erro quando a requisição falha", async () => {
      mockedAxios.get.mockRejectedValue(new Error("network error"));

      await expect(LiturgyService.getToday()).rejects.toThrow("network error");
    });
  });

  describe("getByDate", () => {
    it("constrói a URL com dia, mês e ano corretos", async () => {
      mockedAxios.get.mockResolvedValue({ data: makeRaw() });

      await LiturgyService.getByDate(new Date(2026, 5, 7)); // 07/06/2026

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("dia=07&mes=06&ano=2026"),
      );
    });

    it("formata dia e mês com zero à esquerda", async () => {
      mockedAxios.get.mockResolvedValue({ data: makeRaw() });

      await LiturgyService.getByDate(new Date(2026, 0, 5)); // 05/01/2026

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("dia=05&mes=01&ano=2026"),
      );
    });
  });

  describe("normalizeLiturgy — primeira leitura", () => {
    it("normaliza texto e título da primeira leitura", async () => {
      mockedAxios.get.mockResolvedValue({ data: makeRaw() });

      const result = await LiturgyService.getToday();

      expect(result.leituras.primeiraLeitura?.texto).toBe(
        "Texto da primeira leitura",
      );
      expect(result.leituras.primeiraLeitura?.titulo).toBe("Primeira leitura");
    });

    it("aceita primeiraLeitura como array e usa o primeiro elemento", async () => {
      const raw = makeRaw();
      raw.leituras.primeiraLeitura = [
        { referencia: "Ref1", titulo: "  Titulo do array  ", texto: "  Texto do array  " },
        { referencia: "Ref2", titulo: "  Ignorado  ", texto: "  Ignorado  " },
      ];
      mockedAxios.get.mockResolvedValue({ data: raw });

      const result = await LiturgyService.getToday();

      expect(result.leituras.primeiraLeitura?.titulo).toBe("Titulo do array");
    });

    it("retorna undefined quando primeiraLeitura é null", async () => {
      const raw = makeRaw();
      raw.leituras.primeiraLeitura = null;
      mockedAxios.get.mockResolvedValue({ data: raw });

      const result = await LiturgyService.getToday();

      expect(result.leituras.primeiraLeitura).toBeUndefined();
    });
  });

  describe("normalizeLiturgy — salmo", () => {
    it("normaliza texto e refrão do salmo quando é objeto", async () => {
      mockedAxios.get.mockResolvedValue({ data: makeRaw() });

      const result = await LiturgyService.getToday();

      expect(result.leituras.salmo?.texto).toBe("Texto do salmo");
      expect(result.leituras.salmo?.refrao).toBe("Refrao do salmo");
    });

    it("aceita salmo como array e usa o primeiro elemento", async () => {
      const raw = makeRaw();
      raw.leituras.salmo = [
        { referencia: "Sl 1", refrao: "  Refrao array  ", texto: "  Texto array  " },
      ];
      mockedAxios.get.mockResolvedValue({ data: raw });

      const result = await LiturgyService.getToday();

      expect(result.leituras.salmo?.refrao).toBe("Refrao array");
    });

    it("retorna undefined quando salmo é null", async () => {
      const raw = makeRaw();
      raw.leituras.salmo = null;
      mockedAxios.get.mockResolvedValue({ data: raw });

      const result = await LiturgyService.getToday();

      expect(result.leituras.salmo).toBeUndefined();
    });
  });

  describe("normalizeLiturgy — segunda leitura", () => {
    it("retorna undefined quando segundaLeitura é null (dia comum)", async () => {
      mockedAxios.get.mockResolvedValue({ data: makeRaw() });

      const result = await LiturgyService.getToday();

      expect(result.leituras.segundaLeitura).toBeUndefined();
    });

    it("normaliza segundaLeitura quando presente (domingo)", async () => {
      const raw = makeRaw();
      raw.leituras.segundaLeitura = {
        referencia: "Rm 8,14-17",
        titulo: "  Segunda leitura  ",
        texto: "  Texto segunda  ",
      };
      mockedAxios.get.mockResolvedValue({ data: raw });

      const result = await LiturgyService.getToday();

      expect(result.leituras.segundaLeitura?.titulo).toBe("Segunda leitura");
    });
  });

  describe("normalizeLiturgy — first com array vazio", () => {
    it("retorna undefined quando primeiraLeitura é array vazio", async () => {
      const raw = makeRaw();
      raw.leituras.primeiraLeitura = [];
      mockedAxios.get.mockResolvedValue({ data: raw });

      const result = await LiturgyService.getToday();

      expect(result.leituras.primeiraLeitura).toBeUndefined();
    });

    it("retorna undefined quando salmo é array vazio", async () => {
      const raw = makeRaw();
      raw.leituras.salmo = [];
      mockedAxios.get.mockResolvedValue({ data: raw });

      const result = await LiturgyService.getToday();

      expect(result.leituras.salmo).toBeUndefined();
    });
  });

  describe("normalizeLiturgy — campos null dentro de leitura", () => {
    it("usa string vazia quando texto da leitura é null", async () => {
      const raw = makeRaw();
      raw.leituras.primeiraLeitura = { referencia: "Ref", titulo: null, texto: null };
      mockedAxios.get.mockResolvedValue({ data: raw });

      const result = await LiturgyService.getToday();

      expect(result.leituras.primeiraLeitura?.texto).toBe("");
      expect(result.leituras.primeiraLeitura?.titulo).toBe("");
    });

    it("usa string vazia quando texto e refrão do salmo são null", async () => {
      const raw = makeRaw();
      raw.leituras.salmo = { referencia: "Sl 1", texto: null, refrao: null };
      mockedAxios.get.mockResolvedValue({ data: raw });

      const result = await LiturgyService.getToday();

      expect(result.leituras.salmo?.texto).toBe("");
      expect(result.leituras.salmo?.refrao).toBe("");
    });
  });

  describe("normalizeLiturgy — orações", () => {
    it("normaliza as três orações", async () => {
      mockedAxios.get.mockResolvedValue({ data: makeRaw() });

      const result = await LiturgyService.getToday();

      expect(result.oracoes?.coleta).toBe("Oração coleta");
      expect(result.oracoes?.oferendas).toBe("Oração oferendas");
      expect(result.oracoes?.comunhao).toBe("Oração comunhão");
    });

    it("retorna undefined quando oracoes é null", async () => {
      const raw = makeRaw({ oracoes: null });
      mockedAxios.get.mockResolvedValue({ data: raw });

      const result = await LiturgyService.getToday();

      expect(result.oracoes).toBeUndefined();
    });

    it("usa string vazia quando campos de oracoes são null", async () => {
      const raw = makeRaw({ oracoes: { coleta: null, oferendas: null, comunhao: null } });
      mockedAxios.get.mockResolvedValue({ data: raw });

      const result = await LiturgyService.getToday();

      expect(result.oracoes?.coleta).toBe("");
      expect(result.oracoes?.oferendas).toBe("");
      expect(result.oracoes?.comunhao).toBe("");
    });
  });
});
