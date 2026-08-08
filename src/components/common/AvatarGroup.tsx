import type { User } from "../../types";
import { Avatar } from "./Avatar";

interface AvatarGroupProps {
  users: User[];
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
}

export function AvatarGroup({ users, max = 4, size = "sm" }: AvatarGroupProps) {
  const shown = users.slice(0, max);
  const overflow = users.length - shown.length;

  return (
    <div className="flex -space-x-2">
      {shown.map((u) => (
        <Avatar key={u.id} user={u} size={size} ring />
      ))}
      {overflow > 0 && (
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-canvas-light dark:bg-canvas-dark border border-border-light dark:border-border-dark text-[10px] font-medium text-muted-light dark:text-muted-dark ring-2 ring-surface-light dark:ring-surface-dark">
          +{overflow}
        </div>
      )}
    </div>
  );
}
