import {
  getCurrentUserId,
} from "./auth";

import {
  offlineDb,
} from "./offlineDb";

import {
  getOfflinePlannerTasks,
  saveOfflinePlannerTask,
} from "./offlinePlannerService";

import {
  deletePlannerTask,
  getAllPlannerTasksForSync,
  savePlannerTask,
} from "./plannerService";

import type {
  OfflinePlannerTask,
  SyncQueueItem,
} from "./offlineDb";

import type {
  PlannerTaskWithSync,
} from "./plannerService";

function isPlannerQueueItem(
  item: SyncQueueItem,
): item is SyncQueueItem & {
  entity: "plannerTask";
  payload: OfflinePlannerTask | null;
} {
  return item.entity === "plannerTask";
}

function toTimestamp(
  value: string | null | undefined,
) {
  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(value).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : 0;
}

function cloudToOffline(
  userId: string,
  task: PlannerTaskWithSync,
): OfflinePlannerTask {
  return {
    userId,

    id: task.id,

    title: task.title,
    description: task.description,

    period: task.period,
    quadrant: task.quadrant,

    dateKey: task.dateKey,

    parentTaskId:
      task.parentTaskId,

    sourceGoalId:
      task.sourceGoalId,

    completed:
      task.completed,

    completedAt:
      task.completedAt,

    createdAt:
      task.createdAt,

    updatedAt:
      task.updatedAt,

    deletedAt:
      task.deletedAt,
  };
}

function offlineToCloud(
  task: OfflinePlannerTask,
): PlannerTaskWithSync {
  return {
    id: task.id,

    title: task.title,
    description:
      task.description,

    period: task.period,
    quadrant: task.quadrant,

    dateKey: task.dateKey,

    parentTaskId:
      task.parentTaskId,

    sourceGoalId:
      task.sourceGoalId,

    completed:
      task.completed,

    completedAt:
      task.completedAt,

    createdAt:
      task.createdAt,

    updatedAt:
      task.updatedAt,

    deletedAt:
      task.deletedAt,
  };
}

/* =========================
   PUSH LOCAL QUEUE → CLOUD
========================= */

export async function syncPlannerQueue() {
  if (!navigator.onLine) {
    return;
  }

  /*
   * Offline-safe user ID.
   *
   * Supabase session elýeterli bolsa şol ulanylýar.
   * Session wagtlaýyn elýeterli däl bolsa,
   * soňky üstünlikli login-den galan local user
   * arkaly IndexedDB queue tapylýar.
   */
  const userId =
    await getCurrentUserId();

  const queue =
    await offlineDb.syncQueue
      .where("userId")
      .equals(userId)
      .toArray();

  const plannerQueue =
    queue.filter(
      isPlannerQueueItem,
    );

  for (const item of plannerQueue) {
    if (item.id === undefined) {
      continue;
    }

    try {
      const payload =
        item.payload;

      if (!payload) {
        await offlineDb.syncQueue.delete(
          item.id,
        );

        continue;
      }

      if (
        item.operation === "delete" ||
        payload.deletedAt
      ) {
        await deletePlannerTask(
          payload.id,
          payload.updatedAt,
        );
      } else {
        await savePlannerTask(
          offlineToCloud(payload),
        );
      }

      /*
       * Cloud-a üstünlikli geçenden soň
       * queue item pozulýar.
       */
      await offlineDb.syncQueue.delete(
        item.id,
      );
    } catch (error) {
      /*
       * Sync şowsuz bolsa local maglumat
       * we queue item saklanýar.
       *
       * Şeýlelikde indiki online / visibility
       * event-de gaýtadan synanyşyp bolýar.
       */
      console.warn(
        "Planner queue item sync failed:",
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

/* =========================
   CLOUD ↔ LOCAL MERGE
========================= */

export async function pullPlannerFromCloud() {
  const userId =
    await getCurrentUserId();

  const [
    cloudTasks,
    localTasks,
    pendingQueue,
  ] = await Promise.all([
    getAllPlannerTasksForSync(),

    getOfflinePlannerTasks(
      userId,
    ),

    offlineDb.syncQueue
      .where("userId")
      .equals(userId)
      .toArray(),
  ]);

  /*
   * Queue-da duran task-lar entek
   * cloud-a gitmedik lokal üýtgeşmelerdir.
   *
   * Cloud pull olaryň üstünden
   * köne maglumat ýazmaly däl.
   */
  const pendingPlannerIds =
    new Set(
      pendingQueue
        .filter(
          isPlannerQueueItem,
        )
        .map(
          (item) =>
            item.entityId,
        ),
    );

  const localMap =
    new Map(
      localTasks.map(
        (task) => [
          task.id,
          task,
        ],
      ),
    );

  for (const cloudTask of cloudTasks) {
    const localTask =
      localMap.get(
        cloudTask.id,
      );

    /*
     * Pending lokal operasiýa bar bolsa
     * cloud ony basyp geçmeýär.
     */
    if (
      pendingPlannerIds.has(
        cloudTask.id,
      )
    ) {
      continue;
    }

    if (!localTask) {
      await saveOfflinePlannerTask(
        cloudToOffline(
          userId,
          cloudTask,
        ),
        false,
      );

      continue;
    }

    const cloudUpdated =
      toTimestamp(
        cloudTask.updatedAt,
      );

    const localUpdated =
      toTimestamp(
        localTask.updatedAt,
      );

    /*
     * Last-write-wins:
     * täze updatedAt ýeňýär.
     */
    if (
      cloudUpdated >=
      localUpdated
    ) {
      await saveOfflinePlannerTask(
        cloudToOffline(
          userId,
          cloudTask,
        ),
        false,
      );
    }
  }

  return getOfflinePlannerTasks(
    userId,
  );
}

/* =========================
   INITIALIZE
========================= */

export async function initializePlannerSync() {
  const userId =
    await getCurrentUserId();

  const localTasks =
    await getOfflinePlannerTasks(
      userId,
    );

  /*
   * Internet ýok bolsa Supabase-a
   * asla ýüzlenmeýäris.
   *
   * Göni IndexedDB maglumatyny berýäris.
   */
  if (!navigator.onLine) {
    return localTasks;
  }

  /*
   * Internet gaýdanda:
   *
   * 1. Ilki offline wagty döredilen /
   *    üýtgedilen maglumat cloud-a gidýär.
   *
   * 2. Soň cloud maglumatlary local bilen
   *    birleşdirilýär.
   */
  await syncPlannerQueue();

  return pullPlannerFromCloud();
}

/* =========================
   VISIBLE TASKS
========================= */

export async function getSyncedVisiblePlannerTasks() {
  const tasks =
    await initializePlannerSync();

  return tasks
    .filter(
      (task) =>
        !task.deletedAt,
    )
    .sort(
      (a, b) =>
        toTimestamp(
          b.createdAt,
        ) -
        toTimestamp(
          a.createdAt,
        ),
    );
}