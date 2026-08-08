import type { Label } from "../../types";
import { cn } from "../../lib/cn";

interface LabelChipProps {
  label: Label;
  size?: "sm" | "md";
  onRemove?: () => void;
  className?: string;
}

export function LabelChip({ label, size = "sm", onRemove, className }: LabelChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        className
      )}
      style={{ color: label.color, backgroundColor: `${label.color}1a` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: label.color }} />
      {label.name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 opacity-60 hover:opacity-100"
          aria-label={`Remove ${label.name} label`}
        >
          &times;
        </button>
      )}
    </span>
  );
}
