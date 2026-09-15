import {
  getCurrentUserId,
} from "./auth";

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

function rowToOffline(
  row: NotificationRow,
): OfflineNotification {
  return {
    userId:
      row.user_id,

    id:
      row.id,

    title:
      row.title,

    message:
      row.message,

    type:
      row.type,

    source:
      row.source,

    read:
      row.read,

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

/* =========================
   PUSH LOCAL QUEUE → CLOUD
========================= */

export async function syncNotificationQueue() {
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
      (item) =>
        item.entity ===
        "notification",
    );

  for (const item of items) {
    if (
      item.id === undefined
    ) {
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

      /*
       * Cloud-a üstünlikli geçenden soň
       * queue item pozulýar.
       */
      await offlineDb.syncQueue.delete(
        item.id,
      );
    } catch (error) {
      console.warn(
        "Notification sync failed:",
        error,
      );

      /*
       * Sync şowsuz bolsa queue galýar.
       * Internet/session dikeldilende
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

export async function pullNotificationsFromCloud() {
  const userId =
    await getCurrentUserId();

  const rows =
    await getNotificationRows();

  const queue =
    await offlineDb.syncQueue
      .where("userId")
      .equals(userId)
      .toArray();

  /*
   * Pending lokal üýtgeşmesi bolan
   * notification-lary cloud basyp geçmeýär.
   */
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
    if (
      pendingIds.has(
        row.id,
      )
    ) {
      continue;
    }

    const cloud =
      rowToOffline(
        row,
      );

    const local =
      await offlineDb.notifications.get([
        userId,
        row.id,
      ]);

    /*
     * Last-write-wins:
     * täze updatedAt ýeňýär.
     */
    if (
      !local ||
      getTime(
        cloud.updatedAt,
      ) >=
        getTime(
          local.updatedAt,
        )
    ) {
      await saveOfflineNotification(
        cloud,
        false,
      );
    }
  }
}

/* =========================
   INITIALIZE
========================= */

export async function initializeNotificationSync() {
  /*
   * OFFLINE:
   * Cloud-a asla ýüzlenmeýäris.
   * Notification store IndexedDB-däki
   * maglumat bilen işleýär.
   */
  if (!navigator.onLine) {
    return;
  }

  /*
   * ONLINE:
   * 1. Offline queue cloud-a gidýär.
   * 2. Soň cloud maglumatlary local-a çekilýär.
   */
  await syncNotificationQueue();

  await pullNotificationsFromCloud();
}