import { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  CircleAlert,
  CircleCheck,
  Info,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useNotificationStore } from "../../store/notificationStore";
import type {
  AppNotification,
  NotificationSource,
  NotificationType,
} from "../../features/notifications/types/notification.types";

type ReadFilter =
  | "all"
  | "unread";

type LifecycleFilter =
  | "all"
  | "active"
  | "resolved";

type SourceFilter =
  | "all"
  | NotificationSource;

function renderNotificationIcon(
  type: NotificationType,
  size: number,
) {
  if (type === "success") {
    return <CircleCheck size={size} />;
  }

  if (type === "warning") {
    return <TriangleAlert size={size} />;
  }

  if (type === "danger") {
    return <CircleAlert size={size} />;
  }

  return <Info size={size} />;
}

function getTypeClasses(
  type: NotificationType,
) {
  if (type === "success") {
    return "bg-success/10 text-success";
  }

  if (type === "warning") {
    return "bg-warning/10 text-warning";
  }

  if (type === "danger") {
    return "bg-danger/10 text-danger";
  }

  return "bg-primary/10 text-primary";
}

function getSourceLabel(
  source: NotificationSource,
) {
  const labels: Record<
    NotificationSource,
    string
  > = {
    system: "Sistema",
    planner: "Meýilnama",
    finance: "Maliýe",
    goal: "Maksat",
    analytics: "Analiz",
    "ai-coach": "Akylly maslahat",
  };

  return labels[source];
}

function formatDate(
  createdAt: string,
) {
  return new Intl.DateTimeFormat(
    "tk-TM",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    new Date(createdAt),
  );
}

type NotificationCardProps = {
  notification: AppNotification;
};

function NotificationCard({
  notification,
}: NotificationCardProps) {
  const markAsRead =
    useNotificationStore(
      (state) =>
        state.markAsRead,
    );

  const deleteNotification =
    useNotificationStore(
      (state) =>
        state.deleteNotification,
    );


  const isResolved =
    Boolean(notification.resolved);

  return (
    <article
      className={[
        "rounded-xl border p-3 transition sm:rounded-2xl sm:p-5",
        isResolved
          ? "border-success/15 bg-success/[0.025]"
          : notification.read
            ? "border-border bg-surface"
            : "border-primary/20 bg-primary/[0.03]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl",
            isResolved
              ? "bg-success/10 text-success"
              : getTypeClasses(
                  notification.type,
                ),
          ].join(" ")}
        >
          {isResolved ? (
            <CircleCheck size={18} />
          ) : (
            renderNotificationIcon(notification.type, 18)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={[
                    "font-bold",
                    isResolved
                      ? "text-text-secondary"
                      : "text-text-primary",
                  ].join(" ")}
                >
                  {notification.title}
                </h3>

                {!notification.read &&
                  !isResolved && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}

                {isResolved && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[10px] font-semibold text-success">
                    <CircleCheck
                      size={12}
                    />
                    Çözüldi
                  </span>
                )}
              </div>

              <p
                className={[
                  "mt-1.5 text-xs leading-5 sm:mt-2 sm:text-sm sm:leading-6",
                  isResolved
                    ? "text-text-disabled"
                    : "text-text-muted",
                ].join(" ")}
              >
                {notification.message}
              </p>
            </div>

            <span className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-[10px] font-semibold text-text-muted">
              {getSourceLabel(
                notification.source,
              )}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 sm:mt-4 sm:gap-3 sm:pt-4">
            <div>
              <p className="text-xs text-text-disabled">
                Döredildi:{" "}
                {formatDate(
                  notification.createdAt,
                )}
              </p>

              {isResolved &&
                notification.resolvedAt && (
                  <p className="mt-1 text-[10px] text-success">
                    Çözüldi:{" "}
                    {formatDate(
                      notification.resolvedAt,
                    )}
                  </p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!notification.read &&
                !isResolved && (
                  <button
                    type="button"
                    onClick={() =>
                      markAsRead(
                        notification.id,
                      )
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary"
                  >
                    <CheckCheck
                      size={14}
                    />
                    Okaldy diýip belle
                  </button>
                )}

              {notification.actionPath &&
                !isResolved && (
                  <Link
                    to={
                      notification.actionPath
                    }
                    onClick={() =>
                      markAsRead(
                        notification.id,
                      )
                    }
                    className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-xs font-semibold text-slate-950 transition hover:bg-primary-hover"
                  >
                    {notification.actionLabel ??
                      "Aç"}
                  </Link>
                )}

              <button
                type="button"
                onClick={() =>
                  deleteNotification(
                    notification.id,
                  )
                }
                aria-label="Bildirişi poz"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NotificationsPage() {
  const notifications =
    useNotificationStore(
      (state) =>
        state.notifications,
    );

  const markAllAsRead =
    useNotificationStore(
      (state) =>
        state.markAllAsRead,
    );

  const clearNotifications =
    useNotificationStore(
      (state) =>
        state.clearNotifications,
    );

  const [readFilter, setReadFilter] =
    useState<ReadFilter>("all");

  const [
    lifecycleFilter,
    setLifecycleFilter,
  ] =
    useState<LifecycleFilter>(
      "all",
    );

  const [
    sourceFilter,
    setSourceFilter,
  ] =
    useState<SourceFilter>("all");

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read &&
        !notification.resolved,
    ).length;

  const activeCount =
    notifications.filter(
      (notification) =>
        !notification.resolved,
    ).length;

  const resolvedCount =
    notifications.filter(
      (notification) =>
        Boolean(
          notification.resolved,
        ),
    ).length;

  const filteredNotifications =
    useMemo(() => {
      return [...notifications]
        .filter(
          (notification) => {
            if (
              readFilter ===
                "unread" &&
              (notification.read ||
                notification.resolved)
            ) {
              return false;
            }

            if (
              lifecycleFilter ===
                "active" &&
              notification.resolved
            ) {
              return false;
            }

            if (
              lifecycleFilter ===
                "resolved" &&
              !notification.resolved
            ) {
              return false;
            }

            if (
              sourceFilter !==
                "all" &&
              notification.source !==
                sourceFilter
            ) {
              return false;
            }

            return true;
          },
        )
        .sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        );
    }, [
      notifications,
      readFilter,
      lifecycleFilter,
      sourceFilter,
    ]);

  return (
    <div className="space-y-3 sm:space-y-6 lg:space-y-8">
      <section className="rounded-2xl border border-border bg-surface p-4 sm:rounded-3xl sm:p-8">
        <div className="flex items-center gap-2 text-primary">
          <Bell size={18} />

          <span className="text-sm font-semibold">
            Bildirişler
          </span>
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:mt-3 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Möhüm üýtgeşmeler
            </h1>

            <p className="mt-2 max-w-3xl text-xs leading-5 text-text-muted sm:mt-3 sm:text-base sm:leading-7">
              Aktiw meseleleri,
              çözülen ýagdaýlary we
              möhüm üýtgeşmeleri bir
              ýerden gözegçilikde sakla.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary"
              >
                <CheckCheck
                  size={16}
                />
                Hemmesini okaldy et
              </button>
            )}

            {notifications.length >
              0 && (
              <button
                type="button"
                onClick={
                  clearNotifications
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 px-4 text-sm font-semibold text-danger transition hover:bg-danger/10"
              >
                <Trash2 size={16} />
                Hemmesini poz
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2 sm:gap-4">
        <article className="rounded-xl border border-border bg-surface p-3 sm:rounded-2xl sm:p-5">
          <p className="text-sm text-text-muted">
            Jemi
          </p>

          <p className="mt-1 text-xl font-bold text-text-primary sm:mt-2 sm:text-3xl">
            {notifications.length}
          </p>
        </article>

        <article className="rounded-xl border border-warning/20 bg-warning/5 p-3 sm:rounded-2xl sm:p-5">
          <p className="text-sm text-warning">
            Aktiw
          </p>

          <p className="mt-1 text-xl font-bold text-warning sm:mt-2 sm:text-3xl">
            {activeCount}
          </p>
        </article>

        <article className="rounded-xl border border-success/20 bg-success/5 p-3 sm:rounded-2xl sm:p-5">
          <p className="text-sm text-success">
            Çözülen
          </p>

          <p className="mt-1 text-xl font-bold text-success sm:mt-2 sm:text-3xl">
            {resolvedCount}
          </p>
        </article>
      </section>

      <section className="rounded-xl border border-border bg-surface p-3 sm:rounded-2xl sm:p-5">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setLifecycleFilter(
                  "all",
                )
              }
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                lifecycleFilter ===
                "all"
                  ? "bg-primary text-slate-950"
                  : "border border-border text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              Ählisi
            </button>

            <button
              type="button"
              onClick={() =>
                setLifecycleFilter(
                  "active",
                )
              }
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                lifecycleFilter ===
                "active"
                  ? "bg-warning text-slate-950"
                  : "border border-border text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              Aktiw ({activeCount})
            </button>

            <button
              type="button"
              onClick={() =>
                setLifecycleFilter(
                  "resolved",
                )
              }
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                lifecycleFilter ===
                "resolved"
                  ? "bg-success text-slate-950"
                  : "border border-border text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              Çözülen ({resolvedCount})
            </button>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setReadFilter(
                    "all",
                  )
                }
                className={[
                  "rounded-xl px-4 py-2 text-sm font-semibold transition",
                  readFilter === "all"
                    ? "bg-primary/10 text-primary"
                    : "border border-border text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                Okalan +
                okalmadyk
              </button>

              <button
                type="button"
                onClick={() =>
                  setReadFilter(
                    "unread",
                  )
                }
                className={[
                  "rounded-xl px-4 py-2 text-sm font-semibold transition",
                  readFilter ===
                  "unread"
                    ? "bg-primary/10 text-primary"
                    : "border border-border text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                Okalmadyk (
                {unreadCount})
              </button>
            </div>

            <select
              value={sourceFilter}
              onChange={(event) =>
                setSourceFilter(
                  event.target
                    .value as SourceFilter,
                )
              }
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-text-primary outline-none focus:border-primary"
            >
              <option value="all">
                Ähli bölümler
              </option>

              <option value="planner">
                Meýilnama
              </option>

              <option value="finance">
                Maliýe
              </option>

              <option value="goal">
                Maksat
              </option>

              <option value="analytics">
                Analiz
              </option>

              <option value="ai-coach">
                Akylly maslahat
              </option>

              <option value="system">
                Sistema
              </option>
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {filteredNotifications.length >
        0 ? (
          filteredNotifications.map(
            (notification) => (
              <NotificationCard
                key={notification.id}
                notification={
                  notification
                }
              />
            ),
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-text-disabled">
              <Bell size={20} />
            </div>

            <h3 className="mt-4 font-bold text-text-primary">
              Bildiriş tapylmady
            </h3>

            <p className="mt-2 text-sm text-text-muted">
              Saýlanan filter boýunça
              görkeziljek bildiriş ýok.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}