import { Bell } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { requirePerfil } from "@/lib/auth/dal";
import { getTallerDelUsuario } from "@/features/talleres/data";

export default async function PanelNotificacionesPage() {
  const perfil = await requirePerfil();
  const taller = await getTallerDelUsuario();

  return (
    <DashboardShell
      profile={{
        nombre: taller?.nombre ?? perfil.nombre ?? "Mi taller",
        subtitulo: taller?.ubicacion.ciudad ?? perfil.ciudad ?? "",
        avatarUrl: taller?.avatarUrl || undefined,
        badge: taller?.disponibilidad === "available" ? "Disponible" : "Ocupado",
      }}
      navKey="taller"
    >
      <EstadoVacio
        icono={Bell}
        titulo="No tienes notificaciones"
        descripcion="Las solicitudes nuevas llegan en tiempo real a «Citas y solicitudes»; aquí verás otras novedades próximamente."
      />
    </DashboardShell>
  );
}
