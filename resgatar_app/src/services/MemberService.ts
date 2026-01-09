import { updatePassword } from "aws-amplify/auth";
import { api } from "./api";
import { IMember, IMemberWithContribution } from "@/types/Member";

export const MemberServices = {
  getMember: async (): Promise<IMemberWithContribution> => {
    try {
      const response = await api.get("/members");
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Erro ao obter membros", error);
      throw error;
    }
  },
  editMember: async (member: IMember) => {
    try {
      const response = await api.put(`/members/${member._id}`, member);
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Erro ao editar membro", error);
      throw error;
    }
  },
  createMember: async (member: Omit<IMember, "_id"> & { password: string }) => {
    try {
      const response = await api.post("/members", member);
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Erro ao criar membro", error);
      throw error;
    }
  },
  listMembers: async () => {
    try {
      const response = await api.get("/members/list");
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Erro ao listar membros", error);
      throw error;
    }
  },
  removeMember: async (memberId: string) => {
    try {
      const response = await api.delete(`/members/${memberId}`);
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Erro ao remover membro", error);
      throw error;
    }
  },
  updatePassword: async (password: string) => {
    try {
      const response = await api.put(`/members/password`, { password });
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Erro ao remover membro", error);
      throw error;
    }
  },
};
