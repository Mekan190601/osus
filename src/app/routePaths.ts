export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  goals: "/goals",
  finance: "/finance",
  planner: "/planner",
  weeklyReview: "/weekly-review",
  settings: "/settings",
  aiCoach: "/ai-coach",
  analytics: "/analytics",
  onboarding: "/onboarding",
  notifications: "/notifications",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];