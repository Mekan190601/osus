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
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <ListChecks size={18} />

            <span className="text-sm font-semibold">
               Hereket meýilnamasy
            </span>
          </div>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            Indiki iň möhüm ädimler
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
            Häzirki analizden çykarylan
  maslahatlar ýerine ýetirip bolýan
  anyk ädimlere öwrülýär.
  Islendik maslahaty göni
  meýilnama goşup bilersiň.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <Zap size={20} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
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
              className="rounded-xl border border-border bg-background/40 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-bold text-text-primary">
                        {action.title}
                      </h3>

                      <span
                        className={[
                          "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                          priority.className,
                        ].join(" ")}
                      >
                        {priority.label}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-text-muted">
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
                    "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition",
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

      <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
        <Link
          to={ROUTES.planner}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-slate-950 transition hover:bg-primary-hover"
        >
          Meýilnamany aç
          <ArrowRight size={16} />
        </Link>

        <Link
          to={ROUTES.analytics}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background/40 px-4 text-sm font-semibold text-text-primary transition hover:border-primary/30 hover:text-primary"
        >
          Ösüş analizini gör
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}