import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Focus,
  Target,
  X,
} from "lucide-react";

import { usePlannerStore } from "../../../../store/plannerStore";
import { calculateTaskProgress } from "../../utils/plannerProgress";

export default function PlannerGoalTree() {
  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const focusedTaskId = usePlannerStore(
    (state) => state.focusedTaskId,
  );

  const setFocusedTaskId = usePlannerStore(
    (state) => state.setFocusedTaskId,
  );

  const [expandedYearlyIds, setExpandedYearlyIds] =
    useState<string[]>([]);

  const [expandedMonthlyIds, setExpandedMonthlyIds] =
    useState<string[]>([]);

  const yearlyTasks = tasks.filter(
    (task) =>
      task.period === "yearly" &&
      (!focusedTaskId ||
        task.id === focusedTaskId),
  );

  function getChildren(parentTaskId: string) {
    return tasks.filter(
      (task) =>
        task.parentTaskId === parentTaskId,
    );
  }

  function getProgress(taskId: string) {
    return calculateTaskProgress(
      tasks,
      taskId,
    );
  }

  function toggleYearly(taskId: string) {
    setExpandedYearlyIds((current) =>
      current.includes(taskId)
        ? current.filter(
            (id) => id !== taskId,
          )
        : [...current, taskId],
    );
  }

  function toggleMonthly(taskId: string) {
    setExpandedMonthlyIds((current) =>
      current.includes(taskId)
        ? current.filter(
            (id) => id !== taskId,
          )
        : [...current, taskId],
    );
  }

  return (
    <section
      className="
        relative overflow-hidden
        rounded-3xl
        border border-border
        bg-surface
        p-6
        shadow-[var(--app-shadow)]
      "
    >
      {/* Ýumşak fon */}
      <div
        className="
          pointer-events-none
          absolute -right-24 -top-24
          h-56 w-56
          rounded-full
          bg-violet-500/[0.05]
          blur-3xl
        "
      />

      <div className="relative z-10">
        {/* HEADER */}
        <div>
          <div className="flex items-center gap-2 text-violet-400">
            <Target size={17} />

            <span className="text-sm font-semibold">
              Maksatdan şu güne çenli
            </span>
          </div>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            Meýilnama ýoly
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
            Uly maksadyňy kiçi we ýerine
            ýetirip bolýan ädimlere böl.
          </p>

          {/* ÝOL */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="rounded-lg bg-violet-500/10 px-3 py-2 text-violet-400">
              Ýyllyk maksat
            </span>

            <ChevronRight
              size={14}
              className="text-text-disabled"
            />

            <span className="rounded-lg bg-info/10 px-3 py-2 text-info">
              Aýlyk ädim
            </span>

            <ChevronRight
              size={14}
              className="text-text-disabled"
            />

            <span className="rounded-lg bg-warning/10 px-3 py-2 text-warning">
              Hepdelik iş
            </span>

            <ChevronRight
              size={14}
              className="text-text-disabled"
            />

            <span className="rounded-lg bg-success/10 px-3 py-2 text-success">
              Şu gün
            </span>
          </div>
        </div>

        {/* SAÝLANAN MAKSAT */}
        {focusedTaskId && (
          <div
            className="
              mt-5 flex flex-col gap-3
              rounded-xl
              border border-primary/15
              bg-primary/[0.04]
              p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  bg-primary/10
                  text-primary
                "
              >
                <Focus size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-primary">
                  Esasy maksat saýlandy
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Häzir diňe şu maksada degişli
                  meýilnama görkezilýär.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setFocusedTaskId(null)
              }
              className="
                inline-flex h-9
                items-center justify-center
                gap-2 rounded-lg
                border border-border
                px-3
                text-xs font-semibold
                text-text-secondary
                transition
                hover:bg-surface-hover
                hover:text-text-primary
              "
            >
              <X size={14} />
              Hemmesini görkez
            </button>
          </div>
        )}

        {/* MAKSATLAR */}
        <div className="mt-6 space-y-4">
          {yearlyTasks.length === 0 ? (
            <div
              className="
                rounded-xl
                border border-dashed
                border-border
                bg-background/20
                p-6 text-center
              "
            >
              <p className="text-sm font-medium text-text-secondary">
                Heniz ýyllyk maksat ýok
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Ýyllyk maksat goşulanda onuň
                aşagyndaky ädimler şu ýerde
                görkeziler.
              </p>
            </div>
          ) : (
            yearlyTasks.map((yearlyTask) => {
              const monthlyTasks =
                getChildren(yearlyTask.id);

              const yearlyProgress =
                getProgress(yearlyTask.id);

              const isYearlyExpanded =
                expandedYearlyIds.includes(
                  yearlyTask.id,
                );

              return (
                <article
                  key={yearlyTask.id}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border border-violet-400/15
                    bg-background/25
                  "
                >
                  {/* ÝYLLYK */}
                  <div className="flex items-center gap-3 p-5">
                    <button
                      type="button"
                      onClick={() =>
                        toggleYearly(
                          yearlyTask.id,
                        )
                      }
                      className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-lg
                        border border-border
                        bg-surface
                        text-text-muted
                        transition
                        hover:border-violet-400/30
                        hover:text-violet-400
                      "
                    >
                      {isYearlyExpanded ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="shrink-0 text-violet-400"
                        />

                        <span className="text-xs font-semibold text-violet-400">
                          Ýyllyk maksat
                        </span>
                      </div>

                      <p className="mt-1 truncate font-semibold text-text-primary">
                        {yearlyTask.title}
                      </p>

                      <p className="mt-1 text-xs text-text-muted">
                        {monthlyTasks.length > 0
                          ? `${monthlyTasks.length} aýlyk ädim`
                          : "Heniz aýlyk ädim ýok"}
                      </p>
                    </div>

                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="text-lg font-bold text-violet-400">
                        {yearlyProgress}%
                      </p>

                      <p className="text-[10px] text-text-disabled">
                        ýerine ýetirildi
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setFocusedTaskId(
                          yearlyTask.id,
                        )
                      }
                      disabled={
                        focusedTaskId ===
                        yearlyTask.id
                      }
                      className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-lg
                        border border-border
                        bg-surface
                        text-text-muted
                        transition
                        hover:border-primary/30
                        hover:bg-primary/10
                        hover:text-primary
                        disabled:cursor-default
                        disabled:border-primary/20
                        disabled:bg-primary/10
                        disabled:text-primary
                      "
                      aria-label="Şu maksady saýla"
                    >
                      <Focus size={16} />
                    </button>

                    {yearlyProgress === 100 && (
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-success"
                      />
                    )}
                  </div>

                  {/* AÝLYK */}
                  {isYearlyExpanded && (
                    <div className="border-t border-border p-4 sm:p-5">
                      {monthlyTasks.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-text-muted">
                          Heniz aýlyk ädim ýok.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {monthlyTasks.map(
                            (monthlyTask) => {
                              const weeklyTasks =
                                getChildren(
                                  monthlyTask.id,
                                );

                              const monthlyProgress =
                                getProgress(
                                  monthlyTask.id,
                                );

                              const isMonthlyExpanded =
                                expandedMonthlyIds.includes(
                                  monthlyTask.id,
                                );

                              return (
                                <div
                                  key={monthlyTask.id}
                                  className="
                                    overflow-hidden
                                    rounded-xl
                                    border border-info/15
                                    bg-surface
                                  "
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleMonthly(
                                        monthlyTask.id,
                                      )
                                    }
                                    className="
                                      flex w-full
                                      items-center gap-3
                                      p-4 text-left
                                      transition
                                      hover:bg-surface-hover
                                    "
                                  >
                                    <div
                                      className="
                                        flex h-8 w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-info/10
                                        text-info
                                      "
                                    >
                                      {isMonthlyExpanded ? (
                                        <ChevronDown
                                          size={16}
                                        />
                                      ) : (
                                        <ChevronRight
                                          size={16}
                                        />
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-semibold text-info">
                                        Aýlyk ädim
                                      </p>

                                      <p className="mt-1 truncate text-sm font-medium text-text-primary">
                                        {monthlyTask.title}
                                      </p>

                                      <p className="mt-1 text-xs text-text-muted">
                                        {weeklyTasks.length > 0
                                          ? `${weeklyTasks.length} hepdelik iş`
                                          : "Heniz hepdelik iş ýok"}
                                      </p>
                                    </div>

                                    <span className="shrink-0 text-xs font-semibold text-info">
                                      {monthlyProgress}%
                                    </span>

                                    {monthlyProgress ===
                                      100 && (
                                      <CheckCircle2
                                        size={16}
                                        className="shrink-0 text-success"
                                      />
                                    )}
                                  </button>

                                  {/* HEPDELIK */}
                                  {isMonthlyExpanded && (
                                    <div className="border-t border-border p-3">
                                      {weeklyTasks.length ===
                                      0 ? (
                                        <p className="px-2 py-2 text-xs text-text-muted">
                                          Heniz hepdelik iş ýok.
                                        </p>
                                      ) : (
                                        <div className="space-y-2">
                                          {weeklyTasks.map(
                                            (
                                              weeklyTask,
                                            ) => {
                                              const dailyTasks =
                                                getChildren(
                                                  weeklyTask.id,
                                                );

                                              const weeklyProgress =
                                                getProgress(
                                                  weeklyTask.id,
                                                );

                                              return (
                                                <div
                                                  key={
                                                    weeklyTask.id
                                                  }
                                                  className="
                                                    rounded-lg
                                                    border border-warning/15
                                                    bg-warning/[0.025]
                                                    px-4 py-3
                                                  "
                                                >
                                                  <div className="flex items-center gap-3">
                                                    <div className="min-w-0 flex-1">
                                                      <p className="text-[11px] font-semibold text-warning">
                                                        Hepdelik iş
                                                      </p>

                                                      <p className="mt-1 truncate text-sm text-text-secondary">
                                                        {
                                                          weeklyTask.title
                                                        }
                                                      </p>
                                                    </div>

                                                    <span className="shrink-0 text-xs font-semibold text-warning">
                                                      {
                                                        weeklyProgress
                                                      }
                                                      %
                                                    </span>

                                                    {weeklyProgress ===
                                                      100 && (
                                                      <CheckCircle2
                                                        size={
                                                          16
                                                        }
                                                        className="shrink-0 text-success"
                                                      />
                                                    )}
                                                  </div>

                                                  {/* GÜNLÜK */}
                                                  {dailyTasks.length >
                                                    0 && (
                                                    <div className="mt-3 space-y-2 border-t border-border/60 pt-3">
                                                      {dailyTasks.map(
                                                        (
                                                          dailyTask,
                                                        ) => (
                                                          <div
                                                            key={
                                                              dailyTask.id
                                                            }
                                                            className="
                                                              flex
                                                              items-center
                                                              gap-2
                                                              rounded-lg
                                                              bg-success/[0.025]
                                                              px-3 py-2
                                                              text-xs
                                                            "
                                                          >
                                                            <span
                                                              className={[
                                                                "h-2 w-2 shrink-0 rounded-full",
                                                                dailyTask.completed
                                                                  ? "bg-success"
                                                                  : "bg-text-disabled",
                                                              ].join(
                                                                " ",
                                                              )}
                                                            />

                                                            <span className="shrink-0 font-semibold text-success">
                                                              Şu gün
                                                            </span>

                                                            <span
                                                              className={[
                                                                "truncate",
                                                                dailyTask.completed
                                                                  ? "text-text-disabled line-through"
                                                                  : "text-text-muted",
                                                              ].join(
                                                                " ",
                                                              )}
                                                            >
                                                              {
                                                                dailyTask.title
                                                              }
                                                            </span>
                                                          </div>
                                                        ),
                                                      )}
                                                    </div>
                                                  )}

                                                  {dailyTasks.length ===
                                                    0 && (
                                                    <p className="mt-2 text-[11px] text-text-disabled">
                                                      Heniz günlük iş ýok.
                                                    </p>
                                                  )}
                                                </div>
                                              );
                                            },
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}