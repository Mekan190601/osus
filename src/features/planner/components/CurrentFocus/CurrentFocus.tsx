import {
  ArrowRight,
  Focus,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../../app/routePaths";
import { usePlannerStore } from "../../../../store/plannerStore";
import { useTranslation } from "../../../../hooks/useTranslation";

export default function CurrentFocus() {
  const { t } = useTranslation();
  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const focusedTaskId = usePlannerStore(
    (state) => state.focusedTaskId,
  );

  const focusedTask = focusedTaskId
    ? tasks.find(
        (task) => task.id === focusedTaskId,
      )
    : undefined;

  const linkedTasks = focusedTask
    ? tasks.filter(
        (task) =>
          task.parentTaskId === focusedTask.id,
      )
    : [];

  if (!focusedTask) {
    return (
      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background/50 text-text-muted">
            <Focus size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-primary">
              {t.planner.currentFocus}
            </p>

            <h3 className="mt-2 text-xl font-bold text-text-primary">
              Fokus maksady saýlanmady
            </h3>

            <p className="mt-2 text-sm leading-6 text-text-muted">
              Planner-de bir ýyllyk maksada Focus Mode goýsaň,
              şol maksat şu ýerde görkeziler.
            </p>

            <Link
              to={ROUTES.planner}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover"
            >
              Planner-e geç
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-surface p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
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
              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                {focusedTask.description}
              </p>
            )}
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Target size={20} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs font-medium text-text-muted">
              Aýlyk baglanyşyklar
            </p>

            <p className="mt-2 text-2xl font-bold text-text-primary">
              {linkedTasks.length}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs font-medium text-text-muted">
              Ýagdaý
            </p>

            <p
              className={[
                "mt-2 text-sm font-semibold",
                focusedTask.completed
                  ? "text-success"
                  : "text-primary",
              ].join(" ")}
            >
              {focusedTask.completed
                ? "Tamamlandy"
                : "Işjeň fokus"}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <Link
            to={ROUTES.planner}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover"
          >
            Fokus meýilnamasyny aç
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}