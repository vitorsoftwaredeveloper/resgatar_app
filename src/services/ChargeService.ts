import {
  IAnnualSummary,
  ICharge,
  IChargeSummary,
  IGoalProgress,
} from "@/types/Charge";
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
  // `value` é opcional, no formato "xx,xx"; quando omitido o backend usa o
  // valor de contribuição do onboarding (member.paymentInfo.amount).
  registerCashPayment: async (
    memberId: string,
    referenceMonth: number,
    value?: string,
  ): Promise<void> => {
    try {
      await api.post("/charges/cash", { memberId, referenceMonth, value });
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
  // Balanço anual (YTD) para o painel de admin. Quando `year` é omitido o
  // backend usa o ano corrente. O endpoint valida que o caller é admin.
  getAnnualSummary: async (year: number): Promise<IAnnualSummary> => {
    try {
      const response = await api.get("/charges/annual-summary", {
        params: { year },
      });
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Error fetching annual charges summary", error);
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
