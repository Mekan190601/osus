export type PlannerPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export type EisenhowerQuadrant =
  | "urgent-important"
  | "important-not-urgent"
  | "urgent-not-important"
  | "not-urgent-not-important";

export type PlannerTask = {
  id: string;

  title: string;
  description: string;

  period: PlannerPeriod;
  quadrant: EisenhowerQuadrant;
  dateKey: string;

  parentTaskId: string | null;

  sourceGoalId: string | null;

  completedAt: string | null;

  completed: boolean;

  createdAt: string;
  updatedAt: string;
};

export type CreatePlannerTaskInput = {
  title: string;
  description?: string;

  period: PlannerPeriod;
  quadrant: EisenhowerQuadrant;
  dateKey: string;

  parentTaskId?: string | null;

  sourceGoalId?: string | null;
};

export type UpdatePlannerTaskInput = Partial<
  Pick<
    PlannerTask,
    | "title"
    | "description"
    | "period"
    | "quadrant"
    | "completed"
    | "parentTaskId"
    | "sourceGoalId"
  >
>;