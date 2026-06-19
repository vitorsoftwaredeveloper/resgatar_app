jest.mock("@/components/Toast", () => ({
  ToastMessage: { error: jest.fn() },
}));

import { renderHook, act } from "@testing-library/react-native";
import { useCepLookup } from "@/hooks/useCepLookup";
import { ToastMessage } from "@/components/Toast";

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockViaCep(data: object, ok = true) {
  mockFetch.mockResolvedValueOnce({
    ok,
    json: async () => data,
  });
}

describe("useCepLookup", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("estado inicial", () => {
    it("inicia com loading false", () => {
      const { result } = renderHook(() => useCepLookup());
      expect(result.current.loading).toBe(false);
    });
  });

  describe("fetchCep — validação de entrada", () => {
    it("retorna null para CEP com menos de 8 dígitos", async () => {
      const { result } = renderHook(() => useCepLookup());
      let response: any;
      await act(async () => {
        response = await result.current.fetchCep("1234");
      });
      expect(response).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("retorna null para CEP vazio", async () => {
      const { result } = renderHook(() => useCepLookup());
      let response: any;
      await act(async () => {
        response = await result.current.fetchCep("");
      });
      expect(response).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("aceita CEP formatado (com hífen)", async () => {
      mockViaCep({ logradouro: "Rua A", localidade: "SP", uf: "SP" });
      const { result } = renderHook(() => useCepLookup());
      let response: any;
      await act(async () => {
        response = await result.current.fetchCep("01310-100");
      });
      expect(response).not.toBeNull();
    });
  });

  describe("fetchCep — sucesso", () => {
    it("retorna street, city e state corretamente", async () => {
      mockViaCep({
        logradouro: "Avenida Paulista",
        localidade: "São Paulo",
        uf: "SP",
      });

      const { result } = renderHook(() => useCepLookup());
      let response: any;
      await act(async () => {
        response = await result.current.fetchCep("01310100");
      });

      expect(response).toEqual({
        street: "Avenida Paulista",
        city: "São Paulo",
        state: "SP",
      });
    });

    it("retorna strings vazias para campos ausentes na resposta", async () => {
      mockViaCep({
        logradouro: undefined,
        localidade: undefined,
        uf: undefined,
      });

      const { result } = renderHook(() => useCepLookup());
      let response: any;
      await act(async () => {
        response = await result.current.fetchCep("01310100");
      });

      expect(response).toEqual({ street: "", city: "", state: "" });
    });

    it("loading volta para false após sucesso", async () => {
      mockViaCep({ logradouro: "Rua A", localidade: "SP", uf: "SP" });

      const { result } = renderHook(() => useCepLookup());
      await act(async () => {
        await result.current.fetchCep("01310100");
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe("fetchCep — CEP não encontrado", () => {
    it("retorna null e exibe toast quando ViaCEP retorna erro", async () => {
      mockViaCep({ erro: true });

      const { result } = renderHook(() => useCepLookup());
      let response: any;
      await act(async () => {
        response = await result.current.fetchCep("99999999");
      });

      expect(response).toBeNull();
      expect(ToastMessage.error).toHaveBeenCalledWith(
        "CEP não encontrado",
        "Verifique o CEP informado.",
      );
    });

    it("loading volta para false quando CEP não encontrado", async () => {
      mockViaCep({ erro: true });

      const { result } = renderHook(() => useCepLookup());
      await act(async () => {
        await result.current.fetchCep("99999999");
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe("fetchCep — erro de rede", () => {
    it("retorna null e exibe toast quando fetch falha", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useCepLookup());
      let response: any;
      await act(async () => {
        response = await result.current.fetchCep("01310100");
      });

      expect(response).toBeNull();
      expect(ToastMessage.error).toHaveBeenCalledWith(
        "Erro",
        "Não foi possível consultar o CEP.",
      );
    });

    it("loading volta para false após erro de rede", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useCepLookup());
      await act(async () => {
        await result.current.fetchCep("01310100");
      });

      expect(result.current.loading).toBe(false);
    });
  });
});
