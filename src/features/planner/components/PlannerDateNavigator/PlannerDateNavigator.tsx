import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";

import { usePlannerStore } from "../../../../store/plannerStore";
import type { PlannerPeriod } from "../../types/planner.types";

type PlannerDateNavigatorProps = {
  period: PlannerPeriod;
};

function moveDate(
  date: Date,
  period: PlannerPeriod,
  direction: -1 | 1,
) {
  const nextDate = new Date(date);

  if (period === "daily") {
    nextDate.setDate(
      nextDate.getDate() + direction,
    );
  }

  if (period === "weekly") {
    nextDate.setDate(
      nextDate.getDate() +
        direction * 7,
    );
  }

  if (period === "monthly") {
    nextDate.setMonth(
      nextDate.getMonth() + direction,
    );
  }

  if (period === "yearly") {
    nextDate.setFullYear(
      nextDate.getFullYear() +
        direction,
    );
  }

  return nextDate;
}

function formatDateLabel(
  date: Date,
  period: PlannerPeriod,
) {
  if (period === "daily") {
    return new Intl.DateTimeFormat(
      "tk-TM",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    ).format(date);
  }

  if (period === "weekly") {
    const start = new Date(date);

    const day = start.getDay();

    const difference =
      day === 0 ? -6 : 1 - day;

    start.setDate(
      start.getDate() + difference,
    );

    const end = new Date(start);

    end.setDate(
      end.getDate() + 6,
    );

    const startLabel =
      new Intl.DateTimeFormat(
        "tk-TM",
        {
          day: "numeric",
          month: "short",
        },
      ).format(start);

    const endLabel =
      new Intl.DateTimeFormat(
        "tk-TM",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      ).format(end);

    return `${startLabel} — ${endLabel}`;
  }

  if (period === "monthly") {
    return new Intl.DateTimeFormat(
      "tk-TM",
      {
        month: "long",
        year: "numeric",
      },
    ).format(date);
  }

  return new Intl.DateTimeFormat(
    "tk-TM",
    {
      year: "numeric",
    },
  ).format(date);
}

export default function PlannerDateNavigator({
  period,
}: PlannerDateNavigatorProps) {
  const selectedDate = usePlannerStore(
    (state) => state.selectedDate,
  );

  const setSelectedDate =
    usePlannerStore(
      (state) =>
        state.setSelectedDate,
    );

  const currentDate =
    new Date(selectedDate);

  function handlePrevious() {
    const nextDate = moveDate(
      currentDate,
      period,
      -1,
    );

    setSelectedDate(
      nextDate.toISOString(),
    );
  }

  function handleNext() {
    const nextDate = moveDate(
      currentDate,
      period,
      1,
    );

    setSelectedDate(
      nextDate.toISOString(),
    );
  }

  function handleCurrentPeriod() {
    setSelectedDate(
      new Date().toISOString(),
    );
  }

  return (
    <div
      className="
        flex items-center
        rounded-2xl
        border border-border
        bg-surface
        p-2
      "
    >
      <button
        type="button"
        onClick={handlePrevious}
        className="
          flex h-10 w-10
          shrink-0 items-center
          justify-center rounded-xl
          text-text-muted
          transition-all duration-200
          hover:bg-background
          hover:text-text-primary
        "
        aria-label="Öňki döwür"
      >
        <ChevronLeft size={18} />
      </button>

      <motion.div
        key={`${period}-${selectedDate}`}
        initial={{
          opacity: 0,
          y: 4,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className="
          min-w-0 flex-1
          px-3 text-center
        "
      >
        <p className="truncate text-sm font-semibold text-text-primary sm:text-base">
          {formatDateLabel(
            currentDate,
            period,
          )}
        </p>
      </motion.div>

      <button
        type="button"
        onClick={handleCurrentPeriod}
        className="
          hidden h-10
          items-center gap-2
          rounded-xl px-3
          text-xs font-semibold
          text-text-muted
          transition-all duration-200
          hover:bg-background
          hover:text-text-primary
          sm:inline-flex
        "
      >
        <RotateCcw size={14} />
        Häzirki döwür
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="
          flex h-10 w-10
          shrink-0 items-center
          justify-center rounded-xl
          text-text-muted
          transition-all duration-200
          hover:bg-background
          hover:text-text-primary
        "
        aria-label="Indiki döwür"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}