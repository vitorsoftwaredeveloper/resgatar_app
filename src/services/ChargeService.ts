import { ICharge } from "@/types/Charge";
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
