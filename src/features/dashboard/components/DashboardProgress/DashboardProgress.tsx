import {
  CircleDollarSign,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";

import { useGoalStore } from "../../../../store/goalStore";
import { useMoney } from "../../../../hooks/useMoney";

export default function DashboardProgress() {
  const { money } = useMoney();

  const targetMoney = useGoalStore(
    (state) => state.targetMoney,
  );

  const currentMoney = useGoalStore(
    (state) => state.currentMoney,
  );

  const progress =
    targetMoney > 0
      ? (currentMoney /
          targetMoney) *
        100
      : 0;

  const safeProgress = Math.min(
    Math.max(progress, 0),
    100,
  );

  const roundedProgress =
    Math.round(safeProgress);

  const remainingMoney = Math.max(
    targetMoney - currentMoney,
    0,
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.42,
        delay: 0.06,
        ease: "easeOut",
      }}
      whileHover={{ y: -2 }}
      className="
        group relative h-full overflow-hidden
        rounded-2xl
        border border-border
        bg-surface
        p-6
        shadow-[var(--app-shadow)]
        transition-colors duration-200
        hover:border-info/20
      "
    >
      {/* ATMOSPHERE */}

      <div
        className="
          pointer-events-none
          absolute -right-20 -top-20
          h-52 w-52
          rounded-full
          bg-info/[0.06]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute -bottom-24 left-[20%]
          h-44 w-44
          rounded-full
          bg-success/[0.045]
          blur-3xl
        "
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-info">
              <TrendingUp size={18} />

              <span className="text-sm font-semibold">
                Maliýe progressi
              </span>
            </div>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-text-primary">
              Maksada ýetiliş
            </h2>
          </div>

          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              border border-info/15
              bg-info/10
              text-info
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            <CircleDollarSign
              size={19}
            />
          </div>
        </div>

        {/* BIG PROGRESS */}

        <div className="mt-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
              Ýygnalan / Maksat
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
              {money(currentMoney)}
            </p>

            <p className="mt-1 text-sm text-text-muted">
              {money(targetMoney)} maksatdan
            </p>
          </div>

          <div className="text-right">
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
                delay: 0.2,
              }}
              className="
                text-4xl font-bold
                tracking-tight
                text-info
              "
            >
              {roundedProgress}%
            </motion.p>

            <p className="mt-1 text-xs text-text-muted">
              ýerine ýetirildi
            </p>
          </div>
        </div>

        {/* PROGRESS BAR */}

        <div className="mt-6">
          <div
            className="
              h-2.5 overflow-hidden
              rounded-full
              bg-background
            "
            role="progressbar"
            aria-label="Maksat puly boýunça ösüş"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              roundedProgress
            }
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${safeProgress}%`,
              }}
              transition={{
                duration: 0.9,
                delay: 0.25,
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

          <div className="mt-2 flex items-center justify-between text-[10px] text-text-disabled">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* METRICS */}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div
            className="
              rounded-xl
              border border-success/10
              bg-success/[0.035]
              p-4
            "
          >
            <div className="flex items-center gap-2 text-success">
              <WalletCards size={15} />

              <span className="text-xs font-medium">
                Ýygnalan
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-text-primary">
              {money(currentMoney)}
            </p>
          </div>

          <div
            className="
              rounded-xl
              border border-warning/10
              bg-warning/[0.035]
              p-4
            "
          >
            <p className="text-xs font-medium text-warning">
              Galan
            </p>

            <p className="mt-2 text-sm font-bold text-text-primary">
              {money(remainingMoney)}
            </p>
          </div>
        </div>

        {/* SMART MESSAGE */}

        <div className="mt-5 border-t border-border/70 pt-4">
          <p className="text-xs leading-5 text-text-muted">
            {targetMoney <= 0
              ? "Maliýe progressini görmek üçin maksat puluny giriz."
              : roundedProgress >= 100
                ? "Maliýe maksady doly ýerine ýetirildi."
                : roundedProgress >= 75
                  ? "Maksada örän golaýlaşdyň — häzirki depgini sakla."
                  : roundedProgress >= 40
                    ? "Gowy ösüş bar. Yzygiderli dowam etmek möhüm."
                    : roundedProgress > 0
                      ? "Maksada tarap ilkinji ösüş başlandy."
                      : "Maksat belli. Indi ilkinji maliýe ädimini başla."}
          </p>
        </div>
      </div>
    </motion.section>
  );
}