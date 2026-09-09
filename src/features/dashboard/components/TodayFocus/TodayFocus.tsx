import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  Focus,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../../app/routePaths";
import { usePlannerStore } from "../../../../store/plannerStore";
import { getPlannerDateKey } from "../../../planner/utils/plannerDate";

function getPriorityMeta(quadrant: string) {
  if (quadrant === "urgent-important") {
    return {
      label: "Möhüm + gyssagly",
      badge:
        "border-danger/20 bg-danger/10 text-danger",
      icon:
        "border-danger/15 bg-danger/10 text-danger",
      accent:
        "from-danger/20 via-danger/5 to-transparent",
    };
  }

  if (quadrant === "important-not-urgent") {
    return {
      label: "Möhüm",
      badge:
        "border-warning/20 bg-warning/10 text-warning",
      icon:
        "border-warning/15 bg-warning/10 text-warning",
      accent:
        "from-warning/20 via-warning/5 to-transparent",
    };
  }

  if (quadrant === "urgent-not-important") {
    return {
      label: "Gyssagly",
      badge:
        "border-info/20 bg-info/10 text-info",
      icon:
        "border-info/15 bg-info/10 text-info",
      accent:
        "from-info/20 via-info/5 to-transparent",
    };
  }

  return {
    label: "Soňrak",
    badge:
      "border-border bg-background/50 text-text-muted",
    icon:
      "border-primary/15 bg-primary/10 text-primary",
    accent:
      "from-primary/15 via-primary/5 to-transparent",
  };
}

export default function TodayFocus() {
  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const toggleTask = usePlannerStore(
    (state) => state.toggleTask,
  );

  const todayKey = getPlannerDateKey(
    new Date(),
    "daily",
  );

  const todayTasks = tasks.filter((task) => {
    if (task.period !== "daily") {
      return false;
    }

    const isToday =
      task.dateKey === todayKey;

    const isOverdue =
      task.dateKey < todayKey &&
      !task.completed;

    return isToday || isOverdue;
  });

  const completedToday =
    todayTasks.filter(
      (task) => task.completed,
    ).length;

  const unfinishedTasks =
    todayTasks.filter(
      (task) => !task.completed,
    );

  const urgentImportantTasks =
    unfinishedTasks.filter(
      (task) =>
        task.quadrant ===
        "urgent-important",
    );

  const importantTasks =
    unfinishedTasks.filter(
      (task) =>
        task.quadrant ===
        "important-not-urgent",
    );

  const focusTasks =
    urgentImportantTasks.length > 0
      ? urgentImportantTasks
      : importantTasks;

  const secondaryTask =
    urgentImportantTasks.length > 0
      ? importantTasks[0] ?? null
      : null;

  const completionRate =
    todayTasks.length > 0
      ? Math.round(
          (completedToday /
            todayTasks.length) *
            100,
        )
      : 0;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="
        relative overflow-hidden
        rounded-[20px]
        border border-border
        bg-surface
        p-4
        shadow-[0_16px_60px_rgba(0,0,0,0.12)]
        sm:rounded-3xl
        sm:p-5
        lg:p-6
      "
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute -right-20 -top-24
            h-44 w-44
            rounded-full
            bg-info/[0.05]
            blur-3xl
            sm:h-56 sm:w-56
          "
        />

        <div
          className="
            absolute -bottom-24 left-[30%]
            hidden h-52 w-52
            rounded-full
            bg-primary/[0.045]
            blur-3xl
            sm:block
          "
        />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-primary sm:gap-2">
              <Focus
                size={15}
                className="sm:h-[18px] sm:w-[18px]"
              />

              <span className="text-[10px] font-semibold sm:text-sm">
                Şu günki fokus
              </span>
            </div>

            <h2
              className="
                mt-1
                text-[17px]
                font-bold
                tracking-tight
                text-text-primary
                sm:mt-2
                sm:text-2xl
                lg:text-3xl
              "
            >
              Ilki şu işleri ýerine ýetir
            </h2>

            <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-text-muted sm:block">
              Şu gün üçin iň möhüm işler
              möhümlik derejesine görä
              awtomatik saýlandy.
            </p>
          </div>

          <Link
            to={ROUTES.planner}
            className="
              group inline-flex
              h-8 shrink-0
              items-center gap-1
              rounded-lg
              border border-border
              bg-background/35
              px-2.5
              text-[10px] font-semibold
              text-text-primary
              transition-all duration-200
              hover:border-primary/25
              hover:bg-surface-hover
              sm:h-10
              sm:gap-2
              sm:rounded-xl
              sm:px-4
              sm:text-sm
            "
          >
            Meýilnama

            <ArrowRight
              size={13}
              className="
                text-primary
                transition-transform
                group-hover:translate-x-0.5
                sm:h-4 sm:w-4
              "
            />
          </Link>
        </div>

        {/* PROGRESS */}
        {todayTasks.length > 0 && (
          <div
            className="
              mt-3
              rounded-xl
              border border-border
              bg-background/30
              px-3 py-2.5
              sm:mt-5
              sm:bg-transparent
              sm:px-0 sm:py-0
              sm:border-0
            "
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-text-muted sm:text-xs">
                Günlük ösüş
              </span>

              <span className="text-[10px] font-semibold text-primary sm:text-xs">
                {completedToday}/
                {todayTasks.length}
                {" · "}
                {completionRate}%
              </span>
            </div>

            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-background sm:mt-2 sm:h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${completionRate}%`,
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>
        )}

        {/* EMPTY */}
        {focusTasks.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.35,
              delay: 0.1,
            }}
            className="
              mt-3
              flex items-center
              gap-3
              rounded-xl
              border border-dashed border-border
              bg-background/25
              p-3
              sm:mt-6
              sm:grid
              sm:grid-cols-[auto_1fr_auto]
              sm:gap-5
              sm:rounded-2xl
              sm:p-6
            "
          >
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-lg
                border border-success/20
                bg-success/10
                text-success
                sm:h-12 sm:w-12
                sm:rounded-xl
              "
            >
              <CheckCircle2
                size={17}
                className="sm:h-[22px] sm:w-[22px]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold text-text-primary sm:text-base">
                Möhüm iş galmady
              </p>

              <p className="mt-0.5 truncate text-[9px] text-text-muted sm:mt-1 sm:text-sm sm:leading-6">
                Täze günlük iş goşup
                bilersiň.
              </p>
            </div>

            <Link
              to={ROUTES.planner}
              className="
                inline-flex h-8
                shrink-0 items-center
                justify-center gap-1
                rounded-lg
                bg-primary
                px-2.5
                text-[10px] font-semibold
                text-slate-950
                transition
                hover:bg-primary-hover
                sm:h-10
                sm:gap-2
                sm:rounded-xl
                sm:px-4
                sm:text-sm
              "
            >
              Täze iş
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mt-3 space-y-2 sm:mt-6 sm:grid sm:grid-cols-1 sm:gap-3 sm:space-y-0 xl:grid-cols-3">
              {focusTasks.map(
                (task, index) => {
                  const priority =
                    getPriorityMeta(
                      task.quadrant,
                    );

                  const isPrimary =
                    index === 0;

                  return (
                    <motion.article
                      key={task.id}
                      initial={{
                        opacity: 0,
                        y: 14,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.35,
                        delay:
                          0.08 +
                          index * 0.06,
                      }}
                      className={[
                        `
                          relative overflow-hidden
                          rounded-xl border
                          p-3
                          sm:rounded-2xl
                          sm:p-4
                        `,
                        isPrimary
                          ? "border-primary/25 bg-background/45"
                          : "border-border bg-background/30",
                      ].join(" ")}
                    >
                      {/* MOBILE */}
                      <div className="flex items-center gap-2.5 sm:hidden">
                        <div
                          className={[
                            `
                              flex h-8 w-8
                              shrink-0 items-center
                              justify-center
                              rounded-lg border
                            `,
                            priority.icon,
                          ].join(" ")}
                        >
                          {isPrimary ? (
                            <Target size={14} />
                          ) : task.quadrant ===
                            "urgent-important" ? (
                            <Clock3 size={14} />
                          ) : (
                            <Sparkles size={14} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-[11px] font-bold text-text-primary">
                              {task.title}
                            </p>

                            <span
                              className={[
                                `
                                  shrink-0 rounded-full
                                  border px-1.5 py-0.5
                                  text-[7px] font-semibold
                                `,
                                priority.badge,
                              ].join(" ")}
                            >
                              {priority.label}
                            </span>
                          </div>

                          {task.description && (
                            <p className="mt-0.5 truncate text-[8px] text-text-muted">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleTask(
                              task.id,
                            )
                          }
                          aria-label="Işi tamamla"
                          className="
                            flex h-8 w-8
                            shrink-0 items-center
                            justify-center
                            rounded-lg
                            border border-border
                            text-text-muted
                            transition
                            hover:border-success/25
                            hover:text-success
                          "
                        >
                          <Circle size={15} />
                        </button>
                      </div>

                      {/* DESKTOP */}
                      <div className="relative z-10 hidden sm:block">
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={[
                              `
                                flex h-10 w-10
                                shrink-0 items-center
                                justify-center
                                rounded-xl border
                              `,
                              priority.icon,
                            ].join(" ")}
                          >
                            {isPrimary ? (
                              <Target size={18} />
                            ) : task.quadrant ===
                              "urgent-important" ? (
                              <Clock3 size={18} />
                            ) : (
                              <Sparkles size={18} />
                            )}
                          </div>

                          <span className="text-xs font-bold text-text-disabled">
                            0{index + 1}
                          </span>
                        </div>

                        <div className="mt-5">
                          <span
                            className={[
                              `
                                inline-flex
                                rounded-full border
                                px-2.5 py-1
                                text-[10px] font-semibold
                              `,
                              priority.badge,
                            ].join(" ")}
                          >
                            {priority.label}
                          </span>

                          <h3 className="mt-3 line-clamp-2 text-base font-bold leading-6 text-text-primary">
                            {task.title}
                          </h3>

                          {task.description && (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-text-muted">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-5 border-t border-border/70 pt-4">
                          <button
                            type="button"
                            onClick={() =>
                              toggleTask(
                                task.id,
                              )
                            }
                            className="
                              inline-flex
                              items-center gap-2
                              text-xs font-semibold
                              text-text-muted
                              transition
                              hover:text-success
                            "
                          >
                            <Circle size={17} />
                            Tamamla
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                },
              )}
            </div>

            {secondaryTask && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.18,
                }}
                className="
                  mt-2
                  flex items-center
                  gap-2.5
                  rounded-xl
                  border border-warning/20
                  bg-warning/[0.04]
                  p-3
                  sm:mt-4
                  sm:gap-4
                  sm:rounded-2xl
                  sm:p-4
                "
              >
                <div
                  className="
                    flex h-8 w-8
                    shrink-0 items-center
                    justify-center
                    rounded-lg
                    border border-warning/20
                    bg-warning/10
                    text-warning
                    sm:h-10 sm:w-10
                    sm:rounded-xl
                  "
                >
                  <Sparkles
                    size={14}
                    className="sm:h-[18px] sm:w-[18px]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-semibold text-warning sm:text-xs">
                    Soňra şu möhüm işi et
                  </p>

                  <p className="mt-0.5 truncate text-[11px] font-bold text-text-primary sm:mt-1 sm:text-base">
                    {secondaryTask.title}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toggleTask(
                      secondaryTask.id,
                    )
                  }
                  aria-label="Işi tamamla"
                  className="
                    flex h-8 w-8
                    shrink-0 items-center
                    justify-center
                    rounded-lg
                    border border-warning/20
                    bg-warning/10
                    text-warning
                    sm:h-10 sm:w-auto
                    sm:gap-2
                    sm:rounded-xl
                    sm:px-4
                    sm:text-xs
                    sm:font-semibold
                  "
                >
                  <Circle size={15} />

                  <span className="hidden sm:inline">
                    Tamamla
                  </span>
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
}