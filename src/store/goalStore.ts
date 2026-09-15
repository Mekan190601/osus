import { create } from "zustand";

import {
  getCurrentUserId,
} from "../services/auth";

import {
  getOfflineGoal,
  markOfflineGoalDeleted,
  saveOfflineGoal,
} from "../services/offlineGoalService";

import {
  initializeGoalSync,
  syncGoalQueue,
} from "../services/goalSyncService";

type GoalState = {
  goalId: string;

  mainGoal: string;
  targetMoney: number;
  currentMoney: number;
  deadline: string;

  isLoading: boolean;
  isSaving: boolean;
  isInitialized: boolean;

  error: string | null;

  setMainGoal: (value: string) => void;
  setTargetMoney: (value: number) => void;
  setCurrentMoney: (value: number) => void;
  setDeadline: (value: string) => void;

  loadGoal: () => Promise<void>;

  updateGoal: (data: {
    mainGoal: string;
    targetMoney: number;
    currentMoney: number;
    deadline: string;
  }) => Promise<void>;

  resetGoal: () => Promise<void>;

  clearLocalGoal: () => void;
};

const initialState = {
  goalId: "primary-goal",

  mainGoal: "",
  targetMoney: 0,
  currentMoney: 0,
  deadline: "",

  isLoading: false,
  isSaving: false,
  isInitialized: false,

  error: null as string | null,
};

function getErrorMessage(
  error: unknown,
) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Näbelli ýalňyşlyk ýüze çykdy.";
}

export const useGoalStore =
  create<GoalState>()((set, get) => ({
    ...initialState,

    setMainGoal: (value) => {
      set({
        mainGoal: value.trim(),
      });
    },

    setTargetMoney: (value) => {
      set({
        targetMoney:
          Math.max(0, value),
      });
    },

    setCurrentMoney: (value) => {
      set({
        currentMoney:
          Math.max(0, value),
      });
    },

    setDeadline: (value) => {
      set({
        deadline: value,
      });
    },

    loadGoal: async () => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const userId =
          await getCurrentUserId();

        /*
         * OFFLINE-FIRST:
         * Ilki IndexedDB-däki maglumat alynýar.
         */
        const localGoal =
          await getOfflineGoal(
            userId,
            "primary-goal",
          );

        if (
          localGoal &&
          !localGoal.deletedAt
        ) {
          set({
            goalId:
              localGoal.goalId,

            mainGoal:
              localGoal.mainGoal,

            targetMoney:
              localGoal.targetMoney,

            currentMoney:
              localGoal.currentMoney,

            deadline:
              localGoal.deadline,

            isInitialized: true,
            error: null,
          });
        } else {
          set({
            ...initialState,
            isLoading: true,
            isInitialized: true,
          });
        }

        /*
         * Diňe internet bar wagty
         * cloud sync edilýär.
         *
         * Cloud şowsuz bolsa lokal
         * maglumat ekranda galýar.
         */
        if (navigator.onLine) {
          try {
            const syncedGoal =
              await initializeGoalSync();

            if (
              syncedGoal &&
              !syncedGoal.deletedAt
            ) {
              set({
                goalId:
                  syncedGoal.goalId,

                mainGoal:
                  syncedGoal.mainGoal,

                targetMoney:
                  syncedGoal.targetMoney,

                currentMoney:
                  syncedGoal.currentMoney,

                deadline:
                  syncedGoal.deadline,

                isInitialized: true,
                error: null,
              });
            } else if (
              syncedGoal?.deletedAt
            ) {
              set({
                ...initialState,
                isLoading: true,
                isInitialized: true,
              });
            }
          } catch (error) {
            console.warn(
              "Goal cloud sync failed:",
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

    updateGoal: async (data) => {
      set({
        isSaving: true,
        error: null,
      });

      try {
        const userId =
          await getCurrentUserId();

        const now =
          new Date().toISOString();

        const nextGoal = {
          userId,

          goalId:
            get().goalId,

          mainGoal:
            data.mainGoal.trim(),

          targetMoney:
            Math.max(
              0,
              data.targetMoney,
            ),

          currentMoney:
            Math.max(
              0,
              data.currentMoney,
            ),

          deadline:
            data.deadline,

          updatedAt: now,

          deletedAt: null,
        };

        /*
         * Ilki IndexedDB.
         * Internet bolmasa-da maglumat
         * lokal saklanýar.
         */
        await saveOfflineGoal(
          nextGoal,
          true,
        );

        /*
         * UI derrew täzelenýär.
         */
        set({
          goalId:
            nextGoal.goalId,

          mainGoal:
            nextGoal.mainGoal,

          targetMoney:
            nextGoal.targetMoney,

          currentMoney:
            nextGoal.currentMoney,

          deadline:
            nextGoal.deadline,

          isInitialized: true,
        });

        /*
         * Internet bar bolsa background sync.
         */
        if (navigator.onLine) {
          void syncGoalQueue().catch(
            (error) => {
              console.warn(
                "Goal background sync failed:",
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
      } finally {
        set({
          isSaving: false,
        });
      }
    },

    resetGoal: async () => {
      set({
        isSaving: true,
        error: null,
      });

      try {
        const userId =
          await getCurrentUserId();

        /*
         * Fiziki pozma ýok.
         * Lokal tombstone döredilýär.
         */
        await markOfflineGoalDeleted(
          userId,
          get().goalId,
        );

        /*
         * UI-den derrew aýrylýar.
         */
        set({
          ...initialState,

          isSaving: true,
          isInitialized: true,
        });

        /*
         * Internet bar bolsa cloud-a
         * background delete sync.
         */
        if (navigator.onLine) {
          void syncGoalQueue().catch(
            (error) => {
              console.warn(
                "Goal delete sync failed:",
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
      } finally {
        set({
          isSaving: false,
        });
      }
    },

    clearLocalGoal: () => {
      /*
       * Logout wagty diňe Zustand RAM
       * arassalanýar.
       *
       * IndexedDB cache saklanýar.
       */
      set({
        ...initialState,
      });
    },
  }));