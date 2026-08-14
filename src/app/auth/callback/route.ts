import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback de OAuth (Google). Supabase redirige aquí con un `code`; lo
 * intercambiamos por una sesión y enrutamos según el estado del perfil:
 *   - sin perfil  → /onboarding (elegir conductor/taller)
 *   - taller      → /panel/solicitudes
 *   - conductor   → destino solicitado (`next`) o /
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: perfil } = await supabase
        .from("profiles")
        .select("rol")
        .eq("id", user!.id)
        .single();

      let destino = next ?? "/";
      if (!perfil) destino = "/onboarding";
      else if (perfil.rol === "taller") destino = "/panel/solicitudes";

      return NextResponse.redirect(`${origin}${destino}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
