import {
  CalendarDays,
} from "lucide-react";
import {
  useEffect,
  useRef,
} from "react";
import {
  useSearchParams,
} from "react-router-dom";

import EisenhowerMatrix from "../../features/planner/components/EisenhowerMatrix/EisenhowerMatrix";
import PlannerDateNavigator from "../../features/planner/components/PlannerDateNavigator/PlannerDateNavigator";
import PlannerGoalTree from "../../features/planner/components/PlannerGoalTree/PlannerGoalTree";
import PlannerStats from "../../features/planner/components/PlannerStats/PlannerStats";
import PlannerTabs from "../../features/planner/components/PlannerTabs/PlannerTabs";
import TaskForm from "../../features/planner/components/TaskForm/TaskForm";
import { useTranslation } from "../../hooks/useTranslation";
import { usePlannerStore } from "../../store/plannerStore";

export default function PlannerPage() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const taskFormRef =
    useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation();

  const activePeriod =
    usePlannerStore(
      (state) => state.activePeriod,
    );

  const setActivePeriod =
    usePlannerStore(
      (state) => state.setActivePeriod,
    );

  const loadPlanner =
    usePlannerStore(
      (state) => state.loadPlanner,
    );

  const isInitialized =
    usePlannerStore(
      (state) => state.isInitialized,
    );

  const isLoading =
    usePlannerStore(
      (state) => state.isLoading,
    );

  const plannerError =
    usePlannerStore(
      (state) => state.error,
    );

  useEffect(() => {
    void loadPlanner();
  }, [loadPlanner]);

  useEffect(() => {
    if (
      searchParams.get("action") !==
      "new"
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        taskFormRef.current?.scrollIntoView(
          {
            behavior: "smooth",
            block: "center",
          },
        );

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

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-[45vh] items-center justify-center">
        <div className="text-center">
          <div
            className="
              mx-auto h-7 w-7
              animate-spin rounded-full
              border-2 border-border
              border-t-primary
              sm:h-8 sm:w-8
            "
          />

          <p className="mt-3 text-xs text-text-muted sm:mt-4 sm:text-sm">
            Meýilnamaň ýüklenýär...
          </p>
        </div>
      </div>
    );
  }

  if (plannerError) {
    return (
      <div
        className="
          rounded-[20px]
          border border-danger/20
          bg-surface
          p-4
          sm:rounded-3xl
          sm:p-6
          lg:p-8
        "
      >
        <h2 className="text-base font-bold text-text-primary sm:text-lg">
          Meýilnamany ýükläp bolmady
        </h2>

        <p className="mt-1.5 text-xs text-text-muted sm:mt-2 sm:text-sm">
          {plannerError}
        </p>

        <button
          type="button"
          onClick={() => {
            void loadPlanner();
          }}
          className="
            mt-4 h-9
            rounded-lg
            bg-primary
            px-4
            text-xs font-bold
            text-slate-950
            sm:mt-5
            sm:h-auto
            sm:rounded-xl
            sm:px-5 sm:py-3
            sm:text-sm
          "
        >
          Täzeden synanş
        </button>
      </div>
    );
  }

  return (
    <div
      className="
        space-y-3
        pb-6
        sm:space-y-4
        sm:pb-8
        lg:space-y-8
        lg:pb-10
      "
    >
      {/* HEADER */}
      <section
        className="
          rounded-[20px]
          border border-border
          bg-surface
          p-4
          sm:rounded-3xl
          sm:p-6
          lg:p-8
        "
      >
        <div
          className="
            flex flex-col
            gap-3
            sm:gap-5
            lg:flex-row
            lg:items-end
            lg:justify-between
            lg:gap-6
          "
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-primary sm:gap-2">
              <CalendarDays
                size={15}
                className="sm:h-[18px] sm:w-[18px]"
              />

              <span className="text-[10px] font-semibold sm:text-sm">
                {t.planner.title}
              </span>
            </div>

            <h1
              className="
                mt-1
                text-[21px]
                font-bold
                leading-tight
                tracking-tight
                text-text-primary
                sm:mt-2
                sm:text-3xl
                lg:mt-3
                lg:text-4xl
              "
            >
              {t.planner.todayPlan}
            </h1>

            <p
              className="
                mt-1.5
                line-clamp-2
                max-w-3xl
                text-[10px]
                leading-[1.5]
                text-text-muted
                sm:mt-2
                sm:text-sm
                sm:leading-6
                lg:mt-3
                lg:line-clamp-none
                lg:text-base
                lg:leading-7
              "
            >
              {t.planner.pageDescription}
            </p>
          </div>

          <div className="min-w-0">
            <PlannerTabs
              activePeriod={activePeriod}
              onChange={setActivePeriod}
            />
          </div>
        </div>
      </section>

      {/* DATE */}
      <PlannerDateNavigator
        period={activePeriod}
      />

      {/* STATS */}
      <PlannerStats
        period={activePeriod}
      />

      {/* NEW TASK */}
      <div
        ref={taskFormRef}
        className="scroll-mt-20 lg:scroll-mt-24"
      >
        <TaskForm />
      </div>

      {/* MATRIX */}
      <EisenhowerMatrix
        period={activePeriod}
      />

      {/* GOAL TREE */}
      <PlannerGoalTree />
    </div>
  );
}