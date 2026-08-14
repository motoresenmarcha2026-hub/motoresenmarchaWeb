import { DashboardShell } from "@/components/layout/DashboardShell";
import { ListaCitas } from "@/features/citas/components/ListaCitas";
import { getCitasDelConductor } from "@/features/citas/data";
import { requirePerfil } from "@/lib/auth/dal";

export default async function MisCitasPage() {
  const perfil = await requirePerfil();
  const citas = await getCitasDelConductor();

  return (
    <DashboardShell
      profile={{
        nombre: perfil.nombre ?? "Conductor",
        subtitulo: perfil.ciudad ?? "Conductor",
        avatarUrl: perfil.avatar_url ?? undefined,
        badge: "Conductor",
      }}
      navKey="conductor"
    >
      <ListaCitas citas={citas} />
    </DashboardShell>
  );
}
