import Dexie, {
  type Table,
} from "dexie";

import type {
  EisenhowerQuadrant,
  PlannerPeriod,
} from "../features/planner/types/planner.types";

import type {
  AppCurrency,
  AppLanguage,
  AppTheme,
  NotificationPreferences,
  StartPage,
} from "../features/settings/types/settings.types";

/* =========================
   GOAL
========================= */

export type OfflineGoal = {
  userId: string;
  goalId: string;

  mainGoal: string;
  targetMoney: number;
  currentMoney: number;
  deadline: string;

  updatedAt: string;
  deletedAt: string | null;
};

/* =========================
   PLANNER
========================= */

export type OfflinePlannerTask = {
  userId: string;
  id: string;

  title: string;
  description: string;

  period: PlannerPeriod;
  quadrant: EisenhowerQuadrant;

  dateKey: string;

  parentTaskId: string | null;
  sourceGoalId: string | null;

  completed: boolean;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;

  deletedAt: string | null;
};

/* =========================
   FINANCE ACCOUNT
========================= */

export type OfflineFinanceAccount = {
  userId: string;

  bankBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;

  createdAt: string;
  updatedAt: string;

  deletedAt: string | null;
};

/* =========================
   FINANCE TRANSACTION
========================= */

export type OfflineFinanceTransactionType =
  | "income"
  | "expense";

export type OfflineFinanceTransaction = {
  userId: string;
  id: string;

  type: OfflineFinanceTransactionType;

  amount: number;
  title: string;

  transactionDate: string;

  createdAt: string;
  updatedAt: string;

  deletedAt: string | null;
};

/* =========================
   WEEKLY REVIEW
========================= */

export type OfflineWeeklyReview = {
  userId: string;
  id: string;

  weekKey: string;

  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;

  monthlyNetIncome: number;

  financialProgress: number;
  plannerProgress: number;
  overallProgress: number;

  note: string;

  createdAt: string;
  updatedAt: string;

  deletedAt: string | null;
};

/* =========================
   USER SETTINGS
========================= */

export type OfflineUserSettings = {
  userId: string;

  language: AppLanguage;
  currency: AppCurrency;
  startPage: StartPage;
  theme: AppTheme;

  notifications:
    NotificationPreferences;

  createdAt: string;
  updatedAt: string;

  deletedAt: string | null;
};
/* =========================
   CURRENCY RATES
========================= */

export type OfflineCurrencyRates = {
  TMT: number;
  USD: number;
  EUR: number;
  CNY: number;
  TRY: number;
};

export type OfflineCurrencyRateSettings = {
  userId: string;

  rates: OfflineCurrencyRates;

  mode: "auto" | "manual";

  lastUpdatedAt: string | null;
  lastProviderDate: string | null;

  createdAt: string;
  updatedAt: string;

  deletedAt: string | null;
};

/* =========================
   SYNC QUEUE
========================= */

export type SyncOperation =
  | "upsert"
  | "delete";

export type SyncEntity =
  | "goal"
  | "plannerTask"
  | "financeAccount"
  | "financeTransaction"
  | "weeklyReview"
  | "userSettings"
  | "notification"
  | "currencyRates";;

export type SyncPayload =
  | OfflineGoal
  | OfflinePlannerTask
  | OfflineFinanceAccount
  | OfflineFinanceTransaction
  | OfflineWeeklyReview
  | OfflineUserSettings
  | OfflineCurrencyRateSettings
  | OfflineNotification
  | null;
  

export type SyncQueueItem = {
  id?: number;

  userId: string;

  entity: SyncEntity;
  entityId: string;

  operation: SyncOperation;

  payload: SyncPayload;

  createdAt: string;

  attempts: number;
};

export type OfflineNotification = {
  userId: string;
  id: string;

  title: string;
  message: string;

  type:
    | "info"
    | "success"
    | "warning"
    | "danger";

  source:
  | "system"
  | "planner"
  | "finance"
  | "goal"
  | "analytics"
  | "ai-coach";

  read: boolean;

  actionLabel: string | null;
  actionPath: string | null;

  dedupeKey: string | null;

  resolved: boolean;
  resolvedAt: string | null;

  createdAt: string;
  updatedAt: string;

  deletedAt: string | null;
};

/* =========================
   DATABASE
========================= */

class OsusOfflineDatabase extends Dexie {
  goals!: Table<
    OfflineGoal,
    [string, string]
  >;

  notifications!: Table<
  OfflineNotification,
  [string, string]
>;

  currencyRates!: Table<
  OfflineCurrencyRateSettings,
  string
>;

  plannerTasks!: Table<
    OfflinePlannerTask,
    [string, string]
  >;

  financeAccounts!: Table<
    OfflineFinanceAccount,
    string
  >;

  financeTransactions!: Table<
    OfflineFinanceTransaction,
    [string, string]
  >;

  weeklyReviews!: Table<
    OfflineWeeklyReview,
    [string, string]
  >;

  userSettings!: Table<
    OfflineUserSettings,
    string
  >;

  syncQueue!: Table<
    SyncQueueItem,
    number
  >;

  constructor() {
    super("osus-offline-db");

    /* VERSION 1 */

    this.version(1).stores({
      goals:
        "[userId+goalId], userId, goalId, updatedAt, deletedAt",

      syncQueue:
        "++id, userId, entity, entityId, operation, createdAt",
    });

    /* VERSION 2 */

    this.version(2).stores({
      goals:
        "[userId+goalId], userId, goalId, updatedAt, deletedAt",

      plannerTasks:
        "[userId+id], userId, id, period, quadrant, dateKey, parentTaskId, completed, updatedAt, deletedAt",

      syncQueue:
        "++id, userId, entity, entityId, operation, createdAt",
    });

    /* VERSION 3 */

    this.version(3).stores({
      goals:
        "[userId+goalId], userId, goalId, updatedAt, deletedAt",

      plannerTasks:
        "[userId+id], userId, id, period, quadrant, dateKey, parentTaskId, completed, updatedAt, deletedAt",

      financeAccounts:
        "userId, updatedAt, deletedAt",

      financeTransactions:
        "[userId+id], userId, id, type, transactionDate, updatedAt, deletedAt",

      syncQueue:
        "++id, userId, entity, entityId, operation, createdAt",
    });

    /* VERSION 4 */

    this.version(4).stores({
      goals:
        "[userId+goalId], userId, goalId, updatedAt, deletedAt",

      plannerTasks:
        "[userId+id], userId, id, period, quadrant, dateKey, parentTaskId, completed, updatedAt, deletedAt",

      financeAccounts:
        "userId, updatedAt, deletedAt",

      financeTransactions:
        "[userId+id], userId, id, type, transactionDate, updatedAt, deletedAt",

      weeklyReviews:
        "[userId+id], userId, id, weekKey, updatedAt, deletedAt",

      syncQueue:
        "++id, userId, entity, entityId, operation, createdAt",
    });

    /* VERSION 5 */

    this.version(5).stores({
      goals:
        "[userId+goalId], userId, goalId, updatedAt, deletedAt",

      plannerTasks:
        "[userId+id], userId, id, period, quadrant, dateKey, parentTaskId, completed, updatedAt, deletedAt",

      financeAccounts:
        "userId, updatedAt, deletedAt",

      financeTransactions:
        "[userId+id], userId, id, type, transactionDate, updatedAt, deletedAt",

      weeklyReviews:
        "[userId+id], userId, id, weekKey, updatedAt, deletedAt",

      userSettings:
        "userId, updatedAt, deletedAt",

      syncQueue:
        "++id, userId, entity, entityId, operation, createdAt",
    });

    this.version(6).stores({
  goals:
    "[userId+goalId], userId, goalId, updatedAt, deletedAt",

  plannerTasks:
    "[userId+id], userId, id, period, quadrant, dateKey, parentTaskId, completed, updatedAt, deletedAt",

  financeAccounts:
    "userId, updatedAt, deletedAt",

  financeTransactions:
    "[userId+id], userId, id, type, transactionDate, updatedAt, deletedAt",

  weeklyReviews:
    "[userId+id], userId, id, weekKey, updatedAt, deletedAt",

  userSettings:
    "userId, updatedAt, deletedAt",

  currencyRates:
    "userId, updatedAt, deletedAt",

  syncQueue:
    "++id, userId, entity, entityId, operation, createdAt",
});

this.version(7).stores({
  goals:
    "[userId+goalId], userId, goalId, updatedAt, deletedAt",

  plannerTasks:
    "[userId+id], userId, id, period, quadrant, dateKey, parentTaskId, completed, updatedAt, deletedAt",

  financeAccounts:
    "userId, updatedAt, deletedAt",

  financeTransactions:
    "[userId+id], userId, id, type, transactionDate, updatedAt, deletedAt",

  weeklyReviews:
    "[userId+id], userId, id, weekKey, updatedAt, deletedAt",

  userSettings:
    "userId, updatedAt, deletedAt",

  currencyRates:
    "userId, updatedAt, deletedAt",

  notifications:
    "[userId+id], userId, id, dedupeKey, read, resolved, createdAt, updatedAt, deletedAt",

  syncQueue:
    "++id, userId, entity, entityId, operation, createdAt",
});
  }
}

export const offlineDb =
  new OsusOfflineDatabase();