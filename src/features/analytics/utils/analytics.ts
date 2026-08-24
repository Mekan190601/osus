import type { PlannerTask } from "../../planner/types/planner.types";

export function calculateFinancialProgress(
  currentMoney: number,
  targetMoney: number,
): number {
  if (targetMoney <= 0) {
    return 0;
  }

  const progress =
    (currentMoney / targetMoney) * 100;

  return Math.round(
    Math.min(Math.max(progress, 0), 100),
  );
}

export function calculateTaskTreeProgress(
  tasks: PlannerTask[],
  taskId: string,
): number {
  const task = tasks.find(
    (item) => item.id === taskId,
  );

  if (!task) {
    return 0;
  }

  const children = tasks.filter(
    (item) => item.parentTaskId === taskId,
  );

  if (children.length === 0) {
    return task.completed ? 100 : 0;
  }

  const childrenProgress =
    children.reduce(
      (total, child) =>
        total +
        calculateTaskTreeProgress(
          tasks,
          child.id,
        ),
      0,
    ) / children.length;

  const ownProgress =
    task.completed ? 100 : 0;

  return Math.round(
    ownProgress * 0.5 +
      childrenProgress * 0.5,
  );
}

export function calculateExecutiveProgress(
  financialProgress: number,
  plannerProgress: number,
): number {
  return Math.round(
    financialProgress * 0.5 +
      plannerProgress * 0.5,
  );
}

export function calculateCompletionRate(
  tasks: PlannerTask[],
): number {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter(
    (task) => task.completed,
  ).length;

  return Math.round(
    (completedTasks / tasks.length) * 100,
  );
}

export function getPlannerTaskStats(
  tasks: PlannerTask[],
) {
  const completed = tasks.filter(
    (task) => task.completed,
  ).length;

  const pending =
    tasks.length - completed;

  const urgentImportant = tasks.filter(
    (task) =>
      task.quadrant === "urgent-important" &&
      !task.completed,
  ).length;

  const importantNotUrgent = tasks.filter(
    (task) =>
      task.quadrant ===
        "important-not-urgent" &&
      !task.completed,
  ).length;

  return {
    total: tasks.length,
    completed,
    pending,
    urgentImportant,
    importantNotUrgent,
    completionRate:
      calculateCompletionRate(tasks),
  };
}