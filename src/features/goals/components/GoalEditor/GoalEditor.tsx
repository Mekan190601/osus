import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Save,
  Target,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";

import { useGoalStore } from "../../../../store/goalStore";

export default function GoalEditor() {
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

  const updateGoal = useGoalStore(
    (state) => state.updateGoal,
  );

  const [goalValue, setGoalValue] =
    useState(mainGoal);

  const [targetValue, setTargetValue] =
    useState(String(targetMoney));

  const [currentValue, setCurrentValue] =
    useState(String(currentMoney));

  const [deadlineValue, setDeadlineValue] =
    useState(deadline);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanGoal =
      goalValue.trim();

    const parsedTargetMoney =
      Number(targetValue);

    const parsedCurrentMoney =
      Number(currentValue);

    if (!cleanGoal) {
      setError(
        "Esasy maksadyň adyny giriz.",
      );

      setSaved(false);
      return;
    }

    if (
      !Number.isFinite(
        parsedTargetMoney,
      ) ||
      parsedTargetMoney < 0
    ) {
      setError(
        "Gerek pul dogry san bolmaly.",
      );

      setSaved(false);
      return;
    }

    if (
      !Number.isFinite(
        parsedCurrentMoney,
      ) ||
      parsedCurrentMoney < 0
    ) {
      setError(
        "Ýygnalan pul dogry san bolmaly.",
      );

      setSaved(false);
      return;
    }

    updateGoal({
      mainGoal: cleanGoal,
      targetMoney:
        parsedTargetMoney,
      currentMoney:
        parsedCurrentMoney,
      deadline: deadlineValue,
    });

    setError("");
    setSaved(true);
  }

  function handleFieldChange() {
    setSaved(false);
    setError("");
  }

  return (
    <motion.form
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
        ease: "easeOut",
      }}
      onSubmit={handleSubmit}
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
          absolute -right-20 -top-20
          h-56 w-56
          rounded-full
          bg-violet-500/[0.05]
          blur-3xl
        "
      />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-400">
              <Target size={18} />

              <span className="text-sm font-semibold">
                Maksady dolandyr
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
              Maksat maglumatlary
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Maksadyňy, gerek puluňy,
              häzirki ýygnalan puluňy we
              soňky möhleti giriz.
              Ýatda saklanandan soň
              maglumatlar ähli degişli
              bölümlerde awtomatik täzelener.
            </p>
          </div>

          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              border border-violet-400/15
              bg-violet-500/10
              text-violet-400
            "
          >
            <Target size={20} />
          </div>
        </div>

        {/* FIELDS */}
        <div className="mt-6 space-y-5">
          {/* GOAL NAME */}
          <div>
            <label
              htmlFor="goal-title"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary"
            >
              <Target
                size={15}
                className="text-violet-400"
              />
              Esasy maksat
            </label>

            <input
              id="goal-title"
              type="text"
              value={goalValue}
              onChange={(event) => {
                setGoalValue(
                  event.target.value,
                );

                handleFieldChange();
              }}
              placeholder="Meselem: 20 000 manat ýygnamak"
              className="
                h-12 w-full rounded-xl
                border border-violet-400/15
                bg-background/50
                px-4 text-sm
                text-text-primary
                outline-none
                transition-all duration-200
                placeholder:text-text-disabled
                focus:border-violet-400/40
                focus:ring-2
                focus:ring-violet-400/10
              "
            />
          </div>

          {/* MONEY */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="goal-target-money"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary"
              >
                <CircleDollarSign
                  size={15}
                  className="text-info"
                />
                Gerek pul
              </label>

              <input
                id="goal-target-money"
                type="number"
                min="0"
                value={targetValue}
                onChange={(event) => {
                  setTargetValue(
                    event.target.value,
                  );

                  handleFieldChange();
                }}
                className="
                  h-12 w-full rounded-xl
                  border border-info/15
                  bg-background/50
                  px-4 text-sm
                  text-text-primary
                  outline-none
                  transition-all duration-200
                  focus:border-info/40
                  focus:ring-2
                  focus:ring-info/10
                "
              />
            </div>

            <div>
              <label
                htmlFor="goal-current-money"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary"
              >
                <WalletCards
                  size={15}
                  className="text-success"
                />
                Häzirki ýygnalan pul
              </label>

              <input
                id="goal-current-money"
                type="number"
                min="0"
                value={currentValue}
                onChange={(event) => {
                  setCurrentValue(
                    event.target.value,
                  );

                  handleFieldChange();
                }}
                className="
                  h-12 w-full rounded-xl
                  border border-success/15
                  bg-background/50
                  px-4 text-sm
                  text-text-primary
                  outline-none
                  transition-all duration-200
                  focus:border-success/40
                  focus:ring-2
                  focus:ring-success/10
                "
              />
            </div>
          </div>

          {/* DEADLINE */}
          <div>
            <label
              htmlFor="goal-deadline"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary"
            >
              <CalendarDays
                size={15}
                className="text-warning"
              />
              Soňky möhlet
            </label>

            <input
              id="goal-deadline"
              type="date"
              value={deadlineValue}
              onChange={(event) => {
                setDeadlineValue(
                  event.target.value,
                );

                handleFieldChange();
              }}
              className="
                h-12 w-full rounded-xl
                border border-warning/15
                bg-background/50
                px-4 text-sm
                text-text-primary
                outline-none
                transition-all duration-200
                focus:border-warning/40
                focus:ring-2
                focus:ring-warning/10
              "
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-5 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3">
            <p className="text-sm font-medium text-danger">
              {error}
            </p>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-5">
          <div>
            {saved ? (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 size={17} />

                <p className="text-sm font-medium">
                  Maglumatlar üstünlikli
                  ýatda saklandy.
                </p>
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                Üýtgeşmeleri girizip,
                soň “Ýatda sakla”
                düwmesine bas.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="
              inline-flex h-11 items-center
              gap-2 rounded-xl
              bg-primary px-5
              text-sm font-semibold
              text-slate-950
              shadow-[0_8px_24px_rgba(34,214,111,0.12)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-primary-hover
            "
          >
            <Save size={17} />
            Ýatda sakla
          </button>
        </div>
      </div>
    </motion.form>
  );
}