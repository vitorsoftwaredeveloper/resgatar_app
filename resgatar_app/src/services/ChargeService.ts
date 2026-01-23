import { ICharge } from "@/types/Charge";
import { api } from "./api";

export const ChargeServices = {
  createCharge: async (value: number, month: number): Promise<ICharge> => {
    try {
      const response = await api.post("/charges", {
        transactionAmount: value,
        referenceMonth: month,
      });
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Error creating charge", error);
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
