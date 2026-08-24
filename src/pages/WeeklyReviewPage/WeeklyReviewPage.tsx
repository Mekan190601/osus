import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  Gauge,
  History,
  Lightbulb,
  Save,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { useFinanceStore } from "../../store/financeStore";
import { useGoalStore } from "../../store/goalStore";
import { usePlannerStore } from "../../store/plannerStore";
import { useWeeklyReviewStore } from "../../store/weeklyReviewStore";

import { useMoney } from "../../hooks/useMoney";

import { calculateFinancialProgress } from "../../features/analytics/utils/analytics";
import { calculateGrowthEngine } from "../../features/analytics/utils/growthEngine";
import { getTasksCompletionProgress } from "../../features/planner/utils/plannerProgress";
import { getPlannerDateKey } from "../../features/planner/utils/plannerDate";
import { calculateMonthlyFinance } from "../../features/finance/utils/financeCalculations";
import { createWeeklyReview } from "../../features/review/utils/weeklyReview";

function clampPercent(value: number) {
  return Math.min(Math.max(Math.round(value), 0), 100);
}

export default function WeeklyReviewPage() {
  const { money } = useMoney();

  const saveReview = useWeeklyReviewStore(
    (state) => state.saveReview,
  );

  const savedReviews = useWeeklyReviewStore(
    (state) => state.reviews,
  );

  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState("");

  const targetMoney = useGoalStore(
    (state) => state.targetMoney,
  );

  const currentMoney = useGoalStore(
    (state) => state.currentMoney,
  );

  const monthlyIncome = useFinanceStore(
    (state) => state.monthlyIncome,
  );

  const monthlyExpense = useFinanceStore(
    (state) => state.monthlyExpense,
  );

  const transactions = useFinanceStore(
    (state) => state.transactions,
  );

  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const financialProgress =
    calculateFinancialProgress(
      currentMoney,
      targetMoney,
    );

  /*
   * HEPDELIK SYN ÜÇIN DOGRY TASK SANAWY
   *
   * 1) Şu hepdä degişli günlük işler.
   * 2) Şu hepdä degişli, ýöne günlük child-y
   *    bolmadyk hepdelik işler.
   *
   * Şeýlelikde auto-generated weekly parent
   * bilen onuň daily child-y iki gezek sanalmaýar.
   */
  const currentWeekKey =
    getPlannerDateKey(
      new Date(),
      "weekly",
    );

  const currentWeekDailyTasks =
    tasks.filter((task) => {
      if (
        task.period !== "daily"
      ) {
        return false;
      }

      const taskDate = new Date(
        `${task.dateKey}T12:00:00`,
      );

      if (
        Number.isNaN(
          taskDate.getTime(),
        )
      ) {
        return false;
      }

      return (
        getPlannerDateKey(
          taskDate,
          "weekly",
        ) === currentWeekKey
      );
    });

  const weeklyParentIdsWithDailyChildren =
    new Set(
      currentWeekDailyTasks
        .map(
          (task) =>
            task.parentTaskId,
        )
        .filter(
          (
            parentTaskId,
          ): parentTaskId is string =>
            Boolean(parentTaskId),
        ),
    );

  const currentWeekStandaloneWeeklyTasks =
    tasks.filter(
      (task) =>
        task.period === "weekly" &&
        task.dateKey ===
          currentWeekKey &&
        !weeklyParentIdsWithDailyChildren.has(
          task.id,
        ),
    );

  const reviewTasks = [
    ...currentWeekDailyTasks,
    ...currentWeekStandaloneWeeklyTasks,
  ];

  const plannerProgress =
    getTasksCompletionProgress(
      reviewTasks,
    );

  const finance =
    calculateMonthlyFinance({
      monthlyIncome,
      monthlyExpense,
      transactions,
    });

  const review = createWeeklyReview({
    tasks: reviewTasks,
    monthlyIncome:
      finance.totalIncome,
    monthlyExpense:
      finance.totalExpense,
    financialProgress,
    plannerProgress,
  });

  const growth = calculateGrowthEngine({
    financialProgress,
    plannerProgress,
  });

  const weeklyScore = clampPercent(
    review.completionRate * 0.4 +
      review.financialProgress * 0.3 +
      review.plannerProgress * 0.3,
  );

  const weeklyStatus =
    weeklyScore >= 80
      ? "Örän gowy hepde"
      : weeklyScore >= 60
        ? "Gowy ösüş"
        : weeklyScore >= 40
          ? "Ösüş bar"
          : weeklyScore >= 20
            ? "Has köp üns gerek"
            : "Täze başlangyç";

  const sortedReviews = [...savedReviews].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  );

  const latestReview = sortedReviews[0] ?? null;
  const previousReview = sortedReviews[1] ?? null;

  const completionDifference =
    latestReview && previousReview
      ? latestReview.completionRate -
        previousReview.completionRate
      : null;

  const overallDifference =
    latestReview && previousReview
      ? latestReview.overallProgress -
        previousReview.overallProgress
      : null;

  const strongestAreaLabel = {
    planner: "Meýilnama",
    finance: "Maliýe",
    balanced: "Deňagramly ösüş",
  }[review.strongestArea];

  const nextFocusLabel = {
    execution:
      "Indiki hepde köp iş goşma. Iň möhüm 3 işi saýlap, ilki şolary tamamla.",
    finance:
      "Indiki hepde arassa girdejini ýokarlandyrmaga we çykdajylary gözegçilikde saklamaga üns ber.",
    balance:
      "Maliýe ösüşi bilen meýilnamadaky işleri deň derejede öňe sür.",
    maintain:
      "Häzirki depgini sakla we gowy işleýän tertibi dowam etdir.",
  }[review.nextFocus];

  const strongPoint =
    review.monthlyNetIncome > 0
      ? {
          title: "Maliýe ýagdaýyň oňyn",
          description: `Arassa girdejiň ${money(
            review.monthlyNetIncome,
          )}. Bu maksat üçin öňe gitmäge mümkinçilik berýär.`,
        }
      : review.completionRate >= 60
        ? {
            title: "Işleriň köpüsini ýerine ýetirdiň",
            description: `Bu hepde işleriň ${review.completionRate}%-i tamamlandy. Şol depgini saklamak peýdaly.`,
          }
        : {
            title: "Hepdäni seljermek üçin maglumat bar",
            description:
              "Häzirki netijeleriň indiki hepde nirede üýtgeşme etmelidigini görkezýär.",
          };

  const improvementPoint =
    review.plannerProgress < 40
      ? {
          title: "Meýilnama tarapyny güýçlendir",
          description:
            "Meýilnamadaky ýerine ýetiriliş pes. Indiki hepde diňe iň möhüm işleri saýlap, olary tamamlamaga üns ber.",
        }
      : review.monthlyNetIncome <= 0
        ? {
            title: "Maliýe depginini gowulandyr",
            description:
              "Arassa girdeji 0 ýa-da 0-dan pes. Çykdajylary azaltmak ýa-da girdejini artdyrmak ileri tutulmaly.",
          }
        : review.pendingTasks > review.completedTasks
          ? {
              title: "Galan işleri azalt",
              description:
                "Tamamlanan işlerden galan işler köp. Täze iş goşmazdan öň açyk işleri azaltmak has peýdaly.",
            }
          : {
              title: "Depgini sakla",
              description:
                "Uly päsgelçilik görünmeýär. Häzirki tertibi dowam etdirip, esasy maksady göz öňünde sakla.",
            };

  const nextWeekActions = [
    review.plannerProgress < 50
      ? "Indiki hepde üçin diňe 3 möhüm işi saýla."
      : "Meýilnamadaky iň möhüm işleri wagtynda tamamla.",
    review.monthlyNetIncome > 0
      ? "Arassa girdejiniň belli bölegini maksada gönükdir."
      : "Bir zerur däl çykdajyny tap we azalt.",
    "Hepdäniň ahyrynda netijeleri täzeden gözden geçir.",
  ];

  function handleSaveReview() {
    saveReview({
      weekKey: currentWeekKey,
      totalTasks: review.totalTasks,
      completedTasks: review.completedTasks,
      pendingTasks: review.pendingTasks,
      completionRate: review.completionRate,
      monthlyNetIncome: review.monthlyNetIncome,
      financialProgress: review.financialProgress,
      plannerProgress: review.plannerProgress,
      overallProgress: growth.overallProgress,
      note: note.trim(),
    });

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div className="space-y-6 pb-10 lg:space-y-8">
      {/* HEADER */}
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--app-shadow)] sm:p-8">
        <div className="flex items-center gap-2 text-primary">
          <Gauge size={18} />
          <span className="text-sm font-semibold">
            Hepdelik syn
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Hepdäňi seljer. Indiki hepdäni güýçlendir.
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-text-muted sm:text-base">
              Geçen hepdäniň netijelerini gör, güýçli we gowulandyrmaly ýerleri kesgitle,
              soň indiki hepde üçin anyk ugur saýla.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveReview}
            className={[
              "inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition",
              saved
                ? "border border-success/20 bg-success/10 text-success"
                : "bg-primary text-slate-950 hover:bg-primary-hover",
            ].join(" ")}
          >
            <Save size={16} />
            {saved ? "Ýatda saklandy" : "Hepdäni tamamla"}
          </button>
        </div>
      </section>

      {/* WEEK SCORE */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-[var(--app-shadow)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={17} />
              <span className="text-sm font-semibold">
                Hepdäniň bahasy
              </span>
            </div>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-6xl font-bold tracking-tight text-text-primary">
                {weeklyScore}
              </span>
              <span className="pb-2 text-xl font-bold text-primary">
                /100
              </span>
            </div>

            <p className="mt-3 text-lg font-bold text-text-primary">
              {weeklyStatus}
            </p>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-background/60">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${weeklyScore}%` }}
              />
            </div>

            <p className="mt-4 text-xs leading-5 text-text-muted">
              Baha ýerine ýetiriliş, maliýe ösüşi we meýilnama ösüşi boýunça hasaplanýar.
            </p>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--app-shadow)]">
          <p className="text-sm font-semibold text-primary">
            Indiki hepdäniň esasy ugry
          </p>

          <h2 className="mt-3 text-2xl font-bold text-text-primary">
            {strongestAreaLabel}
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-text-secondary">
            {nextFocusLabel}
          </p>

          <div className="mt-5 border-t border-border/70 pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
              Umumy ösüş
            </p>
            <p className="mt-2 text-3xl font-bold text-primary">
              {growth.overallProgress}%
            </p>
          </div>
        </article>
      </section>

      {/* METRICS */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <article className="rounded-2xl border border-success/15 bg-success/[0.025] p-5 shadow-[var(--app-shadow)]">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 size={17} />
            <span className="text-sm">Tamamlanan</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-text-primary">
            {review.completedTasks}
          </p>
        </article>

        <article className="rounded-2xl border border-warning/15 bg-warning/[0.025] p-5 shadow-[var(--app-shadow)]">
          <div className="flex items-center gap-2 text-warning">
            <CircleDashed size={17} />
            <span className="text-sm">Galan işler</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-text-primary">
            {review.pendingTasks}
          </p>
        </article>

        <article className="rounded-2xl border border-info/15 bg-info/[0.025] p-5 shadow-[var(--app-shadow)]">
          <div className="flex items-center gap-2 text-info">
            <Target size={17} />
            <span className="text-sm">Ýerine ýetiriliş</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-info">
            {review.completionRate}%
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--app-shadow)]">
          <div className="flex items-center gap-2 text-text-muted">
            {review.monthlyNetIncome >= 0 ? (
              <ArrowUpRight size={17} className="text-success" />
            ) : (
              <ArrowDownRight size={17} className="text-danger" />
            )}
            <span className="text-sm">Arassa girdeji</span>
          </div>
          <p
            className={[
              "mt-3 text-3xl font-bold",
              review.monthlyNetIncome >= 0
                ? "text-success"
                : "text-danger",
            ].join(" ")}
          >
            {money(review.monthlyNetIncome)}
          </p>
        </article>
      </section>

      {/* STRONG + IMPROVE */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-success/15 bg-success/[0.025] p-6 shadow-[var(--app-shadow)]">
          <div className="flex items-center gap-2 text-success">
            <TrendingUp size={18} />
            <span className="text-sm font-semibold">
              Näme gowy gitdi?
            </span>
          </div>
          <h2 className="mt-4 text-xl font-bold text-text-primary">
            {strongPoint.title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-text-muted">
            {strongPoint.description}
          </p>
        </article>

        <article className="rounded-2xl border border-warning/15 bg-warning/[0.025] p-6 shadow-[var(--app-shadow)]">
          <div className="flex items-center gap-2 text-warning">
            <Lightbulb size={18} />
            <span className="text-sm font-semibold">
              Näme gowulandyrmaly?
            </span>
          </div>
          <h2 className="mt-4 text-xl font-bold text-text-primary">
            {improvementPoint.title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-text-muted">
            {improvementPoint.description}
          </p>
        </article>
      </section>

      {/* PROGRESS + NEXT 3 */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--app-shadow)]">
          <p className="text-sm font-semibold text-primary">
            Ösüş deňeşdirmesi
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Maliýe</span>
                <span className="font-bold text-text-primary">
                  {review.financialProgress}%
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-info transition-all"
                  style={{ width: `${review.financialProgress}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Meýilnama</span>
                <span className="font-bold text-text-primary">
                  {review.plannerProgress}%
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{ width: `${review.plannerProgress}%` }}
                />
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-[var(--app-shadow)]">
          <p className="text-sm font-semibold text-primary">
            Indiki hepdäniň 3 esasy ädimi
          </p>

          <div className="mt-5 space-y-3">
            {nextWeekActions.map((action, index) => (
              <div
                key={action}
                className="flex items-start gap-3 rounded-xl border border-border bg-background/30 p-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <p className="pt-0.5 text-sm leading-6 text-text-secondary">
                  {action}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* NOTE */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--app-shadow)]">
        <p className="text-sm font-semibold text-primary">
          Hepdelik bellik
        </p>
        <h2 className="mt-2 text-xl font-bold text-text-primary">
          Bu hepde barada näme belläp goýmak isleýärsiň?
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Näme gowy gitdi, näme kyn boldy ýa-da indiki hepde ýatda saklamaly zadyňy gysga ýaz.
        </p>

        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          placeholder="Meselem: Müşderiler bilen iş gowy gitdi, ýöne meýilnamadaky işleri has az saýlamaly..."
          className="mt-5 w-full resize-none rounded-xl border border-border bg-background/40 p-4 text-sm leading-6 text-text-primary outline-none transition placeholder:text-text-disabled focus:border-primary"
        />
      </section>

      {/* HISTORY */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--app-shadow)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <History size={18} />
              <span className="text-sm font-semibold">Soňky hepdeler</span>
            </div>

            <h2 className="mt-2 text-2xl font-bold text-text-primary">
              Hepdelik ösüş taryhy
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Saklanan hepdelik netijeleri öňki hepdeler bilen deňeşdir.
            </p>
          </div>
        </div>

        {sortedReviews.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-background/30 p-8 text-center sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <History size={20} />
            </div>
            <p className="mt-5 text-sm font-semibold text-primary">
              Ilkinji hepdelik syn
            </p>
            <h3 className="mt-2 text-xl font-bold text-text-primary">
              Entäk hepdelik syn saklanmady
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-muted">
              Ýokardaky netijeleri gözden geçir, isleseň bellik ýaz we “Hepdäni tamamla” düwmesini bas.
              Indiki hepdelerde ösüş deňeşdirmesi şu ýerde peýda bolar.
            </p>
          </div>
        ) : (
          <>
            {latestReview && previousReview && (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <article className="rounded-xl border border-border bg-background/40 p-5">
                  <p className="text-sm text-text-muted">
                    Ýerine ýetiriliş üýtgeşmesi
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    {completionDifference !== null && completionDifference >= 0 ? (
                      <TrendingUp size={18} className="text-success" />
                    ) : (
                      <TrendingDown size={18} className="text-danger" />
                    )}
                    <span
                      className={[
                        "text-2xl font-bold",
                        completionDifference !== null && completionDifference >= 0
                          ? "text-success"
                          : "text-danger",
                      ].join(" ")}
                    >
                      {completionDifference !== null
                        ? `${completionDifference > 0 ? "+" : ""}${completionDifference}%`
                        : "—"}
                    </span>
                  </div>
                </article>

                <article className="rounded-xl border border-border bg-background/40 p-5">
                  <p className="text-sm text-text-muted">
                    Umumy ösüş üýtgeşmesi
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    {overallDifference !== null && overallDifference >= 0 ? (
                      <TrendingUp size={18} className="text-success" />
                    ) : (
                      <TrendingDown size={18} className="text-danger" />
                    )}
                    <span
                      className={[
                        "text-2xl font-bold",
                        overallDifference !== null && overallDifference >= 0
                          ? "text-success"
                          : "text-danger",
                      ].join(" ")}
                    >
                      {overallDifference !== null
                        ? `${overallDifference > 0 ? "+" : ""}${overallDifference}%`
                        : "—"}
                    </span>
                  </div>
                </article>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {sortedReviews.slice(0, 6).map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-border bg-background/40 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-bold text-text-primary">
                        {item.weekKey}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        {new Intl.DateTimeFormat("tk-TM", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(item.createdAt))}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-xs text-text-muted">Ýerine ýetiriliş</p>
                        <p className="mt-1 font-bold text-text-primary">
                          {item.completionRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted">Meýilnama</p>
                        <p className="mt-1 font-bold text-text-primary">
                          {item.plannerProgress}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted">Umumy</p>
                        <p className="mt-1 font-bold text-primary">
                          {item.overallProgress}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {item.note && (
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-xs font-semibold text-text-muted">
                        Bellik
                      </p>
                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {item.note}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}