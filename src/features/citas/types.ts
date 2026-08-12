/**
 * Tipos del dominio de citas / agenda.
 * Diseñados para mapear a tablas de Postgres/Supabase: citas.
 * TODO: conectar a Supabase — realtime para sincronizar agenda del taller.
 */

export type EstadoCita =
  | "pendiente"
  | "confirmada"
  | "completada"
  | "cancelada";

/** Tabla `citas`. */
export interface Cita {
  id: string;
  /** Solicitud que originó la cita (opcional si se agenda directo). */
  solicitudId?: string;
  conductorId: string;
  tallerId: string;
  /** Nombre del taller denormalizado para la vista del conductor. */
  tallerNombre: string;
  /** Nombre del cliente denormalizado para la vista del taller. */
  clienteNombre: string;
  fecha: string; // "2026-08-15" (date)
  hora: string; // "10:30" (time)
  servicio: string;
  estado: EstadoCita;
  createdAt: string; // timestamptz ISO
}

/** Franja horaria disponible para agendar. */
export interface FranjaHoraria {
  hora: string; // "10:30"
  disponible: boolean;
}
