import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Task } from "../../types";
import { STATUS_META } from "../../types";
import { statuses } from "../../data/dummyData";

export function StatusDonutChart({ tasks }: { tasks: Task[] }) {
  const data = statuses.map((s) => ({
    name: STATUS_META[s].label,
    value: tasks.filter((t) => t.status === s).length,
    color: STATUS_META[s].accent,
  }));

  const total = tasks.length;

  return (
    <div className="card-surface rounded-xl p-4">
      <p className="mb-1 text-sm font-semibold">Tasks by status</p>
      <p className="mb-3 text-xs text-muted-light dark:text-muted-dark">Distribution across the workflow</p>
      <div className="flex items-center gap-4">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={70} paddingAngle={3}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--color-border-light)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-semibold">{total}</p>
            <p className="text-[10px] text-muted-light dark:text-muted-dark">total</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </span>
              <span className="font-medium text-muted-light dark:text-muted-dark">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
