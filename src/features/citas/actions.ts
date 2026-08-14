"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser, getPerfil } from "@/lib/auth/dal";

export interface CitaInput {
  tallerId: string;
  tallerNombre: string;
  fecha: string; // "YYYY-MM-DD"
  hora: string; // "10:30"
  servicio: string;
}

/**
 * Inserta una cita en `citas` para el conductor autenticado.
 * La ruta /citas/agendar está protegida por el proxy, así que siempre
 * hay sesión; validamos igual por seguridad.
 */
export async function agendarCita(
  input: CitaInput
): Promise<{ error?: string }> {
  const user = await getUser();
  if (!user) return { error: "Debes iniciar sesión para agendar." };

  const perfil = await getPerfil();
  const supabase = await createClient();

  const { error } = await supabase.from("citas").insert({
    conductor_id: user.id,
    taller_id: input.tallerId,
    taller_nombre: input.tallerNombre,
    cliente_nombre: perfil?.nombre ?? null,
    fecha: input.fecha,
    hora: input.hora,
    servicio: input.servicio,
    estado: "pendiente",
  });

  if (error) {
    console.warn("[citas] no se pudo agendar:", error.message);
    return { error: "No se pudo agendar la cita. Inténtalo de nuevo." };
  }
  return {};
}
