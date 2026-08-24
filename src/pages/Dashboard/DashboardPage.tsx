import AIAdviceCard from "../../features/dashboard/components/AIAdviceCard/AIAdviceCard";
import WelcomeHero from "../../features/dashboard/components/WelcomeHero/WelcomeHero";
import FinanceSummary from "../../features/finance/components/FinanceSummary/FinanceSummary";
import ExecutiveProgress from "../../features/dashboard/components/ExecutiveProgress/ExecutiveProgress";
import TodayFocus from "../../features/dashboard/components/TodayFocus/TodayFocus";
import TodayStats from "../../features/dashboard/components/TodayStats/TodayStats";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export default function DashboardPage() {
  const [searchParams, setSearchParams] =
  useSearchParams();

const todayFocusRef =
  useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  if (
    searchParams.get("focus") !==
    "today"
  ) {
    return;
  }

  const timer =
    window.setTimeout(() => {
      todayFocusRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setSearchParams(
        {},
        {
          replace: true,
        },
      );
    }, 150);

  return () => {
    window.clearTimeout(timer);
  };
}, [
  searchParams,
  setSearchParams,
]);
  return (
    <div className="space-y-6 pb-10 lg:space-y-8">
      <WelcomeHero />

      <div
  ref={todayFocusRef}
  className="scroll-mt-24"
>
  <TodayFocus />
</div>

      <TodayStats />

<ExecutiveProgress />

<div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2">
  <FinanceSummary />
  <AIAdviceCard />
</div>
    </div>
  );
}