import { addDays, subDays, subHours } from "date-fns";
import type {
  User,
  Label,
  Workspace,
  Project,
  Task,
  ActivityEntry,
  TaskStatus,
  Priority,
} from "../types";

const now = new Date();
const iso = (d: Date) => d.toISOString();

export const users: User[] = [
  { id: "u1", name: "Ardi Wirya", email: "ardiwiryaindarto1@gmail.com", avatarColor: "#6a5cf0", initials: "AW", role: "Product Lead" },
  { id: "u2", name: "Rafael Duarte", email: "rafael@nimbus.io", avatarColor: "#2563eb", initials: "RD", role: "Frontend Engineer" },
  { id: "u3", name: "Priya Natarajan", email: "priya@nimbus.io", avatarColor: "#d97706", initials: "PN", role: "Backend Engineer" },
  { id: "u4", name: "Owen Fitzgerald", email: "owen@nimbus.io", avatarColor: "#1f9d55", initials: "OF", role: "QA Engineer" },
  { id: "u5", name: "Sofia Marchetti", email: "sofia@nimbus.io", avatarColor: "#dc2626", initials: "SM", role: "UX Designer" },
  { id: "u6", name: "Kenji Watanabe", email: "kenji@nimbus.io", avatarColor: "#0891b2", initials: "KW", role: "DevOps Engineer" },
  { id: "u7", name: "Grace Adeyemi", email: "grace@nimbus.io", avatarColor: "#9333ea", initials: "GA", role: "Engineering Manager" },
];

export const currentUser = users[0];

export const labels: Label[] = [
  { id: "l1", name: "Bug", color: "#dc2626" },
  { id: "l2", name: "Feature", color: "#6a5cf0" },
  { id: "l3", name: "Design", color: "#d97706" },
  { id: "l4", name: "Backend", color: "#2563eb" },
  { id: "l5", name: "Frontend", color: "#0891b2" },
  { id: "l6", name: "Tech Debt", color: "#6b7280" },
  { id: "l7", name: "Documentation", color: "#1f9d55" },
  { id: "l8", name: "Security", color: "#9333ea" },
];

export const workspaces: Workspace[] = [
  { id: "w1", name: "Nimbus Labs", slug: "nimbus-labs", plan: "Enterprise", memberIds: users.map((u) => u.id) },
  { id: "w2", name: "Northwind Studio", slug: "northwind-studio", plan: "Pro", memberIds: ["u1", "u4", "u5"] },
];

export const projects: Project[] = [
  {
    id: "p1",
    workspaceId: "w1",
    name: "Atlas Web App",
    key: "ATL",
    description: "Customer facing dashboard rebuild with real time analytics.",
    color: "#6a5cf0",
    icon: "LayoutGrid",
    memberIds: ["u1", "u2", "u3", "u5"],
    createdAt: iso(subDays(now, 120)),
  },
  {
    id: "p2",
    workspaceId: "w1",
    name: "Mobile Companion",
    key: "MOB",
    description: "React Native app for field teams and on call reporting.",
    color: "#2563eb",
    icon: "Smartphone",
    memberIds: ["u2", "u4", "u6"],
    createdAt: iso(subDays(now, 95)),
  },
  {
    id: "p3",
    workspaceId: "w1",
    name: "Platform Infrastructure",
    key: "INF",
    description: "Core services, CI/CD pipelines and observability tooling.",
    color: "#1f9d55",
    icon: "Server",
    memberIds: ["u3", "u6", "u7"],
    createdAt: iso(subDays(now, 200)),
  },
  {
    id: "p4",
    workspaceId: "w2",
    name: "Brandline Website",
    key: "BRD",
    description: "Marketing site redesign for the Northwind product family.",
    color: "#d97706",
    icon: "Globe",
    memberIds: ["u1", "u5"],
    createdAt: iso(subDays(now, 40)),
  },
];

const statuses: TaskStatus[] = ["backlog", "todo", "in-progress", "in-review", "done"];
const priorities: Priority[] = ["urgent", "high", "medium", "low"];

interface TaskSeed {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  labelIds: string[];
  assigneeId: string | null;
  dueOffset: number | null;
}

const atlasSeeds: TaskSeed[] = [
  { title: "Design new onboarding flow", description: "Create a guided three step onboarding flow with progress indicator for new workspace admins.", status: "in-progress", priority: "high", labelIds: ["l3", "l2"], assigneeId: "u5", dueOffset: 3 },
  { title: "Fix chart tooltip overflow on mobile", description: "Recharts tooltip clips outside viewport on screens under 380px width.", status: "todo", priority: "urgent", labelIds: ["l1", "l5"], assigneeId: "u2", dueOffset: 1 },
  { title: "Implement saved filter presets", description: "Allow users to save a combination of assignee, label and priority filters for reuse.", status: "backlog", priority: "medium", labelIds: ["l2"], assigneeId: null, dueOffset: null },
  { title: "Refactor task store to normalized shape", description: "Move from array based task state to a normalized record keyed by id for faster lookups.", status: "in-progress", priority: "medium", labelIds: ["l6", "l4"], assigneeId: "u3", dueOffset: 6 },
  { title: "Add dark mode contrast audit", description: "Run an accessibility pass on dark theme colors to ensure WCAG AA contrast on all text.", status: "in-review", priority: "high", labelIds: ["l3"], assigneeId: "u5", dueOffset: 2 },
  { title: "Set up drag and drop between columns", description: "Integrate dnd-kit sortable context across kanban columns with keyboard support.", status: "done", priority: "high", labelIds: ["l2", "l5"], assigneeId: "u2", dueOffset: -2 },
  { title: "Write API docs for tasks endpoint", description: "Document request and response schema for the tasks REST resource.", status: "todo", priority: "low", labelIds: ["l7"], assigneeId: "u3", dueOffset: 10 },
  { title: "Investigate memory leak in board view", description: "Board view memory grows on repeated navigation, likely stale event listeners.", status: "in-progress", priority: "urgent", labelIds: ["l1", "l6"], assigneeId: "u2", dueOffset: 0 },
  { title: "Add activity log pagination", description: "Load activity entries in pages of 20 with an infinite scroll trigger.", status: "backlog", priority: "low", labelIds: ["l2"], assigneeId: null, dueOffset: null },
  { title: "Redesign task detail modal header", description: "Move breadcrumb and status pill into a sticky header for long task descriptions.", status: "todo", priority: "medium", labelIds: ["l3", "l5"], assigneeId: "u5", dueOffset: 7 },
  { title: "Add CSV export for board", description: "Export the current filtered board view to a CSV file for offline reporting.", status: "backlog", priority: "low", labelIds: ["l2"], assigneeId: "u3", dueOffset: null },
  { title: "Harden auth token refresh", description: "Token refresh race condition can log users out during slow network conditions.", status: "in-review", priority: "urgent", labelIds: ["l1", "l8"], assigneeId: "u3", dueOffset: 1 },
  { title: "Polish empty states across app", description: "Add illustration and helper copy for empty board, empty search and empty activity log.", status: "todo", priority: "low", labelIds: ["l3"], assigneeId: "u5", dueOffset: 12 },
  { title: "Add keyboard shortcuts for board", description: "Support C to create task, / to focus search and Esc to close modals.", status: "backlog", priority: "medium", labelIds: ["l2", "l5"], assigneeId: "u2", dueOffset: null },
  { title: "Migrate charts to Recharts v3", description: "Update dashboard analytics charts to the latest Recharts API and remove deprecated props.", status: "done", priority: "medium", labelIds: ["l6"], assigneeId: "u2", dueOffset: -5 },
  { title: "Add due date reminder emails", description: "Send a reminder email 24 hours before a task becomes overdue.", status: "backlog", priority: "medium", labelIds: ["l4", "l2"], assigneeId: null, dueOffset: null },
  { title: "Fix label chip color contrast", description: "Some label colors fail contrast against white chip background in light theme.", status: "in-progress", priority: "low", labelIds: ["l1", "l3"], assigneeId: "u5", dueOffset: 4 },
  { title: "Add optimistic updates for task move", description: "Task status should update instantly in the UI before the request resolves.", status: "done", priority: "medium", labelIds: ["l2"], assigneeId: "u2", dueOffset: -8 },
];

const mobileSeeds: TaskSeed[] = [
  { title: "Offline sync for field reports", description: "Queue field reports locally and sync automatically once connection is restored.", status: "in-progress", priority: "urgent", labelIds: ["l2", "l4"], assigneeId: "u6", dueOffset: 2 },
  { title: "Push notification permission flow", description: "Add a friendly pre permission screen before triggering the native OS prompt.", status: "todo", priority: "medium", labelIds: ["l3"], assigneeId: "u4", dueOffset: 9 },
  { title: "Fix crash on Android 15 camera intent", description: "App crashes when returning from the camera intent on Android 15 devices.", status: "in-review", priority: "urgent", labelIds: ["l1"], assigneeId: "u6", dueOffset: 1 },
  { title: "Add biometric login", description: "Support Face ID and fingerprint login as an alternative to password entry.", status: "backlog", priority: "high", labelIds: ["l2", "l8"], assigneeId: null, dueOffset: null },
  { title: "Improve list scroll performance", description: "Report list drops frames on older devices when scrolling past 200 items.", status: "todo", priority: "medium", labelIds: ["l6"], assigneeId: "u4", dueOffset: 6 },
  { title: "Write onboarding QA checklist", description: "Document a manual QA checklist for the new onboarding flow before release.", status: "done", priority: "low", labelIds: ["l7"], assigneeId: "u4", dueOffset: -3 },
  { title: "Add dark mode to mobile shell", description: "Match the web app dark theme tokens inside the React Native shell.", status: "backlog", priority: "low", labelIds: ["l3", "l5"], assigneeId: null, dueOffset: null },
];

const infraSeeds: TaskSeed[] = [
  { title: "Set up blue green deployment", description: "Move production deploys to a blue green strategy to reduce downtime.", status: "in-progress", priority: "high", labelIds: ["l4"], assigneeId: "u6", dueOffset: 5 },
  { title: "Add uptime alerting to Slack", description: "Wire uptime monitor alerts into the on call Slack channel with severity tags.", status: "todo", priority: "medium", labelIds: ["l4"], assigneeId: "u7", dueOffset: 8 },
  { title: "Rotate database credentials", description: "Quarterly rotation of production database credentials and secrets manager entries.", status: "backlog", priority: "high", labelIds: ["l8"], assigneeId: "u3", dueOffset: null },
  { title: "Reduce CI pipeline runtime", description: "Parallelize test suites to bring average CI runtime under six minutes.", status: "in-review", priority: "medium", labelIds: ["l6"], assigneeId: "u6", dueOffset: 3 },
  { title: "Document incident response runbook", description: "Write a step by step runbook for severity one incidents.", status: "done", priority: "medium", labelIds: ["l7"], assigneeId: "u7", dueOffset: -10 },
];

const brandlineSeeds: TaskSeed[] = [
  { title: "Design new pricing page", description: "Explore three pricing tiers with a comparison table and annual toggle.", status: "in-progress", priority: "high", labelIds: ["l3"], assigneeId: "u5", dueOffset: 4 },
  { title: "Optimize hero image loading", description: "Serve responsive hero images with modern formats to improve LCP.", status: "todo", priority: "medium", labelIds: ["l5", "l6"], assigneeId: "u1", dueOffset: 7 },
  { title: "Add newsletter signup form", description: "Integrate a newsletter signup form using React Hook Form with validation.", status: "backlog", priority: "low", labelIds: ["l2"], assigneeId: null, dueOffset: null },
];

function buildTasks(projectId: string, key: string, seeds: TaskSeed[], reporterId: string): Task[] {
  return seeds.map((seed, index) => {
    const createdAt = subDays(now, 30 - index);
    return {
      id: `${projectId}-t${index + 1}`,
      code: `${key}-${100 + index}`,
      projectId,
      title: seed.title,
      description: seed.description,
      status: seed.status,
      priority: seed.priority,
      labelIds: seed.labelIds,
      assigneeId: seed.assigneeId,
      reporterId,
      dueDate: seed.dueOffset === null ? null : iso(addDays(now, seed.dueOffset)),
      createdAt: iso(createdAt),
      updatedAt: iso(subHours(now, index * 3 + 1)),
      subtasks: buildSubtasks(seed.title),
      order: index,
    };
  });
}

function buildSubtasks(seedTitle: string): Task["subtasks"] {
  const count = (seedTitle.length % 3) + 1;
  return Array.from({ length: count }).map((_, i) => ({
    id: `${seedTitle.slice(0, 3)}-sub-${i}`.toLowerCase().replace(/\s/g, ""),
    title: `Checklist item ${i + 1} for follow up`,
    done: i === 0 && count > 1,
  }));
}

export const tasks: Task[] = [
  ...buildTasks("p1", "ATL", atlasSeeds, "u1"),
  ...buildTasks("p2", "MOB", mobileSeeds, "u7"),
  ...buildTasks("p3", "INF", infraSeeds, "u7"),
  ...buildTasks("p4", "BRD", brandlineSeeds, "u1"),
];

const activityActions: { action: ActivityEntry["action"]; detail: (t: Task) => string }[] = [
  { action: "created", detail: (t) => `created task "${t.title}"` },
  { action: "moved", detail: (t) => `moved "${t.title}" to ${t.status.replace("-", " ")}` },
  { action: "assigned", detail: (t) => `assigned "${t.title}"` },
  { action: "commented", detail: (t) => `commented on "${t.title}"` },
  { action: "priority-changed", detail: (t) => `changed priority of "${t.title}" to ${t.priority}` },
  { action: "due-date-changed", detail: (t) => `updated due date for "${t.title}"` },
  { action: "completed", detail: (t) => `marked "${t.title}" as done` },
];

export const activityLog: ActivityEntry[] = tasks
  .flatMap((task, i) => {
    const entriesForTask = (i % 4) + 2;
    return Array.from({ length: entriesForTask }).map((_, j) => {
      const meta = activityActions[(i + j) % activityActions.length];
      const actor = users[(i + j) % users.length];
      return {
        id: `act-${task.id}-${j}`,
        taskId: task.id,
        projectId: task.projectId,
        actorId: actor.id,
        action: meta.action,
        detail: meta.detail(task),
        createdAt: iso(subHours(now, i * 5 + j * 2 + 1)),
      };
    });
  })
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export function userById(id: string | null): User | undefined {
  if (!id) return undefined;
  return users.find((u) => u.id === id);
}

export function labelsByIds(ids: string[]): Label[] {
  return labels.filter((l) => ids.includes(l.id));
}

export function projectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export { statuses, priorities };
