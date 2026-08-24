import {
  CheckCircle2,
  CircleAlert,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

import { usePlannerStore } from "../../../../store/plannerStore";
import { getPlannerDateKey } from "../../../planner/utils/plannerDate";



const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      delay: index * 0.06,
      ease: "easeOut" as const,
    },
  }),
};

export default function TodayStats() {
  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const todayKey = getPlannerDateKey(
  new Date(),
  "daily",
);

  const todayTasks = tasks.filter(
    (task) =>
      task.period === "daily" &&
      task.dateKey === todayKey,
  );

  const completedTasks =
    todayTasks.filter(
      (task) => task.completed,
    ).length;

  const urgentImportantTasks =
  tasks.filter(
    (task) =>
      task.period === "daily" &&
      !task.completed &&
      task.quadrant === "urgent-important" &&
      task.dateKey <= todayKey,
  ).length;

  const totalTasks =
    todayTasks.length;

  const progress =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100,
        )
      : 0;

  const remainingTasks =
    Math.max(
      totalTasks - completedTasks,
      0,
    );

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {/* TODAY TASKS */}
      <motion.article
        custom={0}
        variants={cardAnimation}
        initial="hidden"
        animate="visible"
        whileHover={{
          y: -3,
        }}
        className="
          group relative overflow-hidden
          rounded-2xl
          border border-border
          bg-surface
          p-5
          shadow-[var(--app-shadow)]
          transition-colors duration-200
          hover:border-info/25
        "
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-info/[0.06] blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-muted">
              Şu günki işler
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
              {totalTasks}
            </p>
          </div>

          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-info/15
              bg-info/10
              text-info
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            <ListTodo size={19} />
          </div>
        </div>

        <div className="relative mt-5 flex items-center justify-between border-t border-border/70 pt-4">
          <span className="text-xs text-text-muted">
            Garaşýan işler
          </span>

          <span className="text-xs font-bold text-info">
            {remainingTasks}
          </span>
        </div>
      </motion.article>

      {/* COMPLETED */}
      <motion.article
        custom={1}
        variants={cardAnimation}
        initial="hidden"
        animate="visible"
        whileHover={{
          y: -3,
        }}
        className="
          group relative overflow-hidden
          rounded-2xl
          border border-border
          bg-surface
          p-5
          shadow-[var(--app-shadow)]
          transition-colors duration-200
          hover:border-success/25
        "
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-success/[0.06] blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-muted">
              Tamamlanan
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-success">
              {completedTasks}
            </p>
          </div>

          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-success/15
              bg-success/10
              text-success
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            <CheckCircle2 size={19} />
          </div>
        </div>

        <div className="relative mt-5 flex items-center justify-between border-t border-border/70 pt-4">
          <span className="text-xs text-text-muted">
            Şu gün
          </span>

          <span className="text-xs font-semibold text-success">
            {totalTasks === 0
              ? "Başlanmady"
              : `${completedTasks}/${totalTasks}`}
          </span>
        </div>
      </motion.article>

      {/* URGENT */}
      <motion.article
        custom={2}
        variants={cardAnimation}
        initial="hidden"
        animate="visible"
        whileHover={{
          y: -3,
        }}
        className="
          group relative overflow-hidden
          rounded-2xl
          border border-border
          bg-surface
          p-5
          shadow-[var(--app-shadow)]
          transition-colors duration-200
          hover:border-danger/25
        "
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-danger/[0.06] blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-muted">
              Möhüm + gyssagly
            </p>

            <p
              className={[
                "mt-2 text-3xl font-bold tracking-tight",
                urgentImportantTasks > 0
                  ? "text-danger"
                  : "text-text-primary",
              ].join(" ")}
            >
              {urgentImportantTasks}
            </p>
          </div>

          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-danger/15
              bg-danger/10
              text-danger
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            <CircleAlert size={19} />
          </div>
        </div>

        <div className="relative mt-5 flex items-center justify-between border-t border-border/70 pt-4">
          <span className="text-xs text-text-muted">
            Ilki edilmeli
          </span>

          <span
            className={[
              "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              urgentImportantTasks > 0
                ? "border-danger/20 bg-danger/10 text-danger"
                : "border-success/20 bg-success/10 text-success",
            ].join(" ")}
          >
            {urgentImportantTasks > 0
              ? "Üns gerek"
              : "Gyssagly iş ýok"}
          </span>
        </div>
      </motion.article>

      {/* DAILY PROGRESS */}
      <motion.article
        custom={3}
        variants={cardAnimation}
        initial="hidden"
        animate="visible"
        whileHover={{
          y: -3,
        }}
        className="
          group relative overflow-hidden
          rounded-2xl
          border border-border
          bg-surface
          p-5
          shadow-[var(--app-shadow)]
          transition-colors duration-200
          hover:border-primary/25
        "
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/[0.07] blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-muted">
              Şu günki ösüş
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-primary">
              {progress}%
            </p>
          </div>

          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-primary/15
              bg-primary/10
              text-primary
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            <TrendingUp size={19} />
          </div>
        </div>

        <div className="relative mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-text-muted">
              Ýerine ýetirilişi
            </span>

            <span className="text-xs font-semibold text-primary">
              {completedTasks}/{totalTasks}
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-background">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.75,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>
      </motion.article>
    </section>
  );
}