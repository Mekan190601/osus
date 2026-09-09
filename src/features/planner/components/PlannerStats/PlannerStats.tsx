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
        grid grid-cols-2
        gap-2
        sm:gap-3
        lg:grid-cols-4
      "
    >
      {/* ÄHLI IŞLER */}
      <div
        className="
          min-w-0
          rounded-[14px]
          border border-primary/15
          bg-primary/[0.025]
          p-3
          sm:rounded-xl
          sm:p-4
        "
      >
        <div className="flex items-center justify-between gap-2">
          <div
            className="
              flex h-8 w-8
              shrink-0 items-center
              justify-center
              rounded-lg
              bg-primary/10
              text-primary
              sm:h-9 sm:w-9
            "
          >
            <ListTodo
              size={15}
              className="sm:h-[18px] sm:w-[18px]"
            />
          </div>

          <span
            className="
              text-[22px]
              font-bold
              leading-none
              text-text-primary
              sm:text-2xl
            "
          >
            {periodTasks.length}
          </span>
        </div>

        <p
          className="
            mt-2
            truncate
            text-[10px]
            font-medium
            text-text-muted
            sm:mt-3
            sm:text-sm
          "
        >
          Ähli işler
        </p>
      </div>

      {/* TAMAMLANAN */}
      <div
        className="
          min-w-0
          rounded-[14px]
          border border-success/15
          bg-success/[0.025]
          p-3
          sm:rounded-xl
          sm:p-4
        "
      >
        <div className="flex items-center justify-between gap-2">
          <div
            className="
              flex h-8 w-8
              shrink-0 items-center
              justify-center
              rounded-lg
              bg-success/10
              text-success
              sm:h-9 sm:w-9
            "
          >
            <CheckCircle2
              size={15}
              className="sm:h-[18px] sm:w-[18px]"
            />
          </div>

          <span
            className="
              text-[22px]
              font-bold
              leading-none
              text-success
              sm:text-2xl
            "
          >
            {completedTasks.length}
          </span>
        </div>

        <p
          className="
            mt-2
            truncate
            text-[10px]
            font-medium
            text-text-muted
            sm:mt-3
            sm:text-sm
          "
        >
          Tamamlanan
        </p>
      </div>

      {/* HÄZIR ETMELI */}
      <div
        className="
          min-w-0
          rounded-[14px]
          border border-warning/15
          bg-warning/[0.025]
          p-3
          sm:rounded-xl
          sm:p-4
        "
      >
        <div className="flex items-center justify-between gap-2">
          <div
            className="
              flex h-8 w-8
              shrink-0 items-center
              justify-center
              rounded-lg
              bg-warning/10
              text-warning
              sm:h-9 sm:w-9
            "
          >
            <AlertTriangle
              size={15}
              className="sm:h-[18px] sm:w-[18px]"
            />
          </div>

          <span
            className="
              text-[22px]
              font-bold
              leading-none
              text-warning
              sm:text-2xl
            "
          >
            {urgentImportantTasks.length}
          </span>
        </div>

        <p
          className="
            mt-2
            truncate
            text-[10px]
            font-medium
            text-text-muted
            sm:mt-3
            sm:text-sm
          "
        >
          Häzir etmeli
        </p>
      </div>

      {/* ÝERINE ÝETIRILIŞ */}
      <div
        className="
          min-w-0
          rounded-[14px]
          border border-info/15
          bg-info/[0.025]
          p-3
          sm:rounded-xl
          sm:p-4
        "
      >
        <div className="flex items-center justify-between gap-2">
          <div
            className="
              flex h-8 w-8
              shrink-0 items-center
              justify-center
              rounded-lg
              bg-info/10
              text-info
              sm:h-9 sm:w-9
            "
          >
            <TrendingUp
              size={15}
              className="sm:h-[18px] sm:w-[18px]"
            />
          </div>

          <span
            className="
              text-[22px]
              font-bold
              leading-none
              text-info
              sm:text-2xl
            "
          >
            {progress}%
          </span>
        </div>

        <div className="mt-2 sm:mt-3">
          <div className="flex items-center justify-between gap-2">
            <p
              className="
                truncate
                text-[10px]
                font-medium
                text-text-muted
                sm:text-sm
              "
            >
              Ýerine ýetiriliş
            </p>

            <span className="text-[9px] font-semibold text-info sm:hidden">
              {completedTasks.length}/
              {periodTasks.length}
            </span>
          </div>

          <div
            className="
              mt-1.5 h-1
              overflow-hidden
              rounded-full
              bg-background
              sm:mt-3
              sm:h-1.5
            "
          >
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