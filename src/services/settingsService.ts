import { supabase } from "./supabase";

import type {
  AppCurrency,
  AppLanguage,
  AppTheme,
  NotificationPreferences,
  StartPage,
} from "../features/settings/types/settings.types";

export type UserSettingsData = {
  language: AppLanguage;
  currency: AppCurrency;
  startPage: StartPage;
  theme: AppTheme;

  notifications:
    NotificationPreferences;
};

export type UserSettingsRow = {
  user_id: string;

  language: AppLanguage;
  currency: AppCurrency;
  start_page: StartPage;
  theme: AppTheme;

  notification_planner: boolean;
  notification_finance: boolean;
  notification_goal: boolean;
  notification_deadline: boolean;
  notification_success: boolean;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export const DEFAULT_USER_SETTINGS:
  UserSettingsData = {
    language: "tk",
    currency: "TMT",
    startPage: "dashboard",
    theme: "dark",

    notifications: {
      planner: true,
      finance: true,
      goal: true,
      deadline: true,
      success: true,
    },
  };

async function getUserId() {
  const {
    data: { user },
    error,
  } =
    await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error(
      "Ulanyjy hasaba girmändir.",
    );
  }

  return user.id;
}

export function mapSettingsRow(
  row: UserSettingsRow,
): UserSettingsData {
  return {
    language: row.language,
    currency: row.currency,
    startPage: row.start_page,
    theme: row.theme,

    notifications: {
      planner:
        row.notification_planner,

      finance:
        row.notification_finance,

      goal:
        row.notification_goal,

      deadline:
        row.notification_deadline,

      success:
        row.notification_success,
    },
  };
}

export async function getUserSettingsRow() {
  const userId =
    await getUserId();

  const { data, error } =
    await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data
    ? (data as UserSettingsRow)
    : null;
}

export async function getUserSettings() {
  const row =
    await getUserSettingsRow();

  if (row) {
    return mapSettingsRow(row);
  }

  return saveUserSettings(
    DEFAULT_USER_SETTINGS,
  );
}

export async function saveUserSettings(
  settings: UserSettingsData,
  updatedAt =
    new Date().toISOString(),
) {
  const userId =
    await getUserId();

  const { data, error } =
    await supabase
      .from("user_settings")
      .upsert(
        {
          user_id: userId,

          language:
            settings.language,

          currency:
            settings.currency,

          start_page:
            settings.startPage,

          theme:
            settings.theme,

          notification_planner:
            settings.notifications
              .planner,

          notification_finance:
            settings.notifications
              .finance,

          notification_goal:
            settings.notifications
              .goal,

          notification_deadline:
            settings.notifications
              .deadline,

          notification_success:
            settings.notifications
              .success,

          updated_at:
            updatedAt,

          deleted_at: null,
        },
        {
          onConflict:
            "user_id",
        },
      )
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return mapSettingsRow(
    data as UserSettingsRow,
  );
}

export async function resetUserSettings() {
  return saveUserSettings(
    DEFAULT_USER_SETTINGS,
  );
}