import { ListFilter, Check } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { users, labels } from "../../data/dummyData";
import { PRIORITY_META, STATUS_META } from "../../types";
import type { Priority, TaskStatus } from "../../types";
import { Popover } from "./Popover";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

export function FilterBar() {
  const {
    filters,
    toggleAssigneeFilter,
    toggleLabelFilter,
    togglePriorityFilter,
    toggleStatusFilter,
    clearFilters,
    activeFilterCount,
  } = useUIStore();

  const count = activeFilterCount();

  return (
    <Popover
      align="right"
      trigger={
        <Button variant="secondary" size="sm" icon={<ListFilter size={14} />}>
          Filter
          {count > 0 && (
            <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </Button>
      }
      panelClassName="w-72 max-h-[26rem] overflow-y-auto"
    >
      <div className="flex items-center justify-between px-1 pb-2">
        <p className="text-xs font-semibold">Filters</p>
        {count > 0 && (
          <button onClick={clearFilters} className="text-[11px] font-medium text-brand-600 hover:underline">
            Clear all
          </button>
        )}
      </div>

      <FilterSection label="Status">
        {(Object.keys(STATUS_META) as TaskStatus[]).map((s) => (
          <FilterRow
            key={s}
            active={filters.statuses.includes(s)}
            onClick={() => toggleStatusFilter(s)}
            label={STATUS_META[s].label}
            dotColor={STATUS_META[s].accent}
          />
        ))}
      </FilterSection>

      <FilterSection label="Priority">
        {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
          <FilterRow
            key={p}
            active={filters.priorities.includes(p)}
            onClick={() => togglePriorityFilter(p)}
            label={PRIORITY_META[p].label}
            dotColor={PRIORITY_META[p].color}
          />
        ))}
      </FilterSection>

      <FilterSection label="Assignee">
        {users.map((u) => (
          <button
            key={u.id}
            onClick={() => toggleAssigneeFilter(u.id)}
            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-canvas-light dark:hover:bg-white/5"
          >
            <span className="flex items-center gap-2">
              <Avatar user={u} size="xs" />
              {u.name}
            </span>
            {filters.assigneeIds.includes(u.id) && <Check size={14} className="text-brand-600" />}
          </button>
        ))}
      </FilterSection>

      <FilterSection label="Label">
        {labels.map((l) => (
          <FilterRow
            key={l.id}
            active={filters.labelIds.includes(l.id)}
            onClick={() => toggleLabelFilter(l.id)}
            label={l.name}
            dotColor={l.color}
          />
        ))}
      </FilterSection>
    </Popover>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border-light dark:border-border-dark py-2 first:border-t-0">
      <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-light dark:text-muted-dark">
        {label}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function FilterRow({
  active,
  onClick,
  label,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dotColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-canvas-light dark:hover:bg-white/5"
    >
      <span className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dotColor }} />
        {label}
      </span>
      {active && <Check size={14} className="text-brand-600" />}
    </button>
  );
}
