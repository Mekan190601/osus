import { supabase } from "./supabase";
import { offlineDb } from "./offlineDb";

import {
  getOfflineWeeklyReviews,
  saveOfflineWeeklyReview,
} from "./offlineWeeklyReviewService";

import {
  deleteWeeklyReview,
  getAllWeeklyReviewsForSync,
  saveWeeklyReview,
} from "./weeklyReviewService";

import type {
  OfflineWeeklyReview,
  SyncQueueItem,
} from "./offlineDb";

import type {
  WeeklyReviewRow,
} from "./weeklyReviewService";

/* =========================
   TYPE GUARD
========================= */

function isWeeklyReviewQueueItem(
  item: SyncQueueItem,
): item is SyncQueueItem & {
  entity: "weeklyReview";
  payload: OfflineWeeklyReview | null;
} {
  return item.entity === "weeklyReview";
}

/* =========================
   USER
========================= */

async function getCurrentUserId() {
  const {
    data: { session },
    error,
  } =
    await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.user) {
    throw new Error(
      "Ulanyjy hasaba girmändir.",
    );
  }

  return session.user.id;
}

/* =========================
   HELPERS
========================= */

function toTimestamp(
  value: string | null | undefined,
) {
  if (!value) return 0;

  const timestamp =
    new Date(value).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : 0;
}

function rowToOffline(
  row: WeeklyReviewRow,
): OfflineWeeklyReview {
  return {
    userId: row.user_id,
    id: row.id,

    weekKey: row.week_key,

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

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,

    deletedAt:
      row.deleted_at ?? null,
  };
}

/* =========================
   PUSH
========================= */

export async function syncWeeklyReviewQueue() {
  if (!navigator.onLine) {
    return;
  }

  const userId =
    await getCurrentUserId();

  const queue =
    await offlineDb.syncQueue
      .where("userId")
      .equals(userId)
      .toArray();

  const reviewQueue =
    queue.filter(
      isWeeklyReviewQueueItem,
    );

  for (const item of reviewQueue) {
    if (item.id === undefined) {
      continue;
    }

    try {
      const payload =
        item.payload;

      if (!payload) {
        await offlineDb.syncQueue.delete(
          item.id,
        );

        continue;
      }

      if (
        item.operation === "delete" ||
        payload.deletedAt
      ) {
        await deleteWeeklyReview(
          payload.id,
          payload.updatedAt,
        );
      } else {
        await saveWeeklyReview({
          id: payload.id,
          weekKey:
            payload.weekKey,
          createdAt:
            payload.createdAt,

          totalTasks:
            payload.totalTasks,
          completedTasks:
            payload.completedTasks,
          pendingTasks:
            payload.pendingTasks,
          completionRate:
            payload.completionRate,

          monthlyNetIncome:
            payload.monthlyNetIncome,

          financialProgress:
            payload.financialProgress,
          plannerProgress:
            payload.plannerProgress,
          overallProgress:
            payload.overallProgress,

          note:
            payload.note,

          updatedAt:
            payload.updatedAt,

          deletedAt:
            payload.deletedAt,
        });
      }

      await offlineDb.syncQueue.delete(
        item.id,
      );
    } catch (error) {
      console.warn(
        "Weekly review sync failed:",
        error,
      );

      await offlineDb.syncQueue.update(
        item.id,
        {
          attempts:
            item.attempts + 1,
        },
      );
    }
  }
}

/* =========================
   PULL
========================= */

export async function pullWeeklyReviewsFromCloud() {
  const userId =
    await getCurrentUserId();

  const [
    cloudReviews,
    localReviews,
    queue,
  ] = await Promise.all([
    getAllWeeklyReviewsForSync(),

    getOfflineWeeklyReviews(
      userId,
    ),

    offlineDb.syncQueue
      .where("userId")
      .equals(userId)
      .toArray(),
  ]);

  const pendingIds =
    new Set(
      queue
        .filter(
          isWeeklyReviewQueueItem,
        )
        .map(
          (item) =>
            item.entityId,
        ),
    );

  const localMap =
    new Map(
      localReviews.map(
        (review) => [
          review.id,
          review,
        ],
      ),
    );

  for (
    const cloudReview
    of cloudReviews
  ) {
    if (
      pendingIds.has(
        cloudReview.id,
      )
    ) {
      continue;
    }

    const cloudOffline =
      rowToOffline(
        cloudReview,
      );

    const local =
      localMap.get(
        cloudReview.id,
      );

    if (!local) {
      await saveOfflineWeeklyReview(
        cloudOffline,
        false,
      );

      continue;
    }

    if (
      toTimestamp(
        cloudOffline.updatedAt,
      ) >=
      toTimestamp(
        local.updatedAt,
      )
    ) {
      await saveOfflineWeeklyReview(
        cloudOffline,
        false,
      );
    }
  }

  return getOfflineWeeklyReviews(
    userId,
  );
}

/* =========================
   INITIALIZE
========================= */

export async function initializeWeeklyReviewSync() {
  const userId =
    await getCurrentUserId();

  const localReviews =
    await getOfflineWeeklyReviews(
      userId,
    );

  if (!navigator.onLine) {
    return localReviews;
  }

  await syncWeeklyReviewQueue();

  return pullWeeklyReviewsFromCloud();
}

/* =========================
   VISIBLE
========================= */

export async function getSyncedWeeklyReviews() {
  const reviews =
    await initializeWeeklyReviewSync();

  return reviews
    .filter(
      (review) =>
        !review.deletedAt,
    )
    .sort(
      (a, b) =>
        toTimestamp(
          b.createdAt,
        ) -
        toTimestamp(
          a.createdAt,
        ),
    );
}