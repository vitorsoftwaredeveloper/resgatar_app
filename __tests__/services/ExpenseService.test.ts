jest.mock("@/services/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import { api } from "@/services/api";
import { ExpenseServices } from "@/services/ExpenseService";

const expense = {
  _id: "exp1",
  description: "Material de limpeza",
  amount: "120,00",
  category: "material",
  referenceMonth: 5,
  referenceYear: 2026,
  date: 1750000000000,
  adminId: "admin1",
};

const summary = {
  year: 2026,
  month: 5,
  total: 550,
  count: 2,
  byCategory: { material: 120, event: 430 },
  expenses: [expense],
};

describe("ExpenseServices", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("create", () => {
    it("faz POST /expenses e retorna o _id criado", async () => {
      (api.post as jest.Mock).mockResolvedValue({
        data: { data: { _id: "exp1" } },
      });

      const payload = {
        description: "Material de limpeza",
        amount: "120,00",
        category: "material" as const,
        referenceMonth: 5,
        referenceYear: 2026,
        date: 1750000000000,
      };

      const result = await ExpenseServices.create(payload);

      expect(api.post).toHaveBeenCalledWith("/expenses", payload);
      expect(result).toBe("exp1");
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error("forbidden"));

      await expect(
        ExpenseServices.create({
          description: "x",
          amount: "1,00",
          category: "other",
          referenceMonth: 0,
          referenceYear: 2026,
          date: 1,
        }),
      ).rejects.toThrow("forbidden");
    });
  });

  describe("list", () => {
    it("faz GET /expenses com month 0-indexado e retorna a lista", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { data: [expense] } });

      const result = await ExpenseServices.list(2026, 5);

      expect(api.get).toHaveBeenCalledWith("/expenses", {
        params: { year: 2026, month: 5 },
      });
      expect(result).toEqual([expense]);
    });
  });

  describe("getSummary", () => {
    it("faz GET /expenses/summary com year e month e retorna o resumo", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { data: summary } });

      const result = await ExpenseServices.getSummary(2026, 5);

      expect(api.get).toHaveBeenCalledWith("/expenses/summary", {
        params: { year: 2026, month: 5 },
      });
      expect(result).toEqual(summary);
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("network error"));

      await expect(ExpenseServices.getSummary(2026, 5)).rejects.toThrow(
        "network error",
      );
    });
  });

  describe("update", () => {
    it("faz PUT /expenses/{id} com o payload parcial", async () => {
      (api.put as jest.Mock).mockResolvedValue({ data: {} });

      await ExpenseServices.update("exp1", { amount: "150,00" });

      expect(api.put).toHaveBeenCalledWith("/expenses/exp1", {
        amount: "150,00",
      });
    });
  });

  describe("remove", () => {
    it("faz DELETE /expenses/{id}", async () => {
      (api.delete as jest.Mock).mockResolvedValue({ data: {} });

      await ExpenseServices.remove("exp1");

      expect(api.delete).toHaveBeenCalledWith("/expenses/exp1");
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.delete as jest.Mock).mockRejectedValue(new Error("not found"));

      await expect(ExpenseServices.remove("exp1")).rejects.toThrow("not found");
    });
  });

  describe("uploadReceipt", () => {
    afterEach(() => {
      (global.fetch as jest.Mock | undefined)?.mockRestore?.();
    });

    it("pede a URL assinada, faz PUT no S3 e retorna a key", async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: {
          data: { uploadUrl: "https://s3.amazonaws.com/signed", key: "receipts/a/x.jpg" },
        },
      });

      const fakeBlob = { size: 10 };
      global.fetch = jest
        .fn()
        // 1ª chamada: lê o arquivo local e vira blob
        .mockResolvedValueOnce({ blob: jest.fn().mockResolvedValue(fakeBlob) })
        // 2ª chamada: PUT no S3
        .mockResolvedValueOnce({ ok: true }) as unknown as typeof fetch;

      const key = await ExpenseServices.uploadReceipt(
        "file:///tmp/recibo.jpg",
        "image/jpeg",
      );

      expect(api.get).toHaveBeenCalledWith("/expenses/receipt-upload-url", {
        params: { contentType: "image/jpeg" },
      });
      expect(global.fetch).toHaveBeenLastCalledWith(
        "https://s3.amazonaws.com/signed",
        expect.objectContaining({
          method: "PUT",
          body: fakeBlob,
          headers: { "Content-Type": "image/jpeg" },
        }),
      );
      expect(key).toBe("receipts/a/x.jpg");
    });

    it("lança erro quando o PUT no S3 falha", async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { uploadUrl: "https://s3/signed", key: "k" } },
      });

      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({ blob: jest.fn().mockResolvedValue({}) })
        .mockResolvedValueOnce({ ok: false, status: 403 }) as unknown as typeof fetch;

      await expect(
        ExpenseServices.uploadReceipt("file:///r.jpg", "image/jpeg"),
      ).rejects.toThrow("S3 upload failed with status 403");
    });
  });

  describe("getReceiptViewUrl", () => {
    it("faz GET /expenses/{id}/receipt e retorna a viewUrl", async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { viewUrl: "https://s3/view" } },
      });

      const url = await ExpenseServices.getReceiptViewUrl("exp1");

      expect(api.get).toHaveBeenCalledWith("/expenses/exp1/receipt");
      expect(url).toBe("https://s3/view");
    });
  });
});
