import {
  Brain,
  ChevronRight,
  CircleAlert,
  Clock3,
  ListTodo,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../../app/routePaths";
import { useFinanceStore } from "../../../../store/financeStore";
import { useGoalStore } from "../../../../store/goalStore";
import { usePlannerStore } from "../../../../store/plannerStore";
import { useMoney } from "../../../../hooks/useMoney";

import { calculateMonthlyFinance } from "../../../finance/utils/financeCalculations";
import { getPlannerDateKey } from "../../../planner/utils/plannerDate";

type AdviceTone =
  | "violet"
  | "warning"
  | "danger"
  | "info"
  | "success";

type Advice = {
  eyebrow: string;
  title: string;
  description: string;
  reason: string;
  action: string;
  to: string;
  tone: AdviceTone;
  icon: typeof Sparkles;
};

function getMonthsUntilDeadline(
  deadline: string,
) {
  if (!deadline) {
    return null;
  }

  const end = new Date(deadline);

  if (Number.isNaN(end.getTime())) {
    return null;
  }

  const now = new Date();

  const difference =
    end.getTime() - now.getTime();

  if (difference <= 0) {
    return 0;
  }

  const days =
    difference /
    (1000 * 60 * 60 * 24);

  return Math.max(
    1,
    Math.ceil(days / 30.44),
  );
}

export default function AIAdviceCard() {
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

  const monthlyIncome =
    useFinanceStore(
      (state) => state.monthlyIncome,
    );

  const monthlyExpense =
    useFinanceStore(
      (state) => state.monthlyExpense,
    );

  const transactions =
    useFinanceStore(
      (state) => state.transactions,
    );

  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const finance =
    calculateMonthlyFinance({
      monthlyIncome,
      monthlyExpense,
      transactions,
    });

  const netIncome =
    finance.netIncome;

  const recurringNetIncome =
    finance.recurringNetIncome;

  const todayKey =
    getPlannerDateKey(
      new Date(),
      "daily",
    );

  const todayTasks =
    tasks.filter(
      (task) =>
        task.period === "daily" &&
        !task.completed &&
        task.dateKey <= todayKey,
    );

  const urgentTasks =
    todayTasks.filter(
      (task) =>
        task.quadrant ===
        "urgent-important",
    );

  const importantTasks =
    todayTasks.filter(
      (task) =>
        task.quadrant ===
        "important-not-urgent",
    );

  const financialProgress =
    targetMoney > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              (currentMoney /
                targetMoney) *
                100,
            ),
          ),
        )
      : 0;

  const remainingMoney =
    Math.max(
      targetMoney - currentMoney,
      0,
    );

  const monthsLeft =
    getMonthsUntilDeadline(
      deadline,
    );

  const requiredMonthlySaving =
    monthsLeft &&
    monthsLeft > 0 &&
    remainingMoney > 0
      ? Math.ceil(
          remainingMoney /
            monthsLeft,
        )
      : 0;

  const monthlyGap =
    requiredMonthlySaving -
    recurringNetIncome;

  const isGoalCompleted =
    targetMoney > 0 &&
    currentMoney >= targetMoney;

  const deadlinePassed =
    Boolean(deadline) &&
    monthsLeft === 0 &&
    !isGoalCompleted;

  const onTrack =
    requiredMonthlySaving > 0 &&
    recurringNetIncome >=
      requiredMonthlySaving;

  let advice: Advice = {
    eyebrow: "Şu günki maslahat",
    title:
      "Häzirki depginiňi dowam etdir",
    description:
      "Maksat, maliýe we meýilnama ýagdaýyň durnukly görünýär. Häzirki depgini saklap, indiki möhüm ädime geç.",
    reason:
      "Maksat, maliýe we meýilnama maglumatlaryň bilelikde seljerildi.",
    action: "Giňişleýin gör",
    to: ROUTES.aiCoach,
    tone: "violet",
    icon: Sparkles,
  };

  if (!mainGoal.trim()) {
    advice = {
      eyebrow: "Ilkinji ädim",
      title:
        "Esasy maksadyňy kesgitle",
      description:
        "Akylly maslahatçynyň takyk ýol görkezmegi üçin ilki esasy maksadyňy, gerek puluny we möhletini giriz.",
      reason:
        "Maksat ýok bolsa maliýe depginini we gerek tizligi dogry hasaplap bolmaýar.",
      action: "Maksat döret",
      to: ROUTES.goals,
      tone: "warning",
      icon: Target,
    };
  } else if (isGoalCompleted) {
    advice = {
      eyebrow: "Maksat tamamlandy",
      title:
        `${mainGoal} maksady ýerine ýetirildi`,
      description:
        "Maliýe maksadyň 100%-e ýetdi. Indi indiki maksady kesgitlemek ýa-da häzirki netijäni berkitmek wagty.",
      reason:
        `${money(
          currentMoney,
        )} ýygnaldy, maksat ${money(
          targetMoney,
        )}.`,
      action: "Maksady aç",
      to: ROUTES.goals,
      tone: "success",
      icon: Target,
    };
  } else if (deadlinePassed) {
    advice = {
      eyebrow: "Möhlet boýunça üns",
      title:
        "Maksadyň möhleti geçdi",
      description:
        "Maksat entek tamamlanmady. Täze real möhlet kesgitle ýa-da gerek pul mukdaryny täzeden gözden geçir.",
      reason:
        `Maksada ýetmek üçin ýene ${money(
          remainingMoney,
        )} gerek.`,
      action: "Maksady täzele",
      to: ROUTES.goals,
      tone: "danger",
      icon: Clock3,
    };
  } else if (
    recurringNetIncome <= 0
  ) {
    advice = {
      eyebrow: "Maliýe boýunça üns",
      title:
        "Ilki arassa girdejini položitel et",
      description:
        "Häzirki yzygiderli çykdajylaryň girdejä deň ýa-da ondan ýokary. Maksada ýetmek üçin ilki çykdajyny azaltmak ýa-da girdejini ýokarlandyrmak gerek.",
      reason:
        `Durnukly aýlyk arassa girdeji ${money(
          recurringNetIncome,
        )}.`,
      action: "Maliýä geç",
      to: ROUTES.finance,
      tone: "danger",
      icon: WalletCards,
    };
  } else if (
    monthsLeft !== null &&
    monthsLeft > 0 &&
    requiredMonthlySaving > 0 &&
    monthlyGap > 0
  ) {
    advice = {
      eyebrow:
        "Maksat boýunça möhüm duýduryş",
      title:
        `Aýda ýene ${money(
          monthlyGap,
        )} gerek`,
      description:
        `${mainGoal} maksadyna wagtynda ýetmek üçin aýda takmynan ${money(
          requiredMonthlySaving,
        )} ýygnamaly. Häzirki durnukly arassa depginiň ${money(
          recurringNetIncome,
        )}.`,
      reason:
        `${money(
          remainingMoney,
        )} galypdyr we möhlete takmynan ${monthsLeft} aý bar.`,
      action: "Maliýä geç",
      to: ROUTES.finance,
      tone: "warning",
      icon: TrendingUp,
    };
  } else if (
    urgentTasks.length > 0
  ) {
    advice = {
      eyebrow: "Şu gün iň möhüm",
      title:
        `${urgentTasks.length} sany möhüm işi tamamla`,
      description:
        "Maliýe depginiň maksada ýetmek üçin ýeterlik görünýär. Häzir iň uly täsir gündelik möhüm işleri tamamlamakdan geler.",
      reason:
        `${urgentTasks.length} sany möhüm + gyssagly iş garaşýar.`,
      action: "Meýilnama geç",
      to: ROUTES.planner,
      tone: "danger",
      icon: CircleAlert,
    };
  } else if (onTrack) {
    const monthlyBuffer =
      recurringNetIncome -
      requiredMonthlySaving;

    advice = {
      eyebrow:
        "Maksat ugrunda gowy ýagdaý",
      title:
        "Häzirki maliýe depginiň ýeterlik",
      description:
        `${mainGoal} maksadyna wagtynda ýetmek üçin aýda ${money(
          requiredMonthlySaving,
        )} gerek. Häzirki durnukly arassa depginiň ${money(
          recurringNetIncome,
        )}.`,
      reason:
        monthlyBuffer > 0
          ? `Aýda takmynan ${money(
              monthlyBuffer,
            )} ätiýaç depginiň bar.`
          : "Häzirki depgin gerek depgin bilen gabat gelýär.",
      action: "Ösüşi gör",
      to: ROUTES.analytics,
      tone: "success",
      icon: TrendingUp,
    };
  } else if (
    importantTasks.length > 0
  ) {
    advice = {
      eyebrow: "Indiki möhüm ädim",
      title:
        "Meýilleşdirilen möhüm işi öňe sür",
      description:
        "Gyssagly iş ýok. Şonuň üçin şu gün möhüm, ýöne gyssagly däl işleriňden birini tamamlamak ösüşi güýçlendirer.",
      reason:
        `${importantTasks.length} sany möhüm iş garaşýar.`,
      action: "Meýilnama geç",
      to: ROUTES.planner,
      tone: "info",
      icon: ListTodo,
    };
  } else if (
    targetMoney > 0 &&
    financialProgress < 25
  ) {
    advice = {
      eyebrow: "Maksat puly",
      title:
        "Maliýe ösüşini dowam etdir",
      description:
        "Maksadyň belli we ilkinji ösüş başlady. Indiki ädim — yzygiderli aýlyk ýygnama depginini saklamak.",
      reason:
        `Häzirki maliýe ösüşi ${financialProgress}%. Ýene ${money(
          remainingMoney,
        )} gerek.`,
      action: "Maksady aç",
      to: ROUTES.goals,
      tone: "info",
      icon: WalletCards,
    };
  } else if (
    finance.additionalIncome > 0 ||
    finance.additionalExpense > 0
  ) {
    advice = {
      eyebrow:
        "Şu aýyň maliýe netijesi",
      title:
        netIncome >= 0
          ? "Şu aý maliýe ýagdaýyň položitel"
          : "Şu aý çykdajy ýokary",
      description:
        netIncome >= 0
          ? `Şu aý ähli girdeji-çykdajylardan soň ${money(
              netIncome,
            )} galýar.`
          : `Şu aý maliýe netijesi ${money(
              netIncome,
            )}. Çykdajylary gözden geçirmek peýdaly bolar.`,
      reason:
        `Goşmaça girdeji ${money(
          finance.additionalIncome,
        )}, goşmaça çykdajy ${money(
          finance.additionalExpense,
        )}.`,
      action: "Maliýä geç",
      to: ROUTES.finance,
      tone:
        netIncome >= 0
          ? "success"
          : "danger",
      icon: WalletCards,
    };
  }

  const AdviceIcon = advice.icon;

  const toneClasses = {
    violet: {
      text: "text-violet-400",
      border:
        "border-violet-400/20",
      background:
        "bg-violet-500/10",
      glow:
        "bg-violet-500/[0.08]",
    },
    warning: {
      text: "text-warning",
      border: "border-warning/20",
      background: "bg-warning/10",
      glow: "bg-warning/[0.07]",
    },
    danger: {
      text: "text-danger",
      border: "border-danger/20",
      background: "bg-danger/10",
      glow: "bg-danger/[0.07]",
    },
    info: {
      text: "text-info",
      border: "border-info/20",
      background: "bg-info/10",
      glow: "bg-info/[0.07]",
    },
    success: {
      text: "text-success",
      border: "border-success/20",
      background: "bg-success/10",
      glow: "bg-success/[0.07]",
    },
  }[advice.tone];

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
        duration: 0.45,
        ease: "easeOut",
      }}
      className="
        group relative h-full
        overflow-hidden
        rounded-[20px]
        border border-border
        bg-surface
        p-4
        shadow-[var(--app-shadow)]
        sm:rounded-2xl
        sm:p-6
      "
    >
      {/* BACKGROUND */}
      <div
        className={[
          `
            pointer-events-none
            absolute -right-20 -top-20
            h-44 w-44
            rounded-full blur-3xl
            sm:h-56 sm:w-56
          `,
          toneClasses.glow,
        ].join(" ")}
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* HEADER */}
        <div className="flex items-center gap-2.5 sm:items-start sm:gap-3">
          <div
            className={[
              `
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-lg border
                sm:h-11 sm:w-11
                sm:rounded-xl
              `,
              toneClasses.border,
              toneClasses.background,
              toneClasses.text,
            ].join(" ")}
          >
            <Brain
              size={17}
              className="sm:h-[21px] sm:w-[21px]"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="text-[15px] font-bold text-text-primary sm:text-lg">
                Akylly maslahatçy
              </h3>

              <span
                className={[
                  `
                    inline-flex items-center
                    gap-1 rounded-full border
                    px-1.5 py-0.5
                    text-[8px] font-semibold
                    sm:px-2 sm:py-1
                    sm:text-[10px]
                  `,
                  toneClasses.border,
                  toneClasses.background,
                  toneClasses.text,
                ].join(" ")}
              >
                <Sparkles size={9} />
                Akylly ulgam
              </span>
            </div>

            <p className="mt-1 hidden text-sm text-text-muted sm:block">
              Häzirki ýagdaýyň boýunça iň
              peýdaly indiki ädim
            </p>
          </div>
        </div>

        {/* MAIN ADVICE */}
        <div
          className="
            mt-3
            rounded-xl
            border border-border
            bg-background/35
            p-3
            sm:mt-6
            sm:rounded-2xl
            sm:p-5
          "
        >
          <div className="flex items-start gap-2.5 sm:gap-4">
            <div
              className={[
                `
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-lg border
                  sm:h-10 sm:w-10
                  sm:rounded-xl
                `,
                toneClasses.border,
                toneClasses.background,
                toneClasses.text,
              ].join(" ")}
            >
              <AdviceIcon
                size={15}
                className="sm:h-[18px] sm:w-[18px]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={[
                  `
                    text-[9px] font-semibold
                    uppercase tracking-[0.1em]
                    sm:text-xs
                    sm:tracking-[0.12em]
                  `,
                  toneClasses.text,
                ].join(" ")}
              >
                {advice.eyebrow}
              </p>

              <h4
                className="
                  mt-1
                  text-[15px]
                  font-bold
                  leading-5
                  text-text-primary
                  sm:mt-2
                  sm:text-xl
                  sm:leading-7
                "
              >
                {advice.title}
              </h4>

              <p
                className="
                  mt-1.5
                  text-[11px]
                  leading-[1.5]
                  text-text-secondary
                  sm:mt-3
                  sm:text-sm
                  sm:leading-6
                "
              >
                {advice.description}
              </p>
            </div>
          </div>
        </div>

        {/* WHY */}
        <div
          className="
            mt-2
            flex items-start gap-2
            rounded-lg
            border border-border/70
            bg-background/20
            px-3 py-2
            sm:mt-4
            sm:block
            sm:rounded-xl
            sm:px-4 sm:py-3
          "
        >
          <p className="shrink-0 text-[9px] font-semibold text-text-muted sm:text-xs">
            Näme üçin?
          </p>

          <p
            className="
              line-clamp-2
              text-[9px]
              leading-[1.45]
              text-text-disabled
              sm:mt-1
              sm:line-clamp-none
              sm:text-xs
              sm:leading-5
            "
          >
            {advice.reason}
          </p>
        </div>

        {/* MINI DATA */}
        {mainGoal.trim() &&
          targetMoney > 0 && (
            <div
              className="
                mt-2 grid
                grid-cols-4 gap-1.5
                sm:mt-4
                sm:grid-cols-4
                sm:gap-2
              "
            >
              <div
                className="
                  min-w-0 rounded-lg
                  border border-border/70
                  bg-background/20
                  px-2 py-2
                  sm:rounded-xl
                  sm:px-3 sm:py-3
                "
              >
                <p className="truncate text-[8px] text-text-muted sm:text-[10px]">
                  Galan pul
                </p>

                <p className="mt-0.5 truncate text-[10px] font-bold text-text-primary sm:mt-1 sm:text-sm">
                  {money(remainingMoney)}
                </p>
              </div>

              <div
                className="
                  min-w-0 rounded-lg
                  border border-border/70
                  bg-background/20
                  px-2 py-2
                  sm:rounded-xl
                  sm:px-3 sm:py-3
                "
              >
                <p className="truncate text-[8px] text-text-muted sm:text-[10px]">
                  Galan wagt
                </p>

                <p className="mt-0.5 truncate text-[10px] font-bold text-text-primary sm:mt-1 sm:text-sm">
                  {monthsLeft === null
                    ? "—"
                    : `${monthsLeft} aý`}
                </p>
              </div>

              <div
                className="
                  min-w-0 rounded-lg
                  border border-border/70
                  bg-background/20
                  px-2 py-2
                  sm:rounded-xl
                  sm:px-3 sm:py-3
                "
              >
                <p className="truncate text-[8px] text-text-muted sm:text-[10px]">
                  Aýda gerek
                </p>

                <p className="mt-0.5 truncate text-[10px] font-bold text-text-primary sm:mt-1 sm:text-sm">
                  {requiredMonthlySaving > 0
                    ? money(
                        requiredMonthlySaving,
                      )
                    : "—"}
                </p>
              </div>

              <div
                className="
                  min-w-0 rounded-lg
                  border border-border/70
                  bg-background/20
                  px-2 py-2
                  sm:rounded-xl
                  sm:px-3 sm:py-3
                "
              >
                <p className="truncate text-[8px] text-text-muted sm:text-[10px]">
                  Häzirki depgin
                </p>

                <p
                  className={[
                    `
                      mt-0.5 truncate
                      text-[10px] font-bold
                      sm:mt-1 sm:text-sm
                    `,
                    recurringNetIncome >=
                    requiredMonthlySaving
                      ? "text-success"
                      : "text-warning",
                  ].join(" ")}
                >
                  {money(
                    recurringNetIncome,
                  )}
                </p>
              </div>
            </div>
          )}

        {/* FOOTER */}
        <div className="mt-3 sm:mt-auto sm:pt-6">
          <div
            className="
              flex items-center
              justify-between gap-3
              border-t border-border/70
              pt-3
              sm:flex-wrap
              sm:gap-4
              sm:pt-5
            "
          >
            <p
              className="
                hidden max-w-sm
                text-xs leading-5
                text-text-disabled
                sm:block
              "
            >
              Maslahat maksat, möhlet,
              maliýe we meýilnama
              maglumatlaryň esasynda
              saýlanýar.
            </p>

            <Link
              to={advice.to}
              className={[
                `
                  group/link
                  inline-flex h-9
                  w-full items-center
                  justify-center gap-1.5
                  rounded-lg border
                  px-3
                  text-[11px] font-semibold
                  transition-all duration-200
                  hover:-translate-y-0.5
                  sm:h-10
                  sm:w-auto
                  sm:gap-2
                  sm:rounded-xl
                  sm:px-4
                  sm:text-sm
                `,
                toneClasses.border,
                toneClasses.background,
                toneClasses.text,
              ].join(" ")}
            >
              {advice.action}

              <ChevronRight
                size={14}
                className="
                  transition-transform
                  duration-200
                  group-hover/link:translate-x-0.5
                  sm:h-4 sm:w-4
                "
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}