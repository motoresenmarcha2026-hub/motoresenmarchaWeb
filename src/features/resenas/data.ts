import { createClient } from "@/lib/supabase/server";
import type { Resena } from "./types";

interface ResenaRow {
  id: string;
  taller_id: string;
  conductor_id: string | null;
  autor: string;
  autor_avatar_url: string | null;
  rating: number;
  comentario: string | null;
  servicio: string | null;
  created_at: string;
}

function rowToResena(r: ResenaRow): Resena {
  return {
    id: r.id,
    tallerId: r.taller_id,
    conductorId: r.conductor_id ?? "",
    autor: r.autor,
    autorAvatarUrl: r.autor_avatar_url ?? undefined,
    rating: r.rating,
    comentario: r.comentario ?? "",
    servicio: r.servicio ?? undefined,
    createdAt: r.created_at,
  };
}

/** Reseñas de un taller (Supabase como única fuente; [] si falla). */
export async function getResenas(tallerId: string): Promise<Resena[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resenas")
      .select("*")
      .eq("taller_id", tallerId)
      .order("created_at", { ascending: false });
    if (error || !data) {
      if (error) console.warn("[resenas] error al leer:", error.message);
      return [];
    }
    return (data as ResenaRow[]).map(rowToResena);
  } catch {
    return [];
  }
}
