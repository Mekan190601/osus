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
   SYNC JOBS
========================= */

const syncJobs = [
  {
    name: "Goals",
    run: syncGoalQueue,
  },
  {
    name: "Planner",
    run: syncPlannerQueue,
  },
  {
    name: "Finance",
    run: syncFinanceQueue,
  },
  {
    name: "Weekly Review",
    run: syncWeeklyReviewQueue,
  },
  {
    name: "Settings",
    run: syncSettingsQueue,
  },
  {
    name: "Currency Rates",
    run: syncCurrencyRateQueue,
  },
  {
    name: "Notifications",
    run: syncNotificationQueue,
  },
] as const;

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

  isSyncing = true;

  try {
    /*
     * Bir modulda sync error bolsa,
     * beýleki modullaryň sync-i kesilmeýär.
     *
     * Promise.allSettled ähli sync işleriniň
     * tamamlanmagyna garaşýar.
     */
    const results =
      await Promise.allSettled(
        syncJobs.map(
          ({ run }) => run(),
        ),
      );

    results.forEach(
      (result, index) => {
        if (
          result.status ===
          "rejected"
        ) {
          console.warn(
            `${syncJobs[index].name} background sync failed:`,
            result.reason,
          );
        }
      },
    );
  } catch (error) {
    /*
     * allSettled adatça reject etmeýär,
     * ýöne garaşylmadyk ýagdaýlar üçin
     * umumy gorag saklanýar.
     */
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

  /*
   * Programma online ýagdaýda açylsa,
   * öňki offline queue derrew synhronlanýar.
   */
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