import {
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  ChevronDown,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import NotificationBell from "../../../features/notifications/components/NotificationBell/NotificationBell";
import { useCommandPaletteStore } from "../../../store/commandPaletteStore";
import { useProfileStore } from "../../../store/profileStore";
import { signOut } from "../../../services/auth";
import { useGoalStore } from "../../../store/goalStore";
import { usePlannerStore } from "../../../store/plannerStore";
import { useWeeklyReviewStore } from "../../../store/weeklyReviewStore";
import { useNotificationStore } from "../../../store/notificationStore";
import { useSettingsStore } from "../../../store/settingsStore";
import { useCurrencyRateStore } from "../../../store/currencyRateStore";

type TopbarProps = {
  onMenuOpen: () => void;
};

export default function Topbar({
  onMenuOpen,
}: TopbarProps) {

  const clearLocalRates = useCurrencyRateStore(
  (state) => state.clearLocalRates,
);
  
  const clearLocalPlanner = usePlannerStore(
  (state) => state.clearLocalPlanner,
);

const clearLocalSettings = useSettingsStore(
  (state) => state.clearLocalSettings,
);

const clearLocalNotifications =
  useNotificationStore(
    (state) =>
      state.clearLocalNotifications,
  );

const clearLocalReviews = useWeeklyReviewStore(
  (state) => state.clearLocalReviews,
);
  const clearLocalGoal = useGoalStore(
  (state) => state.clearLocalGoal,
);

  const navigate = useNavigate();

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  const profileMenuRef =
    useRef<HTMLDivElement>(null);

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

  const resetProfile =
    useProfileStore(
      (state) => state.resetProfile,
    );

  const profileInitial =
    profileName
      .trim()
      .charAt(0)
      .toUpperCase() || "Ö";

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setProfileMenuOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  function openProfile() {
    setProfileMenuOpen(false);
    navigate("/profile");
  }

  function openSettings() {
    setProfileMenuOpen(false);
    navigate("/settings");
  }

  async function handleSignOut() {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);

     await signOut();

clearLocalGoal();
clearLocalPlanner();
clearLocalReviews();
clearLocalNotifications();
clearLocalSettings();
clearLocalRates();

resetProfile();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Hasapdan çykmak başartmady:",
        error,
      );

      setIsSigningOut(false);
    }
  }

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
      {/* LEFT */}
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

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        {/* DESKTOP SEARCH */}
        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Gözleg aç"
          className="
            group hidden h-10 w-[300px]
            items-center gap-3
            rounded-xl
            border border-border/80
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
              shrink-0
              text-text-muted
              transition-colors duration-200
              group-hover:text-primary
            "
          />

          <span className="flex-1 text-sm text-text-muted">
            Gözleg...
          </span>

          <span
            className="
              rounded-md
              border border-border
              bg-background/70
              px-2 py-1
              text-[10px] font-semibold
              text-text-disabled
            "
          >
            Ctrl K
          </span>
        </button>

        {/* MOBILE SEARCH */}
        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Gözleg aç"
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
          <Search size={18} />
        </button>

        {/* NOTIFICATIONS */}
        <div className="relative">
          <NotificationBell />
        </div>

        {/* PROFILE */}
        <div
          ref={profileMenuRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setProfileMenuOpen(
                (current) => !current,
              )
            }
            aria-expanded={profileMenuOpen}
            aria-label="Profil menýusyny aç"
            className={`
              ml-0.5 flex h-10
              cursor-pointer items-center gap-3
              rounded-xl border
              bg-surface/60
              px-1.5 text-left
              transition-all duration-200
              sm:px-2 md:pr-2.5

              ${
                profileMenuOpen
                  ? "border-primary/35 bg-surface"
                  : "border-border/80 hover:border-primary/30 hover:bg-surface"
              }
            `}
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
                {profileRole ||
                  "Şahsy profil"}
              </p>
            </div>

            <ChevronDown
              size={15}
              className={`
                hidden shrink-0
                text-text-muted
                transition-transform
                duration-200
                md:block
                ${
                  profileMenuOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

          {/* DROPDOWN */}
          {profileMenuOpen && (
            <div
              className="
                absolute right-0 top-[calc(100%+10px)]
                z-50
                w-[280px]
                overflow-hidden
                rounded-2xl
                border border-border/90
                bg-background/95
                p-2
                shadow-[0_24px_70px_rgba(0,0,0,0.38)]
                backdrop-blur-2xl
                animate-[profileMenuIn_180ms_ease-out_both]
              "
            >
              {/* USER INFO */}
              <div className="px-3 pb-3 pt-2">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-11 w-11 shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-primary
                      text-base font-black
                      text-slate-950
                    "
                  >
                    {profileInitial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-text-primary">
                      {profileName ||
                        "ÖSÜŞ ulanyjysy"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-text-muted">
                      {profileRole ||
                        "Şahsy profil"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mx-2 h-px bg-border/70" />

              {/* PROFILE */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={openProfile}
                  className="
                    group flex w-full
                    items-center gap-3
                    rounded-xl
                    px-3 py-2.5
                    text-left
                    transition-colors
                    hover:bg-surface
                  "
                >
                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-lg
                      bg-surface
                      text-text-muted
                      transition-colors
                      group-hover:text-primary
                    "
                  >
                    <UserRound size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Profilim
                    </p>

                    <p className="mt-0.5 text-[11px] text-text-muted">
                      Şahsy maglumatlary dolandyr
                    </p>
                  </div>
                </button>

                {/* SETTINGS */}
                <button
                  type="button"
                  onClick={openSettings}
                  className="
                    group flex w-full
                    items-center gap-3
                    rounded-xl
                    px-3 py-2.5
                    text-left
                    transition-colors
                    hover:bg-surface
                  "
                >
                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-lg
                      bg-surface
                      text-text-muted
                      transition-colors
                      group-hover:text-primary
                    "
                  >
                    <Settings size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Sazlamalar
                    </p>

                    <p className="mt-0.5 text-[11px] text-text-muted">
                      Programma sazlamalary
                    </p>
                  </div>
                </button>
              </div>

              <div className="mx-2 h-px bg-border/70" />

              {/* LOGOUT */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    void handleSignOut()
                  }
                  disabled={isSigningOut}
                  className="
                    group flex w-full
                    items-center gap-3
                    rounded-xl
                    px-3 py-2.5
                    text-left
                    transition-colors
                    hover:bg-red-400/[0.07]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-lg
                      bg-red-400/[0.07]
                      text-red-400
                    "
                  >
                    <LogOut size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-red-300">
                      {isSigningOut
                        ? "Çykylýar..."
                        : "Hasapdan çyk"}
                    </p>

                    <p className="mt-0.5 text-[11px] text-text-muted">
                      Bu enjamdaky sessiýany ýap
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes profileMenuIn {
            from {
              opacity: 0;
              transform: translateY(-6px) scale(0.98);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </header>
  );
}