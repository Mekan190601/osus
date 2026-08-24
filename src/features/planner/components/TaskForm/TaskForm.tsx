import { useState } from "react";
import {
  Link2,
  Plus,
  Target,
} from "lucide-react";

import { getPlannerDateKey } from "../../utils/plannerDate";
import { usePlannerStore } from "../../../../store/plannerStore";
import { useGoalStore } from "../../../../store/goalStore";

import type {
  EisenhowerQuadrant,
  PlannerPeriod,
  PlannerTask,
} from "../../types/planner.types";

export default function TaskForm() {
  const addTask = usePlannerStore(
    (state) => state.addTask,
  );

  const activePeriod = usePlannerStore(
    (state) => state.activePeriod,
  );

  const selectedDate = usePlannerStore(
    (state) => state.selectedDate,
  );

  const goalId = useGoalStore(
    (state) => state.goalId,
  );

  const mainGoal = useGoalStore(
    (state) => state.mainGoal,
  );

  const deadline = useGoalStore(
    (state) => state.deadline,
  );

  const [title, setTitle] =
    useState("");

  const [quadrant, setQuadrant] =
    useState<EisenhowerQuadrant>(
      "urgent-important",
    );

  const [linkToGoal, setLinkToGoal] =
    useState(false);

  function getSafeSelectedDate() {
    const parsed = new Date(selectedDate);

    return Number.isNaN(parsed.getTime())
      ? new Date()
      : parsed;
  }

  function getLatestTasks() {
    return usePlannerStore.getState().tasks;
  }

  function findLinkedTask(
    period: PlannerPeriod,
    dateKey: string,
    parentTaskId: string | null,
  ) {
    return getLatestTasks().find(
      (task) =>
        task.period === period &&
        task.dateKey === dateKey &&
        task.sourceGoalId === goalId &&
        task.parentTaskId === parentTaskId,
    );
  }

  function ensureYearlyRoot(
    selected: Date,
  ): PlannerTask | null {
    const existingRoot =
      getLatestTasks().find(
        (task) =>
          task.period === "yearly" &&
          task.sourceGoalId === goalId &&
          task.parentTaskId === null,
      );

    if (existingRoot) {
      return existingRoot;
    }

    const deadlineDate =
      deadline &&
      !Number.isNaN(
        new Date(deadline).getTime(),
      )
        ? new Date(deadline)
        : selected;

    addTask({
      title: mainGoal.trim(),
      description:
        "Esasy maksat bilen baglanyşykly ýyllyk meýilnama.",
      period: "yearly",
      quadrant:
        "important-not-urgent",
      dateKey: getPlannerDateKey(
        deadlineDate,
        "yearly",
      ),
      parentTaskId: null,
      sourceGoalId: goalId,
    });

    return (
      getLatestTasks().find(
        (task) =>
          task.period === "yearly" &&
          task.sourceGoalId === goalId &&
          task.parentTaskId === null,
      ) ?? null
    );
  }

  function ensureMonthlyParent(
    selected: Date,
    yearlyTask: PlannerTask,
  ): PlannerTask | null {
    const dateKey = getPlannerDateKey(
      selected,
      "monthly",
    );

    const existing = findLinkedTask(
      "monthly",
      dateKey,
      yearlyTask.id,
    );

    if (existing) {
      return existing;
    }

    addTask({
      title: `${mainGoal.trim()} — ${dateKey}`,
      description:
        "Esasy maksat üçin aýlyk meýilnama.",
      period: "monthly",
      quadrant:
        "important-not-urgent",
      dateKey,
      parentTaskId: yearlyTask.id,
      sourceGoalId: goalId,
    });

    return (
      findLinkedTask(
        "monthly",
        dateKey,
        yearlyTask.id,
      ) ?? null
    );
  }

  function ensureWeeklyParent(
    selected: Date,
    monthlyTask: PlannerTask,
  ): PlannerTask | null {
    const dateKey = getPlannerDateKey(
      selected,
      "weekly",
    );

    const existing = findLinkedTask(
      "weekly",
      dateKey,
      monthlyTask.id,
    );

    if (existing) {
      return existing;
    }

    addTask({
      title: `${mainGoal.trim()} — ${dateKey}`,
      description:
        "Esasy maksat üçin hepdelik meýilnama.",
      period: "weekly",
      quadrant:
        "important-not-urgent",
      dateKey,
      parentTaskId: monthlyTask.id,
      sourceGoalId: goalId,
    });

    return (
      findLinkedTask(
        "weekly",
        dateKey,
        monthlyTask.id,
      ) ?? null
    );
  }

  function getLinkedParentId(
    period: PlannerPeriod,
    selected: Date,
  ): string | null {
    if (period === "yearly") {
      return null;
    }

    const yearlyTask =
      ensureYearlyRoot(selected);

    if (!yearlyTask) {
      return null;
    }

    if (period === "monthly") {
      return yearlyTask.id;
    }

    const monthlyTask =
      ensureMonthlyParent(
        selected,
        yearlyTask,
      );

    if (!monthlyTask) {
      return null;
    }

    if (period === "weekly") {
      return monthlyTask.id;
    }

    const weeklyTask =
      ensureWeeklyParent(
        selected,
        monthlyTask,
      );

    return weeklyTask?.id ?? null;
  }

  function resetForm() {
    setTitle("");
    setQuadrant(
      "urgent-important",
    );
    setLinkToGoal(false);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    const selected =
      getSafeSelectedDate();

    const dateKey =
      getPlannerDateKey(
        selected,
        activePeriod,
      );

    if (
      !linkToGoal ||
      !mainGoal.trim()
    ) {
      addTask({
        title: cleanTitle,
        period: activePeriod,
        quadrant,
        dateKey,
        parentTaskId: null,
        sourceGoalId: null,
      });

      resetForm();
      return;
    }

    /*
     * Maksada bagly iş öz saýlanan
     * döwrüni üýtgetmeýär:
     *
     * daily   -> weekly parent
     * weekly  -> monthly parent
     * monthly -> yearly parent
     * yearly  -> root
     */
    const parentTaskId =
      getLinkedParentId(
        activePeriod,
        selected,
      );

    addTask({
      title: cleanTitle,
      description:
        "Esasy maksat bilen baglanyşykly iş.",
      period: activePeriod,
      quadrant,
      dateKey,
      parentTaskId,
      sourceGoalId: goalId,
    });

    resetForm();
  }

  const canLinkGoal =
    Boolean(mainGoal.trim());

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-2xl
        border border-border
        bg-surface
        p-5
        sm:p-6
      "
    >
      <div>
        <p className="text-sm font-semibold text-primary">
          Täze iş
        </p>

        <h2 className="mt-1 text-xl font-bold text-text-primary">
          Meýilnamaňa iş goş
        </h2>

        <p className="mt-1 text-sm leading-6 text-text-muted">
          Etmeli işiňi ýaz, möhümligini
          saýla we isleseň esasy maksadyň
          bilen bagla.
        </p>
      </div>

      <div
        className="
          mt-5 grid gap-4
          xl:grid-cols-[minmax(0,1fr)_280px_300px_auto]
          xl:items-end
        "
      >
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-text-muted">
            Işiň ady
          </span>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value,
              )
            }
            placeholder="Meselem: Telefon üçin 500 manat gazanmak"
            className="
              h-12 w-full
              rounded-xl
              border border-border
              bg-background
              px-4
              text-sm
              text-text-primary
              outline-none
              transition-all duration-200
              placeholder:text-text-muted/60
              hover:border-primary/30
              focus:border-primary
              focus:ring-2
              focus:ring-primary/10
            "
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-text-muted">
            Möhümlik derejesi
          </span>

          <select
            value={quadrant}
            onChange={(event) =>
              setQuadrant(
                event.target
                  .value as EisenhowerQuadrant,
              )
            }
            className="
              h-12 w-full
              rounded-xl
              border border-border
              bg-background
              px-4
              text-sm
              text-text-primary
              outline-none
              transition-all duration-200
              hover:border-primary/30
              focus:border-primary
              focus:ring-2
              focus:ring-primary/10
            "
          >
            <option value="urgent-important">
              🔴 Häzir etmeli
            </option>

            <option value="important-not-urgent">
              🟡 Meýilleşdirmeli
            </option>

            <option value="urgent-not-important">
              🔵 Tabşyrmaly ýa-da azaltmaly
            </option>

            <option value="not-urgent-not-important">
              ⚪ Bes etmeli
            </option>
          </select>
        </label>

        <div>
          <span className="mb-2 block text-sm font-medium text-text-muted">
            Maksat bilen baglanyşyk
          </span>

          <button
            type="button"
            disabled={!canLinkGoal}
            onClick={() =>
              setLinkToGoal(
                (current) =>
                  !current,
              )
            }
            className={[
              `
                flex h-12 w-full
                items-center gap-3
                rounded-xl
                border px-4
                text-left text-sm
                transition-all duration-200
              `,
              linkToGoal
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-background text-text-primary hover:border-primary/30",
              !canLinkGoal
                ? "cursor-not-allowed opacity-40"
                : "",
            ].join(" ")}
          >
            {linkToGoal ? (
              <Target
                size={17}
                className="shrink-0"
              />
            ) : (
              <Link2
                size={17}
                className="shrink-0 text-text-muted"
              />
            )}

            <span className="min-w-0">
              <span className="block text-xs font-semibold">
                {linkToGoal
                  ? "Maksada bagly"
                  : "Baglanyşyksyz"}
              </span>

              <span className="block truncate text-[11px] opacity-70">
                {canLinkGoal
                  ? mainGoal
                  : "Ilki maksat döret"}
              </span>
            </span>
          </button>
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="
            inline-flex h-12
            items-center justify-center
            gap-2
            rounded-xl
            bg-primary
            px-6
            text-sm font-semibold
            text-slate-950
            transition-all duration-200
            hover:-translate-y-0.5
            hover:bg-primary-hover
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:translate-y-0
          "
        >
          <Plus size={18} />
          Iş goş
        </button>
      </div>

      {linkToGoal &&
        canLinkGoal && (
          <div
            className="
              mt-4
              flex items-start gap-3
              rounded-xl
              border border-primary/15
              bg-primary/[0.045]
              px-4 py-3
            "
          >
            <Target
              size={16}
              className="mt-0.5 shrink-0 text-primary"
            />

            <p className="text-xs leading-5 text-text-muted">
              Bu iş{" "}
              <span className="font-semibold text-text-primary">
                {mainGoal}
              </span>{" "}
              maksadyna baglanar we
              saýlanan döwürde şol tablisada
              galar.
            </p>
          </div>
        )}
    </form>
  );
}