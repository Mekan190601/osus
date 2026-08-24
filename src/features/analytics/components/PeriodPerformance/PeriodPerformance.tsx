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
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div>
        <p className="text-sm font-semibold text-primary">
          Döwürler boýunça netije
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
          Meýilnama döwürleriniň netijeliligi
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
          Günlük, hepdelik, aýlyk we ýyllyk meýilnamalaryň
          tamamlanma derejesini deňeşdir.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {performance.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.period}
              className="rounded-xl border border-border bg-background/40 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={18} />
                </div>

                <span className="text-2xl font-bold text-text-primary">
                  {item.progress}%
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-text-primary">
                {item.label}
              </h3>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${item.progress}%`,
                  }}
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
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

              {item.progress === 100 &&
                item.total > 0 && (
                  <div className="mt-4 flex items-center gap-2 text-success">
                    <CheckCircle2 size={15} />

                    <span className="text-xs font-semibold">
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