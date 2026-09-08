"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser, requirePerfil } from "@/lib/auth/dal";

export interface VendedorInput {
  nombreNegocio?: string;
  whatsapp?: string;
  direccion?: string;
  ciudad?: string;
  descripcion?: string;
  categorias?: string[];
}

/** Solo claves definidas (omitir undefined para no borrar valores). */
function limpiarPatch(input: VendedorInput): Record<string, unknown> {
  const map: Record<keyof VendedorInput, string> = {
    nombreNegocio: "nombre_negocio",
    whatsapp: "whatsapp",
    direccion: "direccion",
    ciudad: "ciudad",
    descripcion: "descripcion",
    categorias: "categorias",
  };
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v !== undefined) patch[map[k as keyof VendedorInput]] = v;
  }
  return patch;
}

/** El vendedor actualiza su propia tienda (RLS `vendedores_update_own`). */
export async function actualizarVendedor(
  input: VendedorInput
): Promise<{ error?: string }> {
  const perfil = await requirePerfil();
  if (perfil.rol !== "vendedor") return { error: "No autorizado." };

  const user = await getUser();
  const patch = limpiarPatch(input);
  if (Object.keys(patch).length === 0) return {};

  const supabase = await createClient();
  const { error } = await supabase
    .from("vendedores")
    .update(patch)
    .eq("owner_id", user!.id);

  if (error) {
    console.warn("[vendedores] no se pudo actualizar:", error.message);
    return { error: "No se pudieron guardar los cambios." };
  }
  revalidatePath("/vendedor/cuenta");
  revalidatePath("/refacciones");
  return {};
}

/** Guarda la URL pública del logo tras subirlo a Storage. */
export async function actualizarLogoVendedor(
  url: string
): Promise<{ error?: string }> {
  const perfil = await requirePerfil();
  if (perfil.rol !== "vendedor") return { error: "No autorizado." };

  const user = await getUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("vendedores")
    .update({ logo_url: url })
    .eq("owner_id", user!.id);

  if (error) {
    console.warn("[vendedores] no se pudo guardar el logo:", error.message);
    return { error: "No se pudo guardar el logo." };
  }
  revalidatePath("/vendedor/cuenta");
  return {};
}
