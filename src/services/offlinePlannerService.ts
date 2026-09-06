import { offlineDb } from "./offlineDb";

import type {
  OfflinePlannerTask,
  SyncQueueItem,
} from "./offlineDb";

/* =========================
   GET TASKS
========================= */

export async function getOfflinePlannerTasks(
  userId: string,
) {
  return offlineDb.plannerTasks
    .where("userId")
    .equals(userId)
    .toArray();
}

export async function getOfflinePlannerTask(
  userId: string,
  taskId: string,
) {
  return offlineDb.plannerTasks.get([
    userId,
    taskId,
  ]);
}

/* =========================
   SAVE / UPDATE TASK
========================= */

export async function saveOfflinePlannerTask(
  task: OfflinePlannerTask,
  addToQueue = true,
) {
  await offlineDb.transaction(
    "rw",
    offlineDb.plannerTasks,
    offlineDb.syncQueue,
    async () => {
      await offlineDb.plannerTasks.put(
        task,
      );

      if (!addToQueue) {
        return;
      }

      /*
       * Şol bir task üçin öň queue ýazgysy
       * bar bolsa täze queue döretmeýäris.
       *
       * Mysal:
       * offline wagty:
       * 1. task döredildi
       * 2. ady üýtgedildi
       * 3. completed edildi
       *
       * Queue-da 3 ýazgy däl,
       * diňe iň soňky ýagdaý galýar.
       */
      const existingQueueItem =
        await offlineDb.syncQueue
          .where({
            userId: task.userId,
            entity: "plannerTask",
            entityId: task.id,
          })
          .first();

      const queueItem: SyncQueueItem = {
        userId: task.userId,

        entity: "plannerTask",
        entityId: task.id,

        operation: task.deletedAt
          ? "delete"
          : "upsert",

        payload: task,

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

/* =========================
   SAVE MANY TASKS
========================= */

export async function saveOfflinePlannerTasks(
  tasks: OfflinePlannerTask[],
  addToQueue = false,
) {
  for (const task of tasks) {
    await saveOfflinePlannerTask(
      task,
      addToQueue,
    );
  }
}

/* =========================
   SOFT DELETE ONE TASK
========================= */

export async function markOfflinePlannerTaskDeleted(
  userId: string,
  taskId: string,
) {
  const existing =
    await getOfflinePlannerTask(
      userId,
      taskId,
    );

  if (!existing) {
    return null;
  }

  const now =
    new Date().toISOString();

  const deletedTask: OfflinePlannerTask = {
    ...existing,

    updatedAt: now,
    deletedAt: now,
  };

  await saveOfflinePlannerTask(
    deletedTask,
    true,
  );

  return deletedTask;
}

/* =========================
   SOFT DELETE MANY TASKS
========================= */

export async function markOfflinePlannerTasksDeleted(
  userId: string,
  taskIds: string[],
) {
  const uniqueIds = [
    ...new Set(taskIds),
  ];

  const deletedTasks:
    OfflinePlannerTask[] = [];

  for (const taskId of uniqueIds) {
    const deleted =
      await markOfflinePlannerTaskDeleted(
        userId,
        taskId,
      );

    if (deleted) {
      deletedTasks.push(deleted);
    }
  }

  return deletedTasks;
}

/* =========================
   VISIBLE TASKS
========================= */

export async function getVisibleOfflinePlannerTasks(
  userId: string,
) {
  const tasks =
    await getOfflinePlannerTasks(
      userId,
    );

  return tasks
    .filter(
      (task) => !task.deletedAt,
    )
    .sort(
      (a, b) =>
        new Date(
          b.createdAt,
        ).getTime() -
        new Date(
          a.createdAt,
        ).getTime(),
    );
}

/* =========================
   CLEAR LOCAL CACHE
========================= */

export async function clearOfflinePlannerTasksForUser(
  userId: string,
) {
  const tasks =
    await offlineDb.plannerTasks
      .where("userId")
      .equals(userId)
      .toArray();

  if (tasks.length === 0) {
    return;
  }

  await offlineDb.plannerTasks.bulkDelete(
    tasks.map(
      (task) =>
        [
          task.userId,
          task.id,
        ] as [string, string],
    ),
  );
}