import {
  ArrowRight,
  Sparkles,
  Target,
} from "lucide-react";
import { useState } from "react";
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

  const hasGoal = Boolean(
    mainGoal.trim(),
  );

  return (
    <div className="space-y-6 pb-10 lg:space-y-8">
      {/* ======================================
          HEADER
      ====================================== */}

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
          relative overflow-hidden
          rounded-3xl
          border border-border
          bg-surface
          p-6
          shadow-[var(--app-shadow)]
          sm:p-8
        "
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="
              absolute -right-24 -top-28
              h-72 w-72
              rounded-full
              bg-violet-500/[0.07]
              blur-[90px]
            "
          />

          <div
            className="
              absolute -bottom-32 left-[18%]
              h-64 w-64
              rounded-full
              bg-primary/[0.035]
              blur-[90px]
            "
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-violet-400">
            <Target size={18} />

            <span className="text-sm font-semibold">
              Maksatlar
            </span>
          </div>

          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Maksadyňy kesgitle.
            <span className="block text-violet-400">
              Ýoluňy gur.
            </span>
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-text-muted sm:text-base">
            Esasy maksadyňy, gerek puluňy we
            soňky möhleti kesgitle. ÖSÜŞ
            maksadyňy meýilnama we gündelik
            işler bilen baglanyşdyrmaga kömek
            edýär.
          </p>

          {hasGoal && (
            <div
              className="
                mt-6 inline-flex
                items-center gap-2
                rounded-full
                border border-success/20
                bg-success/10
                px-3 py-1.5
                text-xs font-semibold
                text-success
              "
            >
              <Sparkles size={13} />
              Esasy maksat işjeň
            </div>
          )}
        </div>
      </motion.section>

      {/* ======================================
          HAS GOAL
      ====================================== */}

      {hasGoal ? (
  <>
    <GoalOverview />

    <GoalExecutiveProgress />

    <GoalPlannerBridge />

    <div className="flex justify-center">
      <button
        type="button"
        onClick={() =>
          setIsEditing((current) => !current)
        }
        className="
          rounded-xl
          border border-border
          bg-surface
          px-4 py-2.5
          text-sm font-semibold
          text-text-muted
          transition-all duration-200
          hover:border-violet-400/30
          hover:text-text-primary
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
      >
        <GoalEditor />
      </motion.div>
    )}
  </>
) : (
        /* ======================================
           EMPTY STATE
        ====================================== */

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
            relative overflow-hidden
            rounded-3xl
            border border-dashed
            border-violet-400/20
            bg-surface
            p-6
            shadow-[var(--app-shadow)]
            sm:p-8
          "
        >
          <div
            className="
              pointer-events-none
              absolute -right-24 -top-24
              h-64 w-64
              rounded-full
              bg-violet-500/[0.06]
              blur-3xl
            "
          />

          <div className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div
                className="
                  mx-auto flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  border border-violet-400/20
                  bg-violet-500/10
                  text-violet-400
                "
              >
                <Target size={26} />
              </div>

              <p className="mt-6 text-sm font-semibold text-violet-400">
                Ilkinji ädim
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Esasy maksadyňy kesgitle
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-muted">
                Nämä ýetmek isleýändigiňi
                ýaz. Soň gerek puluňy we
                soňky möhleti giriz.
                ÖSÜŞ galan bölekleri
                biri-biri bilen baglanyşdyrar.
              </p>
            </div>

            {/* 3 STEP GUIDE */}

            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-3">
              <div
                className="
                  rounded-2xl
                  border border-violet-400/15
                  bg-violet-500/[0.035]
                  p-4
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-xl
                    bg-violet-500/10
                    text-sm font-bold
                    text-violet-400
                  "
                >
                  01
                </div>

                <p className="mt-4 text-sm font-semibold text-text-primary">
                  Maksadyň näme?
                </p>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Ýetmek isleýän esasy
                  netijäňi ýaz.
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-info/15
                  bg-info/[0.035]
                  p-4
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-xl
                    bg-info/10
                    text-sm font-bold
                    text-info
                  "
                >
                  02
                </div>

                <p className="mt-4 text-sm font-semibold text-text-primary">
                  Näçe pul gerek?
                </p>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Maksada ýetmek üçin
                  gerek maliýe mukdaryny
                  görkez.
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-warning/15
                  bg-warning/[0.035]
                  p-4
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-xl
                    bg-warning/10
                    text-sm font-bold
                    text-warning
                  "
                >
                  03
                </div>

                <p className="mt-4 text-sm font-semibold text-text-primary">
                  Haçana çenli?
                </p>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Maksadyň soňky möhletini
                  kesgitle.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-4xl">
              <GoalEditor />
            </div>

            <div className="mx-auto mt-5 flex max-w-4xl items-center justify-center gap-2 text-xs text-text-disabled">
              <span>
                Maglumatlary dolduranyňdan soň
                maksat merkezi awtomatik açylar.
              </span>

              <ArrowRight size={14} />
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}