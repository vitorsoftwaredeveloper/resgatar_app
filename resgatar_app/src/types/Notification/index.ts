type INotificationType = "info" | "success" | "warning";

interface INotification {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  type: INotificationType;
  isNew: boolean;
}

export { INotification };
