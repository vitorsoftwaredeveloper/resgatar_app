import {
  ICreateExpensePayload,
  IEditExpensePayload,
  IExpense,
  IExpensesSummary,
} from "@/types/Expense";
import { api } from "./api";

// Service de despesas mensais (admin-only no backend), espelhando
// `ChargeServices`. Atenção: os endpoints de despesa usam `month` 0-indexado
// (0 = janeiro) — passe `Date.getMonth()` direto, SEM `month + 1`.
export const ExpenseServices = {
  // Cadastra uma despesa. Retorna o _id criado.
  create: async (payload: ICreateExpensePayload): Promise<string> => {
    try {
      const response = await api.post("/expenses", payload);
      const { data } = response.data;

      return data._id;
    } catch (error) {
      console.error("Error creating expense", error);
      throw error;
    }
  },
  // Lista as despesas de um mês. `month` é 0–11.
  list: async (year: number, month: number): Promise<IExpense[]> => {
    try {
      const response = await api.get("/expenses", {
        params: { year, month },
      });
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Error listing expenses", error);
      throw error;
    }
  },
  // Resumo agregado do mês (total + breakdown por categoria). `month` é 0–11.
  getSummary: async (
    year: number,
    month: number,
  ): Promise<IExpensesSummary> => {
    try {
      const response = await api.get("/expenses/summary", {
        params: { year, month },
      });
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Error fetching expenses summary", error);
      throw error;
    }
  },
  // Edita uma despesa existente.
  update: async (
    expenseId: string,
    payload: IEditExpensePayload,
  ): Promise<void> => {
    try {
      await api.put(`/expenses/${expenseId}`, payload);
    } catch (error) {
      console.error("Error updating expense", error);
      throw error;
    }
  },
  // Remove uma despesa.
  remove: async (expenseId: string): Promise<void> => {
    try {
      await api.delete(`/expenses/${expenseId}`);
    } catch (error) {
      console.error("Error removing expense", error);
      throw error;
    }
  },
};
