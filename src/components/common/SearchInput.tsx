import { Search, X } from "lucide-react";
import { cn } from "../../lib/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search tasks...", className }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search
        size={15}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark pl-8 pr-8 text-sm placeholder:text-muted-light dark:placeholder:text-muted-dark focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
