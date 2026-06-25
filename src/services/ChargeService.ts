import { ICharge, IChargeSummary, IGoalProgress } from "@/types/Charge";
import { api } from "./api";

export const ChargeServices = {
  createCharge: async (month: number): Promise<ICharge> => {
    try {
      const response = await api.post("/charges", {
        referenceMonth: month,
      });
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Error creating charge", error);
      throw error;
    }
  },
  // Ação exclusiva de admin: registra um pagamento em dinheiro de outro membro.
  // O backend valida que o caller é admin e grava paymentMethod "cash".
  registerCashPayment: async (
    memberId: string,
    referenceMonth: number,
  ): Promise<void> => {
    try {
      await api.post("/charges/cash", { memberId, referenceMonth });
    } catch (error) {
      console.error("Error registering cash payment", error);
      throw error;
    }
  },
  // Resumo agregado de arrecadação de um mês para o painel de admin.
  // month é 1-indexado (1 = janeiro), conforme o endpoint /charges/summary.
  getSummary: async (year: number, month: number): Promise<IChargeSummary> => {
    try {
      const response = await api.get("/charges/summary", {
        params: { year, month },
      });
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Error fetching charges summary", error);
      throw error;
    }
  },
  getGoalProgress: async (): Promise<IGoalProgress> => {
    try {
      const response = await api.get("/charges/goal-progress");
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Error fetching goal progress", error);
      throw error;
    }
  },
  consultCharge: async (transactionId: string) => {
    try {
      const response = await api.get(`/charges/${transactionId}`);
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Error consulting charge", error);
      throw error;
    }
  },
};
