import { cn } from "@/lib/utils";

/** Etiqueta estarcida (p. ej. especialidad de un taller). */
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
        "inline-flex items-center rounded-none border border-border-primary bg-transparent px-sm py-0.5 font-heading text-xs font-bold uppercase tracking-[0.08em] text-foreground-primary",
        className
      )}
    >
      {children}
    </span>
  );
}
