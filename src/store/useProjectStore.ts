import { create } from "zustand";
import { projects as initialProjects } from "../data/dummyData";
import type { Project } from "../types";

interface ProjectState {
  projects: Project[];
  addProject: (project: Project) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: initialProjects,
  addProject: (project) => set((s) => ({ projects: [...s.projects, project] })),
}));
