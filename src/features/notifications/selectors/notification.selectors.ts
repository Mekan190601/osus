import type { AppNotification } from "../types/notification.types";

export function getUnreadNotifications(
  notifications: AppNotification[],
) {
  return notifications.filter(
    (notification) => !notification.read,
  );
}

export function getUnreadNotificationCount(
  notifications: AppNotification[],
) {
  return getUnreadNotifications(
    notifications,
  ).length;
}

export function getRecentNotifications(
  notifications: AppNotification[],
  limit = 5,
) {
  return [...notifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}