import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Target,
  TrendingUp,
} from "lucide-react";

import { useFinanceStore } from "../../../../store/financeStore";
import { useGoalStore } from "../../../../store/goalStore";
import { useMoney } from "../../../../hooks/useMoney";
import {
  createDeadlineForecast,
  type DeadlineStatus,
} from "../../utils/forecast";

function getStatusConfig(
  status: DeadlineStatus,
) {
  if (status === "completed") {
    return {
      title: "Maliýe maksady tamamlandy",
      description:
        "Maksadyň maliýe bölegi eýýäm 100% ýerine ýetirildi.",
      icon: CheckCircle2,
      className:
        "border-success/20 bg-success/5 text-success",
    };
  }

  if (status === "blocked") {
    return {
      title: "Ösüş saklandy",
      description:
        "Häzirki arassa girdeji bilen deadline-a maliýe prognozyny dowam etdirmek mümkin däl.",
      icon: AlertTriangle,
      className:
        "border-danger/20 bg-danger/5 text-danger",
    };
  }

  if (status === "ahead") {
    return {
      title: "Grafikden öňde",
      description:
        "Häzirki maliýe depginiň deadline talabyndan ýokary.",
      icon: TrendingUp,
      className:
        "border-success/20 bg-success/5 text-success",
    };
  }

  if (status === "on-track") {
    return {
      title: "Grafik boýunça",
      description:
        "Häzirki depgin bilen deadline-a wagtynda ýetmek mümkin.",
      icon: CheckCircle2,
      className:
        "border-primary/20 bg-primary/5 text-primary",
    };
  }

  if (status === "behind") {
    return {
      title: "Grafikden yza galýar",
      description:
        "Häzirki depgin deadline-a ýetmek üçin ýeterlik däl.",
      icon: AlertTriangle,
      className:
        "border-warning/20 bg-warning/5 text-warning",
    };
  }

  if (status === "unknown") {
    return {
      title: "Prognoz ýok",
      description:
        "Häzirki maglumatlardan deadline ýagdaýyny kesgitlemek mümkin däl.",
      icon: Clock3,
      className:
        "border-border bg-background/40 text-text-muted",
    };
  }

  return {
    title: "Maglumat ýeterlik däl",
    description:
      "Deadline analizi üçin maksat puly we deadline girizilmeli.",
    icon: Clock3,
    className:
      "border-border bg-background/40 text-text-muted",
  };
}

export default function DeadlineIntelligence() {
  const { money } = useMoney();
  const monthlyIncome = useFinanceStore(
    (state) => state.monthlyIncome,
  );

  const monthlyExpense = useFinanceStore(
    (state) => state.monthlyExpense,
  );

  const targetMoney = useGoalStore(
    (state) => state.targetMoney,
  );

  const currentMoney = useGoalStore(
    (state) => state.currentMoney,
  );

  const deadline = useGoalStore(
    (state) => state.deadline,
  );

  const forecast = createDeadlineForecast({
    targetMoney,
    currentMoney,
    monthlyIncome,
    monthlyExpense,
    deadline,
  });

  const currentStatus =
    getStatusConfig(
      forecast.deadlineStatus,
    );

  const StatusIcon =
    currentStatus.icon;

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <CalendarClock size={18} />

            <span className="text-sm font-semibold">
              Möhlet analizi
            </span>
          </div>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            Möhlet ýagdaýy
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
            Häzirki maliýe depginiň maksadyň soňky möhleti bilen
gabat gelýändigini görkezýär.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <Target size={20} />
        </div>
      </div>

      <div
        className={[
          "mt-6 rounded-xl border p-5",
          currentStatus.className,
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <StatusIcon
            size={21}
            className="mt-0.5 shrink-0"
          />

          <div>
            <h3 className="font-bold">
              {currentStatus.title}
            </h3>

            <p className="mt-1 text-sm leading-6 opacity-80">
              {currentStatus.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-border bg-background/40 p-5">
          <p className="text-sm text-text-muted">
            Soňky möhlete galan wagt
          </p>

          <p className="mt-3 text-2xl font-bold text-text-primary">
            {forecast.monthsAvailable === null
              ? "—"
              : `${forecast.monthsAvailable} aý`}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-background/40 p-5">
          <p className="text-sm text-text-muted">
            Gerek wagt
          </p>

          <p className="mt-3 text-2xl font-bold text-text-primary">
            {forecast.estimatedMonths === null
              ? "—"
              : `${forecast.estimatedMonths} aý`}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-background/40 p-5">
          <p className="text-sm text-text-muted">
            Häzirki aýlyk arassa girdeji
          </p>

          <p
            className={[
              "mt-3 text-2xl font-bold",
              forecast.monthlyNetIncome >= 0
                ? "text-success"
                : "text-danger",
            ].join(" ")}
          >
            {money(
              forecast.monthlyNetIncome,
            )}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-background/40 p-5">
          <p className="text-sm text-text-muted">
            Maksada ýetmek üçin aýda gerek
          </p>

          <p className="mt-3 text-2xl font-bold text-text-primary">
            {forecast.requiredMonthlySaving ===
            null
              ? "—"
              : money(
                  Math.ceil(
                    forecast.requiredMonthlySaving,
                  ),
                )}
          </p>
        </article>
      </div>

      {forecast.scheduleDifference !== null &&
        forecast.deadlineStatus !==
          "completed" && (
          <div className="mt-5 rounded-xl border border-border bg-background/40 p-4">
            <p className="text-sm text-text-secondary">
              {forecast.scheduleDifference > 0
                ? `Häzirki depgin bilen takmynan ${forecast.scheduleDifference} aý ätiýaçlygyň bar.`
                : forecast.scheduleDifference ===
                    0
                  ? "Häzirki depgin soňky möhlet bilen takyk gabat gelýär."
                  : `Häzirki depgin bilen takmynan ${Math.abs(
                      forecast.scheduleDifference,
                    )} aý yza galýarsyň.`}
            </p>
          </div>
        )}
    </section>
  );
}