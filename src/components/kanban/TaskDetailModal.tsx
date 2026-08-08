import { useEffect, useState } from "react";
import { Trash2, CalendarDays, Tag, User as UserIcon, Flag, ListTodo } from "lucide-react";
import { Modal } from "../common/Modal";
import { useUIStore } from "../../store/useUIStore";
import { useTaskStore } from "../../store/useTaskStore";
import { useProjectStore } from "../../store/useProjectStore";
import { users, labels, userById, labelsByIds } from "../../data/dummyData";
import { PRIORITY_META, STATUS_META } from "../../types";
import type { Priority, TaskStatus } from "../../types";
import { Avatar } from "../common/Avatar";
import { LabelChip } from "../common/LabelChip";
import { PriorityBadge } from "../common/PriorityBadge";
import { Button } from "../common/Button";
import { timeAgo } from "../../lib/dates";
import { cn } from "../../lib/cn";

export function TaskDetailModal() {
  const activeTaskId = useUIStore((s) => s.activeTaskId);
  const closeTaskDetail = useUIStore((s) => s.closeTaskDetail);
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleSubtask = useTaskStore((s) => s.toggleSubtask);
  const activity = useTaskStore((s) => s.activity);
  const projects = useProjectStore((s) => s.projects);

  const task = tasks.find((t) => t.id === activeTaskId);
  const [description, setDescription] = useState(task?.description ?? "");

  useEffect(() => {
    setDescription(task?.description ?? "");
  }, [task?.id, task?.description]);

  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const assignee = userById(task.assigneeId);
  const reporter = userById(task.reporterId);
  const taskLabels = labelsByIds(task.labelIds);
  const taskActivity = activity.filter((a) => a.taskId === task.id).slice(0, 6);
  const doneCount = task.subtasks.filter((s) => s.done).length;

  return (
    <Modal open={!!activeTaskId} onClose={closeTaskDetail} size="xl">
      <div className="flex max-h-[85vh] flex-col">
        <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-light dark:text-muted-dark">
            <span
              className="rounded px-1.5 py-0.5 font-medium text-white"
              style={{ backgroundColor: project?.color }}
            >
              {task.code}
            </span>
            <span>in {project?.name}</span>
          </div>
          <button
            onClick={() => {
              deleteTask(task.id);
              closeTaskDetail();
            }}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-danger hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[1fr_260px]">
          <div className="border-b border-border-light dark:border-border-dark p-5 md:border-b-0 md:border-r">
            <input
              defaultValue={task.title}
              onBlur={(e) => updateTask(task.id, { title: e.target.value })}
              className="mb-4 w-full bg-transparent text-lg font-semibold outline-none focus:ring-0"
            />

            <p className="mb-1.5 text-xs font-medium text-muted-light dark:text-muted-dark">Description</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => updateTask(task.id, { description })}
              rows={4}
              className="mb-5 w-full resize-none rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark p-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />

            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-light dark:text-muted-dark">
                  <ListTodo size={13} />
                  Subtasks
                </p>
                {task.subtasks.length > 0 && (
                  <span className="text-[11px] text-muted-light dark:text-muted-dark">
                    {doneCount}/{task.subtasks.length} complete
                  </span>
                )}
              </div>
              {task.subtasks.length === 0 ? (
                <p className="text-xs text-muted-light dark:text-muted-dark">No subtasks yet.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {task.subtasks.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-canvas-light dark:hover:bg-white/5"
                    >
                      <input
                        type="checkbox"
                        checked={s.done}
                        onChange={() => toggleSubtask(task.id, s.id)}
                        className="h-4 w-4 rounded border-border-light dark:border-border-dark text-brand-600 focus:ring-brand-500"
                      />
                      <span className={cn(s.done && "text-muted-light dark:text-muted-dark line-through")}>
                        {s.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-light dark:text-muted-dark">Activity</p>
              <div className="flex flex-col gap-3">
                {taskActivity.length === 0 && (
                  <p className="text-xs text-muted-light dark:text-muted-dark">No activity recorded yet.</p>
                )}
                {taskActivity.map((entry) => {
                  const actor = userById(entry.actorId);
                  return (
                    <div key={entry.id} className="flex items-start gap-2 text-xs">
                      <Avatar user={actor} size="xs" />
                      <p className="text-ink-light dark:text-ink-dark">
                        <span className="font-medium">{actor?.name}</span>{" "}
                        <span className="text-muted-light dark:text-muted-dark">{entry.detail}</span>
                        <span className="ml-1 text-muted-light dark:text-muted-dark">
                          &middot; {timeAgo(entry.createdAt)}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5">
            <Field label="Status" icon={Flag}>
              <select
                value={task.status}
                onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                className="h-8 w-full rounded-md border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-2 text-xs outline-none focus:border-brand-500"
              >
                {Object.entries(STATUS_META).map(([value, meta]) => (
                  <option key={value} value={value}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Priority" icon={Flag}>
              <select
                value={task.priority}
                onChange={(e) => updateTask(task.id, { priority: e.target.value as Priority })}
                className="h-8 w-full rounded-md border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-2 text-xs outline-none focus:border-brand-500"
              >
                {Object.entries(PRIORITY_META).map(([value, meta]) => (
                  <option key={value} value={value}>
                    {meta.label}
                  </option>
                ))}
              </select>
              <div className="mt-1.5">
                <PriorityBadge priority={task.priority} withLabel />
              </div>
            </Field>

            <Field label="Assignee" icon={UserIcon}>
              <select
                value={task.assigneeId ?? ""}
                onChange={(e) => updateTask(task.id, { assigneeId: e.target.value || null })}
                className="h-8 w-full rounded-md border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-2 text-xs outline-none focus:border-brand-500"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              {assignee && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-light dark:text-muted-dark">
                  <Avatar user={assignee} size="xs" />
                  {assignee.role}
                </div>
              )}
            </Field>

            <Field label="Due date" icon={CalendarDays}>
              <input
                type="date"
                value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
                onChange={(e) =>
                  updateTask(task.id, {
                    dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
                className="h-8 w-full rounded-md border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-2 text-xs outline-none focus:border-brand-500"
              />
            </Field>

            <Field label="Labels" icon={Tag}>
              <div className="flex flex-wrap gap-1.5">
                {labels.map((l) => {
                  const active = task.labelIds.includes(l.id);
                  return (
                    <button
                      key={l.id}
                      onClick={() =>
                        updateTask(task.id, {
                          labelIds: active
                            ? task.labelIds.filter((id) => id !== l.id)
                            : [...task.labelIds, l.id],
                        })
                      }
                      className={cn("rounded-full transition-opacity", !active && "opacity-40 hover:opacity-70")}
                    >
                      <LabelChip label={l} />
                    </button>
                  );
                })}
              </div>
              {taskLabels.length === 0 && <p className="text-[11px] text-muted-light dark:text-muted-dark">No labels</p>}
            </Field>

            <Field label="Reporter" icon={UserIcon}>
              {reporter && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Avatar user={reporter} size="xs" />
                  {reporter.name}
                </div>
              )}
            </Field>

            <div className="pt-2 text-[11px] text-muted-light dark:text-muted-dark">
              Updated {timeAgo(task.updatedAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border-light dark:border-border-dark px-5 py-3">
          <Button variant="secondary" onClick={closeTaskDetail}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof Flag;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-light dark:text-muted-dark">
        <Icon size={12} />
        {label}
      </p>
      {children}
    </div>
  );
}
