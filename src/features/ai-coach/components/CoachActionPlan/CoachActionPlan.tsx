import { useState } from "react";
import {
  ArrowRight,
  Check,
  ListChecks,
  Plus,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../../app/routePaths";
import { usePlannerStore } from "../../../../store/plannerStore";
import { getPlannerDateKey } from "../../../planner/utils/plannerDate";
import {
  generateCoachActions,
  type CoachAction,
} from "../../utils/coachActions";
import type { CoachInsight } from "../../utils/coachInsights";
import type { GrowthStatus } from "../../../analytics/utils/growthEngine";


type CoachActionPlanProps = {
  insights: CoachInsight[];
  growthStatus?: GrowthStatus;
};
  

function getPriorityConfig(
  priority: CoachAction["priority"],
) {
  if (priority === "high") {
  return {
    label: "Iň möhüm",
    className:
      "border-danger/20 bg-danger/10 text-danger",
    quadrant: "urgent-important" as const,
  };
}

if (priority === "medium") {
  return {
    label: "Möhüm",
    className:
      "border-warning/20 bg-warning/10 text-warning",
    quadrant: "important-not-urgent" as const,
  };
}

return {
  label: "Pes möhüm",
  className:
    "border-primary/20 bg-primary/10 text-primary",
  quadrant: "important-not-urgent" as const,
};
}

export default function CoachActionPlan({
  insights,
  growthStatus,
}: CoachActionPlanProps) {
  const addTask = usePlannerStore(
    (state) => state.addTask,
  );

  const selectedDate = usePlannerStore(
    (state) => state.selectedDate,
  );

  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const [addedActionIds, setAddedActionIds] =
    useState<string[]>([]);

  const actions =
  generateCoachActions(
    insights,
    growthStatus,
  );

  function handleAddToPlanner(
    action: CoachAction,
  ) {
    const alreadyExists = tasks.some(
      (task) =>
        task.period === "daily" &&
        task.title === action.title &&
        task.description ===
          action.description,
    );

    if (alreadyExists) {
      setAddedActionIds((current) =>
        current.includes(action.id)
          ? current
          : [...current, action.id],
      );

      return;
    }

    const priority =
      getPriorityConfig(
        action.priority,
      );

    addTask({
      title: action.title,
      description:
        action.description,
      period: "daily",
      quadrant: priority.quadrant,
      dateKey: getPlannerDateKey(
        new Date(selectedDate),
        "daily",
      ),
      parentTaskId: null,
      sourceGoalId: null,
    });

    setAddedActionIds((current) => [
      ...current,
      action.id,
    ]);
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-3 sm:rounded-2xl sm:p-6">
      <div className="flex items-start justify-between gap-3 sm:flex-row sm:gap-5">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <ListChecks size={18} />

            <span className="text-sm font-semibold">
               Hereket meýilnamasy
            </span>
          </div>

          <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary sm:mt-2 sm:text-2xl">
            Indiki iň möhüm ädimler
          </h2>

          <p className="mt-1 line-clamp-2 max-w-3xl text-[10px] leading-4 text-text-muted sm:mt-2 sm:line-clamp-none sm:text-sm sm:leading-6">
            Häzirki analizden çykarylan
  maslahatlar ýerine ýetirip bolýan
  anyk ädimlere öwrülýär.
  Islendik maslahaty göni
  meýilnama goşup bilersiň.
          </p>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary sm:h-11 sm:w-11 sm:rounded-xl">
          <Zap size={15} className="sm:h-5 sm:w-5" />
        </div>
      </div>

      <div className="mt-3 space-y-2 sm:mt-6 sm:space-y-3">
        {actions.map((action, index) => {
          const priority =
            getPriorityConfig(
              action.priority,
            );

          const isAdded =
            addedActionIds.includes(
              action.id,
            ) ||
            tasks.some(
              (task) =>
                task.period ===
                  "daily" &&
                task.title ===
                  action.title &&
                task.description ===
                  action.description,
            );

          return (
            <article
              key={action.id}
              className="rounded-lg border border-border bg-background/40 p-3 sm:rounded-xl sm:p-5"
            >
              <div className="flex flex-col gap-2.5 sm:gap-4 lg:flex-row lg:items-start">
                <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[10px] font-bold text-primary sm:h-9 sm:w-9 sm:text-sm">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                      <h3 className="text-[12px] font-bold leading-4 text-text-primary sm:text-base sm:leading-normal">
                        {action.title}
                      </h3>

                      <span
                        className={[
                          "rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wide sm:px-2.5 sm:py-1 sm:text-[10px]",
                          priority.className,
                        ].join(" ")}
                      >
                        {priority.label}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-text-muted sm:mt-2 sm:line-clamp-none sm:text-sm sm:leading-6">
                      {
                        action.description
                      }
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAdded}
                  onClick={() =>
                    handleAddToPlanner(
                      action,
                    )
                  }
                  className={[
                    "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-[10px] font-semibold transition sm:h-10 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm",
                    isAdded
                      ? "cursor-default border border-success/20 bg-success/10 text-success"
                      : "border border-primary/20 bg-primary/10 text-primary hover:bg-primary/15",
                  ].join(" ")}
                >
                  {isAdded ? (
                    <>
                      <Check
                        size={16}
                      />
                      Meýilnamada bar
                    </>
                  ) : (
                    <>
                      <Plus
                        size={16}
                      />
                      Meýilnama goş
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3 sm:pt-5">
        <Link
          to={ROUTES.planner}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-[10px] font-semibold text-slate-950 transition hover:bg-primary-hover sm:h-10 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
        >
          Meýilnamany aç
          <ArrowRight size={16} />
        </Link>

        <Link
          to={ROUTES.analytics}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 text-[10px] font-semibold text-text-primary transition hover:border-primary/30 hover:text-primary sm:h-10 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
        >
          Ösüş analizini gör
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}