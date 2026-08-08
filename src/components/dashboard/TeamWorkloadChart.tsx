import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import type { Task } from "../../types";
import { users } from "../../data/dummyData";

export function TeamWorkloadChart({ tasks }: { tasks: Task[] }) {
  const data = users
    .map((u) => ({
      name: u.name.split(" ")[0],
      active: tasks.filter((t) => t.assigneeId === u.id && t.status !== "done").length,
      done: tasks.filter((t) => t.assigneeId === u.id && t.status === "done").length,
    }))
    .filter((d) => d.active + d.done > 0)
    .sort((a, b) => b.active + b.done - (a.active + a.done));

  return (
    <div className="card-surface rounded-xl p-4">
      <p className="mb-1 text-sm font-semibold">Team workload</p>
      <p className="mb-3 text-xs text-muted-light dark:text-muted-dark">Active versus completed tasks per member</p>
      <ResponsiveContainer width="100%" height={Math.max(180, data.length * 34)}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border-light)" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis dataKey="name" type="category" width={64} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(106,92,240,0.06)" }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--color-border-light)" }}
          />
          <Bar dataKey="active" stackId="a" name="Active" fill="#6a5cf0" radius={[0, 0, 0, 0]} maxBarSize={16} />
          <Bar dataKey="done" stackId="a" name="Done" fill="#1f9d55" radius={[0, 4, 4, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
