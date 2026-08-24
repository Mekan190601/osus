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
        rounded-2xl
        border border-violet-400/15
        bg-surface
        p-5
        shadow-[var(--app-shadow)]
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
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div className="flex items-start gap-4">
            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                linkedPlannerGoal
                  ? "border-success/20 bg-success/10 text-success"
                  : "border-violet-400/20 bg-violet-500/10 text-violet-400",
              ].join(" ")}
            >
              {linkedPlannerGoal ? (
                <CheckCircle2 size={20} />
              ) : (
                <Link2 size={20} />
              )}
            </div>

            <div>
              <p
                className={[
                  "text-sm font-semibold",
                  linkedPlannerGoal
                    ? "text-success"
                    : "text-violet-400",
                ].join(" ")}
              >
                {linkedPlannerGoal
                  ? "Meýilnama bilen baglanyşdyryldy"
                  : "Meýilnama bilen baglanyşyk"}
              </p>

              <h3 className="mt-1 text-xl font-bold text-text-primary">
                {linkedPlannerGoal
                  ? "Maksadyň işleri bilen baglanyşyk taýýar"
                  : "Maksady meýilnama bilen bagla"}
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                {linkedPlannerGoal
                  ? "Indi maksada degişli işleri ýerine ýetirdigiňçe umumy ösüş awtomatik täzelener."
                  : "Maksady ýyllyk meýilnama bilen bagla. Şondan soň ýerine ýetirilen işler ösüş hasabyna goşular."}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {!linkedPlannerGoal ? (
              <button
                type="button"
                onClick={
                  handleCreatePlannerGoal
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
                <Link2 size={16} />
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
                    inline-flex h-10
                    items-center gap-2
                    rounded-xl
                    border border-border
                    bg-background/40
                    px-4
                    text-sm font-semibold
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
                group inline-flex h-10
                items-center gap-2
                rounded-xl
                border border-border
                bg-background/40
                px-4
                text-sm font-semibold
                text-text-primary
                transition
                hover:border-violet-400/30
                hover:text-violet-400
              "
            >
              Meýilnamany aç

              <ArrowRight
                size={16}
                className="
                  transition-transform
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