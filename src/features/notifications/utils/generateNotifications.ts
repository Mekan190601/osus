import type { PlannerTask } from "../../planner/types/planner.types";
import { createDeadlineForecast } from "../../analytics/utils/forecast";
import { getPlannerTaskStats } from "../../analytics/utils/analytics";
import type { CreateNotificationInput } from "../types/notification.types";

type GenerateNotificationsInput = {
  targetMoney: number;
  currentMoney: number;

  monthlyIncome: number;
  monthlyExpense: number;

  deadline: string;

  tasks: PlannerTask[];
};

export function generateNotifications({
  targetMoney,
  currentMoney,
  monthlyIncome,
  monthlyExpense,
  deadline,
  tasks,
}: GenerateNotificationsInput): CreateNotificationInput[] {
  const notifications: CreateNotificationInput[] = [];

  const plannerStats =
    getPlannerTaskStats(tasks);

  const deadlineForecast =
    createDeadlineForecast({
      targetMoney,
      currentMoney,
      monthlyIncome,
      monthlyExpense,
      deadline,
    });

  if (
    plannerStats.urgentImportant >= 5
  ) {
    notifications.push({
      title: "Gyssagly işler köpeldi",
      message: `I-nji bölümde ${plannerStats.urgentImportant} sany möhüm + gyssagly iş garaşýar.`,
      type: "warning",
      source: "planner",
      actionLabel: "Planner-i aç",
      actionPath: "/planner",
      dedupeKey: "planner-too-many-urgent",
    });
  }

  if (
    plannerStats.total >= 5 &&
    plannerStats.completionRate < 40
  ) {
    notifications.push({
      title: "Meýilnama tamamlanşy pes",
      message: `Häzirki tamamlanma derejesi ${plannerStats.completionRate}%. Prioritetleri azaltmak peýdaly bolup biler.`,
      type: "warning",
      source: "planner",
      actionLabel: "Planner-i aç",
      actionPath: "/planner",
      dedupeKey: "planner-low-completion",
    });
  }

  if (
    deadlineForecast.deadlineStatus ===
    "behind"
  ) {
    notifications.push({
      title: "Deadline grafikden yza galýar",
      message:
        "Häzirki maliýe depgini bilen maksada deadline-a çenli ýetmek kyn bolup biler.",
      type: "danger",
      source: "analytics",
      actionLabel: "Analizi gör",
      actionPath: "/analytics",
      dedupeKey: "deadline-behind",
    });
  }

  if (
    deadlineForecast.deadlineStatus ===
    "blocked"
  ) {
    notifications.push({
      title: "Maliýe ösüşi saklandy",
      message:
        "Häzirki aýlyk arassa girdeji 0 ýa-da otrisatel.",
      type: "danger",
      source: "finance",
      actionLabel: "Maliýä geç",
      actionPath: "/finance",
      dedupeKey: "finance-blocked",
    });
  }

  if (
    deadlineForecast.deadlineStatus ===
    "ahead"
  ) {
    notifications.push({
      title: "Maksat grafikden öňde",
      message:
        "Häzirki maliýe depginiň deadline talabyndan ýokary.",
      type: "success",
      source: "goal",
      actionLabel: "Maksady gör",
      actionPath: "/goals",
      dedupeKey: "goal-ahead",
    });
  }

  if (
    deadlineForecast.status ===
    "completed"
  ) {
    notifications.push({
      title: "Maliýe maksady tamamlandy",
      message:
        "Maksadyň maliýe bölegi 100% ýerine ýetirildi.",
      type: "success",
      source: "goal",
      actionLabel: "Maksady gör",
      actionPath: "/goals",
      dedupeKey: "goal-finance-complete",
    });
  }

  return notifications;
}