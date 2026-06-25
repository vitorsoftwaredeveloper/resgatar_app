jest.mock("@/services/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

import { api } from "@/services/api";
import { ChargeServices } from "@/services/ChargeService";

const summary = {
  year: 2026,
  month: 6,
  goal: 4800,
  collected: 3100,
  remaining: 1700,
  byMethod: { pix: 2400, cash: 700 },
  counts: { paid: 2, pending: 1, total: 3 },
  members: [
    { id: "1", name: "Maria Andrade", photo: null, paid: true, method: "pix", paidAt: "2026-06-03", amount: 100 },
  ],
};

const goalProgress = {
  year: 2026,
  month: 6,
  goal: 4800,
  collected: 3100,
  remaining: 1700,
  percent: 64.58,
};

describe("ChargeServices", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getSummary", () => {
    it("faz GET /charges/summary com year e month e retorna o resumo", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { data: summary } });

      const result = await ChargeServices.getSummary(2026, 6);

      expect(api.get).toHaveBeenCalledWith("/charges/summary", {
        params: { year: 2026, month: 6 },
      });
      expect(result).toEqual(summary);
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("forbidden"));

      await expect(ChargeServices.getSummary(2026, 6)).rejects.toThrow(
        "forbidden",
      );
    });
  });

  describe("getGoalProgress", () => {
    it("faz GET /charges/goal-progress e retorna o progresso", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { data: goalProgress } });

      const result = await ChargeServices.getGoalProgress();

      expect(api.get).toHaveBeenCalledWith("/charges/goal-progress");
      expect(result).toEqual(goalProgress);
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("network error"));

      await expect(ChargeServices.getGoalProgress()).rejects.toThrow(
        "network error",
      );
    });
  });
});
