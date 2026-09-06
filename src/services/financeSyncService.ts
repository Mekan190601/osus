import { supabase } from "./supabase";
import { offlineDb } from "./offlineDb";

import {
  getOfflineFinanceAccount,
  getOfflineFinanceTransactions,
  saveOfflineFinanceAccount,
  saveOfflineFinanceTransaction,
} from "./offlineFinanceService";

import {
  deleteFinanceTransaction,
  getAllFinanceTransactionsForSync,
  getFinanceAccount,
  saveFinanceAccount,
  saveFinanceTransaction,
} from "./financeService";

import type {
  OfflineFinanceAccount,
  OfflineFinanceTransaction,
  SyncQueueItem,
} from "./offlineDb";

import type {
  FinanceAccountRow,
  FinanceTransactionRow,
} from "./financeService";

/* =========================
   TYPE GUARDS
========================= */

function isFinanceAccountQueueItem(
  item: SyncQueueItem,
): item is SyncQueueItem & {
  entity: "financeAccount";
  payload: OfflineFinanceAccount | null;
} {
  return item.entity === "financeAccount";
}

function isFinanceTransactionQueueItem(
  item: SyncQueueItem,
): item is SyncQueueItem & {
  entity: "financeTransaction";
  payload: OfflineFinanceTransaction | null;
} {
  return item.entity === "financeTransaction";
}

/* =========================
   USER
========================= */

async function getCurrentUserId() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

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
  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(value).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : 0;
}

function accountRowToOffline(
  row: FinanceAccountRow,
): OfflineFinanceAccount {
  return {
    userId: row.user_id,

    bankBalance:
      Number(row.bank_balance ?? 0),

    monthlyIncome:
      Number(row.monthly_income ?? 0),

    monthlyExpense:
      Number(row.monthly_expense ?? 0),

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,

    deletedAt:
      row.deleted_at ?? null,
  };
}

function transactionRowToOffline(
  row: FinanceTransactionRow,
): OfflineFinanceTransaction {
  return {
    userId: row.user_id,

    id: row.id,

    type: row.type,

    amount:
      Number(row.amount ?? 0),

    title:
      row.title,

    transactionDate:
      row.transaction_date,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,

    deletedAt:
      row.deleted_at ?? null,
  };
}

/* =========================
   PUSH ACCOUNT
========================= */

async function syncFinanceAccountQueue() {
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

  const accountQueue =
    queue.filter(
      isFinanceAccountQueueItem,
    );

  for (const item of accountQueue) {
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

      /*
       * Häzirki programmada finance account
       * bütinleý pozulmaýar.
       *
       * Şonuň üçin account queue
       * esasy ýagdaýda UPSERT edýär.
       */
      await saveFinanceAccount({
        bankBalance:
          payload.bankBalance,

        monthlyIncome:
          payload.monthlyIncome,

        monthlyExpense:
          payload.monthlyExpense,

        updatedAt:
          payload.updatedAt,

        deletedAt:
          payload.deletedAt,
      });

      await offlineDb.syncQueue.delete(
        item.id,
      );
    } catch (error) {
      console.warn(
        "Finance account sync failed:",
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
   PUSH TRANSACTIONS
========================= */

async function syncFinanceTransactionQueue() {
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

  const transactionQueue =
    queue.filter(
      isFinanceTransactionQueueItem,
    );

  for (const item of transactionQueue) {
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
        await deleteFinanceTransaction(
          payload.id,
          payload.updatedAt,
        );
      } else {
        await saveFinanceTransaction({
          id: payload.id,

          type: payload.type,

          amount:
            payload.amount,

          title:
            payload.title,

          transactionDate:
            payload.transactionDate,

          createdAt:
            payload.createdAt,

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
        "Finance transaction sync failed:",
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
   PUBLIC PUSH
========================= */

export async function syncFinanceQueue() {
  if (!navigator.onLine) {
    return;
  }

  /*
   * Account bilen transaction queue-laryny
   * bir wagtda işletmeýäris.
   *
   * Tertipli sync:
   * 1. account
   * 2. transactions
   */
  await syncFinanceAccountQueue();

  await syncFinanceTransactionQueue();
}

/* =========================
   PULL ACCOUNT
========================= */

async function pullFinanceAccountFromCloud() {
  const userId =
    await getCurrentUserId();

  const [
    cloudAccount,
    localAccount,
    queue,
  ] = await Promise.all([
    getFinanceAccount(),

    getOfflineFinanceAccount(
      userId,
    ),

    offlineDb.syncQueue
      .where("userId")
      .equals(userId)
      .toArray(),
  ]);

  const hasPendingAccount =
    queue.some(
      (item) =>
        isFinanceAccountQueueItem(
          item,
        ),
    );

  /*
   * Pending lokal account üýtgeşmesi
   * bar bolsa cloud onuň üstünden
   * ýazmaýar.
   */
  if (
    hasPendingAccount &&
    localAccount
  ) {
    return localAccount;
  }

  const cloudOffline =
    accountRowToOffline(
      cloudAccount,
    );

  if (!localAccount) {
    await saveOfflineFinanceAccount(
      cloudOffline,
      false,
    );

    return cloudOffline;
  }

  const cloudUpdated =
    toTimestamp(
      cloudOffline.updatedAt,
    );

  const localUpdated =
    toTimestamp(
      localAccount.updatedAt,
    );

  if (
    cloudUpdated >=
    localUpdated
  ) {
    await saveOfflineFinanceAccount(
      cloudOffline,
      false,
    );

    return cloudOffline;
  }

  return localAccount;
}

/* =========================
   PULL TRANSACTIONS
========================= */

async function pullFinanceTransactionsFromCloud() {
  const userId =
    await getCurrentUserId();

  const [
    cloudTransactions,
    localTransactions,
    queue,
  ] = await Promise.all([
    getAllFinanceTransactionsForSync(),

    getOfflineFinanceTransactions(
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
          isFinanceTransactionQueueItem,
        )
        .map(
          (item) =>
            item.entityId,
        ),
    );

  const localMap =
    new Map(
      localTransactions.map(
        (transaction) => [
          transaction.id,
          transaction,
        ],
      ),
    );

  for (
    const cloudTransaction
    of cloudTransactions
  ) {
    /*
     * Pending offline üýtgeşmäni
     * cloud basyp geçmeýär.
     */
    if (
      pendingIds.has(
        cloudTransaction.id,
      )
    ) {
      continue;
    }

    const cloudOffline =
      transactionRowToOffline(
        cloudTransaction,
      );

    const localTransaction =
      localMap.get(
        cloudTransaction.id,
      );

    if (!localTransaction) {
      await saveOfflineFinanceTransaction(
        cloudOffline,
        false,
      );

      continue;
    }

    const cloudUpdated =
      toTimestamp(
        cloudOffline.updatedAt,
      );

    const localUpdated =
      toTimestamp(
        localTransaction.updatedAt,
      );

    if (
      cloudUpdated >=
      localUpdated
    ) {
      await saveOfflineFinanceTransaction(
        cloudOffline,
        false,
      );
    }
  }

  return getOfflineFinanceTransactions(
    userId,
  );
}

/* =========================
   INITIALIZE / MERGE
========================= */

export async function initializeFinanceSync() {
  const userId =
    await getCurrentUserId();

  const [
    localAccount,
    localTransactions,
  ] = await Promise.all([
    getOfflineFinanceAccount(
      userId,
    ),

    getOfflineFinanceTransactions(
      userId,
    ),
  ]);

  /*
   * Internet ýok bolsa diňe lokal maglumat.
   */
  if (!navigator.onLine) {
    return {
      account:
        localAccount ?? null,

      transactions:
        localTransactions,
    };
  }

  /*
   * Ilki offline üýtgeşmeler cloud-a.
   */
  await syncFinanceQueue();

  /*
   * Soň cloud bilen lokal maglumat
   * deňeşdirilýär.
   */
  const [
    account,
    transactions,
  ] = await Promise.all([
    pullFinanceAccountFromCloud(),

    pullFinanceTransactionsFromCloud(),
  ]);

  return {
    account,
    transactions,
  };
}

/* =========================
   VISIBLE FINANCE DATA
========================= */

export async function getSyncedFinanceData() {
  const {
    account,
    transactions,
  } =
    await initializeFinanceSync();

  const visibleTransactions =
    transactions
      .filter(
        (transaction) =>
          !transaction.deletedAt,
      )
      .sort((a, b) => {
        const dateCompare =
          b.transactionDate.localeCompare(
            a.transactionDate,
          );

        if (dateCompare !== 0) {
          return dateCompare;
        }

        return (
          toTimestamp(
            b.createdAt,
          ) -
          toTimestamp(
            a.createdAt,
          )
        );
      });

  return {
    account:
      account &&
      !account.deletedAt
        ? account
        : null,

    transactions:
      visibleTransactions,
  };
}