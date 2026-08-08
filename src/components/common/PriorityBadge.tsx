import { ChevronsUp, ArrowUp, Equal, ArrowDown } from "lucide-react";
import type { Priority } from "../../types";
import { PRIORITY_META } from "../../types";
import { cn } from "../../lib/cn";

const icons: Record<Priority, typeof ChevronsUp> = {
  urgent: ChevronsUp,
  high: ArrowUp,
  medium: Equal,
  low: ArrowDown,
};

interface PriorityBadgeProps {
  priority: Priority;
  withLabel?: boolean;
  className?: string;
}

export function PriorityBadge({ priority, withLabel = false, className }: PriorityBadgeProps) {
  const meta = PRIORITY_META[priority];
  const Icon = icons[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        className
      )}
      style={{ color: meta.color, backgroundColor: `${meta.color}1a` }}
      title={`Priority: ${meta.label}`}
    >
      <Icon size={12} strokeWidth={2.5} />
      {withLabel && meta.label}
    </span>
  );
}
