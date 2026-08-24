import type {
  FinanceTransaction,
} from "../../../store/financeStore";

type MonthlyFinanceInput = {
  monthlyIncome: number;
  monthlyExpense: number;
  transactions: FinanceTransaction[];
  date?: Date;
};

function getMonthKey(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  return `${year}-${month}`;
}

export function calculateMonthlyFinance({
  monthlyIncome,
  monthlyExpense,
  transactions,
  date = new Date(),
}: MonthlyFinanceInput) {
  const monthKey =
    getMonthKey(date);

  const currentMonthTransactions =
    transactions.filter((transaction) =>
      transaction.date.startsWith(
        monthKey,
      ),
    );

  const additionalIncome =
    currentMonthTransactions
      .filter(
        (transaction) =>
          transaction.type === "income",
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0,
      );

  const additionalExpense =
    currentMonthTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense",
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0,
      );

  const totalIncome =
    monthlyIncome + additionalIncome;

  const totalExpense =
    monthlyExpense +
    additionalExpense;

  const netIncome =
    totalIncome - totalExpense;

  /*
   * Durnukly aýlyk depgin.
   *
   * Bir gezeklik goşmaça girdeji
   * we çykdajy bu formula girmeýär.
   */
  const recurringNetIncome =
    monthlyIncome - monthlyExpense;

  return {
    additionalIncome,
    additionalExpense,

    totalIncome,
    totalExpense,
    netIncome,

    recurringNetIncome,

    transactions:
      currentMonthTransactions,
  };
}