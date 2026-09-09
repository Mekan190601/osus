import {
  ArrowRight,
  CheckCircle2,
  Link2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../../app/routePaths";
import { useGoalStore } from "../../../../store/goalStore";
import { usePlannerStore } from "../../../../store/plannerStore";
import { getPlannerDateKey } from "../../../planner/utils/plannerDate";

export default function GoalPlannerBridge() {
  const goalId = useGoalStore(
    (state) => state.goalId,
  );

  const mainGoal = useGoalStore(
    (state) => state.mainGoal,
  );

  const deadline = useGoalStore(
    (state) => state.deadline,
  );

  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const addTask = usePlannerStore(
    (state) => state.addTask,
  );

  const updateTask = usePlannerStore(
    (state) => state.updateTask,
  );

  const setFocusedTaskId = usePlannerStore(
    (state) => state.setFocusedTaskId,
  );

  const linkedPlannerGoal = tasks.find(
    (task) =>
      task.period === "yearly" &&
      task.sourceGoalId === goalId,
  );

  function handleCreatePlannerGoal() {
    const cleanGoal = mainGoal.trim();

    if (!cleanGoal) {
      return;
    }

    if (linkedPlannerGoal) {
      setFocusedTaskId(
        linkedPlannerGoal.id,
      );

      return;
    }

    const plannerDate =
      deadline &&
      !Number.isNaN(
        new Date(deadline).getTime(),
      )
        ? new Date(deadline)
        : new Date();

    addTask({
      title: cleanGoal,
      description:
        "Esasy maksat bilen baglanyşykly ýyllyk meýilnama.",
      period: "yearly",
      quadrant: "important-not-urgent",
      dateKey: getPlannerDateKey(
        plannerDate,
        "yearly",
      ),
      parentTaskId: null,
      sourceGoalId: goalId,
    });
  }

  function handleSyncPlannerGoal() {
    if (!linkedPlannerGoal) {
      return;
    }

    const cleanGoal = mainGoal.trim();

    if (!cleanGoal) {
      return;
    }

    updateTask(
      linkedPlannerGoal.id,
      {
        title: cleanGoal,
      },
    );
  }

  function handleFocusGoal() {
    if (!linkedPlannerGoal) {
      return;
    }

    setFocusedTaskId(
      linkedPlannerGoal.id,
    );
  }

  if (!mainGoal.trim()) {
    return null;
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="
        relative overflow-hidden
        rounded-[20px]
        border border-violet-400/15
        bg-surface
        p-4
        shadow-[var(--app-shadow)]
        sm:rounded-2xl
        sm:p-5
      "
    >
      <div
        className="
          pointer-events-none
          absolute -right-16 -top-20
          h-44 w-44
          rounded-full
          bg-violet-500/[0.06]
          blur-3xl
        "
      />

      <div className="relative z-10">
        <div className="flex flex-col gap-3 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div className="flex items-start gap-2.5 sm:gap-4">
            <div
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border sm:h-11 sm:w-11 sm:rounded-xl",
                linkedPlannerGoal
                  ? "border-success/20 bg-success/10 text-success"
                  : "border-violet-400/20 bg-violet-500/10 text-violet-400",
              ].join(" ")}
            >
              {linkedPlannerGoal ? (
                <CheckCircle2 size={15} className="sm:h-5 sm:w-5" />
              ) : (
                <Link2 size={15} className="sm:h-5 sm:w-5" />
              )}
            </div>

            <div>
              <p
                className={[
                  "text-[9px] font-semibold sm:text-sm",
                  linkedPlannerGoal
                    ? "text-success"
                    : "text-violet-400",
                ].join(" ")}
              >
                {linkedPlannerGoal
                  ? "Meýilnama bilen baglanyşdyryldy"
                  : "Meýilnama bilen baglanyşyk"}
              </p>

              <h3 className="mt-0.5 text-[15px] font-bold leading-5 text-text-primary sm:mt-1 sm:text-xl sm:leading-normal">
                {linkedPlannerGoal
                  ? "Maksadyň işleri bilen baglanyşyk taýýar"
                  : "Maksady meýilnama bilen bagla"}
              </h3>

              <p className="mt-1 max-w-2xl text-[10px] leading-4 text-text-muted sm:mt-2 sm:text-sm sm:leading-6">
                {linkedPlannerGoal
                  ? "Indi maksada degişli işleri ýerine ýetirdigiňçe umumy ösüş awtomatik täzelener."
                  : "Maksady ýyllyk meýilnama bilen bagla. Şondan soň ýerine ýetirilen işler ösüş hasabyna goşular."}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            {!linkedPlannerGoal ? (
              <button
                type="button"
                onClick={
                  handleCreatePlannerGoal
                }
                className="
                  col-span-2
                  inline-flex h-9
                  items-center justify-center gap-1.5
                  rounded-lg
                  bg-primary px-3
                  text-[10px] font-semibold
                  sm:col-span-1
                  sm:h-10 sm:gap-2
                  sm:rounded-xl sm:px-4
                  sm:text-sm
                  text-slate-950
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-primary-hover
                "
              >
                <Link2 size={14} className="sm:h-4 sm:w-4" />
                Meýilnama bilen bagla
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={
                    handleFocusGoal
                  }
                  className="
                    inline-flex h-10
                    items-center gap-2
                    rounded-xl
                    bg-primary px-4
                    text-sm font-semibold
                    text-slate-950
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:bg-primary-hover
                  "
                >
                  Esasy iş hökmünde görkez
                </button>

                <button
                  type="button"
                  onClick={
                    handleSyncPlannerGoal
                  }
                  className="
                    inline-flex h-9
                    items-center justify-center gap-1.5
                    rounded-lg
                    border border-border
                    bg-background/40
                    px-3
                    text-[10px] font-semibold
                    sm:h-10 sm:gap-2
                    sm:rounded-xl sm:px-4
                    sm:text-sm
                    text-text-primary
                    transition
                    hover:border-violet-400/30
                    hover:text-violet-400
                  "
                >
                  Adyny täzele
                </button>
              </>
            )}

            <Link
              to={ROUTES.planner}
              className="
                group inline-flex h-9
                items-center justify-center gap-1.5
                rounded-lg
                border border-border
                bg-background/40
                px-3
                text-[10px] font-semibold
                sm:h-10 sm:gap-2
                sm:rounded-xl sm:px-4
                sm:text-sm
                text-text-primary
                transition
                hover:border-violet-400/30
                hover:text-violet-400
              "
            >
              Meýilnamany aç

              <ArrowRight
                size={14}
                className="
                  transition-transform
                  sm:h-4 sm:w-4
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}