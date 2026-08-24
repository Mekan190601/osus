export type AppLanguage =
  | "tk"
  | "ru"
  | "en";

export type AppCurrency =
  | "TMT"
  | "USD"
  | "EUR"
  | "CNY"
  | "TRY";

export type StartPage =
  | "dashboard"
  | "planner"
  | "analytics"
  | "ai-coach";

export type AppTheme =
  | "dark"
  | "light"
  | "system";

export type NotificationPreferences = {
  planner: boolean;
  finance: boolean;
  goal: boolean;
  deadline: boolean;
  success: boolean;
};

export type AppSettings = {
  language: AppLanguage;
  currency: AppCurrency;
  startPage: StartPage;
  theme: AppTheme;

  notifications: NotificationPreferences;
};