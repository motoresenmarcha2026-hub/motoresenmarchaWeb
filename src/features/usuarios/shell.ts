import type { Perfil } from "@/lib/auth/dal";
import type { DashboardProfile } from "@/components/layout/DashboardShell";

const ROL_LABEL = {
  conductor: "Conductor",
  taller: "Taller",
  admin: "Admin",
} as const;

/** Perfil de la DB → props del sidebar del DashboardShell. */
export function perfilShell(perfil: Perfil): DashboardProfile {
  const rol = ROL_LABEL[perfil.rol];
  return {
    nombre: perfil.nombre ?? rol,
    subtitulo: perfil.ciudad ?? rol,
    avatarUrl: perfil.avatar_url ?? undefined,
    badge: rol,
  };
}
