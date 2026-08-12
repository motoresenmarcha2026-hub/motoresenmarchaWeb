/**
 * Tipos del dominio de talleres / mecánicos.
 * Diseñados para mapear a tablas de Postgres/Supabase:
 *   talleres, especialidades, taller_especialidades, horarios, sucursales.
 * TODO: conectar a Supabase — reemplazar mock.ts por consultas reales.
 */

/** Especialidad / tipo de servicio que ofrece un taller. */
export type Especialidad =
  | "motor"
  | "frenos"
  | "bateria"
  | "llantas"
  | "aire"
  | "electrico"
  | "suspension"
  | "transmision"
  | "diagnostico"
  | "general";

/** Disponibilidad operativa actual del taller. */
export type Disponibilidad = "available" | "busy";

/** Coordenada + dirección legible. */
export interface Ubicacion {
  lat: number;
  lng: number;
  direccion: string;
  ciudad: string;
}

/** Horario de atención por día. */
export interface Horario {
  dia:
    | "lunes"
    | "martes"
    | "miercoles"
    | "jueves"
    | "viernes"
    | "sabado"
    | "domingo";
  abre: string; // "08:00"
  cierra: string; // "18:00"
  cerrado?: boolean;
}

/**
 * Tabla `talleres`. Un taller puede tener uno o varios mecánicos, pero en el
 * marketplace se muestra como una unidad (tarjeta / perfil).
 */
export interface Taller {
  id: string;
  nombre: string;
  slug: string;
  especialidades: Especialidad[];
  /** Calificación promedio 0–5. */
  rating: number;
  numResenas: number;
  disponibilidad: Disponibilidad;
  ubicacion: Ubicacion;
  /** Distancia al usuario en km (calculada; mock por ahora). */
  distanciaKm: number;
  /** Tiempo estimado de llegada en minutos. */
  etaMin: number;
  fotoUrl: string;
  avatarUrl: string;
  /** Teléfono en formato internacional para wa.me. */
  whatsapp: string;
  descripcion: string;
  /** Nombre del mecánico principal / responsable. */
  mecanicoPrincipal: string;
  horarios: Horario[];
  /** Precio de referencia de diagnóstico/visita (MXN). */
  precioDesde: number;
  verificado: boolean;
  destacado: boolean;
}

/** Etiqueta legible + ícono para cada especialidad (para UI). */
export interface EspecialidadMeta {
  key: Especialidad;
  label: string;
  /** Nombre de ícono lucide-react. */
  icono: string;
}
