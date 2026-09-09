import {
  CalendarDays,
  CheckCircle2,
  CalendarRange,
  CalendarClock,
  Calendar,
} from "lucide-react";

import { usePlannerStore } from "../../../../store/plannerStore";
import type { PlannerPeriod } from "../../../planner/types/planner.types";

type PeriodItem = {
  period: PlannerPeriod;
  label: string;
  icon: typeof CalendarDays;
};

const PERIODS: PeriodItem[] = [
  {
    period: "daily",
    label: "Günlük",
    icon: CalendarDays,
  },
  {
    period: "weekly",
    label: "Hepdelik",
    icon: CalendarClock,
  },
  {
    period: "monthly",
    label: "Aýlyk",
    icon: CalendarRange,
  },
  {
    period: "yearly",
    label: "Ýyllyk",
    icon: Calendar,
  },
];

export default function PeriodPerformance() {
  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const performance = PERIODS.map((item) => {
    const periodTasks = tasks.filter(
      (task) => task.period === item.period,
    );

    const completed = periodTasks.filter(
      (task) => task.completed,
    ).length;

    const progress =
      periodTasks.length > 0
        ? Math.round(
            (completed / periodTasks.length) * 100,
          )
        : 0;

    return {
      ...item,
      total: periodTasks.length,
      completed,
      pending: periodTasks.length - completed,
      progress,
    };
  });

  return (
    <section className="rounded-[20px] border border-border bg-surface p-4 sm:rounded-2xl sm:p-6">
      <div>
        <p className="text-[11px] font-semibold text-primary sm:text-sm">
          Döwürler boýunça netije
        </p>

        <h2 className="mt-1 text-[20px] font-bold tracking-tight text-text-primary sm:mt-2 sm:text-2xl">
          Meýilnama döwürleriniň netijeliligi
        </h2>

        <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-text-muted sm:mt-2 sm:text-sm sm:leading-6">
          Günlük, hepdelik, aýlyk we ýyllyk meýilnamalaryň
          tamamlanma derejesini deňeşdir.
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {performance.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.period}
              className="rounded-xl border border-border bg-background/40 px-3 py-2.5 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10 sm:rounded-xl">
                    <Icon size={16} className="sm:h-[18px] sm:w-[18px]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-text-primary sm:text-base">
                      {item.label}
                    </h3>

                    <p className="mt-0.5 text-[9px] text-text-muted sm:hidden">
                      {item.completed}/{item.total} tamam
                    </p>
                  </div>
                </div>

                <span className="shrink-0 text-xl font-bold text-text-primary sm:text-2xl">
                  {item.progress}%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background sm:mt-4 sm:h-2.5">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${item.progress}%`,
                  }}
                />
              </div>

              <div className="mt-2 hidden grid-cols-3 gap-2 text-center sm:grid">
                <div className="rounded-lg border border-border bg-surface p-2">
                  <p className="text-lg font-bold text-text-primary">
                    {item.total}
                  </p>

                  <p className="mt-1 text-[10px] text-text-muted">
                    Jemi
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-surface p-2">
                  <p className="text-lg font-bold text-success">
                    {item.completed}
                  </p>

                  <p className="mt-1 text-[10px] text-text-muted">
                    Tamam
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-surface p-2">
                  <p className="text-lg font-bold text-warning">
                    {item.pending}
                  </p>

                  <p className="mt-1 text-[10px] text-text-muted">
                    Garaşýar
                  </p>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:hidden">
                <div className="rounded-md border border-border bg-surface/70 px-1.5 py-1.5 text-center">
                  <p className="text-xs font-bold text-text-primary">
                    {item.total}
                  </p>
                  <p className="text-[8px] text-text-muted">
                    Jemi
                  </p>
                </div>

                <div className="rounded-md border border-border bg-surface/70 px-1.5 py-1.5 text-center">
                  <p className="text-xs font-bold text-success">
                    {item.completed}
                  </p>
                  <p className="text-[8px] text-text-muted">
                    Tamam
                  </p>
                </div>

                <div className="rounded-md border border-border bg-surface/70 px-1.5 py-1.5 text-center">
                  <p className="text-xs font-bold text-warning">
                    {item.pending}
                  </p>
                  <p className="text-[8px] text-text-muted">
                    Garaşýar
                  </p>
                </div>
              </div>

              {item.progress === 100 &&
                item.total > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-success sm:mt-4 sm:gap-2">
                    <CheckCircle2 size={14} />

                    <span className="text-[10px] font-semibold sm:text-xs">
                      Doly ýerine ýetirildi
                    </span>
                  </div>
                )}
            </article>
          );
        })}
      </div>
    </section>
  );
}