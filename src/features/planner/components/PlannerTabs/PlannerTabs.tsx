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
        grid w-full
        grid-cols-4
        gap-1
        rounded-xl
        border border-border
        bg-background/35
        p-1
        sm:inline-grid
        sm:w-auto
        sm:rounded-2xl
        sm:p-1.5
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
              `
                relative
                min-w-0
                rounded-lg
                px-1
                py-2
                text-[10px]
                font-semibold
                transition-colors
                duration-200

                sm:rounded-xl
                sm:px-4
                sm:py-2.5
                sm:text-sm
              `,
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
                  rounded-lg
                  bg-primary
                  sm:rounded-xl
                "
              />
            )}

            <span className="relative z-10 whitespace-nowrap">
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