import { IAnnualBalance } from "@/types/Balance";
import { api } from "./api";

// Service do balanço anual (admin-only no backend). Cruza arrecadação efetiva
// (entradas) com despesas (saídas) e devolve resultado e saldo acumulado por
// mês, year-to-date. Quando `year` é omitido o backend usa o ano corrente.
export const BalanceServices = {
  getAnnual: async (year: number): Promise<IAnnualBalance> => {
    try {
      const response = await api.get("/balance/annual", {
        params: { year },
      });
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Error fetching annual balance", error);
      throw error;
    }
  },
};
