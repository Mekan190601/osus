import { supabase } from "./supabase";

import {
  offlineDb,
  type OfflineNotification,
} from "./offlineDb";

import {
  saveOfflineNotification,
} from "./offlineNotificationService";

import {
  getNotificationRows,
  upsertNotificationRow,
  type NotificationRow,
} from "./notificationService";

async function getUserId() {
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
  row: NotificationRow,
): OfflineNotification {
  return {
    userId: row.user_id,
    id: row.id,

    title: row.title,
    message: row.message,

    type: row.type,
    source: row.source,

    read: row.read,

    actionLabel:
      row.action_label,

    actionPath:
      row.action_path,

    dedupeKey:
      row.dedupe_key,

    resolved:
      row.resolved,

    resolvedAt:
      row.resolved_at,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,

    deletedAt:
      row.deleted_at,
  };
}

function getTime(
  value: string,
) {
  const time =
    new Date(value).getTime();

  return Number.isFinite(time)
    ? time
    : 0;
}

export async function syncNotificationQueue() {
  if (!navigator.onLine) {
    return;
  }

  const userId =
    await getUserId();

  const queue =
    await offlineDb.syncQueue
      .where("userId")
      .equals(userId)
      .toArray();

  const items =
    queue.filter(
      (item) =>
        item.entity ===
        "notification",
    );

  for (const item of items) {
    if (item.id === undefined) {
      continue;
    }

    const payload =
      item.payload as
        | OfflineNotification
        | null;

    if (!payload) {
      await offlineDb.syncQueue.delete(
        item.id,
      );

      continue;
    }

    try {
      await upsertNotificationRow(
        payload,
      );

      await offlineDb.syncQueue.delete(
        item.id,
      );
    } catch (error) {
      console.warn(
        "Notification sync failed:",
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

export async function pullNotificationsFromCloud() {
  const userId =
    await getUserId();

  const rows =
    await getNotificationRows();

  const queue =
    await offlineDb.syncQueue
      .where("userId")
      .equals(userId)
      .toArray();

  const pendingIds =
    new Set(
      queue
        .filter(
          (item) =>
            item.entity ===
            "notification",
        )
        .map(
          (item) =>
            item.entityId,
        ),
    );

  for (const row of rows) {
    if (pendingIds.has(row.id)) {
      continue;
    }

    const cloud =
      rowToOffline(row);

    const local =
      await offlineDb.notifications.get([
        userId,
        row.id,
      ]);

    if (
      !local ||
      getTime(cloud.updatedAt) >=
        getTime(local.updatedAt)
    ) {
      await saveOfflineNotification(
        cloud,
        false,
      );
    }
  }
}

export async function initializeNotificationSync() {
  if (!navigator.onLine) {
    return;
  }

  await syncNotificationQueue();
  await pullNotificationsFromCloud();
}