/**
 * Tipos del dominio de reseñas / calificaciones.
 * Diseñados para mapear a tablas de Postgres/Supabase: resenas.
 * TODO: conectar a Supabase — insertar reseña tras completar un servicio.
 */

/** Tabla `resenas`. */
export interface Resena {
  id: string;
  tallerId: string;
  conductorId: string;
  /** Nombre del autor denormalizado para mostrar. */
  autor: string;
  autorAvatarUrl?: string;
  /** Calificación entera 1–5. */
  rating: number;
  comentario: string;
  /** Servicio al que corresponde la reseña. */
  servicio?: string;
  createdAt: string; // timestamptz ISO
}
