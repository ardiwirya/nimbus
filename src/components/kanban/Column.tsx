import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import type { Task, TaskStatus } from "../../types";
import { STATUS_META } from "../../types";
import { TaskCard } from "./TaskCard";
import { useUIStore } from "../../store/useUIStore";

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export function Column({ status, tasks }: ColumnProps) {
  const meta = STATUS_META[status];
  const openCreateTaskModal = useUIStore((s) => s.openCreateTaskModal);
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { type: "column", status } });

  return (
    <div className="flex h-full w-72 shrink-0 flex-col sm:w-80">
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.accent }} />
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-light dark:text-ink-dark">
            {meta.label}
          </h3>
          <span className="rounded-full bg-canvas-light dark:bg-white/5 px-1.5 py-0.5 text-[11px] font-medium text-muted-light dark:text-muted-dark">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => openCreateTaskModal(status)}
          className="rounded p-1 text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5"
          aria-label={`Add task to ${meta.label}`}
        >
          <Plus size={14} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto rounded-xl p-1.5 transition-colors scrollbar-thin ${
          isOver ? "bg-brand-50 dark:bg-brand-900/20" : ""
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 min-h-[4rem]">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
              <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border-light dark:border-border-dark text-[11px] text-muted-light dark:text-muted-dark">
                Drop tasks here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
