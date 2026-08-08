import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: string;
}

export function StatsCard({ label, value, icon: Icon, trend, accent = "#6a5cf0" }: StatsCardProps) {
  return (
    <div className="card-surface rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium text-muted-light dark:text-muted-dark">{label}</p>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          <Icon size={15} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {trend && (
          <span className={cn("text-xs font-medium", trend.positive ? "text-success" : "text-danger")}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
