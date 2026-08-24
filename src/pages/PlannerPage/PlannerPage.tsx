import {
  CalendarDays,
} from "lucide-react";


import EisenhowerMatrix from "../../features/planner/components/EisenhowerMatrix/EisenhowerMatrix";
import PlannerDateNavigator from "../../features/planner/components/PlannerDateNavigator/PlannerDateNavigator";
import PlannerGoalTree from "../../features/planner/components/PlannerGoalTree/PlannerGoalTree";
import PlannerStats from "../../features/planner/components/PlannerStats/PlannerStats";
import PlannerTabs from "../../features/planner/components/PlannerTabs/PlannerTabs";
import TaskForm from "../../features/planner/components/TaskForm/TaskForm";
import { usePlannerStore } from "../../store/plannerStore";
import { useTranslation } from "../../hooks/useTranslation";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";



export default function PlannerPage() {
  const [searchParams, setSearchParams] =
  useSearchParams();

  const taskFormRef = useRef<HTMLDivElement | null>(null);
  
  const { t } = useTranslation();
  const activePeriod = usePlannerStore(
    (state) => state.activePeriod,
  );
 useEffect(() => {
  if (searchParams.get("action") !== "new") {
    return;
  }

  const timer = window.setTimeout(() => {
    taskFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setSearchParams({}, { replace: true });
  }, 150);

  return () => {
    window.clearTimeout(timer);
  };
}, [searchParams, setSearchParams]);
  const setActivePeriod = usePlannerStore(
    (state) => state.setActivePeriod,
  );
  

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <CalendarDays size={18} />

              <span className="text-sm font-semibold">
                {t.planner.title}
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {t.planner.todayPlan}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-text-muted sm:text-base">
              {t.planner.pageDescription}
            </p>
          </div>

          <PlannerTabs
            activePeriod={activePeriod}
            onChange={setActivePeriod}
          />
        </div>
      </section>

      <PlannerDateNavigator period={activePeriod} />

      <PlannerStats period={activePeriod} />

      <div
  ref={taskFormRef}
  className="scroll-mt-24"
>
  <TaskForm />
</div>

      <EisenhowerMatrix period={activePeriod} />

      <PlannerGoalTree />
      
    </div>
  
  );
}