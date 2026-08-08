import {
  Plus,
  ArrowRightLeft,
  CheckCircle2,
  MessageSquare,
  UserPlus,
  Pencil,
  Flag,
  CalendarClock,
} from "lucide-react";
import type { ActivityEntry, ActivityAction } from "../../types";
import { userById, projectById } from "../../data/dummyData";
import { Avatar } from "../common/Avatar";
import { timeAgo } from "../../lib/dates";

const actionIcons: Record<ActivityAction, typeof Plus> = {
  created: Plus,
  moved: ArrowRightLeft,
  completed: CheckCircle2,
  commented: MessageSquare,
  assigned: UserPlus,
  updated: Pencil,
  "priority-changed": Flag,
  "due-date-changed": CalendarClock,
};

export function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => {
        const actor = userById(entry.actorId);
        const project = projectById(entry.projectId);
        const Icon = actionIcons[entry.action];
        return (
          <div key={entry.id} className="relative flex gap-3 pb-5">
            {index !== entries.length - 1 && (
              <span className="absolute left-[15px] top-8 h-full w-px bg-border-light dark:bg-border-dark" />
            )}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas-light dark:bg-white/5 text-muted-light dark:text-muted-dark">
              <Icon size={13} />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-sm">
                <span className="font-medium">{actor?.name ?? "Someone"}</span>{" "}
                <span className="text-muted-light dark:text-muted-dark">{entry.detail}</span>
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-light dark:text-muted-dark">
                <Avatar user={actor} size="xs" />
                <span>{project?.name}</span>
                <span>&middot;</span>
                <span>{timeAgo(entry.createdAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
