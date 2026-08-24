import {
  CalendarCheck2,
  Lightbulb,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

import { useGoalStore } from "../../../../store/goalStore";
import { usePlannerStore } from "../../../../store/plannerStore";

import {
  calculateFinancialProgress,
  calculateTaskTreeProgress,
  calculateExecutiveProgress,
} from "../../../analytics/utils/analytics";

export default function GoalExecutiveProgress() {
  const goalId = useGoalStore(
    (state) => state.goalId,
  );

  const targetMoney = useGoalStore(
    (state) => state.targetMoney,
  );

  const currentMoney = useGoalStore(
    (state) => state.currentMoney,
  );

  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const linkedYearlyGoal = tasks.find(
    (task) =>
      task.period === "yearly" &&
      task.sourceGoalId === goalId,
  );

  const financialProgress =
    calculateFinancialProgress(
      currentMoney,
      targetMoney,
    );

  const taskProgress = linkedYearlyGoal
    ? calculateTaskTreeProgress(
        tasks,
        linkedYearlyGoal.id,
      )
    : 0;

  const overallProgress =
    calculateExecutiveProgress(
      financialProgress,
      taskProgress,
    );

  const nextStep = !linkedYearlyGoal
    ? "Maksady meýilnama bilen bagla we ilkinji möhüm işi goş."
    : taskProgress === 0
      ? "Maksada ýakynlaşmak üçin meýilnamadaky ilkinji möhüm işi başla."
      : taskProgress < 50
        ? "Gowy başlangyç. Indiki möhüm işi ýerine ýetirip ösüşi dowam etdir."
        : taskProgress < 100
          ? "Maksada barýan işleriň ýarysyndan gowragy ýerine ýetirildi. Depgini sakla."
          : "Maksada degişli meýilleşdirilen işler ýerine ýetirildi.";

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 14,
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
        rounded-3xl
        border border-border
        bg-surface
        p-6
        shadow-[var(--app-shadow)]
      "
    >
      {/* SOFT BACKGROUND */}
      <div
        className="
          pointer-events-none
          absolute -right-24 -top-24
          h-64 w-64
          rounded-full
          bg-violet-500/[0.05]
          blur-3xl
        "
      />

      <div className="relative z-10">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-violet-400">
              <CalendarCheck2 size={17} />

              <span className="text-sm font-semibold">
                Maksada barýan işler
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
              Işleriň ösüşi
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Maksada ýetmek üçin meýilleşdirilen
              işleriň nähili öňe barýandygyny gör.
            </p>
          </div>

          <div
            className="
              hidden h-11 w-11
              shrink-0 items-center
              justify-center rounded-xl
              border border-violet-400/15
              bg-violet-500/10
              text-violet-400
              sm:flex
            "
          >
            <Target size={19} />
          </div>
        </div>

        {/* PROGRESS */}

        <div
          className="
            mt-6 grid
            grid-cols-1 gap-4
            lg:grid-cols-[1fr_1.15fr]
          "
        >
          {/* TASK PROGRESS */}

          <motion.div
            whileHover={{ y: -2 }}
            transition={{
              duration: 0.2,
            }}
            className="
              rounded-2xl
              border border-violet-400/15
              bg-violet-500/[0.035]
              p-5
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-violet-400/15
                  bg-violet-500/10
                  text-violet-400
                "
              >
                <CalendarCheck2 size={18} />
              </div>

              <span className="text-3xl font-bold text-violet-400">
                {taskProgress}%
              </span>
            </div>

            <p className="mt-5 font-semibold text-text-primary">
              Ýerine ýetirilen işler
            </p>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              Maksada degişli meýilleşdirilen
              işleriň tamamlanan bölegi.
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-background">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${taskProgress}%`,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                  ease: "easeOut",
                }}
                className="
                  h-full rounded-full
                  bg-violet-500
                "
              />
            </div>
          </motion.div>

          {/* OVERALL + NEXT STEP */}

          <motion.div
            whileHover={{ y: -2 }}
            transition={{
              duration: 0.2,
            }}
            className="
              rounded-2xl
              border border-success/15
              bg-success/[0.025]
              p-5
            "
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-success">
                  Umumy ösüş
                </p>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Maksadyň häzirki umumy ýagdaýy.
                </p>
              </div>

              <span className="text-3xl font-bold text-success">
                {overallProgress}%
              </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-background">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${overallProgress}%`,
                }}
                transition={{
                  duration: 0.85,
                  delay: 0.2,
                  ease: "easeOut",
                }}
                className="
                  h-full rounded-full
                  bg-gradient-to-r
                  from-violet-500
                  to-success
                "
              />
            </div>

            <div
              className="
                mt-5 flex items-start gap-3
                border-t border-border/70
                pt-4
              "
            >
              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-warning/10
                  text-warning
                "
              >
                <Lightbulb size={17} />
              </div>

              <div>
                <p className="text-xs font-semibold text-warning">
                  Indiki ädim
                </p>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  {nextStep}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {!linkedYearlyGoal && (
          <div
            className="
              mt-4 rounded-xl
              border border-warning/15
              bg-warning/[0.035]
              px-4 py-3
            "
          >
            <p className="text-sm leading-6 text-warning">
              Işleriň ösüşini görmek üçin maksady
              meýilnama bilen bagla.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}