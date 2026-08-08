import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { useProjectStore } from "../../store/useProjectStore";
import { currentUser } from "../../data/dummyData";
import type { Project } from "../../types";
import { Button } from "../common/Button";
import { cn } from "../../lib/cn";

interface ProjectFormValues {
  name: string;
  key: string;
  description: string;
  color: string;
}

const colorOptions = ["#6a5cf0", "#2563eb", "#1f9d55", "#d97706", "#dc2626", "#0891b2", "#9333ea"];

export function ProjectForm({ onDone }: { onDone: (projectId: string) => void }) {
  const activeWorkspaceId = useAppStore((s) => s.activeWorkspaceId);
  const addProject = useProjectStore((s) => s.addProject);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    defaultValues: { name: "", key: "", description: "", color: colorOptions[0] },
  });

  const selectedColor = watch("color");

  function onSubmit(values: ProjectFormValues) {
    const id = `p-${Date.now()}`;
    const newProject: Project = {
      id,
      workspaceId: activeWorkspaceId,
      name: values.name.trim(),
      key: values.key.trim().toUpperCase(),
      description: values.description.trim() || "No description yet.",
      color: values.color,
      icon: "Hash",
      memberIds: [currentUser.id],
      createdAt: new Date().toISOString(),
    };
    addProject(newProject);
    onDone(id);
    navigate(`/board/${id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-light dark:text-muted-dark">
          Project name
        </label>
        <input
          {...register("name", { required: "Project name is required", minLength: { value: 2, message: "Too short" } })}
          autoFocus
          placeholder="e.g. Customer Portal"
          className="h-9 w-full rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-light dark:text-muted-dark">
          Project key
        </label>
        <input
          {...register("key", {
            required: "Project key is required",
            minLength: { value: 2, message: "Use 2 to 5 letters" },
            maxLength: { value: 5, message: "Use 2 to 5 letters" },
            pattern: { value: /^[A-Za-z]+$/, message: "Letters only" },
          })}
          placeholder="e.g. CUP"
          maxLength={5}
          className="h-9 w-full rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-3 text-sm uppercase outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        {errors.key && <p className="mt-1 text-xs text-danger">{errors.key.message}</p>}
        <p className="mt-1 text-[11px] text-muted-light dark:text-muted-dark">
          Used as the prefix for task codes, for example CUP-101.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-light dark:text-muted-dark">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="What is this project about?"
          className="w-full resize-none rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-light dark:text-muted-dark">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              type="button"
              key={color}
              onClick={() => setValue("color", color)}
              className={cn(
                "h-7 w-7 rounded-full ring-offset-2 ring-offset-surface-light dark:ring-offset-surface-raised-dark transition-shadow",
                selectedColor === color && "ring-2 ring-ink-light dark:ring-ink-dark"
              )}
              style={{ backgroundColor: color }}
              aria-label={`Choose color ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border-light dark:border-border-dark pt-4">
        <Button type="button" variant="ghost" onClick={() => onDone("")}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Create project
        </Button>
      </div>
    </form>
  );
}
