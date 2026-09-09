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

  const monthlyIncome = useFinanceStore(
    (state) => state.monthlyIncome,
  );

  const monthlyExpense = useFinanceStore(
    (state) => state.monthlyExpense,
  );

  const transactions = useFinanceStore(
    (state) => state.transactions,
  );

  const finance = calculateMonthlyFinance({
    monthlyIncome,
    monthlyExpense,
    transactions,
  });

  const additionalIncome =
    finance.additionalIncome;

  const additionalExpense =
    finance.additionalExpense;

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
          (totalIncome / totalMovement) *
            100,
        )
      : 0;

  const expenseShare =
    totalMovement > 0
      ? Math.round(
          (totalExpense / totalMovement) *
            100,
        )
      : 0;

  const hasFinanceData =
    totalIncome > 0 ||
    totalExpense > 0;

  return (
    <section
      className="
        relative overflow-hidden
        rounded-[20px]
        border border-border
        bg-surface
        p-4
        sm:rounded-2xl
        sm:p-6
      "
    >
      <div className="pointer-events-none absolute -left-20 -top-20 h-44 w-44 rounded-full bg-sky-500/5 blur-3xl sm:h-56 sm:w-56" />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-sky-400 sm:gap-2">
              <WalletCards
                size={15}
                strokeWidth={2}
                className="sm:h-[18px] sm:w-[18px]"
              />

              <span className="text-[10px] font-semibold sm:text-sm">
                Maliýe ýagdaýy
              </span>
            </div>

            <h3
              className="
                mt-1
                text-[17px]
                font-bold
                tracking-tight
                text-text-primary
                sm:mt-2
                sm:text-2xl
              "
            >
              Şu aýyň maliýe ýagdaýy
            </h3>

            <p className="mt-2 hidden max-w-xl text-sm leading-6 text-text-muted sm:block">
              Esasy we goşmaça girdejileriňi,
              çykdajylaryňy hem-de aýyň
              ahyrynda näçe puluň
              galýandygyny bir ýerden gör.
            </p>
          </div>

          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-lg
              border border-sky-400/20
              bg-sky-400/10
              text-sky-400
              sm:h-11 sm:w-11
              sm:rounded-xl
            "
          >
            <Landmark
              size={17}
              className="sm:h-5 sm:w-5"
            />
          </div>
        </div>

        {/* NET INCOME */}
        <div
          className="
            mt-3
            rounded-xl
            border border-border
            bg-background/40
            p-3
            sm:mt-6
            sm:p-5
          "
        >
          <div className="flex items-center justify-between gap-3 sm:items-end sm:gap-4">
            <div className="min-w-0">
              <p className="text-[10px] text-text-muted sm:text-sm">
                Arassa girdeji
              </p>

              <p
                className={[
                  `
                    mt-1
                    truncate
                    text-[24px]
                    font-bold
                    leading-tight
                    tracking-tight
                    sm:mt-2
                    sm:text-3xl
                  `,
                  isPositiveCashFlow
                    ? "text-success"
                    : "text-danger",
                ].join(" ")}
              >
                {money(netIncome)}
              </p>

              <p className="mt-1 hidden text-xs text-text-disabled sm:mt-2 sm:block">
                Jemi girdeji − jemi çykdajy
              </p>
            </div>

            <div
              className={[
                `
                  flex h-9 w-9
                  shrink-0 items-center
                  justify-center
                  rounded-lg border
                  sm:h-11 sm:w-11
                  sm:rounded-xl
                `,
                isPositiveCashFlow
                  ? "border-success/20 bg-success/10 text-success"
                  : "border-danger/20 bg-danger/10 text-danger",
              ].join(" ")}
            >
              {isPositiveCashFlow ? (
                <TrendingUp
                  size={17}
                  className="sm:h-5 sm:w-5"
                />
              ) : (
                <TrendingDown
                  size={17}
                  className="sm:h-5 sm:w-5"
                />
              )}
            </div>
          </div>
        </div>

        {/* INCOME / EXPENSE */}
        <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-4">
          {/* INCOME */}
          <div
            className="
              min-w-0
              rounded-xl
              border border-success/15
              bg-success/[0.04]
              p-3
              transition duration-200
              hover:border-success/30
              hover:bg-success/[0.06]
              sm:p-4
            "
          >
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <p className="truncate text-[10px] text-text-muted sm:text-sm">
                Jemi girdeji
              </p>

              <div
                className="
                  flex h-7 w-7 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-success/10
                  text-success
                  sm:h-9 sm:w-9
                "
              >
                <ArrowUpRight
                  size={14}
                  className="sm:h-[18px] sm:w-[18px]"
                />
              </div>
            </div>

            <p
              className="
                mt-2
                truncate
                text-[16px]
                font-bold
                leading-tight
                text-success
                sm:mt-4
                sm:text-2xl
              "
            >
              {money(totalIncome)}
            </p>

            {/* Desktop details */}
            <div className="mt-3 hidden space-y-1 text-xs text-text-muted sm:block">
              <div className="flex justify-between gap-4">
                <span>Aýlyk girdeji</span>

                <span className="font-medium text-text-secondary">
                  {money(monthlyIncome)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Goşmaça girdeji</span>

                <span className="font-medium text-success">
                  +{money(additionalIncome)}
                </span>
              </div>
            </div>

            <div className="mt-2.5 sm:mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[9px] sm:mb-2 sm:text-xs">
                <span className="text-text-disabled">
                  Paýy
                </span>

                <span className="font-semibold text-success">
                  {incomeShare}%
                </span>
              </div>

              <div className="h-1 overflow-hidden rounded-full bg-background sm:h-1.5">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{
                    width: `${incomeShare}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* EXPENSE */}
          <div
            className="
              min-w-0
              rounded-xl
              border border-danger/15
              bg-danger/[0.035]
              p-3
              transition duration-200
              hover:border-danger/30
              hover:bg-danger/[0.055]
              sm:p-4
            "
          >
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <p className="truncate text-[10px] text-text-muted sm:text-sm">
                Jemi çykdajy
              </p>

              <div
                className="
                  flex h-7 w-7 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-danger/10
                  text-danger
                  sm:h-9 sm:w-9
                "
              >
                <ArrowDownRight
                  size={14}
                  className="sm:h-[18px] sm:w-[18px]"
                />
              </div>
            </div>

            <p
              className="
                mt-2
                truncate
                text-[16px]
                font-bold
                leading-tight
                text-danger
                sm:mt-4
                sm:text-2xl
              "
            >
              {money(totalExpense)}
            </p>

            {/* Desktop details */}
            <div className="mt-3 hidden space-y-1 text-xs text-text-muted sm:block">
              <div className="flex justify-between gap-4">
                <span>Aýlyk çykdajy</span>

                <span className="font-medium text-text-secondary">
                  {money(monthlyExpense)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Goşmaça çykdajy</span>

                <span className="font-medium text-danger">
                  +{money(additionalExpense)}
                </span>
              </div>
            </div>

            <div className="mt-2.5 sm:mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[9px] sm:mb-2 sm:text-xs">
                <span className="text-text-disabled">
                  Paýy
                </span>

                <span className="font-semibold text-danger">
                  {expenseShare}%
                </span>
              </div>

              <div className="h-1 overflow-hidden rounded-full bg-background sm:h-1.5">
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
        <div
          className="
            mt-3
            flex items-center
            justify-between gap-2
            border-t border-border
            pt-3
            sm:mt-5
            sm:gap-4
            sm:pt-5
          "
        >
          <div className="min-w-0">
            <p className="hidden text-xs text-text-disabled sm:block">
              Şu aýyň netijesi
            </p>

            <p
              className="
                truncate
                text-[10px]
                font-medium
                text-text-secondary
                sm:mt-1
                sm:text-sm
              "
            >
              {!hasFinanceData
                ? "Maliýe maglumatlary ýok."
                : isPositiveCashFlow
                  ? "Girdejiň çykdajyňdan ýokary."
                  : "Çykdajyň girdejiňden ýokary."}
            </p>
          </div>

          <span
            className={[
              `
                shrink-0 rounded-full
                border px-2 py-1
                text-[9px] font-semibold
                sm:px-3 sm:py-1.5
                sm:text-xs
              `,
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