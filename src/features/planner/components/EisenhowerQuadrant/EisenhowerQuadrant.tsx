import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
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
  if (period === "daily") return "weekly";
  if (period === "weekly") return "monthly";
  if (period === "monthly") return "yearly";

  return null;
}

function getParentLabel(period: PlannerPeriod) {
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

  if (quadrant === "important-not-urgent") {
    return {
      border: "border-warning/20",
      background: "bg-warning/[0.025]",
      badge: "bg-warning/10 text-warning",
      accent: "text-warning",
    };
  }

  if (quadrant === "urgent-not-important") {
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
    badge: "bg-background/70 text-text-muted",
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

  if (quadrant === "important-not-urgent") {
    return {
      name: "Meýilleşdirmeli",
      type: "Möhüm + gyssagly däl",
    };
  }

  if (quadrant === "urgent-not-important") {
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

  const [isOpen, setIsOpen] =
    useState(tasks.length > 0);

  const [
    editingTaskId,
    setEditingTaskId,
  ] = useState<string | null>(null);

  const [editTitle, setEditTitle] =
    useState("");

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

  useEffect(() => {
    if (tasks.length > 0) {
      setIsOpen(true);
    }
  }, [tasks.length]);

  function startEditing(task: PlannerTask) {
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

  function saveEditing(taskId: string) {
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

    moveTask(taskId, editQuadrant);

    cancelEditing();
  }

  return (
    <section
      className={[
        `
          overflow-hidden
          rounded-[16px]
          border
          transition-all
          duration-200

          xl:flex
          xl:min-h-[300px]
          xl:flex-col
          xl:rounded-2xl
          xl:p-5
        `,
        quadrantStyle.border,
        quadrantStyle.background,
      ].join(" ")}
    >
      {/* HEADER */}
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
          gap-2.5
          p-3
          text-left

          xl:pointer-events-none
          xl:items-start
          xl:gap-3
          xl:border-b
          xl:border-border/70
          xl:p-0
          xl:pb-4
        "
      >
        <span
          className={[
            `
              flex h-8 min-w-8
              shrink-0 items-center
              justify-center
              rounded-lg
              px-2
              text-[11px]
              font-bold

              xl:h-9
              xl:min-w-9
              xl:text-sm
            `,
            quadrantStyle.badge,
          ].join(" ")}
        >
          {romanNumber}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="
                truncate
                text-[12px]
                font-semibold
                text-text-primary
                sm:text-sm
                xl:text-lg
              "
            >
              {displayText.name}
            </h3>

            <span
              className={[
                `
                  inline-flex h-5 min-w-5
                  items-center justify-center
                  rounded-full
                  px-1.5
                  text-[9px]
                  font-bold
                  xl:text-[10px]
                `,
                quadrantStyle.badge,
              ].join(" ")}
            >
              {tasks.length}
            </span>
          </div>

          <p
            className={[
              `
                mt-0.5
                truncate
                text-[9px]
                font-medium
                sm:text-[10px]
                xl:mt-1
                xl:text-xs
              `,
              quadrantStyle.accent,
            ].join(" ")}
          >
            {displayText.type}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={[
            `
              shrink-0
              text-text-muted
              transition-transform
              duration-200
              xl:hidden
            `,
            isOpen
              ? "rotate-180"
              : "",
          ].join(" ")}
        />
      </button>

      {/* TASKS */}
      <div
        className={[
          isOpen
            ? "block"
            : "hidden",
          `
            border-t
            border-border/60
            px-3
            pb-3
            pt-2.5

            xl:block
            xl:flex-1
            xl:border-t-0
            xl:px-0
            xl:pb-0
            xl:pt-4
          `,
        ].join(" ")}
      >
        {tasks.length === 0 ? (
          <div
            className="
              flex min-h-16
              items-center justify-center
              rounded-lg
              border border-dashed
              border-border/80
              bg-background/15
              p-3
              text-center

              xl:min-h-32
              xl:rounded-xl
              xl:p-5
            "
          >
            <p className="text-[10px] text-text-muted xl:text-sm">
              Bu bölümde häzir iş ýok.
            </p>
          </div>
        ) : (
          <div className="space-y-2 xl:space-y-3">
            {tasks.map((task) => {
              const isEditing =
                editingTaskId === task.id;

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
                      (parentTask) =>
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
                      (parentTask) =>
                        parentTask.id ===
                        task.parentTaskId,
                    )
                  : undefined;

              return (
                <article
                  key={task.id}
                  className={[
                    `
                      group
                      rounded-[10px]
                      border
                      p-2.5
                      transition-all
                      duration-200

                      xl:rounded-xl
                      xl:p-4
                    `,
                    task.completed
                      ? "border-success/15 bg-success/[0.035]"
                      : "border-border bg-background/35 hover:border-border-strong",
                  ].join(" ")}
                >
                  {isEditing ? (
                    <div className="space-y-2.5 xl:space-y-4">
                      {/* TITLE */}
                      <div>
                        <label className="mb-1 block text-[9px] font-semibold text-text-muted xl:mb-2 xl:text-xs">
                          Işiň ady
                        </label>

                        <input
                          type="text"
                          value={editTitle}
                          onChange={(event) =>
                            setEditTitle(
                              event.target
                                .value,
                            )
                          }
                          className="
                            h-9 w-full
                            rounded-lg
                            border border-border
                            bg-background
                            px-2.5
                            text-[11px]
                            text-text-primary
                            outline-none
                            transition
                            focus:border-primary

                            xl:h-11
                            xl:rounded-xl
                            xl:px-3
                            xl:text-sm
                          "
                        />
                      </div>

                      {/* DESCRIPTION */}
                      <div>
                        <label className="mb-1 block text-[9px] font-semibold text-text-muted xl:mb-2 xl:text-xs">
                          Düşündiriş
                        </label>

                        <textarea
                          value={
                            editDescription
                          }
                          onChange={(event) =>
                            setEditDescription(
                              event.target
                                .value,
                            )
                          }
                          placeholder="Gerek bolsa gysga düşündiriş ýaz..."
                          rows={2}
                          className="
                            w-full resize-none
                            rounded-lg
                            border border-border
                            bg-background
                            px-2.5 py-2
                            text-[11px]
                            text-text-primary
                            outline-none
                            placeholder:text-text-disabled
                            focus:border-primary

                            xl:rounded-xl
                            xl:px-3
                            xl:py-3
                            xl:text-sm
                          "
                        />
                      </div>

                      {/* IMPORTANCE */}
                      <div>
                        <label className="mb-1 block text-[9px] font-semibold text-text-muted xl:mb-2 xl:text-xs">
                          Möhümlik derejesi
                        </label>

                        <select
                          value={
                            editQuadrant
                          }
                          onChange={(event) =>
                            setEditQuadrant(
                              event.target
                                .value as EisenhowerQuadrantType,
                            )
                          }
                          className="
                            h-9 w-full
                            rounded-lg
                            border border-border
                            bg-background
                            px-2.5
                            text-[10px]
                            text-text-primary
                            outline-none
                            focus:border-primary

                            xl:h-11
                            xl:rounded-xl
                            xl:px-3
                            xl:text-sm
                          "
                        >
                          <option value="urgent-important">
                            🔴 Häzir etmeli
                          </option>

                          <option value="important-not-urgent">
                            🟡 Meýilleşdirmeli
                          </option>

                          <option value="urgent-not-important">
                            🔵 Tabşyrmaly /
                            azaltmaly
                          </option>

                          <option value="not-urgent-not-important">
                            ⚪ Bes etmeli
                          </option>
                        </select>
                      </div>

                      {/* PARENT */}
                      {parentPeriod && (
                        <div>
                          <label className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold text-text-muted xl:mb-2 xl:gap-2 xl:text-xs">
                            <Link2 size={12} />
                            Ýokarky meýilnama
                          </label>

                          <select
                            value={
                              editParentTaskId
                            }
                            onChange={(event) =>
                              setEditParentTaskId(
                                event.target
                                  .value,
                              )
                            }
                            className="
                              h-9 w-full
                              rounded-lg
                              border border-border
                              bg-background
                              px-2.5
                              text-[10px]
                              text-text-primary
                              outline-none
                              focus:border-primary

                              xl:h-11
                              xl:rounded-xl
                              xl:px-3
                              xl:text-sm
                            "
                          >
                            <option value="">
                              Baglanyşyk ýok
                            </option>

                            {availableParentTasks.map(
                              (parentTask) => (
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

                          <p className="mt-1.5 text-[9px] leading-4 text-text-disabled xl:mt-2 xl:text-xs xl:leading-5">
                            Bu işi{" "}
                            {getParentLabel(
                              parentPeriod,
                            )}
                            daky uly işe
                            baglap bilersiň.
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
                            inline-flex h-9
                            items-center gap-1.5
                            rounded-lg
                            border border-border
                            px-3
                            text-[10px]
                            font-semibold
                            text-text-secondary
                            transition
                            hover:bg-surface-hover
                            hover:text-text-primary

                            xl:h-10
                            xl:gap-2
                            xl:rounded-xl
                            xl:px-4
                            xl:text-sm
                          "
                        >
                          <X size={14} />
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
                            inline-flex h-9
                            items-center gap-1.5
                            rounded-lg
                            bg-primary
                            px-3
                            text-[10px]
                            font-semibold
                            text-slate-950
                            transition
                            hover:bg-primary-hover

                            xl:h-10
                            xl:gap-2
                            xl:rounded-xl
                            xl:px-4
                            xl:text-sm
                          "
                        >
                          <Save size={14} />
                          Ýatda sakla
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* NORMAL TASK */
                    <div className="flex items-start gap-2 xl:gap-3">
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
                          `
                            mt-0.5 flex
                            h-6 w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            transition
                          `,
                          task.completed
                            ? "bg-success text-slate-950"
                            : "text-text-disabled hover:text-success",
                        ].join(" ")}
                      >
                        {task.completed ? (
                          <Check
                            size={14}
                            strokeWidth={3}
                          />
                        ) : (
                          <Circle
                            size={19}
                            strokeWidth={1.8}
                          />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={[
                            `
                              text-[11px]
                              font-medium
                              leading-4
                              xl:text-base
                              xl:leading-normal
                            `,
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
                              `
                                mt-1
                                text-[9px]
                                leading-4
                                xl:mt-2
                                xl:text-sm
                                xl:leading-5
                              `,
                              task.completed
                                ? "text-text-disabled line-through"
                                : "text-text-muted",
                            ].join(" ")}
                          >
                            {
                              task.description
                            }
                          </p>
                        )}

                        {linkedParentTask && (
                          <div
                            className="
                              mt-2 flex
                              items-start gap-1.5
                              rounded-lg
                              border border-info/15
                              bg-info/5
                              px-2 py-1.5

                              xl:mt-3
                              xl:gap-2
                              xl:px-3
                              xl:py-2
                            "
                          >
                            <Link2
                              size={12}
                              className="mt-0.5 shrink-0 text-info xl:h-[14px] xl:w-[14px]"
                            />

                            <div className="min-w-0">
                              <p className="text-[8px] font-semibold text-text-disabled xl:text-[11px]">
                                Bagly iş
                              </p>

                              <p className="mt-0.5 truncate text-[9px] font-medium text-info xl:text-xs">
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
                              mt-2 inline-flex
                              rounded-full
                              bg-success/10
                              px-2 py-0.5
                              text-[8px]
                              font-semibold
                              text-success

                              xl:mt-3
                              xl:px-2.5
                              xl:py-1
                              xl:text-[11px]
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
                          items-center gap-0.5

                          sm:gap-1
                          xl:opacity-0
                          xl:transition
                          xl:group-hover:opacity-100
                          xl:focus-within:opacity-100
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
                            flex h-7 w-7
                            items-center
                            justify-center
                            rounded-lg
                            text-text-disabled
                            transition
                            hover:bg-primary/10
                            hover:text-primary

                            xl:h-8
                            xl:w-8
                          "
                        >
                          <Pencil size={13} />
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
                            flex h-7 w-7
                            items-center
                            justify-center
                            rounded-lg
                            text-text-disabled
                            transition
                            hover:bg-danger/10
                            hover:text-danger

                            xl:h-8
                            xl:w-8
                          "
                        >
                          <Trash2 size={14} />
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