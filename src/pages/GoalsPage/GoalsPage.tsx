import {
  ArrowRight,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import GoalEditor from "../../features/goals/components/GoalEditor/GoalEditor";
import GoalOverview from "../../features/goals/components/GoalOverview/GoalOverview";
import GoalPlannerBridge from "../../features/goals/components/GoalPlannerBridge/GoalPlannerBridge";
import GoalExecutiveProgress from "../../features/goals/components/GoalExecutiveProgress/GoalExecutiveProgress";
import { useGoalStore } from "../../store/goalStore";

export default function GoalsPage() {
  const [isEditing, setIsEditing] =
    useState(false);

  const mainGoal = useGoalStore(
    (state) => state.mainGoal,
  );

  const loadGoal = useGoalStore(
    (state) => state.loadGoal,
  );

  const isLoading = useGoalStore(
    (state) => state.isLoading,
  );

  const isInitialized = useGoalStore(
    (state) => state.isInitialized,
  );

  useEffect(() => {
    void loadGoal();
  }, [loadGoal]);

  const hasGoal = Boolean(
    mainGoal.trim(),
  );

  if (isLoading && !isInitialized) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2.5">
          <div
            className="
              h-7 w-7
              animate-spin
              rounded-full
              border-2
              border-violet-400/20
              border-t-violet-400
              sm:h-8 sm:w-8
            "
          />

          <p className="text-xs text-text-muted sm:text-sm">
            Maksadyň ýüklenýär...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-6 sm:space-y-5 sm:pb-8 lg:space-y-8 lg:pb-10">
      {/* HEADER */}
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
          duration: 0.45,
          ease: "easeOut",
        }}
        className="
          relative
          overflow-hidden
          rounded-[20px]
          border border-border
          bg-surface
          p-4
          shadow-[var(--app-shadow)]
          sm:rounded-3xl
          sm:p-6
          lg:p-8
        "
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="
              absolute -right-24 -top-28
              h-56 w-56
              rounded-full
              bg-violet-500/[0.055]
              blur-[90px]
              sm:h-72 sm:w-72
              sm:bg-violet-500/[0.07]
            "
          />

          <div
            className="
              absolute -bottom-32 left-[18%]
              h-48 w-48
              rounded-full
              bg-primary/[0.025]
              blur-[90px]
              sm:h-64 sm:w-64
              sm:bg-primary/[0.035]
            "
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-violet-400 sm:gap-2">
            <Target
              size={15}
              className="sm:h-[18px] sm:w-[18px]"
            />

            <span className="text-[10px] font-semibold sm:text-sm">
              Maksatlar
            </span>
          </div>

          <h1
            className="
              mt-1.5
              max-w-3xl
              text-[21px]
              font-bold
              tracking-tight
              text-text-primary
              sm:mt-3
              sm:text-3xl
              lg:text-4xl
            "
          >
            Maksadyňy kesgitle.
            <span className="block text-violet-400">
              Ýoluňy gur.
            </span>
          </h1>

          <p
            className="
              mt-1.5
              max-w-3xl
              text-[10px]
              leading-4
              text-text-muted
              sm:mt-3
              sm:text-sm
              sm:leading-6
              lg:text-base
              lg:leading-7
            "
          >
            Esasy maksadyňy, gerek puluňy we
            soňky möhleti kesgitle. ÖSÜŞ
            maksadyňy meýilnama we gündelik
            işler bilen baglanyşdyrmaga kömek
            edýär.
          </p>

          {hasGoal && (
            <div
              className="
                mt-3
                inline-flex
                items-center gap-1.5
                rounded-full
                border border-success/20
                bg-success/10
                px-2.5 py-1
                text-[9px]
                font-semibold
                text-success
                sm:mt-6
                sm:gap-2
                sm:px-3
                sm:py-1.5
                sm:text-xs
              "
            >
              <Sparkles
                size={11}
                className="sm:h-[13px] sm:w-[13px]"
              />
              Esasy maksat işjeň
            </div>
          )}
        </div>
      </motion.section>

      {/* HAS GOAL */}
      {hasGoal ? (
        <>
          <GoalOverview />

          <GoalExecutiveProgress />

          <GoalPlannerBridge />

          <div className="flex justify-center pt-0.5 sm:pt-1">
            <button
              type="button"
              onClick={() =>
                setIsEditing(
                  (current) => !current,
                )
              }
              className="
                inline-flex
                min-h-10
                items-center
                justify-center
                rounded-xl
                border border-border
                bg-surface
                px-4 py-2
                text-xs
                font-semibold
                text-text-muted
                transition-all
                duration-200
                hover:border-violet-400/30
                hover:text-text-primary
                sm:min-h-11
                sm:px-5
                sm:py-2.5
                sm:text-sm
              "
            >
              {isEditing
                ? "Üýtgetmegi ýap"
                : "Maksady üýtget"}
            </button>
          </div>

          {isEditing && (
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
                duration: 0.25,
              }}
              className="scroll-mt-20"
            >
              <GoalEditor />
            </motion.div>
          )}
        </>
      ) : (
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
            duration: 0.45,
            delay: 0.08,
            ease: "easeOut",
          }}
          className="
            relative
            overflow-hidden
            rounded-[20px]
            border border-dashed
            border-violet-400/20
            bg-surface
            p-4
            shadow-[var(--app-shadow)]
            sm:rounded-3xl
            sm:p-6
            lg:p-8
          "
        >
          <div
            className="
              pointer-events-none
              absolute -right-24 -top-24
              h-48 w-48
              rounded-full
              bg-violet-500/[0.05]
              blur-3xl
              sm:h-64 sm:w-64
              sm:bg-violet-500/[0.06]
            "
          />

          <div className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div
                className="
                  mx-auto
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-violet-400/20
                  bg-violet-500/10
                  text-violet-400
                  sm:h-14 sm:w-14
                  sm:rounded-2xl
                "
              >
                <Target
                  size={19}
                  className="sm:h-[26px] sm:w-[26px]"
                />
              </div>

              <p className="mt-3 text-[10px] font-semibold text-violet-400 sm:mt-6 sm:text-sm">
                Ilkinji ädim
              </p>

              <h2
                className="
                  mt-1
                  text-[19px]
                  font-bold
                  tracking-tight
                  text-text-primary
                  sm:mt-2
                  sm:text-2xl
                  lg:text-3xl
                "
              >
                Esasy maksadyňy kesgitle
              </h2>

              <p
                className="
                  mx-auto
                  mt-1.5
                  max-w-xl
                  text-[10px]
                  leading-4
                  text-text-muted
                  sm:mt-3
                  sm:text-sm
                  sm:leading-6
                "
              >
                Nämä ýetmek isleýändigiňi
                ýaz. Soň gerek puluňy we
                soňky möhleti giriz.
                ÖSÜŞ galan bölekleri
                biri-biri bilen baglanyşdyrar.
              </p>
            </div>

            {/* 3 STEP GUIDE */}
            <div
              className="
                mx-auto
                mt-4
                grid max-w-4xl
                grid-cols-3
                gap-2
                sm:mt-6
                sm:gap-3
                md:mt-8
              "
            >
              <div
                className="
                  min-w-0
                  rounded-xl
                  border border-violet-400/15
                  bg-violet-500/[0.035]
                  p-2.5
                  sm:rounded-2xl
                  sm:p-4
                "
              >
                <div
                  className="
                    flex h-7 w-7
                    items-center justify-center
                    rounded-lg
                    bg-violet-500/10
                    text-[10px]
                    font-bold
                    text-violet-400
                    sm:h-9 sm:w-9
                    sm:rounded-xl
                    sm:text-sm
                  "
                >
                  01
                </div>

                <p className="mt-2 text-[10px] font-semibold leading-4 text-text-primary sm:mt-4 sm:text-sm">
                  Maksadyň näme?
                </p>

                <p className="mt-1 hidden text-xs leading-5 text-text-muted sm:block">
                  Ýetmek isleýän esasy
                  netijäňi ýaz.
                </p>
              </div>

              <div
                className="
                  min-w-0
                  rounded-xl
                  border border-info/15
                  bg-info/[0.035]
                  p-2.5
                  sm:rounded-2xl
                  sm:p-4
                "
              >
                <div
                  className="
                    flex h-7 w-7
                    items-center justify-center
                    rounded-lg
                    bg-info/10
                    text-[10px]
                    font-bold
                    text-info
                    sm:h-9 sm:w-9
                    sm:rounded-xl
                    sm:text-sm
                  "
                >
                  02
                </div>

                <p className="mt-2 text-[10px] font-semibold leading-4 text-text-primary sm:mt-4 sm:text-sm">
                  Näçe pul gerek?
                </p>

                <p className="mt-1 hidden text-xs leading-5 text-text-muted sm:block">
                  Maksada ýetmek üçin
                  gerek maliýe mukdaryny
                  görkez.
                </p>
              </div>

              <div
                className="
                  min-w-0
                  rounded-xl
                  border border-warning/15
                  bg-warning/[0.035]
                  p-2.5
                  sm:rounded-2xl
                  sm:p-4
                "
              >
                <div
                  className="
                    flex h-7 w-7
                    items-center justify-center
                    rounded-lg
                    bg-warning/10
                    text-[10px]
                    font-bold
                    text-warning
                    sm:h-9 sm:w-9
                    sm:rounded-xl
                    sm:text-sm
                  "
                >
                  03
                </div>

                <p className="mt-2 text-[10px] font-semibold leading-4 text-text-primary sm:mt-4 sm:text-sm">
                  Haçana çenli?
                </p>

                <p className="mt-1 hidden text-xs leading-5 text-text-muted sm:block">
                  Maksadyň soňky möhletini
                  kesgitle.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-4 max-w-4xl sm:mt-6 md:mt-8">
              <GoalEditor />
            </div>

            <div
              className="
                mx-auto
                mt-3
                flex max-w-4xl
                items-center justify-center
                gap-1.5
                text-center
                text-[9px]
                leading-4
                text-text-disabled
                sm:mt-5
                sm:gap-2
                sm:text-xs
              "
            >
              <span>
                Maglumatlary dolduranyňdan soň
                maksat merkezi awtomatik açylar.
              </span>

              <ArrowRight
                size={12}
                className="shrink-0 sm:h-[14px] sm:w-[14px]"
              />
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
