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
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
           Işleriň paýlanyşy
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            Eisenhower iş paýlanyşy
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
            Işleriň haýsy möhümlik derejesinde
  jemlenendigini gör.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/40 px-4 py-3">
          <p className="text-xs font-medium text-text-muted">
            Ýerine ýetiriliş
          </p>

          <p className="mt-1 text-2xl font-bold text-text-primary">
            {completedRate}%
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {quadrants.map((item) => {
          const Icon = item.icon;

          const width =
            (item.count / maxCount) * 100;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-background/40 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      {item.count} iş
                    </p>
                  </div>
                </div>

                <span className="text-lg font-bold text-text-primary">
                  {item.count}
                </span>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-background">
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