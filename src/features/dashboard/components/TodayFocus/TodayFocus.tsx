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
    label: "Soňrak edip bolýar",
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

  // Baş sahypada diňe şu gün döredilen işleri däl,
  // öňki günlerden galan tamamlanmadyk işleri hem görkezýäris.
  // Şeýlelikde, düýn/öňki gün meýilnama goşulan, ýöne ýerine
  // ýetirilmedik möhüm iş "ýitip gitmeýär".
  const todayTasks = tasks.filter((task) => {
    if (task.period !== "daily") {
      return false;
    }

    const isToday = task.dateKey === todayKey;
    const isOverdue =
      task.dateKey < todayKey && !task.completed;

    return isToday || isOverdue;
  });

  const completedToday = todayTasks.filter(
    (task) => task.completed,
  ).length;

  const unfinishedTasks = todayTasks.filter(
    (task) => !task.completed,
  );

  const urgentImportantTasks =
    unfinishedTasks.filter(
      (task) =>
        task.quadrant === "urgent-important",
    );

  const importantTasks = unfinishedTasks.filter(
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
          (completedToday / todayTasks.length) *
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
        rounded-3xl
        border border-border
        bg-surface
        p-5
        shadow-[0_16px_60px_rgba(0,0,0,0.12)]
        sm:p-6
      "
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute -right-20 -top-24
            h-56 w-56
            rounded-full
            bg-info/[0.05]
            blur-3xl
          "
        />

        <div
          className="
            absolute -bottom-24 left-[30%]
            h-52 w-52
            rounded-full
            bg-primary/[0.045]
            blur-3xl
          "
        />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Focus size={18} />

              <span className="text-sm font-semibold">
                Ilki şu işleri ýerine ýetir
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Ilki şu işleri ýerine ýetir
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Şu gün üçin iň möhüm işler
              möhümlik derejesine görä
              awtomatik saýlandy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {todayTasks.length > 0 && (
              <div
                className="
                  rounded-xl
                  border border-border
                  bg-background/35
                  px-4 py-3
                  text-right
                "
              >
                <p className="text-[11px] font-medium text-text-muted">
                  Günüň ýerine ýetirilişi
                </p>

                <p className="mt-1 text-lg font-bold text-text-primary">
                  {completedToday} /{" "}
                  {todayTasks.length}
                </p>
              </div>
            )}

            <Link
              to={ROUTES.planner}
              className="
                group inline-flex h-10
                items-center gap-2
                rounded-xl
                border border-border
                bg-background/35
                px-4
                text-sm font-semibold
                text-text-primary
                transition-all duration-200
                hover:-translate-y-0.5
                hover:border-primary/25
                hover:bg-surface-hover
              "
            >
              Meýilnama

              <ArrowRight
                size={16}
                className="
                  text-primary
                  transition-transform duration-200
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>
        </div>

        {todayTasks.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-xs text-text-muted">
                Günlük ösüş
              </span>

              <span className="text-xs font-semibold text-primary">
                {completionRate}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-background">
              <motion.div
                initial={{
                  width: 0,
                }}
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
              mt-6
              grid items-center gap-5
              rounded-2xl
              border border-dashed border-border
              bg-background/25
              p-5
              sm:grid-cols-[auto_1fr_auto]
              sm:p-6
            "
          >
            <div
              className="
                flex h-12 w-12
                items-center justify-center
                rounded-xl
                border border-success/20
                bg-success/10
                text-success
              "
            >
              <CheckCircle2 size={22} />
            </div>

            <div>
              <p className="font-bold text-text-primary">
                Şu gün üçin garaşýan möhüm
                iş ýok
              </p>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                Täze günlük iş goşup, günüň
                esasy ugruny öňünden
                kesgitläp bilersiň.
              </p>
            </div>

            <Link
              to={ROUTES.planner}
              className="
                inline-flex h-10
                items-center
                justify-center gap-2
                rounded-xl
                bg-primary
                px-4
                text-sm font-semibold
                text-slate-950
                transition-all duration-200
                hover:-translate-y-0.5
                hover:bg-primary-hover
              "
            >
              Täze iş goş
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-3 xl:grid-cols-3">
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
                      whileHover={{
                        y: -3,
                        transition: {
                          duration: 0.18,
                        },
                      }}
                      className={[
                        "group relative overflow-hidden rounded-2xl border p-4 transition-colors duration-200",
                        isPrimary
                          ? "border-primary/25 bg-background/45"
                          : "border-border bg-background/30 hover:border-primary/15",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b opacity-70",
                          priority.accent,
                        ].join(" ")}
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={[
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
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
                              "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold",
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
                              {
                                task.description
                              }
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
                            aria-label="Işi tamamla"
                            className="
                              group/check inline-flex
                              items-center gap-2
                              text-xs font-semibold
                              text-text-muted
                              transition
                              hover:text-success
                            "
                          >
                            <Circle
                              size={17}
                              className="
                                transition-transform
                                group-hover/check:scale-110
                              "
                            />

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
                  mt-4
                  flex flex-col gap-4
                  rounded-2xl
                  border border-warning/20
                  bg-warning/[0.04]
                  p-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className="
                      flex h-10 w-10
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      border border-warning/20
                      bg-warning/10
                      text-warning
                    "
                  >
                    <Sparkles size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-warning">
                      Soňra şu möhüm işi et
                    </p>

                    <p className="mt-1 font-bold text-text-primary">
                      {secondaryTask.title}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Möhüm, ýöne häzir
                      gyssagly däl.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toggleTask(
                      secondaryTask.id,
                    )
                  }
                  className="
                    inline-flex h-10
                    shrink-0
                    items-center
                    justify-center gap-2
                    rounded-xl
                    border border-warning/20
                    bg-warning/10
                    px-4
                    text-xs font-semibold
                    text-warning
                    transition
                    hover:bg-warning/15
                  "
                >
                  <Circle size={16} />
                  Tamamla
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
}