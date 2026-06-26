import { ToastMessage } from "@/components/Toast";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

// Comprovante escolhido, ainda local (não enviado). `contentType` é um dos
// tipos aceitos pelo backend para assinar a URL de upload no S3.
export interface ReceiptAsset {
  uri: string;
  contentType: string;
  fileName: string;
}

interface UseReceiptPickerResult {
  loading: boolean;
  /** Abre a galeria e retorna o comprovante escolhido. */
  pickFromLibrary: () => Promise<ReceiptAsset | null>;
  /** Abre a câmera e retorna a foto do comprovante. */
  takePhoto: () => Promise<ReceiptAsset | null>;
}

// Comprovante não é foto de perfil: sem crop quadrado e sem base64 (o binário
// vai direto pro S3). Mantemos uma qualidade boa o suficiente para ler o
// recibo sem inflar o arquivo.
const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: false,
  quality: 0.6,
};

// Tipos de imagem que o backend aceita assinar (espelha ALLOWED_RECEIPT_
// CONTENT_TYPES no community, menos application/pdf — o picker só pega imagem).
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Limite defensivo (~5 MB) para não subir arquivos absurdos. Em quality 0.6
// uma foto de recibo fica bem abaixo disso.
const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;

function toReceiptAsset(
  result: ImagePicker.ImagePickerResult,
): ReceiptAsset | null {
  if (result.canceled) return null;

  const asset = result.assets?.[0];
  if (!asset?.uri) return null;

  if (asset.fileSize && asset.fileSize > MAX_RECEIPT_BYTES) {
    ToastMessage.error(
      "Arquivo muito grande",
      "Escolha um comprovante de até 5 MB.",
    );
    return null;
  }

  // Normaliza o contentType: usa o do asset quando suportado, senão assume JPEG
  // (formato mais comum de câmera/galeria).
  const contentType =
    asset.mimeType && ALLOWED_IMAGE_TYPES.includes(asset.mimeType)
      ? asset.mimeType
      : "image/jpeg";

  return {
    uri: asset.uri,
    contentType,
    fileName: asset.fileName ?? "comprovante",
  };
}

export function useReceiptPicker(): UseReceiptPickerResult {
  const [loading, setLoading] = useState(false);

  async function pickFromLibrary(): Promise<ReceiptAsset | null> {
    setLoading(true);
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        ToastMessage.error(
          "Permissão negada",
          "Autorize o acesso à galeria para escolher o comprovante.",
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
      return toReceiptAsset(result);
    } catch {
      ToastMessage.error("Erro", "Não foi possível selecionar o comprovante.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function takePhoto(): Promise<ReceiptAsset | null> {
    setLoading(true);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        ToastMessage.error(
          "Permissão negada",
          "Autorize o acesso à câmera para fotografar o comprovante.",
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
      return toReceiptAsset(result);
    } catch {
      ToastMessage.error("Erro", "Não foi possível abrir a câmera.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, pickFromLibrary, takePhoto };
}
