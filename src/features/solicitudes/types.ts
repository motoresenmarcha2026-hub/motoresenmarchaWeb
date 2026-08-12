/**
 * Tipos del dominio de solicitudes de servicio.
 * Diseñados para mapear a tablas de Postgres/Supabase:
 *   solicitudes, mensajes.
 * TODO: conectar a Supabase — realtime para nuevas solicitudes entrantes al taller.
 */

import type { Especialidad } from "@/features/talleres/types";

/** El tipo de problema mecánico se alinea con las especialidades del taller. */
export type TipoProblema = Especialidad;

/** Prioridad de la solicitud (emergencia dispara el flujo SOS). */
export type Prioridad = "normal" | "urgente" | "emergencia";

/** Estado del ciclo de vida de una solicitud. */
export type EstadoSolicitud =
  | "pendiente"
  | "agendado"
  | "completado"
  | "rechazado";

/** Ubicación reportada por el conductor al solicitar. */
export interface UbicacionSolicitud {
  lat: number;
  lng: number;
  direccion: string;
}

/** Tabla `solicitudes`. */
export interface Solicitud {
  id: string;
  conductorId: string;
  /** Taller destino (opcional: puede ser broadcast a talleres cercanos). */
  tallerId?: string;
  tipoProblema: TipoProblema;
  descripcion: string;
  ubicacion: UbicacionSolicitud;
  prioridad: Prioridad;
  estado: EstadoSolicitud;
  /** Datos denormalizados del solicitante para mostrar en el panel del taller. */
  clienteNombre: string;
  clienteTelefono: string;
  vehiculo?: string;
  createdAt: string; // timestamptz ISO
}

/** Metadatos legibles + ícono por tipo de problema (para UI). */
export interface TipoProblemaMeta {
  key: TipoProblema;
  label: string;
  descripcion: string;
  /** Nombre de ícono lucide-react. */
  icono: string;
}
