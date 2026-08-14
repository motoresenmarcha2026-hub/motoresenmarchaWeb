import { DashboardShell } from "@/components/layout/DashboardShell";
import { ListaCitas } from "@/features/citas/components/ListaCitas";
import { getCitasDelConductor } from "@/features/citas/data";
import { requirePerfil } from "@/lib/auth/dal";
import { perfilShell } from "@/features/usuarios/shell";

export default async function MisCitasPage() {
  const perfil = await requirePerfil();
  const citas = await getCitasDelConductor();

  return (
    <DashboardShell profile={perfilShell(perfil)} navKey="conductor">
      <ListaCitas citas={citas} />
    </DashboardShell>
  );
}
