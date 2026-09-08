import type { Perfil } from "@/lib/auth/dal";
import type { Taller } from "@/features/talleres/types";
import type { Vendedor } from "@/features/vendedores/types";
import type { DashboardProfile } from "@/components/layout/DashboardShell";

const ROL_LABEL = {
  conductor: "Conductor",
  taller: "Taller",
  admin: "Admin",
  vendedor: "Vendedor",
} as const;

/** Perfil de la DB → props del sidebar del DashboardShell (conductor). */
export function perfilShell(perfil: Perfil): DashboardProfile {
  const rol = ROL_LABEL[perfil.rol];
  return {
    nombre: perfil.nombre ?? rol,
    subtitulo: perfil.ciudad ?? rol,
    avatarUrl: perfil.avatar_url ?? undefined,
    badge: rol,
  };
}

/** Taller (o fallback al perfil) → props del sidebar del panel del taller. */
export function tallerShell(perfil: Perfil, taller: Taller | null): DashboardProfile {
  return {
    nombre: taller?.nombre ?? perfil.nombre ?? "Mi taller",
    subtitulo: taller?.ubicacion.ciudad ?? perfil.ciudad ?? "",
    avatarUrl: taller?.avatarUrl || undefined,
    badge: taller?.disponibilidad === "available" ? "Disponible" : "Ocupado",
  };
}

/** Perfil admin → props del sidebar del panel de administración. */
export function adminShell(perfil: Perfil): DashboardProfile {
  return {
    nombre: perfil.nombre ?? "Administrador",
    subtitulo: "Administración",
    avatarUrl: perfil.avatar_url ?? undefined,
    badge: "Admin",
  };
}

/** Vendedor (o fallback al perfil) → props del sidebar del panel del vendedor. */
export function vendedorShell(
  perfil: Perfil,
  vendedor: Vendedor | null
): DashboardProfile {
  return {
    nombre: vendedor?.nombreNegocio ?? perfil.nombre ?? "Mi negocio",
    subtitulo: vendedor?.ciudad ?? perfil.ciudad ?? "",
    avatarUrl: vendedor?.logoUrl || perfil.avatar_url || undefined,
    badge: vendedor?.verificado ? "Verificado" : "Vendedor",
  };
}
