import type { PlannerPeriod } from "../types/planner.types";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getIsoWeekKey(date: Date) {
  const utcDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ),
  );

  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(
    utcDate.getUTCDate() + 4 - day,
  );

  const isoYear = utcDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil(
    ((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );

  return `${isoYear}-W${pad(week)}`;
}

export function getPlannerDateKey(
  date: Date,
  period: PlannerPeriod,
): string {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  if (period === "daily") {
    return `${year}-${month}-${day}`;
  }

  if (period === "monthly") {
    return `${year}-${month}`;
  }

  if (period === "yearly") {
    return String(year);
  }

  return getIsoWeekKey(date);
}
