jest.mock("@/services/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

import { api } from "@/services/api";
import { VideoService } from "@/services/VideoService";

const mockFeed = [
  {
    _id: "v1",
    memberId: "m1",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    title: "Never Gonna Give You Up",
    firstName: "Ana",
    lastName: "Silva",
    profileImage: null,
  },
];

describe("VideoService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("listAllVideos", () => {
    it("faz GET /videos e retorna feed de vídeos", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { data: mockFeed } });

      const result = await VideoService.listAllVideos();

      expect(api.get).toHaveBeenCalledWith("/videos");
      expect(result).toEqual(mockFeed);
    });

    it("retorna lista vazia quando não há vídeos", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { data: [] } });

      const result = await VideoService.listAllVideos();

      expect(result).toEqual([]);
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("network error"));

      await expect(VideoService.listAllVideos()).rejects.toThrow("network error");
    });
  });

  describe("createVideo", () => {
    it("faz POST /videos com url e title", async () => {
      (api.post as jest.Mock).mockResolvedValue({});

      await VideoService.createVideo("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "Título do vídeo");

      expect(api.post).toHaveBeenCalledWith("/videos", {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Título do vídeo",
      });
    });

    it("faz POST /videos sem title quando não informado", async () => {
      (api.post as jest.Mock).mockResolvedValue({});

      await VideoService.createVideo("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

      expect(api.post).toHaveBeenCalledWith("/videos", {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: undefined,
      });
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error("url inválida"));

      await expect(VideoService.createVideo("https://invalid.url")).rejects.toThrow("url inválida");
    });
  });

  describe("removeVideo", () => {
    it("faz DELETE /videos/{videoId}", async () => {
      (api.delete as jest.Mock).mockResolvedValue({});

      await VideoService.removeVideo("v1");

      expect(api.delete).toHaveBeenCalledWith("/videos/v1");
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.delete as jest.Mock).mockRejectedValue(new Error("not found"));

      await expect(VideoService.removeVideo("v1")).rejects.toThrow("not found");
    });
  });
});
