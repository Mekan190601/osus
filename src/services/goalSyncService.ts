import {
  getCurrentUserId,
} from "./auth";

import {
  offlineDb,
} from "./offlineDb";

import {
  getOfflineGoal,
  saveOfflineGoal,
} from "./offlineGoalService";

import {
  getGoal,
  saveGoal,
  deleteGoal,
  type GoalData,
} from "./goalService";

import type {
  OfflineGoal,
  SyncQueueItem,
} from "./offlineDb";

function isGoalQueueItem(
  item: SyncQueueItem,
): item is SyncQueueItem & {
  entity: "goal";
  payload: OfflineGoal | null;
} {
  return item.entity === "goal";
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

/* =========================
   CLOUD → LOCAL
========================= */

export async function pullGoalFromCloud() {
  const userId =
    await getCurrentUserId();

  const cloudGoal =
    await getGoal();

  const localGoal =
    await getOfflineGoal(
      userId,
      "primary-goal",
    );

  if (!cloudGoal) {
    return localGoal ?? null;
  }

  const cloudUpdated =
    toTimestamp(
      cloudGoal.updatedAt,
    );

  const localUpdated =
    toTimestamp(
      localGoal?.updatedAt,
    );

  /*
   * Lokal maglumat cloud-dan täze bolsa,
   * cloud onuň üstünden ýazmaýar.
   */
  if (
    localGoal &&
    localUpdated > cloudUpdated
  ) {
    return localGoal;
  }

  const nextGoal: OfflineGoal = {
    userId,

    goalId:
      cloudGoal.goalId,

    mainGoal:
      cloudGoal.mainGoal,

    targetMoney:
      cloudGoal.targetMoney,

    currentMoney:
      cloudGoal.currentMoney,

    deadline:
      cloudGoal.deadline,

    updatedAt:
      cloudGoal.updatedAt,

    deletedAt:
      cloudGoal.deletedAt,
  };

  await saveOfflineGoal(
    nextGoal,
    false,
  );

  return nextGoal;
}

/* =========================
   PUSH LOCAL QUEUE → CLOUD
========================= */

export async function syncGoalQueue() {
  if (!navigator.onLine) {
    return;
  }

  /*
   * Offline-safe user ID.
   * Supabase session elýeterli bolmasa-da,
   * local user marker arkaly queue tapylýar.
   */
  const userId =
    await getCurrentUserId();

  const queue =
    await offlineDb.syncQueue
      .where("userId")
      .equals(userId)
      .toArray();

  const goalQueue =
    queue.filter(
      isGoalQueueItem,
    );

  for (const item of goalQueue) {
    if (
      item.id === undefined
    ) {
      continue;
    }

    try {
      if (
        item.operation ===
        "delete"
      ) {
        const updatedAt =
          item.payload
            ?.updatedAt ??
          new Date().toISOString();

        await deleteGoal(
          updatedAt,
        );
      } else {
        if (!item.payload) {
          await offlineDb.syncQueue.delete(
            item.id,
          );

          continue;
        }

        const goal: GoalData = {
          goalId:
            item.payload.goalId,

          mainGoal:
            item.payload.mainGoal,

          targetMoney:
            item.payload.targetMoney,

          currentMoney:
            item.payload.currentMoney,

          deadline:
            item.payload.deadline,

          updatedAt:
            item.payload.updatedAt,

          deletedAt:
            item.payload.deletedAt,
        };

        await saveGoal(goal);
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
       * Sync şowsuz bolsa queue galýar.
       * Internet/session dikeldilende
       * indiki sync-de ýene synanyşylýar.
       */
      console.warn(
        "Goal queue item sync failed:",
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
   INITIALIZE
========================= */

export async function initializeGoalSync() {
  const userId =
    await getCurrentUserId();

  const localGoal =
    await getOfflineGoal(
      userId,
      "primary-goal",
    );

  /*
   * Internet ýok bolsa Supabase-a
   * asla ýüzlenmeýäris.
   */
  if (!navigator.onLine) {
    return localGoal ?? null;
  }

  /*
   * Internet bar bolsa:
   * 1. Offline queue cloud-a gidýär.
   * 2. Cloud maglumat local bilen deňeşdirilýär.
   */
  await syncGoalQueue();

  return pullGoalFromCloud();
}