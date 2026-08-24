import { useEffect } from "react";

import { useSettingsStore } from "../../../../store/settingsStore";

export default function ThemeManager() {
  const theme = useSettingsStore(
    (state) => state.theme,
  );

  useEffect(() => {
    const root =
      document.documentElement;

    function applyTheme(
      isDark: boolean,
    ) {
      root.classList.toggle(
        "dark",
        isDark,
      );

      root.dataset.theme =
        isDark ? "dark" : "light";
    }

    if (theme === "dark") {
      applyTheme(true);
      return;
    }

    if (theme === "light") {
      applyTheme(false);
      return;
    }

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)",
      );

    applyTheme(
      mediaQuery.matches,
    );

    function handleSystemThemeChange(
      event: MediaQueryListEvent,
    ) {
      applyTheme(event.matches);
    }

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange,
      );
    };
  }, [theme]);

  return null;
}