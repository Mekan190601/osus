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
    <section className="rounded-[20px] border border-border bg-surface p-4 sm:rounded-2xl sm:p-6">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-3 lg:gap-5">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp size={18} />

            <span className="text-[11px] font-semibold sm:text-[10px] sm:text-sm">
              Maksat prognozy
            </span>
          </div>

          <h2 className="mt-1 text-[20px] font-bold tracking-tight text-text-primary sm:mt-2 sm:text-2xl">
            Maksada ýetmek prognozy
          </h2>

          <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-text-muted sm:mt-2 sm:text-[10px] sm:text-sm sm:leading-6">
            Häzirki aýyň esasy we
            goşmaça girdeji-çykdajy
            depginine görä maksadyň
            maliýe böleginiň haçan
            tamamlanjakdygyny çaklaýar.
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary sm:h-11 sm:w-11 sm:rounded-xl">
          <Target size={17} className="sm:h-5 sm:w-5" />
        </div>
      </div>

      {/* ESASY MAKSAT */}

      <div className="mt-3 rounded-xl border border-border bg-background/40 p-3 sm:mt-6 sm:p-5">
        <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-text-muted sm:text-xs sm:tracking-[0.14em]">
          Esasy maksat
        </p>

        <h3 className="mt-1 text-base font-bold text-text-primary sm:mt-2 sm:text-xl">
          {mainGoal.trim()
            ? mainGoal
            : "Maksat girizilmedi"}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3 sm:mt-3 sm:mt-5 sm:gap-4">
          <span className="text-[10px] text-text-muted sm:text-[10px] sm:text-sm">
            Maliýe ösüşi
          </span>

          <span className="text-base font-bold text-primary sm:text-lg">
            {progress}%
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background sm:mt-3 sm:h-2.5">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-text-muted sm:mt-3 sm:gap-4 sm:text-xs">
          <span>
            {money(currentMoney)}
          </span>

          <span>
            {money(targetMoney)}
          </span>
        </div>
      </div>

      {/* PROGNOZ KARTLARY */}

      <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-border bg-background/40 p-3 sm:p-5">
          <div className="flex items-center gap-1.5 text-text-muted sm:gap-2">
            <CircleDollarSign
              size={17}
            />

            <span className="text-[10px] sm:text-sm">
              Galan pul
            </span>
          </div>

          <p className="mt-1.5 text-lg font-bold text-text-primary sm:mt-3 sm:text-2xl">
            {money(
              forecast.remainingMoney,
            )}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-background/40 p-3 sm:p-5">
          <div className="flex items-center gap-1.5 text-text-muted sm:gap-2">
            <TrendingUp size={17} />

            <span className="text-[10px] sm:text-sm">
              Aýlyk arassa girdeji
            </span>
          </div>

          <p
            className={[
              "mt-1.5 text-lg font-bold sm:mt-3 sm:text-2xl",
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

          <div className="mt-2 space-y-0.5 text-[9px] text-text-muted sm:mt-3 sm:space-y-1 sm:text-xs">
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

        <article className="rounded-xl border border-border bg-background/40 p-3 sm:p-5">
          <div className="flex items-center gap-1.5 text-text-muted sm:gap-2">
            <CalendarClock size={17} />

            <span className="text-[10px] sm:text-sm">
              Takmynan wagt
            </span>
          </div>

          <p className="mt-1.5 text-lg font-bold text-text-primary sm:mt-3 sm:text-2xl">
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
              <p className="mt-1 text-[9px] text-text-muted sm:mt-2 sm:text-xs">
                ≈ {estimatedDateLabel}
              </p>
            )}
        </article>
      </div>

      {/* ŞU AÝYŇ GOŞMAÇA HEREKETLERI */}

      <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
        <div className="rounded-xl border border-success/15 bg-success/[0.035] p-3 sm:p-4">
          <p className="text-[9px] leading-4 text-text-muted sm:text-xs">
            Şu aýyň goşmaça girdejisi
          </p>

          <p className="mt-1 text-sm font-bold text-success sm:mt-2 sm:text-lg">
            +{money(
              additionalIncome,
            )}
          </p>
        </div>

        <div className="rounded-xl border border-danger/15 bg-danger/[0.03] p-3 sm:p-4">
          <p className="text-[9px] leading-4 text-text-muted sm:text-xs">
            Şu aýyň goşmaça çykdajysy
          </p>

          <p className="mt-1 text-sm font-bold text-danger sm:mt-2 sm:text-lg">
            -{money(
              additionalExpense,
            )}
          </p>
        </div>
      </div>

      {/* STATUS */}

      <div className="mt-3 sm:mt-5">
        {forecast.status ===
          "completed" && (
          <div className="rounded-xl border border-success/20 bg-success/5 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-[11px] font-semibold sm:text-[10px] sm:text-sm text-success">
              Maksadyň maliýe bölegi
              100% ýerine ýetirildi.
            </p>
          </div>
        )}

        {forecast.status ===
          "active" && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-[11px] font-semibold sm:text-[10px] sm:text-sm text-primary">
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
          <div className="rounded-xl border border-warning/20 bg-warning/5 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-[11px] font-semibold sm:text-[10px] sm:text-sm text-warning">
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
          <div className="rounded-xl border border-border bg-background/40 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-[10px] text-text-muted sm:text-[10px] sm:text-sm">
              Prognoz görmek üçin
              ilki maksat puluny giriz.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}

      <div className="mt-3 sm:mt-3 border-t border-border pt-3 sm:mt-5 sm:pt-5">
        <p className="text-[9px] leading-4 text-text-muted sm:text-xs sm:leading-5">
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