import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Info,
  ShieldAlert,
} from "lucide-react";

import { useFinanceStore } from "../../store/financeStore";
import { useGoalStore } from "../../store/goalStore";
import { usePlannerStore } from "../../store/plannerStore";
import CoachActionPlan from "../../features/ai-coach/components/CoachActionPlan/CoachActionPlan";
import {
  generateCoachInsights,
  type CoachInsightSeverity,
} from "../../features/ai-coach/utils/coachInsights";
import { calculateFinancialProgress } from "../../features/analytics/utils/analytics";
import { calculateGrowthEngine } from "../../features/analytics/utils/growthEngine";
import { getPeriodProgress } from "../../features/planner/utils/plannerProgress";
import { getPlannerDateKey } from "../../features/planner/utils/plannerDate";
import {
  calculateSmartCoachGoalAnalysis,
  createSmartCoachRecommendations,
} from "../../features/ai-coach/utils/smartCoach";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/routePaths";
import { useMoney } from "../../hooks/useMoney";

function getInsightIcon(
  severity: CoachInsightSeverity,
) {
  if (severity === "success") {
    return CheckCircle2;
  }

  if (severity === "warning") {
    return AlertTriangle;
  }

  if (severity === "danger") {
    return ShieldAlert;
  }

  return Info;
}

function getInsightClasses(
  severity: CoachInsightSeverity,
) {
  if (severity === "success") {
    return {
      container:
        "border-success/20 bg-success/5",
      icon: "text-success",
    };
  }

  if (severity === "warning") {
    return {
      container:
        "border-warning/20 bg-warning/5",
      icon: "text-warning",
    };
  }

  if (severity === "danger") {
    return {
      container:
        "border-danger/20 bg-danger/5",
      icon: "text-danger",
    };
  }

  return {
    container:
      "border-primary/20 bg-primary/5",
    icon: "text-primary",
  };
}

export default function AICoachPage() {
  const { money } = useMoney();

  const mainGoal = useGoalStore(
    (state) => state.mainGoal,
  );
  const navigate = useNavigate();

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

  const financialProgress =
  calculateFinancialProgress(
    currentMoney,
    targetMoney,
  );

const plannerProgress =
  getPeriodProgress(
    tasks,
    "yearly",
  );

const growth = calculateGrowthEngine({
  financialProgress,
  plannerProgress,
});
const growthAdvice = {
  behind:
    "Umumy ösüş pes. Şu gün diňe iň möhüm işi saýlap, maliýe we meýilnama boýunça bir anyk ädim et.",
  steady:
    "Ösüş kadaly. Häzirki depgini saklap, gyssagly däl möhüm işleri öňünden meýilleşdir.",
  good:
    "Ösüş gowy. Esasy prioritetleri dowam etdir we ýerine ýetiriliş depginini sakla.",
  "near-goal":
    "Maksada örän ýakyn. Täze işler goşmakdan öň galan esasy işleri tamamla.",
  completed:
    "Umumy maksat tamamlandy. Indiki strategik maksady kesgitlemegiň wagty geldi.",
}[growth.status];


const todayKey = getPlannerDateKey(
  new Date(),
  "daily",
);

const dailyTasks = tasks.filter(
  (task) =>
    task.period === "daily" &&
    (task.dateKey === todayKey ||
      (!task.completed && task.dateKey < todayKey)),
);

const completedDailyTasks =
  dailyTasks.filter(
    (task) => task.completed,
  ).length;

const urgentImportantTasks =
  dailyTasks.filter(
    (task) =>
      !task.completed &&
      task.quadrant ===
        "urgent-important",
  ).length;

const monthlyNetIncome =
  monthlyIncome - monthlyExpense;

const goalAnalysis =
  calculateSmartCoachGoalAnalysis({
    targetMoney,
    currentMoney,
    deadline,
    monthlyNetIncome,
  });

const currentWeeklyNet =
  monthlyNetIncome > 0
    ? Math.round(monthlyNetIncome / 4.345)
    : 0;

const weeklyGap = Math.max(
  goalAnalysis.requiredWeekly -
    currentWeeklyNet,
  0,
);

const weeklyStatus =
  goalAnalysis.status === "no-goal"
    ? "no-goal"
    : weeklyGap > 0
      ? "behind"
      : "on-track";

  const smartRecommendations =
  createSmartCoachRecommendations({
    growthStatus: growth.status,

    financialProgress:
      growth.financialProgress,

    plannerProgress:
      growth.plannerProgress,

    totalTasks:
      dailyTasks.length,

    completedTasks:
      completedDailyTasks,

    urgentImportantTasks,

    monthlyNetIncome,

    targetMoney,
    currentMoney,
    deadline,
    formatMoney: money,
  });
  const primaryRecommendation =
  smartRecommendations[0];

  function handleRecommendationAction(
  category:
    | "finance"
    | "planner"
    | "focus"
    | "growth",
) {
  if (category === "finance") {
    navigate(
      `${ROUTES.finance}?action=review`,
    );
    return;
  }

  if (category === "planner") {
    navigate(
      `${ROUTES.planner}?action=new`,
    );
    return;
  }

  if (category === "focus") {
    navigate(
      `${ROUTES.dashboard}?focus=today`,
    );
    return;
  }

  navigate(ROUTES.dashboard);
}

  const insights = generateCoachInsights({
    mainGoal,
    targetMoney,
    currentMoney,
    monthlyIncome,
    monthlyExpense,
    deadline,
    tasks: dailyTasks,
    formatMoney: money,
  });

  return (
  <div className="space-y-3 pb-6 sm:space-y-5 sm:pb-8 lg:space-y-8 lg:pb-10">
    {/* ======================================
        HEADER
    ====================================== */}

    <section className="rounded-[20px] border border-border bg-surface p-4 shadow-[var(--app-shadow)] sm:rounded-3xl sm:p-6 lg:p-8">
      <div className="flex items-center gap-2 text-primary">
        <Brain size={19} />

        <span className="text-sm font-semibold">
          Akylly maslahatçy
        </span>
      </div>

      <h1 className="mt-2 text-[21px] font-bold leading-7 tracking-tight text-text-primary sm:mt-3 sm:text-3xl sm:leading-normal lg:text-4xl">
        Akylly ösüş maslahatlary
      </h1>

      <p className="mt-1.5 max-w-3xl text-[10px] leading-4 text-text-muted sm:mt-3 sm:text-sm sm:leading-6 lg:text-base lg:leading-7">
        Maksat, maliýe we meýilnama maglumatlaryň
  esasynda häzirki ýagdaýyň seljerilip,
  iň möhüm maslahatlar saýlanýar.
      </p>
    </section>

    {/* ======================================
        TOP OVERVIEW
    ====================================== */}

    <div className="grid grid-cols-1 gap-2.5 sm:gap-4 xl:grid-cols-[0.8fr_1.2fr] xl:gap-6">
      {/* GROWTH STATUS */}

      <section className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6">
        <p className="text-sm font-semibold text-primary">
          Umumy ösüş ýagdaýy
        </p>

        <div className="mt-5">
          <p className="text-[30px] font-bold tracking-tight text-text-primary sm:text-4xl">
            {growth.overallProgress}%
          </p>

          <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-text-secondary sm:mt-3 sm:line-clamp-none sm:text-sm sm:leading-6">
            {growthAdvice}
          </p>
        </div>

        <div className="mt-3 border-t border-primary/10 pt-3 sm:mt-6 sm:pt-5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
            Maliýe / Meýilnama
          </p>

          <div className="mt-2 flex items-end justify-between gap-3 sm:mt-3 sm:gap-4">
            <div>
              <p className="text-xs text-text-muted">
                Maliýe ösüşi
              </p>

              <p className="mt-1 text-xl font-bold text-text-primary">
                {growth.financialProgress}%
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-text-muted">
                Meýilnama ösüşi
              </p>

              <p className="mt-1 text-xl font-bold text-text-primary">
                {growth.plannerProgress}%
              </p>
            </div>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/60 sm:mt-4 sm:h-2">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max(
                    growth.overallProgress,
                    0,
                  ),
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* PRIMARY ACTION */}

      {primaryRecommendation ? (
        <section className="rounded-xl border border-primary/25 bg-primary/5 p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6 lg:p-7">
          <div className="flex h-full flex-col justify-between gap-3 sm:gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Brain size={18} />

                <span className="text-sm font-semibold">
                  Şu günki esasy hereket
                </span>
              </div>

              <h2 className="mt-2 max-w-3xl text-lg font-bold leading-6 tracking-tight text-text-primary sm:mt-4 sm:text-2xl sm:leading-normal lg:text-3xl">
                {primaryRecommendation.title}
              </h2>

              <p className="mt-1.5 line-clamp-3 max-w-3xl text-[10px] leading-4 text-text-muted sm:mt-3 sm:line-clamp-none sm:text-sm sm:leading-7">
                {
                  primaryRecommendation.description
                }
              </p>

              {!["no-goal", "expired", "completed"].includes(goalAnalysis.status) && (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-3">
                  <div className="rounded-lg border border-border bg-background/35 p-2.5 sm:rounded-xl sm:p-4">
                    <p className="text-xs text-text-muted">Galan pul</p>
                    <p className="mt-1 text-sm font-bold text-text-primary sm:mt-2 sm:text-lg">
                      {money(goalAnalysis.remainingMoney)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-background/35 p-2.5 sm:rounded-xl sm:p-4">
                    <p className="text-xs text-text-muted">Aýda gerek</p>
                    <p className="mt-1 text-sm font-bold text-warning sm:mt-2 sm:text-lg">
                      {money(goalAnalysis.requiredMonthly)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-background/35 p-2.5 sm:rounded-xl sm:p-4">
                    <p className="text-xs text-text-muted">Hepdede gerek</p>
                    <p className="mt-1 text-sm font-bold text-primary sm:mt-2 sm:text-lg">
                      {money(goalAnalysis.requiredWeekly)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-background/35 p-2.5 sm:rounded-xl sm:p-4">
                    <p className="text-xs text-text-muted">Günde gerek</p>
                    <p className="mt-1 text-sm font-bold text-success sm:mt-2 sm:text-lg">
                      {money(goalAnalysis.requiredDaily)}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:mt-5 sm:gap-2">
                <span
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-semibold",
                    primaryRecommendation.priority ===
                    "high"
                      ? "border-danger/20 bg-danger/10 text-danger"
                      : primaryRecommendation.priority ===
                          "medium"
                        ? "border-warning/20 bg-warning/10 text-warning"
                        : "border-primary/20 bg-primary/10 text-primary",
                  ].join(" ")}
                >
                 {primaryRecommendation.priority ===
"high"
  ? "Iň möhüm"
  : primaryRecommendation.priority ===
      "medium"
    ? "Möhüm"
    : "Pes möhüm"}
                </span>

                <span className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs font-semibold text-text-muted">
                  {primaryRecommendation.category ===
                  "finance"
                    ? "Maliýe"
                    : primaryRecommendation.category ===
                        "planner"
                      ? "Meýilnama"
                      : primaryRecommendation.category ===
                          "focus"
                        ? "Fokus"
                        : "Ösüş"}
                </span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  handleRecommendationAction(
                    primaryRecommendation.category,
                  )
                }
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-[11px] font-semibold text-slate-950 transition hover:bg-primary-hover sm:h-11 sm:rounded-xl sm:px-5 sm:text-sm"
              >
                Şu häzir et
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>


    {/* ======================================
        THIS WEEK'S FINANCIAL ACTION
    ====================================== */}

    {["behind", "on-track", "no-income"].includes(goalAnalysis.status) && (
      <section
        className={[
          "rounded-xl border p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6",
          weeklyStatus === "behind"
            ? "border-warning/20 bg-warning/[0.035]"
            : "border-success/20 bg-success/[0.035]",
        ].join(" ")}
      >
        <div className="flex flex-col gap-2.5 sm:gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p
              className={[
                "text-sm font-semibold",
                weeklyStatus === "behind"
                  ? "text-warning"
                  : "text-success",
              ].join(" ")}
            >
              Şu hepdäniň maliýe ädimi
            </p>

            <h2 className="mt-1.5 text-lg font-bold tracking-tight text-text-primary sm:mt-2 sm:text-2xl">
              {weeklyStatus === "behind"
                ? `Şu hepde ýene ${money(weeklyGap)} tap`
                : "Şu hepdäniň depgini ýeterlik"}
            </h2>

            <p className="mt-1.5 line-clamp-2 max-w-3xl text-[10px] leading-4 text-text-muted sm:mt-3 sm:line-clamp-none sm:text-sm sm:leading-6">
              Maksada möhletinde ýetmek üçin şu hepde takmynan{" "}
              <strong className="text-text-primary">
                {money(goalAnalysis.requiredWeekly)}
              </strong>{" "}
              ýygnamak gerek. Häzirki durnukly depginiň hepdelik ekwiwalenti{" "}
              <strong className="text-text-primary">
                {money(currentWeeklyNet)}
              </strong>
              .
            </p>
          </div>

          <span
            className={[
              "inline-flex w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold",
              weeklyStatus === "behind"
                ? "border-warning/20 bg-warning/10 text-warning"
                : "border-success/20 bg-success/10 text-success",
            ].join(" ")}
          >
            {weeklyStatus === "behind"
              ? "Ýetmeýär"
              : "Ýeterlik"}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-6 sm:gap-3">
          <div className="rounded-lg border border-border bg-background/35 p-2.5 sm:rounded-xl sm:p-4">
            <p className="text-xs text-text-muted">
              Hepdede gerek
            </p>
            <p className="mt-1 text-sm font-bold text-text-primary sm:mt-2 sm:text-lg">
              {money(goalAnalysis.requiredWeekly)}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background/35 p-2.5 sm:rounded-xl sm:p-4">
            <p className="text-xs text-text-muted">
              Häzirki hepdelik depgin
            </p>
            <p
              className={[
                "mt-2 text-lg font-bold",
                weeklyStatus === "behind"
                  ? "text-warning"
                  : "text-success",
              ].join(" ")}
            >
              {money(currentWeeklyNet)}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background/35 p-2.5 sm:rounded-xl sm:p-4">
            <p className="text-xs text-text-muted">
              Tapawut
            </p>
            <p
              className={[
                "mt-2 text-lg font-bold",
                weeklyGap > 0
                  ? "text-warning"
                  : "text-success",
              ].join(" ")}
            >
              {weeklyGap > 0
                ? money(weeklyGap)
                : money(0)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-border/70 pt-3 sm:mt-5 sm:gap-4 sm:pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-xs leading-5 text-text-muted">
            {weeklyStatus === "behind"
              ? `Şu hepdede ${money(weeklyGap)} goşmaça boş pul döretmek üçin girdejini artdyr ýa-da zerur däl çykdajylary azalt.`
              : "Häzirki hepdelik depgini sakla. Goşmaça girdeji ýüze çyksa, ony maksada gönükdirmek möhleti has hem ýeňilleşdirer."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                `${ROUTES.finance}?action=review`,
              )
            }
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-slate-950 transition hover:bg-primary-hover"
          >
            Maliýä geç
          </button>
        </div>
      </section>
    )}

    {/* ======================================
        RECOMMENDATIONS + INSIGHTS
    ====================================== */}

    <div className="grid grid-cols-1 gap-2.5 sm:gap-4 xl:grid-cols-2 xl:gap-6">
      {/* SMART RECOMMENDATIONS */}

      <section className="rounded-xl border border-border bg-surface p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6">
        <div>
          <p className="text-sm font-semibold text-primary">
            Akylly maslahatlar
          </p>

          <h2 className="mt-1 text-lg font-bold text-text-primary sm:mt-2 sm:text-2xl">
            Indiki möhüm ädimler
          </h2>

          <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-text-muted sm:mt-2 sm:line-clamp-none sm:text-sm sm:leading-6">
            Häzirki ýagdaýyň boýunça iň ýokary
            täsirli maslahatlar prioritet boýunça
            tertiplendi.
          </p>
        </div>

        <div className="mt-3 space-y-2 sm:mt-6 sm:space-y-3">
          {smartRecommendations
            .slice(
              primaryRecommendation ? 1 : 0,
              5,
            )
            .map(
              (
                recommendation,
                index,
              ) => (
                <article
                  key={recommendation.id}
                  className="rounded-lg border border-border bg-background/40 p-3 transition hover:border-primary/20 sm:rounded-xl sm:p-4"
                >
                  <div className="flex items-start gap-2.5 sm:gap-4">
                    <div
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                        recommendation.priority ===
                        "high"
                          ? "bg-danger/10 text-danger"
                          : recommendation.priority ===
                              "medium"
                            ? "bg-warning/10 text-warning"
                            : "bg-primary/10 text-primary",
                      ].join(" ")}
                    >
                      {index + 2}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-text-primary">
                          {
                            recommendation.title
                          }
                        </h3>

                        <span
                          className={[
                            "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase",
                            recommendation.priority ===
                            "high"
                              ? "border-danger/20 bg-danger/10 text-danger"
                              : recommendation.priority ===
                                  "medium"
                                ? "border-warning/20 bg-warning/10 text-warning"
                                : "border-primary/20 bg-primary/10 text-primary",
                          ].join(" ")}
                        >
                          {
                            recommendation.priority
                          }
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-text-secondary sm:mt-2 sm:line-clamp-none sm:text-sm sm:leading-6">
                        {
                          recommendation.description
                        }
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleRecommendationAction(
                            recommendation.category,
                          )
                        }
                        className="mt-2 inline-flex h-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 px-3 text-[10px] font-semibold text-primary transition hover:bg-primary/15 sm:mt-4 sm:h-9 sm:px-4 sm:text-xs"
                      >
                        Şu häzir et
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}

          {smartRecommendations.length <=
            1 && (
            <div className="rounded-xl border border-dashed border-border bg-background/30 p-6 text-center">
              <CheckCircle2
                size={22}
                className="mx-auto text-success"
              />

              <p className="mt-3 text-sm font-semibold text-text-primary">
                Häzirki wagtda goşmaça möhüm
                maslahat ýok
              </p>

              <p className="mt-2 text-xs leading-5 text-text-muted">
                Esasy hereketiňe üns berip,
                häzirki depgini dowam etdir.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CURRENT ANALYSIS */}

      <section className="rounded-xl border border-border bg-surface p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6">
        <div>
          <p className="text-sm font-semibold text-primary">
            Häzirki analiz
          </p>

          <h2 className="mt-1 text-lg font-bold text-text-primary sm:mt-2 sm:text-2xl">
  {insights.length} möhüm maglumat
</h2>

          <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-text-muted sm:mt-2 sm:line-clamp-none sm:text-sm sm:leading-6">
            Sistemanyň häzirki maglumatlardan
            ýüze çykaran esasy signallary.
          </p>
        </div>

        <div className="mt-3 space-y-2 sm:mt-6 sm:space-y-3">
          {insights.map((insight) => {
            const Icon =
              getInsightIcon(
                insight.severity,
              );

            const classes =
              getInsightClasses(
                insight.severity,
              );

            return (
              <article
                key={insight.id}
                className={[
                  "rounded-xl border p-4",
                  classes.container,
                ].join(" ")}
              >
                <div className="flex items-start gap-2.5 sm:gap-4">
                  <div
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current/10 bg-background/30",
                      classes.icon,
                    ].join(" ")}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-text-primary">
                      {insight.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-text-muted sm:mt-2 sm:line-clamp-none sm:text-sm sm:leading-6">
                      {
                        insight.description
                      }
                    </p>
                  </div>
                </div>
              </article>
            );
          })}

          {insights.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-background/30 p-6 text-center">
              <Info
                size={22}
                className="mx-auto text-primary"
              />

              <p className="mt-3 text-sm font-semibold text-text-primary">
                Häzirki wagtda aýratyn signal ýok
              </p>

              <p className="mt-2 text-xs leading-5 text-text-muted">
                Maglumatlaryň artdygyça täze
                analizler şu ýerde peýda bolar.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>

    {/* ======================================
        ACTION PLAN
    ====================================== */}

    <section className="rounded-xl border border-border bg-surface p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6">
      <div className="mb-3 sm:mb-5">
        <p className="text-sm font-semibold text-primary">
          Hereket meýilnamasy
        </p>

        <h2 className="mt-1 text-lg font-bold text-text-primary sm:mt-2 sm:text-2xl">
          Maslahatlary real ädimlere öwür
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
          Analizden çykýan iň möhüm maslahatlar
          ýerine ýetirip bolýan anyk ädimlere
          öwrülýär.
        </p>
      </div>

      <CoachActionPlan
        insights={insights}
        growthStatus={growth.status}
      />
    </section>

    {/* ======================================
        ENGINE INFO
    ====================================== */}

  </div>
);
}