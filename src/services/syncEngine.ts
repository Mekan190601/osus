import {
  syncGoalQueue,
} from "./goalSyncService";

import {
  syncPlannerQueue,
} from "./plannerSyncService";

import {
  syncFinanceQueue,
} from "./financeSyncService";
import {
  syncWeeklyReviewQueue,
} from "./weeklyReviewSyncService";
import {
  syncSettingsQueue,
} from "./settingsSyncService";
import {
  syncCurrencyRateQueue,
} from "./currencyRateSyncService";
import {
  syncNotificationQueue,
} from "./notificationSyncService";

let isStarted = false;
let isSyncing = false;

/* =========================
   RUN SYNC
========================= */

async function runSync() {
  if (!navigator.onLine) {
    return;
  }

  if (isSyncing) {
    return;
  }

  try {
    isSyncing = true;

    await Promise.all([
  syncGoalQueue(),
  syncPlannerQueue(),
  syncFinanceQueue(),
  syncWeeklyReviewQueue(),
  syncSettingsQueue(),
  syncCurrencyRateQueue(),
  syncNotificationQueue(),
]);
  } catch (error) {
    console.warn(
      "Background sync failed:",
      error,
    );
  } finally {
    isSyncing = false;
  }
}

/* =========================
   EVENT HANDLERS
========================= */

function handleOnline() {
  void runSync();
}

function handleVisibilityChange() {
  if (
    document.visibilityState ===
      "visible" &&
    navigator.onLine
  ) {
    void runSync();
  }
}

/* =========================
   START
========================= */

export function startSyncEngine() {
  if (isStarted) {
    return;
  }

  isStarted = true;

  window.addEventListener(
    "online",
    handleOnline,
  );

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange,
  );

  if (navigator.onLine) {
    void runSync();
  }
}

/* =========================
   STOP
========================= */

export function stopSyncEngine() {
  if (!isStarted) {
    return;
  }

  window.removeEventListener(
    "online",
    handleOnline,
  );

  document.removeEventListener(
    "visibilitychange",
    handleVisibilityChange,
  );

  isStarted = false;
}

/* =========================
   MANUAL SYNC
========================= */

export async function syncNow() {
  await runSync();
}