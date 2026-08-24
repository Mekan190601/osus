export const colors = {
  background: "#07121A",

  surface: "#0D1B26",
  surfaceElevated: "#122433",
  surfaceHover: "#172C3D",

  primary: "#22C55E",
  primaryHover: "#16A34A",
  primarySoft: "#22C55E1A",

  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#38BDF8",

  textPrimary: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textMuted: "#94A3B8",
  textDisabled: "#64748B",

  border: "#233445",
  borderStrong: "#334A5F",
} as const;

export type ColorToken = keyof typeof colors;