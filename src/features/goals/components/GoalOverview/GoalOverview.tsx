import {
  CalendarDays,
  CircleDollarSign,
  Target,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";

import { useGoalStore } from "../../../../store/goalStore";
import { useMoney } from "../../../../hooks/useMoney";

function formatDate(value: string) {
  if (!value) {
    return "Girizilmedi";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}.${month}.${year}`;
}

export default function GoalOverview() {
  const { money } = useMoney();

  const mainGoal = useGoalStore(
    (state) => state.mainGoal,
  );

  const targetMoney = useGoalStore(
    (state) => state.targetMoney,
  );

  const currentMoney = useGoalStore(
    (state) => state.currentMoney,
  );

  const deadline = useGoalStore(
    (state) => state.deadline,
  );

  const progress =
    targetMoney > 0
      ? Math.min(
          Math.max(
            (currentMoney / targetMoney) * 100,
            0,
          ),
          100,
        )
      : 0;

  const roundedProgress =
    Math.round(progress);

  const remainingMoney = Math.max(
    targetMoney - currentMoney,
    0,
  );

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
        {/* ESASY MAKSAT */}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-violet-400 sm:gap-2">
              <Target
                size={14}
                className="sm:h-[17px] sm:w-[17px]"
              />

              <span className="text-[10px] font-semibold sm:text-sm">
                Esasy maksat
              </span>
            </div>

            <h2 className="mt-1 truncate text-[18px] font-bold tracking-tight text-text-primary sm:mt-2 sm:text-2xl lg:text-3xl">
              {mainGoal}
            </h2>
          </div>

          <span
            className="
              inline-flex w-fit shrink-0
              rounded-full
              border border-success/20
              bg-success/10
              px-2 py-1
              text-[9px] font-semibold
              text-success
              sm:px-3 sm:py-1.5
              sm:text-xs
            "
          >
            Işjeň
          </span>
        </div>

        {/* MAGLUMATLAR */}

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3 lg:grid-cols-4">
          {/* GEREK PUL */}

          <div
            className="
              min-w-0
              rounded-xl
              border border-info/15
              bg-info/[0.03]
              p-2.5
              sm:rounded-2xl
              sm:p-4
            "
          >
            <div className="flex items-center gap-1.5 text-info sm:gap-2">
              <CircleDollarSign size={13} className="shrink-0 sm:h-4 sm:w-4" />

              <span className="truncate text-[9px] font-medium sm:text-xs">
                Gerek pul
              </span>
            </div>

            <p className="mt-1.5 truncate text-[14px] font-bold text-text-primary sm:mt-3 sm:text-xl">
              {money(targetMoney)}
            </p>
          </div>

          {/* ÝYGNALAN */}

          <div
            className="
              min-w-0
              rounded-xl
              border border-success/15
              bg-success/[0.03]
              p-2.5
              sm:rounded-2xl
              sm:p-4
            "
          >
            <div className="flex items-center gap-1.5 text-success sm:gap-2">
              <WalletCards size={13} className="shrink-0 sm:h-4 sm:w-4" />

              <span className="truncate text-[9px] font-medium sm:text-xs">
                Ýygnalan
              </span>
            </div>

            <p className="mt-1.5 truncate text-[14px] font-bold text-text-primary sm:mt-3 sm:text-xl">
              {money(currentMoney)}
            </p>
          </div>

          {/* GALAN */}

          <div
            className="
              min-w-0
              rounded-xl
              border border-violet-400/15
              bg-violet-500/[0.03]
              p-2.5
              sm:rounded-2xl
              sm:p-4
            "
          >
            <div className="flex items-center gap-1.5 text-violet-400 sm:gap-2">
              <CircleDollarSign size={13} className="shrink-0 sm:h-4 sm:w-4" />

              <span className="truncate text-[9px] font-medium sm:text-xs">
                Galan
              </span>
            </div>

            <p className="mt-1.5 truncate text-[14px] font-bold text-text-primary sm:mt-3 sm:text-xl">
              {money(remainingMoney)}
            </p>
          </div>

          {/* SOŇKY MÖHLET */}

          <div
            className="
              min-w-0
              rounded-xl
              border border-warning/15
              bg-warning/[0.03]
              p-2.5
              sm:rounded-2xl
              sm:p-4
            "
          >
            <div className="flex items-center gap-1.5 text-warning sm:gap-2">
              <CalendarDays size={13} className="shrink-0 sm:h-4 sm:w-4" />

              <span className="truncate text-[9px] font-medium sm:text-xs">
                Soňky möhlet
              </span>
            </div>

            <p className="mt-1.5 truncate text-[14px] font-bold text-text-primary sm:mt-3 sm:text-xl">
              {formatDate(deadline)}
            </p>
          </div>
        </div>

        {/* DIŇE PUL BOÝUNÇA ÖSÜŞ */}

        <div className="mt-3 border-t border-border/70 pt-3 sm:mt-5 sm:pt-5">
          <div className="flex items-end justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-[10px] font-medium text-text-secondary sm:text-sm">
                Pul boýunça ýetilişi
              </p>

              <p className="mt-0.5 text-[9px] text-text-muted sm:mt-1 sm:text-xs">
                {money(currentMoney)} / {money(targetMoney)}
              </p>
            </div>

            <p className="text-lg font-bold text-success sm:text-2xl">
              {roundedProgress}%
            </p>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background sm:mt-3 sm:h-2">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="
                h-full rounded-full
                bg-gradient-to-r
                from-info
                to-success
              "
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}