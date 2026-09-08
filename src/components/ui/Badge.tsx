import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatearEta } from "@/lib/utils";
import type { Disponibilidad } from "@/features/talleres/types";

/**
 * Sellos del mundo: planchas de tinta con versales de plantilla.
 * Disponible va en verde de canal; ocupado en gris de trama.
 */
export function BadgeDisponibilidad({
  estado,
  className,
}: {
  estado: Disponibilidad;
  className?: string;
}) {
  const disponible = estado === "available";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-xs rounded-none px-sm py-1 font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-inverse",
        disponible ? "bg-status-available" : "bg-status-busy",
        className
      )}
    >
      <span
        aria-hidden
        className={cn("h-2 w-2 rounded-none", "bg-foreground-inverse")}
      />
      {disponible ? "Disponible" : "Ocupado"}
    </span>
  );
}

/** Tiempo estimado de llegada. Es medición: cifras tabulares. */
export function BadgeEta({
  minutos,
  className,
}: {
  minutos: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "cifras inline-flex items-center gap-xs rounded-none border-2 border-border-primary bg-surface-card px-sm py-0.5 font-heading text-xs font-extrabold uppercase tracking-[0.08em] text-foreground-primary",
        className
      )}
    >
      <Clock size={12} aria-hidden />
      {formatearEta(minutos)}
    </span>
  );
}
