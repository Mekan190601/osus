import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { useFinanceStore } from "../../../../store/financeStore";
import { useMoney } from "../../../../hooks/useMoney";
import { calculateMonthlyFinance } from "../../utils/financeCalculations";

export default function FinanceSummary() {
  const { money } = useMoney();

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

  const finance = calculateMonthlyFinance({
    monthlyIncome,
    monthlyExpense,
    transactions,
  });

  const additionalIncome = finance.additionalIncome;
  const additionalExpense = finance.additionalExpense;
  const totalIncome = finance.totalIncome;
  const totalExpense = finance.totalExpense;
  const netIncome = finance.netIncome;

  const isPositiveCashFlow =
    netIncome >= 0;

  const totalMovement =
    totalIncome + totalExpense;

  const incomeShare =
    totalMovement > 0
      ? Math.round(
          (totalIncome /
            totalMovement) *
            100,
        )
      : 0;

  const expenseShare =
    totalMovement > 0
      ? Math.round(
          (totalExpense /
            totalMovement) *
            100,
        )
      : 0;

  const hasFinanceData =
    totalIncome > 0 ||
    totalExpense > 0;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6">
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-sky-500/5 blur-3xl" />

      <div className="relative z-10">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400">
              <WalletCards
                size={18}
                strokeWidth={2}
              />

              <span className="text-sm font-semibold">
                Maliýe ýagdaýy
              </span>
            </div>

            <h3 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
              Şu aýyň maliýe ýagdaýy
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
              Esasy we goşmaça girdejileriňi,
              çykdajylaryňy hem-de aýyň
              ahyrynda näçe puluň
              galýandygyny bir ýerden gör.
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-400">
            <Landmark size={20} />
          </div>
        </div>

        {/* ARASSA GIRDEJI */}

        <div className="mt-6 rounded-xl border border-border bg-background/40 p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-text-muted">
                Arassa girdeji
              </p>

              <p
                className={[
                  "mt-2 text-3xl font-bold tracking-tight",
                  isPositiveCashFlow
                    ? "text-success"
                    : "text-danger",
                ].join(" ")}
              >
                {money(netIncome)}
              </p>

              <p className="mt-2 text-xs text-text-disabled">
                Jemi girdeji − jemi
                çykdajy
              </p>
            </div>

            <div
              className={[
                "flex h-11 w-11 items-center justify-center rounded-xl border",
                isPositiveCashFlow
                  ? "border-success/20 bg-success/10 text-success"
                  : "border-danger/20 bg-danger/10 text-danger",
              ].join(" ")}
            >
              {isPositiveCashFlow ? (
                <TrendingUp size={20} />
              ) : (
                <TrendingDown size={20} />
              )}
            </div>
          </div>
        </div>

        {/* GIRDEJI / ÇYKDAJY */}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* GIRDEJI */}

          <div className="rounded-xl border border-success/15 bg-success/[0.04] p-4 transition duration-200 hover:border-success/30 hover:bg-success/[0.06]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-text-muted">
                Jemi girdeji
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
                <ArrowUpRight size={18} />
              </div>
            </div>

            <p className="mt-4 text-2xl font-bold text-success">
              {money(totalIncome)}
            </p>

            <div className="mt-3 space-y-1 text-xs text-text-muted">
              <div className="flex justify-between gap-4">
                <span>
                  Aýlyk girdeji
                </span>

                <span className="font-medium text-text-secondary">
                  {money(monthlyIncome)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>
                  Goşmaça girdeji
                </span>

                <span className="font-medium text-success">
                  +{money(
                    additionalIncome,
                  )}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-text-disabled">
                  Pul hereketindäki paýy
                </span>

                <span className="font-semibold text-success">
                  {incomeShare}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{
                    width: `${incomeShare}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ÇYKDAJY */}

          <div className="rounded-xl border border-danger/15 bg-danger/[0.035] p-4 transition duration-200 hover:border-danger/30 hover:bg-danger/[0.055]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-text-muted">
                Jemi çykdajy
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger/10 text-danger">
                <ArrowDownRight size={18} />
              </div>
            </div>

            <p className="mt-4 text-2xl font-bold text-danger">
              {money(totalExpense)}
            </p>

            <div className="mt-3 space-y-1 text-xs text-text-muted">
              <div className="flex justify-between gap-4">
                <span>
                  Aýlyk çykdajy
                </span>

                <span className="font-medium text-text-secondary">
                  {money(monthlyExpense)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>
                  Goşmaça çykdajy
                </span>

                <span className="font-medium text-danger">
                  +{money(
                    additionalExpense,
                  )}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-text-disabled">
                  Pul hereketindäki paýy
                </span>

                <span className="font-semibold text-danger">
                  {expenseShare}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-danger transition-all duration-500"
                  style={{
                    width: `${expenseShare}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* STATUS */}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <div>
            <p className="text-xs text-text-disabled">
              Şu aýyň netijesi
            </p>

            <p className="mt-1 text-sm font-medium text-text-secondary">
              {!hasFinanceData
                ? "Maliýe maglumatlary girizilmegine garaşylýar."
                : isPositiveCashFlow
                  ? "Girdejiň çykdajyňdan ýokary."
                  : "Çykdajyň girdejiňden ýokary."}
            </p>
          </div>

          <span
            className={[
              "rounded-full border px-3 py-1.5 text-xs font-semibold",
              !hasFinanceData
                ? "border-border bg-background/50 text-text-muted"
                : isPositiveCashFlow
                  ? "border-success/20 bg-success/10 text-success"
                  : "border-danger/20 bg-danger/10 text-danger",
            ].join(" ")}
          >
            {!hasFinanceData
              ? "Maglumat ýok"
              : isPositiveCashFlow
                ? "Girdeji artyk"
                : "Çykdajy artyk"}
          </span>
        </div>
      </div>
    </section>
  );
}