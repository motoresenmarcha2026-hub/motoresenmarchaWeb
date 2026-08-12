import { cn } from "@/lib/utils";

/** Etiqueta pequeña (p. ej. especialidad de un taller). */
export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border-subtle bg-surface-page px-sm py-xs text-xs font-medium font-caption text-foreground-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
