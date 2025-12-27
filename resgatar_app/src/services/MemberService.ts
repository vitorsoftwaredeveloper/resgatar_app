import { api } from "./api";
import { IMember, IMemberWithContribution } from "@/types/Member";

export const MemberServices = {
  getMember: async (): Promise<IMemberWithContribution> => {
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
  createMember: async (
    member: IMember & { password: string; tokenPushNotification: string }
  ) => {
    try {
      const response = await api.post("/createMember", member);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar membro", error);
      throw error;
    }
  },
};
