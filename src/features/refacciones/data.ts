import { createClient } from "@/lib/supabase/server";
import { getVendedorDelUsuario } from "@/features/vendedores/data";
import type { Refaccion, RefaccionFiltros } from "./types";

/**
 * Acceso a datos de refacciones. Supabase es la única fuente de verdad: si
 * falla, devuelve vacío/null y la UI muestra su estado vacío correspondiente.
 */

/** Datos del vendedor embebidos (join). Supabase los da como objeto o arreglo. */
type VendedorEmbed =
  | { nombre_negocio: string | null; whatsapp: string | null; ciudad: string | null }
  | { nombre_negocio: string | null; whatsapp: string | null; ciudad: string | null }[]
  | null;

/** Fila cruda de `refacciones` (snake_case), con join opcional a vendedores. */
interface RefaccionRow {
  id: string;
  vendedor_id: string;
  nombre: string;
  slug: string;
  categoria: string | null;
  precio: number | string;
  moneda: string;
  stock: number;
  marca: string | null;
  modelo_compatible: string | null;
  foto_url: string | null;
  descripcion: string | null;
  activo: boolean;
  destacado: boolean;
  vendedores?: VendedorEmbed;
}

function unwrap(v: VendedorEmbed) {
  return Array.isArray(v) ? v[0] : v;
}

function rowToRefaccion(r: RefaccionRow): Refaccion {
  const vend = unwrap(r.vendedores ?? null);
  return {
    id: r.id,
    vendedorId: r.vendedor_id,
    nombre: r.nombre,
    slug: r.slug,
    categoria: r.categoria ?? "",
    precio: Number(r.precio),
    moneda: r.moneda,
    stock: r.stock,
    marca: r.marca ?? "",
    modeloCompatible: r.modelo_compatible ?? "",
    fotoUrl: r.foto_url ?? "",
    descripcion: r.descripcion ?? "",
    activo: r.activo,
    destacado: r.destacado,
    vendedorNombre: vend?.nombre_negocio ?? undefined,
    vendedorWhatsapp: vend?.whatsapp ?? undefined,
    vendedorCiudad: vend?.ciudad ?? undefined,
  };
}

const SELECT_CON_VENDEDOR =
  "*, vendedores(nombre_negocio, whatsapp, ciudad)";

/** Refacciones activas del marketplace (con datos del vendedor). */
export async function getRefacciones(
  filtros?: Partial<RefaccionFiltros>
): Promise<Refaccion[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("refacciones")
      .select(SELECT_CON_VENDEDOR)
      .eq("activo", true);
    if (filtros?.categoria) query = query.eq("categoria", filtros.categoria);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error || !data) {
      if (error) console.warn("[refacciones] error al leer:", error.message);
      return [];
    }
    return (data as unknown as RefaccionRow[]).map(rowToRefaccion);
  } catch (e) {
    console.warn("[refacciones] Supabase no disponible:", e);
    return [];
  }
}

/** Una refacción por id (con datos del vendedor). */
export async function getRefaccion(id: string): Promise<Refaccion | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("refacciones")
      .select(SELECT_CON_VENDEDOR)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return rowToRefaccion(data as unknown as RefaccionRow);
  } catch {
    return null;
  }
}

/** Inventario del vendedor autenticado (incluye inactivas). */
export async function getRefaccionesDelVendedor(): Promise<Refaccion[]> {
  const vendedor = await getVendedorDelUsuario();
  if (!vendedor) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("refacciones")
      .select("*")
      .eq("vendedor_id", vendedor.id)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as RefaccionRow[]).map(rowToRefaccion);
  } catch {
    return [];
  }
}

/** Refacciones destacadas y activas (para la Home). */
export async function getRefaccionesDestacadas(): Promise<Refaccion[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("refacciones")
      .select(SELECT_CON_VENDEDOR)
      .eq("activo", true)
      .eq("destacado", true)
      .order("created_at", { ascending: false })
      .limit(6);
    if (error || !data) return [];
    return (data as unknown as RefaccionRow[]).map(rowToRefaccion);
  } catch {
    return [];
  }
}
