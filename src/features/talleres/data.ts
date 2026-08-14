import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/dal";
import type { Taller, Especialidad, Horario, Disponibilidad } from "./types";

/**
 * Acceso a datos de talleres. Supabase es la única fuente de verdad
 * (sin fallback a mock): si falla, devuelve vacío y la UI muestra su
 * estado vacío correspondiente.
 */

/** Fila cruda de la tabla `talleres` (snake_case). */
interface TallerRow {
  id: string;
  nombre: string;
  slug: string;
  especialidades: Especialidad[];
  rating: number;
  num_resenas: number;
  disponibilidad: Disponibilidad;
  lat: number | null;
  lng: number | null;
  direccion: string | null;
  ciudad: string | null;
  distancia_km: number | null;
  eta_min: number | null;
  foto_url: string | null;
  avatar_url: string | null;
  whatsapp: string | null;
  descripcion: string | null;
  mecanico_principal: string | null;
  horarios: Horario[] | null;
  precio_desde: number | null;
  verificado: boolean;
  destacado: boolean;
}

function rowToTaller(r: TallerRow): Taller {
  return {
    id: r.id,
    nombre: r.nombre,
    slug: r.slug,
    especialidades: r.especialidades ?? [],
    rating: Number(r.rating),
    numResenas: r.num_resenas,
    disponibilidad: r.disponibilidad,
    ubicacion: {
      lat: r.lat ?? 0,
      lng: r.lng ?? 0,
      direccion: r.direccion ?? "",
      ciudad: r.ciudad ?? "",
    },
    distanciaKm: r.distancia_km ?? 0,
    etaMin: r.eta_min ?? 0,
    fotoUrl: r.foto_url ?? "",
    avatarUrl: r.avatar_url ?? "",
    whatsapp: r.whatsapp ?? "",
    descripcion: r.descripcion ?? "",
    mecanicoPrincipal: r.mecanico_principal ?? "",
    horarios: r.horarios ?? [],
    precioDesde: r.precio_desde ?? 0,
    verificado: r.verificado,
    destacado: r.destacado,
  };
}

/** Todos los talleres, ordenados por distancia. */
export async function getTalleres(): Promise<Taller[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("talleres")
      .select("*")
      .order("distancia_km", { ascending: true });
    if (error || !data) {
      if (error) console.warn("[talleres] error al leer:", error.message);
      return [];
    }
    return (data as TallerRow[]).map(rowToTaller);
  } catch (e) {
    console.warn("[talleres] Supabase no disponible:", e);
    return [];
  }
}

/** El taller del usuario autenticado (por owner_id). null si no tiene fila. */
export async function getTallerDelUsuario(): Promise<Taller | null> {
  const user = await getUser();
  if (!user) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("talleres")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();
    if (error || !data) return null;
    return rowToTaller(data as TallerRow);
  } catch {
    return null;
  }
}

/** Talleres destacados (para la Home). */
export async function getTalleresDestacados(): Promise<Taller[]> {
  const todos = await getTalleres();
  return todos.filter((t) => t.destacado);
}

/** Un taller por id. */
export async function getTaller(id: string): Promise<Taller | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("talleres")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return rowToTaller(data as TallerRow);
  } catch {
    return null;
  }
}
