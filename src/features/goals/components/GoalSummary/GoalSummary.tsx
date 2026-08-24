import Card from "../../../../components/Card/Card";
import { useGoalStore } from "../../../../store/goalStore";
import { useMoney } from "../../../../hooks/useMoney";

export default function GoalSummary() {
  const { money } = useMoney();

  const {
    mainGoal,
    targetMoney,
    deadline,
  } = useGoalStore();

  return (
    <Card>
      <h2 className="text-2xl font-bold">
        🎯 Esasy Maksat
      </h2>

      <p className="mt-5 text-slate-300">
        {mainGoal || "Maksat girizilmedi"}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div>
          <p className="text-slate-500">
            Gerek pul
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {money(targetMoney)}
          </h3>
        </div>

        <div>
          <p className="text-slate-500">
            Deadline
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {deadline}
          </h3>
        </div>
      </div>
    </Card>
  );
}