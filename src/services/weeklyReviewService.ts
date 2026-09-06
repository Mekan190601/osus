import { supabase } from "./supabase";

import type {
  WeeklyReviewSnapshot,
} from "../store/weeklyReviewStore";

export type WeeklyReviewRow = {
  id: string;
  user_id: string;
  week_key: string;

  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  completion_rate: number;

  monthly_net_income: number;

  financial_progress: number;
  planner_progress: number;
  overall_progress: number;

  note: string;

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

export function mapReviewRow(
  row: WeeklyReviewRow,
): WeeklyReviewSnapshot {
  return {
    id: row.id,
    weekKey: row.week_key,
    createdAt: row.created_at,

    totalTasks:
      Number(row.total_tasks),

    completedTasks:
      Number(row.completed_tasks),

    pendingTasks:
      Number(row.pending_tasks),

    completionRate:
      Number(row.completion_rate),

    monthlyNetIncome:
      Number(
        row.monthly_net_income,
      ),

    financialProgress:
      Number(
        row.financial_progress,
      ),

    plannerProgress:
      Number(
        row.planner_progress,
      ),

    overallProgress:
      Number(
        row.overall_progress,
      ),

    note: row.note,
  };
}

/* =========================
   GET VISIBLE
========================= */

export async function getWeeklyReviews() {
  const userId =
    await getUserId();

  const { data, error } =
    await supabase
      .from("weekly_reviews")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return (data ?? []).map(
    (row) =>
      mapReviewRow(
        row as WeeklyReviewRow,
      ),
  );
}

/* =========================
   GET ALL FOR SYNC
========================= */

export async function getAllWeeklyReviewsForSync() {
  const userId =
    await getUserId();

  const { data, error } =
    await supabase
      .from("weekly_reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return (
    data ?? []
  ) as WeeklyReviewRow[];
}

/* =========================
   UPSERT
========================= */

export async function saveWeeklyReview(
  review: WeeklyReviewSnapshot & {
    updatedAt?: string;
    deletedAt?: string | null;
  },
) {
  const userId =
    await getUserId();

  const updatedAt =
    review.updatedAt ??
    new Date().toISOString();

  const { data, error } =
    await supabase
      .from("weekly_reviews")
      .upsert(
        {
          id: review.id,
          user_id: userId,
          week_key:
            review.weekKey,

          total_tasks:
            Math.max(
              0,
              review.totalTasks,
            ),

          completed_tasks:
            Math.max(
              0,
              review.completedTasks,
            ),

          pending_tasks:
            Math.max(
              0,
              review.pendingTasks,
            ),

          completion_rate:
            review.completionRate,

          monthly_net_income:
            review.monthlyNetIncome,

          financial_progress:
            review.financialProgress,

          planner_progress:
            review.plannerProgress,

          overall_progress:
            review.overallProgress,

          note:
            review.note.trim(),

          created_at:
            review.createdAt,

          updated_at:
            updatedAt,

          deleted_at:
            review.deletedAt ??
            null,
        },
        {
          onConflict:
            "user_id,week_key",
        },
      )
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return mapReviewRow(
    data as WeeklyReviewRow,
  );
}

/* =========================
   NOTE UPDATE
========================= */

export async function updateWeeklyReviewNote(
  reviewId: string,
  note: string,
) {
  const userId =
    await getUserId();

  const { data, error } =
    await supabase
      .from("weekly_reviews")
      .update({
        note:
          note.trim(),

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", reviewId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return mapReviewRow(
    data as WeeklyReviewRow,
  );
}

/* =========================
   SOFT DELETE
========================= */

export async function deleteWeeklyReview(
  reviewId: string,
  updatedAt =
    new Date().toISOString(),
) {
  const userId =
    await getUserId();

  const { error } =
    await supabase
      .from("weekly_reviews")
      .update({
        deleted_at:
          updatedAt,

        updated_at:
          updatedAt,
      })
      .eq("id", reviewId)
      .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

/* =========================
   SOFT DELETE ALL
========================= */

export async function deleteAllWeeklyReviews(
  updatedAt =
    new Date().toISOString(),
) {
  const userId =
    await getUserId();

  const { error } =
    await supabase
      .from("weekly_reviews")
      .update({
        deleted_at:
          updatedAt,

        updated_at:
          updatedAt,
      })
      .eq("user_id", userId)
      .is("deleted_at", null);

  if (error) {
    throw error;
  }
}