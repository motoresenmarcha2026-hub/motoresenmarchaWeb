"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser, requirePerfil } from "@/lib/auth/dal";

export interface TallerInput {
  nombre?: string;
  whatsapp?: string;
  direccion?: string;
  ciudad?: string;
  descripcion?: string;
  especialidades?: string[];
  /** Coordenadas del taller (para búsquedas por cercanía). */
  lat?: number;
  lng?: number;
}

/** Construye un patch solo con las claves definidas (Supabase ignora undefined,
 *  pero enviar null borraría el valor; preferimos omitir). */
function limpiarPatch(input: TallerInput): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v !== undefined) patch[k] = v;
  }
  return patch;
}

/** El taller actualiza los datos de su propia fila (RLS `talleres_update_own`). */
export async function actualizarTaller(
  input: TallerInput
): Promise<{ error?: string }> {
  const perfil = await requirePerfil();
  if (perfil.rol !== "taller") return { error: "No autorizado." };

  const user = await getUser();
  const patch = limpiarPatch(input);
  if (Object.keys(patch).length === 0) return {};

  const supabase = await createClient();
  const { error } = await supabase
    .from("talleres")
    .update(patch)
    .eq("owner_id", user!.id);

  if (error) {
    console.warn("[talleres] no se pudo actualizar:", error.message);
    return { error: "No se pudieron guardar los cambios." };
  }
  revalidatePath("/panel/cuenta");
  return {};
}

/** Guarda la URL pública de la foto del taller tras subirla a Storage. */
export async function actualizarFotoTaller(
  url: string
): Promise<{ error?: string }> {
  const perfil = await requirePerfil();
  if (perfil.rol !== "taller") return { error: "No autorizado." };

  const user = await getUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("talleres")
    .update({ foto_url: url })
    .eq("owner_id", user!.id);

  if (error) {
    console.warn("[talleres] no se pudo guardar la foto:", error.message);
    return { error: "No se pudo guardar la foto." };
  }
  revalidatePath("/panel/cuenta");
  return {};
}
