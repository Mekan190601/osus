import {
  CheckCircle2,
  CircleDollarSign,
  ListTodo,
  Target,
} from "lucide-react";

import { useGoalStore } from "../../../../store/goalStore";
import { usePlannerStore } from "../../../../store/plannerStore";
import {
  calculateExecutiveProgress,
  calculateFinancialProgress,
  calculateTaskTreeProgress,
  getPlannerTaskStats,
} from "../../utils/analytics";

export default function AnalyticsKpis() {
  const goalId = useGoalStore(
    (state) => state.goalId,
  );

  const targetMoney = useGoalStore(
    (state) => state.targetMoney,
  );

  const currentMoney = useGoalStore(
    (state) => state.currentMoney,
  );

  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const linkedYearlyGoal = tasks.find(
    (task) =>
      task.period === "yearly" &&
      task.sourceGoalId === goalId,
  );

  const financialProgress =
    calculateFinancialProgress(
      currentMoney,
      targetMoney,
    );

  const plannerProgress =
    linkedYearlyGoal
      ? calculateTaskTreeProgress(
          tasks,
          linkedYearlyGoal.id,
        )
      : 0;

  const executiveProgress =
    calculateExecutiveProgress(
      financialProgress,
      plannerProgress,
    );

  const plannerStats =
    getPlannerTaskStats(tasks);

    const kpis = [
  {
    label: "Umumy ösüş",
    value: `${executiveProgress}%`,
    icon: Target,
    description:
      "Maliýe we meýilnama boýunça umumy ösüş",
  },
  {
    label: "Maliýe ösüşi",
    value: `${financialProgress}%`,
    icon: CircleDollarSign,
    description:
      "Ýygnalan puluň maksada ýetiliş derejesi",
  },
  {
    label: "Meýilnamadaky işler",
    value: String(plannerStats.total),
    icon: ListTodo,
    description:
      `${plannerStats.pending} iş garaşýar`,
  },
  {
    label: "Ýerine ýetiriliş",
    value: `${plannerStats.completionRate}%`,
    icon: CheckCircle2,
    description:
      `${plannerStats.completed} iş tamamlandy`,
  },
];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <article
            key={kpi.label}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-text-muted">
                  {kpi.label}
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-text-primary">
                  {kpi.value}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/50 text-primary">
                <Icon size={19} />
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-text-disabled">
              {kpi.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}