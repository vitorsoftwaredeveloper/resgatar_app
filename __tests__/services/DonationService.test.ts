jest.mock("@/services/api", () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));

import { api } from "@/services/api";
import { DonationServices } from "@/services/DonationService";
import { IDonation } from "@/types/Donation";

const baseDonation: IDonation = {
  transactionId: "txn-pix-1",
  memberId: "member-1",
  amount: "50,00",
  paymentMethodId: "pix",
  status: "pending",
  referenceMonth: 5,
  referenceYear: 2026,
  transactionData: { qrCode: "pix-qr", qrCodeBase64: "base64..." },
};

const cashDonation: IDonation = {
  transactionId: "txn-cash-1",
  memberId: "member-1",
  amount: "20,00",
  paymentMethodId: "cash",
  status: "approved",
  referenceMonth: 5,
  referenceYear: 2026,
};

describe("DonationServices", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createPix", () => {
    it("faz POST /donations com o amount e retorna a doação criada", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { data: baseDonation } });

      const result = await DonationServices.createPix("50,00");

      expect(api.post).toHaveBeenCalledWith("/donations", { amount: "50,00" });
      expect(result).toEqual(baseDonation);
    });

    it("inclui donorName quando fornecido", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { data: baseDonation } });

      await DonationServices.createPix("50,00", "João Silva");

      expect(api.post).toHaveBeenCalledWith("/donations", {
        amount: "50,00",
        donorName: "João Silva",
      });
    });

    it("não inclui donorName quando ausente", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { data: baseDonation } });

      await DonationServices.createPix("50,00");

      const call = (api.post as jest.Mock).mock.calls[0][1];
      expect(call).not.toHaveProperty("donorName");
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error("network error"));

      await expect(DonationServices.createPix("50,00")).rejects.toThrow(
        "network error",
      );
    });
  });

  describe("registerCash", () => {
    it("faz POST /donations/cash com amount e retorna a doação criada", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { data: cashDonation } });

      const result = await DonationServices.registerCash("20,00");

      expect(api.post).toHaveBeenCalledWith("/donations/cash", {
        amount: "20,00",
      });
      expect(result).toEqual(cashDonation);
    });

    it("inclui donorName e referenceMonth quando fornecidos", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { data: cashDonation } });

      await DonationServices.registerCash("20,00", "Maria", 5);

      expect(api.post).toHaveBeenCalledWith("/donations/cash", {
        amount: "20,00",
        donorName: "Maria",
        referenceMonth: 5,
      });
    });

    it("não inclui referenceMonth quando undefined", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { data: cashDonation } });

      await DonationServices.registerCash("20,00", "Maria", undefined);

      const call = (api.post as jest.Mock).mock.calls[0][1];
      expect(call).not.toHaveProperty("referenceMonth");
    });

    it("não inclui donorName quando não fornecido", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { data: cashDonation } });

      await DonationServices.registerCash("20,00");

      const call = (api.post as jest.Mock).mock.calls[0][1];
      expect(call).not.toHaveProperty("donorName");
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error("forbidden"));

      await expect(DonationServices.registerCash("20,00")).rejects.toThrow(
        "forbidden",
      );
    });
  });

  describe("consult", () => {
    it("faz GET /donations/:id e retorna a doação", async () => {
      const approved = { ...baseDonation, status: "approved" };
      (api.get as jest.Mock).mockResolvedValue({ data: { data: approved } });

      const result = await DonationServices.consult("txn-pix-1");

      expect(api.get).toHaveBeenCalledWith("/donations/txn-pix-1");
      expect(result.status).toBe("approved");
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("not found"));

      await expect(DonationServices.consult("txn-pix-1")).rejects.toThrow(
        "not found",
      );
    });
  });

  describe("list", () => {
    it("faz GET /donations com o year e retorna a lista", async () => {
      const list = [baseDonation, cashDonation];
      (api.get as jest.Mock).mockResolvedValue({ data: { data: list } });

      const result = await DonationServices.list(2026);

      expect(api.get).toHaveBeenCalledWith("/donations", {
        params: { year: 2026 },
      });
      expect(result).toHaveLength(2);
      expect(result).toEqual(list);
    });

    it("retorna array vazio quando não há doações", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { data: [] } });

      const result = await DonationServices.list(2025);

      expect(result).toEqual([]);
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("server error"));

      await expect(DonationServices.list(2026)).rejects.toThrow("server error");
    });
  });
});
