export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "danger";

export type NotificationSource =
  | "system"
  | "planner"
  | "finance"
  | "goal"
  | "analytics"
  | "ai-coach";

export type AppNotification = {
  id: string;

  title: string;
  message: string;

  type: NotificationType;
  source: NotificationSource;

  read: boolean;

  actionLabel?: string;
  actionPath?: string;

  dedupeKey?: string;

  resolved: boolean;
  resolvedAt?: string;

  createdAt: string;
};

export type CreateNotificationInput = {
  title: string;
  message: string;

  type?: NotificationType;
  source?: NotificationSource;

  actionLabel?: string;
  actionPath?: string;

  dedupeKey?: string;
};