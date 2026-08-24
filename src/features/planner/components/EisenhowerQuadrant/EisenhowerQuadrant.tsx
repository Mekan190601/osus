import { useState } from "react";
import {
  Check,
  Circle,
  Link2,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { usePlannerStore } from "../../../../store/plannerStore";

import type {
  EisenhowerQuadrant as EisenhowerQuadrantType,
  PlannerPeriod,
  PlannerTask,
} from "../../types/planner.types";

import { getPlannerDateKey } from "../../utils/plannerDate";

type EisenhowerQuadrantProps = {
  romanNumber: "I" | "II" | "III" | "IV";
  title: string;
  description: string;
  action: string;
  quadrant: EisenhowerQuadrantType;
  tasks: PlannerTask[];
};

function getParentPeriod(
  period: PlannerPeriod,
): PlannerPeriod | null {
  if (period === "daily") {
    return "weekly";
  }

  if (period === "weekly") {
    return "monthly";
  }

  if (period === "monthly") {
    return "yearly";
  }

  return null;
}

function getParentLabel(
  period: PlannerPeriod,
) {
  if (period === "weekly") {
    return "Hepdelik meýilnama";
  }

  if (period === "monthly") {
    return "Aýlyk meýilnama";
  }

  if (period === "yearly") {
    return "Ýyllyk meýilnama";
  }

  return "";
}

function getQuadrantStyle(
  quadrant: EisenhowerQuadrantType,
) {
  if (quadrant === "urgent-important") {
    return {
      border: "border-danger/20",
      background: "bg-danger/[0.025]",
      badge: "bg-danger/10 text-danger",
      accent: "text-danger",
    };
  }

  if (
    quadrant ===
    "important-not-urgent"
  ) {
    return {
      border: "border-warning/20",
      background:
        "bg-warning/[0.025]",
      badge:
        "bg-warning/10 text-warning",
      accent: "text-warning",
    };
  }

  if (
    quadrant ===
    "urgent-not-important"
  ) {
    return {
      border: "border-info/20",
      background: "bg-info/[0.025]",
      badge: "bg-info/10 text-info",
      accent: "text-info",
    };
  }

  return {
    border: "border-border",
    background: "bg-background/20",
    badge:
      "bg-background/70 text-text-muted",
    accent: "text-text-muted",
  };
}

function getDisplayText(
  quadrant: EisenhowerQuadrantType,
) {
  if (quadrant === "urgent-important") {
    return {
      name: "Häzir etmeli",
      type: "Möhüm + gyssagly",
    };
  }

  if (
    quadrant ===
    "important-not-urgent"
  ) {
    return {
      name: "Meýilleşdirmeli",
      type: "Möhüm + gyssagly däl",
    };
  }

  if (
    quadrant ===
    "urgent-not-important"
  ) {
    return {
      name: "Tabşyrmaly / azaltmaly",
      type: "Möhüm däl + gyssagly",
    };
  }

  return {
    name: "Bes etmeli",
    type: "Möhüm däl + gyssagly däl",
  };
}

export default function EisenhowerQuadrant({
  romanNumber,
  quadrant,
  tasks,
}: EisenhowerQuadrantProps) {
  const allTasks = usePlannerStore(
    (state) => state.tasks,
  );

  const selectedDate = usePlannerStore(
    (state) => state.selectedDate,
  );

  const toggleTask = usePlannerStore(
    (state) => state.toggleTask,
  );

  const deleteTask = usePlannerStore(
    (state) => state.deleteTask,
  );

  const updateTask = usePlannerStore(
    (state) => state.updateTask,
  );

  const moveTask = usePlannerStore(
    (state) => state.moveTask,
  );

  const [
    editingTaskId,
    setEditingTaskId,
  ] = useState<string | null>(null);

  const [
    editTitle,
    setEditTitle,
  ] = useState("");

  const [
    editDescription,
    setEditDescription,
  ] = useState("");

  const [
    editQuadrant,
    setEditQuadrant,
  ] =
    useState<EisenhowerQuadrantType>(
      "urgent-important",
    );

  const [
    editParentTaskId,
    setEditParentTaskId,
  ] = useState("");

  const quadrantStyle =
    getQuadrantStyle(quadrant);

  const displayText =
    getDisplayText(quadrant);

  function startEditing(
    task: PlannerTask,
  ) {
    setEditingTaskId(task.id);
    setEditTitle(task.title);

    setEditDescription(
      task.description ?? "",
    );

    setEditQuadrant(task.quadrant);

    setEditParentTaskId(
      task.parentTaskId ?? "",
    );
  }

  function cancelEditing() {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
    setEditParentTaskId("");
  }

  function saveEditing(
    taskId: string,
  ) {
    const cleanTitle =
      editTitle.trim();

    if (!cleanTitle) {
      return;
    }

    updateTask(taskId, {
      title: cleanTitle,
      description:
        editDescription.trim(),
      parentTaskId:
        editParentTaskId || null,
    });

    moveTask(
      taskId,
      editQuadrant,
    );

    cancelEditing();
  }

  return (
    <section
      className={[
        "flex min-h-[300px] flex-col rounded-2xl border p-5 transition-all duration-200",
        quadrantStyle.border,
        quadrantStyle.background,
      ].join(" ")}
    >
      {/* HEADER */}
      <div className="flex items-start gap-3 border-b border-border/70 pb-4">
        <span
          className={[
            "flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg px-2 text-sm font-bold",
            quadrantStyle.badge,
          ].join(" ")}
        >
          {romanNumber}
        </span>

        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {displayText.name}
          </h3>

          <p
            className={[
              "mt-1 text-xs font-medium",
              quadrantStyle.accent,
            ].join(" ")}
          >
            {displayText.type}
          </p>
        </div>
      </div>

      {/* TASKS */}
      <div className="flex-1 pt-4">
        {tasks.length === 0 ? (
          <div
            className="
              flex min-h-32
              items-center justify-center
              rounded-xl
              border border-dashed
              border-border/80
              bg-background/15
              p-5 text-center
            "
          >
            <p className="text-sm text-text-muted">
              Bu bölümde häzir iş ýok.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isEditing =
                editingTaskId ===
                task.id;

              const parentPeriod =
                getParentPeriod(
                  task.period,
                );

              const parentDateKey =
                parentPeriod
                  ? getPlannerDateKey(
                      new Date(
                        selectedDate,
                      ),
                      parentPeriod,
                    )
                  : null;

              const availableParentTasks =
                parentPeriod &&
                parentDateKey
                  ? allTasks.filter(
                      (
                        parentTask,
                      ) =>
                        parentTask.period ===
                          parentPeriod &&
                        parentTask.dateKey ===
                          parentDateKey &&
                        parentTask.id !==
                          task.id,
                    )
                  : [];

              const linkedParentTask =
                task.parentTaskId
                  ? allTasks.find(
                      (
                        parentTask,
                      ) =>
                        parentTask.id ===
                        task.parentTaskId,
                    )
                  : undefined;

              return (
                <article
                  key={task.id}
                  className={[
                    "group rounded-xl border p-4 transition-all duration-200",
                    task.completed
                      ? "border-success/15 bg-success/[0.035]"
                      : "border-border bg-background/35 hover:border-border-strong",
                  ].join(" ")}
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* TITLE */}
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-text-muted">
                          Işiň ady
                        </label>

                        <input
                          type="text"
                          value={editTitle}
                          onChange={(
                            event,
                          ) =>
                            setEditTitle(
                              event
                                .target
                                .value,
                            )
                          }
                          className="
                            h-11 w-full
                            rounded-xl
                            border border-border
                            bg-background
                            px-3 text-sm
                            text-text-primary
                            outline-none
                            transition
                            focus:border-primary
                          "
                        />
                      </div>

                      {/* DESCRIPTION */}
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-text-muted">
                          Düşündiriş
                        </label>

                        <textarea
                          value={
                            editDescription
                          }
                          onChange={(
                            event,
                          ) =>
                            setEditDescription(
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="Gerek bolsa gysga düşündiriş ýaz..."
                          rows={3}
                          className="
                            w-full resize-none
                            rounded-xl
                            border border-border
                            bg-background
                            px-3 py-3
                            text-sm
                            text-text-primary
                            outline-none
                            placeholder:text-text-disabled
                            focus:border-primary
                          "
                        />
                      </div>

                      {/* IMPORTANCE */}
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-text-muted">
                          Möhümlik derejesi
                        </label>

                        <select
                          value={
                            editQuadrant
                          }
                          onChange={(
                            event,
                          ) =>
                            setEditQuadrant(
                              event
                                .target
                                .value as EisenhowerQuadrantType,
                            )
                          }
                          className="
                            h-11 w-full
                            rounded-xl
                            border border-border
                            bg-background
                            px-3 text-sm
                            text-text-primary
                            outline-none
                            focus:border-primary
                          "
                        >
                          <option value="urgent-important">
                            🔴 Häzir etmeli
                            — Möhüm +
                            gyssagly
                          </option>

                          <option value="important-not-urgent">
                            🟡
                            Meýilleşdirmeli
                            — Möhüm +
                            gyssagly däl
                          </option>

                          <option value="urgent-not-important">
                            🔵 Tabşyrmaly
                            / azaltmaly —
                            Möhüm däl +
                            gyssagly
                          </option>

                          <option value="not-urgent-not-important">
                            ⚪ Bes etmeli
                            — Möhüm däl +
                            gyssagly däl
                          </option>
                        </select>
                      </div>

                      {/* PARENT */}
                      {parentPeriod && (
                        <div>
                          <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-text-muted">
                            <Link2
                              size={14}
                            />
                            Ýokarky
                            meýilnama
                          </label>

                          <select
                            value={
                              editParentTaskId
                            }
                            onChange={(
                              event,
                            ) =>
                              setEditParentTaskId(
                                event
                                  .target
                                  .value,
                              )
                            }
                            className="
                              h-11 w-full
                              rounded-xl
                              border border-border
                              bg-background
                              px-3 text-sm
                              text-text-primary
                              outline-none
                              focus:border-primary
                            "
                          >
                            <option value="">
                              Baglanyşyk
                              ýok
                            </option>

                            {availableParentTasks.map(
                              (
                                parentTask,
                              ) => (
                                <option
                                  key={
                                    parentTask.id
                                  }
                                  value={
                                    parentTask.id
                                  }
                                >
                                  {
                                    parentTask.title
                                  }
                                </option>
                              ),
                            )}
                          </select>

                          <p className="mt-2 text-xs leading-5 text-text-disabled">
                            Bu işi{" "}
                            {getParentLabel(
                              parentPeriod,
                            )}
                            daky uly işe
                            baglap
                            bilersiň.
                          </p>
                        </div>
                      )}

                      {/* EDIT ACTIONS */}
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={
                            cancelEditing
                          }
                          className="
                            inline-flex h-10
                            items-center gap-2
                            rounded-xl
                            border border-border
                            px-4
                            text-sm font-semibold
                            text-text-secondary
                            transition
                            hover:bg-surface-hover
                            hover:text-text-primary
                          "
                        >
                          <X size={16} />
                          Ýatyr
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            saveEditing(
                              task.id,
                            )
                          }
                          className="
                            inline-flex h-10
                            items-center gap-2
                            rounded-xl
                            bg-primary px-4
                            text-sm font-semibold
                            text-slate-950
                            transition
                            hover:bg-primary-hover
                          "
                        >
                          <Save
                            size={16}
                          />
                          Ýatda sakla
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* NORMAL TASK */
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          toggleTask(
                            task.id,
                          )
                        }
                        aria-label={
                          task.completed
                            ? "Işi aç"
                            : "Işi tamamla"
                        }
                        className={[
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition",
                          task.completed
                            ? "bg-success text-slate-950"
                            : "text-text-disabled hover:text-success",
                        ].join(" ")}
                      >
                        {task.completed ? (
                          <Check
                            size={15}
                            strokeWidth={
                              3
                            }
                          />
                        ) : (
                          <Circle
                            size={21}
                            strokeWidth={
                              1.8
                            }
                          />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={[
                            "font-medium",
                            task.completed
                              ? "text-text-muted line-through"
                              : "text-text-primary",
                          ].join(" ")}
                        >
                          {task.title}
                        </p>

                        {task.description && (
                          <p
                            className={[
                              "mt-2 text-sm leading-5",
                              task.completed
                                ? "text-text-disabled line-through"
                                : "text-text-muted",
                            ].join(
                              " ",
                            )}
                          >
                            {
                              task.description
                            }
                          </p>
                        )}

                        {linkedParentTask && (
                          <div
                            className="
                              mt-3 flex
                              items-start gap-2
                              rounded-lg
                              border border-info/15
                              bg-info/5
                              px-3 py-2
                            "
                          >
                            <Link2
                              size={14}
                              className="mt-0.5 shrink-0 text-info"
                            />

                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-text-disabled">
                                Bagly iş
                              </p>

                              <p className="mt-0.5 truncate text-xs font-medium text-info">
                                {
                                  linkedParentTask.title
                                }
                              </p>
                            </div>
                          </div>
                        )}

                        {task.completed && (
                          <span
                            className="
                              mt-3 inline-flex
                              rounded-full
                              bg-success/10
                              px-2.5 py-1
                              text-[11px]
                              font-semibold
                              text-success
                            "
                          >
                            Tamamlandy
                          </span>
                        )}
                      </div>

                      {/* ACTIONS */}
                      <div
                        className="
                          flex shrink-0
                          items-center gap-1
                          opacity-0
                          transition
                          group-hover:opacity-100
                          focus-within:opacity-100
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              task,
                            )
                          }
                          aria-label="Işi üýtget"
                          className="
                            flex h-8 w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-text-disabled
                            transition
                            hover:bg-primary/10
                            hover:text-primary
                          "
                        >
                          <Pencil
                            size={15}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteTask(
                              task.id,
                            )
                          }
                          aria-label="Işi poz"
                          className="
                            flex h-8 w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-text-disabled
                            transition
                            hover:bg-danger/10
                            hover:text-danger
                          "
                        >
                          <Trash2
                            size={16}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}