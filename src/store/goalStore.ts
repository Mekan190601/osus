import { create } from "zustand";
import { persist } from "zustand/middleware";

type GoalState = {
  goalId: string;

  mainGoal: string;
  targetMoney: number;
  currentMoney: number;
  deadline: string;

  setMainGoal: (value: string) => void;
  setTargetMoney: (value: number) => void;
  setCurrentMoney: (value: number) => void;
  setDeadline: (value: string) => void;

  updateGoal: (data: {
    mainGoal: string;
    targetMoney: number;
    currentMoney: number;
    deadline: string;
  }) => void;

  resetGoal: () => void;
};

const initialState = {
  goalId: "primary-goal",

  mainGoal: "",
  targetMoney: 0,
  currentMoney: 0,
  deadline: "",
};

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      ...initialState,

      setMainGoal: (value) => {
        set({
          mainGoal: value.trim(),
        });
      },

      setTargetMoney: (value) => {
        set({
          targetMoney: Math.max(0, value),
        });
      },

      setCurrentMoney: (value) => {
        set({
          currentMoney: Math.max(0, value),
        });
      },

      setDeadline: (value) => {
        set({
          deadline: value,
        });
      },

      updateGoal: (data) => {
        set({
          mainGoal: data.mainGoal.trim(),
          targetMoney: Math.max(0, data.targetMoney),
          currentMoney: Math.max(0, data.currentMoney),
          deadline: data.deadline,
        });
      },

      resetGoal: () => {
        set(initialState);
      },
    }),
    {
      name: "osus-goal-storage",
    },
  ),
);