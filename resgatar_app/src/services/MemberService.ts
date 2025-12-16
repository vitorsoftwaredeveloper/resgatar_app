import { api } from "./api";
import { IMember } from "@/types/Member";

export const MemberServices = {
  getMember: async (): Promise<IMember> => {
    try {
      const response = await api.get("/member");
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Erro ao obter membros", error);
      throw error;
    }
  },
};
