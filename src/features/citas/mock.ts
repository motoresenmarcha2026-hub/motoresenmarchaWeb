/**
 * Datos de prueba (mock) del dominio de citas.
 * TODO: conectar a Supabase — `select` sobre `citas` por conductor/taller.
 */

import type { Cita, FranjaHoraria } from "./types";

export const CITAS: Cita[] = [
  {
    id: "ci1",
    solicitudId: "s2",
    conductorId: "c2",
    tallerId: "t1",
    tallerNombre: "Taller El Rápido",
    clienteNombre: "María López",
    fecha: "2026-08-12",
    hora: "10:30",
    servicio: "Revisión y cambio de frenos",
    estado: "confirmada",
    createdAt: "2026-08-09T17:25:00Z",
  },
  {
    id: "ci2",
    conductorId: "c1",
    tallerId: "t3",
    tallerNombre: "Frenos y Suspensión Torres",
    clienteNombre: "Juan Pérez",
    fecha: "2026-08-15",
    hora: "12:00",
    servicio: "Alineación y balanceo",
    estado: "pendiente",
    createdAt: "2026-08-10T09:00:00Z",
  },
  {
    id: "ci3",
    conductorId: "c1",
    tallerId: "t2",
    tallerNombre: "AutoServicio Delgado",
    clienteNombre: "Juan Pérez",
    fecha: "2026-07-30",
    hora: "09:00",
    servicio: "Recarga de aire acondicionado",
    estado: "completada",
    createdAt: "2026-07-28T11:00:00Z",
  },
];

/** Franjas horarias de ejemplo para agendar (un día). */
export const FRANJAS_HORARIAS: FranjaHoraria[] = [
  { hora: "09:00", disponible: true },
  { hora: "09:30", disponible: false },
  { hora: "10:00", disponible: true },
  { hora: "10:30", disponible: true },
  { hora: "11:00", disponible: false },
  { hora: "11:30", disponible: true },
  { hora: "12:00", disponible: true },
  { hora: "12:30", disponible: true },
  { hora: "16:00", disponible: true },
  { hora: "16:30", disponible: false },
  { hora: "17:00", disponible: true },
  { hora: "17:30", disponible: true },
];

export function getCitasPorConductor(conductorId: string): Cita[] {
  return CITAS.filter((c) => c.conductorId === conductorId);
}
