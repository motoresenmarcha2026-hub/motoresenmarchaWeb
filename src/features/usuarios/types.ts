/**
 * Tipos del dominio de usuarios / cuentas.
 * Diseñados para mapear a tablas de Postgres/Supabase:
 *   usuarios, conductores, talleres_perfil.
 * TODO: conectar a Supabase Auth — el `id` corresponderá a auth.users.id (uuid).
 */

export type RolUsuario = "conductor" | "taller" | "admin";

/** Tabla base `usuarios` (1:1 con auth.users). */
export interface Usuario {
  id: string;
  rol: RolUsuario;
  nombre: string;
  email: string;
  telefono: string;
  avatarUrl?: string;
  createdAt: string; // timestamptz ISO
}

/** Tabla `conductores` (perfil extendido del rol conductor). */
export interface Conductor extends Usuario {
  rol: "conductor";
  ciudad?: string;
  vehiculo?: Vehiculo;
}

/** Datos del vehículo del conductor. */
export interface Vehiculo {
  marca: string;
  modelo: string;
  anio: number;
  placa?: string;
}

/** Tabla `talleres_perfil` (perfil extendido del rol taller). */
export interface TallerPerfilCuenta extends Usuario {
  rol: "taller";
  nombreComercial: string;
  rfc?: string;
  direccion: string;
}
