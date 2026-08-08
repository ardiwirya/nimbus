import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  ChevronsUpDown,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Check,
  Hash,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useUIStore } from "../../store/useUIStore";
import { workspaces } from "../../data/dummyData";
import { Popover } from "../common/Popover";
import { cn } from "../../lib/cn";

export function Sidebar() {
  const { activeWorkspaceId, setActiveWorkspaceId, activeProjectId, setActiveProjectId, sidebarCollapsed, toggleSidebar, mobileNavOpen, setMobileNavOpen } =
    useAppStore();
  const projects = useProjectStore((s) => s.projects);
  const openCreateProjectModal = useUIStore((s) => s.openCreateProjectModal);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId)!;
  const workspaceProjects = projects.filter((p) => p.workspaceId === activeWorkspaceId);

  return (
    <>
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarCollapsed ? "lg:w-16" : "lg:w-64",
          "w-64",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-border-light dark:border-border-dark px-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white font-bold text-xs">
            N
          </div>
          {!sidebarCollapsed && (
            <Popover
              trigger={
                <button className="flex flex-1 items-center justify-between rounded-md px-1.5 py-1 text-left hover:bg-canvas-light dark:hover:bg-white/5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-tight">{activeWorkspace.name}</p>
                    <p className="text-[11px] text-muted-light dark:text-muted-dark">{activeWorkspace.plan} plan</p>
                  </div>
                  <ChevronsUpDown size={14} className="text-muted-light dark:text-muted-dark shrink-0" />
                </button>
              }
            >
              <p className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-light dark:text-muted-dark">
                Workspaces
              </p>
              {workspaces.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setActiveWorkspaceId(w.id)}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-canvas-light dark:hover:bg-white/5"
                >
                  <span className="truncate">{w.name}</span>
                  {w.id === activeWorkspaceId && <Check size={14} className="text-brand-600" />}
                </button>
              ))}
            </Popover>
          )}
        </div>

        <nav className="flex flex-col gap-0.5 px-2 py-3">
          <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" collapsed={sidebarCollapsed} end />
          <SidebarLink to="/activity" icon={Activity} label="Activity" collapsed={sidebarCollapsed} />
        </nav>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between px-2 pb-1 pt-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-light dark:text-muted-dark">
                Projects
              </p>
              <button
                onClick={openCreateProjectModal}
                className="rounded p-0.5 text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5"
                title="Create project"
              >
                <Plus size={13} />
              </button>
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            {workspaceProjects.map((project) => (
              <NavLink
                key={project.id}
                to={`/board/${project.id}`}
                onClick={() => {
                  setActiveProjectId(project.id);
                  setMobileNavOpen(false);
                }}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    isActive || activeProjectId === project.id
                      ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-200 font-medium"
                      : "text-ink-light dark:text-ink-dark hover:bg-canvas-light dark:hover:bg-white/5"
                  )
                }
                title={project.name}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: project.color }}
                >
                  <Hash size={11} />
                </span>
                {!sidebarCollapsed && <span className="truncate">{project.name}</span>}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="border-t border-border-light dark:border-border-dark p-2">
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5"
          >
            {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            {!sidebarCollapsed && "Collapse"}
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  to,
  icon: Icon,
  label,
  collapsed,
  end,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  collapsed: boolean;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-200"
            : "text-ink-light dark:text-ink-dark hover:bg-canvas-light dark:hover:bg-white/5"
        )
      }
      title={label}
    >
      <Icon size={16} className="shrink-0" />
      {!collapsed && label}
    </NavLink>
  );
}
