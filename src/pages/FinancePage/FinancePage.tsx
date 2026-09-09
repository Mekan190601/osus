import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  ChevronDown,
  Plus,
  Trash2,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import FinanceSummary from "../../features/finance/components/FinanceSummary/FinanceSummary";
import { useFinanceStore } from "../../store/financeStore";
import { useMoney } from "../../hooks/useMoney";
import { calculateMonthlyFinance } from "../../features/finance/utils/financeCalculations";

import type { FinanceTransactionType } from "../../store/financeStore";

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
      delay: index * 0.07,
      ease: "easeOut" as const,
    },
  }),
};

function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function FinancePage() {
  const { money } = useMoney();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const reviewSectionRef =
    useRef<HTMLDivElement | null>(null);

  const bankBalance =
    useFinanceStore(
      (state) => state.bankBalance,
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

  const loadFinance =
    useFinanceStore(
      (state) => state.loadFinance,
    );

  const isLoading =
    useFinanceStore(
      (state) => state.isLoading,
    );

  const isInitialized =
    useFinanceStore(
      (state) => state.isInitialized,
    );

  const financeError =
    useFinanceStore(
      (state) => state.error,
    );

  const setBankBalance =
    useFinanceStore(
      (state) => state.setBankBalance,
    );

  const setMonthlyIncome =
    useFinanceStore(
      (state) => state.setMonthlyIncome,
    );

  const setMonthlyExpense =
    useFinanceStore(
      (state) => state.setMonthlyExpense,
    );

  const addTransaction =
    useFinanceStore(
      (state) => state.addTransaction,
    );

  const deleteTransaction =
    useFinanceStore(
      (state) => state.deleteTransaction,
    );

  useEffect(() => {
    if (isInitialized) {
      return;
    }

    void loadFinance();
  }, [
    isInitialized,
    loadFinance,
  ]);

  const [
    transactionType,
    setTransactionType,
  ] =
    useState<FinanceTransactionType>(
      "income",
    );

  const [amount, setAmount] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [date, setDate] =
    useState(getTodayDate());

  const [
    isTransactionFormOpen,
    setIsTransactionFormOpen,
  ] = useState(false);

  const finance = useMemo(
    () =>
      calculateMonthlyFinance({
        monthlyIncome,
        monthlyExpense,
        transactions,
      }),
    [
      monthlyIncome,
      monthlyExpense,
      transactions,
    ],
  );

  const totalIncome =
    finance.totalIncome;

  const totalExpense =
    finance.totalExpense;

  const netIncome =
    finance.netIncome;

  function handleAddTransaction(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const numericAmount =
      Number(amount);

    const cleanTitle =
      title.trim();

    if (
      numericAmount <= 0 ||
      !cleanTitle
    ) {
      return;
    }

    addTransaction({
      type: transactionType,
      amount: numericAmount,
      title: cleanTitle,
      date,
    });

    setAmount("");
    setTitle("");
    setDate(getTodayDate());

    if (
      window.matchMedia(
        "(max-width: 639px)",
      ).matches
    ) {
      setIsTransactionFormOpen(false);
    }
  }

  useEffect(() => {
    if (
      searchParams.get("action") !==
      "review"
    ) {
      return;
    }

    const scrollTimer =
      window.setTimeout(() => {
        reviewSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);

    const cleanupTimer =
      window.setTimeout(() => {
        setSearchParams(
          {},
          {
            replace: true,
          },
        );
      }, 800);

    return () => {
      window.clearTimeout(
        scrollTimer,
      );

      window.clearTimeout(
        cleanupTimer,
      );
    };
  }, [
    searchParams,
    setSearchParams,
  ]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="text-center">
          <div
            className="
              mx-auto h-7 w-7
              animate-spin rounded-full
              border-2 border-border
              border-t-primary
              sm:h-8 sm:w-8
            "
          />

          <p className="mt-3 text-xs text-text-muted sm:mt-4 sm:text-sm">
            Maliýe maglumatlaryň ýüklenýär...
          </p>
        </div>
      </div>
    );
  }

  if (financeError) {
    return (
      <div
        className="
          rounded-[18px]
          border border-danger/20
          bg-danger/[0.04]
          p-4
          sm:rounded-2xl
          sm:p-6
        "
      >
        <p className="text-sm font-semibold text-danger sm:text-base">
          Maliýe maglumatlaryny ýükläp bolmady
        </p>

        <p className="mt-2 text-xs text-text-muted sm:text-sm">
          {financeError}
        </p>

        <button
          type="button"
          onClick={() => {
            void loadFinance();
          }}
          className="
            mt-4 rounded-xl
            bg-primary
            px-4 py-2
            text-xs font-semibold
            text-slate-950
            sm:mt-5
            sm:text-sm
          "
        >
          Täzeden synanş
        </button>
      </div>
    );
  }

  return (
    <div
      className="
        space-y-3
        pb-6
        sm:space-y-5
        sm:pb-8
        lg:space-y-8
        lg:pb-10
      "
    >
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
              bg-info/[0.05]
              blur-[90px]
              sm:h-72 sm:w-72
              sm:bg-info/[0.07]
            "
          />

          <div
            className="
              absolute -bottom-32 left-[20%]
              h-48 w-48
              rounded-full
              bg-success/[0.025]
              blur-[90px]
              sm:h-64 sm:w-64
              sm:bg-success/[0.035]
            "
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-info sm:gap-2">
            <WalletCards
              size={15}
              className="sm:h-[18px] sm:w-[18px]"
            />

            <span className="text-[10px] font-semibold sm:text-sm">
              Maliýe
            </span>
          </div>

          <h1
            className="
              mt-1.5
              text-[21px]
              font-bold
              tracking-tight
              text-text-primary
              sm:mt-3
              sm:text-3xl
              lg:text-4xl
            "
          >
            Maliýe ýagdaýyňy dolandyr
          </h1>

          <p
            className="
              mt-1.5
              max-w-2xl
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
            Esasy girdejiňi, çykdajyňy
            we goşmaça pul hereketleriňi
            bir ýerden dolandyr.
          </p>
        </div>
      </motion.section>

      {/* ESASY MAGLUMATLAR */}
      <section>
        <div className="mb-2.5 sm:mb-5">
          <p className="text-[10px] font-semibold text-info sm:text-sm">
            Häzirki maliýe maglumatlary
          </p>

          <h2 className="mt-0.5 text-[17px] font-bold tracking-tight text-text-primary sm:mt-1 sm:text-2xl">
            Esasy sanlar
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
          {/* BANK */}
          <motion.article
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="
              min-w-0
              rounded-[14px]
              border border-info/15
              bg-info/[0.035]
              p-3
              sm:rounded-2xl
              sm:p-4
              lg:p-5
            "
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-text-primary sm:text-sm lg:text-base">
                  Bankdaky pul
                </p>

                <p className="mt-0.5 hidden text-xs text-text-muted sm:block">
                  Häzirki elýeterli pul.
                </p>
              </div>

              <Landmark
                size={15}
                className="shrink-0 text-info sm:h-[19px] sm:w-[19px]"
              />
            </div>

            <input
              type="number"
              min="0"
              value={bankBalance}
              onChange={(event) =>
                setBankBalance(
                  Number(
                    event.target.value,
                  ) || 0,
                )
              }
              className="
                mt-2.5 h-10 w-full
                rounded-lg
                border border-info/15
                bg-background/50
                px-3
                text-sm font-bold
                text-text-primary
                outline-none
                sm:mt-4
                sm:h-11
                sm:rounded-xl
                sm:px-4
                sm:text-base
                lg:mt-5
                lg:h-12
                lg:text-lg
              "
            />

            <p className="mt-2 truncate text-[10px] font-semibold text-info sm:mt-3 sm:text-sm">
              {money(bankBalance)}
            </p>
          </motion.article>

          {/* AÝLYK GIRDEJI */}
          <motion.article
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="
              min-w-0
              rounded-[14px]
              border border-success/15
              bg-success/[0.035]
              p-3
              sm:rounded-2xl
              sm:p-4
              lg:p-5
            "
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-text-primary sm:text-sm lg:text-base">
                  Aýlyk girdeji
                </p>

                <p className="mt-0.5 hidden text-xs text-text-muted sm:block">
                  Esasy yzygiderli girdeji.
                </p>
              </div>

              <ArrowUpRight
                size={15}
                className="shrink-0 text-success sm:h-[19px] sm:w-[19px]"
              />
            </div>

            <input
              type="number"
              min="0"
              value={monthlyIncome}
              onChange={(event) =>
                setMonthlyIncome(
                  Number(
                    event.target.value,
                  ) || 0,
                )
              }
              className="
                mt-2.5 h-10 w-full
                rounded-lg
                border border-success/15
                bg-background/50
                px-3
                text-sm font-bold
                text-text-primary
                outline-none
                sm:mt-4
                sm:h-11
                sm:rounded-xl
                sm:px-4
                sm:text-base
                lg:mt-5
                lg:h-12
                lg:text-lg
              "
            />

            <p className="mt-2 truncate text-[10px] font-semibold text-success sm:mt-3 sm:text-sm">
              {money(monthlyIncome)}
            </p>
          </motion.article>

          {/* AÝLYK ÇYKDAJY */}
          <motion.article
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="
              col-span-2
              min-w-0
              rounded-[14px]
              border border-danger/15
              bg-danger/[0.03]
              p-3
              sm:rounded-2xl
              sm:p-4
              lg:col-span-1
              lg:p-5
            "
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-text-primary sm:text-sm lg:text-base">
                  Aýlyk çykdajy
                </p>

                <p className="mt-0.5 hidden text-xs text-text-muted sm:block">
                  Esasy yzygiderli çykdajy.
                </p>
              </div>

              <ArrowDownRight
                size={15}
                className="shrink-0 text-danger sm:h-[19px] sm:w-[19px]"
              />
            </div>

            <input
              type="number"
              min="0"
              value={monthlyExpense}
              onChange={(event) =>
                setMonthlyExpense(
                  Number(
                    event.target.value,
                  ) || 0,
                )
              }
              className="
                mt-2.5 h-10 w-full
                rounded-lg
                border border-danger/15
                bg-background/50
                px-3
                text-sm font-bold
                text-text-primary
                outline-none
                sm:mt-4
                sm:h-11
                sm:rounded-xl
                sm:px-4
                sm:text-base
                lg:mt-5
                lg:h-12
                lg:text-lg
              "
            />

            <p className="mt-2 truncate text-[10px] font-semibold text-danger sm:mt-3 sm:text-sm">
              {money(monthlyExpense)}
            </p>
          </motion.article>
        </div>
      </section>

      {/* GOŞMAÇA PUL HEREKETLERI */}
      <section
        className="
          rounded-[20px]
          border border-border
          bg-surface
          p-4
          shadow-[var(--app-shadow)]
          sm:rounded-3xl
          sm:p-6
        "
      >
        <div>
          <p className="text-xs font-semibold text-primary sm:text-sm">
            Goşmaça pul hereketleri
          </p>

          <h2 className="mt-1 text-lg font-bold text-text-primary sm:mt-2 sm:text-2xl">
            Girdeji ýa-da çykdajy goş
          </h2>

          <p className="mt-1 text-[10px] leading-4 text-text-muted sm:mt-2 sm:text-sm sm:leading-6">
            Bonus, söwda, sowgat ýa-da bir
            gezeklik çykdajylary aýratyn ýaz.
          </p>
        </div>

        {/* MOBILE FORM TOGGLE */}
        <button
          type="button"
          onClick={() =>
            setIsTransactionFormOpen(
              (current) => !current,
            )
          }
          className="
            mt-3 flex w-full
            items-center justify-between
            gap-3 rounded-xl
            border border-border
            bg-background/35
            px-3 py-2.5
            text-left
            sm:hidden
          "
          aria-expanded={
            isTransactionFormOpen
          }
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-primary">
              + Pul hereketi goş
            </p>

            <p className="mt-0.5 truncate text-[9px] text-text-muted">
              Girdeji ýa-da çykdajy giriz
            </p>
          </div>

          <ChevronDown
            size={16}
            className={[
              "shrink-0 text-text-muted transition-transform duration-200",
              isTransactionFormOpen
                ? "rotate-180"
                : "rotate-0",
            ].join(" ")}
          />
        </button>

        <div
          className={[
            isTransactionFormOpen
              ? "block"
              : "hidden",
            "sm:block",
          ].join(" ")}
        >
          {/* TYPE */}
          <div className="mt-3 inline-flex rounded-xl border border-border bg-background/40 p-1 sm:mt-6">
            <button
              type="button"
              onClick={() =>
                setTransactionType(
                  "income",
                )
              }
              className={[
                "rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm",
                transactionType ===
                "income"
                  ? "bg-success/10 text-success"
                  : "text-text-muted",
              ].join(" ")}
            >
              + Girdeji
            </button>

            <button
              type="button"
              onClick={() =>
                setTransactionType(
                  "expense",
                )
              }
              className={[
                "rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm",
                transactionType ===
                "expense"
                  ? "bg-danger/10 text-danger"
                  : "text-text-muted",
              ].join(" ")}
            >
              − Çykdajy
            </button>
          </div>

          {/* FORM */}
          <form
            onSubmit={
              handleAddTransaction
            }
            className="
              mt-3 grid gap-3
              sm:mt-5
              lg:grid-cols-[180px_minmax(0,1fr)_190px_auto]
              lg:items-end
            "
          >
            <label>
              <span className="mb-1.5 block text-[10px] font-medium text-text-muted sm:mb-2 sm:text-xs">
                Mukdar
              </span>

              <input
                type="number"
                min="0"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value,
                  )
                }
                placeholder="500"
                className="
                  h-10 w-full
                  rounded-lg
                  border border-border
                  bg-background/50
                  px-3
                  text-xs
                  text-text-primary
                  outline-none
                  focus:border-primary
                  sm:h-11
                  sm:rounded-xl
                  sm:text-sm
                "
              />
            </label>

            <label>
              <span className="mb-1.5 block text-[10px] font-medium text-text-muted sm:mb-2 sm:text-xs">
                Näme üçin?
              </span>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value,
                  )
                }
                placeholder={
                  transactionType ===
                  "income"
                    ? "Meselem: Söwdadan girdeji"
                    : "Meselem: Egin-eşik"
                }
                className="
                  h-10 w-full
                  rounded-lg
                  border border-border
                  bg-background/50
                  px-3
                  text-xs
                  text-text-primary
                  outline-none
                  focus:border-primary
                  sm:h-11
                  sm:rounded-xl
                  sm:text-sm
                "
              />
            </label>

            <label>
              <span className="mb-1.5 block text-[10px] font-medium text-text-muted sm:mb-2 sm:text-xs">
                Sene
              </span>

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(
                    event.target.value,
                  )
                }
                className="
                  h-10 w-full
                  rounded-lg
                  border border-border
                  bg-background/50
                  px-3
                  text-xs
                  text-text-primary
                  outline-none
                  focus:border-primary
                  sm:h-11
                  sm:rounded-xl
                  sm:text-sm
                "
              />
            </label>

            <button
              type="submit"
              disabled={
                !title.trim() ||
                Number(amount) <= 0
              }
              className="
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-lg
                bg-primary
                px-5
                text-xs font-semibold
                text-slate-950
                transition
                hover:bg-primary-hover
                disabled:opacity-40
                sm:h-11
                sm:rounded-xl
                sm:text-sm
              "
            >
              <Plus size={16} />
              Goş
            </button>
          </form>
        </div>

        {/* SUMMARY */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
          <div className="min-w-0 rounded-xl border border-success/15 bg-success/[0.035] p-2.5 sm:p-4">
            <p className="truncate text-[8px] text-text-muted sm:text-xs">
              Jemi girdeji
            </p>

            <p className="mt-1 truncate text-[12px] font-bold text-success sm:mt-2 sm:text-xl">
              {money(totalIncome)}
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-danger/15 bg-danger/[0.03] p-2.5 sm:p-4">
            <p className="truncate text-[8px] text-text-muted sm:text-xs">
              Jemi çykdajy
            </p>

            <p className="mt-1 truncate text-[12px] font-bold text-danger sm:mt-2 sm:text-xl">
              {money(totalExpense)}
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-info/15 bg-info/[0.035] p-2.5 sm:p-4">
            <p className="truncate text-[8px] text-text-muted sm:text-xs">
              Arassa girdeji
            </p>

            <p
              className={[
                "mt-1 truncate text-[12px] font-bold sm:mt-2 sm:text-xl",
                netIncome >= 0
                  ? "text-success"
                  : "text-danger",
              ].join(" ")}
            >
              {money(netIncome)}
            </p>
          </div>
        </div>

        {/* LIST */}
        <div className="mt-4 sm:mt-6">
          {finance.transactions.length === 0 ? (
            <div
              className="
                rounded-xl
                border border-dashed
                border-border
                p-4 text-center
                sm:p-6
              "
            >
              <p className="text-xs text-text-muted sm:text-sm">
                Heniz goşmaça pul hereketi ýok.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {finance.transactions.map(
                (item) => (
                  <article
                    key={item.id}
                    className="
                      flex items-center
                      justify-between
                      gap-3
                      rounded-xl
                      border border-border
                      bg-background/30
                      p-3
                      sm:p-4
                    "
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-text-primary sm:text-base">
                        {item.title}
                      </p>

                      <p className="mt-0.5 text-[9px] text-text-muted sm:mt-1 sm:text-xs">
                        {item.date}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                      <p
                        className={[
                          "text-xs font-bold sm:text-base",
                          item.type ===
                          "income"
                            ? "text-success"
                            : "text-danger",
                        ].join(" ")}
                      >
                        {item.type ===
                        "income"
                          ? "+"
                          : "-"}
                        {money(
                          item.amount,
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          deleteTransaction(
                            item.id,
                          )
                        }
                        className="
                          flex h-8 w-8
                          items-center
                          justify-center
                          rounded-lg
                          text-text-disabled
                          transition
                          hover:bg-danger/10
                          hover:text-danger
                          sm:h-9
                          sm:w-9
                        "
                        aria-label="Poz"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* FINANCE SUMMARY */}
      <motion.div
        ref={reviewSectionRef}
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
          delay: 0.2,
          ease: "easeOut",
        }}
        className="
          scroll-mt-20
          rounded-2xl
          lg:scroll-mt-24
        "
      >
        <FinanceSummary />
      </motion.div>
    </div>
  );
}