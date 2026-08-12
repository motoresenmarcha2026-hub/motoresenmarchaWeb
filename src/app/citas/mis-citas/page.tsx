import { DashboardShell } from "@/components/layout/DashboardShell";
import { ListaCitas } from "@/features/citas/components/ListaCitas";
import { CONDUCTOR_ACTUAL } from "@/features/usuarios/mock";
import { getCitasPorConductor } from "@/features/citas/mock";

// TODO: conectar a Supabase — citas del conductor autenticado.
export default function MisCitasPage() {
  const citas = getCitasPorConductor(CONDUCTOR_ACTUAL.id);

  return (
    <DashboardShell
      profile={{
        nombre: CONDUCTOR_ACTUAL.nombre,
        subtitulo: CONDUCTOR_ACTUAL.ciudad ?? "Conductor",
        avatarUrl: CONDUCTOR_ACTUAL.avatarUrl,
        badge: "Conductor",
      }}
      navKey="conductor"
    >
      <ListaCitas citas={citas} />
    </DashboardShell>
  );
}
