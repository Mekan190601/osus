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
    y: 10,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      delay: index * 0.05,
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

  const completedTasks = todayTasks.filter(
    (task) => task.completed,
  ).length;

  const urgentImportantTasks = tasks.filter(
    (task) =>
      task.period === "daily" &&
      !task.completed &&
      task.quadrant === "urgent-important" &&
      task.dateKey <= todayKey,
  ).length;

  const totalTasks = todayTasks.length;

  const progress =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100,
        )
      : 0;

  const remainingTasks = Math.max(
    totalTasks - completedTasks,
    0,
  );

  return (
    <section
      className="
        grid grid-cols-2
        gap-2
        sm:gap-3
        xl:grid-cols-4
        xl:gap-4
      "
    >
      {/* TODAY TASKS */}
      <motion.article
        custom={0}
        variants={cardAnimation}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2 }}
        className="
          group relative min-w-0 overflow-hidden
          rounded-[14px]
          border border-border
          bg-surface
          p-3
          shadow-[var(--app-shadow)]
          transition-colors duration-200
          hover:border-info/25
          sm:rounded-2xl
          sm:p-4
          lg:p-5
        "
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-info/[0.06] blur-2xl" />

        <div className="relative flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium text-text-muted sm:text-xs lg:text-sm">
              Şu günki işler
            </p>

            <p className="mt-1 text-[23px] font-bold leading-none tracking-tight text-text-primary sm:text-2xl lg:mt-2 lg:text-3xl">
              {totalTasks}
            </p>
          </div>

          <div
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              border border-info/15
              bg-info/10
              text-info
              sm:h-9 sm:w-9
              lg:h-11 lg:w-11
              lg:rounded-xl
            "
          >
            <ListTodo
              size={15}
              className="lg:h-[19px] lg:w-[19px]"
            />
          </div>
        </div>

        <div className="relative mt-2.5 flex items-center justify-between border-t border-border/70 pt-2 sm:mt-3 lg:mt-5 lg:pt-4">
          <span className="truncate text-[9px] text-text-muted sm:text-[10px] lg:text-xs">
            Garaşýan
          </span>

          <span className="text-[9px] font-bold text-info sm:text-[10px] lg:text-xs">
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
        whileHover={{ y: -2 }}
        className="
          group relative min-w-0 overflow-hidden
          rounded-[14px]
          border border-border
          bg-surface
          p-3
          shadow-[var(--app-shadow)]
          transition-colors duration-200
          hover:border-success/25
          sm:rounded-2xl
          sm:p-4
          lg:p-5
        "
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-success/[0.06] blur-2xl" />

        <div className="relative flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium text-text-muted sm:text-xs lg:text-sm">
              Tamamlanan
            </p>

            <p className="mt-1 text-[23px] font-bold leading-none tracking-tight text-success sm:text-2xl lg:mt-2 lg:text-3xl">
              {completedTasks}
            </p>
          </div>

          <div
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              border border-success/15
              bg-success/10
              text-success
              sm:h-9 sm:w-9
              lg:h-11 lg:w-11
              lg:rounded-xl
            "
          >
            <CheckCircle2
              size={15}
              className="lg:h-[19px] lg:w-[19px]"
            />
          </div>
        </div>

        <div className="relative mt-2.5 flex items-center justify-between border-t border-border/70 pt-2 sm:mt-3 lg:mt-5 lg:pt-4">
          <span className="text-[9px] text-text-muted sm:text-[10px] lg:text-xs">
            Şu gün
          </span>

          <span className="text-[9px] font-semibold text-success sm:text-[10px] lg:text-xs">
            {completedTasks}/{totalTasks}
          </span>
        </div>
      </motion.article>

      {/* URGENT */}
      <motion.article
        custom={2}
        variants={cardAnimation}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2 }}
        className="
          group relative min-w-0 overflow-hidden
          rounded-[14px]
          border border-border
          bg-surface
          p-3
          shadow-[var(--app-shadow)]
          transition-colors duration-200
          hover:border-danger/25
          sm:rounded-2xl
          sm:p-4
          lg:p-5
        "
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-danger/[0.06] blur-2xl" />

        <div className="relative flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium text-text-muted sm:text-xs lg:text-sm">
              Möhüm + gyssagly
            </p>

            <p
              className={[
                "mt-1 text-[23px] font-bold leading-none tracking-tight sm:text-2xl lg:mt-2 lg:text-3xl",
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
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              border border-danger/15
              bg-danger/10
              text-danger
              sm:h-9 sm:w-9
              lg:h-11 lg:w-11
              lg:rounded-xl
            "
          >
            <CircleAlert
              size={15}
              className="lg:h-[19px] lg:w-[19px]"
            />
          </div>
        </div>

        <div className="relative mt-2.5 flex items-center justify-between gap-1 border-t border-border/70 pt-2 sm:mt-3 lg:mt-5 lg:pt-4">
          <span className="truncate text-[9px] text-text-muted sm:text-[10px] lg:text-xs">
            Ilki edilmeli
          </span>

          <span
            className={[
              "shrink-0 text-[8px] font-semibold sm:text-[9px] lg:rounded-full lg:border lg:px-2 lg:py-0.5 lg:text-[10px]",
              urgentImportantTasks > 0
                ? "text-danger lg:border-danger/20 lg:bg-danger/10"
                : "text-success lg:border-success/20 lg:bg-success/10",
            ].join(" ")}
          >
            {urgentImportantTasks > 0
              ? "Üns gerek"
              : "Ýok"}
          </span>
        </div>
      </motion.article>

      {/* DAILY PROGRESS */}
      <motion.article
        custom={3}
        variants={cardAnimation}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2 }}
        className="
          group relative min-w-0 overflow-hidden
          rounded-[14px]
          border border-border
          bg-surface
          p-3
          shadow-[var(--app-shadow)]
          transition-colors duration-200
          hover:border-primary/25
          sm:rounded-2xl
          sm:p-4
          lg:p-5
        "
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/[0.07] blur-2xl" />

        <div className="relative flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium text-text-muted sm:text-xs lg:text-sm">
              Şu günki ösüş
            </p>

            <p className="mt-1 text-[23px] font-bold leading-none tracking-tight text-primary sm:text-2xl lg:mt-2 lg:text-3xl">
              {progress}%
            </p>
          </div>

          <div
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              border border-primary/15
              bg-primary/10
              text-primary
              sm:h-9 sm:w-9
              lg:h-11 lg:w-11
              lg:rounded-xl
            "
          >
            <TrendingUp
              size={15}
              className="lg:h-[19px] lg:w-[19px]"
            />
          </div>
        </div>

        <div className="relative mt-2.5 lg:mt-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="truncate text-[9px] text-text-muted sm:text-[10px] lg:text-xs">
              Ýerine ýetirilişi
            </span>

            <span className="text-[9px] font-semibold text-primary sm:text-[10px] lg:text-xs">
              {completedTasks}/{totalTasks}
            </span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-background lg:h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
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