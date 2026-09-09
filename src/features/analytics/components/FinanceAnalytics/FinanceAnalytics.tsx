import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  PiggyBank,
} from "lucide-react";

import { useFinanceStore } from "../../../../store/financeStore";
import { useMoney } from "../../../../hooks/useMoney";
import { calculateMonthlyFinance } from "../../../finance/utils/financeCalculations";

export default function FinanceAnalytics() {
  const { money } = useMoney();

  const transactions = useFinanceStore(
    (state) => state.transactions,
  );

  const monthlyIncome = useFinanceStore(
    (state) => state.monthlyIncome,
  );

  const monthlyExpense = useFinanceStore(
    (state) => state.monthlyExpense,
  );

  /*
   * Merkezi maliýe hasaplamasy.
   *
   * Diňe şu aýyň:
   * - esasy girdejisi
   * - goşmaça girdejisi
   * - esasy çykdajysy
   * - goşmaça çykdajysy
   *
   * hasaba alynýar.
   */
  const finance = calculateMonthlyFinance({
    monthlyIncome,
    monthlyExpense,
    transactions,
  });

  const totalIncome = finance.totalIncome;

  const totalExpense = finance.totalExpense;

  const netIncome = finance.netIncome;

  /*
   * Pul saklama derejesi:
   *
   * arassa girdeji / jemi girdeji × 100
   *
   * Mysal:
   * 1200 / 2200 × 100 = 55%
   */
  const savingRate =
    totalIncome > 0
      ? Math.round(
          (netIncome / totalIncome) * 100,
        )
      : 0;

  const safeSavingRate = Math.max(
    Math.min(savingRate, 100),
    -100,
  );

  const metrics = [
    {
      label: "Jemi girdeji",
      value: money(totalIncome),
      icon: ArrowUpRight,
      description:
        "Aýlyk + şu aýyň goşmaça girdejisi",
    },
    {
      label: "Jemi çykdajy",
      value: money(totalExpense),
      icon: ArrowDownRight,
      description:
        "Aýlyk + şu aýyň goşmaça çykdajysy",
    },
    {
      label: "Arassa girdeji",
      value: money(netIncome),
      icon: Banknote,
      description:
        "Jemi girdeji − jemi çykdajy",
    },
    {
      label: "Pul saklama derejesi",
      value: `${savingRate}%`,
      icon: PiggyBank,
      description:
        "Arassa girdejiniň jemi girdejä gatnaşygy",
    },
  ];

  return (
    <section className="rounded-[20px] border border-border bg-surface p-4 sm:rounded-2xl sm:p-6">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-3 lg:gap-5">
        <div>
          <p className="text-[11px] font-semibold text-primary sm:text-sm">
            Maliýe netijesi
          </p>

          <h2 className="mt-1 text-[20px] font-bold tracking-tight text-text-primary sm:mt-2 sm:text-2xl">
            Maliýe netijeliligi
          </h2>

          <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-text-muted sm:mt-2 sm:text-sm sm:leading-6">
            Şu aýyň esasy we goşmaça
            girdejilerini, çykdajylaryny
            hem-de näçe puluň
            galandygyny bir ýerden gör.
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary sm:h-11 sm:w-11 sm:rounded-xl">
          <PiggyBank size={17} className="sm:h-5 sm:w-5" />
        </div>
      </div>

      {/* METRIKALAR */}

      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-xl border border-border bg-background/40 p-3 sm:p-5"
            >
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div>
                  <p className="text-[10px] font-medium leading-4 text-text-muted sm:text-sm">
                    {metric.label}
                  </p>

                  <p className="mt-1.5 text-lg font-bold leading-tight text-text-primary sm:mt-3 sm:text-2xl">
                    {metric.value}
                  </p>
                </div>

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-9 sm:w-9">
                  <Icon size={14} className="sm:h-[17px] sm:w-[17px]" />
                </div>
              </div>

              <p className="mt-2 line-clamp-2 text-[9px] leading-4 text-text-disabled sm:mt-4 sm:text-xs sm:leading-5">
                {metric.description}
              </p>
            </article>
          );
        })}
      </div>

      {/* PUL SAKLAMA DEREJESI */}

      <div className="mt-6 rounded-xl border border-border bg-background/40 p-3 sm:p-5">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[10px] font-medium leading-4 text-text-muted sm:text-sm">
              Pul saklama derejesi
            </p>

            <p
              className={[
                "mt-1 text-2xl font-bold sm:mt-2 sm:text-3xl",
                savingRate >= 0
                  ? "text-success"
                  : "text-danger",
              ].join(" ")}
            >
              {savingRate}%
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-text-muted sm:text-xs">
              Şu aý galan pul
            </p>

            <p
              className={[
                "mt-0.5 text-base font-bold sm:mt-1 sm:text-lg",
                netIncome >= 0
                  ? "text-success"
                  : "text-danger",
              ].join(" ")}
            >
              {money(netIncome)}
            </p>
          </div>
        </div>

        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-background sm:mt-4 sm:h-2.5">
          <div
            className={[
              "h-full rounded-full transition-all duration-500",
              savingRate >= 0
                ? "bg-success"
                : "bg-danger",
            ].join(" ")}
            style={{
              width: `${Math.abs(
                safeSavingRate,
              )}%`,
            }}
          />
        </div>

        <p className="mt-2 text-[10px] leading-4 text-text-muted sm:mt-3 sm:text-xs sm:leading-5">
          Pul saklama derejesi —
          şu aýyň ähli girdejisinden
          çykdajylardan soň näçe
          göterim puluň galandygyny
          görkezýär.
        </p>
      </div>
    </section>
  );
}