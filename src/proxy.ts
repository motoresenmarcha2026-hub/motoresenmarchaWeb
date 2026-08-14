import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

// Rutas que requieren sesión iniciada.
const PROTEGIDAS = ["/panel", "/cuenta", "/citas", "/calificar", "/admin", "/onboarding"];
// Rutas de auth: si ya hay sesión, no tiene sentido volver a entrar/registrarse.
const SOLO_INVITADOS = ["/login", "/registro"];

/**
 * Proxy (Next.js 16, antes "Middleware"): refresca la sesión de Supabase en
 * cada request y hace redirects optimistas según el estado de auth.
 * La autorización real (por rol / dueño) vive en RLS y en el Data Access Layer.
 */
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const esProtegida = PROTEGIDAS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const esSoloInvitados = SOLO_INVITADOS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!user && esProtegida) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return copiarCookies(response, NextResponse.redirect(url));
  }

  if (user && esSoloInvitados) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return copiarCookies(response, NextResponse.redirect(url));
  }

  return response;
}

/** Copia las cookies de sesión refrescadas al response de redirect. */
function copiarCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie));
  return to;
}

export const config = {
  matcher: [
    // Todo excepto estáticos e imágenes.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
