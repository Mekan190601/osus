import { ArrowRight, Focus, Target } from "lucide-react";
import { Link } from "react-router-dom";

import { usePlannerStore } from "../../../../store/plannerStore";

export default function CurrentFocus() {
  const tasks = usePlannerStore((state) => state.tasks);

  const focusedTaskId = usePlannerStore(
    (state) => state.focusedTaskId
  );

  const focusedTask = focusedTaskId
    ? tasks.find((task) => task.id === focusedTaskId)
    : undefined;

  const childTasks = focusedTask
    ? tasks.filter(
        (task) => task.parentTaskId === focusedTask.id
      )
    : [];

  const completedChildren = childTasks.filter(
    (task) => task.completed
  ).length;

  const progress =
    childTasks.length > 0
      ? Math.round(
          (completedChildren / childTasks.length) * 100
        )
      : focusedTask?.completed
        ? 100
        : 0;

  if (!focusedTask) {
    return (
      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background/50 text-text-muted">
              <Focus size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">
                Häzirki fokus
              </p>

              <h3 className="mt-2 text-xl font-bold text-text-primary">
                Fokus maksady saýlanmady
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                Planner bölüminde esasy maksadyňy fokus hökmünde
                saýla. Şondan soň şol maksat Dashboard-da şu ýerde
                görkeziler.
              </p>
            </div>
          </div>

          <Link
            to="/planner"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:text-primary"
          >
            Planner-e geç
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-surface p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-primary">
              <Focus size={18} />

              <span className="text-sm font-semibold">
                Häzirki fokus
              </span>
            </div>

            <h3 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">
              {focusedTask.title}
            </h3>

            {focusedTask.description && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
                {focusedTask.description}
              </p>
            )}
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Target size={20} />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-text-muted">
              Maksadyň progress-i
            </span>

            <span className="text-sm font-bold text-primary">
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max(progress, 0),
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs font-medium text-text-muted">
              Baglanan işler
            </p>

            <p className="mt-2 text-2xl font-bold text-text-primary">
              {childTasks.length}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs font-medium text-text-muted">
              Tamamlanan
            </p>

            <p className="mt-2 text-2xl font-bold text-text-primary">
              {completedChildren}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs font-medium text-text-muted">
              Ýagdaý
            </p>

            <p
              className={`mt-2 text-sm font-semibold ${
                focusedTask.completed
                  ? "text-success"
                  : "text-primary"
              }`}
            >
              {focusedTask.completed
                ? "Tamamlandy"
                : "Işjeň fokus"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-5">
          <p className="text-xs text-text-muted">
            Planner maglumatlary bilen awtomatik täzelenýär.
          </p>

          <Link
            to="/planner"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80"
          >
            Fokus meýilnamasyny aç
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}