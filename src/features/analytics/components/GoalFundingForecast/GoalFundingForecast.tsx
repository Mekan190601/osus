import {
  CalendarClock,
  CircleDollarSign,
  Target,
  TrendingUp,
} from "lucide-react";

import { useMemo } from "react";

import { useFinanceStore } from "../../../../store/financeStore";
import { useGoalStore } from "../../../../store/goalStore";
import { useMoney } from "../../../../hooks/useMoney";

import { calculateFinancialProgress } from "../../utils/analytics";
import { createFundingForecast } from "../../utils/forecast";

function getCurrentMonthKey() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1,
  ).padStart(2, "0");

  return `${year}-${month}`;
}

export default function GoalFundingForecast() {
  const { money } = useMoney();

  const bankBalance =
    useFinanceStore(
      (state) => state.bankBalance,
    );

  const monthlyIncome =
    useFinanceStore(
      (state) => state.monthlyIncome,
    );

  const monthlyExpense =
    useFinanceStore(
      (state) => state.monthlyExpense,
    );

  const transactions =
    useFinanceStore(
      (state) => state.transactions,
    );

  const mainGoal =
    useGoalStore(
      (state) => state.mainGoal,
    );

  const targetMoney =
    useGoalStore(
      (state) => state.targetMoney,
    );

  const currentMoney =
    useGoalStore(
      (state) => state.currentMoney,
    );

  const currentMonthKey =
    getCurrentMonthKey();

  const currentMonthTransactions =
    useMemo(
      () =>
        transactions.filter(
          (transaction) =>
            transaction.date.startsWith(
              currentMonthKey,
            ),
        ),
      [
        transactions,
        currentMonthKey,
      ],
    );

  const additionalIncome =
    useMemo(
      () =>
        currentMonthTransactions
          .filter(
            (transaction) =>
              transaction.type ===
              "income",
          )
          .reduce(
            (total, transaction) =>
              total +
              transaction.amount,
            0,
          ),
      [currentMonthTransactions],
    );

  const additionalExpense =
    useMemo(
      () =>
        currentMonthTransactions
          .filter(
            (transaction) =>
              transaction.type ===
              "expense",
          )
          .reduce(
            (total, transaction) =>
              total +
              transaction.amount,
            0,
          ),
      [currentMonthTransactions],
    );

  const totalMonthlyIncome =
    monthlyIncome +
    additionalIncome;

  const totalMonthlyExpense =
    monthlyExpense +
    additionalExpense;

  const forecast =
  createFundingForecast({
    targetMoney,
    currentMoney,

    monthlyIncome:
      totalMonthlyIncome,

    monthlyExpense:
      totalMonthlyExpense,
  });

  const progress =
    calculateFinancialProgress(
      currentMoney,
      targetMoney,
    );

  const estimatedDateLabel =
    forecast.estimatedDate
      ? new Intl.DateTimeFormat(
          "tk-TM",
          {
            month: "long",
            year: "numeric",
          },
        ).format(
          forecast.estimatedDate,
        )
      : null;

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp size={18} />

            <span className="text-sm font-semibold">
              Maksat prognozy
            </span>
          </div>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            Maksada ýetmek prognozy
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
            Häzirki aýyň esasy we
            goşmaça girdeji-çykdajy
            depginine görä maksadyň
            maliýe böleginiň haçan
            tamamlanjakdygyny çaklaýar.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <Target size={20} />
        </div>
      </div>

      {/* ESASY MAKSAT */}

      <div className="mt-6 rounded-xl border border-border bg-background/40 p-5">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
          Esasy maksat
        </p>

        <h3 className="mt-2 text-xl font-bold text-text-primary">
          {mainGoal.trim()
            ? mainGoal
            : "Maksat girizilmedi"}
        </h3>

        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="text-sm text-text-muted">
            Maliýe ösüşi
          </span>

          <span className="text-lg font-bold text-primary">
            {progress}%
          </span>
        </div>

        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 text-xs text-text-muted">
          <span>
            {money(currentMoney)}
          </span>

          <span>
            {money(targetMoney)}
          </span>
        </div>
      </div>

      {/* PROGNOZ KARTLARY */}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-border bg-background/40 p-5">
          <div className="flex items-center gap-2 text-text-muted">
            <CircleDollarSign
              size={17}
            />

            <span className="text-sm">
              Galan pul
            </span>
          </div>

          <p className="mt-3 text-2xl font-bold text-text-primary">
            {money(
              forecast.remainingMoney,
            )}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-background/40 p-5">
          <div className="flex items-center gap-2 text-text-muted">
            <TrendingUp size={17} />

            <span className="text-sm">
              Aýlyk arassa girdeji
            </span>
          </div>

          <p
            className={[
              "mt-3 text-2xl font-bold",
              forecast.monthlyNetIncome >
              0
                ? "text-success"
                : forecast.monthlyNetIncome <
                    0
                  ? "text-danger"
                  : "text-text-primary",
            ].join(" ")}
          >
            {money(
              forecast.monthlyNetIncome,
            )}
          </p>

          <div className="mt-3 space-y-1 text-xs text-text-muted">
            <div className="flex justify-between gap-3">
              <span>
                Jemi girdeji
              </span>

              <span className="font-medium text-success">
                {money(
                  totalMonthlyIncome,
                )}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>
                Jemi çykdajy
              </span>

              <span className="font-medium text-danger">
                {money(
                  totalMonthlyExpense,
                )}
              </span>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-background/40 p-5">
          <div className="flex items-center gap-2 text-text-muted">
            <CalendarClock size={17} />

            <span className="text-sm">
              Takmynan wagt
            </span>
          </div>

          <p className="mt-3 text-2xl font-bold text-text-primary">
            {forecast.estimatedMonths ===
            null
              ? "—"
              : forecast.estimatedMonths ===
                  0
                ? "Tamam"
                : `${forecast.estimatedMonths} aý`}
          </p>

          {estimatedDateLabel &&
            forecast.estimatedMonths !==
              0 && (
              <p className="mt-2 text-xs text-text-muted">
                ≈ {estimatedDateLabel}
              </p>
            )}
        </article>
      </div>

      {/* ŞU AÝYŇ GOŞMAÇA HEREKETLERI */}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-success/15 bg-success/[0.035] p-4">
          <p className="text-xs text-text-muted">
            Şu aýyň goşmaça girdejisi
          </p>

          <p className="mt-2 text-lg font-bold text-success">
            +{money(
              additionalIncome,
            )}
          </p>
        </div>

        <div className="rounded-xl border border-danger/15 bg-danger/[0.03] p-4">
          <p className="text-xs text-text-muted">
            Şu aýyň goşmaça çykdajysy
          </p>

          <p className="mt-2 text-lg font-bold text-danger">
            -{money(
              additionalExpense,
            )}
          </p>
        </div>
      </div>

      {/* STATUS */}

      <div className="mt-5">
        {forecast.status ===
          "completed" && (
          <div className="rounded-xl border border-success/20 bg-success/5 px-4 py-4">
            <p className="text-sm font-semibold text-success">
              Maksadyň maliýe bölegi
              100% ýerine ýetirildi.
            </p>
          </div>
        )}

        {forecast.status ===
          "active" && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-4">
            <p className="text-sm font-semibold text-primary">
              Häzirki depgin bilen
              maksada takmynan{" "}
              {
                forecast.estimatedMonths
              }{" "}
              aýda ýetip bilersiň.
            </p>
          </div>
        )}

        {forecast.status ===
          "blocked" && (
          <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-4">
            <p className="text-sm font-semibold text-warning">
              Häzirki aýlyk arassa
              girdeji 0 ýa-da 0-dan
              pes. Takyk wagt
              prognozyny hasaplamak
              mümkin däl.
            </p>
          </div>
        )}

        {forecast.status ===
          "no-goal" && (
          <div className="rounded-xl border border-border bg-background/40 px-4 py-4">
            <p className="text-sm text-text-muted">
              Prognoz görmek üçin
              ilki maksat puluny giriz.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}

      <div className="mt-5 border-t border-border pt-5">
        <p className="text-xs leading-5 text-text-muted">
          Bank balansy:{" "}
          <strong className="text-text-primary">
            {money(bankBalance)}
          </strong>
          . Prognoz diňe şu aýyň esasy
          girdeji-çykdajylaryny we şu
          aýda girizilen goşmaça pul
          hereketlerini hasaba alýar.
        </p>
      </div>
    </section>
  );
}