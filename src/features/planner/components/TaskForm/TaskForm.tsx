import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
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

  const [isOpen, setIsOpen] =
    useState(false);

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

  function finishSubmit() {
    resetForm();

    if (
      window.matchMedia(
        "(max-width: 639px)",
      ).matches
    ) {
      setIsOpen(false);
    }
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

      finishSubmit();
      return;
    }

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

    finishSubmit();
  }

  const canLinkGoal =
    Boolean(mainGoal.trim());

  return (
    <form
      onSubmit={handleSubmit}
      className="
        overflow-hidden
        rounded-[16px]
        border border-border
        bg-surface
        sm:rounded-2xl
        sm:p-6
      "
    >
      {/* MOBILE COMPACT HEADER */}
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (current) => !current,
          )
        }
        className="
          flex w-full
          items-center
          justify-between
          gap-3
          p-3
          text-left
          sm:hidden
        "
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="
              flex h-8 w-8
              shrink-0 items-center
              justify-center
              rounded-lg
              bg-primary/10
              text-primary
            "
          >
            <Plus size={16} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-bold text-text-primary">
              Täze iş goş
            </p>

            <p className="mt-0.5 truncate text-[9px] text-text-muted">
              Meýilnamaňa täze iş giriz
            </p>
          </div>
        </div>

        <div
          className="
            flex h-7 w-7
            shrink-0 items-center
            justify-center
            rounded-lg
            border border-border
            text-text-muted
          "
        >
          {isOpen ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </div>
      </button>

      {/* FORM CONTENT */}
      <div
        className={[
          isOpen
            ? "block"
            : "hidden",
          "border-t border-border p-3 sm:block sm:border-t-0 sm:p-0",
        ].join(" ")}
      >
        {/* DESKTOP HEADER */}
        <div className="hidden sm:block">
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
            grid gap-2.5
            sm:mt-5
            sm:gap-4
            xl:grid-cols-[minmax(0,1fr)_280px_300px_auto]
            xl:items-end
          "
        >
          {/* TITLE */}
          <label className="block">
            <span
              className="
                mb-1 block
                text-[10px]
                font-medium
                text-text-muted
                sm:mb-2
                sm:text-sm
              "
            >
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
              placeholder="Meselem: Sport etmek"
              autoFocus={isOpen}
              className="
                h-10 w-full
                rounded-lg
                border border-border
                bg-background
                px-3
                text-[11px]
                text-text-primary
                outline-none
                transition-all duration-200
                placeholder:text-text-muted/60
                hover:border-primary/30
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10

                sm:h-12
                sm:rounded-xl
                sm:px-4
                sm:text-sm
              "
            />
          </label>

          {/* PRIORITY */}
          <label className="block">
            <span
              className="
                mb-1 block
                text-[10px]
                font-medium
                text-text-muted
                sm:mb-2
                sm:text-sm
              "
            >
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
                h-10 w-full
                rounded-lg
                border border-border
                bg-background
                px-3
                text-[11px]
                text-text-primary
                outline-none
                transition-all duration-200
                hover:border-primary/30
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10

                sm:h-12
                sm:rounded-xl
                sm:px-4
                sm:text-sm
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

          {/* GOAL */}
          <div>
            <span
              className="
                mb-1 block
                text-[10px]
                font-medium
                text-text-muted
                sm:mb-2
                sm:text-sm
              "
            >
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
                  flex h-10 w-full
                  items-center gap-2
                  rounded-lg
                  border px-3
                  text-left
                  transition-all duration-200

                  sm:h-12
                  sm:gap-3
                  sm:rounded-xl
                  sm:px-4
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
                  size={15}
                  className="shrink-0 sm:h-[17px] sm:w-[17px]"
                />
              ) : (
                <Link2
                  size={15}
                  className="shrink-0 text-text-muted sm:h-[17px] sm:w-[17px]"
                />
              )}

              <span className="min-w-0">
                <span className="block text-[10px] font-semibold sm:text-xs">
                  {linkToGoal
                    ? "Maksada bagly"
                    : "Baglanyşyksyz"}
                </span>

                <span className="block truncate text-[8px] opacity-70 sm:text-[11px]">
                  {canLinkGoal
                    ? mainGoal
                    : "Ilki maksat döret"}
                </span>
              </span>
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="
              inline-flex h-10
              items-center justify-center
              gap-1.5
              rounded-lg
              bg-primary
              px-4
              text-[11px]
              font-semibold
              text-slate-950
              transition-all duration-200
              hover:bg-primary-hover
              disabled:cursor-not-allowed
              disabled:opacity-40

              sm:h-12
              sm:gap-2
              sm:rounded-xl
              sm:px-6
              sm:text-sm
            "
          >
            <Plus
              size={15}
              className="sm:h-[18px] sm:w-[18px]"
            />

            Iş goş
          </button>
        </div>

        {linkToGoal &&
          canLinkGoal && (
            <div
              className="
                mt-2.5
                flex items-start
                gap-2
                rounded-lg
                border border-primary/15
                bg-primary/[0.045]
                px-3 py-2

                sm:mt-4
                sm:gap-3
                sm:rounded-xl
                sm:px-4
                sm:py-3
              "
            >
              <Target
                size={14}
                className="mt-0.5 shrink-0 text-primary sm:h-4 sm:w-4"
              />

              <p className="text-[9px] leading-4 text-text-muted sm:text-xs sm:leading-5">
                Bu iş{" "}
                <span className="font-semibold text-text-primary">
                  {mainGoal}
                </span>{" "}
                maksadyna baglanar we
                saýlanan döwürde şol
                tablisada galar.
              </p>
            </div>
          )}
      </div>
    </form>
  );
}