import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTTSAudio } from "@/services/GoogleTTSService";

export type TTSState = "idle" | "loading" | "playing" | "paused";

export function useLiturgyTTS() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [state, setState] = useState<TTSState>("idle");
  const soundRef = useRef<Audio.Sound | null>(null);
  const tokenRef = useRef(0);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const unloadCurrent = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, []);

  const playSection = useCallback(
    async (id: string, text: string) => {
      if (activeId === id && state === "paused") {
        await soundRef.current?.playAsync();
        setState("playing");
        return;
      }

      const token = ++tokenRef.current;
      await unloadCurrent();
      setActiveId(id);
      setState("loading");

      try {
        const uri = await fetchTTSAudio(text);
        if (tokenRef.current !== token) return;

        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
        );
        if (tokenRef.current !== token) {
          sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        setState("playing");

        sound.setOnPlaybackStatusUpdate((status) => {
          if (tokenRef.current !== token) return;
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            setActiveId(null);
            setState("idle");
            sound.unloadAsync();
          }
        });
      } catch (err) {
        console.error("[TTS] error:", err);
        if (tokenRef.current !== token) return;
        setActiveId(null);
        setState("idle");
      }
    },
    [activeId, state, unloadCurrent],
  );

  const pause = useCallback(async () => {
    await soundRef.current?.pauseAsync();
    setState("paused");
  }, []);

  const stop = useCallback(async () => {
    tokenRef.current++;
    await unloadCurrent();
    setActiveId(null);
    setState("idle");
  }, [unloadCurrent]);

  return { activeId, state, playSection, pause, stop };
}
