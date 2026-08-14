"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser, getPerfil } from "@/lib/auth/dal";

export interface ResenaInput {
  tallerId: string;
  rating: number;
  comentario: string;
  servicio?: string;
  tags?: string[];
}

/**
 * Inserta una reseña en `resenas` (policy `resenas_insert_own`).
 * La ruta /calificar está protegida por el proxy.
 */
export async function enviarResena(
  input: ResenaInput
): Promise<{ error?: string }> {
  const user = await getUser();
  if (!user) return { error: "Debes iniciar sesión para calificar." };
  if (input.rating < 1 || input.rating > 5)
    return { error: "Elige una calificación de 1 a 5 estrellas." };

  const perfil = await getPerfil();
  const supabase = await createClient();

  // Combina comentario libre + etiquetas destacadas en un solo texto.
  const comentario =
    [
      input.comentario.trim(),
      input.tags?.length ? `Destacados: ${input.tags.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n") || null;

  const { error } = await supabase.from("resenas").insert({
    taller_id: input.tallerId,
    conductor_id: user.id,
    autor: perfil?.nombre ?? "Conductor",
    autor_avatar_url: perfil?.avatar_url ?? null,
    rating: input.rating,
    comentario,
    servicio: input.servicio ?? null,
  });

  if (error) {
    console.warn("[resenas] no se pudo enviar:", error.message);
    return { error: "No se pudo enviar la reseña. Inténtalo de nuevo." };
  }
  return {};
}
