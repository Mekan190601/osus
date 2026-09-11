import { useEffect, useRef, useState } from "react";
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

import { useNotificationStore } from "../../../../store/notificationStore";
import {
  getRecentNotifications,
  getUnreadNotificationCount,
} from "../../selectors/notification.selectors";
import type {
  AppNotification,
  NotificationType,
} from "../../types/notification.types";

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

function getNotificationIconClass(
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

function formatNotificationTime(
  createdAt: string,
) {
  const createdDate =
    new Date(createdAt);

  const now = new Date();

  const difference =
    now.getTime() -
    createdDate.getTime();

  const minutes = Math.max(
    Math.floor(
      difference / (1000 * 60),
    ),
    0,
  );

  if (minutes < 1) {
    return "Häzir";
  }

  if (minutes < 60) {
    return `${minutes} min öň`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours} sag öň`;
  }

  const days = Math.floor(
    hours / 24,
  );

  if (days < 7) {
    return `${days} gün öň`;
  }

  return new Intl.DateTimeFormat(
    "tk-TM",
    {
      day: "2-digit",
      month: "short",
    },
  ).format(createdDate);
}

type NotificationItemProps = {
  notification: AppNotification;
  onClose: () => void;
};

function NotificationItem({
  notification,
  onClose,
}: NotificationItemProps) {
  const markAsRead =
    useNotificationStore(
      (state) => state.markAsRead,
    );

  const deleteNotification =
    useNotificationStore(
      (state) =>
        state.deleteNotification,
    );


  function handleRead() {
    if (!notification.read) {
      markAsRead(
        notification.id,
      );
    }
  }

  const content = (
    <>
      <div
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          getNotificationIconClass(
            notification.type,
          ),
        ].join(" ")}
      >
        {renderNotificationIcon(notification.type, 17)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 text-sm font-semibold text-text-primary">
            {notification.title}
          </p>

          {!notification.read && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-muted">
          {notification.message}
        </p>

        <p className="mt-2 text-[10px] font-medium text-text-disabled">
          {formatNotificationTime(
            notification.createdAt,
          )}
        </p>
      </div>
    </>
  );

  return (
    <div className="group relative border-b border-border last:border-b-0">
      {notification.actionPath ? (
        <Link
          to={
            notification.actionPath
          }
          onClick={() => {
            handleRead();
            onClose();
          }}
          className={[
            "flex gap-3 px-3 py-3 pr-11 transition hover:bg-background/60 sm:px-4 sm:py-4 sm:pr-12",
            !notification.read
              ? "bg-primary/[0.03]"
              : "",
          ].join(" ")}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleRead}
          className={[
            "flex w-full gap-3 px-3 py-3 pr-11 text-left transition hover:bg-background/60 sm:px-4 sm:py-4 sm:pr-12",
            !notification.read
              ? "bg-primary/[0.03]"
              : "",
          ].join(" ")}
        >
          {content}
        </button>
      )}

      <button
        type="button"
        onClick={() =>
          deleteNotification(
            notification.id,
          )
        }
        aria-label="Bildirişi poz"
        className="absolute right-2.5 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-text-disabled opacity-100 transition hover:bg-danger/10 hover:text-danger sm:right-3 sm:top-4 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
    
  );
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

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

  const unreadCount =
    getUnreadNotificationCount(
      notifications,
    );

  const recentNotifications =
    getRecentNotifications(
      notifications,
      6,
    );

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (current) => !current,
          )
        }
        aria-label="Bildirişler"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-muted transition hover:border-primary/30 hover:text-primary"
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed left-3 right-3 top-[72px] z-50 max-h-[calc(100dvh-88px)] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/30 sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[360px] sm:max-h-none">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-4">
            <div>
              <h3 className="font-bold text-text-primary">
                Bildirişler
              </h3>

              <p className="mt-1 text-xs text-text-muted">
                {unreadCount > 0
                  ? `${unreadCount} sany okalmadyk`
                  : "Ähli bildirişler okaldy"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={
                  markAllAsRead
                }
                className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-primary transition hover:text-primary-hover sm:text-xs"
              >
                <CheckCheck
                  size={15}
                />
                Hemmesini oka
              </button>
            )}
          </div>

          {recentNotifications.length >
          0 ? (
            <div className="max-h-[calc(100dvh-210px)] overflow-y-auto sm:max-h-[420px]">
              {recentNotifications.map(
                (notification) => (
                  <NotificationItem
                    key={
                      notification.id
                    }
                    notification={
                      notification
                    }
                    onClose={() =>
                      setIsOpen(
                        false,
                      )
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-text-disabled">
                <Bell size={20} />
              </div>

              <p className="mt-4 text-sm font-semibold text-text-primary">
                Täze bildiriş ýok
              </p>

              <p className="mt-2 text-xs leading-5 text-text-muted">
                Möhüm üýtgeşmeler
                şu ýerde peýda bolar.
              </p>
            </div>
          )}

          <div className="border-t border-border p-2.5 sm:p-3">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-full items-center justify-center rounded-xl text-xs font-semibold text-primary transition hover:bg-primary/10 sm:h-10 sm:text-sm"
            >
              Ähli bildirişleri gör
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}