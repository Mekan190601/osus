import {
  ArrowUpRight,
  CalendarDays,
  Flag,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../../app/routePaths";
import { useGoalStore } from "../../../../store/goalStore";
import { useTranslation } from "../../../../hooks/useTranslation";

export default function DashboardSummary() {
  const { t } = useTranslation();

  const mainGoal = useGoalStore(
    (state) => state.mainGoal,
  );

  const deadline = useGoalStore(
    (state) => state.deadline,
  );

  const hasGoal = Boolean(
    mainGoal.trim(),
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.42,
        ease: "easeOut",
      }}
      whileHover={{ y: -2 }}
      className="
        group relative h-full overflow-hidden
        rounded-2xl
        border border-border
        bg-surface
        p-6
        shadow-[var(--app-shadow)]
        transition-colors duration-200
        hover:border-violet-400/20
      "
    >
      {/* ATMOSPHERE */}

      <div
        className="
          pointer-events-none
          absolute -right-20 -top-20
          h-52 w-52
          rounded-full
          bg-violet-500/[0.065]
          blur-3xl
        "
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-400">
              <Target size={18} />

              <span className="text-sm font-semibold">
                Maksat statusy
              </span>
            </div>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-text-primary">
              Strategik ugur
            </h2>
          </div>

          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              border border-violet-400/15
              bg-violet-500/10
              text-violet-400
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            <Flag size={19} />
          </div>
        </div>

        {/* GOAL */}

        <div className="mt-7 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
            {t.dashboard.mainGoal}
          </p>

          <h3
            className={[
              "mt-2 max-w-xl text-2xl font-bold leading-8",
              hasGoal
                ? "text-text-primary"
                : "text-text-muted",
            ].join(" ")}
          >
            {hasGoal
              ? mainGoal
              : "Maksat entek girizilmedi"}
          </h3>

          <p className="mt-3 max-w-xl text-sm leading-6 text-text-muted">
            {hasGoal
              ? "Bu maksat häzirki ösüş strategiýaňyň esasy ugrudyr."
              : "Esasy maksadyňy giriz. Dashboard soňra ösüşi, maliýäni we möhleti awtomatik analiz eder."}
          </p>
        </div>

        {/* STATUS + DEADLINE */}

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            className="
              rounded-xl
              border border-border
              bg-background/35
              p-4
            "
          >
            <p className="text-xs text-text-muted">
              Ýagdaý
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  hasGoal
                    ? "bg-success"
                    : "bg-warning",
                ].join(" ")}
              />

              <span
                className={[
                  "text-sm font-semibold",
                  hasGoal
                    ? "text-success"
                    : "text-warning",
                ].join(" ")}
              >
                {hasGoal
                  ? "Aktiw"
                  : "Garaşylýar"}
              </span>
            </div>
          </div>

          <div
            className="
              rounded-xl
              border border-warning/10
              bg-warning/[0.035]
              p-4
            "
          >
            <div className="flex items-center gap-2 text-warning">
              <CalendarDays size={15} />

              <p className="text-xs font-medium">
                Soňky möhlet
              </p>
            </div>

            <p className="mt-2 text-sm font-semibold text-text-primary">
              {deadline ||
                "Girizilmedi"}
            </p>
          </div>
        </div>

        {/* ACTION */}

        <div className="mt-5 border-t border-border/70 pt-4">
          <Link
            to={ROUTES.goals}
            className="
              group/link inline-flex
              items-center gap-2
              text-sm font-semibold
              text-violet-400
              transition
              hover:text-violet-300
            "
          >
            Maksady dolandyr

            <ArrowUpRight
              size={16}
              className="
                transition-transform
                group-hover/link:-translate-y-0.5
                group-hover/link:translate-x-0.5
              "
            />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}