import { cn } from "@/lib/utils";
import type { Prioridad } from "../types";

const OPCIONES: {
  key: Prioridad;
  label: string;
  descripcion: string;
  /** Plancha de tinta cuando está elegida. */
  activoClass: string;
}[] = [
  {
    key: "normal",
    label: "Normal",
    descripcion: "Puedo esperar, sin prisa",
    activoClass: "border-action-primary bg-action-primary",
  },
  {
    key: "urgente",
    label: "Urgente",
    descripcion: "Lo necesito hoy mismo",
    activoClass: "border-action-urgent bg-action-urgent",
  },
  {
    key: "emergencia",
    label: "Emergencia",
    descripcion: "¡Estoy varado, ayuda ya!",
    activoClass: "border-emergency bg-emergency",
  },
];

/**
 * Selector de prioridad. La elegida se imprime como plancha de tinta plena;
 * el anillo difuso anterior era aire, y este mundo marca con tinta.
 */
export function SelectorPrioridad({
  valor,
  onChange,
}: {
  valor: Prioridad;
  onChange: (p: Prioridad) => void;
}) {
  return (
    <div className="grid gap-sm sm:grid-cols-3">
      {OPCIONES.map((o) => {
        const activo = valor === o.key;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={activo}
            onClick={() => onChange(o.key)}
            className={cn(
              "flex min-h-[4.5rem] flex-col items-start justify-center gap-0.5 rounded-none border-2 p-md text-left transition-colors",
              activo
                ? `${o.activoClass} text-foreground-inverse`
                : "border-border-primary bg-surface-card text-foreground-primary hover:bg-surface-page"
            )}
          >
            <span className="font-heading text-base font-extrabold uppercase leading-none tracking-[0.04em]">
              {o.label}
            </span>
            <span
              className={cn(
                "font-body text-xs",
                activo ? "text-foreground-inverse-secondary" : "text-foreground-secondary"
              )}
            >
              {o.descripcion}
            </span>
          </button>
        );
      })}
    </div>
  );
}
