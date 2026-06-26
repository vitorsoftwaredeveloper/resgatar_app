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
import { useReceiptPicker } from "@/hooks/useReceiptPicker";

const mockRequestLibrary =
  ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock;
const mockRequestCamera =
  ImagePicker.requestCameraPermissionsAsync as jest.Mock;
const mockLaunchLibrary = ImagePicker.launchImageLibraryAsync as jest.Mock;
const mockLaunchCamera = ImagePicker.launchCameraAsync as jest.Mock;

const granted = { granted: true };
const denied = { granted: false };

function assetResult(overrides: object = {}) {
  return {
    canceled: false,
    assets: [
      {
        uri: "file:///tmp/recibo.jpg",
        mimeType: "image/jpeg",
        fileName: "recibo.jpg",
        fileSize: 200_000,
        ...overrides,
      },
    ],
  };
}

describe("useReceiptPicker", () => {
  beforeEach(() => jest.clearAllMocks());

  it("inicia com loading false", () => {
    const { result } = renderHook(() => useReceiptPicker());
    expect(result.current.loading).toBe(false);
  });

  describe("pickFromLibrary", () => {
    it("retorna null e exibe toast quando permissão é negada", async () => {
      mockRequestLibrary.mockResolvedValueOnce(denied);
      const { result } = renderHook(() => useReceiptPicker());

      let value: any = "x";
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

    it("retorna o asset quando a imagem é válida", async () => {
      mockRequestLibrary.mockResolvedValueOnce(granted);
      mockLaunchLibrary.mockResolvedValueOnce(assetResult());
      const { result } = renderHook(() => useReceiptPicker());

      let value: any = null;
      await act(async () => {
        value = await result.current.pickFromLibrary();
      });

      expect(value).toMatchObject({
        uri: "file:///tmp/recibo.jpg",
        contentType: "image/jpeg",
        fileName: "recibo.jpg",
      });
    });

    it("retorna null quando o usuário cancela", async () => {
      mockRequestLibrary.mockResolvedValueOnce(granted);
      mockLaunchLibrary.mockResolvedValueOnce({ canceled: true });
      const { result } = renderHook(() => useReceiptPicker());

      let value: any = "x";
      await act(async () => {
        value = await result.current.pickFromLibrary();
      });

      expect(value).toBeNull();
    });

    it("assume image/jpeg quando mimeType não está nos tipos permitidos", async () => {
      mockRequestLibrary.mockResolvedValueOnce(granted);
      mockLaunchLibrary.mockResolvedValueOnce(
        assetResult({ mimeType: "image/heic" }),
      );
      const { result } = renderHook(() => useReceiptPicker());

      let value: any = null;
      await act(async () => {
        value = await result.current.pickFromLibrary();
      });

      expect(value?.contentType).toBe("image/jpeg");
    });

    it("rejeita arquivo acima de 5 MB e exibe toast", async () => {
      mockRequestLibrary.mockResolvedValueOnce(granted);
      mockLaunchLibrary.mockResolvedValueOnce(
        assetResult({ fileSize: 6 * 1024 * 1024 }),
      );
      const { result } = renderHook(() => useReceiptPicker());

      let value: any = "x";
      await act(async () => {
        value = await result.current.pickFromLibrary();
      });

      expect(value).toBeNull();
      expect(ToastMessage.error).toHaveBeenCalledWith(
        "Arquivo muito grande",
        expect.any(String),
      );
    });

    it("retorna null e exibe toast quando o picker lança erro", async () => {
      mockRequestLibrary.mockResolvedValueOnce(granted);
      mockLaunchLibrary.mockRejectedValueOnce(new Error("falha"));
      const { result } = renderHook(() => useReceiptPicker());

      let value: any = "x";
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
      mockLaunchLibrary.mockResolvedValueOnce(assetResult());
      const { result } = renderHook(() => useReceiptPicker());

      await act(async () => {
        await result.current.pickFromLibrary();
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe("takePhoto", () => {
    it("retorna null e exibe toast quando permissão da câmera é negada", async () => {
      mockRequestCamera.mockResolvedValueOnce(denied);
      const { result } = renderHook(() => useReceiptPicker());

      let value: any = "x";
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

    it("retorna o asset da foto tirada", async () => {
      mockRequestCamera.mockResolvedValueOnce(granted);
      mockLaunchCamera.mockResolvedValueOnce(
        assetResult({ uri: "file:///tmp/cam.jpg" }),
      );
      const { result } = renderHook(() => useReceiptPicker());

      let value: any = null;
      await act(async () => {
        value = await result.current.takePhoto();
      });

      expect(value).toMatchObject({ uri: "file:///tmp/cam.jpg" });
    });

    it("usa fileName fallback quando asset não tem fileName", async () => {
      mockRequestCamera.mockResolvedValueOnce(granted);
      mockLaunchCamera.mockResolvedValueOnce(
        assetResult({ fileName: undefined }),
      );
      const { result } = renderHook(() => useReceiptPicker());

      let value: any = null;
      await act(async () => {
        value = await result.current.takePhoto();
      });

      expect(value?.fileName).toBe("comprovante");
    });

    it("retorna null e exibe toast quando a câmera lança erro", async () => {
      mockRequestCamera.mockResolvedValueOnce(granted);
      mockLaunchCamera.mockRejectedValueOnce(new Error("falha câmera"));
      const { result } = renderHook(() => useReceiptPicker());

      let value: any = "x";
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
