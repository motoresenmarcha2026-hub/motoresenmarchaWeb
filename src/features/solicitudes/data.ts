import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/dal";
import { getTallerDelUsuario } from "@/features/talleres/data";
import { rowToSolicitud, type SolicitudRow } from "./mappers";
import type { Solicitud } from "./types";

/**
 * Solicitudes dirigidas al taller del usuario autenticado.
 * RLS (`solicitudes_taller_read`) garantiza que solo vea las suyas.
 * Sin fallback a mock: si no hay taller o falla, devuelve [].
 */
export async function getSolicitudesDelTaller(): Promise<Solicitud[]> {
  const taller = await getTallerDelUsuario();
  if (!taller) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("solicitudes")
    .select("*")
    .eq("taller_id", taller.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.warn("[solicitudes] error al leer:", error.message);
    return [];
  }
  return (data as SolicitudRow[]).map(rowToSolicitud);
}

/**
 * Solicitudes creadas por el conductor autenticado (RLS `solicitudes_own`).
 * Sin fallback a mock: [] si no hay sesión o falla.
 */
export async function getSolicitudesDelConductor(): Promise<Solicitud[]> {
  const user = await getUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("solicitudes")
    .select("*")
    .eq("conductor_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.warn("[solicitudes] error al leer:", error.message);
    return [];
  }
  return (data as SolicitudRow[]).map(rowToSolicitud);
}
