jest.mock("@/services/GoogleTTSService", () => ({
  fetchTTSAudio: jest.fn().mockResolvedValue("file:///cache/tts_123.mp3"),
}));

jest.mock("expo-av", () => {
  const playbackCallback: { fn: ((status: any) => void) | null } = { fn: null };

  const sound = {
    playAsync: jest.fn().mockResolvedValue(undefined),
    pauseAsync: jest.fn().mockResolvedValue(undefined),
    unloadAsync: jest.fn().mockResolvedValue(undefined),
    setOnPlaybackStatusUpdate: jest.fn((cb) => {
      playbackCallback.fn = cb;
    }),
    _simulateFinish: () => {
      playbackCallback.fn?.({ isLoaded: true, didJustFinish: true });
    },
  };

  return {
    Audio: {
      setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
      Sound: {
        createAsync: jest.fn().mockResolvedValue({ sound }),
        _sound: sound,
      },
      _playbackCallback: playbackCallback,
    },
  };
});

import { renderHook, act } from "@testing-library/react-native";
import { Audio } from "expo-av";
import { useLiturgyTTS } from "@/hooks/useLiturgyTTS";
import { fetchTTSAudio } from "@/services/GoogleTTSService";

const mockFetch = fetchTTSAudio as jest.Mock;
const mockCreateAsync = Audio.Sound.createAsync as jest.Mock;
const mockSound = (Audio.Sound as any)._sound;

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
    it("entra em loading ao iniciar e depois em playing", async () => {
      const { result } = renderHook(() => useLiturgyTTS());

      await act(async () => {
        await result.current.playSection("evangelho", "Texto do evangelho");
      });

      expect(result.current.activeId).toBe("evangelho");
      expect(result.current.state).toBe("playing");
    });

    it("chama fetchTTSAudio com o texto da seção", async () => {
      const { result } = renderHook(() => useLiturgyTTS());

      await act(async () => {
        await result.current.playSection("evangelho", "Texto do evangelho");
      });

      expect(mockFetch).toHaveBeenCalledWith("Texto do evangelho");
    });

    it("cria e toca o som com o uri retornado", async () => {
      const { result } = renderHook(() => useLiturgyTTS());

      await act(async () => {
        await result.current.playSection("evangelho", "Texto");
      });

      expect(mockCreateAsync).toHaveBeenCalledWith(
        { uri: "file:///cache/tts_123.mp3" },
        { shouldPlay: true },
      );
    });

    it("volta para idle ao concluir a reprodução", async () => {
      const { result } = renderHook(() => useLiturgyTTS());

      await act(async () => {
        await result.current.playSection("evangelho", "Texto");
      });

      act(() => {
        (Audio as any)._playbackCallback.fn?.({ isLoaded: true, didJustFinish: true });
      });

      expect(result.current.state).toBe("idle");
      expect(result.current.activeId).toBeNull();
    });

    it("vai para idle se fetchTTSAudio falhar", async () => {
      mockFetch.mockRejectedValueOnce(new Error("network error"));
      const { result } = renderHook(() => useLiturgyTTS());

      await act(async () => {
        await result.current.playSection("evangelho", "Texto");
      });

      expect(result.current.state).toBe("idle");
      expect(result.current.activeId).toBeNull();
    });

    it("retoma o áudio pausado sem chamar fetchTTSAudio novamente", async () => {
      const { result } = renderHook(() => useLiturgyTTS());

      await act(async () => {
        await result.current.playSection("evangelho", "Texto");
      });
      await act(async () => {
        await result.current.pause();
      });

      mockFetch.mockClear();

      await act(async () => {
        await result.current.playSection("evangelho", "Texto");
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockSound.playAsync).toHaveBeenCalled();
      expect(result.current.state).toBe("playing");
    });
  });

  describe("pause", () => {
    it("pausa o áudio e muda para paused", async () => {
      const { result } = renderHook(() => useLiturgyTTS());

      await act(async () => {
        await result.current.playSection("evangelho", "Texto");
      });
      await act(async () => {
        await result.current.pause();
      });

      expect(mockSound.pauseAsync).toHaveBeenCalled();
      expect(result.current.state).toBe("paused");
      expect(result.current.activeId).toBe("evangelho");
    });
  });

  describe("stop", () => {
    it("descarrega o som e volta para idle", async () => {
      const { result } = renderHook(() => useLiturgyTTS());

      await act(async () => {
        await result.current.playSection("evangelho", "Texto");
      });
      await act(async () => {
        await result.current.stop();
      });

      expect(mockSound.unloadAsync).toHaveBeenCalled();
      expect(result.current.state).toBe("idle");
      expect(result.current.activeId).toBeNull();
    });
  });
});
