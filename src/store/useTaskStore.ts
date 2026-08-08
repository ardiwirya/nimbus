import { create } from "zustand";
import { tasks as initialTasks, activityLog as initialActivity, currentUser } from "../data/dummyData";
import type { ActivityEntry, Task, TaskStatus } from "../types";

interface TaskState {
  tasks: Task[];
  activity: ActivityEntry[];

  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (projectId: string, status: TaskStatus) => Task[];

  moveTask: (taskId: string, newStatus: TaskStatus, newOrder: number) => void;
  reorderWithinColumn: (projectId: string, status: TaskStatus, orderedIds: string[]) => void;

  addTask: (task: Task) => void;
  updateTask: (taskId: string, patch: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  logActivity: (entry: Omit<ActivityEntry, "id" | "createdAt">) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: initialTasks,
  activity: initialActivity,

  getTasksByProject: (projectId) => get().tasks.filter((t) => t.projectId === projectId),

  getTasksByStatus: (projectId, status) =>
    get()
      .tasks.filter((t) => t.projectId === projectId && t.status === status)
      .sort((a, b) => a.order - b.order),

  moveTask: (taskId, newStatus, newOrder) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;
    const prevStatus = task.status;
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus, order: newOrder, updatedAt: new Date().toISOString() }
          : t
      ),
    }));
    if (prevStatus !== newStatus) {
      get().logActivity({
        taskId,
        projectId: task.projectId,
        actorId: currentUser.id,
        action: newStatus === "done" ? "completed" : "moved",
        detail:
          newStatus === "done"
            ? `marked "${task.title}" as done`
            : `moved "${task.title}" to ${newStatus.replace("-", " ")}`,
      });
    }
  },

  reorderWithinColumn: (projectId, status, orderedIds) => {
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.projectId !== projectId || t.status !== status) return t;
        const newOrder = orderedIds.indexOf(t.id);
        return newOrder === -1 ? t : { ...t, order: newOrder };
      }),
    }));
  },

  addTask: (task) => {
    set((state) => ({ tasks: [task, ...state.tasks] }));
    get().logActivity({
      taskId: task.id,
      projectId: task.projectId,
      actorId: currentUser.id,
      action: "created",
      detail: `created task "${task.title}"`,
    });
  },

  updateTask: (taskId, patch) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
      ),
    }));
    if (patch.priority && patch.priority !== task.priority) {
      get().logActivity({
        taskId,
        projectId: task.projectId,
        actorId: currentUser.id,
        action: "priority-changed",
        detail: `changed priority of "${task.title}" to ${patch.priority}`,
      });
    }
    if (patch.dueDate !== undefined && patch.dueDate !== task.dueDate) {
      get().logActivity({
        taskId,
        projectId: task.projectId,
        actorId: currentUser.id,
        action: "due-date-changed",
        detail: `updated due date for "${task.title}"`,
      });
    }
    if (patch.assigneeId !== undefined && patch.assigneeId !== task.assigneeId) {
      get().logActivity({
        taskId,
        projectId: task.projectId,
        actorId: currentUser.id,
        action: "assigned",
        detail: `assigned "${task.title}"`,
      });
    }
    if (
      patch.title !== undefined &&
      patch.description === undefined &&
      patch.priority === undefined &&
      patch.dueDate === undefined &&
      patch.assigneeId === undefined
    ) {
      get().logActivity({
        taskId,
        projectId: task.projectId,
        actorId: currentUser.id,
        action: "updated",
        detail: `updated details on "${task.title}"`,
      });
    }
  },

  deleteTask: (taskId) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }));
  },

  toggleSubtask: (taskId, subtaskId) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, done: !s.done } : s)),
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    }));
  },

  logActivity: (entry) => {
    const newEntry: ActivityEntry = {
      ...entry,
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ activity: [newEntry, ...state.activity] }));
  },
}));
