import { supabase } from "./supabase";
import { offlineDb } from "./offlineDb";

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

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error(
      "Ulanyjy hasaba girmändir.",
    );
  }

  return user.id;
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

  if (
    localGoal &&
    localUpdated > cloudUpdated
  ) {
    return localGoal;
  }

  await saveOfflineGoal(
    {
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
    },
    false,
  );

  return {
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
}

export async function syncGoalQueue() {
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

  const goalQueue =
  queue.filter(isGoalQueueItem);

  for (
    const item of goalQueue
  ) {
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

      await offlineDb.syncQueue.delete(
        item.id,
      );
    } catch {
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

export async function initializeGoalSync() {
  const userId =
    await getCurrentUserId();

  const localGoal =
    await getOfflineGoal(
      userId,
      "primary-goal",
    );

  if (!navigator.onLine) {
    return localGoal ?? null;
  }

  await syncGoalQueue();

  return pullGoalFromCloud();
}