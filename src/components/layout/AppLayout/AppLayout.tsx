import {
  useEffect,
  useState,
} from "react";
import { Outlet } from "react-router-dom";

import {
  startSyncEngine,
  stopSyncEngine,
} from "../../../services/syncEngine";

import Sidebar from "../../Sidebar/Sidebar";
import Content from "../Content/Content";
import Topbar from "../Topbar/Topbar";

import NotificationEngine from "../../../features/notifications/components/NotificationEngine/NotificationEngine";
import ThemeManager from "../../../features/settings/components/ThemeManager/ThemeManager";
import CommandPalette from "../../CommandPalette/CommandPalette";
import CurrencyRateEngine from "../../../features/settings/components/CurrencyRateEngine/CurrencyRateEngine";

import { useGoalStore } from "../../../store/goalStore";
import { useFinanceStore } from "../../../store/financeStore";
import { usePlannerStore } from "../../../store/plannerStore";
import { useWeeklyReviewStore } from "../../../store/weeklyReviewStore";
import { useNotificationStore } from "../../../store/notificationStore";
import { useSettingsStore } from "../../../store/settingsStore";
import { useCurrencyRateStore } from "../../../store/currencyRateStore";

export default function AppLayout() {
  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  useEffect(() => {
  startSyncEngine();

  return () => {
    stopSyncEngine();
  };
}, []);

  const loadRates = useCurrencyRateStore(
  (state) => state.loadRates,
);

  const loadNotifications = useNotificationStore(
  (state) => state.loadNotifications,
);

const loadSettings = useSettingsStore(
  (state) => state.loadSettings,
);

  const loadReviews = useWeeklyReviewStore(
    
  (state) => state.loadReviews,
);

  const loadGoal = useGoalStore(
    (state) => state.loadGoal,
  );

  const loadFinance = useFinanceStore(
    (state) => state.loadFinance,
  );

  const loadPlanner = usePlannerStore(
    (state) => state.loadPlanner,
  );

  useEffect(() => {
  void Promise.all([
    loadGoal(),
    loadFinance(),
    loadPlanner(),
    loadReviews(),
    loadNotifications(),
    loadSettings(),
    loadRates(),
  ]);
}, [
  loadGoal,
  loadFinance,
  loadPlanner,
  loadReviews,
  loadNotifications,
  loadSettings,
  loadRates,
]);

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-background text-text-primary transition-colors duration-300">
      <ThemeManager />

      <CurrencyRateEngine />

      <NotificationEngine />

      <CommandPalette />

      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onMenuOpen={openMobileMenu}
        />

        <Content>
          <Outlet />
        </Content>
      </div>
    </div>
  );
}