import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/dal";
import type { Vendedor } from "./types";

/**
 * Acceso a datos de vendedores (tiendas). Supabase es la única fuente de
 * verdad: si falla, devuelve vacío/null y la UI muestra su estado vacío.
 */

/** Fila cruda de la tabla `vendedores` (snake_case). */
interface VendedorRow {
  id: string;
  owner_id: string | null;
  nombre_negocio: string;
  slug: string;
  ciudad: string | null;
  direccion: string | null;
  whatsapp: string | null;
  logo_url: string | null;
  descripcion: string | null;
  categorias: string[] | null;
  verificado: boolean;
  destacado: boolean;
  lat: number | null;
  lng: number | null;
}

function rowToVendedor(r: VendedorRow): Vendedor {
  return {
    id: r.id,
    ownerId: r.owner_id,
    nombreNegocio: r.nombre_negocio,
    slug: r.slug,
    ciudad: r.ciudad ?? "",
    direccion: r.direccion ?? "",
    whatsapp: r.whatsapp ?? "",
    logoUrl: r.logo_url ?? "",
    descripcion: r.descripcion ?? "",
    categorias: r.categorias ?? [],
    verificado: r.verificado,
    destacado: r.destacado,
    lat: r.lat,
    lng: r.lng,
  };
}

/** Todas las tiendas registradas. */
export async function getVendedores(): Promise<Vendedor[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vendedores")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) {
      if (error) console.warn("[vendedores] error al leer:", error.message);
      return [];
    }
    return (data as VendedorRow[]).map(rowToVendedor);
  } catch (e) {
    console.warn("[vendedores] Supabase no disponible:", e);
    return [];
  }
}

/** La tienda del usuario autenticado (por owner_id). null si no tiene fila. */
export async function getVendedorDelUsuario(): Promise<Vendedor | null> {
  const user = await getUser();
  if (!user) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vendedores")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();
    if (error || !data) return null;
    return rowToVendedor(data as VendedorRow);
  } catch {
    return null;
  }
}

/** Una tienda por id. */
export async function getVendedor(id: string): Promise<Vendedor | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vendedores")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return rowToVendedor(data as VendedorRow);
  } catch {
    return null;
  }
}
