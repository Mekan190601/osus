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
    <section className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <article
            key={kpi.label}
            className="
              rounded-[18px] border border-border bg-surface
              p-3.5
              sm:rounded-2xl sm:p-5
            "
          >
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              <div>
                <p className="text-[11px] font-medium leading-4 text-text-muted sm:text-sm">
                  {kpi.label}
                </p>

                <p className="mt-1.5 text-[24px] font-bold tracking-tight text-text-primary sm:mt-3 sm:text-3xl">
                  {kpi.value}
                </p>
              </div>

              <div className="
                flex h-8 w-8 shrink-0 items-center justify-center
                rounded-lg border border-border bg-background/50 text-primary
                sm:h-10 sm:w-10 sm:rounded-xl
              ">
                <Icon size={16} className="sm:h-[19px] sm:w-[19px]" />
              </div>
            </div>

            <p className="
              mt-2 line-clamp-2 text-[9px] leading-4 text-text-disabled
              sm:mt-4 sm:text-xs sm:leading-5
            ">
              {kpi.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}