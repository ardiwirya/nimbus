import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ListChecks, Clock, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Topbar } from "../components/layout/Topbar";
import { StatsCard } from "../components/dashboard/StatsCard";
import { StatusDonutChart } from "../components/dashboard/StatusDonutChart";
import { PriorityBarChart } from "../components/dashboard/PriorityBarChart";
import { TeamWorkloadChart } from "../components/dashboard/TeamWorkloadChart";
import { VelocityTrendChart } from "../components/dashboard/VelocityTrendChart";
import { ActivityLog } from "../components/activity/ActivityLog";
import { useAppStore } from "../store/useAppStore";
import { useTaskStore } from "../store/useTaskStore";
import { useProjectStore } from "../store/useProjectStore";
import { isOverdue } from "../lib/dates";
import { isThisWeek } from "date-fns";

export function DashboardPage() {
  const activeWorkspaceId = useAppStore((s) => s.activeWorkspaceId);
  const tasks = useTaskStore((s) => s.tasks);
  const activity = useTaskStore((s) => s.activity);
  const projects = useProjectStore((s) => s.projects);

  const workspaceProjects = projects.filter((p) => p.workspaceId === activeWorkspaceId);
  const projectIds = workspaceProjects.map((p) => p.id);

  const workspaceTasks = useMemo(
    () => tasks.filter((t) => projectIds.includes(t.projectId)),
    [tasks, projectIds]
  );

  const stats = useMemo(() => {
    const inProgress = workspaceTasks.filter((t) => t.status === "in-progress").length;
    const overdue = workspaceTasks.filter((t) => isOverdue(t.dueDate, t.status === "done")).length;
    const completedThisWeek = workspaceTasks.filter(
      (t) => t.status === "done" && isThisWeek(new Date(t.updatedAt))
    ).length;
    return { total: workspaceTasks.length, inProgress, overdue, completedThisWeek };
  }, [workspaceTasks]);

  const workspaceActivity = activity.filter((a) => projectIds.includes(a.projectId)).slice(0, 8);

  return (
    <>
      <Topbar title="Dashboard" subtitle="Overview across every project in your workspace" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatsCard label="Total tasks" value={stats.total} icon={ListChecks} accent="#6a5cf0" />
          <StatsCard label="In progress" value={stats.inProgress} icon={Clock} accent="#2563eb" />
          <StatsCard label="Overdue" value={stats.overdue} icon={AlertTriangle} accent="#dc2626" />
          <StatsCard label="Completed this week" value={stats.completedThisWeek} icon={CheckCircle2} accent="#1f9d55" />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <VelocityTrendChart tasks={workspaceTasks} />
          <StatusDonutChart tasks={workspaceTasks} />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PriorityBarChart tasks={workspaceTasks} />
          <TeamWorkloadChart tasks={workspaceTasks} />
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold">Projects</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {workspaceProjects.map((project) => {
              const projectTasks = workspaceTasks.filter((t) => t.projectId === project.id);
              const done = projectTasks.filter((t) => t.status === "done").length;
              const progress = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0;
              return (
                <Link
                  key={project.id}
                  to={`/board/${project.id}`}
                  className="card-surface group flex flex-col gap-3 rounded-xl p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{ backgroundColor: project.color }}
                    >
                      {project.key.slice(0, 2)}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-muted-light dark:text-muted-dark opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{project.name}</p>
                    <p className="mt-0.5 text-xs text-muted-light dark:text-muted-dark line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-light dark:text-muted-dark">
                      <span>{projectTasks.length} tasks</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-light dark:bg-white/5">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${progress}%`, backgroundColor: project.color }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="card-surface rounded-xl p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent activity</h2>
            <Link to="/activity" className="text-xs font-medium text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          <ActivityLog entries={workspaceActivity} />
        </div>
      </div>
    </>
  );
}
