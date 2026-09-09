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
        rounded-[20px]
        border border-border
        bg-surface
        p-4
        shadow-[var(--app-shadow)]
        sm:rounded-3xl
        sm:p-6
      "
    >
      {/* SOFT BACKGROUND */}
      <div
        className="
          pointer-events-none
          absolute -right-24 -top-24
          h-48 w-48
          rounded-full
          bg-violet-500/[0.04]
          sm:h-64 sm:w-64
          sm:bg-violet-500/[0.05]
          blur-3xl
        "
      />

      <div className="relative z-10">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-3 sm:gap-6">
          <div>
            <div className="flex items-center gap-1.5 text-violet-400 sm:gap-2">
              <CalendarCheck2 size={14} className="sm:h-[17px] sm:w-[17px]" />

              <span className="text-[10px] font-semibold sm:text-sm">
                Maksada barýan işler
              </span>
            </div>

            <h2 className="mt-1 text-[17px] font-bold tracking-tight text-text-primary sm:mt-2 sm:text-2xl">
              Işleriň ösüşi
            </h2>

            <p className="mt-1 text-[10px] leading-4 text-text-muted sm:mt-2 sm:max-w-2xl sm:text-sm sm:leading-6">
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
            mt-3 grid
            grid-cols-1 gap-2
            sm:mt-6 sm:gap-4
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
              rounded-xl
              border border-violet-400/15
              bg-violet-500/[0.035]
              p-3
              sm:rounded-2xl
              sm:p-5
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-lg
                  sm:h-10 sm:w-10
                  sm:rounded-xl
                  border border-violet-400/15
                  bg-violet-500/10
                  text-violet-400
                "
              >
                <CalendarCheck2 size={15} className="sm:h-[18px] sm:w-[18px]" />
              </div>

              <span className="text-xl font-bold text-violet-400 sm:text-3xl">
                {taskProgress}%
              </span>
            </div>

            <p className="mt-2.5 text-xs font-semibold text-text-primary sm:mt-5 sm:text-base">
              Ýerine ýetirilen işler
            </p>

            <p className="mt-0.5 text-[9px] leading-4 text-text-muted sm:mt-1 sm:text-xs sm:leading-5">
              Maksada degişli meýilleşdirilen
              işleriň tamamlanan bölegi.
            </p>

            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-background sm:mt-5 sm:h-2">
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
              rounded-xl
              border border-success/15
              bg-success/[0.025]
              p-3
              sm:rounded-2xl
              sm:p-5
            "
          >
            <div className="flex items-start justify-between gap-3 sm:gap-5">
              <div>
                <p className="text-[10px] font-semibold text-success sm:text-sm">
                  Umumy ösüş
                </p>

                <p className="mt-0.5 text-[9px] leading-4 text-text-muted sm:mt-1 sm:text-xs sm:leading-5">
                  Maksadyň häzirki umumy ýagdaýy.
                </p>
              </div>

              <span className="text-xl font-bold text-success sm:text-3xl">
                {overallProgress}%
              </span>
            </div>

            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-background sm:mt-5 sm:h-2">
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
                mt-3 flex items-start gap-2
                border-t border-border/70
                pt-3
                sm:mt-5 sm:gap-3 sm:pt-4
              "
            >
              <div
                className="
                  flex h-7 w-7 shrink-0
                  items-center justify-center
                  rounded-lg
                  sm:h-9 sm:w-9
                  sm:rounded-xl
                  bg-warning/10
                  text-warning
                "
              >
                <Lightbulb size={14} className="sm:h-[17px] sm:w-[17px]" />
              </div>

              <div>
                <p className="text-[9px] font-semibold text-warning sm:text-xs">
                  Indiki ädim
                </p>

                <p className="mt-0.5 text-[10px] leading-4 text-text-secondary sm:mt-1 sm:text-sm sm:leading-6">
                  {nextStep}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {!linkedYearlyGoal && (
          <div
            className="
              mt-2 rounded-xl
              border border-warning/15
              bg-warning/[0.035]
              px-3 py-2.5
              sm:mt-4 sm:px-4 sm:py-3
            "
          >
            <p className="text-[10px] leading-4 text-warning sm:text-sm sm:leading-6">
              Işleriň ösüşini görmek üçin maksady
              meýilnama bilen bagla.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}