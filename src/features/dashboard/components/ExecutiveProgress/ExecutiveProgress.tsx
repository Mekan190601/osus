import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarCheck2,
  CircleDollarSign,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../../app/routePaths";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useGoalStore } from "../../../../store/goalStore";
import { usePlannerStore } from "../../../../store/plannerStore";


import {
  calculateFinancialProgress,
} from "../../../analytics/utils/analytics";
import {
  calculateGrowthEngine,
} from "../../../analytics/utils/growthEngine";
import {
  calculateTaskProgress,
} from "../../../planner/utils/plannerProgress";

export default function ExecutiveProgress() {
  const { t } = useTranslation();

  const goalId = useGoalStore(
    (state) => state.goalId,
  );

  const mainGoal = useGoalStore(
    (state) => state.mainGoal,
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

  const plannerProgress =
    linkedYearlyGoal
      ? calculateTaskProgress(
          tasks,
          linkedYearlyGoal.id,
        )
      : 0;

  const growth = calculateGrowthEngine({
    financialProgress,
    plannerProgress,
  });

  const statusLabel = {
    behind: "Yza galýar",
    steady: "Kadaly depgin",
    good: "Gowy depgin",
    "near-goal": "Maksada ýakyn",
    completed: "Tamamlandy",
  }[growth.status];

  const statusClasses = {
    behind:
      "border-danger/20 bg-danger/10 text-danger",
    steady:
      "border-warning/20 bg-warning/10 text-warning",
    good:
      "border-success/20 bg-success/10 text-success",
    "near-goal":
      "border-info/20 bg-info/10 text-info",
    completed:
      "border-success/20 bg-success/10 text-success",
  }[growth.status];

  const nextAction = {
    behind:
      "Şu gün iň möhüm 1 işi tamamla we maliýe depgini ýokarlandyr.",
    steady:
      "Häzirki depgini sakla, ýöne möhüm işleri öňünden meýilleşdir.",
    good:
      "Gowy barýaň. Şu hepde esasy prioritetleriňi doly tamamlamaga fokus et.",
    "near-goal":
      "Maksat ýakyn. Täze işleri azalt we galan esasy ädimleri tamamla.",
    completed:
      "Maksat tamamlandy. Indiki täze maksady kesgitle.",
  }[growth.status];

  const overallProgress =
    growth.overallProgress;

  if (!mainGoal.trim()) {
    return (
      <motion.section
        initial={{
          opacity: 0,
          y: 16,
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
          border border-border
          bg-surface
          p-6
          shadow-[var(--app-shadow)]
        "
      >
        <div
          className="
            pointer-events-none
            absolute -right-20 -top-20
            h-52 w-52
            rounded-full
            bg-violet-500/[0.06]
            blur-3xl
          "
        />

        <div className="relative flex items-start gap-4">
          <div
            className="
              flex h-12 w-12 shrink-0
              items-center justify-center
              rounded-xl
              border border-violet-400/15
              bg-violet-500/10
              text-violet-400
            "
          >
            <BarChart3 size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-violet-400">
              {t.dashboard.overallProgress}
            </p>

            <h3 className="mt-2 text-xl font-bold text-text-primary">
              Strategik analiz üçin maksat gerek
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Esasy maksadyňy girizeniňden
              soň maliýe we Planner ösüşi
              birleşdirilip, umumy ösüş
              depginiň awtomatik hasaplanar.
            </p>

            <Link
              to={ROUTES.goals}
              className="
                group mt-5 inline-flex
                h-10 items-center gap-2
                rounded-xl
                bg-primary px-4
                text-sm font-semibold
                text-slate-950
                transition-all duration-200
                hover:-translate-y-0.5
                hover:bg-primary-hover
              "
            >
              Maksat döret

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
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="
        relative overflow-hidden
        rounded-3xl
        border border-border
        bg-surface
        p-5
        shadow-[var(--app-shadow)]
        sm:p-6
      "
    >
      {/* BACKGROUND ATMOSPHERE */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute -right-28 -top-28
            h-72 w-72
            rounded-full
            bg-violet-500/[0.055]
            blur-[90px]
          "
        />

        <div
          className="
            absolute -bottom-32 left-[25%]
            h-64 w-64
            rounded-full
            bg-info/[0.04]
            blur-[90px]
          "
        />
      </div>

      <div className="relative z-10">
        {/* HEADER */}

        <div
          className="
            flex flex-col gap-5
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-2 text-violet-400">
              <BarChart3 size={18} />

              <span className="text-sm font-semibold">
                {t.dashboard.overallProgress}
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
              Strategik ösüş merkezi
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Maliýe we Planner netijeleri
              birleşdirilip, maksadyň boýunça
              umumy ösüş depgini görkezilýär.
            </p>
          </div>

          <span
            className={[
              "inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-semibold",
              statusClasses,
            ].join(" ")}
          >
            {statusLabel}
          </span>
        </div>

        {/* MAIN GRID */}

        <div
          className="
            mt-6 grid grid-cols-1 gap-4
            xl:grid-cols-[0.9fr_1.1fr]
          "
        >
          {/* OVERALL SCORE */}

          <div
            className="
              relative overflow-hidden
              rounded-2xl
              border border-violet-400/15
              bg-violet-500/[0.035]
              p-5
              sm:p-6
            "
          >
            <div
              className="
                pointer-events-none
                absolute -right-16 -top-16
                h-44 w-44
                rounded-full
                bg-violet-500/10
                blur-3xl
              "
            />

            <div className="relative">
              <div className="flex items-center gap-2 text-violet-400">
                <Target size={17} />

                <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                  Umumy ösüş
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <motion.p
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: 0.15,
                    }}
                    className="
                      text-5xl font-black
                      tracking-[-0.05em]
                      text-text-primary
                      sm:text-6xl
                    "
                  >
                    {overallProgress}
                    <span className="ml-1 text-2xl font-bold text-violet-400">
                      %
                    </span>
                  </motion.p>

                  <p className="mt-2 text-sm text-text-muted">
                    Umumy ösüş derejesi
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs text-text-muted">
                    Esasy maksat
                  </p>

                  <p className="mt-1 max-w-[240px] truncate text-sm font-semibold text-text-primary">
                    {mainGoal}
                  </p>
                </div>
              </div>

              {/* overall progress */}

              <div className="mt-6">
                <div className="h-2.5 overflow-hidden rounded-full bg-background">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${overallProgress}%`,
                    }}
                    transition={{
                      duration: 0.95,
                      delay: 0.25,
                      ease: "easeOut",
                    }}
                    className="
                      h-full rounded-full
                      bg-gradient-to-r
                      from-violet-500
                      via-info
                      to-primary
                    "
                  />
                </div>

                <div className="mt-2 flex justify-between text-[10px] text-text-disabled">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* FINANCE + PLANNER */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* FINANCE */}

            <motion.div
              whileHover={{
                y: -3,
              }}
              className="
                rounded-2xl
                border border-info/15
                bg-info/[0.035]
                p-5
                transition-colors duration-200
                hover:border-info/25
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-xl
                    border border-info/15
                    bg-info/10
                    text-info
                  "
                >
                  <CircleDollarSign
                    size={19}
                  />
                </div>

                <span className="text-2xl font-bold text-info">
                  {financialProgress}%
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-text-primary">
                Maliýe ösüşi
              </p>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                Maksat puly boýunça häzirki
                maliýe depgini.
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-background">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${financialProgress}%`,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-info"
                />
              </div>
            </motion.div>

            {/* PLANNER */}

            <motion.div
              whileHover={{
                y: -3,
              }}
              className="
                rounded-2xl
                border border-violet-400/15
                bg-violet-500/[0.035]
                p-5
                transition-colors duration-200
                hover:border-violet-400/25
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-xl
                    border border-violet-400/15
                    bg-violet-500/10
                    text-violet-400
                  "
                >
                  <CalendarCheck2
                    size={19}
                  />
                </div>

                <span className="text-2xl font-bold text-violet-400">
                  {plannerProgress}%
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-text-primary">
                Meýilnama ösüşi
              </p>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                Maksada bagly işleriň ýerine
                ýetiriliş derejesi.
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-background">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${plannerProgress}%`,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.36,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-violet-500"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* AI NEXT ACTION */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.35,
          }}
          className="
            mt-4
            rounded-2xl
            border border-violet-400/15
            bg-gradient-to-r
            from-violet-500/[0.06]
            via-background/30
            to-info/[0.04]
            p-5
          "
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  border border-violet-400/15
                  bg-violet-500/10
                  text-violet-400
                "
              >
                <Brain size={18} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-400">
                    Indiki ädim
                  </p>

                  <Sparkles
                    size={13}
                    className="text-info"
                  />
                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                  {nextAction}
                </p>
              </div>
            </div>

            <Link
              to={ROUTES.goals}
              className="
                group inline-flex
                shrink-0 items-center gap-2
                text-sm font-semibold
                text-violet-400
                transition
                hover:text-violet-300
              "
            >
              Giňişleýin gör

              <ArrowRight
                size={16}
                className="
                  transition-transform
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>
        </motion.div>

        {/* FOOTER */}

        <div
          className="
            mt-5 flex flex-col gap-3
            border-t border-border/70
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p className="text-xs text-text-muted">
            Umumy ösüş 50% maliýe + 50% meýilnama netijesi boýunça hasaplanýar.
          </p>

          <div className="flex items-center gap-2 text-[11px] text-text-disabled">
            <span className="h-2 w-2 rounded-full bg-info" />
            Maliýe

            <span className="ml-2 h-2 w-2 rounded-full bg-violet-500" />
            Meýilnama
          </div>
        </div>
      </div>
    </motion.section>
  );
}