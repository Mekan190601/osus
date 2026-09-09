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
      nextDate.getDate() + direction * 7,
    );
  }

  if (period === "monthly") {
    nextDate.setMonth(
      nextDate.getMonth() + direction,
    );
  }

  if (period === "yearly") {
    nextDate.setFullYear(
      nextDate.getFullYear() + direction,
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
      (state) => state.setSelectedDate,
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
        rounded-xl
        border border-border
        bg-surface
        p-1
        sm:rounded-2xl
        sm:p-2
      "
    >
      {/* PREVIOUS */}
      <button
        type="button"
        onClick={handlePrevious}
        className="
          flex h-8 w-8
          shrink-0 items-center
          justify-center
          rounded-lg
          text-text-muted
          transition-all duration-200
          hover:bg-background
          hover:text-text-primary

          sm:h-10 sm:w-10
          sm:rounded-xl
        "
        aria-label="Öňki döwür"
      >
        <ChevronLeft
          size={16}
          className="sm:h-[18px] sm:w-[18px]"
        />
      </button>

      {/* DATE */}
      <motion.div
        key={`${period}-${selectedDate}`}
        initial={{
          opacity: 0,
          y: 3,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.18,
        }}
        className="
          min-w-0 flex-1
          px-1.5
          text-center
          sm:px-3
        "
      >
        <p
          className="
            truncate
            text-[11px]
            font-semibold
            text-text-primary
            sm:text-base
          "
        >
          {formatDateLabel(
            currentDate,
            period,
          )}
        </p>
      </motion.div>

      {/* CURRENT PERIOD */}
      <button
        type="button"
        onClick={handleCurrentPeriod}
        className="
          flex h-8 w-8
          shrink-0 items-center
          justify-center
          rounded-lg
          text-text-muted
          transition-all duration-200
          hover:bg-background
          hover:text-primary

          sm:h-10
          sm:w-auto
          sm:gap-2
          sm:rounded-xl
          sm:px-3
          sm:text-xs
          sm:font-semibold
        "
        aria-label="Häzirki döwre dolan"
        title="Häzirki döwür"
      >
        <RotateCcw
          size={13}
          className="sm:h-[14px] sm:w-[14px]"
        />

        <span className="hidden sm:inline">
          Häzirki döwür
        </span>
      </button>

      {/* NEXT */}
      <button
        type="button"
        onClick={handleNext}
        className="
          flex h-8 w-8
          shrink-0 items-center
          justify-center
          rounded-lg
          text-text-muted
          transition-all duration-200
          hover:bg-background
          hover:text-text-primary

          sm:h-10 sm:w-10
          sm:rounded-xl
        "
        aria-label="Indiki döwür"
      >
        <ChevronRight
          size={16}
          className="sm:h-[18px] sm:w-[18px]"
        />
      </button>
    </div>
  );
}