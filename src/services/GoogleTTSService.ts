import * as FileSystem from "expo-file-system/legacy";
import { api } from "@/services/api";

export async function fetchTTSAudio(text: string): Promise<string> {
  const { data } = await api.post<{ audioContent: string }>("/tts", { text });

  const path = `${FileSystem.cacheDirectory}tts_${Date.now()}.mp3`;
  await FileSystem.writeAsStringAsync(path, data.audioContent, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return path;
}
