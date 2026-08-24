import type {
  EisenhowerQuadrant,
  PlannerPeriod,
} from "../types/planner.types";

export const PLANNER_PERIODS: Array<{
  value: PlannerPeriod;
  label: string;
}> = [
  {
    value: "daily",
    label: "Günlük",
  },
  {
    value: "weekly",
    label: "Hepdelik",
  },
  {
    value: "monthly",
    label: "Aýlyk",
  },
  {
    value: "yearly",
    label: "Ýyllyk",
  },
];

export const EISENHOWER_QUADRANTS: Array<{
  value: EisenhowerQuadrant;
  romanNumber: "I" | "II" | "III" | "IV";
  title: string;
  description: string;
  action: string;
}> = [
  {
    value: "urgent-important",
    romanNumber: "I",
    title: "Möhüm + gyssagly",
    description: "Derrew ýerine ýetirilmeli möhüm işler.",
    action: "Häzir et",
  },
  {
    value: "important-not-urgent",
    romanNumber: "II",
    title: "Möhüm + gyssagly däl",
    description: "Ösüş üçin möhüm, öňünden meýilleşdirilmeli işler.",
    action: "Meýilleşdir",
  },
  {
    value: "urgent-not-important",
    romanNumber: "III",
    title: "Möhüm däl + gyssagly",
    description: "Mümkin bolsa başga birine tabşyryp bolýan işler.",
    action: "Delegirle",
  },
  {
    value: "not-urgent-not-important",
    romanNumber: "IV",
    title: "Möhüm däl + gyssagly däl",
    description: "Gymmatly wagty alýan, azaltmaly ýa-da aýyrmaly işler.",
    action: "Aýyr",
  },
];