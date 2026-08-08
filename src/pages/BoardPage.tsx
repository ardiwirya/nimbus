import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Topbar } from "../components/layout/Topbar";
import { Board } from "../components/kanban/Board";
import { TaskDetailModal } from "../components/kanban/TaskDetailModal";
import { CreateTaskModal } from "../components/forms/CreateTaskModal";
import { useAppStore } from "../store/useAppStore";
import { useProjectStore } from "../store/useProjectStore";

export function BoardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const setActiveProjectId = useAppStore((s) => s.setActiveProjectId);
  const projects = useProjectStore((s) => s.projects);
  const project = projectId ? projects.find((p) => p.id === projectId) : undefined;

  useEffect(() => {
    if (projectId) setActiveProjectId(projectId);
  }, [projectId, setActiveProjectId]);

  if (!projectId || !project) return <Navigate to="/" replace />;

  return (
    <>
      <Topbar title={project.name} subtitle={`${project.key} board \u00b7 ${project.description}`} showBoardActions />
      <div className="flex-1 overflow-hidden">
        <Board projectId={project.id} />
      </div>
      <TaskDetailModal />
      <CreateTaskModal />
    </>
  );
}
