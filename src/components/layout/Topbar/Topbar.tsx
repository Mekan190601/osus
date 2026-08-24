import {
  Menu,
  Search,
} from "lucide-react";

import NotificationBell from "../../../features/notifications/components/NotificationBell/NotificationBell";
import { useCommandPaletteStore } from "../../../store/commandPaletteStore";
import { useProfileStore } from "../../../store/profileStore";

type TopbarProps = {
  onMenuOpen: () => void;
};

export default function Topbar({
  onMenuOpen,
}: TopbarProps) {
  const openCommandPalette =
    useCommandPaletteStore(
      (state) => state.open,
    );

  const profileName =
    useProfileStore(
      (state) => state.name,
    );

  const profileRole =
    useProfileStore(
      (state) => state.role,
    );

  const profileInitial =
    profileName
      .trim()
      .charAt(0)
      .toUpperCase() || "Ö";

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-16 items-center justify-between
        border-b border-border/80
        bg-background/90
        px-3 backdrop-blur-xl
        sm:h-20 sm:px-6
        lg:px-8
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Menýuny aç"
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl
            border border-border
            bg-surface/40
            text-text-muted
            transition-all duration-200
            hover:border-primary/30
            hover:bg-surface
            hover:text-primary
            lg:hidden
          "
        >
          <Menu size={19} />
        </button>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/70 sm:text-[11px] sm:tracking-[0.18em]">
            ÖSÜŞ
          </p>

          <h2 className="mt-0.5 hidden truncate text-sm font-semibold text-text-primary sm:block sm:text-base lg:text-lg">
            Şahsy ösüş dolandyryş ulgamy
          </h2>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Gözleg aç"
          className="
            group hidden h-10 w-[300px]
            items-center gap-3
            rounded-xl border border-border/80
            bg-surface/40 px-3
            text-left
            transition-all duration-200
            hover:border-primary/30
            hover:bg-surface/80
            lg:flex
          "
        >
          <Search
            size={17}
            className="
              shrink-0 text-text-muted
              transition-colors duration-200
              group-hover:text-primary
            "
          />

          <span className="flex-1 text-sm text-text-muted">
            Gözleg...
          </span>

          <span
            className="
              rounded-md border border-border
              bg-background/70
              px-2 py-1
              text-[10px] font-semibold
              text-text-disabled
            "
          >
            Ctrl K
          </span>
        </button>

        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Gözleg aç"
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl border border-border
            bg-surface/40
            text-text-muted
            transition-all duration-200
            hover:border-primary/30
            hover:bg-surface
            hover:text-primary
            lg:hidden
          "
        >
          <Search size={18} />
        </button>

        <div className="relative">
          <NotificationBell />
        </div>

        <div
          className="
            ml-0.5 flex h-10 items-center gap-3
            rounded-xl border border-border/80
            bg-surface/60
            px-1.5
            transition-all duration-200
            hover:border-primary/20
            hover:bg-surface
            sm:px-2
            md:pr-3
          "
        >
          <div
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              bg-primary
              text-sm font-bold
              text-slate-950
              shadow-sm
            "
          >
            {profileInitial}
          </div>

          <div className="hidden min-w-0 leading-tight md:block">
            <p className="max-w-[120px] truncate text-sm font-semibold text-text-primary">
              {profileName || "Ulanyjy"}
            </p>

            <p className="mt-0.5 max-w-[120px] truncate text-[11px] text-text-muted">
              {profileRole || "Şahsy profil"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}