import { useEffect } from "react";

import { useFinanceStore } from "../../../../store/financeStore";
import { useGoalStore } from "../../../../store/goalStore";
import { useNotificationStore } from "../../../../store/notificationStore";
import { usePlannerStore } from "../../../../store/plannerStore";
import { useSettingsStore } from "../../../../store/settingsStore";
import { generateNotifications } from "../../utils/generateNotifications";
import { getPlannerDateKey } from "../../../planner/utils/plannerDate";

const MANAGED_NOTIFICATION_KEYS = [
  "planner-too-many-urgent",
  "planner-low-completion",
  "deadline-behind",
  "finance-blocked",
  "goal-ahead",
  "goal-finance-complete",
];

export default function NotificationEngine() {
  const targetMoney = useGoalStore(
    (state) => state.targetMoney,
  );

  const currentMoney = useGoalStore(
    (state) => state.currentMoney,
  );

  const deadline = useGoalStore(
    (state) => state.deadline,
  );

  const monthlyIncome = useFinanceStore(
    (state) => state.monthlyIncome,
  );

  const monthlyExpense = useFinanceStore(
    (state) => state.monthlyExpense,
  );

  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const preferences = useSettingsStore(
    (state) => state.notifications,
  );

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const resolveNotificationByKey =
    useNotificationStore(
      (state) => state.resolveNotificationByKey,
    );

  useEffect(() => {
    const todayKey = getPlannerDateKey(
      new Date(),
      "daily",
    );

    const activePlannerTasks = tasks.filter(
      (task) =>
        task.period === "daily" &&
        (task.dateKey === todayKey ||
          (!task.completed && task.dateKey < todayKey)),
    );

    const generated = generateNotifications({
      targetMoney,
      currentMoney,
      monthlyIncome,
      monthlyExpense,
      deadline,
      tasks: activePlannerTasks,
    });

    const allowedNotifications =
      generated.filter((notification) => {
        if (
          notification.dedupeKey ===
            "planner-too-many-urgent" ||
          notification.dedupeKey ===
            "planner-low-completion"
        ) {
          return preferences.planner;
        }

        if (
          notification.dedupeKey ===
          "finance-blocked"
        ) {
          return preferences.finance;
        }

        if (
          notification.dedupeKey ===
          "deadline-behind"
        ) {
          return preferences.deadline;
        }

        if (
          notification.dedupeKey ===
          "goal-ahead"
        ) {
          return (
            preferences.goal &&
            preferences.success
          );
        }

        if (
          notification.dedupeKey ===
          "goal-finance-complete"
        ) {
          return (
            preferences.goal &&
            preferences.success
          );
        }

        return true;
      });

    const activeKeys = new Set(
      allowedNotifications
        .map(
          (notification) =>
            notification.dedupeKey,
        )
        .filter(
          (key): key is string =>
            Boolean(key),
        ),
    );

    allowedNotifications.forEach(
      (notification) => {
        addNotification(notification);
      },
    );

    MANAGED_NOTIFICATION_KEYS.forEach(
      (key) => {
        if (!activeKeys.has(key)) {
          resolveNotificationByKey(key);
        }
      },
    );
  }, [
    targetMoney,
    currentMoney,
    monthlyIncome,
    monthlyExpense,
    deadline,
    tasks,
    preferences,
    addNotification,
    resolveNotificationByKey,
  ]);

  return null;
}