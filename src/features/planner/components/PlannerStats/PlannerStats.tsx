import {
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  TrendingUp,
} from "lucide-react";

import { usePlannerStore } from "../../../../store/plannerStore";
import type { PlannerPeriod } from "../../types/planner.types";
import { getPlannerDateKey } from "../../utils/plannerDate";

type PlannerStatsProps = {
  period: PlannerPeriod;
};

export default function PlannerStats({
  period,
}: PlannerStatsProps) {
  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const selectedDate = usePlannerStore(
    (state) => state.selectedDate,
  );

  const selectedDateKey =
    getPlannerDateKey(
      new Date(selectedDate),
      period,
    );

  const periodTasks = tasks.filter(
    (task) =>
      task.period === period &&
      task.dateKey === selectedDateKey,
  );

  const completedTasks =
    periodTasks.filter(
      (task) => task.completed,
    );

  const urgentImportantTasks =
    periodTasks.filter(
      (task) =>
        task.quadrant ===
          "urgent-important" &&
        !task.completed,
    );

  const progress =
    periodTasks.length > 0
      ? Math.round(
          (completedTasks.length /
            periodTasks.length) *
            100,
        )
      : 0;

  return (
    <section
      className="
        rounded-2xl
        border border-border
        bg-surface
        p-4
        sm:p-5
      "
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* ÄHLI IŞLER */}
        <div
          className="
            rounded-xl
            border border-primary/15
            bg-primary/[0.025]
            p-4
          "
        >
          <div className="flex items-center justify-between gap-3">
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-lg
                bg-primary/10
                text-primary
              "
            >
              <ListTodo size={18} />
            </div>

            <span className="text-2xl font-bold text-text-primary">
              {periodTasks.length}
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-text-muted">
            Ähli işler
          </p>
        </div>

        {/* TAMAMLANAN */}
        <div
          className="
            rounded-xl
            border border-success/15
            bg-success/[0.025]
            p-4
          "
        >
          <div className="flex items-center justify-between gap-3">
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-lg
                bg-success/10
                text-success
              "
            >
              <CheckCircle2 size={18} />
            </div>

            <span className="text-2xl font-bold text-success">
              {completedTasks.length}
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-text-muted">
            Tamamlanan
          </p>
        </div>

        {/* HÄZIR ETMELI */}
        <div
          className="
            rounded-xl
            border border-warning/15
            bg-warning/[0.025]
            p-4
          "
        >
          <div className="flex items-center justify-between gap-3">
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-lg
                bg-warning/10
                text-warning
              "
            >
              <AlertTriangle size={18} />
            </div>

            <span className="text-2xl font-bold text-warning">
              {urgentImportantTasks.length}
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-text-muted">
            Häzir etmeli
          </p>
        </div>

        {/* ÝERINE ÝETIRILIŞ */}
        <div
          className="
            rounded-xl
            border border-info/15
            bg-info/[0.025]
            p-4
          "
        >
          <div className="flex items-center justify-between gap-3">
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-lg
                bg-info/10
                text-info
              "
            >
              <TrendingUp size={18} />
            </div>

            <span className="text-2xl font-bold text-info">
              {progress}%
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-text-muted">
            Ýerine ýetiriliş
          </p>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background">
            <div
              className="
                h-full rounded-full
                bg-info
                transition-all
                duration-500
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}