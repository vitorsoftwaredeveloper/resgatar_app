import { api } from "./api";
import { IVideoFeedItem } from "@/types/Video";

export const VideoService = {
  listAllVideos: async (): Promise<IVideoFeedItem[]> => {
    try {
      const response = await api.get("/videos");
      const { data } = response.data;
      return data;
    } catch (error) {
      console.error("Erro ao listar feed de vídeos", error);
      throw error;
    }
  },

  createVideo: async (url: string, title?: string): Promise<void> => {
    try {
      await api.post("/videos", { url, title });
    } catch (error) {
      console.error("Erro ao cadastrar vídeo", error);
      throw error;
    }
  },

  removeVideo: async (videoId: string): Promise<void> => {
    try {
      await api.delete(`/videos/${videoId}`);
    } catch (error) {
      console.error("Erro ao remover vídeo", error);
      throw error;
    }
  },
};
