import { create } from "zustand";

import {
  getCurrentUserId,
} from "../services/auth";

import {
  getOfflineNotification,
  getOfflineNotifications,
  saveOfflineNotification,
} from "../services/offlineNotificationService";

import {
  initializeNotificationSync,
  syncNotificationQueue,
} from "../services/notificationSyncService";

import type {
  OfflineNotification,
} from "../services/offlineDb";

import type {
  AppNotification,
  CreateNotificationInput,
} from "../features/notifications/types/notification.types";

type NotificationState = {
  notifications: AppNotification[];

  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  loadNotifications: () => Promise<void>;

  addNotification: (
    input: CreateNotificationInput,
  ) => Promise<void>;

  markAsRead: (
    notificationId: string,
  ) => Promise<void>;

  markAllAsRead: () => Promise<void>;

  resolveNotificationByKey: (
    dedupeKey: string,
  ) => Promise<void>;

  deleteNotification: (
    notificationId: string,
  ) => Promise<void>;

  clearNotifications:
    () => Promise<void>;

  clearLocalNotifications:
    () => void;
};

const initialState = {
  notifications:
    [] as AppNotification[],

  isLoading: false,
  isInitialized: false,

  error:
    null as string | null,
};

function createNotificationId() {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function getErrorMessage(
  error: unknown,
) {
  return error instanceof Error
    ? error.message
    : "Näbelli ýalňyşlyk ýüze çykdy.";
}

function toAppNotification(
  item: OfflineNotification,
): AppNotification {
  return {
    id:
      item.id,

    title:
      item.title,

    message:
      item.message,

    type:
      item.type,

    source:
      item.source,

    read:
      item.read,

    actionLabel:
      item.actionLabel ??
      undefined,

    actionPath:
      item.actionPath ??
      undefined,

    dedupeKey:
      item.dedupeKey ??
      undefined,

    resolved:
      item.resolved,

    resolvedAt:
      item.resolvedAt ??
      undefined,

    createdAt:
      item.createdAt,
  };
}

/* =========================
   BACKGROUND SYNC
========================= */

async function backgroundSync() {
  if (!navigator.onLine) {
    return;
  }

  try {
    await syncNotificationQueue();
  } catch (error) {
    console.warn(
      "Notification background sync failed:",
      error,
    );
  }
}

export const useNotificationStore =
  create<NotificationState>()(
    (set, get) => ({
      ...initialState,

      /* =========================
         LOAD
      ========================= */

      loadNotifications:
        async () => {
          set({
            isLoading: true,
            error: null,
          });

          try {
            const userId =
              await getCurrentUserId();

            /*
             * OFFLINE-FIRST:
             * Ilki IndexedDB-däki
             * bildirişler görkezilýär.
             */
            let local =
              await getOfflineNotifications(
                userId,
              );

            set({
              notifications:
                local.map(
                  toAppNotification,
                ),

              isInitialized: true,
              error: null,
            });

            /*
             * Diňe internet bar wagty
             * cloud sync edilýär.
             *
             * Cloud şowsuz bolsa local
             * bildirişler ekranda galýar.
             */
            if (navigator.onLine) {
              try {
                await initializeNotificationSync();

                local =
                  await getOfflineNotifications(
                    userId,
                  );

                set({
                  notifications:
                    local.map(
                      toAppNotification,
                    ),

                  error: null,
                });
              } catch (error) {
                console.warn(
                  "Notification cloud sync failed:",
                  error,
                );
              }
            }
          } catch (error) {
            set({
              error:
                getErrorMessage(
                  error,
                ),

              isInitialized: true,
            });
          } finally {
            set({
              isLoading: false,
            });
          }
        },

      /* =========================
         ADD
      ========================= */

      addNotification:
        async (input) => {
          const title =
            input.title.trim();

          const message =
            input.message.trim();

          const dedupeKey =
            input.dedupeKey?.trim() ||
            null;

          if (
            !title ||
            !message
          ) {
            return;
          }

          if (
            dedupeKey &&
            get().notifications.some(
              (item) =>
                item.dedupeKey ===
                  dedupeKey &&
                !item.resolved,
            )
          ) {
            return;
          }

          try {
            const userId =
              await getCurrentUserId();

            const now =
              new Date().toISOString();

            const item:
              OfflineNotification = {
                userId,

                id:
                  createNotificationId(),

                title,
                message,

                type:
                  input.type ??
                  "info",

                source:
                  input.source ??
                  "system",

                read: false,

                actionLabel:
                  input.actionLabel?.trim() ||
                  null,

                actionPath:
                  input.actionPath?.trim() ||
                  null,

                dedupeKey,

                resolved: false,
                resolvedAt: null,

                createdAt: now,
                updatedAt: now,

                deletedAt: null,
              };

            /*
             * Ilki IndexedDB.
             */
            await saveOfflineNotification(
              item,
              true,
            );

            /*
             * UI derrew täzelenýär.
             */
            set((state) => ({
              notifications: [
                toAppNotification(
                  item,
                ),
                ...state.notifications,
              ],

              error: null,
            }));

            void backgroundSync();
          } catch (error) {
            set({
              error:
                getErrorMessage(
                  error,
                ),
            });
          }
        },

      /* =========================
         MARK AS READ
      ========================= */

      markAsRead:
        async (
          notificationId,
        ) => {
          try {
            const userId =
              await getCurrentUserId();

            const item =
              await getOfflineNotification(
                userId,
                notificationId,
              );

            if (!item) {
              return;
            }

            const updated:
              OfflineNotification = {
                ...item,

                read: true,

                updatedAt:
                  new Date().toISOString(),
              };

            await saveOfflineNotification(
              updated,
              true,
            );

            set((state) => ({
              notifications:
                state.notifications.map(
                  (notification) =>
                    notification.id ===
                    notificationId
                      ? toAppNotification(
                          updated,
                        )
                      : notification,
                ),

              error: null,
            }));

            void backgroundSync();
          } catch (error) {
            set({
              error:
                getErrorMessage(
                  error,
                ),
            });
          }
        },

      /* =========================
         MARK ALL AS READ
      ========================= */

      markAllAsRead:
        async () => {
          try {
            const userId =
              await getCurrentUserId();

            const items =
              await getOfflineNotifications(
                userId,
              );

            const now =
              new Date().toISOString();

            for (const item of items) {
              if (item.read) {
                continue;
              }

              await saveOfflineNotification(
                {
                  ...item,

                  read: true,

                  updatedAt: now,
                },
                true,
              );
            }

            const local =
              await getOfflineNotifications(
                userId,
              );

            set({
              notifications:
                local.map(
                  toAppNotification,
                ),

              error: null,
            });

            void backgroundSync();
          } catch (error) {
            set({
              error:
                getErrorMessage(
                  error,
                ),
            });
          }
        },

      /* =========================
         RESOLVE
      ========================= */

      resolveNotificationByKey:
        async (dedupeKey) => {
          const clean =
            dedupeKey.trim();

          if (!clean) {
            return;
          }

          try {
            const userId =
              await getCurrentUserId();

            const items =
              await getOfflineNotifications(
                userId,
              );

            const now =
              new Date().toISOString();

            for (const item of items) {
              if (
                item.dedupeKey !==
                  clean ||
                item.resolved
              ) {
                continue;
              }

              await saveOfflineNotification(
                {
                  ...item,

                  resolved: true,
                  read: true,

                  resolvedAt: now,
                  updatedAt: now,
                },
                true,
              );
            }

            const local =
              await getOfflineNotifications(
                userId,
              );

            set({
              notifications:
                local.map(
                  toAppNotification,
                ),

              error: null,
            });

            void backgroundSync();
          } catch (error) {
            set({
              error:
                getErrorMessage(
                  error,
                ),
            });
          }
        },

      /* =========================
         DELETE
      ========================= */

      deleteNotification:
        async (
          notificationId,
        ) => {
          try {
            const userId =
              await getCurrentUserId();

            const item =
              await getOfflineNotification(
                userId,
                notificationId,
              );

            if (!item) {
              return;
            }

            const now =
              new Date().toISOString();

            await saveOfflineNotification(
              {
                ...item,

                deletedAt: now,
                updatedAt: now,
              },
              true,
            );

            set((state) => ({
              notifications:
                state.notifications.filter(
                  (notification) =>
                    notification.id !==
                    notificationId,
                ),

              error: null,
            }));

            void backgroundSync();
          } catch (error) {
            set({
              error:
                getErrorMessage(
                  error,
                ),
            });
          }
        },

      /* =========================
         CLEAR ALL
      ========================= */

      clearNotifications:
        async () => {
          try {
            const userId =
              await getCurrentUserId();

            const items =
              await getOfflineNotifications(
                userId,
              );

            const now =
              new Date().toISOString();

            for (const item of items) {
              await saveOfflineNotification(
                {
                  ...item,

                  deletedAt: now,
                  updatedAt: now,
                },
                true,
              );
            }

            set({
              notifications: [],
              isInitialized: true,
              error: null,
            });

            void backgroundSync();
          } catch (error) {
            set({
              error:
                getErrorMessage(
                  error,
                ),
            });
          }
        },

      /* =========================
         RESET RAM
      ========================= */

      clearLocalNotifications:
        () => {
          /*
           * Logout wagty diňe RAM arassalanýar.
           * IndexedDB cache saklanýar.
           */
          set({
            ...initialState,
          });
        },
    }),
  );