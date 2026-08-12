/**
 * Datos de prueba (mock) del dominio de solicitudes.
 * TODO: conectar a Supabase — realtime channel para solicitudes entrantes.
 */

import type { Solicitud, TipoProblemaMeta, TipoProblema } from "./types";

/** Catálogo de tipos de problema con etiqueta e ícono (lucide). */
export const TIPOS_PROBLEMA: TipoProblemaMeta[] = [
  {
    key: "motor",
    label: "Motor",
    descripcion: "No arranca, humo, ruidos extraños",
    icono: "Cog",
  },
  {
    key: "frenos",
    label: "Frenos",
    descripcion: "Chirridos, pedal esponjoso",
    icono: "Disc3",
  },
  {
    key: "bateria",
    label: "Batería",
    descripcion: "No enciende, se descarga",
    icono: "BatteryCharging",
  },
  {
    key: "llantas",
    label: "Llantas",
    descripcion: "Ponchadura, desgaste",
    icono: "LifeBuoy",
  },
  {
    key: "aire",
    label: "Aire",
    descripcion: "No enfría, mal olor",
    icono: "Snowflake",
  },
  {
    key: "electrico",
    label: "Eléctrico",
    descripcion: "Luces, fusibles, cortos",
    icono: "Zap",
  },
  {
    key: "suspension",
    label: "Suspensión",
    descripcion: "Golpeteo, auto desnivelado",
    icono: "Car",
  },
  {
    key: "transmision",
    label: "Transmisión",
    descripcion: "No cambia, patina",
    icono: "Settings2",
  },
  {
    key: "diagnostico",
    label: "Diagnóstico",
    descripcion: "Testigo encendido, revisión",
    icono: "Gauge",
  },
  {
    key: "general",
    label: "Otro",
    descripcion: "Servicio general / no estoy seguro",
    icono: "Wrench",
  },
];

export function tipoProblemaMeta(key: TipoProblema): TipoProblemaMeta {
  return TIPOS_PROBLEMA.find((t) => t.key === key) ?? TIPOS_PROBLEMA[9];
}

/** Solicitudes de ejemplo (vistas desde el panel del taller). */
export const SOLICITUDES: Solicitud[] = [
  {
    id: "s1",
    conductorId: "c1",
    tallerId: "t1",
    tipoProblema: "motor",
    descripcion:
      "El auto no arranca, hace un clic pero no enciende. Creo que puede ser la marcha o la batería.",
    ubicacion: {
      lat: 19.427,
      lng: -99.1676,
      direccion: "Av. Insurgentes Sur 1602, Crédito Constructor",
    },
    prioridad: "urgente",
    estado: "pendiente",
    clienteNombre: "Juan Pérez",
    clienteTelefono: "+525512340001",
    vehiculo: "Nissan Versa 2019",
    createdAt: "2026-08-10T08:45:00Z",
  },
  {
    id: "s2",
    conductorId: "c2",
    tallerId: "t1",
    tipoProblema: "frenos",
    descripcion:
      "Los frenos hacen un chirrido fuerte al frenar y el pedal se siente flojo.",
    ubicacion: {
      lat: 19.41,
      lng: -99.16,
      direccion: "Calle Adolfo Prieto 1210, Del Valle",
    },
    prioridad: "normal",
    estado: "agendado",
    clienteNombre: "María López",
    clienteTelefono: "+525512340002",
    vehiculo: "VW Jetta 2020",
    createdAt: "2026-08-09T17:20:00Z",
  },
  {
    id: "s3",
    conductorId: "c3",
    tallerId: "t1",
    tipoProblema: "bateria",
    descripcion: "Batería descargada, necesito paso de corriente o cambio.",
    ubicacion: {
      lat: 19.44,
      lng: -99.13,
      direccion: "Av. Álvaro Obregón 99, Roma Norte",
    },
    prioridad: "emergencia",
    estado: "completado",
    clienteNombre: "Roberto Díaz",
    clienteTelefono: "+525512340003",
    vehiculo: "Mazda 3 2021",
    createdAt: "2026-08-08T12:05:00Z",
  },
  {
    id: "s4",
    conductorId: "c4",
    tallerId: "t1",
    tipoProblema: "diagnostico",
    descripcion:
      "Se encendió el testigo del motor (check engine). Quiero una revisión.",
    ubicacion: {
      lat: 19.43,
      lng: -99.14,
      direccion: "Eje 4 Sur 200, Roma Sur",
    },
    prioridad: "normal",
    estado: "pendiente",
    clienteNombre: "Carla Mendoza",
    clienteTelefono: "+525512340004",
    vehiculo: "Kia Rio 2022",
    createdAt: "2026-08-10T07:10:00Z",
  },
];

export function getSolicitudesPorTaller(tallerId: string): Solicitud[] {
  return SOLICITUDES.filter((s) => s.tallerId === tallerId);
}
