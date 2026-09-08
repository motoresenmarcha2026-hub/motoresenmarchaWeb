"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth/dal";
import { getVendedorDelUsuario } from "@/features/vendedores/data";

export interface RefaccionInput {
  nombre?: string;
  categoria?: string;
  precio?: number;
  stock?: number;
  marca?: string;
  modeloCompatible?: string;
  descripcion?: string;
  activo?: boolean;
  destacado?: boolean;
}

function slugify(txt: string): string {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const COL: Record<keyof RefaccionInput, string> = {
  nombre: "nombre",
  categoria: "categoria",
  precio: "precio",
  stock: "stock",
  marca: "marca",
  modeloCompatible: "modelo_compatible",
  descripcion: "descripcion",
  activo: "activo",
  destacado: "destacado",
};

function limpiarPatch(input: RefaccionInput): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v !== undefined) patch[COL[k as keyof RefaccionInput]] = v;
  }
  return patch;
}

/** Resuelve la tienda del usuario tras validar el rol vendedor. */
async function vendedorIdDelUsuario(): Promise<
  { vendedorId: string } | { error: string }
> {
  const perfil = await requirePerfil();
  if (perfil.rol !== "vendedor") return { error: "No autorizado." };
  const vendedor = await getVendedorDelUsuario();
  if (!vendedor) return { error: "Aún no tienes un negocio registrado." };
  return { vendedorId: vendedor.id };
}

function revalidar(id?: string) {
  revalidatePath("/vendedor/refacciones");
  revalidatePath("/refacciones");
  if (id) revalidatePath(`/refacciones/${id}`);
}

/** Crea una refacción en el inventario del vendedor. */
export async function crearRefaccion(
  input: RefaccionInput
): Promise<{ error?: string; id?: string }> {
  const ctx = await vendedorIdDelUsuario();
  if ("error" in ctx) return { error: ctx.error };

  const nombre = (input.nombre ?? "").trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const id = crypto.randomUUID();
  const supabase = await createClient();
  const { error } = await supabase.from("refacciones").insert({
    id,
    vendedor_id: ctx.vendedorId,
    slug: `${slugify(nombre) || "refaccion"}-${id.slice(0, 6)}`,
    ...limpiarPatch(input),
    nombre,
  });

  if (error) {
    console.warn("[refacciones] no se pudo crear:", error.message);
    return { error: "No se pudo crear la refacción." };
  }
  revalidar(id);
  return { id };
}

/** Actualiza una refacción del vendedor (RLS scope al dueño). */
export async function actualizarRefaccion(
  id: string,
  input: RefaccionInput
): Promise<{ error?: string }> {
  const ctx = await vendedorIdDelUsuario();
  if ("error" in ctx) return { error: ctx.error };

  const patch = limpiarPatch(input);
  if (Object.keys(patch).length === 0) return {};

  const supabase = await createClient();
  const { error } = await supabase
    .from("refacciones")
    .update(patch)
    .eq("id", id);

  if (error) {
    console.warn("[refacciones] no se pudo actualizar:", error.message);
    return { error: "No se pudieron guardar los cambios." };
  }
  revalidar(id);
  return {};
}

/** Elimina una refacción del vendedor. */
export async function eliminarRefaccion(
  id: string
): Promise<{ error?: string }> {
  const ctx = await vendedorIdDelUsuario();
  if ("error" in ctx) return { error: ctx.error };

  const supabase = await createClient();
  const { error } = await supabase.from("refacciones").delete().eq("id", id);
  if (error) {
    console.warn("[refacciones] no se pudo eliminar:", error.message);
    return { error: "No se pudo eliminar la refacción." };
  }
  revalidar(id);
  return {};
}

/** Guarda la URL pública de la foto tras subirla a Storage. */
export async function actualizarFotoRefaccion(
  id: string,
  url: string
): Promise<{ error?: string }> {
  const ctx = await vendedorIdDelUsuario();
  if ("error" in ctx) return { error: ctx.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("refacciones")
    .update({ foto_url: url })
    .eq("id", id);
  if (error) {
    console.warn("[refacciones] no se pudo guardar la foto:", error.message);
    return { error: "No se pudo guardar la foto." };
  }
  revalidar(id);
  return {};
}
