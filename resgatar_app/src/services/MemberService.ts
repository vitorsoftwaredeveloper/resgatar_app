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
  editMember: async (member: IMember) => {
    try {
      const response = await api.put("/member", member);
      return response.data;
    } catch (error) {
      console.error("Erro ao editar membro", error);
      throw error;
    }
  },
};
