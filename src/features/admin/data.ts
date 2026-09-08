import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Lecturas del panel de administración. Requieren rol admin
 * (policies `*_admin_read` de 0004_admin.sql); para otros roles
 * las tablas privadas devuelven vacío por RLS.
 */

export interface ResumenAdmin {
  conteos: {
    conductores: number;
    talleres: number;
    vendedores: number;
    refacciones: number;
    solicitudes: number;
    citas: number;
    resenas: number;
  };
  /** Talleres del seed (sin owner_id) — datos de demostración. */
  demoTalleres: number;
  usuarios: {
    id: string;
    rol: string;
    nombre: string | null;
    ciudad: string | null;
  }[];
  talleres: {
    id: string;
    nombre: string;
    ciudad: string | null;
    rating: number;
    num_resenas: number;
    verificado: boolean;
  }[];
  solicitudes: {
    id: string;
    tipo_problema: string;
    prioridad: string;
    estado: string;
    cliente_nombre: string | null;
    created_at: string;
  }[];
  citas: {
    id: string;
    taller_nombre: string | null;
    cliente_nombre: string | null;
    fecha: string;
    hora: string;
    servicio: string | null;
    estado: string;
  }[];
  resenas: {
    id: string;
    taller_nombre: string | null;
    autor: string;
    rating: number;
    comentario: string | null;
    created_at: string;
  }[];
  vendedores: {
    id: string;
    nombre_negocio: string;
    ciudad: string | null;
    verificado: boolean;
  }[];
  refacciones: {
    id: string;
    nombre: string;
    precio: number;
    categoria: string | null;
    vendedor_nombre: string | null;
    created_at: string;
  }[];
}

async function contar(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tabla: string,
  filtro?: { col: string; val: string }
): Promise<number> {
  let q = supabase.from(tabla).select("*", { count: "exact", head: true });
  if (filtro) q = q.eq(filtro.col, filtro.val);
  const { count } = await q;
  return count ?? 0;
}

export async function getResumenAdmin(): Promise<ResumenAdmin> {
  const supabase = await createClient();

  const [
    conductores,
    talleresCount,
    vendedoresCount,
    refaccionesCount,
    solicitudesCount,
    citasCount,
    resenasCount,
    demoTalleres,
    usuarios,
    talleres,
    solicitudes,
    citas,
    resenas,
    vendedores,
    refacciones,
  ] = await Promise.all([
    contar(supabase, "profiles", { col: "rol", val: "conductor" }),
    contar(supabase, "talleres"),
    contar(supabase, "vendedores"),
    contar(supabase, "refacciones"),
    contar(supabase, "solicitudes"),
    contar(supabase, "citas"),
    contar(supabase, "resenas"),
    supabase
      .from("talleres")
      .select("id", { count: "exact", head: true })
      .is("owner_id", null)
      .then(({ count }) => count ?? 0),
    supabase
      .from("profiles")
      .select("id, rol, nombre, ciudad")
      .order("id", { ascending: false })
      .limit(10),
    supabase
      .from("talleres")
      .select("id, nombre, ciudad, rating, num_resenas, verificado")
      .order("rating", { ascending: false })
      .limit(10),
    supabase
      .from("solicitudes")
      .select("id, tipo_problema, prioridad, estado, cliente_nombre, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("citas")
      .select("id, taller_nombre, cliente_nombre, fecha, hora, servicio, estado")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("resenas")
      .select("id, autor, rating, comentario, created_at, talleres(nombre)")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("vendedores")
      .select("id, nombre_negocio, ciudad, verificado")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("refacciones")
      .select("id, nombre, precio, categoria, created_at, vendedores(nombre_negocio)")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    conteos: {
      conductores,
      talleres: talleresCount,
      vendedores: vendedoresCount,
      refacciones: refaccionesCount,
      solicitudes: solicitudesCount,
      citas: citasCount,
      resenas: resenasCount,
    },
    demoTalleres,
    usuarios: usuarios.data ?? [],
    talleres: talleres.data ?? [],
    solicitudes: solicitudes.data ?? [],
    citas: citas.data ?? [],
    resenas: (resenas.data ?? []).map((r) => {
      const taller = r.talleres as { nombre: string } | { nombre: string }[] | null;
      return {
        id: r.id,
        autor: r.autor,
        rating: r.rating,
        comentario: r.comentario,
        created_at: r.created_at,
        taller_nombre: (Array.isArray(taller) ? taller[0] : taller)?.nombre ?? null,
      };
    }),
    vendedores: vendedores.data ?? [],
    refacciones: (refacciones.data ?? []).map((r) => {
      const vend = r.vendedores as
        | { nombre_negocio: string }
        | { nombre_negocio: string }[]
        | null;
      return {
        id: r.id,
        nombre: r.nombre,
        precio: Number(r.precio),
        categoria: r.categoria,
        created_at: r.created_at,
        vendedor_nombre: (Array.isArray(vend) ? vend[0] : vend)?.nombre_negocio ?? null,
      };
    }),
  };
}
