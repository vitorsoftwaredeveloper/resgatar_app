function getNextDateForDay(day: number, hour = 9, minutes = 0): Date {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  let target = new Date(year, month, day, hour, minutes, 0);

  if (target <= now) {
    month += 1;
    target = new Date(year, month, day, hour, minutes, 0);
  }

  // Ajuste meses sem o dia (ex: fevereiro)
  while (target.getDate() !== day) {
    target.setDate(target.getDate() - 1);
  }

  return target;
}

import { useCallback } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

const START_DAY = 1;
const END_DAY = 23;

export function useContributionNotifications() {
  const requestPermission = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  };

  const ensureAndroidChannel = async () => {
    if (Platform.OS !== "android") return;

    await Notifications.setNotificationChannelAsync("contribution", {
      name: "Contribuição",
      importance: Notifications.AndroidImportance.HIGH,
    });
  };

  const cancelAllContributionNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const scheduleMonthlyContributionNotifications = useCallback(
    async (hour = 9, minutes = 0) => {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      await ensureAndroidChannel();
      await cancelAllContributionNotifications();

      for (let day = START_DAY; day <= END_DAY; day++) {
        const date = getNextDateForDay(day, hour, minutes);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Contribuição mensal",
            body: "Lembrete da sua contribuição 💙",
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date,
            ...(Platform.OS === "android" && {
              channelId: "contribution",
            }),
          },
        });
      }
    },
    [],
  );

  return {
    scheduleMonthlyContributionNotifications,
    cancelAllContributionNotifications,
  };
}
