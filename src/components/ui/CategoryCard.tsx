import * as React from "react";
import { cn } from "@/lib/utils";
import { Icono } from "./Icono";

interface CategoryCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Nombre de ícono (registro de Icono). */
  icono: string;
  label: string;
  descripcion?: string;
  /** Estado seleccionado (para el selector de tipo de problema). */
  seleccionado?: boolean;
}

/** Tarjeta de categoría / tipo de servicio con ícono. */
export const CategoryCard = React.forwardRef<
  HTMLButtonElement,
  CategoryCardProps
>(({ icono, label, descripcion, seleccionado, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={seleccionado}
      className={cn(
        "group flex flex-col items-center gap-sm rounded-xl border bg-surface-card p-md text-center transition-all hover:-translate-y-0.5 hover:shadow-md",
        seleccionado
          ? "border-action-primary ring-2 ring-action-primary/30"
          : "border-border-subtle",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
          seleccionado
            ? "bg-action-primary text-foreground-inverse"
            : "bg-surface-page text-accent-primary group-hover:bg-accent-primary group-hover:text-foreground-inverse"
        )}
      >
        <Icono nombre={icono} size={22} />
      </span>
      <span className="font-caption text-sm font-semibold text-foreground-primary">
        {label}
      </span>
      {descripcion && (
        <span className="font-caption text-xs text-foreground-secondary">
          {descripcion}
        </span>
      )}
    </button>
  );
});
CategoryCard.displayName = "CategoryCard";
