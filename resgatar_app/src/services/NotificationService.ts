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
};
