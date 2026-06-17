jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, useAppTheme } from "@/context/ThemeContext";

const mockedAsync = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

async function renderTheme() {
  mockedAsync.setItem.mockResolvedValue(undefined);
  const hook = renderHook(() => useAppTheme(), { wrapper });
  await act(async () => { await Promise.resolve(); });
  return hook;
}

describe("ThemeContext", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("estado inicial", () => {
    it("começa no modo light quando não há tema salvo", async () => {
      mockedAsync.getItem.mockResolvedValue(null);
      const { result } = await renderTheme();
      expect(result.current.mode).toBe("light");
    });

    it("retorna as cores do tema light por padrão", async () => {
      mockedAsync.getItem.mockResolvedValue(null);
      const { result } = await renderTheme();
      expect(result.current.colors.background).toBe("#F6F1EB");
      expect(result.current.colors.primary).toBe("#6B4F3A");
    });
  });

  describe("restauração do tema salvo", () => {
    it("restaura o modo dark quando AsyncStorage retorna 'dark'", async () => {
      mockedAsync.getItem.mockResolvedValue("dark");
      const { result } = await renderTheme();
      expect(result.current.mode).toBe("dark");
    });

    it("restaura o modo light quando AsyncStorage retorna 'light'", async () => {
      mockedAsync.getItem.mockResolvedValue("light");
      const { result } = await renderTheme();
      expect(result.current.mode).toBe("light");
    });

    it("ignora valor inválido no AsyncStorage e mantém light", async () => {
      mockedAsync.getItem.mockResolvedValue("invalid");
      const { result } = await renderTheme();
      expect(result.current.mode).toBe("light");
    });

    it("lê a chave correta do AsyncStorage", async () => {
      mockedAsync.getItem.mockResolvedValue(null);
      await renderTheme();
      expect(mockedAsync.getItem).toHaveBeenCalledWith("@resgatar:theme");
    });
  });

  describe("toggleTheme", () => {
    it("alterna de light para dark", async () => {
      mockedAsync.getItem.mockResolvedValue(null);
      const { result } = await renderTheme();

      act(() => { result.current.toggleTheme(); });

      expect(result.current.mode).toBe("dark");
    });

    it("alterna de dark para light", async () => {
      mockedAsync.getItem.mockResolvedValue("dark");
      const { result } = await renderTheme();

      act(() => { result.current.toggleTheme(); });

      expect(result.current.mode).toBe("light");
    });

    it("alterna duas vezes e volta ao modo original", async () => {
      mockedAsync.getItem.mockResolvedValue(null);
      const { result } = await renderTheme();

      act(() => { result.current.toggleTheme(); });
      act(() => { result.current.toggleTheme(); });

      expect(result.current.mode).toBe("light");
    });

    it("persiste o novo tema no AsyncStorage", async () => {
      mockedAsync.getItem.mockResolvedValue(null);
      const { result } = await renderTheme();

      act(() => { result.current.toggleTheme(); });

      expect(mockedAsync.setItem).toHaveBeenCalledWith("@resgatar:theme", "dark");
    });

    it("persiste 'light' ao voltar do dark", async () => {
      mockedAsync.getItem.mockResolvedValue("dark");
      const { result } = await renderTheme();

      act(() => { result.current.toggleTheme(); });

      expect(mockedAsync.setItem).toHaveBeenCalledWith("@resgatar:theme", "light");
    });
  });

  describe("cores por modo", () => {
    it("retorna cores do tema dark após toggle", async () => {
      mockedAsync.getItem.mockResolvedValue(null);
      const { result } = await renderTheme();

      act(() => { result.current.toggleTheme(); });

      expect(result.current.colors.background).toBe("#1A1812");
      expect(result.current.colors.primary).toBe("#C9A055");
    });

    it("retorna cores do tema light após dois toggles", async () => {
      mockedAsync.getItem.mockResolvedValue(null);
      const { result } = await renderTheme();

      act(() => { result.current.toggleTheme(); });
      act(() => { result.current.toggleTheme(); });

      expect(result.current.colors.background).toBe("#F6F1EB");
    });
  });
});
