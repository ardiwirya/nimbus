import { create } from "zustand";
import { persist } from "zustand/middleware";
import { workspaces, projects } from "../data/dummyData";

interface AppState {
  theme: "light" | "dark";
  toggleTheme: () => void;

  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;

  activeProjectId: string;
  setActiveProjectId: (id: string) => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        document.documentElement.classList.toggle("dark", next === "dark");
        set({ theme: next });
      },

      activeWorkspaceId: workspaces[0].id,
      setActiveWorkspaceId: (id) => {
        const firstProject = projects.find((p) => p.workspaceId === id);
        set({ activeWorkspaceId: id, activeProjectId: firstProject?.id ?? "" });
      },

      activeProjectId: projects[0].id,
      setActiveProjectId: (id) => set({ activeProjectId: id }),

      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      mobileNavOpen: false,
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
    }),
    {
      name: "nimbus-theme",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
