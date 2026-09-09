import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ListTodo,
} from "lucide-react";

import { usePlannerStore } from "../../../../store/plannerStore";

export default function PlannerDistributionChart() {
  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const urgentImportant = tasks.filter(
    (task) =>
      task.quadrant === "urgent-important",
  ).length;

  const importantNotUrgent = tasks.filter(
    (task) =>
      task.quadrant ===
      "important-not-urgent",
  ).length;

  const urgentNotImportant = tasks.filter(
    (task) =>
      task.quadrant ===
      "urgent-not-important",
  ).length;

  const notUrgentNotImportant = tasks.filter(
    (task) =>
      task.quadrant ===
      "not-urgent-not-important",
  ).length;

  const completed = tasks.filter(
    (task) => task.completed,
  ).length;

  const total = tasks.length;

  const completedRate =
    total > 0
      ? Math.round(
          (completed / total) * 100,
        )
      : 0;

  const quadrants = [
  {
    label: "I — Häzir etmeli",
    count: urgentImportant,
    icon: AlertTriangle,
  },
  {
    label: "II — Meýilleşdirmeli",
    count: importantNotUrgent,
    icon: Clock3,
  },
  {
    label: "III — Tabşyrmaly / azaltmaly",
    count: urgentNotImportant,
    icon: ListTodo,
  },
  {
    label: "IV — Bes etmeli",
    count: notUrgentNotImportant,
    icon: CheckCircle2,
  },
];

  const maxCount = Math.max(
    1,
    ...quadrants.map(
      (item) => item.count,
    ),
  );

  return (
    <section className="rounded-[20px] border border-border bg-surface p-4 sm:rounded-2xl sm:p-6">
      <div className="flex items-start justify-between gap-3 lg:gap-5">
        <div>
          <p className="text-[11px] font-semibold text-primary sm:text-sm">
           Işleriň paýlanyşy
          </p>

          <h2 className="mt-1 text-[20px] font-bold tracking-tight text-text-primary sm:mt-2 sm:text-2xl">
            Eisenhower iş paýlanyşy
          </h2>

          <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-text-muted sm:mt-2 sm:text-sm sm:leading-6">
            Işleriň haýsy möhümlik derejesinde
  jemlenendigini gör.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-border bg-background/40 px-3 py-2 text-right sm:rounded-xl sm:px-4 sm:py-3">
          <p className="text-[9px] font-medium text-text-muted sm:text-xs">
            Ýerine ýetiriliş
          </p>

          <p className="mt-0.5 text-sm font-bold text-text-primary sm:text-lg sm:mt-1 sm:text-2xl">
            {completedRate}%
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2 sm:mt-6 sm:space-y-4">
        {quadrants.map((item) => {
          const Icon = item.icon;

          const width =
            (item.count / maxCount) * 100;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-background/40 p-2.5 sm:p-4"
            >
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-9 sm:w-9">
                    <Icon size={14} className="sm:h-[17px] sm:w-[17px]" />
                  </div>

                  <div>
                    <p className="truncate text-[11px] font-medium text-text-primary sm:text-sm">
                      {item.label}
                    </p>

                    <p className="mt-0.5 text-[9px] text-text-muted sm:mt-1 sm:text-xs">
                      {item.count} iş
                    </p>
                  </div>
                </div>

                <span className="text-sm font-bold text-text-primary sm:text-lg">
                  {item.count}
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background sm:mt-4 sm:h-2.5">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${width}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}