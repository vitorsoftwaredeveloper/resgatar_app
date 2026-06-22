import { AxiosError } from "axios";

/**
 * Extrai a mensagem de erro retornada pela API (`response.data.message`).
 * Cai no fallback quando não há resposta ou mensagem (ex.: erro de rede).
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ message?: string }>;
  const apiMessage = axiosError?.response?.data?.message;

  return apiMessage && apiMessage.trim().length > 0 ? apiMessage : fallback;
}
