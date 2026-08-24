import { create } from "zustand";
import { persist } from "zustand/middleware";

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

type FinanceState = {
  bankBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;

  transactions: FinanceTransaction[];

  setBankBalance: (value: number) => void;
  setMonthlyIncome: (value: number) => void;
  setMonthlyExpense: (value: number) => void;

  addTransaction: (
    transaction: Omit<
      FinanceTransaction,
      "id" | "createdAt"
    >,
  ) => void;

  updateTransaction: (
    id: string,
    transaction: Omit<
      FinanceTransaction,
      "id" | "createdAt"
    >,
  ) => void;

  deleteTransaction: (id: string) => void;

  resetFinance: () => void;
};

const initialState = {
  bankBalance: 3000,
  monthlyIncome: 3000,
  monthlyExpense: 0,
  transactions: [] as FinanceTransaction[],
};

const createTransactionId = () => {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

export const useFinanceStore =
  create<FinanceState>()(
    persist(
      (set) => ({
        ...initialState,

        setBankBalance: (value) => {
          set({
            bankBalance: Math.max(
              0,
              value,
            ),
          });
        },

        setMonthlyIncome: (value) => {
          set({
            monthlyIncome: Math.max(
              0,
              value,
            ),
          });
        },

        setMonthlyExpense: (value) => {
          set({
            monthlyExpense: Math.max(
              0,
              value,
            ),
          });
        },

        addTransaction: (transaction) => {
          const amount = Math.max(
            0,
            transaction.amount,
          );

          if (
            amount <= 0 ||
            !transaction.title.trim()
          ) {
            return;
          }

          const newTransaction: FinanceTransaction =
            {
              ...transaction,
              amount,
              title: transaction.title.trim(),
              id: createTransactionId(),
              createdAt:
                new Date().toISOString(),
            };

          set((state) => ({
            transactions: [
              newTransaction,
              ...state.transactions,
            ],
          }));
        },

        updateTransaction: (
          id,
          transaction,
        ) => {
          const amount = Math.max(
            0,
            transaction.amount,
          );

          if (
            amount <= 0 ||
            !transaction.title.trim()
          ) {
            return;
          }

          set((state) => ({
            transactions:
              state.transactions.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        ...transaction,
                        amount,
                        title:
                          transaction.title.trim(),
                      }
                    : item,
              ),
          }));
        },

        deleteTransaction: (id) => {
          set((state) => ({
            transactions:
              state.transactions.filter(
                (item) =>
                  item.id !== id,
              ),
          }));
        },

        resetFinance: () => {
          set(initialState);
        },
      }),
      {
        name: "osus-finance-storage",

        merge: (
          persistedState,
          currentState,
        ) => ({
          ...currentState,
          ...(persistedState as Partial<FinanceState>),
          transactions:
            (
              persistedState as Partial<FinanceState>
            )?.transactions ?? [],
        }),
      },
    ),
  );