import { api } from "@/services/api";
import { ICommitment, ICommitmentInput } from "@/types/Commitment";

// Quadro de Avisos — compromissos da comunidade. A ordem é curada pelo admin
// e o backend a persiste (campo `order`); a listagem já vem ordenada.
// Endpoints em resgatar_community: handlers/commitments.
export const CommitmentService = {
  // Qualquer membro autenticado lê o mural, na ordem definida.
  async list(): Promise<ICommitment[]> {
    try {
      const response = await api.get("/commitments");
      return response.data.data ?? [];
    } catch (error) {
      console.error("Erro ao listar compromissos", error);
      throw error;
    }
  },

  // Admin: cria um compromisso (entra no fim do mural; reposiciona via saveOrder).
  async create(input: ICommitmentInput): Promise<ICommitment> {
    try {
      const response = await api.post("/commitments", input);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar compromisso", error);
      throw error;
    }
  },

  // Admin: edita os dados de um compromisso existente (a ordem não muda aqui).
  async update(id: string, input: ICommitmentInput): Promise<ICommitment> {
    try {
      const response = await api.put(`/commitments/${id}`, input);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao editar compromisso", error);
      throw error;
    }
  },

  // Admin: persiste a sequência inteira. A posição de cada id no array vira a
  // nova ordem; o backend exige que os ids cubram exatamente os existentes.
  async saveOrder(items: ICommitment[]): Promise<void> {
    try {
      await api.put("/commitments/order", { ids: items.map((item) => item.id) });
    } catch (error) {
      console.error("Erro ao reordenar compromissos", error);
      throw error;
    }
  },

  // Admin: remove um compromisso do mural.
  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/commitments/${id}`);
    } catch (error) {
      console.error("Erro ao remover compromisso", error);
      throw error;
    }
  },
};
