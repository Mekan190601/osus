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

  const [
    expandedYearlyIds,
    setExpandedYearlyIds,
  ] = useState<string[]>([]);

  const [
    expandedMonthlyIds,
    setExpandedMonthlyIds,
  ] = useState<string[]>([]);

  const yearlyTasks = tasks.filter(
    (task) =>
      task.period === "yearly" &&
      (!focusedTaskId ||
        task.id === focusedTaskId),
  );

  function getChildren(
    parentTaskId: string,
  ) {
    return tasks.filter(
      (task) =>
        task.parentTaskId ===
        parentTaskId,
    );
  }

  function getProgress(taskId: string) {
    return calculateTaskProgress(
      tasks,
      taskId,
    );
  }

  function toggleYearly(
    taskId: string,
  ) {
    setExpandedYearlyIds(
      (current) =>
        current.includes(taskId)
          ? current.filter(
              (id) =>
                id !== taskId,
            )
          : [...current, taskId],
    );
  }

  function toggleMonthly(
    taskId: string,
  ) {
    setExpandedMonthlyIds(
      (current) =>
        current.includes(taskId)
          ? current.filter(
              (id) =>
                id !== taskId,
            )
          : [...current, taskId],
    );
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[18px]
        border border-border
        bg-surface
        p-3
        shadow-[var(--app-shadow)]

        sm:rounded-3xl
        sm:p-5

        lg:p-6
      "
    >
      {/* SOFT BACKGROUND */}
      <div
        className="
          pointer-events-none
          absolute -right-20 -top-20
          h-40 w-40
          rounded-full
          bg-violet-500/[0.04]
          blur-3xl

          sm:h-56 sm:w-56
        "
      />

      <div className="relative z-10">
        {/* HEADER */}
        <div>
          <div className="flex items-center gap-1.5 text-violet-400 sm:gap-2">
            <Target
              size={14}
              className="sm:h-[17px] sm:w-[17px]"
            />

            <span className="text-[10px] font-semibold sm:text-sm">
              Maksatdan şu güne çenli
            </span>
          </div>

          <h2
            className="
              mt-1
              text-[18px]
              font-bold
              tracking-tight
              text-text-primary

              sm:mt-2
              sm:text-2xl
            "
          >
            Meýilnama ýoly
          </h2>

          <p
            className="
              mt-1
              text-[9px]
              leading-4
              text-text-muted

              sm:mt-2
              sm:max-w-2xl
              sm:text-sm
              sm:leading-6
            "
          >
            Uly maksadyňy kiçi we ýerine
            ýetirip bolýan ädimlere böl.
          </p>

          {/* ROAD */}
          <div
            className="
              mt-2.5
              flex
              items-center
              gap-1
              overflow-x-auto
              pb-1
              text-[8px]
              font-medium

              sm:mt-5
              sm:flex-wrap
              sm:gap-2
              sm:overflow-visible
              sm:pb-0
              sm:text-xs
            "
          >
            <span
              className="
                shrink-0
                rounded-md
                bg-violet-500/10
                px-2 py-1
                text-violet-400

                sm:rounded-lg
                sm:px-3
                sm:py-2
              "
            >
              Ýyllyk maksat
            </span>

            <ChevronRight
              size={11}
              className="shrink-0 text-text-disabled sm:h-[14px] sm:w-[14px]"
            />

            <span
              className="
                shrink-0
                rounded-md
                bg-info/10
                px-2 py-1
                text-info

                sm:rounded-lg
                sm:px-3
                sm:py-2
              "
            >
              Aýlyk ädim
            </span>

            <ChevronRight
              size={11}
              className="shrink-0 text-text-disabled sm:h-[14px] sm:w-[14px]"
            />

            <span
              className="
                shrink-0
                rounded-md
                bg-warning/10
                px-2 py-1
                text-warning

                sm:rounded-lg
                sm:px-3
                sm:py-2
              "
            >
              Hepdelik iş
            </span>

            <ChevronRight
              size={11}
              className="shrink-0 text-text-disabled sm:h-[14px] sm:w-[14px]"
            />

            <span
              className="
                shrink-0
                rounded-md
                bg-success/10
                px-2 py-1
                text-success

                sm:rounded-lg
                sm:px-3
                sm:py-2
              "
            >
              Şu gün
            </span>
          </div>
        </div>

        {/* FOCUSED GOAL */}
        {focusedTaskId && (
          <div
            className="
              mt-3
              flex
              items-center
              gap-2
              rounded-lg
              border border-primary/15
              bg-primary/[0.04]
              p-2.5

              sm:mt-5
              sm:gap-3
              sm:rounded-xl
              sm:p-4
            "
          >
            <div
              className="
                flex h-8 w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-primary/10
                text-primary

                sm:h-9
                sm:w-9
              "
            >
              <Focus
                size={14}
                className="sm:h-[17px] sm:w-[17px]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-primary sm:text-sm">
                Esasy maksat saýlandy
              </p>

              <p className="mt-0.5 truncate text-[8px] text-text-muted sm:mt-1 sm:text-xs">
                Häzir diňe şu maksada degişli meýilnama görkezilýär.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setFocusedTaskId(null)
              }
              className="
                flex h-8 w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                border border-border
                text-text-secondary
                transition
                hover:bg-surface-hover
                hover:text-text-primary

                sm:w-auto
                sm:gap-2
                sm:px-3
                sm:text-xs
                sm:font-semibold
              "
              aria-label="Hemmesini görkez"
            >
              <X size={13} />

              <span className="hidden sm:inline">
                Hemmesini görkez
              </span>
            </button>
          </div>
        )}

        {/* GOALS */}
        <div className="mt-3 space-y-2.5 sm:mt-6 sm:space-y-4">
          {yearlyTasks.length === 0 ? (
            <div
              className="
                rounded-lg
                border border-dashed
                border-border
                bg-background/20
                p-3
                text-center

                sm:rounded-xl
                sm:p-6
              "
            >
              <p className="text-[10px] font-medium text-text-secondary sm:text-sm">
                Heniz ýyllyk maksat ýok
              </p>

              <p className="mt-1 text-[8px] leading-4 text-text-muted sm:text-xs">
                Ýyllyk maksat goşulanda onuň
                aşagyndaky ädimler şu ýerde
                görkeziler.
              </p>
            </div>
          ) : (
            yearlyTasks.map(
              (yearlyTask) => {
                const monthlyTasks =
                  getChildren(
                    yearlyTask.id,
                  );

                const yearlyProgress =
                  getProgress(
                    yearlyTask.id,
                  );

                const isYearlyExpanded =
                  expandedYearlyIds.includes(
                    yearlyTask.id,
                  );

                return (
                  <article
                    key={
                      yearlyTask.id
                    }
                    className="
                      overflow-hidden
                      rounded-xl
                      border
                      border-violet-400/15
                      bg-background/25

                      sm:rounded-2xl
                    "
                  >
                    {/* YEARLY */}
                    <div className="flex items-center gap-2 p-2.5 sm:gap-3 sm:p-5">
                      <button
                        type="button"
                        onClick={() =>
                          toggleYearly(
                            yearlyTask.id,
                          )
                        }
                        className="
                          flex h-8 w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border border-border
                          bg-surface
                          text-text-muted
                          transition
                          hover:border-violet-400/30
                          hover:text-violet-400

                          sm:h-9
                          sm:w-9
                        "
                      >
                        {isYearlyExpanded ? (
                          <ChevronDown
                            size={15}
                          />
                        ) : (
                          <ChevronRight
                            size={15}
                          />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <CalendarDays
                            size={12}
                            className="shrink-0 text-violet-400 sm:h-4 sm:w-4"
                          />

                          <span className="text-[8px] font-semibold text-violet-400 sm:text-xs">
                            Ýyllyk maksat
                          </span>
                        </div>

                        <p className="mt-0.5 truncate text-[11px] font-semibold text-text-primary sm:mt-1 sm:text-base">
                          {
                            yearlyTask.title
                          }
                        </p>

                        <p className="mt-0.5 text-[8px] text-text-muted sm:mt-1 sm:text-xs">
                          {monthlyTasks.length >
                          0
                            ? `${monthlyTasks.length} aýlyk ädim`
                            : "Heniz aýlyk ädim ýok"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[12px] font-bold text-violet-400 sm:text-lg">
                          {yearlyProgress}%
                        </p>

                        <p className="hidden text-[10px] text-text-disabled sm:block">
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
                          flex h-8 w-8
                          shrink-0
                          items-center
                          justify-center
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

                          sm:h-9
                          sm:w-9
                        "
                        aria-label="Şu maksady saýla"
                      >
                        <Focus
                          size={14}
                        />
                      </button>

                      {yearlyProgress ===
                        100 && (
                        <CheckCircle2
                          size={15}
                          className="hidden shrink-0 text-success sm:block"
                        />
                      )}
                    </div>

                    {/* MONTHLY */}
                    {isYearlyExpanded && (
                      <div className="border-t border-border p-2 sm:p-5">
                        {monthlyTasks.length ===
                        0 ? (
                          <p className="rounded-lg border border-dashed border-border px-3 py-2 text-[9px] text-text-muted sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm">
                            Heniz aýlyk
                            ädim ýok.
                          </p>
                        ) : (
                          <div className="space-y-2 sm:space-y-3">
                            {monthlyTasks.map(
                              (
                                monthlyTask,
                              ) => {
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
                                    key={
                                      monthlyTask.id
                                    }
                                    className="
                                      overflow-hidden
                                      rounded-lg
                                      border border-info/15
                                      bg-surface

                                      sm:rounded-xl
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
                                        items-center
                                        gap-2
                                        p-2.5
                                        text-left
                                        transition
                                        hover:bg-surface-hover

                                        sm:gap-3
                                        sm:p-4
                                      "
                                    >
                                      <div
                                        className="
                                          flex h-7 w-7
                                          shrink-0
                                          items-center
                                          justify-center
                                          rounded-md
                                          bg-info/10
                                          text-info

                                          sm:h-8
                                          sm:w-8
                                          sm:rounded-lg
                                        "
                                      >
                                        {isMonthlyExpanded ? (
                                          <ChevronDown
                                            size={13}
                                          />
                                        ) : (
                                          <ChevronRight
                                            size={13}
                                          />
                                        )}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <p className="text-[8px] font-semibold text-info sm:text-xs">
                                          Aýlyk
                                          ädim
                                        </p>

                                        <p className="mt-0.5 truncate text-[10px] font-medium text-text-primary sm:mt-1 sm:text-sm">
                                          {
                                            monthlyTask.title
                                          }
                                        </p>

                                        <p className="mt-0.5 text-[8px] text-text-muted sm:mt-1 sm:text-xs">
                                          {weeklyTasks.length >
                                          0
                                            ? `${weeklyTasks.length} hepdelik iş`
                                            : "Heniz hepdelik iş ýok"}
                                        </p>
                                      </div>

                                      <span className="shrink-0 text-[9px] font-semibold text-info sm:text-xs">
                                        {
                                          monthlyProgress
                                        }
                                        %
                                      </span>

                                      {monthlyProgress ===
                                        100 && (
                                        <CheckCircle2
                                          size={
                                            14
                                          }
                                          className="shrink-0 text-success"
                                        />
                                      )}
                                    </button>

                                    {/* WEEKLY */}
                                    {isMonthlyExpanded && (
                                      <div className="border-t border-border p-2 sm:p-3">
                                        {weeklyTasks.length ===
                                        0 ? (
                                          <p className="px-1 py-1 text-[8px] text-text-muted sm:px-2 sm:py-2 sm:text-xs">
                                            Heniz
                                            hepdelik
                                            iş ýok.
                                          </p>
                                        ) : (
                                          <div className="space-y-1.5 sm:space-y-2">
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
                                                      border
                                                      border-warning/15
                                                      bg-warning/[0.025]
                                                      px-2.5
                                                      py-2

                                                      sm:px-4
                                                      sm:py-3
                                                    "
                                                  >
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                      <div className="min-w-0 flex-1">
                                                        <p className="text-[8px] font-semibold text-warning sm:text-[11px]">
                                                          Hepdelik
                                                          iş
                                                        </p>

                                                        <p className="mt-0.5 truncate text-[9px] text-text-secondary sm:mt-1 sm:text-sm">
                                                          {
                                                            weeklyTask.title
                                                          }
                                                        </p>
                                                      </div>

                                                      <span className="shrink-0 text-[8px] font-semibold text-warning sm:text-xs">
                                                        {
                                                          weeklyProgress
                                                        }
                                                        %
                                                      </span>

                                                      {weeklyProgress ===
                                                        100 && (
                                                        <CheckCircle2
                                                          size={
                                                            13
                                                          }
                                                          className="shrink-0 text-success sm:h-4 sm:w-4"
                                                        />
                                                      )}
                                                    </div>

                                                    {/* DAILY */}
                                                    {dailyTasks.length >
                                                      0 && (
                                                      <div className="mt-2 space-y-1 border-t border-border/60 pt-2 sm:mt-3 sm:space-y-2 sm:pt-3">
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
                                                                gap-1.5
                                                                rounded-md
                                                                bg-success/[0.025]
                                                                px-2
                                                                py-1.5
                                                                text-[8px]

                                                                sm:gap-2
                                                                sm:rounded-lg
                                                                sm:px-3
                                                                sm:py-2
                                                                sm:text-xs
                                                              "
                                                            >
                                                              <span
                                                                className={[
                                                                  "h-1.5 w-1.5 shrink-0 rounded-full sm:h-2 sm:w-2",
                                                                  dailyTask.completed
                                                                    ? "bg-success"
                                                                    : "bg-text-disabled",
                                                                ].join(
                                                                  " ",
                                                                )}
                                                              />

                                                              <span className="shrink-0 font-semibold text-success">
                                                                Şu
                                                                gün
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
                                                      <p className="mt-1.5 text-[8px] text-text-disabled sm:mt-2 sm:text-[11px]">
                                                        Heniz
                                                        günlük
                                                        iş ýok.
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
              },
            )
          )}
        </div>
      </div>
    </section>
  );
}