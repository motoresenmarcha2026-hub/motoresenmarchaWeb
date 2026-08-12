/**
 * Datos de prueba (mock) del dominio de talleres.
 * TODO: conectar a Supabase — reemplazar por `select` sobre la tabla `talleres`.
 */

import type {
  Taller,
  Especialidad,
  EspecialidadMeta,
  Horario,
} from "./types";

/** Catálogo de especialidades con etiqueta legible e ícono (lucide). */
export const ESPECIALIDADES: EspecialidadMeta[] = [
  { key: "motor", label: "Motor", icono: "Cog" },
  { key: "frenos", label: "Frenos", icono: "Disc3" },
  { key: "bateria", label: "Batería", icono: "BatteryCharging" },
  { key: "llantas", label: "Llantas", icono: "LifeBuoy" },
  { key: "aire", label: "Aire acondicionado", icono: "Snowflake" },
  { key: "electrico", label: "Sistema eléctrico", icono: "Zap" },
  { key: "suspension", label: "Suspensión", icono: "Car" },
  { key: "transmision", label: "Transmisión", icono: "Settings2" },
  { key: "diagnostico", label: "Diagnóstico", icono: "Gauge" },
  { key: "general", label: "Servicio general", icono: "Wrench" },
];

export function especialidadMeta(key: Especialidad): EspecialidadMeta {
  return ESPECIALIDADES.find((e) => e.key === key) ?? ESPECIALIDADES[9];
}

const HORARIO_ESTANDAR: Horario[] = [
  { dia: "lunes", abre: "08:00", cierra: "18:00" },
  { dia: "martes", abre: "08:00", cierra: "18:00" },
  { dia: "miercoles", abre: "08:00", cierra: "18:00" },
  { dia: "jueves", abre: "08:00", cierra: "18:00" },
  { dia: "viernes", abre: "08:00", cierra: "18:00" },
  { dia: "sabado", abre: "09:00", cierra: "14:00" },
  { dia: "domingo", abre: "", cierra: "", cerrado: true },
];

// Fotos de prueba estables (picsum con seed). TODO: Supabase Storage.
const foto = (seed: number) => `https://picsum.photos/seed/meca-${seed}/800/600`;

export const TALLERES: Taller[] = [
  {
    id: "t1",
    nombre: "Taller El Rápido",
    slug: "taller-el-rapido",
    especialidades: ["motor", "frenos", "diagnostico"],
    rating: 4.8,
    numResenas: 127,
    disponibilidad: "available",
    ubicacion: {
      lat: 19.4326,
      lng: -99.1332,
      direccion: "Av. Insurgentes Sur 1200, Del Valle",
      ciudad: "Ciudad de México",
    },
    distanciaKm: 1.2,
    etaMin: 15,
    fotoUrl: foto(1486262715619),
    avatarUrl: "https://picsum.photos/seed/face12/150",
    whatsapp: "+525512345678",
    descripcion:
      "Más de 15 años de experiencia en mecánica general y diagnóstico computarizado. Atención rápida y transparente, con presupuesto sin compromiso.",
    mecanicoPrincipal: "Carlos Medina",
    horarios: HORARIO_ESTANDAR,
    precioDesde: 350,
    verificado: true,
    destacado: true,
  },
  {
    id: "t2",
    nombre: "AutoServicio Delgado",
    slug: "autoservicio-delgado",
    especialidades: ["electrico", "bateria", "aire"],
    rating: 4.6,
    numResenas: 89,
    disponibilidad: "available",
    ubicacion: {
      lat: 19.4069,
      lng: -99.1716,
      direccion: "Calle Xola 250, Narvarte",
      ciudad: "Ciudad de México",
    },
    distanciaKm: 2.7,
    etaMin: 22,
    fotoUrl: foto(1530046339160),
    avatarUrl: "https://picsum.photos/seed/face33/150",
    whatsapp: "+525587654321",
    descripcion:
      "Especialistas en sistema eléctrico automotriz, baterías y climas. Diagnóstico preciso para fallas eléctricas complejas.",
    mecanicoPrincipal: "Ana Delgado",
    horarios: HORARIO_ESTANDAR,
    precioDesde: 400,
    verificado: true,
    destacado: true,
  },
  {
    id: "t3",
    nombre: "Frenos y Suspensión Torres",
    slug: "frenos-suspension-torres",
    especialidades: ["frenos", "suspension", "llantas"],
    rating: 4.9,
    numResenas: 203,
    disponibilidad: "busy",
    ubicacion: {
      lat: 19.3907,
      lng: -99.1436,
      direccion: "Eje Central 890, Portales",
      ciudad: "Ciudad de México",
    },
    distanciaKm: 3.4,
    etaMin: 28,
    fotoUrl: foto(1487754180451),
    avatarUrl: "https://picsum.photos/seed/face54/150",
    whatsapp: "+525511223344",
    descripcion:
      "Frenos, suspensión y alineación con equipo de última generación. Garantía por escrito en todos nuestros trabajos.",
    mecanicoPrincipal: "Ricardo Torres",
    horarios: HORARIO_ESTANDAR,
    precioDesde: 300,
    verificado: true,
    destacado: true,
  },
  {
    id: "t4",
    nombre: "Mecánica Express 24/7",
    slug: "mecanica-express-24-7",
    especialidades: ["general", "motor", "bateria", "llantas"],
    rating: 4.4,
    numResenas: 56,
    disponibilidad: "available",
    ubicacion: {
      lat: 19.4501,
      lng: -99.1276,
      direccion: "Av. Chapultepec 45, Roma Norte",
      ciudad: "Ciudad de México",
    },
    distanciaKm: 0.8,
    etaMin: 10,
    fotoUrl: foto(1600861195091),
    avatarUrl: "https://picsum.photos/seed/face68/150",
    whatsapp: "+525599887766",
    descripcion:
      "Servicio de emergencia las 24 horas. Auxilio vial, cambio de batería y llantas a domicilio en minutos.",
    mecanicoPrincipal: "Miguel Ángel Ruiz",
    horarios: HORARIO_ESTANDAR,
    precioDesde: 250,
    verificado: false,
    destacado: false,
  },
  {
    id: "t5",
    nombre: "Transmisiones González",
    slug: "transmisiones-gonzalez",
    especialidades: ["transmision", "motor", "diagnostico"],
    rating: 4.7,
    numResenas: 141,
    disponibilidad: "available",
    ubicacion: {
      lat: 19.3629,
      lng: -99.1585,
      direccion: "Calzada de Tlalpan 1500, Álamos",
      ciudad: "Ciudad de México",
    },
    distanciaKm: 4.9,
    etaMin: 35,
    fotoUrl: foto(1503376780353),
    avatarUrl: "https://picsum.photos/seed/face15/150",
    whatsapp: "+525522334455",
    descripcion:
      "Expertos en cajas automáticas y estándar. Reconstrucción y mantenimiento de transmisiones de todas las marcas.",
    mecanicoPrincipal: "Fernando González",
    horarios: HORARIO_ESTANDAR,
    precioDesde: 500,
    verificado: true,
    destacado: false,
  },
  {
    id: "t6",
    nombre: "Clima Auto Fresco",
    slug: "clima-auto-fresco",
    especialidades: ["aire", "electrico"],
    rating: 4.5,
    numResenas: 72,
    disponibilidad: "busy",
    ubicacion: {
      lat: 19.4284,
      lng: -99.1276,
      direccion: "Av. Cuauhtémoc 320, Doctores",
      ciudad: "Ciudad de México",
    },
    distanciaKm: 2.1,
    etaMin: 18,
    fotoUrl: foto(1580273916550),
    avatarUrl: "https://picsum.photos/seed/face25/150",
    whatsapp: "+525533445566",
    descripcion:
      "Recarga de gas, reparación de compresores y mantenimiento de aire acondicionado automotriz.",
    mecanicoPrincipal: "Laura Jiménez",
    horarios: HORARIO_ESTANDAR,
    precioDesde: 450,
    verificado: true,
    destacado: false,
  },
  {
    id: "t7",
    nombre: "Llantera y Balanceo Cruz",
    slug: "llantera-balanceo-cruz",
    especialidades: ["llantas", "suspension"],
    rating: 4.3,
    numResenas: 98,
    disponibilidad: "available",
    ubicacion: {
      lat: 19.4102,
      lng: -99.1889,
      direccion: "Av. Revolución 780, San Pedro de los Pinos",
      ciudad: "Ciudad de México",
    },
    distanciaKm: 5.6,
    etaMin: 40,
    fotoUrl: foto(1605164599901),
    avatarUrl: "https://picsum.photos/seed/face51/150",
    whatsapp: "+525544556677",
    descripcion:
      "Venta y reparación de llantas, alineación y balanceo. Servicio de auxilio vial por ponchadura.",
    mecanicoPrincipal: "José Cruz",
    horarios: HORARIO_ESTANDAR,
    precioDesde: 200,
    verificado: false,
    destacado: false,
  },
  {
    id: "t8",
    nombre: "Diagnóstico Digital MotorTech",
    slug: "diagnostico-digital-motortech",
    especialidades: ["diagnostico", "electrico", "motor"],
    rating: 5.0,
    numResenas: 64,
    disponibilidad: "available",
    ubicacion: {
      lat: 19.4445,
      lng: -99.155,
      direccion: "Av. Patriotismo 210, San Pedro de los Pinos",
      ciudad: "Ciudad de México",
    },
    distanciaKm: 3.0,
    etaMin: 24,
    fotoUrl: foto(1632823469850),
    avatarUrl: "https://picsum.photos/seed/face60/150",
    whatsapp: "+525555667788",
    descripcion:
      "Diagnóstico computarizado avanzado para autos modernos e híbridos. Escaneo completo y reporte detallado.",
    mecanicoPrincipal: "Diana Salas",
    horarios: HORARIO_ESTANDAR,
    precioDesde: 380,
    verificado: true,
    destacado: false,
  },
];

/** Talleres destacados para la Home. */
export const TALLERES_DESTACADOS = TALLERES.filter((t) => t.destacado);

export function getTallerPorId(id: string): Taller | undefined {
  return TALLERES.find((t) => t.id === id);
}

export function getTallerPorSlug(slug: string): Taller | undefined {
  return TALLERES.find((t) => t.slug === slug);
}
