import { offlineDb } from "./offlineDb";

import type {
  OfflineFinanceAccount,
  OfflineFinanceTransaction,
  SyncQueueItem,
} from "./offlineDb";

/* =========================
   FINANCE ACCOUNT
========================= */

export async function getOfflineFinanceAccount(
  userId: string,
) {
  return offlineDb.financeAccounts.get(
    userId,
  );
}

export async function saveOfflineFinanceAccount(
  account: OfflineFinanceAccount,
  addToQueue = true,
) {
  await offlineDb.transaction(
    "rw",
    offlineDb.financeAccounts,
    offlineDb.syncQueue,
    async () => {
      await offlineDb.financeAccounts.put(
        account,
      );

      if (!addToQueue) {
        return;
      }

      const existingQueueItem =
        await offlineDb.syncQueue
          .where({
            userId: account.userId,
            entity: "financeAccount",
            entityId: account.userId,
          })
          .first();

      const queueItem: SyncQueueItem = {
        userId: account.userId,

        entity: "financeAccount",
        entityId: account.userId,

        operation: account.deletedAt
          ? "delete"
          : "upsert",

        payload: account,

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

/* =========================
   FINANCE TRANSACTIONS
========================= */

export async function getOfflineFinanceTransactions(
  userId: string,
) {
  return offlineDb.financeTransactions
    .where("userId")
    .equals(userId)
    .toArray();
}

export async function getOfflineFinanceTransaction(
  userId: string,
  transactionId: string,
) {
  return offlineDb.financeTransactions.get([
    userId,
    transactionId,
  ]);
}

export async function saveOfflineFinanceTransaction(
  transaction: OfflineFinanceTransaction,
  addToQueue = true,
) {
  await offlineDb.transaction(
    "rw",
    offlineDb.financeTransactions,
    offlineDb.syncQueue,
    async () => {
      await offlineDb.financeTransactions.put(
        transaction,
      );

      if (!addToQueue) {
        return;
      }

      const existingQueueItem =
        await offlineDb.syncQueue
          .where({
            userId: transaction.userId,
            entity:
              "financeTransaction",
            entityId: transaction.id,
          })
          .first();

      const queueItem: SyncQueueItem = {
        userId: transaction.userId,

        entity:
          "financeTransaction",

        entityId: transaction.id,

        operation: transaction.deletedAt
          ? "delete"
          : "upsert",

        payload: transaction,

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

export async function saveOfflineFinanceTransactions(
  transactions: OfflineFinanceTransaction[],
  addToQueue = false,
) {
  for (const transaction of transactions) {
    await saveOfflineFinanceTransaction(
      transaction,
      addToQueue,
    );
  }
}

/* =========================
   SOFT DELETE TRANSACTION
========================= */

export async function markOfflineFinanceTransactionDeleted(
  userId: string,
  transactionId: string,
) {
  const existing =
    await getOfflineFinanceTransaction(
      userId,
      transactionId,
    );

  if (!existing) {
    return null;
  }

  const now =
    new Date().toISOString();

  const deletedTransaction: OfflineFinanceTransaction =
    {
      ...existing,

      updatedAt: now,
      deletedAt: now,
    };

  await saveOfflineFinanceTransaction(
    deletedTransaction,
    true,
  );

  return deletedTransaction;
}

/* =========================
   VISIBLE TRANSACTIONS
========================= */

export async function getVisibleOfflineFinanceTransactions(
  userId: string,
) {
  const transactions =
    await getOfflineFinanceTransactions(
      userId,
    );

  return transactions
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
        new Date(
          b.createdAt,
        ).getTime() -
        new Date(
          a.createdAt,
        ).getTime()
      );
    });
}

/* =========================
   LOCAL CACHE HELPERS
========================= */

export async function clearOfflineFinanceForUser(
  userId: string,
) {
  const transactions =
    await offlineDb.financeTransactions
      .where("userId")
      .equals(userId)
      .toArray();

  await offlineDb.transaction(
    "rw",
    offlineDb.financeAccounts,
    offlineDb.financeTransactions,
    async () => {
      await offlineDb.financeAccounts.delete(
        userId,
      );

      if (
        transactions.length >
        0
      ) {
        await offlineDb.financeTransactions.bulkDelete(
          transactions.map(
            (transaction) =>
              [
                transaction.userId,
                transaction.id,
              ] as [string, string],
          ),
        );
      }
    },
  );
}