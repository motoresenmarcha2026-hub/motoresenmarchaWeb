import { cn } from "@/lib/utils";
import type { Prioridad } from "../types";

const OPCIONES: {
  key: Prioridad;
  label: string;
  descripcion: string;
  activoClass: string;
}[] = [
  {
    key: "normal",
    label: "Normal",
    descripcion: "Puedo esperar, sin prisa",
    activoClass: "border-action-primary ring-action-primary/30",
  },
  {
    key: "urgente",
    label: "Urgente",
    descripcion: "Lo necesito hoy mismo",
    activoClass: "border-action-urgent ring-action-urgent/30",
  },
  {
    key: "emergencia",
    label: "Emergencia",
    descripcion: "¡Estoy varado, ayuda ya!",
    activoClass: "border-emergency ring-emergency/30 bg-emergency/5",
  },
];

/** Selector de prioridad: Normal / Urgente / Emergencia. */
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
              "flex flex-col items-start gap-xs rounded-xl border bg-surface-card p-md text-left transition-all",
              activo
                ? `ring-2 ${o.activoClass}`
                : "border-border-subtle hover:border-foreground-secondary"
            )}
          >
            <span
              className={cn(
                "font-heading text-base font-bold",
                o.key === "emergencia"
                  ? "text-emergency"
                  : o.key === "urgente"
                  ? "text-action-urgent"
                  : "text-foreground-primary"
              )}
            >
              {o.label}
            </span>
            <span className="font-caption text-xs text-foreground-secondary">
              {o.descripcion}
            </span>
          </button>
        );
      })}
    </div>
  );
}
