jest.mock("@/services/api", () => ({
  api: {
    get: jest.fn(),
  },
}));

import { api } from "@/services/api";
import { BalanceServices } from "@/services/BalanceService";

const annualBalance = {
  year: 2026,
  asOfMonth: 3,
  totals: { entradas: 900, saidas: 200, resultado: 700, saldoFinal: 700 },
  byMonth: [
    { month: 1, entradas: 300, saidas: 0, resultado: 300, saldoAcumulado: 300 },
    { month: 2, entradas: 300, saidas: 100, resultado: 200, saldoAcumulado: 500 },
    { month: 3, entradas: 300, saidas: 100, resultado: 200, saldoAcumulado: 700 },
  ],
  expensesByCategory: { event: 100, food: 100 },
};

describe("BalanceServices", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getAnnual", () => {
    it("faz GET /balance/annual com o year e retorna o balanço", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { data: annualBalance } });

      const result = await BalanceServices.getAnnual(2026);

      expect(api.get).toHaveBeenCalledWith("/balance/annual", {
        params: { year: 2026 },
      });
      expect(result).toEqual(annualBalance);
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("network error"));

      await expect(BalanceServices.getAnnual(2026)).rejects.toThrow(
        "network error",
      );
    });
  });
});
