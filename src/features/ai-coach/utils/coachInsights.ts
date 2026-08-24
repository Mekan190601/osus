import type { PlannerTask } from "../../planner/types/planner.types";
import { createCoachMetrics } from "../selectors/coach.selectors";

export type CoachInsightSeverity =
  | "success"
  | "info"
  | "warning"
  | "danger";

export type CoachInsight = {
  id: string;
  title: string;
  description: string;
  severity: CoachInsightSeverity;
};

type GenerateCoachInsightsInput = {
  mainGoal: string;

  targetMoney: number;
  currentMoney: number;

  monthlyIncome: number;
  monthlyExpense: number;

  deadline: string;

  tasks: PlannerTask[];
  formatMoney?: (value: number) => string;
};

function getMonthsUntilDeadline(
  deadline: string,
): number | null {
  if (!deadline) {
    return null;
  }

  const deadlineDate = new Date(deadline);

  if (
    Number.isNaN(
      deadlineDate.getTime(),
    )
  ) {
    return null;
  }

  const today = new Date();

  if (
    deadlineDate.getTime() <=
    today.getTime()
  ) {
    return 0;
  }

  const milliseconds =
    deadlineDate.getTime() -
    today.getTime();

  return Math.max(
    Math.ceil(
      milliseconds /
        (1000 *
          60 *
          60 *
          24 *
          30.44),
    ),
    0,
  );
}

export function generateCoachInsights({
  mainGoal,
  targetMoney,
  currentMoney,
  monthlyIncome,
  monthlyExpense,
  deadline,
  tasks,
  formatMoney,
}: GenerateCoachInsightsInput): CoachInsight[] {
  const insights: CoachInsight[] = [];
  const money =
    formatMoney ??
    ((value: number) => `${Math.round(value).toLocaleString("tk-TM")} m`);

  const metrics = createCoachMetrics({
    targetMoney,
    currentMoney,
    monthlyIncome,
    monthlyExpense,
    tasks,
  });

  const monthsUntilDeadline =
    getMonthsUntilDeadline(deadline);

  if (!mainGoal.trim()) {
    insights.push({
      id: "missing-goal",
      title:
        "Esasy maksadyňy kesgitle",
      description:
        "ÖSÜŞ-iň beýleki modullarynyň peýdaly analiz bermegi üçin ilki esasy strategik maksat gerek.",
      severity: "warning",
    });
  }

  if (
    targetMoney > 0 &&
    metrics.financialProgress >= 100
  ) {
    insights.push({
      id: "financial-goal-complete",
      title:
        "Maliýe maksady tamamlandy",
      description:
  "Maliýe ösüşi 100%-e ýetdi. Indi esasy ünsi meýilnamadaky işleri ýerine ýetirmäge geçirip bilersiň.",
      severity: "success",
    });
  }

  if (
    targetMoney > 0 &&
    metrics.financialProgress < 50 &&
    metrics.monthlyNetIncome <= 0
  ) {
    insights.push({
      id: "negative-cash-flow",
      title:
        "Maliýe depgini üýtgetmeli",
      description:
  "Maksadyň ýarysyna-da ýetilmänkä aýlyk arassa girdeji 0 ýa-da 0-dan pes. Girdejini artdyrmak ýa-da çykdajyny azaltmak möhüm.",
      severity: "danger",
    });
  } else if (
    targetMoney > 0 &&
    metrics.financialProgress < 100 &&
    metrics.monthlyNetIncome > 0
  ) {
    insights.push({
      id: "positive-saving",
      title:
  "Maliýe ösüşi dowam edýär",
      description:
        `Häzirki aýlyk arassa girdeji ${money(
          metrics.monthlyNetIncome,
        )}. Galan maksat serişdesi ${money(
          metrics.remainingMoney,
        )}.`,
      severity: "info",
    });
  }

  if (
    metrics.urgentImportantTasks >= 5
  ) {
    insights.push({
      id: "too-many-urgent",
      title:
        "Gyssagly işler köpeldi",
      description:
        `I-nji Eisenhower bölüminde ${metrics.urgentImportantTasks} sany garaşýan iş bar. Olaryň sanyny azaltmak üçin II-nji bölümdäki işleri öňünden meýilleşdirmek peýdaly bolar.`,
      severity: "warning",
    });
  }

  if (
    metrics.totalTasks >= 5 &&
    metrics.completionRate < 40
  ) {
    insights.push({
      id: "low-completion",
     title:
  "Işleriň ýerine ýetirilişi pes",
description:
  `Meýilnamadaky işleriň diňe ${metrics.completionRate}%-i ýerine ýetirildi. Täze iş goşmazdan öň häzirki möhüm işleriň sanyny azaltmak gowy bolar.`,
      severity: "warning",
    });
  }

  if (
    metrics.totalTasks >= 5 &&
    metrics.completionRate >= 80
  ) {
    insights.push({
      id: "strong-completion",
      title:
        "Meýilnama ýerine ýetirilişi güýçli",
      description:
  `Meýilnamadaky işleriň ${metrics.completionRate}%-i ýerine ýetirildi. Häzirki iş depginiň gowy.`,
      severity: "success",
    });
  }

  if (
    monthsUntilDeadline !== null &&
    monthsUntilDeadline <= 3 &&
    metrics.remainingMoney > 0
  ) {
    insights.push({
      id: "deadline-close",
      title:
  "Soňky möhlet ýakynlaşýar",
description:
  `Soňky möhlete takmynan ${monthsUntilDeadline} aý galdy. Maksat üçin entek ${money(
    metrics.remainingMoney,
  )} gerek.`,
      severity: "danger",
    });
  }

  if (
    metrics.importantNotUrgentTasks >
    metrics.urgentImportantTasks
  ) {
    insights.push({
      id: "good-eisenhower-balance",
      title:
  "Işleriň paýlanyşy gowy",
      description:
        "Möhüm, ýöne gyssagly däl işler I-nji bölümden köp. Bu öňünden meýilleşdirmegiň gowy alamaty.",
      severity: "success",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "stable",
      title:
        "Ulgam kadaly işleýär",
      description:
  "Häzirki maglumatlarda möhüm mesele görünmeýär. Meýilnama we maliýe maglumatlaryny täze saklamagy dowam et.",
      severity: "info",
    });
  }

  return insights.slice(0, 6);
}