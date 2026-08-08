import { create } from "zustand";
import type { Priority, TaskStatus } from "../types";

interface Filters {
  assigneeIds: string[];
  labelIds: string[];
  priorities: Priority[];
  statuses: TaskStatus[];
}

const emptyFilters: Filters = {
  assigneeIds: [],
  labelIds: [],
  priorities: [],
  statuses: [],
};

interface UIState {
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  filters: Filters;
  toggleAssigneeFilter: (id: string) => void;
  toggleLabelFilter: (id: string) => void;
  togglePriorityFilter: (p: Priority) => void;
  toggleStatusFilter: (s: TaskStatus) => void;
  clearFilters: () => void;
  activeFilterCount: () => number;

  activeTaskId: string | null;
  openTaskDetail: (id: string) => void;
  closeTaskDetail: () => void;

  createTaskModalOpen: boolean;
  createTaskDefaultStatus: TaskStatus;
  openCreateTaskModal: (status?: TaskStatus) => void;
  closeCreateTaskModal: () => void;

  createProjectModalOpen: boolean;
  openCreateProjectModal: () => void;
  closeCreateProjectModal: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  filters: emptyFilters,
  toggleAssigneeFilter: (id) =>
    set((s) => ({
      filters: {
        ...s.filters,
        assigneeIds: s.filters.assigneeIds.includes(id)
          ? s.filters.assigneeIds.filter((x) => x !== id)
          : [...s.filters.assigneeIds, id],
      },
    })),
  toggleLabelFilter: (id) =>
    set((s) => ({
      filters: {
        ...s.filters,
        labelIds: s.filters.labelIds.includes(id)
          ? s.filters.labelIds.filter((x) => x !== id)
          : [...s.filters.labelIds, id],
      },
    })),
  togglePriorityFilter: (p) =>
    set((s) => ({
      filters: {
        ...s.filters,
        priorities: s.filters.priorities.includes(p)
          ? s.filters.priorities.filter((x) => x !== p)
          : [...s.filters.priorities, p],
      },
    })),
  toggleStatusFilter: (statusVal) =>
    set((s) => ({
      filters: {
        ...s.filters,
        statuses: s.filters.statuses.includes(statusVal)
          ? s.filters.statuses.filter((x) => x !== statusVal)
          : [...s.filters.statuses, statusVal],
      },
    })),
  clearFilters: () => set({ filters: emptyFilters }),
  activeFilterCount: () => {
    const f = get().filters;
    return f.assigneeIds.length + f.labelIds.length + f.priorities.length + f.statuses.length;
  },

  activeTaskId: null,
  openTaskDetail: (id) => set({ activeTaskId: id }),
  closeTaskDetail: () => set({ activeTaskId: null }),

  createTaskModalOpen: false,
  createTaskDefaultStatus: "todo",
  openCreateTaskModal: (statusVal) =>
    set({ createTaskModalOpen: true, createTaskDefaultStatus: statusVal ?? "todo" }),
  closeCreateTaskModal: () => set({ createTaskModalOpen: false }),

  createProjectModalOpen: false,
  openCreateProjectModal: () => set({ createProjectModalOpen: true }),
  closeCreateProjectModal: () => set({ createProjectModalOpen: false }),
}));
