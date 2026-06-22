jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
}));
jest.mock("@/components/Toast", () => ({
  ToastMessage: { error: jest.fn() },
}));

import { act, renderHook } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";
import { ToastMessage } from "@/components/Toast";
import { useImagePicker } from "@/hooks/useImagePicker";

const mockRequestLibrary =
  ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock;
const mockRequestCamera =
  ImagePicker.requestCameraPermissionsAsync as jest.Mock;
const mockLaunchLibrary = ImagePicker.launchImageLibraryAsync as jest.Mock;
const mockLaunchCamera = ImagePicker.launchCameraAsync as jest.Mock;

const granted = { granted: true };
const denied = { granted: false };

function assetResult(base64: string | undefined) {
  return { canceled: false, assets: [{ base64 }] };
}

describe("useImagePicker", () => {
  beforeEach(() => jest.clearAllMocks());

  it("inicia com loading false", () => {
    const { result } = renderHook(() => useImagePicker());
    expect(result.current.loading).toBe(false);
  });

  describe("pickFromLibrary", () => {
    it("retorna null e exibe toast quando permissão é negada", async () => {
      mockRequestLibrary.mockResolvedValueOnce(denied);
      const { result } = renderHook(() => useImagePicker());

      let value: string | null = "x";
      await act(async () => {
        value = await result.current.pickFromLibrary();
      });

      expect(value).toBeNull();
      expect(mockLaunchLibrary).not.toHaveBeenCalled();
      expect(ToastMessage.error).toHaveBeenCalledWith(
        "Permissão negada",
        expect.any(String),
      );
    });

    it("retorna o base64 quando a imagem é válida", async () => {
      mockRequestLibrary.mockResolvedValueOnce(granted);
      mockLaunchLibrary.mockResolvedValueOnce(assetResult("BASE64DATA"));
      const { result } = renderHook(() => useImagePicker());

      let value: string | null = null;
      await act(async () => {
        value = await result.current.pickFromLibrary();
      });

      expect(value).toBe("BASE64DATA");
    });

    it("retorna null quando o usuário cancela", async () => {
      mockRequestLibrary.mockResolvedValueOnce(granted);
      mockLaunchLibrary.mockResolvedValueOnce({ canceled: true });
      const { result } = renderHook(() => useImagePicker());

      let value: string | null = "x";
      await act(async () => {
        value = await result.current.pickFromLibrary();
      });

      expect(value).toBeNull();
    });

    it("retorna null quando não há base64 no asset", async () => {
      mockRequestLibrary.mockResolvedValueOnce(granted);
      mockLaunchLibrary.mockResolvedValueOnce(assetResult(undefined));
      const { result } = renderHook(() => useImagePicker());

      let value: string | null = "x";
      await act(async () => {
        value = await result.current.pickFromLibrary();
      });

      expect(value).toBeNull();
    });

    it("rejeita imagem acima do limite de tamanho e exibe toast", async () => {
      mockRequestLibrary.mockResolvedValueOnce(granted);
      const huge = "a".repeat(700_001);
      mockLaunchLibrary.mockResolvedValueOnce(assetResult(huge));
      const { result } = renderHook(() => useImagePicker());

      let value: string | null = "x";
      await act(async () => {
        value = await result.current.pickFromLibrary();
      });

      expect(value).toBeNull();
      expect(ToastMessage.error).toHaveBeenCalledWith(
        "Imagem muito grande",
        expect.any(String),
      );
    });

    it("retorna null e exibe toast quando o picker lança erro", async () => {
      mockRequestLibrary.mockResolvedValueOnce(granted);
      mockLaunchLibrary.mockRejectedValueOnce(new Error("falha"));
      const { result } = renderHook(() => useImagePicker());

      let value: string | null = "x";
      await act(async () => {
        value = await result.current.pickFromLibrary();
      });

      expect(value).toBeNull();
      expect(ToastMessage.error).toHaveBeenCalledWith(
        "Erro",
        expect.any(String),
      );
    });

    it("loading volta para false após a operação", async () => {
      mockRequestLibrary.mockResolvedValueOnce(granted);
      mockLaunchLibrary.mockResolvedValueOnce(assetResult("X"));
      const { result } = renderHook(() => useImagePicker());

      await act(async () => {
        await result.current.pickFromLibrary();
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe("takePhoto", () => {
    it("retorna null e exibe toast quando permissão da câmera é negada", async () => {
      mockRequestCamera.mockResolvedValueOnce(denied);
      const { result } = renderHook(() => useImagePicker());

      let value: string | null = "x";
      await act(async () => {
        value = await result.current.takePhoto();
      });

      expect(value).toBeNull();
      expect(mockLaunchCamera).not.toHaveBeenCalled();
      expect(ToastMessage.error).toHaveBeenCalledWith(
        "Permissão negada",
        expect.any(String),
      );
    });

    it("retorna o base64 da foto tirada", async () => {
      mockRequestCamera.mockResolvedValueOnce(granted);
      mockLaunchCamera.mockResolvedValueOnce(assetResult("FOTOCAM"));
      const { result } = renderHook(() => useImagePicker());

      let value: string | null = null;
      await act(async () => {
        value = await result.current.takePhoto();
      });

      expect(value).toBe("FOTOCAM");
    });

    it("retorna null e exibe toast quando a câmera lança erro", async () => {
      mockRequestCamera.mockResolvedValueOnce(granted);
      mockLaunchCamera.mockRejectedValueOnce(new Error("falha"));
      const { result } = renderHook(() => useImagePicker());

      let value: string | null = "x";
      await act(async () => {
        value = await result.current.takePhoto();
      });

      expect(value).toBeNull();
      expect(ToastMessage.error).toHaveBeenCalledWith(
        "Erro",
        expect.any(String),
      );
    });
  });
});
