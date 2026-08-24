import {
  BarChart3,
  Brain,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  Target,
  Wallet,
  X,
} from "lucide-react";
import {
  NavLink,
  useLocation,
} from "react-router-dom";

import { ROUTES } from "../../app/routePaths";
import { useTranslation } from "../../hooks/useTranslation";

type SidebarProps = {
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

export default function Sidebar({
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const location = useLocation();
  const { t } = useTranslation();

  const primaryItems = [
    {
      icon: LayoutDashboard,
      text: t.nav.dashboard,
      path: ROUTES.dashboard,
    },
    {
      icon: Target,
      text: t.nav.goals,
      path: ROUTES.goals,
    },
    {
      icon: Wallet,
      text: t.nav.finance,
      path: ROUTES.finance,
    },
    {
      icon: CalendarDays,
      text: t.nav.planner,
      path: ROUTES.planner,
    },
  ];

  const insightItems = [
    {
      icon: BarChart3,
      text: t.nav.analytics,
      path: ROUTES.analytics,
    },
    {
      icon: Brain,
      text: t.nav.aiCoach,
      path: ROUTES.aiCoach,
    },
    {
      icon: ClipboardCheck,
      text: "Hepdelik syn",
      path: ROUTES.weeklyReview,
    },
    {
      icon: Settings,
      text: t.nav.settings,
      path: ROUTES.settings,
    },
  ];

  function renderItem(item: {
    icon: typeof LayoutDashboard;
    text: string;
    path: string;
  }) {
    const Icon = item.icon;

    const isActive =
      location.pathname === item.path;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onMobileClose}
        className={[
          "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-sidebar-text hover:bg-sidebar-hover hover:text-white",
        ].join(" ")}
      >
        <Icon
          size={18}
          className={[
            "shrink-0 transition",
            isActive
              ? "text-primary"
              : "text-sidebar-text-muted group-hover:text-white",
          ].join(" ")}
        />

        <span className="truncate">
          {item.text}
        </span>
      </NavLink>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="Menýuny ýap"
        onClick={onMobileClose}
        className={[
          "fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          isMobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      <aside
        className={[
          `
            fixed inset-y-0 left-0 z-50
            flex h-screen w-[82vw] max-w-[300px]
            shrink-0 flex-col
            border-r border-border
            bg-sidebar
            shadow-2xl
            transition-transform duration-300 ease-out
            lg:sticky lg:top-0 lg:z-auto
            lg:w-64 lg:max-w-none
            lg:translate-x-0 lg:shadow-none
          `,
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6 sm:py-6">
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-primary">
              {t.common.appName}
            </h1>

            <p className="mt-2 text-xs leading-5 text-sidebar-text-muted">
              {t.common.appDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Menýuny ýap"
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl
              border border-border
              bg-surface/10
              text-sidebar-text-muted
              transition
              hover:bg-sidebar-hover
              hover:text-white
              lg:hidden
            "
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {primaryItems.map(renderItem)}
          </div>

          <div className="my-4 h-px bg-border/60" />

          <div className="space-y-1">
            {insightItems.map(renderItem)}
          </div>
        </nav>

        <div className="border-t border-border p-4">
          <div className="rounded-xl border border-border bg-surface/10 p-4">
            <p className="text-xs font-semibold text-white">
              {t.common.appName}
            </p>

            <p className="mt-1 text-[11px] leading-5 text-sidebar-text-muted">
              {t.common.appDescription}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}