import { api } from "./api";
import { IVideoMember, IVideoResponse } from "@/types/Video";

export const VideoService = {
  listMembersWithVideos: async (): Promise<IVideoMember[]> => {
    try {
      const response = await api.get("/videos/members");
      const { data } = response.data;
      return data;
    } catch (error) {
      console.error("Erro ao listar membros com vídeos", error);
      throw error;
    }
  },

  createVideo: async (url: string): Promise<void> => {
    try {
      await api.post("/videos", { url });
    } catch (error) {
      console.error("Erro ao cadastrar vídeo", error);
      throw error;
    }
  },

  listVideosByMember: async (memberId: string): Promise<IVideoResponse[]> => {
    try {
      const response = await api.get(`/videos/${memberId}`);
      const { data } = response.data;
      return data;
    } catch (error) {
      console.error("Erro ao listar vídeos do membro", error);
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
