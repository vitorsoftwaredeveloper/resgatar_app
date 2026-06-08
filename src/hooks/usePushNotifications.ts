import { NotificationServices } from "@/services/NotificationService";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

const FCM_TOPIC = "todos_usuarios";

export function usePushNotifications(isLoggedIn: boolean) {
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    registerForPushNotifications();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notificação recebida em foreground:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Usuário interagiu com a notificação:", response);
      });

    const unsubscribeMessage = messaging().onMessage(async (remoteMessage) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title ?? "",
          body: remoteMessage.notification?.body ?? "",
          sound: "default",
        },
        trigger: null,
      });
    });

    return () => {
      unsubscribeMessage();
      notificationListener.current?.remove();
      responseListener.current?.remove();
      messaging().unsubscribeFromTopic(FCM_TOPIC);
    };
  }, [isLoggedIn]);

  async function registerForPushNotifications() {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") return;

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Notificações",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      const { data: fcmToken } = await Notifications.getDevicePushTokenAsync();
      await NotificationServices.registerFCMToken(fcmToken);

      await messaging().subscribeToTopic(FCM_TOPIC);
    } catch (error) {
      console.error("Erro ao registrar push token:", error);
    }
  }
}
