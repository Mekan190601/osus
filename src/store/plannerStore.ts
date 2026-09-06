import { create } from "zustand";

import { supabase } from "../services/supabase";

import {
  getVisibleOfflinePlannerTasks,
  markOfflinePlannerTasksDeleted,
  saveOfflinePlannerTask,
} from "../services/offlinePlannerService";

import {
  getSyncedVisiblePlannerTasks,
  syncPlannerQueue,
} from "../services/plannerSyncService";

import type {
  CreatePlannerTaskInput,
  EisenhowerQuadrant,
  PlannerPeriod,
  PlannerTask,
  UpdatePlannerTaskInput,
} from "../features/planner/types/planner.types";

import type {
  OfflinePlannerTask,
} from "../services/offlineDb";

type PlannerState = {
  tasks: PlannerTask[];

  activePeriod: PlannerPeriod;
  selectedDate: string;

  focusedTaskId: string | null;

  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  loadPlanner: () => Promise<void>;

  setActivePeriod: (
    period: PlannerPeriod,
  ) => void;

  setSelectedDate: (
    date: string,
  ) => void;

  setFocusedTaskId: (
    taskId: string | null,
  ) => void;

  addTask: (
    input: CreatePlannerTaskInput,
  ) => Promise<void>;

  updateTask: (
    taskId: string,
    input: UpdatePlannerTaskInput,
  ) => Promise<void>;

  deleteTask: (
    taskId: string,
  ) => Promise<void>;

  toggleTask: (
    taskId: string,
  ) => Promise<void>;

  moveTask: (
    taskId: string,
    quadrant: EisenhowerQuadrant,
  ) => Promise<void>;

  linkTaskToParent: (
    taskId: string,
    parentTaskId: string,
  ) => Promise<void>;

  unlinkTaskFromParent: (
    taskId: string,
  ) => Promise<void>;

  clearCompletedTasks: () => Promise<void>;

  resetPlanner: () => Promise<void>;

  clearLocalPlanner: () => void;
};

const createInitialState = () => ({
  tasks: [] as PlannerTask[],

  activePeriod:
    "daily" as PlannerPeriod,

  selectedDate:
    new Date().toISOString(),

  focusedTaskId:
    null as string | null,

  isLoading: false,
  isInitialized: false,
  error: null as string | null,
});

function createTaskId() {
  if (
    typeof crypto !==
      "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function getErrorMessage(
  error: unknown,
) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Näbelli ýalňyşlyk ýüze çykdy.";
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

function offlineToPlannerTask(
  task: OfflinePlannerTask,
): PlannerTask {
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
  };
}

export const usePlannerStore =
  create<PlannerState>()(
    (set, get) => ({
      ...createInitialState(),

      loadPlanner: async () => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          // 1. Ilki lokal cache
          const localTasks =
            await getVisibleOfflinePlannerTasks(
              userId,
            );

          set({
            tasks:
              localTasks.map(
                offlineToPlannerTask,
              ),
            isInitialized: true,
          });

          // 2. Online bolsa sync + cloud merge
          if (navigator.onLine) {
            try {
              const syncedTasks =
                await getSyncedVisiblePlannerTasks();

              set({
                tasks:
                  syncedTasks.map(
                    offlineToPlannerTask,
                  ),
                error: null,
              });
            } catch (error) {
              console.warn(
                "Planner cloud sync failed:",
                error,
              );
            }
          }
        } catch (error) {
          set({
            error:
              getErrorMessage(error),
            isInitialized: true,
          });
        } finally {
          set({
            isLoading: false,
          });
        }
      },

      setActivePeriod: (
        period,
      ) => {
        set({
          activePeriod: period,
        });
      },

      setSelectedDate: (
        date,
      ) => {
        set({
          selectedDate: date,
        });
      },

      setFocusedTaskId: (
        taskId,
      ) => {
        set({
          focusedTaskId: taskId,
        });
      },

      addTask: async (
        input,
      ) => {
        const title =
          input.title.trim();

        if (!title) {
          return;
        }

        set({
          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          const now =
            new Date().toISOString();

          const offlineTask: OfflinePlannerTask =
            {
              userId,

              id: createTaskId(),

              title,

              description:
                input.description?.trim() ??
                "",

              period:
                input.period,

              quadrant:
                input.quadrant,

              dateKey:
                input.dateKey,

              parentTaskId:
                input.parentTaskId ??
                null,

              sourceGoalId:
                input.sourceGoalId ??
                null,

              completed: false,
              completedAt: null,

              createdAt: now,
              updatedAt: now,

              deletedAt: null,
            };

          // Ilki lokal database
          await saveOfflinePlannerTask(
            offlineTask,
            true,
          );

          // UI derrew täzelenýär
          set((state) => ({
            tasks: [
              offlineToPlannerTask(
                offlineTask,
              ),
              ...state.tasks,
            ],
          }));

          if (navigator.onLine) {
            void syncPlannerQueue().catch(
              (error) => {
                console.warn(
                  "Planner add sync failed:",
                  error,
                );
              },
            );
          }
        } catch (error) {
          set({
            error:
              getErrorMessage(error),
          });

          throw error;
        }
      },

      updateTask: async (
        taskId,
        input,
      ) => {
        set({
          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          const currentTask =
            get().tasks.find(
              (task) =>
                task.id === taskId,
            );

          if (!currentTask) {
            return;
          }

          const now =
            new Date().toISOString();

          const offlineTask: OfflinePlannerTask =
            {
              userId,

              ...currentTask,

              title:
                input.title !==
                undefined
                  ? input.title.trim()
                  : currentTask.title,

              description:
                input.description !==
                undefined
                  ? input.description.trim()
                  : currentTask.description,

              period:
                input.period ??
                currentTask.period,

              quadrant:
                input.quadrant ??
                currentTask.quadrant,

              dateKey:
                input.dateKey ??
                currentTask.dateKey,

              parentTaskId:
                input.parentTaskId !==
                undefined
                  ? input.parentTaskId
                  : currentTask.parentTaskId,

              sourceGoalId:
                input.sourceGoalId !==
                undefined
                  ? input.sourceGoalId
                  : currentTask.sourceGoalId,

              completed:
                input.completed ??
                currentTask.completed,

              completedAt:
                input.completedAt !==
                undefined
                  ? input.completedAt
                  : currentTask.completedAt,

              updatedAt: now,

              deletedAt: null,
            };

          await saveOfflinePlannerTask(
            offlineTask,
            true,
          );

          set((state) => ({
            tasks:
              state.tasks.map(
                (task) =>
                  task.id ===
                  taskId
                    ? offlineToPlannerTask(
                        offlineTask,
                      )
                    : task,
              ),
          }));

          if (navigator.onLine) {
            void syncPlannerQueue().catch(
              (error) => {
                console.warn(
                  "Planner update sync failed:",
                  error,
                );
              },
            );
          }
        } catch (error) {
          set({
            error:
              getErrorMessage(error),
          });

          throw error;
        }
      },

      deleteTask: async (
        taskId,
      ) => {
        const currentTasks =
          get().tasks;

        const taskIdsToDelete =
          new Set<string>();

        function collectChildren(
          id: string,
        ) {
          taskIdsToDelete.add(id);

          currentTasks
            .filter(
              (task) =>
                task.parentTaskId ===
                id,
            )
            .forEach((child) => {
              collectChildren(
                child.id,
              );
            });
        }

        collectChildren(taskId);

        set({
          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          await markOfflinePlannerTasksDeleted(
            userId,
            [
              ...taskIdsToDelete,
            ],
          );

          set((state) => ({
            tasks:
              state.tasks.filter(
                (task) =>
                  !taskIdsToDelete.has(
                    task.id,
                  ),
              ),

            focusedTaskId:
              state.focusedTaskId &&
              taskIdsToDelete.has(
                state.focusedTaskId,
              )
                ? null
                : state.focusedTaskId,
          }));

          if (navigator.onLine) {
            void syncPlannerQueue().catch(
              (error) => {
                console.warn(
                  "Planner delete sync failed:",
                  error,
                );
              },
            );
          }
        } catch (error) {
          set({
            error:
              getErrorMessage(error),
          });

          throw error;
        }
      },

      toggleTask: async (
        taskId,
      ) => {
        const task =
          get().tasks.find(
            (item) =>
              item.id === taskId,
          );

        if (!task) {
          return;
        }

        const completed =
          !task.completed;

        const completedAt =
          completed
            ? new Date().toISOString()
            : null;

        await get().updateTask(
          taskId,
          {
            completed,
            completedAt,
          },
        );
      },

      moveTask: async (
        taskId,
        quadrant,
      ) => {
        await get().updateTask(
          taskId,
          {
            quadrant,
          },
        );
      },

      linkTaskToParent: async (
        taskId,
        parentTaskId,
      ) => {
        if (
          taskId ===
          parentTaskId
        ) {
          return;
        }

        const tasks =
          get().tasks;

        const task =
          tasks.find(
            (item) =>
              item.id === taskId,
          );

        const parentTask =
          tasks.find(
            (item) =>
              item.id ===
              parentTaskId,
          );

        if (
          !task ||
          !parentTask
        ) {
          return;
        }

        const allowedParentPeriod: Record<
          PlannerPeriod,
          PlannerPeriod | null
        > = {
          daily: "weekly",
          weekly: "monthly",
          monthly: "yearly",
          yearly: null,
        };

        if (
          allowedParentPeriod[
            task.period
          ] !==
          parentTask.period
        ) {
          return;
        }

        await get().updateTask(
          taskId,
          {
            parentTaskId,
          },
        );
      },

      unlinkTaskFromParent:
        async (taskId) => {
          await get().updateTask(
            taskId,
            {
              parentTaskId: null,
            },
          );
        },

      clearCompletedTasks:
        async () => {
          const completedIds =
            get()
              .tasks
              .filter(
                (task) =>
                  task.completed,
              )
              .map(
                (task) =>
                  task.id,
              );

          if (
            completedIds.length ===
            0
          ) {
            return;
          }

          set({
            error: null,
          });

          try {
            const userId =
              await getCurrentUserId();

            await markOfflinePlannerTasksDeleted(
              userId,
              completedIds,
            );

            const completedSet =
              new Set(
                completedIds,
              );

            set((state) => ({
              tasks:
                state.tasks.filter(
                  (task) =>
                    !completedSet.has(
                      task.id,
                    ),
                ),
            }));

            if (
              navigator.onLine
            ) {
              void syncPlannerQueue().catch(
                (error) => {
                  console.warn(
                    "Planner clear completed sync failed:",
                    error,
                  );
                },
              );
            }
          } catch (error) {
            set({
              error:
                getErrorMessage(error),
            });

            throw error;
          }
        },

      resetPlanner: async () => {
        set({
          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          const allIds =
            get().tasks.map(
              (task) =>
                task.id,
            );

          if (
            allIds.length > 0
          ) {
            await markOfflinePlannerTasksDeleted(
              userId,
              allIds,
            );
          }

          set({
            ...createInitialState(),
            isInitialized: true,
          });

          if (
            navigator.onLine
          ) {
            void syncPlannerQueue().catch(
              (error) => {
                console.warn(
                  "Planner reset sync failed:",
                  error,
                );
              },
            );
          }
        } catch (error) {
          set({
            error:
              getErrorMessage(error),
          });

          throw error;
        }
      },

      clearLocalPlanner: () => {
        /*
         * Logout wagty diňe RAM arassalanýar.
         * IndexedDB cache galýar.
         */
        set({
          ...createInitialState(),
        });
      },
    }),
  );