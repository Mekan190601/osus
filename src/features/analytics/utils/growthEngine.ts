type GrowthEngineInput = {
  financialProgress: number;
  plannerProgress: number;

  financialWeight?: number;
  plannerWeight?: number;
};

export type GrowthStatus =
  | "behind"
  | "steady"
  | "good"
  | "near-goal"
  | "completed";

export type GrowthEngineResult = {
  financialProgress: number;
  plannerProgress: number;

  financialWeight: number;
  plannerWeight: number;

  overallProgress: number;

  status: GrowthStatus;
};

function clampProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    Math.max(value, 0),
    100,
  );
}

function getGrowthStatus(
  overallProgress: number,
): GrowthStatus {
  if (overallProgress >= 100) {
    return "completed";
  }

  if (overallProgress >= 80) {
    return "near-goal";
  }

  if (overallProgress >= 50) {
    return "good";
  }

  if (overallProgress >= 25) {
    return "steady";
  }

  return "behind";
}

export function calculateGrowthEngine({
  financialProgress,
  plannerProgress,
  financialWeight = 0.5,
  plannerWeight = 0.5,
}: GrowthEngineInput): GrowthEngineResult {
  const safeFinancialProgress =
    clampProgress(financialProgress);

  const safePlannerProgress =
    clampProgress(plannerProgress);

  const totalWeight =
    financialWeight + plannerWeight;

  const normalizedFinancialWeight =
    totalWeight > 0
      ? financialWeight / totalWeight
      : 0.5;

  const normalizedPlannerWeight =
    totalWeight > 0
      ? plannerWeight / totalWeight
      : 0.5;

  const overallProgress =
    Math.round(
      safeFinancialProgress *
        normalizedFinancialWeight +
        safePlannerProgress *
          normalizedPlannerWeight,
    );

  const status =
    getGrowthStatus(
      overallProgress,
    );

  return {
    financialProgress:
      safeFinancialProgress,

    plannerProgress:
      safePlannerProgress,

    financialWeight:
      normalizedFinancialWeight,

    plannerWeight:
      normalizedPlannerWeight,

    overallProgress,

    status,
  };
}