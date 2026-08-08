import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { useTaskStore } from "../../store/useTaskStore";
import { useFilteredTasks } from "../../hooks/useFilteredTasks";
import { statuses } from "../../data/dummyData";
import type { Task, TaskStatus } from "../../types";
import { EmptyState } from "../common/EmptyState";
import { SearchX } from "lucide-react";

interface BoardProps {
  projectId: string;
}

export function Board({ projectId }: BoardProps) {
  const filteredTasks = useFilteredTasks(projectId);
  const moveTask = useTaskStore((s) => s.moveTask);
  const reorderWithinColumn = useTaskStore((s) => s.reorderWithinColumn);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const columns = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      backlog: [],
      todo: [],
      "in-progress": [],
      "in-review": [],
      done: [],
    };
    filteredTasks.forEach((t) => map[t.status].push(t));
    statuses.forEach((s) => map[s].sort((a, b) => a.order - b.order));
    return map;
  }, [filteredTasks]);

  function handleDragStart(event: DragStartEvent) {
    const task = filteredTasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeTaskData = active.data.current?.task as Task | undefined;
    if (!activeTaskData) return;

    const overData = over.data.current;
    const overIsColumn = overData?.type === "column";
    const targetStatus: TaskStatus = overIsColumn
      ? (overData?.status as TaskStatus)
      : ((overData?.task as Task | undefined)?.status ?? activeTaskData.status);

    const targetColumnTasks = columns[targetStatus].filter((t) => t.id !== activeTaskData.id);

    let newIndex = targetColumnTasks.length;
    if (!overIsColumn) {
      const overIndex = targetColumnTasks.findIndex((t) => t.id === over.id);
      if (overIndex !== -1) newIndex = overIndex;
    }

    const reordered = [...targetColumnTasks];
    reordered.splice(newIndex, 0, activeTaskData);

    if (activeTaskData.status !== targetStatus) {
      moveTask(activeTaskData.id, targetStatus, newIndex);
      reorderWithinColumn(
        projectId,
        targetStatus,
        reordered.map((t) => t.id)
      );
    } else {
      reorderWithinColumn(
        projectId,
        targetStatus,
        reordered.map((t) => t.id)
      );
    }
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={SearchX}
          title="No tasks match your filters"
          description="Try adjusting your search query or clearing active filters to see more tasks."
        />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto p-4 sm:p-6 scrollbar-thin">
        {statuses.map((status) => (
          <Column key={status} status={status} tasks={columns[status]} />
        ))}
      </div>
      <DragOverlay>{activeTask && <TaskCard task={activeTask} dragOverlay />}</DragOverlay>
    </DndContext>
  );
}
