jest.mock("@/services/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import { api } from "@/services/api";
import { BannerService } from "@/services/BannerService";

const mockedApi = api as jest.Mocked<typeof api>;

const banner = {
  id: "b1",
  title: "Banner 1",
  banner: "https://example.com/img.jpg",
  action: { type: "none" as const, value: "" },
  active: true,
  order: 0,
};

describe("BannerService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("list", () => {
    it("retorna a lista de banners", async () => {
      mockedApi.get.mockResolvedValue({ data: { data: [banner] } });
      const result = await BannerService.list();
      expect(result).toEqual([banner]);
      expect(mockedApi.get).toHaveBeenCalledWith("/campaigns");
    });

    it("retorna array vazio quando data.data é undefined", async () => {
      mockedApi.get.mockResolvedValue({ data: {} });
      const result = await BannerService.list();
      expect(result).toEqual([]);
    });

    it("propaga erro de rede", async () => {
      mockedApi.get.mockRejectedValue(new Error("network"));
      await expect(BannerService.list()).rejects.toThrow("network");
    });
  });

  describe("create", () => {
    it("envia POST e retorna o banner criado", async () => {
      mockedApi.post.mockResolvedValue({ data: { data: banner } });
      const input = { title: "Banner 1", banner: "url", action: { type: "none", value: "" }, order: 0 };
      const result = await BannerService.create(input as any);
      expect(result).toEqual(banner);
      expect(mockedApi.post).toHaveBeenCalledWith("/campaigns", input);
    });

    it("propaga erro", async () => {
      mockedApi.post.mockRejectedValue(new Error("fail"));
      await expect(BannerService.create({} as any)).rejects.toThrow("fail");
    });
  });

  describe("update", () => {
    it("envia PUT e retorna o banner atualizado", async () => {
      mockedApi.put.mockResolvedValue({ data: { data: banner } });
      const result = await BannerService.update("b1", {} as any);
      expect(result).toEqual(banner);
      expect(mockedApi.put).toHaveBeenCalledWith("/campaigns/b1", {});
    });

    it("propaga erro", async () => {
      mockedApi.put.mockRejectedValue(new Error("fail"));
      await expect(BannerService.update("b1", {} as any)).rejects.toThrow("fail");
    });
  });

  describe("saveOrder", () => {
    it("envia PUT com ids ordenados", async () => {
      mockedApi.put.mockResolvedValue({});
      await BannerService.saveOrder([banner, { ...banner, id: "b2" }]);
      expect(mockedApi.put).toHaveBeenCalledWith("/campaigns/order", { ids: ["b1", "b2"] });
    });

    it("propaga erro", async () => {
      mockedApi.put.mockRejectedValue(new Error("fail"));
      await expect(BannerService.saveOrder([])).rejects.toThrow("fail");
    });
  });

  describe("remove", () => {
    it("envia DELETE para o id correto", async () => {
      mockedApi.delete.mockResolvedValue({});
      await BannerService.remove("b1");
      expect(mockedApi.delete).toHaveBeenCalledWith("/campaigns/b1");
    });

    it("propaga erro", async () => {
      mockedApi.delete.mockRejectedValue(new Error("fail"));
      await expect(BannerService.remove("b1")).rejects.toThrow("fail");
    });
  });
});
