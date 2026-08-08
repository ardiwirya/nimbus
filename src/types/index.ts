export type Priority = "urgent" | "high" | "medium" | "low";

export type TaskStatus = "backlog" | "todo" | "in-progress" | "in-review" | "done";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
  role: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  code: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  labelIds: string[];
  assigneeId: string | null;
  reporterId: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
  order: number;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  description: string;
  color: string;
  icon: string;
  memberIds: string[];
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: "Free" | "Pro" | "Enterprise";
  memberIds: string[];
}

export type ActivityAction =
  | "created"
  | "moved"
  | "completed"
  | "commented"
  | "assigned"
  | "updated"
  | "priority-changed"
  | "due-date-changed";

export interface ActivityEntry {
  id: string;
  taskId: string;
  projectId: string;
  actorId: string;
  action: ActivityAction;
  detail: string;
  createdAt: string;
}

export const STATUS_META: Record<TaskStatus, { label: string; accent: string }> = {
  backlog: { label: "Backlog", accent: "#8b93a3" },
  todo: { label: "To Do", accent: "#6a5cf0" },
  "in-progress": { label: "In Progress", accent: "#2563eb" },
  "in-review": { label: "In Review", accent: "#d97706" },
  done: { label: "Done", accent: "#1f9d55" },
};

export const PRIORITY_META: Record<Priority, { label: string; color: string; weight: number }> = {
  urgent: { label: "Urgent", color: "#dc2626", weight: 4 },
  high: { label: "High", color: "#d97706", weight: 3 },
  medium: { label: "Medium", color: "#2563eb", weight: 2 },
  low: { label: "Low", color: "#6b7280", weight: 1 },
};
