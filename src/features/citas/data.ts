import { createClient } from "@/lib/supabase/server";
import { getTallerDelUsuario } from "@/features/talleres/data";
import type { Cita, EstadoCita } from "./types";

/** Fila cruda de la tabla `citas`. */
interface CitaRow {
  id: string;
  solicitud_id: string | null;
  conductor_id: string | null;
  taller_id: string | null;
  taller_nombre: string | null;
  cliente_nombre: string | null;
  fecha: string;
  hora: string;
  servicio: string | null;
  estado: EstadoCita;
  created_at: string;
}

function rowToCita(r: CitaRow): Cita {
  return {
    id: r.id,
    solicitudId: r.solicitud_id ?? undefined,
    conductorId: r.conductor_id ?? "",
    tallerId: r.taller_id ?? "",
    tallerNombre: r.taller_nombre ?? "",
    clienteNombre: r.cliente_nombre ?? "Cliente",
    fecha: r.fecha,
    hora: r.hora,
    servicio: r.servicio ?? "",
    estado: r.estado,
    createdAt: r.created_at,
  };
}

/**
 * Citas del taller del usuario autenticado (RLS `citas_taller_read`).
 * Sin fallback a mock: [] si no hay taller o falla.
 */
export async function getCitasDelTaller(): Promise<Cita[]> {
  const taller = await getTallerDelUsuario();
  if (!taller) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("citas")
    .select("*")
    .eq("taller_id", taller.id)
    .order("fecha", { ascending: true });

  if (error || !data) {
    if (error) console.warn("[citas] error al leer:", error.message);
    return [];
  }
  return (data as CitaRow[]).map(rowToCita);
}
