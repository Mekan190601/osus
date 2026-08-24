import { motion } from "framer-motion";

import { PLANNER_PERIODS } from "../../constants/eisenhower";
import type { PlannerPeriod } from "../../types/planner.types";

type PlannerTabsProps = {
  activePeriod: PlannerPeriod;
  onChange: (period: PlannerPeriod) => void;
};

function getPeriodLabel(
  period: PlannerPeriod,
) {
  if (period === "daily") {
    return "Günlük";
  }

  if (period === "weekly") {
    return "Hepdelik";
  }

  if (period === "monthly") {
    return "Aýlyk";
  }

  return "Ýyllyk";
}

export default function PlannerTabs({
  activePeriod,
  onChange,
}: PlannerTabsProps) {
  return (
    <div
      className="
        inline-flex w-full
        rounded-2xl
        border border-border
        bg-surface p-1.5
        sm:w-auto
      "
    >
      {PLANNER_PERIODS.map((period) => {
        const isActive =
          activePeriod === period.value;

        return (
          <button
            key={period.value}
            type="button"
            onClick={() =>
              onChange(period.value)
            }
            className={[
              "relative flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 sm:flex-none",
              isActive
                ? "text-slate-950"
                : "text-text-muted hover:text-text-primary",
            ].join(" ")}
          >
            {isActive && (
              <motion.span
                layoutId="planner-active-period"
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 32,
                }}
                className="
                  absolute inset-0
                  rounded-xl
                  bg-primary
                "
              />
            )}

            <span className="relative z-10">
              {getPeriodLabel(
                period.value,
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}