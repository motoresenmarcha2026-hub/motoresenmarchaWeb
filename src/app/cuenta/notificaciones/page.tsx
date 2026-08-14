import { Bell } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { requirePerfil } from "@/lib/auth/dal";
import { perfilShell } from "@/features/usuarios/shell";

export default async function NotificacionesConductorPage() {
  const perfil = await requirePerfil();

  return (
    <DashboardShell profile={perfilShell(perfil)} navKey="conductor">
      <EstadoVacio
        icono={Bell}
        titulo="No tienes notificaciones"
        descripcion="Te avisaremos aquí cuando haya novedades sobre tus citas y solicitudes."
      />
    </DashboardShell>
  );
}
