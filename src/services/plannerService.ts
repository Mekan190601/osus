import { supabase } from "./supabase";

import type {
  EisenhowerQuadrant,
  PlannerPeriod,
  PlannerTask,
} from "../features/planner/types/planner.types";

export type PlannerTaskUpdate = {
  title?: string;
  description?: string;

  period?: PlannerPeriod;
  quadrant?: EisenhowerQuadrant;

  dateKey?: string;

  parentTaskId?: string | null;
  sourceGoalId?: string | null;

  completed?: boolean;
  completedAt?: string | null;

  updatedAt?: string;
};

export type PlannerTaskWithSync = PlannerTask & {
  deletedAt: string | null;
};

type PlannerTaskRow = {
  id: string;
  user_id: string;

  title: string;
  description: string;

  period: PlannerPeriod;
  quadrant: EisenhowerQuadrant;
  date_key: string;

  parent_task_id: string | null;
  source_goal_id: string | null;

  completed: boolean;
  completed_at: string | null;

  created_at: string;
  updated_at: string;

  deleted_at: string | null;
};

async function getUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error(
      "Ulanyjy hasaba girmändir.",
    );
  }

  return user.id;
}

function mapTaskRow(
  row: PlannerTaskRow,
): PlannerTaskWithSync {
  return {
    id: row.id,

    title: row.title,
    description: row.description,

    period: row.period,
    quadrant: row.quadrant,
    dateKey: row.date_key,

    parentTaskId:
      row.parent_task_id,

    sourceGoalId:
      row.source_goal_id,

    completed: row.completed,
    completedAt:
      row.completed_at,

    createdAt: row.created_at,
    updatedAt: row.updated_at,

    deletedAt:
      row.deleted_at ?? null,
  };
}

/* =========================
   GET
========================= */

export async function getPlannerTasks() {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("planner_tasks")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    mapTaskRow(
      row as PlannerTaskRow,
    ),
  );
}

/*
 * Sync üçin deleted ýazgylary hem
 * goşup ähli cloud task-lary alýar.
 */
export async function getAllPlannerTasksForSync() {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("planner_tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    mapTaskRow(
      row as PlannerTaskRow,
    ),
  );
}

/* =========================
   UPSERT
========================= */

export async function savePlannerTask(
  task: PlannerTaskWithSync,
) {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("planner_tasks")
    .upsert(
      {
        id: task.id,
        user_id: userId,

        title: task.title.trim(),

        description:
          task.description.trim(),

        period: task.period,
        quadrant: task.quadrant,

        date_key: task.dateKey,

        parent_task_id:
          task.parentTaskId,

        source_goal_id:
          task.sourceGoalId,

        completed:
          task.completed,

        completed_at:
          task.completedAt,

        created_at:
          task.createdAt,

        updated_at:
          task.updatedAt,

        deleted_at:
          task.deletedAt,
      },
      {
        onConflict: "id",
      },
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapTaskRow(
    data as PlannerTaskRow,
  );
}

/* =========================
   CREATE
========================= */

export async function createPlannerTask(
  task: PlannerTask,
) {
  return savePlannerTask({
    ...task,
    deletedAt: null,
  });
}

/* =========================
   UPDATE
========================= */

export async function updatePlannerTask(
  taskId: string,
  input: PlannerTaskUpdate,
) {
  const userId = await getUserId();

  const updateData: Record<
    string,
    unknown
  > = {
    updated_at:
      input.updatedAt ??
      new Date().toISOString(),
  };

  if (input.title !== undefined) {
    updateData.title =
      input.title.trim();
  }

  if (
    input.description !== undefined
  ) {
    updateData.description =
      input.description.trim();
  }

  if (input.period !== undefined) {
    updateData.period =
      input.period;
  }

  if (
    input.quadrant !== undefined
  ) {
    updateData.quadrant =
      input.quadrant;
  }

  if (input.dateKey !== undefined) {
    updateData.date_key =
      input.dateKey;
  }

  if (
    input.parentTaskId !== undefined
  ) {
    updateData.parent_task_id =
      input.parentTaskId;
  }

  if (
    input.sourceGoalId !== undefined
  ) {
    updateData.source_goal_id =
      input.sourceGoalId;
  }

  if (
    input.completed !== undefined
  ) {
    updateData.completed =
      input.completed;
  }

  if (
    input.completedAt !== undefined
  ) {
    updateData.completed_at =
      input.completedAt;
  }

  const { data, error } =
    await supabase
      .from("planner_tasks")
      .update(updateData)
      .eq("id", taskId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return mapTaskRow(
    data as PlannerTaskRow,
  );
}

/* =========================
   SOFT DELETE
========================= */

export async function deletePlannerTask(
  taskId: string,
  updatedAt = new Date().toISOString(),
) {
  const userId = await getUserId();

  const { error } = await supabase
    .from("planner_tasks")
    .update({
      deleted_at: updatedAt,
      updated_at: updatedAt,
    })
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

/* =========================
   EXISTING HELPERS
========================= */

export async function updatePlannerTaskQuadrant(
  taskId: string,
  quadrant: EisenhowerQuadrant,
) {
  return updatePlannerTask(
    taskId,
    {
      quadrant,
    },
  );
}

export async function linkPlannerTaskToParent(
  taskId: string,
  parentTaskId: string,
) {
  return updatePlannerTask(
    taskId,
    {
      parentTaskId,
    },
  );
}

export async function unlinkPlannerTaskFromParent(
  taskId: string,
) {
  return updatePlannerTask(
    taskId,
    {
      parentTaskId: null,
    },
  );
}

/* =========================
   CLEAR COMPLETED
========================= */

export async function clearCompletedPlannerTasks() {
  const userId = await getUserId();

  const now =
    new Date().toISOString();

  const { error } = await supabase
    .from("planner_tasks")
    .update({
      deleted_at: now,
      updated_at: now,
    })
    .eq("user_id", userId)
    .eq("completed", true)
    .is("deleted_at", null);

  if (error) {
    throw error;
  }
}

/* =========================
   DELETE ALL
========================= */

export async function deleteAllPlannerTasks() {
  const userId = await getUserId();

  const now =
    new Date().toISOString();

  const { error } = await supabase
    .from("planner_tasks")
    .update({
      deleted_at: now,
      updated_at: now,
    })
    .eq("user_id", userId)
    .is("deleted_at", null);

  if (error) {
    throw error;
  }
}