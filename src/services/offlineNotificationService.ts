import {
  offlineDb,
  type OfflineNotification,
  type SyncQueueItem,
} from "./offlineDb";

async function findQueueItem(
  userId: string,
  notificationId: string,
) {
  return offlineDb.syncQueue
    .where("userId")
    .equals(userId)
    .filter(
      (item) =>
        item.entity === "notification" &&
        item.entityId === notificationId,
    )
    .first();
}

async function queueNotification(
  notification: OfflineNotification,
) {
  const existing =
    await findQueueItem(
      notification.userId,
      notification.id,
    );

  const queueItem: SyncQueueItem = {
    userId: notification.userId,
    entity: "notification",
    entityId: notification.id,

    operation:
      notification.deletedAt
        ? "delete"
        : "upsert",

    payload: notification,

    createdAt:
      new Date().toISOString(),

    attempts: 0,
  };

  if (existing?.id !== undefined) {
    await offlineDb.syncQueue.put({
      ...queueItem,
      id: existing.id,
    });

    return;
  }

  await offlineDb.syncQueue.add(
    queueItem,
  );
}

export async function getOfflineNotifications(
  userId: string,
) {
  const items =
    await offlineDb.notifications
      .where("userId")
      .equals(userId)
      .toArray();

  return items
    .filter(
      (item) => !item.deletedAt,
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );
}

export async function getOfflineNotification(
  userId: string,
  notificationId: string,
) {
  return offlineDb.notifications.get([
    userId,
    notificationId,
  ]);
}

export async function saveOfflineNotification(
  notification: OfflineNotification,
  addToQueue = true,
) {
  await offlineDb.transaction(
    "rw",
    offlineDb.notifications,
    offlineDb.syncQueue,
    async () => {
      await offlineDb.notifications.put(
        notification,
      );

      if (addToQueue) {
        await queueNotification(
          notification,
        );
      }
    },
  );

  return notification;
}

export async function saveOfflineNotifications(
  notifications: OfflineNotification[],
  addToQueue = false,
) {
  await offlineDb.transaction(
    "rw",
    offlineDb.notifications,
    offlineDb.syncQueue,
    async () => {
      for (const notification of notifications) {
        await offlineDb.notifications.put(
          notification,
        );

        if (addToQueue) {
          await queueNotification(
            notification,
          );
        }
      }
    },
  );
}