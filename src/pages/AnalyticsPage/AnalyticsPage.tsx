import { BarChart3 } from "lucide-react";

import AnalyticsKpis from "../../features/analytics/components/AnalyticsKpis/AnalyticsKpis";
import PlannerDistributionChart from "../../features/analytics/components/PlannerDistributionChart/PlannerDistributionChart";
import PeriodPerformance from "../../features/analytics/components/PeriodPerformance/PeriodPerformance";
import CompletionTrendChart from "../../features/analytics/components/CompletionTrendChart/CompletionTrendChart";
import FinanceAnalytics from "../../features/analytics/components/FinanceAnalytics/FinanceAnalytics";
import GoalFundingForecast from "../../features/analytics/components/GoalFundingForecast/GoalFundingForecast";
import DeadlineIntelligence from "../../features/analytics/components/DeadlineIntelligence/DeadlineIntelligence";

export default function AnalyticsPage() {
  return (
  <div className="space-y-6 lg:space-y-8">
    {/* HEADER */}
    <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex items-center gap-2 text-primary">
        <BarChart3 size={18} />

        <span className="text-sm font-semibold">
  Ösüş analizi
</span>
      </div>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        Ösüş analitikasy
      </h1>

     <p className="mt-3 max-w-3xl text-sm leading-7 text-text-muted sm:text-base">
  Maliýe, maksat we meýilnama maglumatlaryň boýunça umumy
  netijeleri bir ýerden gör.
</p>
    </section>

    {/* KPI OVERVIEW */}
    <section>
      <AnalyticsKpis />
    </section>

    {/* MAIN PERFORMANCE */}
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <CompletionTrendChart />

      <PeriodPerformance />
    </div>

    {/* FINANCE + GOAL FORECAST */}
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <FinanceAnalytics />

      <GoalFundingForecast />
    </div>

    {/* PLANNER ANALYTICS */}
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <PlannerDistributionChart />

      <DeadlineIntelligence />
    </div>
  </div>
);
}