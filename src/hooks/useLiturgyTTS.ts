import * as Speech from "expo-speech";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

export type TTSState = "idle" | "playing" | "paused";

// Speech.pause/resume only work on iOS. On Android we stop instead.
const supportsPause = () => Platform.OS === "ios";

export function useLiturgyTTS() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [state, setState] = useState<TTSState>("idle");
  // each spoken utterance gets a token; stale callbacks (from a stopped or
  // replaced utterance) are ignored so they don't reset the current state.
  const tokenRef = useRef(0);
  // pausing must not be treated as "finished"
  const pausedRef = useRef(false);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const playSection = useCallback(
    (id: string, text: string) => {
      // resume a paused section (iOS only)
      if (activeId === id && state === "paused" && supportsPause()) {
        pausedRef.current = false;
        Speech.resume();
        setState("playing");
        return;
      }

      // starting a (new) section — invalidate previous utterance callbacks
      const token = ++tokenRef.current;
      pausedRef.current = false;
      Speech.stop();

      setActiveId(id);
      setState("playing");

      const finish = () => {
        if (tokenRef.current !== token || pausedRef.current) return;
        setActiveId(null);
        setState("idle");
      };

      Speech.speak(text, {
        language: "pt-BR",
        rate: 0.9,
        onDone: finish,
        onStopped: finish,
        onError: finish,
      });
    },
    [activeId, state],
  );

  const pause = useCallback(() => {
    if (supportsPause()) {
      pausedRef.current = true;
      Speech.pause();
      setState("paused");
    } else {
      // Android: no pause support, so stop completely
      tokenRef.current++;
      Speech.stop();
      setActiveId(null);
      setState("idle");
    }
  }, []);

  const stop = useCallback(() => {
    tokenRef.current++;
    Speech.stop();
    setActiveId(null);
    setState("idle");
  }, []);

  return { activeId, state, playSection, pause, stop };
}
