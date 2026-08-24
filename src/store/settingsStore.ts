import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  AppCurrency,
  AppLanguage,
  AppTheme,
  NotificationPreferences,
  StartPage,
} from "../features/settings/types/settings.types";

type SettingsState = {
  language: AppLanguage;
  currency: AppCurrency;
  startPage: StartPage;
  theme: AppTheme;

  notifications: NotificationPreferences;

  setLanguage: (
    language: AppLanguage,
  ) => void;

  setCurrency: (
    currency: AppCurrency,
  ) => void;

  setStartPage: (
    startPage: StartPage,
  ) => void;

  setTheme: (
    theme: AppTheme,
  ) => void;

  setNotificationPreference: (
    key: keyof NotificationPreferences,
    enabled: boolean,
  ) => void;

  resetSettings: () => void;
};

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences =
  {
    planner: true,
    finance: true,
    goal: true,
    deadline: true,
    success: true,
  };

const DEFAULT_SETTINGS = {
  language: "tk" as AppLanguage,
  currency: "TMT" as AppCurrency,
  startPage: "dashboard" as StartPage,
  theme: "dark" as AppTheme,

  notifications:
    DEFAULT_NOTIFICATION_PREFERENCES,
};

export const useSettingsStore =
  create<SettingsState>()(
    persist(
      (set) => ({
        ...DEFAULT_SETTINGS,

        setLanguage: (language) => {
          set({ language });
        },

        setCurrency: (currency) => {
          set({ currency });
        },

        setStartPage: (startPage) => {
          set({ startPage });
        },

        setTheme: (theme) => {
          set({ theme });
        },

        setNotificationPreference: (
          key,
          enabled,
        ) => {
          set((state) => ({
            notifications: {
              ...state.notifications,
              [key]: enabled,
            },
          }));
        },

        resetSettings: () => {
          set({
            ...DEFAULT_SETTINGS,

            notifications: {
              ...DEFAULT_NOTIFICATION_PREFERENCES,
            },
          });
        },
      }),
      {
        name: "osus-settings-storage",
      },
    ),
  );