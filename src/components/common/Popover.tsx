import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  panelClassName?: string;
}

export function Popover({ trigger, children, align = "left", panelClassName }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-40 mt-2 min-w-[14rem] rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-raised-dark shadow-xl p-2",
            align === "right" ? "right-0" : "left-0",
            panelClassName
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {typeof children === "function" ? (children as (close: () => void) => ReactNode)(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  );
}
