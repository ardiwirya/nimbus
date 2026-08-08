import { useMemo, useState } from "react";
import { Topbar } from "../components/layout/Topbar";
import { ActivityLog } from "../components/activity/ActivityLog";
import { useAppStore } from "../store/useAppStore";
import { useTaskStore } from "../store/useTaskStore";
import { projects } from "../data/dummyData";
import { cn } from "../lib/cn";

export function ActivityPage() {
  const activeWorkspaceId = useAppStore((s) => s.activeWorkspaceId);
  const activity = useTaskStore((s) => s.activity);
  const [projectFilter, setProjectFilter] = useState<string>("all");

  const workspaceProjects = projects.filter((p) => p.workspaceId === activeWorkspaceId);
  const projectIds = workspaceProjects.map((p) => p.id);

  const entries = useMemo(() => {
    return activity
      .filter((a) => projectIds.includes(a.projectId))
      .filter((a) => (projectFilter === "all" ? true : a.projectId === projectFilter));
  }, [activity, projectIds, projectFilter]);

  return (
    <>
      <Topbar title="Activity" subtitle="Everything happening across your workspace" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setProjectFilter("all")}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              projectFilter === "all"
                ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                : "border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5"
            )}
          >
            All projects
          </button>
          {workspaceProjects.map((p) => (
            <button
              key={p.id}
              onClick={() => setProjectFilter(p.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                projectFilter === p.id
                  ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                  : "border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="card-surface max-w-2xl rounded-xl p-5">
          <ActivityLog entries={entries} />
        </div>
      </div>
    </>
  );
}
