import type { GrowthStatus } from "../../analytics/utils/growthEngine";

type SmartCoachInput = {
  growthStatus: GrowthStatus;

  financialProgress: number;
  plannerProgress: number;

  totalTasks: number;
  completedTasks: number;
  urgentImportantTasks: number;

  monthlyNetIncome: number;

  // Maksat maglumatlary
  targetMoney?: number;
  currentMoney?: number;
  deadline?: string;
  formatMoney?: (value: number) => string;
};

export type SmartCoachRecommendation = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category:
    | "finance"
    | "planner"
    | "focus"
    | "growth";
};

export type SmartCoachGoalAnalysis = {
  remainingMoney: number;
  remainingDays: number;
  remainingMonths: number;

  requiredMonthly: number;
requiredWeekly: number;
requiredDaily: number;

  currentMonthlyNet: number;

  monthlyGap: number;
  weeklyGap: number;

  projectedMonths: number | null;

  status:
    | "completed"
    | "on-track"
    | "behind"
    | "no-income"
    | "expired"
    | "no-goal";
};

export function calculateSmartCoachGoalAnalysis({
  targetMoney = 0,
  currentMoney = 0,
  deadline,
  monthlyNetIncome,
}: Pick<
  SmartCoachInput,
  | "targetMoney"
  | "currentMoney"
  | "deadline"
  | "monthlyNetIncome"
>): SmartCoachGoalAnalysis {
  const remainingMoney = Math.max(
    targetMoney - currentMoney,
    0,
  );

  if (targetMoney <= 0 || !deadline) {
    return {
      remainingMoney,
      remainingDays: 0,
      remainingMonths: 0,
      requiredMonthly: 0,
requiredWeekly: 0,
requiredDaily: 0,
      currentMonthlyNet: monthlyNetIncome,
      monthlyGap: 0,
      weeklyGap: 0,
      projectedMonths: null,
      status: "no-goal",
    };
  }

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    return {
      remainingMoney,
      remainingDays: 0,
      remainingMonths: 0,
      requiredMonthly: 0,
      requiredWeekly: 0,
      requiredDaily: 0,
      currentMonthlyNet: monthlyNetIncome,
      monthlyGap: 0,
      weeklyGap: 0,
      projectedMonths: null,
      status: "no-goal",
    };
  }

  if (remainingMoney <= 0) {
    return {
      remainingMoney: 0,
      remainingDays: 0,
      remainingMonths: 0,
      requiredMonthly: 0,
requiredWeekly: 0,
requiredDaily: 0,
      currentMonthlyNet: monthlyNetIncome,
      monthlyGap: 0,
      weeklyGap: 0,
      projectedMonths: 0,
      status: "completed",
    };
  }

  const now = new Date();

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const rawRemainingDays = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / millisecondsPerDay,
  );

  if (rawRemainingDays <= 0) {
    return {
      remainingMoney,
      remainingDays: 0,
      remainingMonths: 0,
      requiredMonthly: 0,
      requiredWeekly: 0,
      requiredDaily: 0,
      currentMonthlyNet: Math.round(monthlyNetIncome),
      monthlyGap: 0,
      weeklyGap: 0,
      projectedMonths:
        monthlyNetIncome > 0
          ? Math.ceil(remainingMoney / monthlyNetIncome)
          : null,
      status: "expired",
    };
  }

  const remainingDays = rawRemainingDays;

  // Ortaça kalendar aýy
  const remainingMonths = Math.max(
    remainingDays / 30.4375,
    1 / 30.4375,
  );

  const requiredMonthly =
    remainingMoney / remainingMonths;

  const requiredWeekly =
    (remainingMoney / remainingDays) * 7;

    const requiredDaily =
  remainingMoney / remainingDays;

  const monthlyGap = Math.max(
    requiredMonthly - monthlyNetIncome,
    0,
  );

  const weeklyCurrent =
    monthlyNetIncome > 0
      ? monthlyNetIncome / 4.345
      : 0;

  const weeklyGap = Math.max(
    requiredWeekly - weeklyCurrent,
    0,
  );

  const projectedMonths =
    monthlyNetIncome > 0
      ? remainingMoney / monthlyNetIncome
      : null;

  let status: SmartCoachGoalAnalysis["status"];

  if (monthlyNetIncome <= 0) {
    status = "no-income";
  } else if (
    monthlyNetIncome >= requiredMonthly
  ) {
    status = "on-track";
  } else {
    status = "behind";
  }

  return {
    remainingMoney: Math.round(
      remainingMoney,
    ),

    remainingDays,

    remainingMonths:
      Math.round(remainingMonths * 10) /
      10,

    requiredMonthly: Math.ceil(
      requiredMonthly,
    ),

    requiredWeekly: Math.ceil(
      requiredWeekly,
    ),
    requiredDaily: Math.ceil(
  requiredDaily,
),

    currentMonthlyNet: Math.round(
      monthlyNetIncome,
    ),

    monthlyGap: Math.ceil(monthlyGap),

    weeklyGap: Math.ceil(weeklyGap),

    projectedMonths:
      projectedMonths === null
        ? null
        : Math.ceil(projectedMonths),

    status,
  };
}

export function createSmartCoachRecommendations({
  growthStatus,
  financialProgress,
  plannerProgress,
  totalTasks,
  completedTasks,
  urgentImportantTasks,
  monthlyNetIncome,
  targetMoney = 0,
  currentMoney = 0,
  deadline,
  formatMoney,
}: SmartCoachInput): SmartCoachRecommendation[] {
  const recommendations: SmartCoachRecommendation[] = [];

  const money =
    formatMoney ??
    ((value: number) =>
      `${Math.round(value).toLocaleString("tk-TM")} m`);

  const completionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) *
            100,
        )
      : 0;

  const goalAnalysis =
    calculateSmartCoachGoalAnalysis({
      targetMoney,
      currentMoney,
      deadline,
      monthlyNetIncome,
    });

  /*
   * ==========================================
   * 1. MAKSAT BOÝUNÇA IŇ MÖHÜM KARAR
   * ==========================================
   */

  if (goalAnalysis.status === "behind") {
    recommendations.push({
      id: "goal-financial-gap",

      title: `Aýda ýene ${money(goalAnalysis.monthlyGap)} gerek`,

      description:
  `Maksada möhletinde ýetmek üçin aýda takmynan ` +
  `${money(goalAnalysis.requiredMonthly)} ýygnamaly. ` +
  `Bu hepdelik takmynan ${money(goalAnalysis.requiredWeekly)}, ` +
  `günlük bolsa ${money(goalAnalysis.requiredDaily)} bolýar. ` +
  `Häzirki arassa aýlyk depginiň ${money(goalAnalysis.currentMonthlyNet)}. ` +
  `Şonuň üçin aýda ýene ${money(goalAnalysis.monthlyGap)} goşmak gerek.`,

      priority: "high",
      category: "finance",
    });
  }

  if (goalAnalysis.status === "on-track") {
    recommendations.push({
      id: "goal-on-track",

      title: "Maksada ýetmek üçin depgin ýeterlik",

      description:
        `Häzirki arassa aýlyk depginiň ${money(goalAnalysis.currentMonthlyNet)}. ` +
        `Maksat üçin aýda takmynan ${money(goalAnalysis.requiredMonthly)} gerek. ` +
        `Häzirki depgini saklasaň, maksada möhletinde ýetmek mümkin.`,

      priority: "medium",
      category: "growth",
    });
  }

  if (goalAnalysis.status === "no-income") {
    recommendations.push({
      id: "goal-no-net-income",

      title: "Maksat üçin arassa girdeji döret",

      description:
        `Maksada ýetmek üçin aýda takmynan ` +
        `${money(goalAnalysis.requiredMonthly)} ýygnamak gerek. ` +
        `Häzirki wagtda çykdajydan soň maksada gönükdirilýän durnukly pul ýok.`,

      priority: "high",
      category: "finance",
    });
  }

  if (goalAnalysis.status === "expired") {
    recommendations.push({
      id: "goal-deadline-expired",
      title: "Maksadyň möhleti geçdi",
      description:
        `Maksada ýetmek üçin ýene ${money(goalAnalysis.remainingMoney)} gerek. ` +
        "Täze real möhlet kesgitle ýa-da maksat şertlerini täzeden gözden geçir.",
      priority: "high",
      category: "growth",
    });
  }

  if (goalAnalysis.status === "completed") {
    recommendations.push({
      id: "goal-completed-money",

      title: "Maliýe maksady ýerine ýetirildi",

      description:
        "Maksat üçin gerek pul doly ýygnaldy. Indiki strategik maksady kesgitläp bilersiň.",

      priority: "low",
      category: "growth",
    });
  }

  /*
   * ==========================================
   * 2. GÜNÜŇ FOKUSY
   * ==========================================
   */

  if (urgentImportantTasks > 0) {
    recommendations.push({
      id: "urgent-focus",

      title: "Gyssagly möhüm işleri ilki tamamla",

      description:
        `Häzirki wagtda ${urgentImportantTasks} sany möhüm + gyssagly iş bar. ` +
        `Täze işe geçmezden öň şulary azalt.`,

      priority: "high",
      category: "focus",
    });
  }

  /*
   * ==========================================
   * 3. MALIÝE SAGDYNLYGY
   * ==========================================
   */

  if (monthlyNetIncome < 0) {
    recommendations.push({
      id: "negative-cashflow",

      title: "Çykdajylary gyssagly gözden geçir",

      description:
        `Aýlyk çykdajy girdejiden ${money(Math.abs(monthlyNetIncome))} köp. ` +
        `Ilki arassa girdejini 0-dan ýokary çykarmak gerek.`,

      priority: "high",
      category: "finance",
    });
  }

  /*
   * ==========================================
   * 4. MALIÝE / MEÝILNAMA BALANSY
   * ==========================================
   */

  if (
    financialProgress <
    plannerProgress - 20
  ) {
    recommendations.push({
      id: "finance-behind",

      title: "Maliýe ösüşini güýçlendir",

      description:
        "Meýilnama ösüşiň maliýe ösüşinden ep-esli öňde. Maksada gönükdirilýän pul depginini ýokarlandyrmak gerek.",

      priority: "medium",
      category: "finance",
    });
  }

  if (
    plannerProgress <
    financialProgress - 20
  ) {
    recommendations.push({
      id: "execution-behind",

      title: "Ýerine ýetirilişi güýçlendir",

      description:
        "Maliýe ösüşiň meýilnama ösüşinden öňde. Maksada degişli möhüm işleri ýerine ýetirmäge fokus et.",

      priority: "medium",
      category: "planner",
    });
  }

  /*
   * ==========================================
   * 5. IŞ ÝÜKI
   * ==========================================
   */

  if (
    totalTasks >= 5 &&
    completionRate < 50
  ) {
    recommendations.push({
      id: "low-completion",

      title: "Günlük işleriň sanyny azalt",

      description:
        `Häzirki tamamlanma derejäň ${completionRate}%. ` +
        `Iň möhüm 3 işi saýla we ilki şolary tamamla.`,

      priority: "medium",
      category: "planner",
    });
  }

  /*
   * ==========================================
   * 6. UMUMY ÖSÜŞ
   * ==========================================
   */

  if (growthStatus === "behind") {
    recommendations.push({
      id: "growth-behind",

      title: "Ösüş depginini dikelt",

      description:
        "Umumy ösüş pes. Şu gün maliýe boýunça bir anyk ädim we meýilnama boýunça bir möhüm işi tamamla.",

      priority: "medium",
      category: "growth",
    });
  }

  if (growthStatus === "near-goal") {
    recommendations.push({
      id: "near-goal",

      title: "Galany tamamla",

      description:
        "Maksada ýakynlaşdyň. Täze işleri goşmazdan öň galan möhüm ädimleri tamamla.",

      priority: "medium",
      category: "growth",
    });
  }

  /*
   * ==========================================
   * FALLBACK
   * ==========================================
   */

  if (recommendations.length === 0) {
    recommendations.push({
      id: "keep-going",

      title: "Häzirki depgini dowam etdir",

      description:
        "Maliýe bilen meýilnama arasynda gowy balans bar. Häzirki prioritetleri dowam etdir.",

      priority: "low",
      category: "growth",
    });
  }

  /*
   * ==========================================
   * PRIORITET TERTIBI
   * ==========================================
   */

  const priorityOrder = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return recommendations.sort(
    (a, b) =>
      priorityOrder[b.priority] -
      priorityOrder[a.priority],
  );
}