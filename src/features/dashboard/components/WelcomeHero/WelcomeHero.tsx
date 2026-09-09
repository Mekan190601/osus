import {
  ArrowRight,
  Brain,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "../../../../hooks/useTranslation";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};

export default function WelcomeHero() {
  const { t } = useTranslation();

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="
        group relative overflow-hidden
        rounded-[20px]
        border border-border
        bg-surface
        px-4 py-4
        shadow-[0_12px_40px_rgba(0,0,0,0.14)]
        sm:rounded-[24px]
        sm:px-6 sm:py-6
        lg:rounded-[28px]
        lg:px-10 lg:py-9
        lg:shadow-[0_20px_70px_rgba(0,0,0,0.16)]
      "
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute -right-24 -top-32
            h-[300px] w-[300px]
            rounded-full
            bg-primary/[0.10]
            blur-[90px]
            lg:h-[420px] lg:w-[420px]
            lg:blur-[100px]
          "
        />

        <div
          className="
            absolute bottom-[-180px] right-[20%]
            hidden
            h-[360px] w-[360px]
            rounded-full
            bg-info/[0.055]
            blur-[110px]
            sm:block
          "
        />

        <div
          className="
            absolute inset-x-0 top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-primary/35
            to-transparent
          "
        />

        <div
          className="
            absolute right-0 top-0
            h-full w-[46%]
            bg-gradient-to-l
            from-primary/[0.035]
            to-transparent
          "
        />
      </div>

      <div
        className="
          relative z-10
          grid items-center gap-4
          sm:gap-6
          lg:grid-cols-[minmax(0,1fr)_330px]
          lg:gap-8
          xl:grid-cols-[minmax(0,1fr)_370px]
        "
      >
        {/* LEFT */}
        <div className="max-w-3xl">
          <motion.div
            variants={itemVariants}
            className="
              mb-3 inline-flex items-center gap-1.5
              rounded-full
              border border-primary/20
              bg-primary/[0.08]
              px-2.5 py-1
              text-[10px] font-semibold text-primary
              sm:mb-4
              sm:px-3 sm:py-1.5
              sm:text-xs
              lg:mb-5
            "
          >
            <Sparkles
              size={12}
              className="sm:h-[14px] sm:w-[14px]"
            />
            Şu gün üçin esasy ugur
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="
              max-w-3xl
              text-[25px]
              font-bold
              leading-[1.12]
              tracking-[-0.035em]
              text-text-primary
              sm:text-[32px]
              lg:text-[46px]
              lg:leading-[1.08]
            "
          >
            {t.dashboard.welcome}

            <span className="mt-0.5 block text-primary sm:mt-1">
              {t.dashboard.todayQuestion}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="
              mt-3
              max-w-2xl
              text-[12px]
              leading-[1.55]
              text-text-secondary
              sm:mt-4
              sm:text-sm
              sm:leading-6
              lg:mt-5
              lg:text-[15px]
              lg:leading-7
            "
          >
            {t.dashboard.heroDescription}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="
              mt-4 grid grid-cols-2 gap-2
              sm:mt-5 sm:flex sm:flex-wrap sm:items-center sm:gap-3
              lg:mt-7
            "
          >
            <Link
              to="/goals"
              className="
                group/button
                inline-flex h-10
                min-w-0
                items-center justify-center gap-1.5
                rounded-xl
                bg-primary
                px-3
                text-[12px] font-semibold
                text-slate-950
                shadow-[0_6px_20px_rgba(34,214,111,0.14)]
                transition-all duration-200
                hover:-translate-y-0.5
                hover:bg-primary-hover
                active:translate-y-0
                sm:h-11 sm:gap-2 sm:px-5 sm:text-sm
              "
            >
              <span className="truncate">
                {t.dashboard.addGoal}
              </span>

              <ArrowRight
                size={15}
                className="
                  shrink-0
                  transition-transform duration-200
                  group-hover/button:translate-x-0.5
                  sm:h-[17px] sm:w-[17px]
                "
              />
            </Link>

            <Link
              to="/ai-coach"
              className="
                inline-flex h-10
                min-w-0
                items-center justify-center gap-1.5
                rounded-xl
                border border-border
                bg-background/35
                px-3
                text-[12px] font-semibold
                text-text-primary
                transition-all duration-200
                hover:-translate-y-0.5
                hover:border-primary/20
                hover:bg-surface-hover
                active:translate-y-0
                sm:h-11 sm:gap-2 sm:px-5 sm:text-sm
              "
            >
              <Brain
                size={15}
                className="shrink-0 text-primary sm:h-4 sm:w-4"
              />

              <span className="truncate">
                {t.dashboard.getAdvice}
              </span>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — desktop daily command center */}
        <motion.div
          variants={itemVariants}
          className="hidden lg:block"
        >
          <motion.div
            whileHover={{
              y: -3,
              transition: {
                duration: 0.2,
              },
            }}
            className="
              relative overflow-hidden
              rounded-2xl
              border border-border
              bg-background/35
              p-5
              shadow-[0_16px_50px_rgba(0,0,0,0.14)]
              backdrop-blur-sm
              transition-colors duration-200
              hover:border-primary/20
            "
          >
            <div
              className="
                pointer-events-none
                absolute -right-14 -top-14
                h-32 w-32
                rounded-full
                bg-primary/10
                blur-3xl
              "
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-text-muted">
                    Şu gün
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    Ösüş merkezi
                  </p>
                </div>

                <div
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    border border-primary/15
                    bg-primary/10
                    text-primary
                  "
                >
                  <TrendingUp size={18} />
                </div>
              </div>

              <div className="my-5 h-px bg-border" />

              <div className="space-y-3">
                <div
                  className="
                    flex items-center gap-3
                    rounded-xl
                    border border-border/80
                    bg-surface/50
                    p-3
                  "
                >
                  <div
                    className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-lg bg-primary/10
                      text-primary
                    "
                  >
                    <Target size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-text-muted">
                      Esasy maksat
                    </p>

                    <p className="mt-0.5 truncate text-sm font-semibold text-text-primary">
                      Maksadyňy kesgitle
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex items-center gap-3
                    rounded-xl
                    border border-border/80
                    bg-surface/50
                    p-3
                  "
                >
                  <div
                    className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-lg bg-info/10
                      text-info
                    "
                  >
                    <Brain size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-text-muted">
                      Akylly maslahatçy
                    </p>

                    <p className="mt-0.5 truncate text-sm font-semibold text-text-primary">
                      Indiki etmeli işi gör
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">
                    Şu günki taýýarlyk
                  </span>

                  <span className="text-xs font-semibold text-primary">
                    Başlamak
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-background">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "18%" }}
                    transition={{
                      duration: 0.8,
                      delay: 0.5,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}