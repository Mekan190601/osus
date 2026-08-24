import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  CreatePlannerTaskInput,
  EisenhowerQuadrant,
  PlannerPeriod,
  PlannerTask,
  UpdatePlannerTaskInput,
} from "../features/planner/types/planner.types";

type PlannerState = {
  tasks: PlannerTask[];

  activePeriod: PlannerPeriod;
  selectedDate: string;

  focusedTaskId: string | null;

  setActivePeriod: (period: PlannerPeriod) => void;
  setSelectedDate: (date: string) => void;
  setFocusedTaskId: (taskId: string | null) => void;

  addTask: (input: CreatePlannerTaskInput) => void;

  updateTask: (
    taskId: string,
    input: UpdatePlannerTaskInput,
  ) => void;

  deleteTask: (taskId: string) => void;

  toggleTask: (taskId: string) => void;

  moveTask: (
    taskId: string,
    quadrant: EisenhowerQuadrant,
  ) => void;

  linkTaskToParent: (
    taskId: string,
    parentTaskId: string,
  ) => void;

  unlinkTaskFromParent: (taskId: string) => void;

  clearCompletedTasks: () => void;

  resetPlanner: () => void;
};

const initialState = {
  tasks: [] as PlannerTask[],
  activePeriod: "daily" as PlannerPeriod,
  selectedDate: new Date().toISOString(),
  focusedTaskId: null,
};

function createTaskId() {
  return crypto.randomUUID();
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set) => ({
      ...initialState,

      setActivePeriod: (period) => {
        set({
          activePeriod: period,
        });
      },

      setSelectedDate: (date) => {
        set({
          selectedDate: date,
        });
      },

      setFocusedTaskId: (taskId) => {
        set({
          focusedTaskId: taskId,
        });
      },

      addTask: (input) => {
        const now = new Date().toISOString();

        const task: PlannerTask = {
          completedAt: null,
          id: createTaskId(),

          title: input.title.trim(),
          description:
            input.description?.trim() ?? "",

          period: input.period,
          quadrant: input.quadrant,
          dateKey: input.dateKey,

          parentTaskId:
  input.parentTaskId ?? null,

sourceGoalId:
  input.sourceGoalId ?? null,

completed: false,

          createdAt: now,
          updatedAt: now,
        };

        if (!task.title) {
          return;
        }

        set((state) => ({
          tasks: [task, ...state.tasks],
        }));
      },

      updateTask: (taskId, input) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...input,
                  title:
                    input.title !== undefined
                      ? input.title.trim()
                      : task.title,
                  description:
                    input.description !== undefined
                      ? input.description.trim()
                      : task.description,
                  updatedAt:
                    new Date().toISOString(),
                }
              : task,
          ),
        }));
      },

      deleteTask: (taskId) => {
  set((state) => {
    const taskIdsToDelete = new Set<string>();

    function collectTaskAndChildren(id: string) {
      taskIdsToDelete.add(id);

      state.tasks
        .filter((task) => task.parentTaskId === id)
        .forEach((childTask) => {
          collectTaskAndChildren(childTask.id);
        });
    }

    collectTaskAndChildren(taskId);

    return {
      tasks: state.tasks.filter(
        (task) => !taskIdsToDelete.has(task.id),
      ),

      focusedTaskId:
        state.focusedTaskId &&
        taskIdsToDelete.has(state.focusedTaskId)
          ? null
          : state.focusedTaskId,
    };
  });
},

      toggleTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                
                  ...task,
                  completed: !task.completed,
                  updatedAt:
                    new Date().toISOString(),
                    completedAt: task.completed ? null : new Date().toISOString(),
                }
              : task,
          ),
        }));
      },
    

      moveTask: (taskId, quadrant) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  quadrant,
                  updatedAt:
                    new Date().toISOString(),
                }
              : task,
          ),
        }));
      },

      linkTaskToParent: (taskId, parentTaskId) => {
  if (taskId === parentTaskId) {
    return;
  }

  set((state) => {
    const task = state.tasks.find(
      (item) => item.id === taskId,
    );

    const parentTask = state.tasks.find(
      (item) => item.id === parentTaskId,
    );

    if (!task || !parentTask) {
      return state;
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
      allowedParentPeriod[task.period] !==
      parentTask.period
    ) {
      return state;
    }

    return {
      tasks: state.tasks.map((item) =>
        item.id === taskId
          ? {
              ...item,
              parentTaskId,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    };
  });
},

      unlinkTaskFromParent: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  parentTaskId: null,
                  updatedAt:
                    new Date().toISOString(),
                }
              : task,
          ),
        }));
      },

      clearCompletedTasks: () => {
        set((state) => ({
          tasks: state.tasks.filter(
            (task) => !task.completed,
          ),
        }));
      },

      resetPlanner: () => {
        set(initialState);
      },
    }),
    {
      name: "osus-planner-storage",
      partialize: (state) => ({
        tasks: state.tasks,
        activePeriod: state.activePeriod,
        focusedTaskId: state.focusedTaskId,
      }),
    },
  ),
);