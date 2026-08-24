import type { PlannerTask } from "../../planner/types/planner.types";
import {
  calculateCompletionRate,
  calculateFinancialProgress,
  getPlannerTaskStats,
} from "../../analytics/utils/analytics";

export type CoachMetrics = {
  financialProgress: number;

  monthlyNetIncome: number;
  remainingMoney: number;

  completionRate: number;

  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;

  urgentImportantTasks: number;
  importantNotUrgentTasks: number;
};

type CreateCoachMetricsInput = {
  targetMoney: number;
  currentMoney: number;

  monthlyIncome: number;
  monthlyExpense: number;

  tasks: PlannerTask[];
};

export function createCoachMetrics({
  targetMoney,
  currentMoney,
  monthlyIncome,
  monthlyExpense,
  tasks,
}: CreateCoachMetricsInput): CoachMetrics {
  const financialProgress =
    calculateFinancialProgress(
      currentMoney,
      targetMoney,
    );

  const monthlyNetIncome =
    monthlyIncome - monthlyExpense;

  const remainingMoney = Math.max(
    targetMoney - currentMoney,
    0,
  );

  const plannerStats =
    getPlannerTaskStats(tasks);

  const completionRate =
    calculateCompletionRate(tasks);

  return {
    financialProgress,

    monthlyNetIncome,
    remainingMoney,

    completionRate,

    totalTasks: plannerStats.total,
    completedTasks: plannerStats.completed,
    pendingTasks: plannerStats.pending,

    urgentImportantTasks:
      plannerStats.urgentImportant,

    importantNotUrgentTasks:
      plannerStats.importantNotUrgent,
  };
}