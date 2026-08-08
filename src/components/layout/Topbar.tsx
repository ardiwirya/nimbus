import { Menu, Moon, Sun, Plus } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useUIStore } from "../../store/useUIStore";
import { currentUser } from "../../data/dummyData";
import { SearchInput } from "../common/SearchInput";
import { FilterBar } from "../common/FilterBar";
import { Button } from "../common/Button";
import { Avatar } from "../common/Avatar";
import { Popover } from "../common/Popover";

interface TopbarProps {
  title: string;
  subtitle?: string;
  showBoardActions?: boolean;
}

export function Topbar({ title, subtitle, showBoardActions = false }: TopbarProps) {
  const { theme, toggleTheme, setMobileNavOpen } = useAppStore();
  const { searchQuery, setSearchQuery, openCreateTaskModal } = useUIStore();

  return (
    <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border-light dark:border-border-dark bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="rounded-md p-1.5 text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold leading-tight">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-light dark:text-muted-dark">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Popover
            align="right"
            trigger={
              <button className="rounded-full" aria-label="Show current user">
                <Avatar user={currentUser} size="sm" />
              </button>
            }
            panelClassName="w-56"
          >
            <div className="flex items-center gap-2 px-1 py-1">
              <Avatar user={currentUser} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{currentUser.name}</p>
                <p className="truncate text-[11px] text-muted-light dark:text-muted-dark">{currentUser.email}</p>
                <p className="truncate text-[11px] text-muted-light dark:text-muted-dark">{currentUser.role}</p>
              </div>
            </div>
          </Popover>
        </div>
      </div>

      {showBoardActions && (
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput value={searchQuery} onChange={setSearchQuery} className="w-full sm:w-64" />
          <FilterBar />
          <div className="ml-auto">
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => openCreateTaskModal()}>
              New task
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
