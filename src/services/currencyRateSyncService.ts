import {
  getCurrentUserId,
} from "./auth";

import {
  offlineDb,
  type OfflineCurrencyRateSettings,
  type SyncQueueItem,
} from "./offlineDb";

import {
  getOfflineCurrencyRates,
  saveOfflineCurrencyRates,
} from "./offlineCurrencyRateService";

import {
  getUserCurrencyRateRow,
  saveUserCurrencyRates,
  type CurrencyRateRow,
} from "./currencyRateService";

/* =========================
   TYPE GUARD
========================= */

function isCurrencyRateQueueItem(
  item: SyncQueueItem,
): item is SyncQueueItem & {
  entity: "currencyRates";
  payload:
    | OfflineCurrencyRateSettings
    | null;
} {
  return (
    item.entity ===
    "currencyRates"
  );
}

/* =========================
   HELPERS
========================= */

function rowToOffline(
  row: CurrencyRateRow,
): OfflineCurrencyRateSettings {
  return {
    userId:
      row.user_id,

    rates: {
      TMT: 1,

      USD:
        Number(row.usd_rate),

      EUR:
        Number(row.eur_rate),

      CNY:
        Number(row.cny_rate),

      TRY:
        Number(row.try_rate),
    },

    mode:
      row.mode,

    lastUpdatedAt:
      row.last_updated_at,

    lastProviderDate:
      row.last_provider_date,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,

    deletedAt:
      row.deleted_at ?? null,
  };
}

function timestamp(
  value: string,
) {
  const time =
    new Date(value).getTime();

  return Number.isFinite(time)
    ? time
    : 0;
}

/* =========================
   PUSH LOCAL QUEUE → CLOUD
========================= */

export async function syncCurrencyRateQueue() {
  if (!navigator.onLine) {
    return;
  }

  /*
   * Merkezi offline-safe user ID.
   */
  const userId =
    await getCurrentUserId();

  const queue =
    await offlineDb.syncQueue
      .where("userId")
      .equals(userId)
      .toArray();

  const items =
    queue.filter(
      isCurrencyRateQueueItem,
    );

  for (const item of items) {
    if (
      item.id === undefined ||
      !item.payload
    ) {
      if (
        item.id !== undefined
      ) {
        await offlineDb.syncQueue.delete(
          item.id,
        );
      }

      continue;
    }

    try {
      const data =
        item.payload;

      await saveUserCurrencyRates(
        {
          rates: {
            ...data.rates,
            TMT: 1,
          },

          mode:
            data.mode,

          lastUpdatedAt:
            data.lastUpdatedAt,

          lastProviderDate:
            data.lastProviderDate,
        },

        data.updatedAt,
      );

      /*
       * Cloud-a üstünlikli geçenden soň
       * queue item pozulýar.
       */
      await offlineDb.syncQueue.delete(
        item.id,
      );
    } catch (error) {
      console.warn(
        "Currency rate sync failed:",
        error,
      );

      /*
       * Sync şowsuz bolsa queue galýar.
       * Internet/session dikelende
       * indiki sync-de ýene synanyşylýar.
       */
      await offlineDb.syncQueue.update(
        item.id,
        {
          attempts:
            item.attempts + 1,
        },
      );
    }
  }
}

/* =========================
   PULL CLOUD → LOCAL
========================= */

export async function pullCurrencyRatesFromCloud() {
  const userId =
    await getCurrentUserId();

  const [
    cloud,
    local,
    queue,
  ] = await Promise.all([
    getUserCurrencyRateRow(),

    getOfflineCurrencyRates(
      userId,
    ),

    offlineDb.syncQueue
      .where("userId")
      .equals(userId)
      .toArray(),
  ]);

  /*
   * Pending lokal üýtgeşme bar bolsa
   * cloud onuň üstünden ýazmaýar.
   */
  const hasPending =
    queue.some(
      (item) =>
        item.entity ===
          "currencyRates" &&
        item.entityId ===
          userId,
    );

  if (
    !cloud ||
    hasPending
  ) {
    return local;
  }

  const cloudData =
    rowToOffline(
      cloud,
    );

  /*
   * Last-write-wins:
   * täze updatedAt ýeňýär.
   */
  if (
    !local ||
    timestamp(
      cloudData.updatedAt,
    ) >=
      timestamp(
        local.updatedAt,
      )
  ) {
    await saveOfflineCurrencyRates(
      cloudData,
      false,
    );

    return cloudData;
  }

  return local;
}

/* =========================
   INITIALIZE
========================= */

export async function initializeCurrencyRateSync() {
  const userId =
    await getCurrentUserId();

  const local =
    await getOfflineCurrencyRates(
      userId,
    );

  /*
   * OFFLINE:
   * Supabase-a ýüzlenmeýäris.
   * Diňe IndexedDB maglumatlary ulanylýar.
   */
  if (!navigator.onLine) {
    return local;
  }

  /*
   * ONLINE:
   * 1. Offline queue cloud-a gidýär.
   * 2. Cloud maglumat local bilen deňeşdirilýär.
   */
  await syncCurrencyRateQueue();

  return pullCurrencyRatesFromCloud();
}