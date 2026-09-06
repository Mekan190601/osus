import { offlineDb } from "./offlineDb";

import type {
  OfflineWeeklyReview,
  SyncQueueItem,
} from "./offlineDb";

/* =========================
   QUEUE HELPER
========================= */

async function findQueueItem(
  userId: string,
  reviewId: string,
) {
  return offlineDb.syncQueue
    .where("userId")
    .equals(userId)
    .filter(
      (item) =>
        item.entity === "weeklyReview" &&
        item.entityId === reviewId,
    )
    .first();
}

/* =========================
   GET
========================= */

export async function getOfflineWeeklyReviews(
  userId: string,
) {
  return offlineDb.weeklyReviews
    .where("userId")
    .equals(userId)
    .toArray();
}

export async function getOfflineWeeklyReview(
  userId: string,
  reviewId: string,
) {
  return offlineDb.weeklyReviews.get([
    userId,
    reviewId,
  ]);
}

/* =========================
   SAVE
========================= */

export async function saveOfflineWeeklyReview(
  review: OfflineWeeklyReview,
  addToQueue = true,
) {
  await offlineDb.transaction(
    "rw",
    offlineDb.weeklyReviews,
    offlineDb.syncQueue,
    async () => {
      await offlineDb.weeklyReviews.put(
        review,
      );

      if (!addToQueue) {
        return;
      }

      const existingQueueItem =
        await findQueueItem(
          review.userId,
          review.id,
        );

      const queueItem: SyncQueueItem = {
        userId: review.userId,

        entity: "weeklyReview",
        entityId: review.id,

        operation: review.deletedAt
          ? "delete"
          : "upsert",

        payload: review,

        createdAt:
          new Date().toISOString(),

        attempts: 0,
      };

      if (
        existingQueueItem?.id !==
        undefined
      ) {
        await offlineDb.syncQueue.put({
          ...queueItem,
          id: existingQueueItem.id,
        });
      } else {
        await offlineDb.syncQueue.add(
          queueItem,
        );
      }
    },
  );
}

export async function saveOfflineWeeklyReviews(
  reviews: OfflineWeeklyReview[],
  addToQueue = false,
) {
  for (const review of reviews) {
    await saveOfflineWeeklyReview(
      review,
      addToQueue,
    );
  }
}

/* =========================
   DELETE
========================= */

export async function markOfflineWeeklyReviewDeleted(
  userId: string,
  reviewId: string,
) {
  const existing =
    await getOfflineWeeklyReview(
      userId,
      reviewId,
    );

  if (!existing) {
    return null;
  }

  const now =
    new Date().toISOString();

  const deletedReview: OfflineWeeklyReview =
    {
      ...existing,
      updatedAt: now,
      deletedAt: now,
    };

  await saveOfflineWeeklyReview(
    deletedReview,
    true,
  );

  return deletedReview;
}

export async function markAllOfflineWeeklyReviewsDeleted(
  userId: string,
) {
  const reviews =
    await getOfflineWeeklyReviews(
      userId,
    );

  const now =
    new Date().toISOString();

  for (const review of reviews) {
    if (review.deletedAt) {
      continue;
    }

    await saveOfflineWeeklyReview(
      {
        ...review,
        updatedAt: now,
        deletedAt: now,
      },
      true,
    );
  }
}

/* =========================
   VISIBLE
========================= */

export async function getVisibleOfflineWeeklyReviews(
  userId: string,
) {
  const reviews =
    await getOfflineWeeklyReviews(
      userId,
    );

  return reviews
    .filter(
      (review) =>
        !review.deletedAt,
    )
    .sort(
      (a, b) =>
        new Date(
          b.createdAt,
        ).getTime() -
        new Date(
          a.createdAt,
        ).getTime(),
    );
}