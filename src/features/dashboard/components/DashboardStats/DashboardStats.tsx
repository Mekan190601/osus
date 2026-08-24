import {
  ArrowUpRight,
  CalendarClock,
  CircleDollarSign,
  Flag,
  Target,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../../app/routePaths";
import { useGoalStore } from "../../../../store/goalStore";
import { useMoney } from "../../../../hooks/useMoney";
import { useTranslation } from "../../../../hooks/useTranslation";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },

  visible: (index: number) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.4,
      delay: index * 0.06,
      ease: "easeOut" as const,
    },
  }),
};

export default function DashboardStats() {
  const { t } = useTranslation();
  const { money } = useMoney();

  const mainGoal = useGoalStore(
    (state) => state.mainGoal,
  );

  const targetMoney = useGoalStore(
    (state) => state.targetMoney,
  );

  const deadline = useGoalStore(
    (state) => state.deadline,
  );

  const currentMoney = useGoalStore(
    (state) => state.currentMoney,
  );

  const formattedDeadline =
    deadline || "Girizilmedi";

  const goalProgress =
    targetMoney > 0
      ? Math.min(
          Math.round(
            (currentMoney /
              targetMoney) *
              100,
          ),
          100,
        )
      : 0;

  return (
    <section
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
            absolute -left-24 -top-28
            h-64 w-64
            rounded-full
            bg-violet-500/[0.045]
            blur-3xl
          "
        />

        <div
          className="
            absolute -bottom-28 right-[12%]
            h-64 w-64
            rounded-full
            bg-primary/[0.045]
            blur-3xl
          "
        />
      </div>

      <div className="relative z-10">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-400">
              <Target size={18} />

              <span className="text-sm font-semibold">
                Maksat merkezi
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
              Esasy maksadyň ýagdaýy
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Maksat, maliýe we möhlet
              maglumatlaryny bir ýerden
              gözegçilikde sakla.
            </p>
          </div>

          <Link
            to={ROUTES.goals}
            className="
              group inline-flex h-10
              items-center gap-2
              self-start rounded-xl
              border border-border
              bg-background/35
              px-4
              text-sm font-semibold
              text-text-primary
              transition-all duration-200
              hover:-translate-y-0.5
              hover:border-violet-400/25
              hover:bg-surface-hover
              sm:self-auto
            "
          >
            Maksada geç

            <ArrowUpRight
              size={16}
              className="
                text-violet-400
                transition-transform duration-200
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </Link>
        </div>

        {/* CARDS */}

        <div
          className="
            mt-6 grid grid-cols-1
            gap-3
            md:grid-cols-2
            xl:grid-cols-[1.35fr_1fr_1fr_1fr]
          "
        >
          {/* MAIN GOAL */}

          <motion.article
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -3 }}
            className="
              group relative overflow-hidden
              rounded-2xl
              border border-violet-400/15
              bg-violet-500/[0.045]
              p-5
              transition-colors duration-200
              hover:border-violet-400/25
            "
          >
            <div
              className="
                pointer-events-none
                absolute -right-10 -top-12
                h-32 w-32
                rounded-full
                bg-violet-500/10
                blur-3xl
              "
            />

            <div className="relative">
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
                  <Flag size={19} />
                </div>

                <span
                  className="
                    rounded-full
                    border border-violet-400/15
                    bg-violet-500/10
                    px-2.5 py-1
                    text-[10px] font-semibold
                    text-violet-300
                  "
                >
                  ESASY
                </span>
              </div>

              <p className="mt-5 text-xs font-medium text-text-muted">
                {t.dashboard.mainGoal}
              </p>

              <h3
                className="
                  mt-2 line-clamp-2
                  min-h-[56px]
                  text-xl font-bold
                  leading-7
                  text-text-primary
                "
              >
                {mainGoal ||
                  "Esasy maksat girizilmedi"}
              </h3>

              <p className="mt-3 text-xs leading-5 text-text-muted">
                Uzak möhletli ösüşiň esasy
                ugry.
              </p>
            </div>
          </motion.article>

          {/* TARGET MONEY */}

          <motion.article
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -3 }}
            className="
              group relative overflow-hidden
              rounded-2xl
              border border-info/15
              bg-info/[0.04]
              p-5
              transition-colors duration-200
              hover:border-info/25
            "
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-info/15 bg-info/10 text-info">
              <CircleDollarSign
                size={19}
              />
            </div>

            <p className="mt-5 text-xs font-medium text-text-muted">
              {t.dashboard.targetMoney}
            </p>

            <p className="mt-2 break-words text-2xl font-bold tracking-tight text-info">
              {money(targetMoney)}
            </p>

            <p className="mt-3 text-xs leading-5 text-text-muted">
              Ýetmek isleýän maliýe
              nokadyň.
            </p>
          </motion.article>

          {/* DEADLINE */}

          <motion.article
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -3 }}
            className="
              group relative overflow-hidden
              rounded-2xl
              border border-warning/15
              bg-warning/[0.04]
              p-5
              transition-colors duration-200
              hover:border-warning/25
            "
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-warning/15 bg-warning/10 text-warning">
              <CalendarClock
                size={19}
              />
            </div>

            <p className="mt-5 text-xs font-medium text-text-muted">
              {t.dashboard.deadline}
            </p>

            <p className="mt-2 break-words text-2xl font-bold tracking-tight text-warning">
              {formattedDeadline}
            </p>

            <p className="mt-3 text-xs leading-5 text-text-muted">
              Maksady tamamlamagy
              meýilleşdirýän senäň.
            </p>
          </motion.article>

          {/* SAVED MONEY */}

          <motion.article
            custom={3}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -3 }}
            className="
              group relative overflow-hidden
              rounded-2xl
              border border-success/15
              bg-success/[0.04]
              p-5
              transition-colors duration-200
              hover:border-success/25
            "
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-success/15 bg-success/10 text-success">
              <WalletCards size={19} />
            </div>

            <p className="mt-5 text-xs font-medium text-text-muted">
              {t.dashboard.savedMoney}
            </p>

            <p className="mt-2 break-words text-2xl font-bold tracking-tight text-success">
              {money(currentMoney)}
            </p>

            <p className="mt-3 text-xs leading-5 text-text-muted">
              Häzirki wagta çenli
              ýygnalan serişde.
            </p>
          </motion.article>
        </div>

        {/* OVERALL GOAL PROGRESS */}

        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.3,
          }}
          className="
            mt-4
            rounded-2xl
            border border-border
            bg-background/30
            px-5 py-4
          "
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-text-muted">
                Maksada maliýe boýunça
                ýetilişi
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold text-text-primary">
                  {goalProgress}%
                </span>

                <span className="text-xs text-text-muted">
                  {money(currentMoney)} /{" "}
                  {money(targetMoney)}
                </span>
              </div>
            </div>

            <div className="w-full sm:max-w-[320px]">
              <div className="h-2 overflow-hidden rounded-full bg-surface">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${goalProgress}%`,
                  }}
                  transition={{
                    duration: 0.85,
                    delay: 0.35,
                    ease: "easeOut",
                  }}
                  className="
                    h-full rounded-full
                    bg-gradient-to-r
                    from-info
                    via-primary
                    to-success
                  "
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-text-disabled">
                <span>Başlangyç</span>
                <span>Maksat</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}