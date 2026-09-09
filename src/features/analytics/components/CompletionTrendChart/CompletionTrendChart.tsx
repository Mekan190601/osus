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

  const hasAnyTasks = data.some(
    (item) => item.total > 0,
  );

  return (
    <section className="rounded-[20px] border border-border bg-surface p-4 sm:rounded-2xl sm:p-6">
      <div>
        <p className="text-[11px] font-semibold text-primary sm:text-sm">
          7 günlük ösüş
        </p>

        <h2 className="mt-1 text-[20px] font-bold tracking-tight text-text-primary sm:mt-2 sm:text-2xl">
          Soňky 7 günüň netijeliligi
        </h2>

        <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-text-muted sm:mt-2 sm:text-sm sm:leading-6">
          Günlük işleriň ýerine ýetiriliş
          göteriminiň soňky 7 gündäki
          üýtgeýşini gör.
        </p>
      </div>

      {!hasAnyTasks ? (
        <div className="mt-3 rounded-xl border border-border bg-background/40 px-4 py-5 text-center sm:mt-6 sm:py-8">
          <p className="text-sm font-semibold text-text-primary">
            Soňky 7 günde günlük iş ýok
          </p>

          <p className="mx-auto mt-1 max-w-md text-[10px] leading-4 text-text-muted sm:mt-2 sm:text-xs sm:leading-5">
            Günlük meýilnama goşanyňdan soň
            bu ýerde ýerine ýetiriliş ösüşi
            awtomatik görkeziler.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-3 h-[170px] w-full sm:mt-6 sm:h-[320px]">
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
                    fontSize: 10,
                  }}
                />

                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 10,
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

          <div className="mt-3 grid grid-cols-4 gap-1.5 sm:mt-5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7">
            {data.map((item) => (
              <div
                key={item.date}
                className="rounded-lg border border-border bg-background/40 px-1 py-2 text-center sm:rounded-xl sm:p-3"
              >
                <p className="truncate text-[9px] text-text-muted sm:text-xs">
                  {item.date}
                </p>

                <p className="mt-1 text-sm font-bold text-text-primary sm:mt-2 sm:text-lg">
                  {item.completed}/
                  {item.total}
                </p>

                <p className="mt-0.5 hidden text-[10px] text-text-disabled sm:mt-1 sm:block">
                  tamamlanan
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}