import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20 disabled:opacity-50",
  secondary:
    "bg-surface-light dark:bg-surface-raised-dark border border-border-light dark:border-border-dark text-ink-light dark:text-ink-dark hover:bg-canvas-light dark:hover:bg-white/5",
  ghost:
    "text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5 hover:text-ink-light dark:hover:text-ink-dark",
  danger: "bg-danger text-white hover:bg-red-700",
};

const sizeClasses = {
  sm: "h-8 px-2.5 text-xs gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
