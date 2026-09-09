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
          rounded-[20px]
          border border-border
          bg-surface
          p-4
          shadow-[var(--app-shadow)]
          sm:rounded-2xl
          sm:p-6
        "
      >
        <div
          className="
            pointer-events-none
            absolute -right-20 -top-20
            h-40 w-40
            rounded-full
            bg-violet-500/[0.06]
            blur-3xl
            sm:h-52 sm:w-52
          "
        />

        <div className="relative flex items-center gap-3 sm:items-start sm:gap-4">
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-lg
              border border-violet-400/15
              bg-violet-500/10
              text-violet-400
              sm:h-12 sm:w-12
              sm:rounded-xl
            "
          >
            <BarChart3
              size={17}
              className="sm:h-[21px] sm:w-[21px]"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-violet-400 sm:text-sm">
              {t.dashboard.overallProgress}
            </p>

            <h3 className="mt-1 text-[15px] font-bold text-text-primary sm:mt-2 sm:text-xl">
              Strategik analiz üçin maksat gerek
            </h3>

            <p className="mt-1 hidden max-w-2xl text-sm leading-6 text-text-muted sm:mt-2 sm:block">
              Esasy maksadyňy girizeniňden
              soň maliýe we Planner ösüşi
              birleşdirilip, umumy ösüş
              depginiň awtomatik hasaplanar.
            </p>

            <Link
              to={ROUTES.goals}
              className="
                group mt-2.5 inline-flex
                h-9 items-center gap-1.5
                rounded-lg
                bg-primary px-3
                text-[11px] font-semibold
                text-slate-950
                transition-all duration-200
                hover:bg-primary-hover
                sm:mt-5
                sm:h-10
                sm:gap-2
                sm:rounded-xl
                sm:px-4
                sm:text-sm
              "
            >
              Maksat döret

              <ArrowRight
                size={14}
                className="sm:h-4 sm:w-4"
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
        rounded-[20px]
        border border-border
        bg-surface
        p-4
        shadow-[var(--app-shadow)]
        sm:rounded-3xl
        sm:p-5
        lg:p-6
      "
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute -right-28 -top-28
            h-56 w-56
            rounded-full
            bg-violet-500/[0.055]
            blur-[80px]
            sm:h-72 sm:w-72
            sm:blur-[90px]
          "
        />

        <div
          className="
            absolute -bottom-32 left-[25%]
            hidden h-64 w-64
            rounded-full
            bg-info/[0.04]
            blur-[90px]
            sm:block
          "
        />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-violet-400 sm:gap-2">
              <BarChart3
                size={15}
                className="sm:h-[18px] sm:w-[18px]"
              />

              <span className="text-[10px] font-semibold sm:text-sm">
                {t.dashboard.overallProgress}
              </span>
            </div>

            <h2
              className="
                mt-1
                text-[17px]
                font-bold
                tracking-tight
                text-text-primary
                sm:mt-2
                sm:text-2xl
              "
            >
              Strategik ösüş merkezi
            </h2>

            <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-text-muted sm:block">
              Maliýe we Planner netijeleri
              birleşdirilip, maksadyň boýunça
              umumy ösüş depgini görkezilýär.
            </p>
          </div>

          <span
            className={[
              `
                inline-flex shrink-0
                rounded-full border
                px-2 py-1
                text-[9px] font-semibold
                sm:px-3 sm:py-1.5
                sm:text-xs
              `,
              statusClasses,
            ].join(" ")}
          >
            {statusLabel}
          </span>
        </div>

        {/* MAIN GRID */}
        <div
          className="
            mt-3 grid grid-cols-1 gap-2
            sm:mt-6 sm:gap-4
            xl:grid-cols-[0.9fr_1.1fr]
          "
        >
          {/* OVERALL */}
          <div
            className="
              relative overflow-hidden
              rounded-xl
              border border-violet-400/15
              bg-violet-500/[0.035]
              p-3
              sm:rounded-2xl
              sm:p-6
            "
          >
            <div
              className="
                pointer-events-none
                absolute -right-16 -top-16
                h-36 w-36
                rounded-full
                bg-violet-500/10
                blur-3xl
                sm:h-44 sm:w-44
              "
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-violet-400">
                    <Target size={14} />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.1em] sm:text-xs">
                      Umumy ösüş
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-end gap-2 sm:mt-5">
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
                        text-[32px]
                        font-black
                        leading-none
                        tracking-[-0.05em]
                        text-text-primary
                        sm:text-6xl
                      "
                    >
                      {overallProgress}
                      <span className="ml-0.5 text-base font-bold text-violet-400 sm:ml-1 sm:text-2xl">
                        %
                      </span>
                    </motion.p>
                  </div>
                </div>

                <div className="min-w-0 max-w-[48%] text-right sm:max-w-[240px]">
                  <p className="text-[9px] text-text-muted sm:text-xs">
                    Esasy maksat
                  </p>

                  <p className="mt-0.5 truncate text-[11px] font-semibold text-text-primary sm:mt-1 sm:text-sm">
                    {mainGoal}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 sm:mt-6">
                <div className="h-1.5 overflow-hidden rounded-full bg-background sm:h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
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

                <div className="mt-1 hidden justify-between text-[10px] text-text-disabled sm:mt-2 sm:flex">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* FINANCE + PLANNER */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {/* FINANCE */}
            <motion.div
              whileHover={{ y: -3 }}
              className="
                rounded-xl
                border border-info/15
                bg-info/[0.035]
                p-3
                transition-colors duration-200
                hover:border-info/25
                sm:rounded-2xl
                sm:p-5
              "
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className="
                    flex h-8 w-8
                    shrink-0 items-center
                    justify-center
                    rounded-lg
                    border border-info/15
                    bg-info/10
                    text-info
                    sm:h-11 sm:w-11
                    sm:rounded-xl
                  "
                >
                  <CircleDollarSign
                    size={15}
                    className="sm:h-[19px] sm:w-[19px]"
                  />
                </div>

                <span className="text-[18px] font-bold text-info sm:text-2xl">
                  {financialProgress}%
                </span>
              </div>

              <p className="mt-2 text-[11px] font-semibold text-text-primary sm:mt-5 sm:text-sm">
                Maliýe ösüşi
              </p>

              <p className="mt-1 hidden text-xs leading-5 text-text-muted sm:block">
                Maksat puly boýunça häzirki
                maliýe depgini.
              </p>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-background sm:mt-5 sm:h-2">
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
              whileHover={{ y: -3 }}
              className="
                rounded-xl
                border border-violet-400/15
                bg-violet-500/[0.035]
                p-3
                transition-colors duration-200
                hover:border-violet-400/25
                sm:rounded-2xl
                sm:p-5
              "
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className="
                    flex h-8 w-8
                    shrink-0 items-center
                    justify-center
                    rounded-lg
                    border border-violet-400/15
                    bg-violet-500/10
                    text-violet-400
                    sm:h-11 sm:w-11
                    sm:rounded-xl
                  "
                >
                  <CalendarCheck2
                    size={15}
                    className="sm:h-[19px] sm:w-[19px]"
                  />
                </div>

                <span className="text-[18px] font-bold text-violet-400 sm:text-2xl">
                  {plannerProgress}%
                </span>
              </div>

              <p className="mt-2 text-[11px] font-semibold text-text-primary sm:mt-5 sm:text-sm">
                Meýilnama ösüşi
              </p>

              <p className="mt-1 hidden text-xs leading-5 text-text-muted sm:block">
                Maksada bagly işleriň ýerine
                ýetiriliş derejesi.
              </p>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-background sm:mt-5 sm:h-2">
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

        {/* NEXT ACTION */}
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
            mt-2
            rounded-xl
            border border-violet-400/15
            bg-gradient-to-r
            from-violet-500/[0.06]
            via-background/30
            to-info/[0.04]
            p-3
            sm:mt-4
            sm:rounded-2xl
            sm:p-5
          "
        >
          <div className="flex items-start gap-2.5 sm:gap-4">
            <div
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-lg
                border border-violet-400/15
                bg-violet-500/10
                text-violet-400
                sm:h-10 sm:w-10
                sm:rounded-xl
              "
            >
              <Brain
                size={15}
                className="sm:h-[18px] sm:w-[18px]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-violet-400 sm:text-xs">
                  Indiki ädim
                </p>

                <Sparkles
                  size={11}
                  className="text-info sm:h-[13px] sm:w-[13px]"
                />
              </div>

              <p
                className="
                  mt-1
                  line-clamp-2
                  text-[11px]
                  leading-[1.45]
                  text-text-secondary
                  sm:mt-2
                  sm:line-clamp-none
                  sm:text-sm
                  sm:leading-6
                "
              >
                {nextAction}
              </p>
            </div>

            <Link
              to={ROUTES.goals}
              aria-label="Giňişleýin gör"
              className="
                flex h-8 w-8
                shrink-0 items-center
                justify-center
                rounded-lg
                border border-violet-400/15
                text-violet-400
                transition
                hover:bg-violet-500/10
                sm:h-auto sm:w-auto
                sm:border-0
              "
            >
              <span className="hidden text-sm font-semibold sm:inline">
                Giňişleýin gör
              </span>

              <ArrowRight
                size={15}
                className="sm:ml-2 sm:h-4 sm:w-4"
              />
            </Link>
          </div>
        </motion.div>

        {/* DESKTOP FOOTER */}
        <div
          className="
            mt-5 hidden
            border-t border-border/70
            pt-4
            sm:flex
            sm:items-center
            sm:justify-between
            sm:gap-3
          "
        >
          <p className="text-xs text-text-muted">
            Umumy ösüş 50% maliýe + 50%
            meýilnama netijesi boýunça
            hasaplanýar.
          </p>

          <div className="flex shrink-0 items-center gap-2 text-[11px] text-text-disabled">
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