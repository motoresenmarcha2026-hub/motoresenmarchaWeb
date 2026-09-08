import { MapPin } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { requirePerfil } from "@/lib/auth/dal";
import { getTallerDelUsuario } from "@/features/talleres/data";
import { tallerShell } from "@/features/usuarios/shell";

export default async function PanelSucursalesPage() {
  const perfil = await requirePerfil();
  const taller = await getTallerDelUsuario();

  return (
    <DashboardShell profile={tallerShell(perfil, taller)} navKey="taller">
      <EstadoVacio
        icono={MapPin}
        titulo="Aún no tienes sucursales"
        descripcion="Próximamente podrás administrar varias ubicaciones de tu taller desde aquí."
      />
    </DashboardShell>
  );
}
