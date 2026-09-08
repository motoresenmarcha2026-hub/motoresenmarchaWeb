import Link from "next/link";
import { Wrench, Calendar, Clock, ChevronRight, Star } from "lucide-react";
import { cn, formatearFecha } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import type { Cita, EstadoCita } from "../types";

/* Cada estado es una plancha de tinta plena con texto de papel: el tinte
   suave al 15% era aire, y este mundo marca con tinta. */
const ESTADO: Record<EstadoCita, { label: string; class: string }> = {
  pendiente: { label: "Pendiente", class: "bg-action-urgent" },
  confirmada: { label: "Confirmada", class: "bg-status-available" },
  completada: { label: "Completada", class: "bg-action-primary" },
  cancelada: { label: "Cancelada", class: "bg-status-busy" },
};

/** Tarjeta de cita (vista del conductor). */
export function TarjetaCita({ cita }: { cita: Cita }) {
  const estado = ESTADO[cita.estado];

  return (
    <article className="flex flex-col gap-sm rounded-none border-2 border-border-primary bg-surface-card p-md sm:flex-row sm:items-center">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none border-2 border-border-primary bg-surface-page text-foreground-primary">
        <Wrench size={22} aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-sm">
          <h3 className="font-heading text-lg font-extrabold uppercase leading-none text-foreground-primary">
            {cita.tallerNombre}
          </h3>
          <span
            className={cn(
              "rounded-none px-sm py-1 font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-inverse",
              estado.class
            )}
          >
            {estado.label}
          </span>
        </div>
        <p className="font-body text-sm text-foreground-secondary">
          {cita.servicio}
        </p>
        <div className="cifras mt-xs flex flex-wrap gap-x-md gap-y-xs font-heading text-xs font-extrabold uppercase tracking-[0.08em] text-foreground-primary">
          <span className="inline-flex items-center gap-xs">
            <Calendar size={14} /> {formatearFecha(cita.fecha)}
          </span>
          <span className="inline-flex items-center gap-xs">
            <Clock size={14} /> {cita.hora}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-xs">
        {cita.estado === "completada" && (
          <Link
            href={`/calificar/${cita.id}`}
            className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
          >
            <Star size={16} /> Calificar
          </Link>
        )}
        <Link
          href={`/talleres/${cita.tallerId}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Ver detalle <ChevronRight size={16} />
        </Link>
      </div>
    </article>
  );
}
