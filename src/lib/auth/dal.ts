import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Rol = "conductor" | "taller";

export interface Perfil {
  id: string;
  rol: Rol;
  nombre: string | null;
  telefono: string | null;
  ciudad: string | null;
  avatar_url: string | null;
}

/** Usuario autenticado (revalidado contra Supabase). Memoizado por render. */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Perfil de la app (profiles). null si no hay sesión o aún no se ha creado. */
export const getPerfil = cache(async (): Promise<Perfil | null> => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, rol, nombre, telefono, ciudad, avatar_url")
    .eq("id", user.id)
    .single();
  return (data as Perfil | null) ?? null;
});

/**
 * Exige sesión + perfil. Redirige a /login si no hay sesión, o a /onboarding
 * si hay sesión pero el perfil aún no se ha completado (caso Google).
 * Úsalo al inicio de páginas / server actions protegidas.
 */
export async function requirePerfil(): Promise<Perfil> {
  const user = await getUser();
  if (!user) redirect("/login");
  const perfil = await getPerfil();
  if (!perfil) redirect("/onboarding");
  return perfil;
}
