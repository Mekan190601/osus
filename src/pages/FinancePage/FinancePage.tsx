import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
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

import type {
  FinanceTransactionType,
} from "../../store/financeStore";

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

  const finance =
  useMemo(
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
            mx-auto h-8 w-8
            animate-spin rounded-full
            border-2 border-border
            border-t-primary
          "
        />

        <p className="mt-4 text-sm text-text-muted">
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
        rounded-2xl
        border border-danger/20
        bg-danger/[0.04]
        p-6
      "
    >
      <p className="font-semibold text-danger">
        Maliýe maglumatlaryny ýükläp bolmady
      </p>

      <p className="mt-2 text-sm text-text-muted">
        {financeError}
      </p>

      <button
        type="button"
        onClick={() => {
          void loadFinance();
        }}
        className="
          mt-5 rounded-xl
          bg-primary px-4 py-2
          text-sm font-semibold
          text-slate-950
        "
      >
        Täzeden synanş
      </button>
    </div>
  );
}



  return (
    <div className="space-y-6 pb-10 lg:space-y-8">
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
              bg-info/[0.07]
              blur-[90px]
            "
          />

          <div
            className="
              absolute -bottom-32 left-[20%]
              h-64 w-64
              rounded-full
              bg-success/[0.035]
              blur-[90px]
            "
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-info">
            <WalletCards size={18} />

            <span className="text-sm font-semibold">
              Maliýe
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Maliýe ýagdaýyňy dolandyr
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
            Esasy girdejiňi, çykdajyňy
            we goşmaça pul hereketleriňi
            bir ýerden dolandyr.
          </p>
        </div>
      </motion.section>

      {/* ESASY MAGLUMATLAR */}

      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold text-info">
            Häzirki maliýe maglumatlary
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            Esasy sanlar
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* BANK */}

          <motion.article
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="
              rounded-2xl
              border border-info/15
              bg-info/[0.035]
              p-5
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-text-primary">
                  Bankdaky pul
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Häzirki elýeterli pul.
                </p>
              </div>

              <Landmark
                size={19}
                className="text-info"
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
                mt-5 h-12 w-full
                rounded-xl
                border border-info/15
                bg-background/50
                px-4
                text-lg font-bold
                text-text-primary
                outline-none
              "
            />

            <p className="mt-3 text-sm font-semibold text-info">
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
              rounded-2xl
              border border-success/15
              bg-success/[0.035]
              p-5
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-text-primary">
                  Aýlyk girdeji
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Esasy yzygiderli girdeji.
                </p>
              </div>

              <ArrowUpRight
                size={19}
                className="text-success"
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
                mt-5 h-12 w-full
                rounded-xl
                border border-success/15
                bg-background/50
                px-4
                text-lg font-bold
                text-text-primary
                outline-none
              "
            />

            <p className="mt-3 text-sm font-semibold text-success">
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
              rounded-2xl
              border border-danger/15
              bg-danger/[0.03]
              p-5
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-text-primary">
                  Aýlyk çykdajy
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Esasy yzygiderli çykdajy.
                </p>
              </div>

              <ArrowDownRight
                size={19}
                className="text-danger"
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
                mt-5 h-12 w-full
                rounded-xl
                border border-danger/15
                bg-background/50
                px-4
                text-lg font-bold
                text-text-primary
                outline-none
              "
            />

            <p className="mt-3 text-sm font-semibold text-danger">
              {money(monthlyExpense)}
            </p>
          </motion.article>
        </div>
      </section>

      {/* GOŞMAÇA PUL HEREKETLERI */}

      <section
        className="
          rounded-3xl
          border border-border
          bg-surface
          p-6
          shadow-[var(--app-shadow)]
        "
      >
        <div>
          <p className="text-sm font-semibold text-primary">
            Goşmaça pul hereketleri
          </p>

          <h2 className="mt-2 text-2xl font-bold text-text-primary">
            Girdeji ýa-da çykdajy goş
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            Bonus, söwda, sowgat ýa-da bir
            gezeklik çykdajylary aýratyn ýaz.
          </p>
        </div>

        {/* TYPE */}

        <div className="mt-6 inline-flex rounded-xl border border-border bg-background/40 p-1">
          <button
            type="button"
            onClick={() =>
              setTransactionType(
                "income",
              )
            }
            className={[
              "rounded-lg px-4 py-2 text-sm font-semibold transition",
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
              "rounded-lg px-4 py-2 text-sm font-semibold transition",
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
            mt-5 grid gap-3
            lg:grid-cols-[180px_minmax(0,1fr)_190px_auto]
            lg:items-end
          "
        >
          <label>
            <span className="mb-2 block text-xs font-medium text-text-muted">
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
                h-11 w-full rounded-xl
                border border-border
                bg-background/50 px-3
                text-sm text-text-primary
                outline-none
                focus:border-primary
              "
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-medium text-text-muted">
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
                h-11 w-full rounded-xl
                border border-border
                bg-background/50 px-3
                text-sm text-text-primary
                outline-none
                focus:border-primary
              "
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-medium text-text-muted">
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
                h-11 w-full rounded-xl
                border border-border
                bg-background/50 px-3
                text-sm text-text-primary
                outline-none
                focus:border-primary
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
              inline-flex h-11
              items-center justify-center
              gap-2 rounded-xl
              bg-primary px-5
              text-sm font-semibold
              text-slate-950
              transition
              hover:bg-primary-hover
              disabled:opacity-40
            "
          >
            <Plus size={16} />
            Goş
          </button>
        </form>

        {/* SUMMARY */}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-success/15 bg-success/[0.035] p-4">
            <p className="text-xs text-text-muted">
              Jemi girdeji
            </p>

            <p className="mt-2 text-xl font-bold text-success">
              {money(totalIncome)}
            </p>
          </div>

          <div className="rounded-xl border border-danger/15 bg-danger/[0.03] p-4">
            <p className="text-xs text-text-muted">
              Jemi çykdajy
            </p>

            <p className="mt-2 text-xl font-bold text-danger">
              {money(totalExpense)}
            </p>
          </div>

          <div className="rounded-xl border border-info/15 bg-info/[0.035] p-4">
            <p className="text-xs text-text-muted">
              Arassa girdeji
            </p>

            <p
              className={[
                "mt-2 text-xl font-bold",
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

        <div className="mt-6">
          {finance.transactions.length === 0 ? (
            <div
              className="
                rounded-xl
                border border-dashed
                border-border
                p-6 text-center
              "
            >
              <p className="text-sm text-text-muted">
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
                      flex flex-col gap-3
                      rounded-xl
                      border border-border
                      bg-background/30
                      p-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div>
                      <p className="font-semibold text-text-primary">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs text-text-muted">
                        {item.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p
                        className={[
                          "font-bold",
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
                          flex h-9 w-9
                          items-center
                          justify-center
                          rounded-lg
                          text-text-disabled
                          transition
                          hover:bg-danger/10
                          hover:text-danger
                        "
                        aria-label="Poz"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* ÖŇKI FINANCE SUMMARY */}

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
        className="scroll-mt-24 rounded-2xl"
      >
        <FinanceSummary />
      </motion.div>
    </div>
  );
}