import { supabase } from "./supabase";

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

async function getCurrentUserId() {
  const {
    data: { session },
    error,
  } =
    await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.user) {
    throw new Error(
      "Ulanyjy hasaba girmändir.",
    );
  }

  return session.user.id;
}

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

export async function syncCurrencyRateQueue() {
  if (!navigator.onLine) {
    return;
  }

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

      await offlineDb.syncQueue.delete(
        item.id,
      );
    } catch (error) {
      console.warn(
        "Currency rate sync failed:",
        error,
      );

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
    rowToOffline(cloud);

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

export async function initializeCurrencyRateSync() {
  const userId =
    await getCurrentUserId();

  const local =
    await getOfflineCurrencyRates(
      userId,
    );

  if (!navigator.onLine) {
    return local;
  }

  await syncCurrencyRateQueue();

  return pullCurrencyRatesFromCloud();
}