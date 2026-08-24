export type FundingForecastStatus =
  | "no-goal"
  | "completed"
  | "blocked"
  | "active";

export type DeadlineStatus =
  | "missing"
  | "completed"
  | "blocked"
  | "ahead"
  | "on-track"
  | "behind"
  | "unknown";

type CreateFundingForecastInput = {
  targetMoney: number;
  currentMoney: number;

  monthlyIncome: number;
  monthlyExpense: number;
};

type CreateDeadlineForecastInput =
  CreateFundingForecastInput & {
    deadline: string;
  };

export type FundingForecast = {
  monthlyNetIncome: number;
  remainingMoney: number;

  estimatedMonths: number | null;
  estimatedDate: Date | null;

  status: FundingForecastStatus;
};

export type DeadlineForecast = FundingForecast & {
  monthsAvailable: number | null;

  requiredMonthlySaving: number | null;

  scheduleDifference: number | null;

  deadlineStatus: DeadlineStatus;
};

export function getMonthsUntilDeadline(
  deadline: string,
): number | null {
  if (!deadline) {
    return null;
  }

  const deadlineDate = new Date(deadline);

  if (
    Number.isNaN(
      deadlineDate.getTime(),
    )
  ) {
    return null;
  }

  const today = new Date();

  if (
    deadlineDate.getTime() <=
    today.getTime()
  ) {
    return 0;
  }

  const milliseconds =
    deadlineDate.getTime() -
    today.getTime();

  const monthMilliseconds =
    1000 * 60 * 60 * 24 * 30.44;

  return Math.max(
    Math.ceil(
      milliseconds /
        monthMilliseconds,
    ),
    0,
  );
}

export function createFundingForecast({
  targetMoney,
  currentMoney,
  monthlyIncome,
  monthlyExpense,
}: CreateFundingForecastInput): FundingForecast {
  const monthlyNetIncome =
    monthlyIncome - monthlyExpense;

  const remainingMoney =
    Math.max(
      targetMoney - currentMoney,
      0,
    );

  const estimatedMonths =
    targetMoney <= 0
      ? null
      : remainingMoney === 0
        ? 0
        : monthlyNetIncome > 0
          ? Math.ceil(
              remainingMoney /
                monthlyNetIncome,
            )
          : null;

  const estimatedDate =
    estimatedMonths === null
      ? null
      : (() => {
          const date = new Date();

          date.setMonth(
            date.getMonth() +
              estimatedMonths,
          );

          return date;
        })();

  const status: FundingForecastStatus =
    targetMoney <= 0
      ? "no-goal"
      : remainingMoney === 0
        ? "completed"
        : monthlyNetIncome <= 0
          ? "blocked"
          : "active";

  return {
    monthlyNetIncome,
    remainingMoney,

    estimatedMonths,
    estimatedDate,

    status,
  };
}

export function createDeadlineForecast({
  targetMoney,
  currentMoney,
  monthlyIncome,
  monthlyExpense,
  deadline,
}: CreateDeadlineForecastInput): DeadlineForecast {
  const funding =
    createFundingForecast({
      targetMoney,
      currentMoney,
      monthlyIncome,
      monthlyExpense,
    });

  const monthsAvailable =
    getMonthsUntilDeadline(deadline);

  const requiredMonthlySaving =
    funding.remainingMoney === 0
      ? 0
      : monthsAvailable !== null &&
          monthsAvailable > 0
        ? funding.remainingMoney /
          monthsAvailable
        : null;

  const scheduleDifference =
    monthsAvailable !== null &&
    funding.estimatedMonths !== null
      ? monthsAvailable -
        funding.estimatedMonths
      : null;

  const deadlineStatus: DeadlineStatus =
    targetMoney <= 0 ||
    !deadline
      ? "missing"
      : funding.remainingMoney === 0
        ? "completed"
        : funding.monthlyNetIncome <= 0
          ? "blocked"
          : scheduleDifference === null
            ? "unknown"
            : scheduleDifference >= 2
              ? "ahead"
              : scheduleDifference >= 0
                ? "on-track"
                : "behind";

  return {
    ...funding,

    monthsAvailable,
    requiredMonthlySaving,
    scheduleDifference,

    deadlineStatus,
  };
}