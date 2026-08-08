import { useMemo } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useUIStore } from "../store/useUIStore";
import type { Task } from "../types";

export function useFilteredTasks(projectId: string): Task[] {
  const tasks = useTaskStore((s) => s.tasks);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const filters = useUIStore((s) => s.filters);

  return useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tasks
      .filter((t) => t.projectId === projectId)
      .filter((t) => {
        if (!q) return true;
        return (
          t.title.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      })
      .filter((t) => (filters.priorities.length ? filters.priorities.includes(t.priority) : true))
      .filter((t) => (filters.statuses.length ? filters.statuses.includes(t.status) : true))
      .filter((t) =>
        filters.assigneeIds.length ? (t.assigneeId ? filters.assigneeIds.includes(t.assigneeId) : false) : true
      )
      .filter((t) =>
        filters.labelIds.length ? t.labelIds.some((l) => filters.labelIds.includes(l)) : true
      );
  }, [tasks, projectId, searchQuery, filters]);
}
