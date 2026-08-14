import { Car } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { requirePerfil } from "@/lib/auth/dal";
import { perfilShell } from "@/features/usuarios/shell";

export default async function VehiculoPage() {
  const perfil = await requirePerfil();

  return (
    <DashboardShell profile={perfilShell(perfil)} navKey="conductor">
      <EstadoVacio
        icono={Car}
        titulo="Aún no has registrado tu vehículo"
        descripcion="Próximamente podrás guardar los datos de tu vehículo (marca, modelo y placa) para agilizar tus solicitudes de servicio."
      />
    </DashboardShell>
  );
}
