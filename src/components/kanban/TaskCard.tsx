import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, CheckSquare, GripVertical } from "lucide-react";
import type { Task } from "../../types";
import { userById, labelsByIds } from "../../data/dummyData";
import { PriorityBadge } from "../common/PriorityBadge";
import { LabelChip } from "../common/LabelChip";
import { Avatar } from "../common/Avatar";
import { useUIStore } from "../../store/useUIStore";
import { formatDueDate, isOverdue } from "../../lib/dates";
import { cn } from "../../lib/cn";

interface TaskCardProps {
  task: Task;
  dragOverlay?: boolean;
}

export function TaskCard({ task, dragOverlay = false }: TaskCardProps) {
  const openTaskDetail = useUIStore((s) => s.openTaskDetail);
  const assignee = userById(task.assigneeId);
  const taskLabels = labelsByIds(task.labelIds);
  const doneSubtasks = task.subtasks.filter((s) => s.done).length;
  const overdue = isOverdue(task.dueDate, task.status === "done");

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task },
    disabled: dragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={dragOverlay ? undefined : setNodeRef}
      style={dragOverlay ? undefined : style}
      className={cn(
        "group card-surface rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        isDragging && "opacity-30",
        dragOverlay && "rotate-2 shadow-2xl ring-2 ring-brand-500"
      )}
      onClick={() => !dragOverlay && openTaskDetail(task.id)}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] font-medium text-muted-light dark:text-muted-dark">
          {task.code}
        </span>
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab touch-none rounded p-0.5 text-muted-light dark:text-muted-dark opacity-0 group-hover:opacity-100 active:cursor-grabbing"
          aria-label="Drag task"
        >
          <GripVertical size={13} />
        </button>
      </div>

      <p className="mb-2 text-sm font-medium leading-snug line-clamp-2">{task.title}</p>

      {taskLabels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {taskLabels.slice(0, 3).map((l) => (
            <LabelChip key={l.id} label={l} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-light dark:text-muted-dark">
          <PriorityBadge priority={task.priority} />
          {task.dueDate && (
            <span className={cn("flex items-center gap-1", overdue && "text-danger font-medium")}>
              <CalendarDays size={12} />
              {formatDueDate(task.dueDate)}
            </span>
          )}
          {task.subtasks.length > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare size={12} />
              {doneSubtasks}/{task.subtasks.length}
            </span>
          )}
        </div>
        <Avatar user={assignee} size="xs" />
      </div>
    </div>
  );
}
