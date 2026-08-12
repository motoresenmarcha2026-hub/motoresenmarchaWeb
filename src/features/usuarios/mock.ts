/**
 * Datos de prueba (mock) del dominio de usuarios.
 * TODO: conectar a Supabase Auth — reemplazar por la sesión real.
 */

import type { Conductor, TallerPerfilCuenta } from "./types";

/** Conductor "logueado" de ejemplo (para vistas del conductor). */
export const CONDUCTOR_ACTUAL: Conductor = {
  id: "c1",
  rol: "conductor",
  nombre: "Juan Pérez",
  email: "juan.perez@ejemplo.mx",
  telefono: "+525512340001",
  avatarUrl: "https://picsum.photos/seed/face11/150",
  ciudad: "Ciudad de México",
  createdAt: "2026-05-01T10:00:00Z",
  vehiculo: {
    marca: "Nissan",
    modelo: "Versa",
    anio: 2019,
    placa: "ABC-123-D",
  },
};

/** Taller "logueado" de ejemplo (para el panel del taller). */
export const TALLER_ACTUAL: TallerPerfilCuenta = {
  id: "t1",
  rol: "taller",
  nombre: "Carlos Medina",
  nombreComercial: "Taller El Rápido",
  email: "contacto@elrapido.mx",
  telefono: "+525512345678",
  avatarUrl: "https://picsum.photos/seed/face12/150",
  rfc: "TERA850101ABC",
  direccion: "Av. Insurgentes Sur 1200, Del Valle, CDMX",
  createdAt: "2025-11-15T09:00:00Z",
};
