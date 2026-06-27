jest.mock("expo-speech", () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
}));

import { renderHook, act } from "@testing-library/react-native";
import { Platform } from "react-native";
import * as Speech from "expo-speech";
import { useLiturgyTTS } from "@/hooks/useLiturgyTTS";

const speak = Speech.speak as jest.Mock;
const stop = Speech.stop as jest.Mock;
const pause = Speech.pause as jest.Mock;
const resume = Speech.resume as jest.Mock;

// captura o objeto de opções passado ao último Speech.speak
function lastSpeakOptions(): any {
  return speak.mock.calls[speak.mock.calls.length - 1][1];
}

describe("useLiturgyTTS", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("estado inicial", () => {
    it("inicia em idle sem seção ativa", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      expect(result.current.state).toBe("idle");
      expect(result.current.activeId).toBeNull();
    });
  });

  describe("playSection", () => {
    it("marca a seção como ativa e em reprodução", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      act(() => result.current.playSection("evangelho", "Texto do evangelho"));
      expect(result.current.activeId).toBe("evangelho");
      expect(result.current.state).toBe("playing");
    });

    it("chama Speech.speak com idioma pt-BR e rate 0.9", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      act(() => result.current.playSection("evangelho", "Texto do evangelho"));
      expect(speak).toHaveBeenCalledWith(
        "Texto do evangelho",
        expect.objectContaining({ language: "pt-BR", rate: 0.9 }),
      );
    });

    it("para a reprodução anterior ao iniciar uma nova seção", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      act(() => result.current.playSection("primeira-leitura", "A"));
      act(() => result.current.playSection("evangelho", "B"));
      expect(stop).toHaveBeenCalled();
      expect(result.current.activeId).toBe("evangelho");
      expect(result.current.state).toBe("playing");
    });

    it("volta para idle ao concluir a leitura (onDone)", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      act(() => result.current.playSection("evangelho", "Texto"));
      act(() => lastSpeakOptions().onDone());
      expect(result.current.state).toBe("idle");
      expect(result.current.activeId).toBeNull();
    });

    it("volta para idle quando a fala é interrompida (onStopped)", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      act(() => result.current.playSection("evangelho", "Texto"));
      act(() => lastSpeakOptions().onStopped());
      expect(result.current.state).toBe("idle");
    });

    it("volta para idle em caso de erro (onError)", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      act(() => result.current.playSection("evangelho", "Texto"));
      act(() => lastSpeakOptions().onError());
      expect(result.current.state).toBe("idle");
    });

    it("ignora callback de fala antiga após trocar de seção", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      act(() => result.current.playSection("primeira-leitura", "A"));
      const staleOptions = lastSpeakOptions();
      act(() => result.current.playSection("evangelho", "B"));

      // o onStopped da fala antiga não deve zerar o estado da nova
      act(() => staleOptions.onStopped());
      expect(result.current.activeId).toBe("evangelho");
      expect(result.current.state).toBe("playing");
    });
  });

  describe("stop", () => {
    it("para a fala e volta para idle", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      act(() => result.current.playSection("evangelho", "Texto"));
      act(() => result.current.stop());
      expect(stop).toHaveBeenCalled();
      expect(result.current.state).toBe("idle");
      expect(result.current.activeId).toBeNull();
    });
  });

  describe("pause — Android (sem suporte a pause)", () => {
    // Platform.OS = "android" no mock de react-native
    it("para completamente o áudio em vez de pausar", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      act(() => result.current.playSection("evangelho", "Texto"));
      act(() => result.current.pause());
      expect(stop).toHaveBeenCalled();
      expect(pause).not.toHaveBeenCalled();
      expect(result.current.state).toBe("idle");
      expect(result.current.activeId).toBeNull();
    });
  });

  describe("pause/resume — iOS", () => {
    beforeAll(() => {
      Platform.OS = "ios";
    });

    afterAll(() => {
      Platform.OS = "android";
    });

    it("pausa de verdade e mantém a seção ativa", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      act(() => result.current.playSection("evangelho", "Texto"));
      act(() => result.current.pause());
      expect(pause).toHaveBeenCalled();
      expect(result.current.state).toBe("paused");
      expect(result.current.activeId).toBe("evangelho");
    });

    it("retoma a mesma seção com resume em vez de reiniciar", () => {
      const { result } = renderHook(() => useLiturgyTTS());
      act(() => result.current.playSection("evangelho", "Texto"));
      act(() => result.current.pause());
      speak.mockClear();
      act(() => result.current.playSection("evangelho", "Texto"));
      expect(resume).toHaveBeenCalled();
      expect(speak).not.toHaveBeenCalled();
      expect(result.current.state).toBe("playing");
    });
  });
});
