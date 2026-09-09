import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Save,
  Target,
  Trash2,
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

  const resetGoal = useGoalStore(
    (state) => state.resetGoal,
  );

  const isSaving = useGoalStore(
    (state) => state.isSaving,
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

  const [isDeleting, setIsDeleting] =
    useState(false);

  async function handleSubmit(
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

    try {
      await updateGoal({
        mainGoal: cleanGoal,

        targetMoney:
          parsedTargetMoney,

        currentMoney:
          parsedCurrentMoney,

        deadline:
          deadlineValue,
      });

      setError("");
      setSaved(true);
    } catch (submitError) {
      console.error(
        "Goal save failed:",
        submitError,
      );

      setSaved(false);

      setError(
        "Maksady ýatda saklamak başartmady.",
      );
    }
  }

  async function handleDelete() {
    const confirmed =
      window.confirm(
        "Bu maksady pozmak isleýäniňe ynamyň barmy?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");
      setSaved(false);

      await resetGoal();

      setGoalValue("");
      setTargetValue("0");
      setCurrentValue("0");
      setDeadlineValue("");
    } catch (deleteError) {
      console.error(
        "Goal delete failed:",
        deleteError,
      );

      setError(
        "Maksady pozmak başartmady.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function handleFieldChange() {
    setSaved(false);
    setError("");
  }

  const hasExistingGoal =
    Boolean(mainGoal.trim());

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
          absolute -right-20 -top-20
          h-56 w-56
          rounded-full
          bg-violet-500/[0.05]
          blur-3xl
        "
      />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-3 sm:gap-4 sm:pb-5">
          <div>
            <div className="flex items-center gap-1.5 text-violet-400 sm:gap-2">
              <Target size={14} className="sm:h-[18px] sm:w-[18px]" />

              <span className="text-[10px] font-semibold sm:text-sm">
                Maksady dolandyr
              </span>
            </div>

            <h2 className="mt-1 text-[17px] font-bold tracking-tight text-text-primary sm:mt-2 sm:text-2xl">
              Maksat maglumatlary
            </h2>

            <p className="mt-1 max-w-2xl text-[10px] leading-4 text-text-muted sm:mt-2 sm:text-sm sm:leading-6">
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
              hidden h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              sm:flex
              border border-violet-400/15
              bg-violet-500/10
              text-violet-400
            "
          >
            <Target size={20} />
          </div>
        </div>

        {/* FIELDS */}
        <div className="mt-3 space-y-3 sm:mt-6 sm:space-y-5">
          {/* GOAL NAME */}
          <div>
            <label
              htmlFor="goal-title"
              className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium text-text-secondary sm:mb-2 sm:gap-2 sm:text-sm"
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
              disabled={
                isSaving ||
                isDeleting
              }
              onChange={(event) => {
                setGoalValue(
                  event.target.value,
                );

                handleFieldChange();
              }}
              placeholder="Meselem: 20 000 manat ýygnamak"
              className="
                h-10 w-full rounded-lg
                border border-violet-400/15
                bg-background/50
                px-3 text-xs
                sm:h-12 sm:rounded-xl
                sm:px-4 sm:text-sm
                text-text-primary
                outline-none
                transition-all duration-200
                placeholder:text-text-disabled
                focus:border-violet-400/40
                focus:ring-2
                focus:ring-violet-400/10
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />
          </div>

          {/* MONEY */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div>
              <label
                htmlFor="goal-target-money"
                className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium text-text-secondary sm:mb-2 sm:gap-2 sm:text-sm"
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
                disabled={
                  isSaving ||
                  isDeleting
                }
                onChange={(event) => {
                  setTargetValue(
                    event.target.value,
                  );

                  handleFieldChange();
                }}
                className="
                  h-10 w-full rounded-lg
                  border border-info/15
                  bg-background/50
                  px-3 text-xs
                  sm:h-12 sm:rounded-xl
                  sm:px-4 sm:text-sm
                  text-text-primary
                  outline-none
                  transition-all duration-200
                  focus:border-info/40
                  focus:ring-2
                  focus:ring-info/10
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              />
            </div>

            <div>
              <label
                htmlFor="goal-current-money"
                className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium text-text-secondary sm:mb-2 sm:gap-2 sm:text-sm"
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
                disabled={
                  isSaving ||
                  isDeleting
                }
                onChange={(event) => {
                  setCurrentValue(
                    event.target.value,
                  );

                  handleFieldChange();
                }}
                className="
                  h-10 w-full rounded-lg
                  border border-success/15
                  bg-background/50
                  px-3 text-xs
                  sm:h-12 sm:rounded-xl
                  sm:px-4 sm:text-sm
                  text-text-primary
                  outline-none
                  transition-all duration-200
                  focus:border-success/40
                  focus:ring-2
                  focus:ring-success/10
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              />
            </div>
          </div>

          {/* DEADLINE */}
          <div>
            <label
              htmlFor="goal-deadline"
              className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium text-text-secondary sm:mb-2 sm:gap-2 sm:text-sm"
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
              disabled={
                isSaving ||
                isDeleting
              }
              onChange={(event) => {
                setDeadlineValue(
                  event.target.value,
                );

                handleFieldChange();
              }}
              className="
                h-10 w-full rounded-lg
                border border-warning/15
                bg-background/50
                px-3 text-xs
                sm:h-12 sm:rounded-xl
                sm:px-4 sm:text-sm
                text-text-primary
                outline-none
                transition-all duration-200
                focus:border-warning/40
                focus:ring-2
                focus:ring-warning/10
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-3 rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 sm:mt-5 sm:rounded-xl sm:px-4 sm:py-3">
            <p className="text-[10px] font-medium text-danger sm:text-sm">
              {error}
            </p>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:pt-5">
          <div>
            {saved ? (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2
                  size={17}
                />

                <p className="text-[10px] font-medium sm:text-sm">
                  Maglumatlar üstünlikli
                  ýatda saklandy.
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-text-muted sm:text-sm">
                Üýtgeşmeleri girizip,
                soň “Ýatda sakla”
                düwmesine bas.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            {hasExistingGoal && (
              <button
                type="button"
                onClick={() =>
                  void handleDelete()
                }
                disabled={
                  isSaving ||
                  isDeleting
                }
                className="
                  inline-flex h-10
                  items-center justify-center gap-1.5
                  rounded-lg
                  sm:h-11 sm:gap-2
                  sm:rounded-xl
                  border border-danger/20
                  bg-danger/10
                  px-3
                  text-[10px] font-semibold
                  sm:px-4
                  sm:text-sm
                  text-danger
                  transition-all duration-200
                  hover:border-danger/35
                  hover:bg-danger/15
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Trash2 size={17} />

                {isDeleting
                  ? "Pozulýar..."
                  : "Maksady poz"}
              </button>
            )}

            <button
              type="submit"
              disabled={
                isSaving ||
                isDeleting
              }
              className="
                inline-flex h-10
                items-center justify-center gap-1.5
                rounded-lg
                bg-primary px-3
                text-[10px] font-semibold
                sm:h-11 sm:gap-2
                sm:rounded-xl sm:px-5
                sm:text-sm
                text-slate-950
                shadow-[0_8px_24px_rgba(34,214,111,0.12)]
                transition-all duration-200
                hover:-translate-y-0.5
                hover:bg-primary-hover
                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:hover:translate-y-0
              "
            >
              <Save size={17} />

              {isSaving
                ? "Ýatda saklanýar..."
                : "Ýatda sakla"}
            </button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}