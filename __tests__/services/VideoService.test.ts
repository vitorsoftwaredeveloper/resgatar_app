jest.mock("@/services/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

import { api } from "@/services/api";
import { VideoService } from "@/services/VideoService";

const mockMembers = [
  {
    memberId: "m1",
    firstName: "Ana",
    lastName: "Silva",
    profileImage: "base64string",
    videoCount: 2,
  },
  {
    memberId: "m2",
    firstName: "Bruno",
    lastName: "Souza",
    profileImage: null,
    videoCount: 1,
  },
];

describe("VideoService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("listMembersWithVideos", () => {
    it("faz GET /videos/members e retorna lista de membros", async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockMembers },
      });

      const result = await VideoService.listMembersWithVideos();

      expect(api.get).toHaveBeenCalledWith("/videos/members");
      expect(result).toEqual(mockMembers);
    });

    it("retorna lista vazia quando não há membros com vídeos", async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: [] },
      });

      const result = await VideoService.listMembersWithVideos();

      expect(result).toEqual([]);
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("network error"));

      await expect(VideoService.listMembersWithVideos()).rejects.toThrow(
        "network error",
      );
    });

    it("extrai corretamente o campo data do envelope da resposta", async () => {
      const single = [mockMembers[0]];
      (api.get as jest.Mock).mockResolvedValue({
        data: { message: "ok", data: single },
      });

      const result = await VideoService.listMembersWithVideos();

      expect(result).toHaveLength(1);
      expect(result[0].memberId).toBe("m1");
      expect(result[0].videoCount).toBe(2);
    });
  });

  describe("listVideosByMember", () => {
    const mockVideos = [
      {
        _id: "v1",
        memberId: "m1",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoId: "dQw4w9WgXcQ",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      },
    ];

    it("faz GET /videos/{memberId} e retorna lista de vídeos", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { data: mockVideos } });

      const result = await VideoService.listVideosByMember("m1");

      expect(api.get).toHaveBeenCalledWith("/videos/m1");
      expect(result).toEqual(mockVideos);
    });

    it("retorna lista vazia quando membro não tem vídeos", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { data: [] } });

      const result = await VideoService.listVideosByMember("m1");

      expect(result).toEqual([]);
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("network error"));

      await expect(VideoService.listVideosByMember("m1")).rejects.toThrow(
        "network error",
      );
    });
  });

  describe("createVideo", () => {
    it("faz POST /videos com a URL informada", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { data: { _id: "v1", thumbnail: "thumb.jpg" } } });

      await VideoService.createVideo("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

      expect(api.post).toHaveBeenCalledWith("/videos", {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      });
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error("url inválida"));

      await expect(
        VideoService.createVideo("https://invalid.url"),
      ).rejects.toThrow("url inválida");
    });
  });
});
