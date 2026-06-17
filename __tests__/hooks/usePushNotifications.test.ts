const mockOnMessage = jest.fn(() => jest.fn());
const mockSubscribeToTopic = jest.fn();
const mockUnsubscribeFromTopic = jest.fn();

jest.mock("@react-native-firebase/messaging", () => () => ({
  onMessage: mockOnMessage,
  subscribeToTopic: mockSubscribeToTopic,
  unsubscribeFromTopic: mockUnsubscribeFromTopic,
}));

const mockGetPermissionsAsync = jest.fn();
const mockRequestPermissionsAsync = jest.fn();
const mockSetNotificationChannelAsync = jest.fn();
const mockGetDevicePushTokenAsync = jest.fn();
const mockScheduleNotificationAsync = jest.fn();

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: mockGetPermissionsAsync,
  requestPermissionsAsync: mockRequestPermissionsAsync,
  setNotificationChannelAsync: mockSetNotificationChannelAsync,
  getDevicePushTokenAsync: mockGetDevicePushTokenAsync,
  scheduleNotificationAsync: mockScheduleNotificationAsync,
  AndroidImportance: { HIGH: 4 },
}));

jest.mock("@/services/NotificationService", () => ({
  NotificationServices: { registerFCMToken: jest.fn() },
}));

jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  OS: "android",
  select: jest.fn(),
}));

import { renderHook, act } from "@testing-library/react-hooks";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { NotificationServices } from "@/services/NotificationService";

function grantedPermission() {
  mockGetPermissionsAsync.mockResolvedValue({ status: "granted" });
  mockGetDevicePushTokenAsync.mockResolvedValue({ data: "fcm-token-abc" });
}

function deniedPermission() {
  mockGetPermissionsAsync.mockResolvedValue({ status: "denied" });
  mockRequestPermissionsAsync.mockResolvedValue({ status: "denied" });
}

describe("usePushNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnMessage.mockReturnValue(jest.fn());
  });

  describe("quando não está logado", () => {
    it("não registra permissões nem mensagens", async () => {
      await act(async () => {
        renderHook(() => usePushNotifications(false));
      });

      expect(mockGetPermissionsAsync).not.toHaveBeenCalled();
      expect(mockOnMessage).not.toHaveBeenCalled();
    });
  });

  describe("quando está logado e permissão concedida", () => {
    it("registra o listener de mensagens FCM", async () => {
      grantedPermission();

      await act(async () => {
        renderHook(() => usePushNotifications(true));
      });

      expect(mockOnMessage).toHaveBeenCalledTimes(1);
    });

    it("registra o FCM token no backend", async () => {
      grantedPermission();

      await act(async () => {
        renderHook(() => usePushNotifications(true));
      });

      await act(async () => {});

      expect(NotificationServices.registerFCMToken).toHaveBeenCalledWith("fcm-token-abc");
    });

    it("subscreve ao tópico FCM", async () => {
      grantedPermission();

      await act(async () => {
        renderHook(() => usePushNotifications(true));
      });

      await act(async () => {});

      expect(mockSubscribeToTopic).toHaveBeenCalledWith("todos_usuarios");
    });

    it("registra canal de notificação no Android", async () => {
      grantedPermission();

      await act(async () => {
        renderHook(() => usePushNotifications(true));
      });

      await act(async () => {});

      expect(mockSetNotificationChannelAsync).toHaveBeenCalledWith(
        "default",
        expect.objectContaining({ name: "Notificações" }),
      );
    });
  });

  describe("quando permissão negada", () => {
    it("não registra o FCM token", async () => {
      deniedPermission();

      await act(async () => {
        renderHook(() => usePushNotifications(true));
      });

      await act(async () => {});

      expect(NotificationServices.registerFCMToken).not.toHaveBeenCalled();
    });

    it("solicita permissão quando status inicial não é granted", async () => {
      mockGetPermissionsAsync.mockResolvedValue({ status: "undetermined" });
      mockRequestPermissionsAsync.mockResolvedValue({ status: "denied" });

      await act(async () => {
        renderHook(() => usePushNotifications(true));
      });

      await act(async () => {});

      expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe("quando registerForPushNotifications lança exceção", () => {
    it("não propaga o erro e não registra o token", async () => {
      mockGetPermissionsAsync.mockRejectedValue(new Error("falha inesperada"));

      await act(async () => {
        renderHook(() => usePushNotifications(true));
      });

      await act(async () => {});

      expect(NotificationServices.registerFCMToken).not.toHaveBeenCalled();
    });
  });

  describe("ao receber mensagem FCM em foreground", () => {
    it("agenda notificação local com título e corpo da mensagem", async () => {
      grantedPermission();

      let capturedCallback: ((msg: any) => Promise<void>) | null = null;
      (mockOnMessage as jest.Mock).mockImplementation((cb) => {
        capturedCallback = cb;
        return jest.fn();
      });

      await act(async () => {
        renderHook(() => usePushNotifications(true));
      });

      await act(async () => {
        await capturedCallback!({
          notification: { title: "Novo aviso", body: "Reunião às 19h" },
        });
      });

      expect(mockScheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: "Novo aviso",
          body: "Reunião às 19h",
          sound: "default",
        },
        trigger: null,
      });
    });

    it("usa string vazia quando title ou body estão ausentes", async () => {
      grantedPermission();

      let capturedCallback: ((msg: any) => Promise<void>) | null = null;
      (mockOnMessage as jest.Mock).mockImplementation((cb) => {
        capturedCallback = cb;
        return jest.fn();
      });

      await act(async () => {
        renderHook(() => usePushNotifications(true));
      });

      await act(async () => {
        await capturedCallback!({ notification: {} });
      });

      expect(mockScheduleNotificationAsync).toHaveBeenCalledWith({
        content: { title: "", body: "", sound: "default" },
        trigger: null,
      });
    });
  });

  describe("cleanup ao desmontar", () => {
    it("cancela o listener FCM e desinscreve do tópico", async () => {
      grantedPermission();
      const unsubscribeMessage = jest.fn();
      mockOnMessage.mockReturnValue(unsubscribeMessage);

      const { unmount } = renderHook(() => usePushNotifications(true));

      await act(async () => {});

      unmount();

      expect(unsubscribeMessage).toHaveBeenCalled();
      expect(mockUnsubscribeFromTopic).toHaveBeenCalledWith("todos_usuarios");
    });
  });
});
