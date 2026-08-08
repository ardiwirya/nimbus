import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, CartesianGrid } from "recharts";
import type { Task } from "../../types";
import { PRIORITY_META } from "../../types";
import { priorities } from "../../data/dummyData";

export function PriorityBarChart({ tasks }: { tasks: Task[] }) {
  const data = priorities.map((p) => ({
    name: PRIORITY_META[p].label,
    value: tasks.filter((t) => t.priority === p).length,
    color: PRIORITY_META[p].color,
  }));

  return (
    <div className="card-surface rounded-xl p-4">
      <p className="mb-1 text-sm font-semibold">Tasks by priority</p>
      <p className="mb-3 text-xs text-muted-light dark:text-muted-dark">Where attention is concentrated</p>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(106,92,240,0.06)" }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--color-border-light)" }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
