import { supabase } from "./supabase";

import type {
  AppNotification,
} from "../features/notifications/types/notification.types";

export type NotificationRow = {
  id: string;
  user_id: string;

  title: string;
  message: string;

  type: AppNotification["type"];
  source: AppNotification["source"];

  read: boolean;

  action_label: string | null;
  action_path: string | null;

  dedupe_key: string | null;

  resolved: boolean;
  resolved_at: string | null;

  created_at: string;
  updated_at: string;

  deleted_at: string | null;
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

export function mapNotificationRow(
  row: NotificationRow,
): AppNotification {
  return {
    id: row.id,

    title: row.title,
    message: row.message,

    type: row.type,
    source: row.source,

    read: row.read,

    actionLabel:
      row.action_label ?? undefined,

    actionPath:
      row.action_path ?? undefined,

    dedupeKey:
      row.dedupe_key ?? undefined,

    resolved: row.resolved,

    resolvedAt:
      row.resolved_at ?? undefined,

    createdAt:
      row.created_at,
  };
}

export async function getNotificationRows() {
  const userId =
    await getUserId();

  const { data, error } =
    await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return (data ?? []) as NotificationRow[];
}

export async function upsertNotificationRow(
  notification: {
    id: string;
    title: string;
    message: string;
    type: AppNotification["type"];
    source: AppNotification["source"];
    read: boolean;
    actionLabel: string | null;
    actionPath: string | null;
    dedupeKey: string | null;
    resolved: boolean;
    resolvedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  },
) {
  const userId =
    await getUserId();

  const { error } =
    await supabase
      .from("notifications")
      .upsert(
        {
          id:
            notification.id,

          user_id:
            userId,

          title:
            notification.title,

          message:
            notification.message,

          type:
            notification.type,

          source:
            notification.source,

          read:
            notification.read,

          action_label:
            notification.actionLabel,

          action_path:
            notification.actionPath,

          dedupe_key:
            notification.dedupeKey,

          resolved:
            notification.resolved,

          resolved_at:
            notification.resolvedAt,

          created_at:
            notification.createdAt,

          updated_at:
            notification.updatedAt,

          deleted_at:
            notification.deletedAt,
        },
        {
          onConflict: "id",
        },
      );

  if (error) {
    throw error;
  }
}