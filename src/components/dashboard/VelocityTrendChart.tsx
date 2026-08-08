import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import type { Task } from "../../types";

export function VelocityTrendChart({ tasks }: { tasks: Task[] }) {
  const today = new Date();
  const days = eachDayOfInterval({ start: subDays(today, 13), end: today });

  const data = days.map((day) => ({
    date: format(day, "MMM d"),
    created: tasks.filter((t) => isSameDay(new Date(t.createdAt), day)).length,
    completed: tasks.filter((t) => t.status === "done" && isSameDay(new Date(t.updatedAt), day)).length,
  }));

  return (
    <div className="card-surface rounded-xl p-4">
      <p className="mb-1 text-sm font-semibold">Throughput, last 14 days</p>
      <p className="mb-3 text-xs text-muted-light dark:text-muted-dark">Tasks created versus completed</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6a5cf0" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#6a5cf0" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1f9d55" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#1f9d55" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--color-border-light)" }} />
          <Area type="monotone" dataKey="created" stroke="#6a5cf0" fill="url(#createdGradient)" strokeWidth={2} name="Created" />
          <Area type="monotone" dataKey="completed" stroke="#1f9d55" fill="url(#completedGradient)" strokeWidth={2} name="Completed" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
