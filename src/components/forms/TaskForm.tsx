import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAppStore } from "../../store/useAppStore";
import { useTaskStore } from "../../store/useTaskStore";
import { useUIStore } from "../../store/useUIStore";
import { useProjectStore } from "../../store/useProjectStore";
import { users, labels, currentUser } from "../../data/dummyData";
import type { Priority, Task, TaskStatus } from "../../types";
import { PRIORITY_META, STATUS_META } from "../../types";
import { Button } from "../common/Button";
import { LabelChip } from "../common/LabelChip";
import { cn } from "../../lib/cn";

interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  dueDate: string;
  labelIds: string[];
}

export function TaskForm({ onDone }: { onDone: () => void }) {
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const defaultStatus = useUIStore((s) => s.createTaskDefaultStatus);
  const addTask = useTaskStore((s) => s.addTask);
  const allTasks = useTaskStore((s) => s.tasks);
  const projects = useProjectStore((s) => s.projects);
  const projectTasks = useMemo(
    () => allTasks.filter((t) => t.projectId === activeProjectId),
    [allTasks, activeProjectId]
  );
  const project = projects.find((p) => p.id === activeProjectId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      status: defaultStatus,
      priority: "medium",
      assigneeId: "",
      dueDate: "",
      labelIds: [],
    },
  });

  const selectedLabelIds = watch("labelIds");

  function toggleLabel(id: string) {
    setValue(
      "labelIds",
      selectedLabelIds.includes(id) ? selectedLabelIds.filter((l) => l !== id) : [...selectedLabelIds, id]
    );
  }

  function onSubmit(values: TaskFormValues) {
    const columnTasks = projectTasks.filter((t) => t.status === values.status);
    const newTask: Task = {
      id: `${activeProjectId}-t${Date.now()}`,
      code: `${project?.key ?? "TSK"}-${100 + projectTasks.length + Math.floor(Math.random() * 50)}`,
      projectId: activeProjectId,
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      labelIds: values.labelIds,
      assigneeId: values.assigneeId || null,
      reporterId: currentUser.id,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: [],
      order: columnTasks.length,
    };
    addTask(newTask);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-light dark:text-muted-dark">
          Title
        </label>
        <input
          {...register("title", { required: "Title is required", minLength: { value: 3, message: "Title is too short" } })}
          autoFocus
          placeholder="e.g. Add pagination to activity feed"
          className="h-9 w-full rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-light dark:text-muted-dark">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Add more context for this task..."
          className="w-full resize-none rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-light dark:text-muted-dark">
            Status
          </label>
          <select
            {...register("status")}
            className="h-9 w-full rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            {Object.entries(STATUS_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-light dark:text-muted-dark">
            Priority
          </label>
          <select
            {...register("priority")}
            className="h-9 w-full rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            {Object.entries(PRIORITY_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-light dark:text-muted-dark">
            Assignee
          </label>
          <select
            {...register("assigneeId")}
            className="h-9 w-full rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-light dark:text-muted-dark">
            Due date
          </label>
          <input
            type="date"
            {...register("dueDate")}
            className="h-9 w-full rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-light dark:text-muted-dark">
          Labels
        </label>
        <Controller
          control={control}
          name="labelIds"
          render={() => (
            <div className="flex flex-wrap gap-1.5">
              {labels.map((l) => (
                <button
                  type="button"
                  key={l.id}
                  onClick={() => toggleLabel(l.id)}
                  className={cn(
                    "rounded-full transition-opacity",
                    !selectedLabelIds.includes(l.id) && "opacity-40 hover:opacity-70"
                  )}
                >
                  <LabelChip label={l} />
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border-light dark:border-border-dark pt-4">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Create task
        </Button>
      </div>
    </form>
  );
}
