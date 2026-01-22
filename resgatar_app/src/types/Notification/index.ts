type INotificationType = "info" | "alert" | "warning";

interface INotification {
  title: string;
  description: string;
  createdAt: string;
  type: INotificationType;
  isNew: boolean;
}

export { INotification };
