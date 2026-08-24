import type {
  PlannerPeriod,
  PlannerTask,
} from "../types/planner.types";

export function getTaskChildren(
  tasks: PlannerTask[],
  parentTaskId: string,
) {
  return tasks.filter(
    (task) =>
      task.parentTaskId === parentTaskId,
  );
}

function calculateProgressInternal(
  tasks: PlannerTask[],
  taskId: string,
  visited: Set<string>,
): number {
  if (visited.has(taskId)) {
    return 0;
  }

  const task = tasks.find(
    (item) => item.id === taskId,
  );

  if (!task) {
    return 0;
  }

  const nextVisited =
    new Set(visited);

  nextVisited.add(taskId);

  const children =
    getTaskChildren(
      tasks,
      task.id,
    );

  if (children.length === 0) {
    return task.completed
      ? 100
      : 0;
  }

  const totalProgress =
    children.reduce(
      (total, child) =>
        total +
        calculateProgressInternal(
          tasks,
          child.id,
          nextVisited,
        ),
      0,
    );

  return Math.round(
    totalProgress /
      children.length,
  );
}

export function calculateTaskProgress(
  tasks: PlannerTask[],
  taskId: string,
): number {
  return calculateProgressInternal(
    tasks,
    taskId,
    new Set<string>(),
  );
}

/*
 * Köne funksiýa üýtgedilmedi.
 * Strategik progress ulanýan ýerleri
 * bozmazlyk üçin öňki logika saklanýar.
 */
export function getPeriodProgress(
  tasks: PlannerTask[],
  period: PlannerPeriod,
) {
  const periodTasks =
    tasks.filter(
      (task) =>
        task.period === period &&
        !task.parentTaskId,
    );

  if (
    periodTasks.length === 0
  ) {
    return 0;
  }

  const totalProgress =
    periodTasks.reduce(
      (total, task) =>
        total +
        calculateTaskProgress(
          tasks,
          task.id,
        ),
      0,
    );

  return Math.round(
    totalProgress /
      periodTasks.length,
  );
}

/*
 * Täze helper:
 * diňe berlen task sanawynyň
 * göni tamamlanma derejesini hasaplaýar.
 *
 * Hepdelik syn ýaly wagt boýunça
 * süzülen sanawlarda ulanmak üçin.
 */
export function getTasksCompletionProgress(
  tasks: PlannerTask[],
) {
  if (tasks.length === 0) {
    return 0;
  }

  const completed =
    tasks.filter(
      (task) => task.completed,
    ).length;

  return Math.round(
    (completed / tasks.length) *
      100,
  );
}

/*
 * Täze helper:
 * belli period + belli dateKey boýunça
 * root tasklaryň recursive progressini berýär.
 *
 * Köne getPeriodProgress-i üýtgetmeýär.
 */
export function getPeriodDateProgress(
  tasks: PlannerTask[],
  period: PlannerPeriod,
  dateKey: string,
) {
  const periodTasks =
    tasks.filter(
      (task) =>
        task.period === period &&
        task.dateKey === dateKey &&
        !task.parentTaskId,
    );

  if (periodTasks.length === 0) {
    return 0;
  }

  const totalProgress =
    periodTasks.reduce(
      (total, task) =>
        total +
        calculateTaskProgress(
          tasks,
          task.id,
        ),
      0,
    );

  return Math.round(
    totalProgress /
      periodTasks.length,
  );
}