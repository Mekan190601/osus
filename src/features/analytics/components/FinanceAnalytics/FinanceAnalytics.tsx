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
    <section className="rounded-2xl border border-border bg-surface p-6">
      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            Maliýe netijesi
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            Maliýe netijeliligi
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
            Şu aýyň esasy we goşmaça
            girdejilerini, çykdajylaryny
            hem-de näçe puluň
            galandygyny bir ýerden gör.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <PiggyBank size={20} />
        </div>
      </div>

      {/* METRIKALAR */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-xl border border-border bg-background/40 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    {metric.label}
                  </p>

                  <p className="mt-3 text-2xl font-bold text-text-primary">
                    {metric.value}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={17} />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-text-disabled">
                {metric.description}
              </p>
            </article>
          );
        })}
      </div>

      {/* PUL SAKLAMA DEREJESI */}

      <div className="mt-6 rounded-xl border border-border bg-background/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-muted">
              Pul saklama derejesi
            </p>

            <p
              className={[
                "mt-2 text-3xl font-bold",
                savingRate >= 0
                  ? "text-success"
                  : "text-danger",
              ].join(" ")}
            >
              {savingRate}%
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-text-muted">
              Şu aý galan pul
            </p>

            <p
              className={[
                "mt-1 text-lg font-bold",
                netIncome >= 0
                  ? "text-success"
                  : "text-danger",
              ].join(" ")}
            >
              {money(netIncome)}
            </p>
          </div>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-background">
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

        <p className="mt-3 text-xs leading-5 text-text-muted">
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