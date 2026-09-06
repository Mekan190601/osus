import {
  offlineDb,
  type OfflineCurrencyRateSettings,
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
          "currencyRates" &&
        item.entityId === userId,
    )
    .first();
}

export async function getOfflineCurrencyRates(
  userId: string,
) {
  return offlineDb.currencyRates.get(
    userId,
  );
}

export async function saveOfflineCurrencyRates(
  data: OfflineCurrencyRateSettings,
  addToQueue = true,
) {
  await offlineDb.transaction(
    "rw",
    offlineDb.currencyRates,
    offlineDb.syncQueue,
    async () => {
      await offlineDb.currencyRates.put(
        data,
      );

      if (!addToQueue) {
        return;
      }

      const existing =
        await findQueueItem(
          data.userId,
        );

      const queueItem: SyncQueueItem = {
        userId:
          data.userId,

        entity:
          "currencyRates",

        entityId:
          data.userId,

        operation:
          "upsert",

        payload:
          data,

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