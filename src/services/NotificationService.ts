import { ICharge } from "@/types/Charge";
import { api } from "./api";
import { INotification } from "@/types/Notification";

export const NotificationServices = {
  createNotification: async (payload: INotification): Promise<ICharge> => {
    try {
      const response = await api.post("/notifications", {
        title: payload.title,
        description: payload.description,
        type: payload.type,
      });
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Error creating notification", error);
      throw error;
    }
  },
  listNotifications: async () => {
    try {
      const response = await api.get("/notifications");
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error("Error list notifications", error);
      throw error;
    }
  },
  registerFCMToken: async (token: string): Promise<void> => {
    try {
      await api.patch("/members/push-token", { pushToken: token });
    } catch (error) {
      console.error("Error registering FCM token", error);
      throw error;
    }
  },
};
