import { EISENHOWER_QUADRANTS } from "../../constants/eisenhower";
import type { PlannerPeriod } from "../../types/planner.types";
import { getPlannerDateKey } from "../../utils/plannerDate";
import { usePlannerStore } from "../../../../store/plannerStore";
import EisenhowerQuadrant from "../EisenhowerQuadrant/EisenhowerQuadrant";

type EisenhowerMatrixProps = {
  period: PlannerPeriod;
};

export default function EisenhowerMatrix({
  period,
}: EisenhowerMatrixProps) {
  const tasks = usePlannerStore((state) => state.tasks);

  const selectedDate = usePlannerStore(
    (state) => state.selectedDate,
  );

  const selectedDateKey = getPlannerDateKey(
    new Date(selectedDate),
    period,
  );

  const periodTasks = tasks.filter(
    (task) =>
      task.period === period &&
      task.dateKey === selectedDateKey,
  );

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {EISENHOWER_QUADRANTS.map((quadrant) => {
        const quadrantTasks = periodTasks.filter(
          (task) => task.quadrant === quadrant.value,
        );

        return (
          <EisenhowerQuadrant
            key={quadrant.value}
            romanNumber={quadrant.romanNumber}
            title={quadrant.title}
            description={quadrant.description}
            action={quadrant.action}
            quadrant={quadrant.value}
            tasks={quadrantTasks}
          />
        );
      })}
    </div>
  );
}