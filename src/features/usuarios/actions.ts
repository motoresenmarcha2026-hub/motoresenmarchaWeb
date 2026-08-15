"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string } | undefined;

function str(fd: FormData, k: string): string {
  return ((fd.get(k) as string | null) ?? "").trim();
}

/** Traduce los errores más comunes de Supabase Auth al español. */
function traducir(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("already registered") || m.includes("already exists"))
    return "Ya existe una cuenta con ese correo.";
  if (m.includes("invalid login")) return "Correo o contraseña incorrectos.";
  if (m.includes("password")) return "La contraseña no cumple los requisitos.";
  return "No se pudo completar la operación. Inténtalo de nuevo.";
}

function slugify(txt: string): string {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** URL base del sitio para el redirect de OAuth. */
async function baseUrl(): Promise<string> {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

// ============================================================
// REGISTRO (email + password)
// ============================================================
export async function registrarConductor(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = str(formData, "email");
  const password = str(formData, "password");
  const nombre = str(formData, "nombre");
  const telefono = str(formData, "telefono");
  const ciudad = str(formData, "ciudad");

  if (!nombre || !email || !password)
    return { error: "Completa nombre, correo y contraseña." };
  if (password.length < 8)
    return { error: "La contraseña debe tener al menos 8 caracteres." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { rol: "conductor", nombre, telefono, ciudad } },
  });
  if (error) return { error: traducir(error.message) };

  redirect("/confirmacion?tipo=conductor");
}

export async function registrarTaller(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = str(formData, "email");
  const password = str(formData, "password");
  const nombre = str(formData, "nombre"); // nombre del contacto
  const tallerNombre = str(formData, "taller_nombre");
  const telefono = str(formData, "telefono");
  const ciudad = str(formData, "ciudad");
  const direccion = str(formData, "direccion");
  const especialidades = formData.getAll("especialidades").map(String);

  if (!tallerNombre || !nombre || !email || !password)
    return { error: "Completa el nombre del taller, contacto, correo y contraseña." };
  if (password.length < 8)
    return { error: "La contraseña debe tener al menos 8 caracteres." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        rol: "taller",
        nombre,
        taller_nombre: tallerNombre,
        telefono,
        ciudad,
        direccion,
        especialidades,
      },
    },
  });
  if (error) return { error: traducir(error.message) };

  redirect("/confirmacion?tipo=taller");
}

// ============================================================
// LOGIN / LOGOUT
// ============================================================
export async function iniciarSesion(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = str(formData, "email");
  const password = str(formData, "password");
  if (!email || !password) return { error: "Ingresa tu correo y contraseña." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) return { error: "Correo o contraseña incorrectos." };

  const { data: perfil } = await supabase
    .from("profiles")
    .select("rol")
    .eq("id", data.user.id)
    .single();

  if (!perfil) redirect("/onboarding");
  if (perfil.rol === "admin") redirect("/admin");
  redirect(perfil.rol === "taller" ? "/panel/solicitudes" : "/");
}

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ============================================================
// GOOGLE OAUTH
// ============================================================
export async function iniciarConGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await baseUrl()}/auth/callback` },
  });
  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

// ============================================================
// ONBOARDING (completar perfil tras entrar con Google)
// ============================================================
export async function completarPerfil(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rol = str(formData, "rol");
  if (rol !== "conductor" && rol !== "taller")
    return { error: "Elige si eres conductor o taller." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const meta = user.user_metadata ?? {};
  const nombre = str(formData, "nombre") || meta.full_name || meta.name || "";
  const telefono = str(formData, "telefono");
  const ciudad = str(formData, "ciudad");

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    rol,
    nombre,
    telefono,
    ciudad,
    avatar_url: meta.avatar_url ?? meta.picture ?? null,
  });
  if (error) return { error: "No se pudo guardar tu perfil. Inténtalo de nuevo." };

  if (rol === "taller") {
    const tallerNombre = str(formData, "taller_nombre");
    const direccion = str(formData, "direccion");
    const especialidades = formData.getAll("especialidades").map(String);
    if (!tallerNombre)
      return { error: "Ingresa el nombre de tu taller." };

    const id = crypto.randomUUID();
    const { error: e2 } = await supabase.from("talleres").insert({
      id,
      nombre: tallerNombre,
      slug: `${slugify(tallerNombre) || "taller"}-${id.slice(0, 6)}`,
      ciudad,
      direccion,
      whatsapp: telefono,
      especialidades,
      owner_id: user.id,
    });
    if (e2) return { error: "No se pudo crear tu taller. Inténtalo de nuevo." };

    redirect("/panel/solicitudes");
  }

  redirect("/");
}

// ============================================================
// CUENTA: actualizar datos del perfil (conductor / admin)
// ============================================================
export type PerfilFormState = { error?: string; ok?: string } | undefined;

export async function actualizarPerfil(
  _prev: PerfilFormState,
  formData: FormData
): Promise<PerfilFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const nombre = str(formData, "nombre");
  if (!nombre) return { error: "El nombre no puede quedar vacío." };

  const cambios: Record<string, string | null> = { nombre };
  // Solo actualizar los campos presentes en el formulario
  if (formData.has("telefono")) cambios.telefono = str(formData, "telefono") || null;
  if (formData.has("ciudad")) cambios.ciudad = str(formData, "ciudad") || null;

  const { error } = await supabase
    .from("profiles")
    .update(cambios)
    .eq("id", user.id);
  if (error) return { error: "No se pudieron guardar los cambios. Inténtalo de nuevo." };

  revalidatePath("/cuenta");
  revalidatePath("/admin/cuenta");
  return { ok: "Datos guardados." };
}
