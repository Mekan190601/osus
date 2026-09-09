import {
  CalendarDays,
  LayoutDashboard,
  Menu,
  Target,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { ROUTES } from "../../app/routePaths";
import { useTranslation } from "../../hooks/useTranslation";

type MobileBottomNavProps = {
  onMoreOpen: () => void;
};

export default function MobileBottomNav({
  onMoreOpen,
}: MobileBottomNavProps) {
  const { t } = useTranslation();

  const items = [
    {
      icon: LayoutDashboard,
      label: t.nav.dashboard,
      path: ROUTES.dashboard,
    },
    {
      icon: CalendarDays,
      label: t.nav.planner,
      path: ROUTES.planner,
    },
    {
      icon: Wallet,
      label: t.nav.finance,
      path: ROUTES.finance,
    },
    {
      icon: Target,
      label: t.nav.goals,
      path: ROUTES.goals,
    },
  ];

  return (
    <nav
      aria-label="Mobil esasy menýu"
      className="
        fixed inset-x-0 bottom-0 z-30
        border-t border-border
        bg-background/95
        px-2 pb-[max(env(safe-area-inset-bottom),0.4rem)] pt-1.5
        shadow-[0_-10px_30px_rgba(0,0,0,0.08)]
        backdrop-blur-xl
        lg:hidden
      "
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-surface hover:text-text-primary",
                ].join(" ")
              }
            >
              <Icon size={20} strokeWidth={2} />
              <span className="w-full truncate text-center">
                {item.label}
              </span>
            </NavLink>
          );
        })}

        <button
          type="button"
          onClick={onMoreOpen}
          className="
            flex min-w-0 flex-col items-center justify-center
            gap-1 rounded-xl px-1 py-2
            text-[10px] font-semibold text-text-muted
            transition
            hover:bg-surface hover:text-text-primary
          "
          aria-label="Ýene menýusyny aç"
        >
          <Menu size={20} strokeWidth={2} />
          <span className="w-full truncate text-center">
            Ýene
          </span>
        </button>
      </div>
    </nav>
  );
}
