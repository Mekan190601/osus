import { create } from "zustand";

import { supabase } from "../services/supabase";

import {
  getOfflineFinanceAccount,
  getOfflineFinanceTransaction,
  getVisibleOfflineFinanceTransactions,
  markOfflineFinanceTransactionDeleted,
  saveOfflineFinanceAccount,
  saveOfflineFinanceTransaction,
} from "../services/offlineFinanceService";

import {
  getSyncedFinanceData,
  syncFinanceQueue,
} from "../services/financeSyncService";

import type {
  OfflineFinanceAccount,
  OfflineFinanceTransaction,
} from "../services/offlineDb";

export type FinanceTransactionType =
  | "income"
  | "expense";

export type FinanceTransaction = {
  id: string;
  type: FinanceTransactionType;
  amount: number;
  title: string;
  date: string;
  createdAt: string;
};

type TransactionInput = Omit<
  FinanceTransaction,
  "id" | "createdAt"
>;

type FinanceState = {
  bankBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;

  transactions: FinanceTransaction[];

  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  loadFinance: () => Promise<void>;

  setBankBalance: (
    value: number,
  ) => Promise<void>;

  setMonthlyIncome: (
    value: number,
  ) => Promise<void>;

  setMonthlyExpense: (
    value: number,
  ) => Promise<void>;

  addTransaction: (
    transaction: TransactionInput,
  ) => Promise<void>;

  updateTransaction: (
    id: string,
    transaction: TransactionInput,
  ) => Promise<void>;

  deleteTransaction: (
    id: string,
  ) => Promise<void>;

  resetFinance: () => void;
};

const initialState = {
  bankBalance: 0,
  monthlyIncome: 0,
  monthlyExpense: 0,

  transactions:
    [] as FinanceTransaction[],

  isLoading: false,
  isInitialized: false,
  error: null as string | null,
};

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

function createTransactionId() {
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

function toFinanceTransaction(
  transaction: OfflineFinanceTransaction,
): FinanceTransaction {
  return {
    id: transaction.id,

    type: transaction.type,

    amount:
      transaction.amount,

    title:
      transaction.title,

    date:
      transaction.transactionDate,

    createdAt:
      transaction.createdAt,
  };
}

async function getOrCreateLocalAccount(
  userId: string,
) {
  const existing =
    await getOfflineFinanceAccount(
      userId,
    );

  if (existing) {
    return existing;
  }

  const now =
    new Date().toISOString();

  const account: OfflineFinanceAccount = {
    userId,

    bankBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,

    createdAt: now,
    updatedAt: now,

    deletedAt: null,
  };

  await saveOfflineFinanceAccount(
    account,
    true,
  );

  return account;
}

export const useFinanceStore =
  create<FinanceState>()(
    (set, get) => ({
      ...initialState,

      /* =========================
         LOAD
      ========================= */

      loadFinance: async () => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          /*
           * 1. Ilki IndexedDB.
           * Offline wagty UI şu maglumat
           * bilen açylýar.
           */
          const [
            localAccount,
            localTransactions,
          ] = await Promise.all([
            getOfflineFinanceAccount(
              userId,
            ),

            getVisibleOfflineFinanceTransactions(
              userId,
            ),
          ]);

          set({
            bankBalance:
              localAccount?.bankBalance ??
              0,

            monthlyIncome:
              localAccount?.monthlyIncome ??
              0,

            monthlyExpense:
              localAccount?.monthlyExpense ??
              0,

            transactions:
              localTransactions.map(
                toFinanceTransaction,
              ),

            isInitialized: true,
          });

          /*
           * 2. Online bolsa queue sync +
           * cloud merge.
           *
           * Cloud ýalňyşsa lokal maglumat
           * bilen işlemegi dowam etdirýäris.
           */
          if (navigator.onLine) {
            try {
              const {
                account,
                transactions,
              } =
                await getSyncedFinanceData();

              set({
                bankBalance:
                  account?.bankBalance ??
                  0,

                monthlyIncome:
                  account?.monthlyIncome ??
                  0,

                monthlyExpense:
                  account?.monthlyExpense ??
                  0,

                transactions:
                  transactions.map(
                    toFinanceTransaction,
                  ),

                error: null,
              });
            } catch (error) {
              console.warn(
                "Finance cloud sync failed:",
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
         BANK BALANCE
      ========================= */

      setBankBalance: async (
        value,
      ) => {
        const nextValue =
          Math.max(0, value);

        set({
          bankBalance:
            nextValue,

          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          const account =
            await getOrCreateLocalAccount(
              userId,
            );

          const nextAccount: OfflineFinanceAccount =
            {
              ...account,

              bankBalance:
                nextValue,

              monthlyIncome:
                get().monthlyIncome,

              monthlyExpense:
                get().monthlyExpense,

              updatedAt:
                new Date().toISOString(),

              deletedAt: null,
            };

          await saveOfflineFinanceAccount(
            nextAccount,
            true,
          );

          if (navigator.onLine) {
            void syncFinanceQueue().catch(
              (error) => {
                console.warn(
                  "Finance account sync failed:",
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

          throw error;
        }
      },

      /* =========================
         MONTHLY INCOME
      ========================= */

      setMonthlyIncome: async (
        value,
      ) => {
        const nextValue =
          Math.max(0, value);

        set({
          monthlyIncome:
            nextValue,

          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          const account =
            await getOrCreateLocalAccount(
              userId,
            );

          const nextAccount: OfflineFinanceAccount =
            {
              ...account,

              bankBalance:
                get().bankBalance,

              monthlyIncome:
                nextValue,

              monthlyExpense:
                get().monthlyExpense,

              updatedAt:
                new Date().toISOString(),

              deletedAt: null,
            };

          await saveOfflineFinanceAccount(
            nextAccount,
            true,
          );

          if (navigator.onLine) {
            void syncFinanceQueue().catch(
              (error) => {
                console.warn(
                  "Finance income sync failed:",
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

          throw error;
        }
      },

      /* =========================
         MONTHLY EXPENSE
      ========================= */

      setMonthlyExpense: async (
        value,
      ) => {
        const nextValue =
          Math.max(0, value);

        set({
          monthlyExpense:
            nextValue,

          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          const account =
            await getOrCreateLocalAccount(
              userId,
            );

          const nextAccount: OfflineFinanceAccount =
            {
              ...account,

              bankBalance:
                get().bankBalance,

              monthlyIncome:
                get().monthlyIncome,

              monthlyExpense:
                nextValue,

              updatedAt:
                new Date().toISOString(),

              deletedAt: null,
            };

          await saveOfflineFinanceAccount(
            nextAccount,
            true,
          );

          if (navigator.onLine) {
            void syncFinanceQueue().catch(
              (error) => {
                console.warn(
                  "Finance expense sync failed:",
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

          throw error;
        }
      },

      /* =========================
         ADD TRANSACTION
      ========================= */

      addTransaction: async (
        transaction,
      ) => {
        const amount =
          Math.max(
            0,
            transaction.amount,
          );

        const title =
          transaction.title.trim();

        if (
          amount <= 0 ||
          !title
        ) {
          return;
        }

        set({
          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          const now =
            new Date().toISOString();

          const offlineTransaction:
            OfflineFinanceTransaction =
            {
              userId,

              id:
                createTransactionId(),

              type:
                transaction.type,

              amount,

              title,

              transactionDate:
                transaction.date,

              createdAt: now,
              updatedAt: now,

              deletedAt: null,
            };

          /*
           * ILKI lokal database.
           */
          await saveOfflineFinanceTransaction(
            offlineTransaction,
            true,
          );

          /*
           * UI derrew täzelenýär.
           */
          set((state) => ({
            transactions: [
              toFinanceTransaction(
                offlineTransaction,
              ),
              ...state.transactions,
            ],
          }));

          if (navigator.onLine) {
            void syncFinanceQueue().catch(
              (error) => {
                console.warn(
                  "Finance transaction add sync failed:",
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

          throw error;
        }
      },

      /* =========================
         UPDATE TRANSACTION
      ========================= */

      updateTransaction: async (
        id,
        transaction,
      ) => {
        const amount =
          Math.max(
            0,
            transaction.amount,
          );

        const title =
          transaction.title.trim();

        if (
          amount <= 0 ||
          !title
        ) {
          return;
        }

        set({
          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          const existing =
            await getOfflineFinanceTransaction(
              userId,
              id,
            );

          if (!existing) {
            return;
          }

          const updatedTransaction:
            OfflineFinanceTransaction =
            {
              ...existing,

              type:
                transaction.type,

              amount,

              title,

              transactionDate:
                transaction.date,

              updatedAt:
                new Date().toISOString(),

              deletedAt: null,
            };

          await saveOfflineFinanceTransaction(
            updatedTransaction,
            true,
          );

          set((state) => ({
            transactions:
              state.transactions.map(
                (item) =>
                  item.id === id
                    ? toFinanceTransaction(
                        updatedTransaction,
                      )
                    : item,
              ),
          }));

          if (navigator.onLine) {
            void syncFinanceQueue().catch(
              (error) => {
                console.warn(
                  "Finance transaction update sync failed:",
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

          throw error;
        }
      },

      /* =========================
         DELETE TRANSACTION
      ========================= */

      deleteTransaction: async (
        id,
      ) => {
        set({
          error: null,
        });

        try {
          const userId =
            await getCurrentUserId();

          const deleted =
            await markOfflineFinanceTransactionDeleted(
              userId,
              id,
            );

          if (!deleted) {
            return;
          }

          /*
           * UI-den derrew aýrylýar.
           */
          set((state) => ({
            transactions:
              state.transactions.filter(
                (transaction) =>
                  transaction.id !==
                  id,
              ),
          }));

          if (navigator.onLine) {
            void syncFinanceQueue().catch(
              (error) => {
                console.warn(
                  "Finance transaction delete sync failed:",
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

          throw error;
        }
      },

      /* =========================
         RESET RAM
      ========================= */

      resetFinance: () => {
        /*
         * Logout/account switch wagty
         * diňe Zustand RAM arassalanýar.
         *
         * IndexedDB cache-ni pozmaýarys,
         * sebäbi soň şol akkaunt
         * offline girip biler.
         */
        set({
          ...initialState,
        });
      },
    }),
  );