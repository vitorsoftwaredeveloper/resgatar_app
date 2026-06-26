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
  // Sobe um comprovante para o S3 e retorna a `key` a ser persistida na
  // despesa. Fluxo em 2 passos (URL pré-assinada): pede a URL ao backend e
  // faz o PUT do binário direto no bucket — o arquivo NÃO passa pela API.
  uploadReceipt: async (uri: string, contentType: string): Promise<string> => {
    try {
      const { data } = (
        await api.get("/expenses/receipt-upload-url", {
          params: { contentType },
        })
      ).data;
      const { uploadUrl, key } = data as { uploadUrl: string; key: string };

      // `fetch` direto (sem o axios `api`): a URL já está assinada e não pode
      // levar o header Authorization, ou a assinatura do S3 é invalidada.
      const fileBlob = await (await fetch(uri)).blob();
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: fileBlob,
        // Precisa bater exatamente com o contentType usado para assinar a URL.
        headers: { "Content-Type": contentType },
      });

      if (!uploadResponse.ok) {
        throw new Error(`S3 upload failed with status ${uploadResponse.status}`);
      }

      return key;
    } catch (error) {
      console.error("Error uploading receipt", error);
      throw error;
    }
  },
  // Gera uma URL temporária (presigned GET, ~5 min) para visualizar o
  // comprovante de uma despesa.
  getReceiptViewUrl: async (expenseId: string): Promise<string> => {
    try {
      const { data } = (
        await api.get(`/expenses/${expenseId}/receipt`)
      ).data;

      return (data as { viewUrl: string }).viewUrl;
    } catch (error) {
      console.error("Error fetching receipt view URL", error);
      throw error;
    }
  },
};
