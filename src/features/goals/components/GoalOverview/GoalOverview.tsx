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
        rounded-3xl
        border border-border
        bg-surface
        p-6
        shadow-[var(--app-shadow)]
      "
    >
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
        {/* ESASY MAKSAT */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-violet-400">
              <Target size={17} />

              <span className="text-sm font-semibold">
                Esasy maksat
              </span>
            </div>

            <h2 className="mt-2 truncate text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {mainGoal}
            </h2>
          </div>

          <span
            className="
              inline-flex w-fit
              rounded-full
              border border-success/20
              bg-success/10
              px-3 py-1.5
              text-xs font-semibold
              text-success
            "
          >
            Işjeň
          </span>
        </div>

        {/* MAGLUMATLAR */}

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* GEREK PUL */}

          <div
            className="
              rounded-2xl
              border border-info/15
              bg-info/[0.03]
              p-4
            "
          >
            <div className="flex items-center gap-2 text-info">
              <CircleDollarSign size={16} />

              <span className="text-xs font-medium">
                Gerek pul
              </span>
            </div>

            <p className="mt-3 text-xl font-bold text-text-primary">
              {money(targetMoney)}
            </p>
          </div>

          {/* ÝYGNALAN */}

          <div
            className="
              rounded-2xl
              border border-success/15
              bg-success/[0.03]
              p-4
            "
          >
            <div className="flex items-center gap-2 text-success">
              <WalletCards size={16} />

              <span className="text-xs font-medium">
                Ýygnalan
              </span>
            </div>

            <p className="mt-3 text-xl font-bold text-text-primary">
              {money(currentMoney)}
            </p>
          </div>

          {/* GALAN */}

          <div
            className="
              rounded-2xl
              border border-violet-400/15
              bg-violet-500/[0.03]
              p-4
            "
          >
            <div className="flex items-center gap-2 text-violet-400">
              <CircleDollarSign size={16} />

              <span className="text-xs font-medium">
                Galan
              </span>
            </div>

            <p className="mt-3 text-xl font-bold text-text-primary">
              {money(remainingMoney)}
            </p>
          </div>

          {/* SOŇKY MÖHLET */}

          <div
            className="
              rounded-2xl
              border border-warning/15
              bg-warning/[0.03]
              p-4
            "
          >
            <div className="flex items-center gap-2 text-warning">
              <CalendarDays size={16} />

              <span className="text-xs font-medium">
                Soňky möhlet
              </span>
            </div>

            <p className="mt-3 text-xl font-bold text-text-primary">
              {formatDate(deadline)}
            </p>
          </div>
        </div>

        {/* DIŇE PUL BOÝUNÇA ÖSÜŞ */}

        <div className="mt-5 border-t border-border/70 pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Pul boýunça ýetilişi
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {money(currentMoney)} / {money(targetMoney)}
              </p>
            </div>

            <p className="text-2xl font-bold text-success">
              {roundedProgress}%
            </p>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
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