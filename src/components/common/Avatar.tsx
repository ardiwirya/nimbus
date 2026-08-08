import type { User } from "../../types";
import { cn } from "../../lib/cn";

interface AvatarProps {
  user?: User;
  size?: "xs" | "sm" | "md" | "lg";
  ring?: boolean;
}

const sizeMap = {
  xs: "h-5 w-5 text-[10px]",
  sm: "h-6 w-6 text-[11px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

export function Avatar({ user, size = "md", ring = false }: AvatarProps) {
  if (!user) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full border border-dashed border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark font-medium",
          sizeMap[size],
          ring && "ring-2 ring-surface-light dark:ring-surface-dark"
        )}
        title="Unassigned"
      >
        <span className="opacity-50">?</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-white shrink-0",
        sizeMap[size],
        ring && "ring-2 ring-surface-light dark:ring-surface-dark"
      )}
      style={{ backgroundColor: user.avatarColor }}
      title={user.name}
    >
      {user.initials}
    </div>
  );
}
