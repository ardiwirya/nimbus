import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { CreateProjectModal } from "../forms/CreateProjectModal";

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas-light dark:bg-canvas-dark">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
      <CreateProjectModal />
    </div>
  );
}
