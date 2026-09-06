import { create } from "zustand";

import { supabase } from "../services/supabase";

import {
  getOfflineUserSettings,
  saveOfflineUserSettings,
} from "../services/offlineSettingsService";

import {
  initializeSettingsSync,
  syncSettingsQueue,
} from "../services/settingsSyncService";

import type {
  OfflineUserSettings,
} from "../services/offlineDb";

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

  notifications:
    NotificationPreferences;

  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  loadSettings: () => Promise<void>;

  setLanguage: (
    language: AppLanguage,
  ) => Promise<void>;

  setCurrency: (
    currency: AppCurrency,
  ) => Promise<void>;

  setStartPage: (
    startPage: StartPage,
  ) => Promise<void>;

  setTheme: (
    theme: AppTheme,
  ) => Promise<void>;

  setNotificationPreference: (
    key:
      keyof NotificationPreferences,
    enabled: boolean,
  ) => Promise<void>;

  resetSettings: () => Promise<void>;

  clearLocalSettings: () => void;
};

const DEFAULT_NOTIFICATIONS:
  NotificationPreferences = {
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

  notifications: {
    ...DEFAULT_NOTIFICATIONS,
  },

  isLoading: false,
  isInitialized: false,
  error: null as string | null,
};

function getErrorMessage(
  error: unknown,
) {
  return error instanceof Error
    ? error.message
    : "Näbelli ýalňyşlyk ýüze çykdy.";
}

async function getUserId() {
  const {
    data: { session },
    error,
  } =
    await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.user) {
    throw new Error(
      "Ulanyjy hasaba girmändir.",
    );
  }

  return session.user.id;
}

function applySettings(
  settings: OfflineUserSettings,
) {
  return {
    language:
      settings.language,

    currency:
      settings.currency,

    startPage:
      settings.startPage,

    theme:
      settings.theme,

    notifications: {
      ...settings.notifications,
    },
  };
}

export const useSettingsStore =
  create<SettingsState>()(
    (set, get) => {
      async function persistCurrent(
        overrides: Partial<{
          language: AppLanguage;
          currency: AppCurrency;
          startPage: StartPage;
          theme: AppTheme;
          notifications:
            NotificationPreferences;
        }> = {},
      ) {
        const userId =
          await getUserId();

        const existing =
          await getOfflineUserSettings(
            userId,
          );

        const state = get();
        const now =
          new Date().toISOString();

        const settings:
          OfflineUserSettings = {
            userId,

            language:
              overrides.language ??
              state.language,

            currency:
              overrides.currency ??
              state.currency,

            startPage:
              overrides.startPage ??
              state.startPage,

            theme:
              overrides.theme ??
              state.theme,

            notifications:
              overrides.notifications ??
              {
                ...state.notifications,
              },

            createdAt:
              existing?.createdAt ??
              now,

            updatedAt: now,
            deletedAt: null,
          };

        await saveOfflineUserSettings(
          settings,
          true,
        );

        if (navigator.onLine) {
          void syncSettingsQueue().catch(
            (error) => {
              console.warn(
                "Settings background sync failed:",
                error,
              );
            },
          );
        }
      }

      return {
        ...DEFAULT_SETTINGS,

        loadSettings: async () => {
          set({
            isLoading: true,
            error: null,
          });

          try {
            const userId =
              await getUserId();

            let settings =
              await getOfflineUserSettings(
                userId,
              );

            if (settings) {
              set(
                applySettings(
                  settings,
                ),
              );
            }

            if (navigator.onLine) {
              const synced =
                await initializeSettingsSync();

              if (synced) {
                settings = synced;

                set(
                  applySettings(
                    synced,
                  ),
                );
              }
            }

            if (!settings) {
              const now =
                new Date().toISOString();

              settings = {
                userId,

                language: "tk",
                currency: "TMT",
                startPage:
                  "dashboard",
                theme: "dark",

                notifications: {
                  ...DEFAULT_NOTIFICATIONS,
                },

                createdAt: now,
                updatedAt: now,
                deletedAt: null,
              };

              await saveOfflineUserSettings(
                settings,
                true,
              );

              set(
                applySettings(
                  settings,
                ),
              );
            }

            set({
              isLoading: false,
              isInitialized: true,
              error: null,
            });
          } catch (error) {
            set({
              isLoading: false,
              isInitialized: true,
              error:
                getErrorMessage(error),
            });
          }
        },

        setLanguage: async (
          language,
        ) => {
          set({
            language,
            error: null,
          });

          try {
            await persistCurrent({
              language,
            });
          } catch (error) {
            set({
              error:
                getErrorMessage(error),
            });
          }
        },

        setCurrency: async (
          currency,
        ) => {
          set({
            currency,
            error: null,
          });

          try {
            await persistCurrent({
              currency,
            });
          } catch (error) {
            set({
              error:
                getErrorMessage(error),
            });
          }
        },

        setStartPage: async (
          startPage,
        ) => {
          set({
            startPage,
            error: null,
          });

          try {
            await persistCurrent({
              startPage,
            });
          } catch (error) {
            set({
              error:
                getErrorMessage(error),
            });
          }
        },

        setTheme: async (
          theme,
        ) => {
          set({
            theme,
            error: null,
          });

          try {
            await persistCurrent({
              theme,
            });
          } catch (error) {
            set({
              error:
                getErrorMessage(error),
            });
          }
        },

        setNotificationPreference:
          async (
            key,
            enabled,
          ) => {
            const notifications = {
              ...get().notifications,
              [key]: enabled,
            };

            set({
              notifications,
              error: null,
            });

            try {
              await persistCurrent({
                notifications,
              });
            } catch (error) {
              set({
                error:
                  getErrorMessage(error),
              });
            }
          },

        resetSettings: async () => {
          const notifications = {
            ...DEFAULT_NOTIFICATIONS,
          };

          set({
            language: "tk",
            currency: "TMT",
            startPage: "dashboard",
            theme: "dark",
            notifications,
            error: null,
          });

          try {
            await persistCurrent({
              language: "tk",
              currency: "TMT",
              startPage:
                "dashboard",
              theme: "dark",
              notifications,
            });
          } catch (error) {
            set({
              error:
                getErrorMessage(error),
            });
          }
        },

        clearLocalSettings: () => {
          set({
            ...DEFAULT_SETTINGS,

            notifications: {
              ...DEFAULT_NOTIFICATIONS,
            },
          });
        },
      };
    },
  );