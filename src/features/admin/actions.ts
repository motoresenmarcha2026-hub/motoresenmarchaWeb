"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/dal";

export interface ResultadoLimpieza {
  ok?: string;
  error?: string;
}

/**
 * Elimina los datos de demostración (talleres del seed sin dueño + sus
 * reseñas, citas y solicitudes). Solo admin — la función SQL vuelve a
 * validar el rol con is_admin().
 */
export async function limpiarDatosDemo(): Promise<ResultadoLimpieza> {
  await requireAdmin();

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("limpiar_datos_demo");

  if (error) {
    console.warn("[admin] limpiar_datos_demo:", error.message);
    return { error: "No se pudo completar la limpieza. Intenta de nuevo." };
  }

  revalidatePath("/admin");
  revalidatePath("/talleres");
  revalidatePath("/");

  const r = data as {
    talleres: number;
    resenas: number;
    citas: number;
    solicitudes: number;
  };
  return {
    ok: `Listo: ${r.talleres} talleres de demo, ${r.resenas} reseñas, ${r.citas} citas y ${r.solicitudes} solicitudes eliminados.`,
  };
}
