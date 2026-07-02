import * as FileSystem from "expo-file-system/legacy";
import { GOOGLE_TTS_API_KEY } from "@env";

function stripVerseNumbers(text: string): string {
  return text
    .replace(/\s*\d+\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function fetchTTSAudio(text: string): Promise<string> {
  const clean = stripVerseNumbers(text);

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: clean },
        voice: {
          languageCode: "pt-BR",
          name: "pt-BR-Neural2-B",
        },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: 0.9,
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google TTS error: ${response.status} ${body}`);
  }

  const { audioContent } = await response.json();

  const path = `${FileSystem.cacheDirectory}tts_${Date.now()}.mp3`;
  await FileSystem.writeAsStringAsync(path, audioContent, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return path;
}
