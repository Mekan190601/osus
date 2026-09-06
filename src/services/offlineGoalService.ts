import { offlineDb } from "./offlineDb";

import type {
  OfflineGoal,
  SyncQueueItem,
} from "./offlineDb";

export async function getOfflineGoal(
  userId: string,
  goalId = "primary-goal",
) {
  return offlineDb.goals.get([
    userId,
    goalId,
  ]);
}

export async function saveOfflineGoal(
  goal: OfflineGoal,
  addToQueue = true,
) {
  await offlineDb.transaction(
    "rw",
    offlineDb.goals,
    offlineDb.syncQueue,
    async () => {
      await offlineDb.goals.put(
        goal,
      );

      if (!addToQueue) {
        return;
      }

      const existingQueueItem =
        await offlineDb.syncQueue
          .where({
            userId: goal.userId,
            entity: "goal",
            entityId: goal.goalId,
          })
          .first();

      const queueItem: SyncQueueItem =
        {
          userId: goal.userId,
          entity: "goal",
          entityId: goal.goalId,
          operation: goal.deletedAt
            ? "delete"
            : "upsert",
          payload: goal,
          createdAt:
            new Date().toISOString(),
          attempts: 0,
        };

      if (
        existingQueueItem?.id !==
        undefined
      ) {
        await offlineDb.syncQueue.put({
          ...queueItem,
          id: existingQueueItem.id,
        });
      } else {
        await offlineDb.syncQueue.add(
          queueItem,
        );
      }
    },
  );
}

export async function markOfflineGoalDeleted(
  userId: string,
  goalId = "primary-goal",
) {
  const existing =
    await getOfflineGoal(
      userId,
      goalId,
    );

  const now =
    new Date().toISOString();

  const deletedGoal: OfflineGoal = {
    userId,
    goalId,

    mainGoal:
      existing?.mainGoal ?? "",

    targetMoney:
      existing?.targetMoney ?? 0,

    currentMoney:
      existing?.currentMoney ?? 0,

    deadline:
      existing?.deadline ?? "",

    updatedAt: now,
    deletedAt: now,
  };

  await saveOfflineGoal(
    deletedGoal,
    true,
  );

  return deletedGoal;
}

export async function clearOfflineGoalsForUser(
  userId: string,
) {
  const goals =
    await offlineDb.goals
      .where("userId")
      .equals(userId)
      .toArray();

  await offlineDb.goals.bulkDelete(
    goals.map(
      (goal) =>
        [
          goal.userId,
          goal.goalId,
        ] as [string, string],
    ),
  );
}