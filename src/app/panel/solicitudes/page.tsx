import { DashboardShell } from "@/components/layout/DashboardShell";
import { PanelSolicitudes } from "@/features/solicitudes/components/PanelSolicitudes";
import { TALLER_ACTUAL } from "@/features/usuarios/mock";
import { getSolicitudesPorTaller } from "@/features/solicitudes/mock";

// TODO: conectar a Supabase — solicitudes en tiempo real del taller autenticado.
export default function PanelSolicitudesPage() {
  const solicitudes = getSolicitudesPorTaller(TALLER_ACTUAL.id);

  return (
    <DashboardShell
      profile={{
        nombre: TALLER_ACTUAL.nombreComercial,
        subtitulo: TALLER_ACTUAL.nombre,
        avatarUrl: TALLER_ACTUAL.avatarUrl,
        badge: "Disponible",
      }}
      navKey="taller"
    >
      <PanelSolicitudes solicitudes={solicitudes} />
    </DashboardShell>
  );
}
