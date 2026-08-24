import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  AppNotification,
  CreateNotificationInput,
} from "../features/notifications/types/notification.types";

type NotificationState = {
  notifications: AppNotification[];

  addNotification: (
    input: CreateNotificationInput,
  ) => void;

  markAsRead: (
    notificationId: string,
  ) => void;

  markAllAsRead: () => void;

  resolveNotificationByKey: (
    dedupeKey: string,
  ) => void;

  deleteNotification: (
    notificationId: string,
  ) => void;

  clearNotifications: () => void;
};

function createNotificationId() {
  return crypto.randomUUID();
}

export const useNotificationStore =
  create<NotificationState>()(
    persist(
      (set) => ({
        notifications: [],

        addNotification: (input) => {
          set((state) => {
            const cleanDedupeKey =
              input.dedupeKey?.trim();

            const hasActiveDuplicate =
              cleanDedupeKey
                ? state.notifications.some(
                    (notification) =>
                      notification.dedupeKey ===
                        cleanDedupeKey &&
                      !notification.resolved,
                  )
                : false;

            if (hasActiveDuplicate) {
              return state;
            }

            const notification: AppNotification = {
              id: createNotificationId(),

              title: input.title.trim(),
              message: input.message.trim(),

              type:
                input.type ?? "info",

              source:
                input.source ?? "system",

              read: false,

              actionLabel:
                input.actionLabel?.trim() ||
                undefined,

              actionPath:
                input.actionPath?.trim() ||
                undefined,

              dedupeKey:
                cleanDedupeKey ||
                undefined,

              resolved: false,

              createdAt:
                new Date().toISOString(),
            };

            if (
              !notification.title ||
              !notification.message
            ) {
              return state;
            }

            return {
              notifications: [
                notification,
                ...state.notifications,
              ],
            };
          });
        },

        markAsRead: (
          notificationId,
        ) => {
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) =>
                  notification.id ===
                  notificationId
                    ? {
                        ...notification,
                        read: true,
                      }
                    : notification,
              ),
          }));
        },

        markAllAsRead: () => {
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) => ({
                  ...notification,
                  read: true,
                }),
              ),
          }));
        },

        resolveNotificationByKey: (
          dedupeKey,
        ) => {
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) => {
                  if (
                    notification.dedupeKey !==
                      dedupeKey ||
                    notification.resolved
                  ) {
                    return notification;
                  }

                  return {
                    ...notification,
                    resolved: true,
                    read: true,
                    resolvedAt:
                      new Date().toISOString(),
                  };
                },
              ),
          }));
        },

        deleteNotification: (
          notificationId,
        ) => {
          set((state) => ({
            notifications:
              state.notifications.filter(
                (notification) =>
                  notification.id !==
                  notificationId,
              ),
          }));
        },

        clearNotifications: () => {
          set({
            notifications: [],
          });
        },
      }),
      {
        name: "osus-notification-storage",
      },
    ),
  );