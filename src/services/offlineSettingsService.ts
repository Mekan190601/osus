import {
  offlineDb,
  type OfflineUserSettings,
  type SyncQueueItem,
} from "./offlineDb";

async function findQueueItem(
  userId: string,
) {
  return offlineDb.syncQueue
    .where("userId")
    .equals(userId)
    .filter(
      (item) =>
        item.entity ===
          "userSettings" &&
        item.entityId === userId,
    )
    .first();
}

export async function getOfflineUserSettings(
  userId: string,
) {
  return offlineDb.userSettings.get(
    userId,
  );
}

export async function saveOfflineUserSettings(
  settings: OfflineUserSettings,
  addToQueue = true,
) {
  await offlineDb.transaction(
    "rw",
    offlineDb.userSettings,
    offlineDb.syncQueue,
    async () => {
      await offlineDb.userSettings.put(
        settings,
      );

      if (!addToQueue) {
        return;
      }

      const existing =
        await findQueueItem(
          settings.userId,
        );

      const queueItem: SyncQueueItem = {
        userId:
          settings.userId,

        entity:
          "userSettings",

        entityId:
          settings.userId,

        operation:
          "upsert",

        payload:
          settings,

        createdAt:
          new Date().toISOString(),

        attempts: 0,
      };

      if (
        existing?.id !==
        undefined
      ) {
        await offlineDb.syncQueue.put({
          ...queueItem,
          id: existing.id,
        });
      } else {
        await offlineDb.syncQueue.add(
          queueItem,
        );
      }
    },
  );
}