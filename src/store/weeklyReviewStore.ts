import { create } from "zustand";

import { supabase } from "../services/supabase";

import {
  getOfflineWeeklyReview,
  getVisibleOfflineWeeklyReviews,
  markAllOfflineWeeklyReviewsDeleted,
  markOfflineWeeklyReviewDeleted,
  saveOfflineWeeklyReview,
} from "../services/offlineWeeklyReviewService";

import {
  getSyncedWeeklyReviews,
  syncWeeklyReviewQueue,
} from "../services/weeklyReviewSyncService";

import type {
  OfflineWeeklyReview,
} from "../services/offlineDb";

export type WeeklyReviewSnapshot = {
  id: string;

  weekKey: string;
  createdAt: string;

  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;

  monthlyNetIncome: number;

  financialProgress: number;
  plannerProgress: number;
  overallProgress: number;

  note: string;
};

type SaveWeeklyReviewInput = Omit<
  WeeklyReviewSnapshot,
  "id" | "createdAt"
>;

type WeeklyReviewState = {
  reviews: WeeklyReviewSnapshot[];

  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  loadReviews: () => Promise<void>;

  saveReview: (
    review: SaveWeeklyReviewInput,
  ) => Promise<void>;

  updateNote: (
    reviewId: string,
    note: string,
  ) => Promise<void>;

  deleteReview: (
    reviewId: string,
  ) => Promise<void>;

  clearReviews: () => Promise<void>;

  clearLocalReviews: () => void;
};

const initialState = {
  reviews:
    [] as WeeklyReviewSnapshot[],

  isLoading: false,
  isInitialized: false,
  error: null as string | null,
};

function createReviewId() {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function getErrorMessage(
  error: unknown,
) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Näbelli ýalňyşlyk ýüze çykdy.";
}

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

function toSnapshot(
  review: OfflineWeeklyReview,
): WeeklyReviewSnapshot {
  return {
    id: review.id,

    weekKey:
      review.weekKey,

    createdAt:
      review.createdAt,

    totalTasks:
      review.totalTasks,

    completedTasks:
      review.completedTasks,

    pendingTasks:
      review.pendingTasks,

    completionRate:
      review.completionRate,

    monthlyNetIncome:
      review.monthlyNetIncome,

    financialProgress:
      review.financialProgress,

    plannerProgress:
      review.plannerProgress,

    overallProgress:
      review.overallProgress,

    note:
      review.note,
  };
}

export const useWeeklyReviewStore =
  create<WeeklyReviewState>()(
    (set, get) => ({
      ...initialState,

      /* =========================
         LOAD
      ========================= */

      loadReviews: async () => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          const localReviews =
            await getVisibleOfflineWeeklyReviews(
              userId,
            );

          set({
            reviews:
              localReviews.map(
                toSnapshot,
              ),

            isInitialized: true,
          });

          if (navigator.onLine) {
            try {
              const synced =
                await getSyncedWeeklyReviews();

              set({
                reviews:
                  synced.map(
                    toSnapshot,
                  ),

                error: null,
              });
            } catch (error) {
              console.warn(
                "Weekly review cloud sync failed:",
                error,
              );
            }
          }
        } catch (error) {
          set({
            error:
              getErrorMessage(error),

            isInitialized: true,
          });
        } finally {
          set({
            isLoading: false,
          });
        }
      },

      /* =========================
         SAVE
      ========================= */

      saveReview: async (
        review,
      ) => {
        try {
          const userId =
            await getCurrentUserId();

          const existingReview =
            get().reviews.find(
              (item) =>
                item.weekKey ===
                review.weekKey,
            );

          const now =
            new Date().toISOString();

          const offlineReview:
            OfflineWeeklyReview = {
              userId,

              id:
                existingReview?.id ??
                createReviewId(),

              weekKey:
                review.weekKey,

              totalTasks:
                review.totalTasks,

              completedTasks:
                review.completedTasks,

              pendingTasks:
                review.pendingTasks,

              completionRate:
                review.completionRate,

              monthlyNetIncome:
                review.monthlyNetIncome,

              financialProgress:
                review.financialProgress,

              plannerProgress:
                review.plannerProgress,

              overallProgress:
                review.overallProgress,

              note:
                review.note,

              createdAt:
                existingReview?.createdAt ??
                now,

              updatedAt: now,

              deletedAt: null,
            };

          await saveOfflineWeeklyReview(
            offlineReview,
            true,
          );

          set((state) => {
            const snapshot =
              toSnapshot(
                offlineReview,
              );

            const exists =
              state.reviews.some(
                (item) =>
                  item.weekKey ===
                  snapshot.weekKey,
              );

            if (exists) {
              return {
                reviews:
                  state.reviews.map(
                    (item) =>
                      item.weekKey ===
                      snapshot.weekKey
                        ? snapshot
                        : item,
                  ),

                error: null,
              };
            }

            return {
              reviews: [
                snapshot,
                ...state.reviews,
              ],

              error: null,
            };
          });

          if (navigator.onLine) {
            void syncWeeklyReviewQueue().catch(
              (error) => {
                console.warn(
                  "Weekly review save sync failed:",
                  error,
                );
              },
            );
          }
        } catch (error) {
          set({
            error:
              getErrorMessage(error),
          });
        }
      },

      /* =========================
         UPDATE NOTE
      ========================= */

      updateNote: async (
        reviewId,
        note,
      ) => {
        try {
          const userId =
            await getCurrentUserId();

          const existing =
            await getOfflineWeeklyReview(
              userId,
              reviewId,
            );

          if (!existing) {
            return;
          }

          const updated:
            OfflineWeeklyReview = {
              ...existing,

              note:
                note.trim(),

              updatedAt:
                new Date().toISOString(),

              deletedAt: null,
            };

          await saveOfflineWeeklyReview(
            updated,
            true,
          );

          set((state) => ({
            reviews:
              state.reviews.map(
                (review) =>
                  review.id ===
                  reviewId
                    ? toSnapshot(
                        updated,
                      )
                    : review,
              ),

            error: null,
          }));

          if (navigator.onLine) {
            void syncWeeklyReviewQueue().catch(
              (error) => {
                console.warn(
                  "Weekly review note sync failed:",
                  error,
                );
              },
            );
          }
        } catch (error) {
          set({
            error:
              getErrorMessage(error),
          });
        }
      },

      /* =========================
         DELETE
      ========================= */

      deleteReview: async (
        reviewId,
      ) => {
        try {
          const userId =
            await getCurrentUserId();

          const deleted =
            await markOfflineWeeklyReviewDeleted(
              userId,
              reviewId,
            );

          if (!deleted) {
            return;
          }

          set((state) => ({
            reviews:
              state.reviews.filter(
                (review) =>
                  review.id !==
                  reviewId,
              ),

            error: null,
          }));

          if (navigator.onLine) {
            void syncWeeklyReviewQueue().catch(
              (error) => {
                console.warn(
                  "Weekly review delete sync failed:",
                  error,
                );
              },
            );
          }
        } catch (error) {
          set({
            error:
              getErrorMessage(error),
          });
        }
      },

      /* =========================
         CLEAR ALL
      ========================= */

      clearReviews: async () => {
        try {
          const userId =
            await getCurrentUserId();

          await markAllOfflineWeeklyReviewsDeleted(
            userId,
          );

          set({
            reviews: [],
            error: null,
            isInitialized: true,
          });

          if (navigator.onLine) {
            void syncWeeklyReviewQueue().catch(
              (error) => {
                console.warn(
                  "Weekly review clear sync failed:",
                  error,
                );
              },
            );
          }
        } catch (error) {
          set({
            error:
              getErrorMessage(error),
          });
        }
      },

      /* =========================
         RESET RAM
      ========================= */

      clearLocalReviews: () => {
        set({
          ...initialState,
        });
      },
    }),
  );