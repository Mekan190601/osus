import { supabase } from "./supabase";

import {
  offlineDb,
  type OfflineUserSettings,
  type SyncQueueItem,
} from "./offlineDb";

import {
  getOfflineUserSettings,
  saveOfflineUserSettings,
} from "./offlineSettingsService";

import {
  getUserSettingsRow,
  saveUserSettings,
  type UserSettingsRow,
} from "./settingsService";

function isSettingsQueueItem(
  item: SyncQueueItem,
): item is SyncQueueItem & {
  entity: "userSettings";
  payload:
    | OfflineUserSettings
    | null;
} {
  return (
    item.entity ===
    "userSettings"
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
  row: UserSettingsRow,
): OfflineUserSettings {
  return {
    userId:
      row.user_id,

    language:
      row.language,

    currency:
      row.currency,

    startPage:
      row.start_page,

    theme:
      row.theme,

    notifications: {
      planner:
        row.notification_planner,

      finance:
        row.notification_finance,

      goal:
        row.notification_goal,

      deadline:
        row.notification_deadline,

      success:
        row.notification_success,
    },

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

export async function syncSettingsQueue() {
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
      isSettingsQueueItem,
    );

  for (const item of items) {
    if (
      item.id === undefined ||
      !item.payload
    ) {
      if (item.id !== undefined) {
        await offlineDb.syncQueue.delete(
          item.id,
        );
      }

      continue;
    }

    try {
      const settings =
        item.payload;

      await saveUserSettings(
        {
          language:
            settings.language,

          currency:
            settings.currency,

          startPage:
            settings.startPage,

          theme:
            settings.theme,

          notifications: {
            ...settings.notifications,
          },
        },
        settings.updatedAt,
      );

      await offlineDb.syncQueue.delete(
        item.id,
      );
    } catch (error) {
      console.warn(
        "Settings sync failed:",
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

export async function pullSettingsFromCloud() {
  const userId =
    await getCurrentUserId();

  const [
    cloud,
    local,
    queue,
  ] = await Promise.all([
    getUserSettingsRow(),

    getOfflineUserSettings(
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
          "userSettings" &&
        item.entityId ===
          userId,
    );

  if (
    !cloud ||
    hasPending
  ) {
    return local;
  }

  const cloudSettings =
    rowToOffline(cloud);

  if (
    !local ||
    timestamp(
      cloudSettings.updatedAt,
    ) >=
      timestamp(
        local.updatedAt,
      )
  ) {
    await saveOfflineUserSettings(
      cloudSettings,
      false,
    );

    return cloudSettings;
  }

  return local;
}

export async function initializeSettingsSync() {
  const userId =
    await getCurrentUserId();

  const local =
    await getOfflineUserSettings(
      userId,
    );

  if (!navigator.onLine) {
    return local;
  }

  await syncSettingsQueue();

  return pullSettingsFromCloud();
}