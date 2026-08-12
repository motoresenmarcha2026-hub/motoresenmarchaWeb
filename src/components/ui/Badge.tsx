import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatearEta } from "@/lib/utils";
import type { Disponibilidad } from "@/features/talleres/types";

/** Badge de disponibilidad: verde "Disponible" / gris "Ocupado". */
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
        "inline-flex items-center gap-xs rounded-full px-sm py-xs text-xs font-semibold font-caption",
        disponible
          ? "bg-status-available/15 text-status-available"
          : "bg-status-busy/15 text-status-busy",
        className
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          disponible ? "bg-status-available" : "bg-status-busy"
        )}
      />
      {disponible ? "Disponible" : "Ocupado"}
    </span>
  );
}

/** Badge de tiempo estimado de llegada (ETA). */
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
        "inline-flex items-center gap-xs rounded-full bg-surface-inverse/5 px-sm py-xs text-xs font-semibold font-data text-foreground-secondary",
        className
      )}
    >
      <Clock size={12} aria-hidden />
      {formatearEta(minutos)}
    </span>
  );
}
