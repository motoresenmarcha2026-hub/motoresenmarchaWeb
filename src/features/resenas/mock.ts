/**
 * Datos de prueba (mock) del dominio de reseñas.
 * TODO: conectar a Supabase — `select` sobre `resenas` filtrando por taller_id.
 */

import type { Resena } from "./types";

export const RESENAS: Resena[] = [
  {
    id: "r1",
    tallerId: "t1",
    conductorId: "c1",
    autor: "Sofía R.",
    autorAvatarUrl: "https://picsum.photos/seed/face45/100",
    rating: 5,
    comentario:
      "Llegaron en 15 minutos cuando mi auto no arrancaba. Súper profesionales y el precio justo lo que dijeron. Totalmente recomendados.",
    servicio: "Diagnóstico de motor",
    createdAt: "2026-07-28T14:30:00Z",
  },
  {
    id: "r2",
    tallerId: "t1",
    conductorId: "c2",
    autor: "Pedro M.",
    autorAvatarUrl: "https://picsum.photos/seed/face13/100",
    rating: 5,
    comentario:
      "Carlos me explicó todo con detalle y me mandó fotos del avance por WhatsApp. Confianza total.",
    servicio: "Cambio de frenos",
    createdAt: "2026-07-15T10:00:00Z",
  },
  {
    id: "r3",
    tallerId: "t1",
    conductorId: "c3",
    autor: "Gabriela N.",
    autorAvatarUrl: "https://picsum.photos/seed/face47/100",
    rating: 4,
    comentario:
      "Buen servicio y rápido. Solo tardaron un poco en conseguir una refacción, pero avisaron a tiempo.",
    servicio: "Servicio general",
    createdAt: "2026-06-30T16:45:00Z",
  },
  {
    id: "r4",
    tallerId: "t2",
    conductorId: "c4",
    autor: "Luis T.",
    autorAvatarUrl: "https://picsum.photos/seed/face52/100",
    rating: 5,
    comentario:
      "Encontraron una falla eléctrica que otros tres talleres no pudieron. Excelentes con el diagnóstico.",
    servicio: "Sistema eléctrico",
    createdAt: "2026-07-20T09:15:00Z",
  },
  {
    id: "r5",
    tallerId: "t3",
    conductorId: "c5",
    autor: "Marcela V.",
    autorAvatarUrl: "https://picsum.photos/seed/face32/100",
    rating: 5,
    comentario:
      "Mis frenos quedaron como nuevos y me dieron garantía por escrito. Volveré sin duda.",
    servicio: "Frenos y suspensión",
    createdAt: "2026-08-01T11:30:00Z",
  },
];

export function getResenasPorTaller(tallerId: string): Resena[] {
  return RESENAS.filter((r) => r.tallerId === tallerId);
}
