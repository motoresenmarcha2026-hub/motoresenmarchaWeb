import type {
  Solicitud,
  TipoProblema,
  Prioridad,
  EstadoSolicitud,
} from "./types";

/**
 * Mapper PURO (sin `server-only` ni cliente Supabase) para convertir una fila
 * de la tabla `solicitudes` (snake_case) al tipo de dominio. Se comparte entre
 * la capa de datos (server) y el panel Realtime (client).
 */

/** Fila cruda de la tabla `solicitudes`. */
export interface SolicitudRow {
  id: string;
  conductor_id: string | null;
  taller_id: string | null;
  tipo_problema: string;
  descripcion: string | null;
  lat: number | null;
  lng: number | null;
  direccion: string | null;
  prioridad: Prioridad;
  estado: EstadoSolicitud;
  cliente_nombre: string | null;
  cliente_telefono: string | null;
  vehiculo: string | null;
  created_at: string;
}

export function rowToSolicitud(r: SolicitudRow): Solicitud {
  return {
    id: r.id,
    conductorId: r.conductor_id ?? "",
    tallerId: r.taller_id ?? undefined,
    tipoProblema: r.tipo_problema as TipoProblema,
    descripcion: r.descripcion ?? "",
    ubicacion: {
      lat: r.lat ?? 0,
      lng: r.lng ?? 0,
      direccion: r.direccion ?? "",
    },
    prioridad: r.prioridad,
    estado: r.estado,
    clienteNombre: r.cliente_nombre ?? "Cliente",
    clienteTelefono: r.cliente_telefono ?? "",
    vehiculo: r.vehiculo ?? undefined,
    createdAt: r.created_at,
  };
}
