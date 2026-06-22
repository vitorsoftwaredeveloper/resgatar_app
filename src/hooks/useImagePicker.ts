import { ToastMessage } from "@/components/Toast";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

interface UseImagePickerResult {
  loading: boolean;
  /** Abre a galeria e retorna o base64 (sem prefixo) da imagem escolhida. */
  pickFromLibrary: () => Promise<string | null>;
  /** Abre a câmera e retorna o base64 (sem prefixo) da foto tirada. */
  takePhoto: () => Promise<string | null>;
}

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.5,
  base64: true,
};

// Espelha MAX_PROFILE_IMAGE_LENGTH da API: ~700.000 chars de base64 ≈ 500 KB
// de imagem. Validar aqui evita um round-trip que o backend recusaria.
const MAX_BASE64_LENGTH = 700_000;

function extractBase64(
  result: ImagePicker.ImagePickerResult,
): string | null {
  if (result.canceled) return null;

  const base64 = result.assets?.[0]?.base64 ?? null;
  if (!base64) return null;

  if (base64.length > MAX_BASE64_LENGTH) {
    ToastMessage.error(
      "Imagem muito grande",
      "Escolha uma foto menor (até ~500 KB).",
    );
    return null;
  }

  return base64;
}

export function useImagePicker(): UseImagePickerResult {
  const [loading, setLoading] = useState(false);

  async function pickFromLibrary(): Promise<string | null> {
    setLoading(true);
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        ToastMessage.error(
          "Permissão negada",
          "Autorize o acesso à galeria para escolher uma foto.",
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
      return extractBase64(result);
    } catch {
      ToastMessage.error("Erro", "Não foi possível selecionar a imagem.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function takePhoto(): Promise<string | null> {
    setLoading(true);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        ToastMessage.error(
          "Permissão negada",
          "Autorize o acesso à câmera para tirar uma foto.",
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
      return extractBase64(result);
    } catch {
      ToastMessage.error("Erro", "Não foi possível abrir a câmera.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, pickFromLibrary, takePhoto };
}
