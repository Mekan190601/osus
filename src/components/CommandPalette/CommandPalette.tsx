import {
  BarChart3,
  Brain,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  Search,
  Settings,
  Target,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../app/routePaths";
import { useCommandPaletteStore } from "../../store/commandPaletteStore";

type CommandItem = {
  id: string;
  label: string;
  keywords: string[];
  icon: LucideIcon;

  path?: string;
  action?: () => void;
};

export default function CommandPalette() {
  const navigate = useNavigate();

  const isOpen = useCommandPaletteStore(
    (state) => state.isOpen,
  );

  const closePaletteStore =
    useCommandPaletteStore(
      (state) => state.close,
    );

  const togglePalette =
    useCommandPaletteStore(
      (state) => state.toggle,
    );

  const [query, setQuery] =
    useState("");

  const [activeIndex, setActiveIndex] =
    useState(0);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const commands =
    useMemo<CommandItem[]>(
      () => [
        {
          id: "dashboard",
          label: "Baş sahypa",
          keywords: [
            "dashboard",
            "home",
            "baş sahypa",
          ],
          path: ROUTES.dashboard,
          icon: LayoutDashboard,
        },

        {
          id: "goals",
          label: "Maksatlar",
          keywords: [
            "goal",
            "goals",
            "maksat",
            "maksatlar",
          ],
          path: ROUTES.goals,
          icon: Target,
        },

        {
          id: "add-goal",
          label: "Täze maksat goş",
          keywords: [
            "täze maksat",
            "maksat goş",
            "add goal",
          ],
          icon: Target,
          action: () => {
            navigate(
              `${ROUTES.goals}?action=new`,
            );
          },
        },

        {
          id: "finance",
          label: "Maliýe",
          keywords: [
            "finance",
            "money",
            "pul",
            "maliýe",
          ],
          path: ROUTES.finance,
          icon: Wallet,
        },

        {
          id: "planner",
          label: "Meýilnama",
          keywords: [
            "planner",
            "plan",
            "task",
            "iş",
            "meýilnama",
          ],
          path: ROUTES.planner,
          icon: CalendarDays,
        },

        {
          id: "add-task",
          label: "Täze iş goş",
          keywords: [
            "täze iş",
            "iş goş",
            "task",
            "add task",
          ],
          icon: CalendarDays,
          action: () => {
            navigate(
              `${ROUTES.planner}?action=new`,
            );
          },
        },

        {
          id: "analytics",
          label: "Ösüş analizi",
          keywords: [
            "analytics",
            "analiz",
            "growth",
            "ösüş",
          ],
          path: ROUTES.analytics,
          icon: BarChart3,
        },

        {
          id: "ai-coach",
          label: "Akylly maslahatçy",
          keywords: [
            "ai",
            "coach",
            "maslahat",
            "akylly",
          ],
          path: ROUTES.aiCoach,
          icon: Brain,
        },

        {
          id: "weekly-review",
          label: "Hepdelik syn",
          keywords: [
            "weekly",
            "review",
            "hepde",
            "jemleme",
          ],
          path: ROUTES.weeklyReview,
          icon: ClipboardCheck,
        },

        {
          id: "settings",
          label: "Sazlamalar",
          keywords: [
            "settings",
            "setting",
            "sazlama",
            "sazlamalar",
          ],
          path: ROUTES.settings,
          icon: Settings,
        },
      ],
      [navigate],
    );

  const filteredCommands =
    useMemo(() => {
      const normalizedQuery =
        query
          .trim()
          .toLocaleLowerCase();

      if (!normalizedQuery) {
        return commands;
      }

      return commands.filter(
        (command) => {
          const searchableText = [
            command.label,
            ...command.keywords,
          ]
            .join(" ")
            .toLocaleLowerCase();

          return searchableText.includes(
            normalizedQuery,
          );
        },
      );
    }, [commands, query]);

  const closePalette = useCallback(() => {
    closePaletteStore();
    setQuery("");
    setActiveIndex(0);
  }, [closePaletteStore]);

  const openCommand = useCallback((
    command: CommandItem,
  ) => {
    if (command.action) {
      command.action();
      closePalette();
      return;
    }

    if (command.path) {
      navigate(command.path);
    }

    closePalette();
  }, [closePalette, navigate]);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      const isCommandKey =
        event.ctrlKey ||
        event.metaKey;

      if (
        isCommandKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        togglePalette();

        return;
      }

      if (!isOpen) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();

        closePalette();

        return;
      }

      if (
        event.key === "ArrowDown"
      ) {
        event.preventDefault();

        setActiveIndex(
          (current) => {
            if (
              filteredCommands.length ===
              0
            ) {
              return 0;
            }

            return Math.min(
              current + 1,
              filteredCommands.length -
                1,
            );
          },
        );

        return;
      }

      if (
        event.key === "ArrowUp"
      ) {
        event.preventDefault();

        setActiveIndex(
          (current) =>
            Math.max(
              current - 1,
              0,
            ),
        );

        return;
      }

      if (
        event.key === "Enter"
      ) {
        const command =
          filteredCommands[
            activeIndex
          ];

        if (command) {
          event.preventDefault();

          openCommand(command);
        }
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    activeIndex,
    filteredCommands,
    isOpen,
    togglePalette,
    closePalette,
    openCommand,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [isOpen]);


  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          closePalette();
        }
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search
            size={18}
            className="shrink-0 text-text-muted"
          />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Bölüm ýa-da hereket gözle..."
            className="h-14 min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-disabled"
          />

          <button
            type="button"
            onClick={closePalette}
            aria-label="Ýap"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-background hover:text-text-primary"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-2">
          {filteredCommands.length >
          0 ? (
            filteredCommands.map(
              (command, index) => {
                const Icon =
                  command.icon;

                const isActive =
                  activeIndex ===
                  index;

                return (
                  <button
                    key={command.id}
                    type="button"
                    onMouseEnter={() =>
                      setActiveIndex(
                        index,
                      )
                    }
                    onClick={() =>
                      openCommand(
                        command,
                      )
                    }
                    className={[
                      "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-text-secondary hover:bg-background/50",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-background text-text-muted",
                      ].join(" ")}
                    >
                      <Icon size={17} />
                    </div>

                    <span className="flex-1 text-sm font-semibold">
                      {command.label}
                    </span>

                    {isActive && (
                      <span className="text-[10px] font-medium text-text-muted">
                        Enter
                      </span>
                    )}
                  </button>
                );
              },
            )
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-semibold text-text-primary">
                Netije tapylmady
              </p>

              <p className="mt-2 text-xs text-text-muted">
                Başga söz bilen gözläp gör.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-[10px] text-text-disabled">
          <span>
            ↑ ↓ saýla · Enter aç
          </span>

          <span>
            Ctrl K · Esc ýap
          </span>
        </div>
      </div>
    </div>
  );
}