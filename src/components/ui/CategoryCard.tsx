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

/**
 * Tesela de tipo de servicio. Filete de tinta; al seleccionarse se rellena
 * de rojo, que es como este mundo marca lo elegido.
 */
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
        "group flex min-h-[7rem] flex-col items-start justify-between gap-sm rounded-none border-2 p-md text-left transition-colors",
        seleccionado
          ? "border-emergency bg-emergency text-foreground-inverse"
          : "border-border-primary bg-surface-card text-foreground-primary hover:bg-emergency hover:border-emergency hover:text-foreground-inverse",
        className
      )}
      {...props}
    >
      <Icono nombre={icono} size={26} className="shrink-0" />
      <span className="flex flex-col gap-0.5">
        <span className="font-heading text-base font-extrabold uppercase leading-none tracking-[0.04em]">
          {label}
        </span>
        {descripcion && (
          <span
            className={cn(
              "font-body text-xs leading-snug",
              seleccionado
                ? "text-foreground-inverse-secondary"
                : "text-foreground-secondary group-hover:text-foreground-inverse-secondary"
            )}
          >
            {descripcion}
          </span>
        )}
      </span>
    </button>
  );
});
CategoryCard.displayName = "CategoryCard";
