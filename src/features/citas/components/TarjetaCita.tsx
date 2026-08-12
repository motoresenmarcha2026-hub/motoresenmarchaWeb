import Link from "next/link";
import { Wrench, Calendar, Clock, ChevronRight } from "lucide-react";
import { cn, formatearFecha } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import type { Cita, EstadoCita } from "../types";

const ESTADO: Record<EstadoCita, { label: string; class: string }> = {
  pendiente: { label: "Pendiente", class: "bg-action-urgent/15 text-action-urgent" },
  confirmada: {
    label: "Confirmada",
    class: "bg-status-available/15 text-status-available",
  },
  completada: {
    label: "Completada",
    class: "bg-action-primary/15 text-action-primary",
  },
  cancelada: { label: "Cancelada", class: "bg-status-busy/15 text-status-busy" },
};

/** Tarjeta de cita (vista del conductor). */
export function TarjetaCita({ cita }: { cita: Cita }) {
  const estado = ESTADO[cita.estado];

  return (
    <article className="flex flex-col gap-sm rounded-2xl border border-border-subtle bg-surface-card p-md sm:flex-row sm:items-center">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-page text-accent-primary">
        <Wrench size={22} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-sm">
          <h3 className="font-heading font-bold text-foreground-primary">
            {cita.tallerNombre}
          </h3>
          <span
            className={cn(
              "rounded-full px-sm py-xs font-caption text-xs font-semibold",
              estado.class
            )}
          >
            {estado.label}
          </span>
        </div>
        <p className="font-caption text-sm text-foreground-secondary">
          {cita.servicio}
        </p>
        <div className="mt-xs flex flex-wrap gap-x-md gap-y-xs font-data text-sm text-foreground-secondary">
          <span className="inline-flex items-center gap-xs">
            <Calendar size={14} /> {formatearFecha(cita.fecha)}
          </span>
          <span className="inline-flex items-center gap-xs">
            <Clock size={14} /> {cita.hora}
          </span>
        </div>
      </div>

      <Link
        href={`/talleres/${cita.tallerId}`}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Ver detalle <ChevronRight size={16} />
      </Link>
    </article>
  );
}
