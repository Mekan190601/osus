import { supabase } from "./supabase";

export type FinanceTransactionType =
  | "income"
  | "expense";

export type FinanceTransactionRow = {
  id: string;
  user_id: string;

  type: FinanceTransactionType;

  amount: number;
  title: string;

  transaction_date: string;

  created_at: string;
  updated_at: string;

  deleted_at: string | null;
};

export type FinanceAccountRow = {
  user_id: string;

  bank_balance: number;
  monthly_income: number;
  monthly_expense: number;

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

/* =========================
   FINANCE ACCOUNT
========================= */

export async function getFinanceAccount() {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("finance_accounts")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data as FinanceAccountRow;
  }

  const now =
    new Date().toISOString();

  const {
    data: newAccount,
    error: createError,
  } = await supabase
    .from("finance_accounts")
    .insert({
      user_id: userId,

      bank_balance: 0,
      monthly_income: 0,
      monthly_expense: 0,

      updated_at: now,
      deleted_at: null,
    })
    .select("*")
    .single();

  if (createError) {
    throw createError;
  }

  return newAccount as FinanceAccountRow;
}

export async function saveFinanceAccount(
  account: {
    bankBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;

    updatedAt: string;
    deletedAt: string | null;
  },
) {
  const userId = await getUserId();

  const {
    data: updatedAccount,
    error,
  } = await supabase
    .from("finance_accounts")
    .upsert(
      {
        user_id: userId,

        bank_balance:
          Math.max(
            0,
            account.bankBalance,
          ),

        monthly_income:
          Math.max(
            0,
            account.monthlyIncome,
          ),

        monthly_expense:
          Math.max(
            0,
            account.monthlyExpense,
          ),

        updated_at:
          account.updatedAt,

        deleted_at:
          account.deletedAt,
      },
      {
        onConflict: "user_id",
      },
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return updatedAccount as FinanceAccountRow;
}

/*
 * Köne store/API compatibility üçin.
 */
export async function updateFinanceAccount(
  data: {
    bankBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
  },
) {
  return saveFinanceAccount({
    ...data,

    updatedAt:
      new Date().toISOString(),

    deletedAt: null,
  });
}

/* =========================
   TRANSACTIONS - GET
========================= */

export async function getFinanceTransactions() {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("finance_transactions")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("transaction_date", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (
    data ?? []
  ) as FinanceTransactionRow[];
}

/*
 * Sync üçin deleted_at bolan ýazgylar
 * hem gerek.
 */
export async function getAllFinanceTransactionsForSync() {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("finance_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("transaction_date", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (
    data ?? []
  ) as FinanceTransactionRow[];
}

/* =========================
   TRANSACTIONS - UPSERT
========================= */

export async function saveFinanceTransaction(
  transaction: {
    id: string;

    type: FinanceTransactionType;

    amount: number;
    title: string;

    transactionDate: string;

    createdAt: string;
    updatedAt: string;

    deletedAt: string | null;
  },
) {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("finance_transactions")
    .upsert(
      {
        id: transaction.id,
        user_id: userId,

        type: transaction.type,

        amount:
          Math.max(
            0,
            transaction.amount,
          ),

        title:
          transaction.title.trim(),

        transaction_date:
          transaction.transactionDate,

        created_at:
          transaction.createdAt,

        updated_at:
          transaction.updatedAt,

        deleted_at:
          transaction.deletedAt,
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

  return data as FinanceTransactionRow;
}

/* =========================
   CREATE
========================= */

export async function createFinanceTransaction(
  transaction: {
    type: FinanceTransactionType;
    amount: number;
    title: string;
    date: string;
  },
) {
  const now =
    new Date().toISOString();

  const id =
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  return saveFinanceTransaction({
    id,

    type: transaction.type,

    amount:
      Math.max(
        0,
        transaction.amount,
      ),

    title:
      transaction.title.trim(),

    transactionDate:
      transaction.date,

    createdAt: now,
    updatedAt: now,

    deletedAt: null,
  });
}

/* =========================
   UPDATE
========================= */

export async function updateFinanceTransaction(
  id: string,
  transaction: {
    type: FinanceTransactionType;
    amount: number;
    title: string;
    date: string;
  },
) {
  const userId = await getUserId();

  const now =
    new Date().toISOString();

  const { data, error } = await supabase
    .from("finance_transactions")
    .update({
      type: transaction.type,

      amount:
        Math.max(
          0,
          transaction.amount,
        ),

      title:
        transaction.title.trim(),

      transaction_date:
        transaction.date,

      updated_at: now,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as FinanceTransactionRow;
}

/* =========================
   SOFT DELETE
========================= */

export async function deleteFinanceTransaction(
  id: string,
  updatedAt =
    new Date().toISOString(),
) {
  const userId = await getUserId();

  const { error } = await supabase
    .from("finance_transactions")
    .update({
      deleted_at:
        updatedAt,

      updated_at:
        updatedAt,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}