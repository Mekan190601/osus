import type { PlannerTask } from "../../planner/types/planner.types";

type WeeklyReviewInput = {
  tasks: PlannerTask[];

  monthlyIncome: number;
  monthlyExpense: number;

  financialProgress: number;
  plannerProgress: number;
};

export type WeeklyReviewResult = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;

  completionRate: number;

  monthlyNetIncome: number;

  financialProgress: number;
  plannerProgress: number;

  strongestArea:
    | "planner"
    | "finance"
    | "balanced";

  nextFocus:
    | "execution"
    | "finance"
    | "balance"
    | "maintain";
};

export function createWeeklyReview({
  tasks,
  monthlyIncome,
  monthlyExpense,
  financialProgress,
  plannerProgress,
}: WeeklyReviewInput): WeeklyReviewResult {
  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(
      (task) => task.completed,
    ).length;

  const pendingTasks =
    totalTasks - completedTasks;

  const completionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) *
            100,
        )
      : 0;

  const monthlyNetIncome =
    monthlyIncome - monthlyExpense;

  let strongestArea:
    WeeklyReviewResult["strongestArea"] =
      "balanced";

  if (
    plannerProgress >
    financialProgress + 10
  ) {
    strongestArea = "planner";
  } else if (
    financialProgress >
    plannerProgress + 10
  ) {
    strongestArea = "finance";
  }

  let nextFocus:
    WeeklyReviewResult["nextFocus"] =
      "maintain";

  if (
    completionRate < 50 &&
    plannerProgress <
      financialProgress
  ) {
    nextFocus = "execution";
  } else if (
    monthlyNetIncome <= 0 ||
    financialProgress <
      plannerProgress - 15
  ) {
    nextFocus = "finance";
  } else if (
    Math.abs(
      financialProgress -
        plannerProgress,
    ) <= 15 &&
    completionRate < 70
  ) {
    nextFocus = "balance";
  }

  return {
    totalTasks,
    completedTasks,
    pendingTasks,

    completionRate,

    monthlyNetIncome,

    financialProgress,
    plannerProgress,

    strongestArea,
    nextFocus,
  };
}