import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "../components/layout/AppLayout/AppLayout";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import GoalsPage from "../pages/GoalsPage/GoalsPage";
import FinancePage from "../pages/FinancePage/FinancePage";
import PlannerPage from "../pages/PlannerPage/PlannerPage";
import AnalyticsPage from "../pages/AnalyticsPage/AnalyticsPage";
import OnboardingPage from "../pages/Onboarding/OnboardingPage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import AICoachPage from "../pages/AICoachPage/AICoachPage";
import NotificationsPage from "../pages/NotificationsPage/NotificationsPage";
import { useSettingsStore } from "../store/settingsStore";
import WeeklyReviewPage from "../pages/WeeklyReviewPage/WeeklyReviewPage";

import { ROUTES } from "./routePaths";

function StartPageRedirect() {
  const startPage = useSettingsStore(
    (state) => state.startPage,
  );

  const startPageMap = {
    dashboard: ROUTES.dashboard,
    planner: ROUTES.planner,
    analytics: ROUTES.analytics,
    "ai-coach": ROUTES.aiCoach,
  } as const;

  return (
    <Navigate
      to={startPageMap[startPage]}
      replace
    />
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/"
  element={<StartPageRedirect />}
/>

        <Route element={<AppLayout />}>
          <Route
            path={ROUTES.dashboard}
            element={<DashboardPage />}
          />
          <Route
  path={ROUTES.weeklyReview}
  element={<WeeklyReviewPage />}
/>

          <Route
  path={ROUTES.notifications}
  element={<NotificationsPage />}
/>

          <Route
            path={ROUTES.goals}
            element={<GoalsPage />}
          />

          <Route
            path={ROUTES.finance}
            element={<FinancePage />}
          />

          <Route
            path={ROUTES.planner}
            element={<PlannerPage />}
          />

          <Route
            path={ROUTES.analytics}
            element={<AnalyticsPage />}
          />

          <Route
            path={ROUTES.settings}
            element={<SettingsPage />}
          />

          <Route
  path={ROUTES.aiCoach}
  element={<AICoachPage />}
/>
        </Route>

        <Route
          path={ROUTES.onboarding}
          element={<OnboardingPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}