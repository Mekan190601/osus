import { create } from "zustand";
import { persist } from "zustand/middleware";

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

  saveReview: (
    review: SaveWeeklyReviewInput,
  ) => void;

  updateNote: (
    reviewId: string,
    note: string,
  ) => void;

  deleteReview: (
    reviewId: string,
  ) => void;

  clearReviews: () => void;
};

function createReviewId() {
  return crypto.randomUUID();
}

export const useWeeklyReviewStore =
  create<WeeklyReviewState>()(
    persist(
      (set) => ({
        reviews: [],

        saveReview: (review) => {
          set((state) => {
            const existingReview =
              state.reviews.find(
                (item) =>
                  item.weekKey ===
                  review.weekKey,
              );

            /*
             * Şol hepde öň saklanan bolsa,
             * täze duplicate döretmän
             * maglumatlaryny täzeleýäris.
             */
            if (existingReview) {
              return {
                reviews:
                  state.reviews.map(
                    (item) =>
                      item.id ===
                      existingReview.id
                        ? {
                            ...item,
                            ...review,
                            createdAt:
                              new Date().toISOString(),
                          }
                        : item,
                  ),
              };
            }

            const newReview: WeeklyReviewSnapshot =
              {
                ...review,

                id: createReviewId(),

                createdAt:
                  new Date().toISOString(),
              };

            return {
              reviews: [
                newReview,
                ...state.reviews,
              ],
            };
          });
        },

        updateNote: (
          reviewId,
          note,
        ) => {
          set((state) => ({
            reviews:
              state.reviews.map(
                (review) =>
                  review.id ===
                  reviewId
                    ? {
                        ...review,
                        note,
                      }
                    : review,
              ),
          }));
        },

        deleteReview: (
          reviewId,
        ) => {
          set((state) => ({
            reviews:
              state.reviews.filter(
                (review) =>
                  review.id !==
                  reviewId,
              ),
          }));
        },

        clearReviews: () => {
          set({
            reviews: [],
          });
        },
      }),
      {
        name: "osus-weekly-review-storage",
      },
    ),
  );