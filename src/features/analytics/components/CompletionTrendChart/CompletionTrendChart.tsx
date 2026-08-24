import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { usePlannerStore } from "../../../../store/plannerStore";

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("tk-TM", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export default function CompletionTrendChart() {
  const tasks = usePlannerStore(
    (state) => state.tasks,
  );

  const today = new Date();

  const data = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(today);

      date.setDate(
        today.getDate() - (6 - index),
      );

      const dateKey = [
        date.getFullYear(),
        String(
          date.getMonth() + 1,
        ).padStart(2, "0"),
        String(
          date.getDate(),
        ).padStart(2, "0"),
      ].join("-");

      const dailyTasks = tasks.filter(
        (task) =>
          task.period === "daily" &&
          task.dateKey === dateKey,
      );

      const completed = dailyTasks.filter(
        (task) => task.completed,
      ).length;

      const completionRate =
        dailyTasks.length > 0
          ? Math.round(
              (completed /
                dailyTasks.length) *
                100,
            )
          : 0;

      return {
        date: formatDay(date),
        total: dailyTasks.length,
        completed,
        completionRate,
      };
    },
  );

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div>
        <p className="text-sm font-semibold text-primary">
          7 günlük ösüş
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
          Soňky 7 günüň netijeliligi
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
          Günlük işleriň ýerine ýetiriliş
          göteriminiň soňky 7 gündäki
          üýtgeýşini gör.
        </p>
      </div>

      <div className="mt-6 h-[320px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#94A3B8",
                fontSize: 12,
              }}
            />

            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#94A3B8",
                fontSize: 12,
              }}
              tickFormatter={(value) =>
                `${value}%`
              }
            />

            <Tooltip
              contentStyle={{
                background:
                  "#0F172A",
                border:
                  "1px solid #334155",
                borderRadius: 12,
              }}
              labelStyle={{
                color: "#F8FAFC",
              }}
              formatter={(
                value,
                name,
              ) => {
                if (
                  name ===
                  "completionRate"
                ) {
                  return [
  `${value}%`,
  "Ýerine ýetiriliş",
];
                }

                return [
                  value,
                  name,
                ];
              }}
            />

            <Line
              type="monotone"
              dataKey="completionRate"
              stroke="currentColor"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
              className="text-primary"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {data.map((item) => (
          <div
            key={item.date}
            className="rounded-xl border border-border bg-background/40 p-3 text-center"
          >
            <p className="text-xs text-text-muted">
              {item.date}
            </p>

            <p className="mt-2 text-lg font-bold text-text-primary">
              {item.completed}/
              {item.total}
            </p>

            <p className="mt-1 text-[10px] text-text-disabled">
              tamamlanan
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}