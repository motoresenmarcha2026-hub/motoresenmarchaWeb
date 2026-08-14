"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser, getPerfil } from "@/lib/auth/dal";
import type { TipoProblema, Prioridad } from "./types";

export interface SolicitudInput {
  tipoProblema: TipoProblema;
  descripcion: string;
  ubicacion: string;
  prioridad: Prioridad;
  tallerId?: string;
}

/**
 * Guarda la solicitud en `solicitudes` si hay sesión iniciada.
 * El flujo SOS no se bloquea por login: si no hay usuario, no persiste
 * (el conductor puede seguir contactando por WhatsApp igual).
 */
export async function guardarSolicitud(
  input: SolicitudInput
): Promise<{ guardada: boolean }> {
  const user = await getUser();
  if (!user) return { guardada: false };

  const perfil = await getPerfil();
  const supabase = await createClient();

  const { error } = await supabase.from("solicitudes").insert({
    conductor_id: user.id,
    taller_id: input.tallerId ?? null,
    tipo_problema: input.tipoProblema,
    descripcion: input.descripcion || null,
    direccion: input.ubicacion || null,
    prioridad: input.prioridad,
    estado: "pendiente",
    cliente_nombre: perfil?.nombre ?? null,
    cliente_telefono: perfil?.telefono ?? null,
  });

  if (error) console.warn("[solicitudes] no se pudo guardar:", error.message);
  return { guardada: !error };
}
