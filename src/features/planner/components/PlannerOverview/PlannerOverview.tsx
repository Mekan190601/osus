import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../../app/routePaths";
import { usePlannerStore } from "../../../../store/plannerStore";
import { useTranslation } from "../../../../hooks/useTranslation";

export default function PlannerOverview() {
  const { t } = useTranslation();
  const tasks = usePlannerStore((state) => state.tasks);

  const dailyTasks = tasks.filter(
    (task) => task.period === "daily",
  );

  const completedTasks = dailyTasks.filter(
    (task) => task.completed,
  );

  const urgentImportantTasks = dailyTasks.filter(
    (task) =>
      task.quadrant === "urgent-important" &&
      !task.completed,
  );

  const progress =
    dailyTasks.length > 0
      ? Math.round(
          (completedTasks.length / dailyTasks.length) * 100,
        )
      : 0;

  const priorityTasks = urgentImportantTasks.slice(0, 3);

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays size={18} />

            <span className="text-sm font-semibold">
              Wagt dolandyryşy
            </span>
          </div>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            Şu günki meýilnama
          </h3>

          <p className="mt-2 text-sm text-text-muted">
            Eisenhower usuly boýunça günüň esasy işleri.
          </p>
        </div>

        <Link
          to={ROUTES.planner}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover"
        >
          t.planner.openPlanner
          <ArrowRight size={17} />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center gap-2 text-text-muted">
            <Clock3 size={16} />
            <span className="text-xs font-medium">
              Şu gün
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-text-primary">
            {dailyTasks.length}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            iş
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center gap-2 text-text-muted">
            <CheckCircle2 size={16} />
            <span className="text-xs font-medium">
              Tamamlanan
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-success">
            {completedTasks.length}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            iş
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center gap-2 text-text-muted">
            <Target size={16} />
            <span className="text-xs font-medium">
              Möhüm + gyssagly
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-warning">
            {urgentImportantTasks.length}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            garaşýan iş
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-text-secondary">
            Günlük progress
          </span>

          <span className="text-sm font-bold text-primary">
            {progress}%
          </span>
        </div>

        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-disabled">
          {t.planner.plannerOverview}
        </p>

        {priorityTasks.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-background/20 p-4">
            <p className="text-sm text-text-muted">
              Häzir möhüm + gyssagly iş ýok.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {priorityTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-warning" />

                <p className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
                  {task.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}