import Link from "next/link";
import { Car, MapPin, Clock, MessageCircle, Calendar } from "lucide-react";
import { cn, enlaceWhatsApp } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { tipoProblemaMeta } from "../mock";
import { BotonRechazar } from "./BotonRechazar";
import type { Solicitud, EstadoSolicitud, Prioridad } from "../types";

const ESTADO: Record<EstadoSolicitud, { label: string; class: string }> = {
  pendiente: {
    label: "Pendiente",
    class: "bg-action-urgent/15 text-action-urgent",
  },
  agendado: { label: "Agendado", class: "bg-action-primary/15 text-action-primary" },
  completado: {
    label: "Completado",
    class: "bg-status-available/15 text-status-available",
  },
  rechazado: { label: "Rechazado", class: "bg-status-busy/15 text-status-busy" },
};

const PRIORIDAD: Record<Prioridad, { label: string; class: string }> = {
  normal: { label: "Normal", class: "text-foreground-secondary" },
  urgente: { label: "Urgente", class: "text-action-urgent" },
  emergencia: { label: "Emergencia", class: "text-emergency" },
};

/** Tarjeta de solicitud entrante (panel del taller). */
export function TarjetaSolicitud({ solicitud }: { solicitud: Solicitud }) {
  const estado = ESTADO[solicitud.estado];
  const prioridad = PRIORIDAD[solicitud.prioridad];
  const activa =
    solicitud.estado === "pendiente" || solicitud.estado === "agendado";

  return (
    <article className="rounded-2xl border border-border-subtle bg-surface-card p-md">
      <div className="flex flex-wrap items-start justify-between gap-sm">
        <div className="flex items-center gap-sm">
          <h3 className="font-heading text-lg font-bold text-foreground-primary">
            {solicitud.clienteNombre}
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
        <span className={cn("font-caption text-xs font-semibold", prioridad.class)}>
          {prioridad.label}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-sm flex flex-wrap gap-x-md gap-y-xs font-caption text-sm text-foreground-secondary">
        <span className="inline-flex items-center gap-xs">
          {tipoProblemaMeta(solicitud.tipoProblema).label}
        </span>
        {solicitud.vehiculo && (
          <span className="inline-flex items-center gap-xs">
            <Car size={14} /> {solicitud.vehiculo}
          </span>
        )}
        <span className="inline-flex items-center gap-xs">
          <MapPin size={14} /> {solicitud.ubicacion.direccion}
        </span>
        <span className="inline-flex items-center gap-xs">
          <Clock size={14} />{" "}
          {new Intl.DateTimeFormat("es-MX", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(solicitud.createdAt))}
        </span>
      </div>

      <p className="mt-sm font-body text-sm text-foreground-primary">
        {solicitud.descripcion}
      </p>

      {/* Acciones */}
      {activa && (
        <div className="mt-md flex flex-wrap gap-sm">
          {solicitud.estado === "pendiente" && (
            <Link
              href={`/citas/agendar/${solicitud.tallerId ?? ""}`}
              className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
            >
              <Calendar size={16} /> Agendar cita
            </Link>
          )}
          <a
            href={enlaceWhatsApp(
              solicitud.clienteTelefono,
              `Hola ${solicitud.clienteNombre}, te contacto por tu solicitud en Motores en Marcha.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "whatsapp", size: "sm" }))}
          >
            <MessageCircle size={16} /> Escribir por WhatsApp
          </a>
          {solicitud.estado === "pendiente" && (
            <BotonRechazar id={solicitud.id} />
          )}
        </div>
      )}
    </article>
  );
}
