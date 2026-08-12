import { MessageCircle } from "lucide-react";
import { cn, enlaceWhatsApp } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { tipoProblemaMeta } from "../mock";
import type { TipoProblema, Prioridad } from "../types";
import type { Taller } from "@/features/talleres/types";

const PRIORIDAD_LABEL: Record<Prioridad, string> = {
  normal: "Normal",
  urgente: "Urgente",
  emergencia: "Emergencia",
};

/** Panel lateral (oscuro) con el resumen de la solicitud + envío por WhatsApp. */
export function ResumenSolicitud({
  tipo,
  descripcion,
  ubicacion,
  prioridad,
  taller,
  cliente,
}: {
  tipo: TipoProblema | null;
  descripcion: string;
  ubicacion: string;
  prioridad: Prioridad;
  taller?: Taller;
  cliente: string;
}) {
  const mensaje = construirMensaje({
    tipo,
    descripcion,
    ubicacion,
    prioridad,
    cliente,
  });

  // Si hay taller, se envía a su número; si no, a la línea de emergencia (demo).
  const telefono = taller?.whatsapp ?? "+525500000000";
  const listo = tipo !== null && ubicacion.trim().length > 0;

  return (
    <aside className="flex flex-col gap-md rounded-2xl bg-surface-inverse p-lg text-foreground-inverse">
      <h2 className="font-heading text-lg font-bold">Resumen de la solicitud</h2>

      <dl className="flex flex-col gap-sm font-caption text-sm">
        <Fila label="Cliente" valor={cliente} />
        {taller && <Fila label="Taller" valor={taller.nombre} />}
        <Fila
          label="Tipo"
          valor={tipo ? tipoProblemaMeta(tipo).label : "Sin seleccionar"}
        />
        <Fila
          label="Prioridad"
          valor={PRIORIDAD_LABEL[prioridad]}
          destacar={prioridad === "emergencia"}
        />
        <Fila label="Ubicación" valor={ubicacion || "Sin ubicación"} />
      </dl>

      {/* Vista previa del mensaje */}
      <div>
        <p className="mb-xs font-caption text-xs uppercase tracking-wide text-foreground-inverse-secondary">
          Mensaje de WhatsApp
        </p>
        <p className="whitespace-pre-line rounded-lg bg-whatsapp/15 p-sm font-body text-sm text-foreground-inverse">
          {mensaje}
        </p>
      </div>

      <a
        href={listo ? enlaceWhatsApp(telefono, mensaje) : undefined}
        aria-disabled={!listo}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "whatsapp", size: "lg", fullWidth: true }),
          !listo && "pointer-events-none opacity-50"
        )}
      >
        {/* TODO: conectar a Supabase — guardar la solicitud antes de abrir WhatsApp */}
        <MessageCircle size={20} /> Enviar por WhatsApp
      </a>
      {!listo && (
        <p className="text-center font-caption text-xs text-foreground-inverse-secondary">
          Selecciona el tipo de problema y tu ubicación para continuar.
        </p>
      )}
    </aside>
  );
}

function Fila({
  label,
  valor,
  destacar,
}: {
  label: string;
  valor: string;
  destacar?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-md">
      <dt className="text-foreground-inverse-secondary">{label}</dt>
      <dd
        className={cn(
          "text-right font-semibold",
          destacar ? "text-emergency" : "text-foreground-inverse"
        )}
      >
        {valor}
      </dd>
    </div>
  );
}

function construirMensaje({
  tipo,
  descripcion,
  ubicacion,
  prioridad,
  cliente,
}: {
  tipo: TipoProblema | null;
  descripcion: string;
  ubicacion: string;
  prioridad: Prioridad;
  cliente: string;
}): string {
  const encabezado =
    prioridad === "emergencia"
      ? "🆘 EMERGENCIA — necesito ayuda mecánica urgente"
      : "Hola, necesito ayuda mecánica";
  return [
    encabezado,
    `• Cliente: ${cliente}`,
    tipo ? `• Problema: ${tipoProblemaMeta(tipo).label}` : null,
    descripcion ? `• Detalle: ${descripcion}` : null,
    ubicacion ? `• Ubicación: ${ubicacion}` : null,
    `• Prioridad: ${PRIORIDAD_LABEL[prioridad]}`,
  ]
    .filter(Boolean)
    .join("\n");
}
