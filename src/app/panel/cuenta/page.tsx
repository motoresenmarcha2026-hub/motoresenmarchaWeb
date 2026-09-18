import { Store } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormCuentaTaller } from "@/features/talleres/components/FormCuentaTaller";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { requirePerfil, getUser } from "@/lib/auth/dal";
import { getTallerDelUsuario } from "@/features/talleres/data";
import { tallerShell } from "@/features/usuarios/shell";

export default async function PanelCuentaPage() {
  const perfil = await requirePerfil();
  const [user, taller] = await Promise.all([getUser(), getTallerDelUsuario()]);

  return (
    <DashboardShell profile={tallerShell(perfil, taller)} navKey="taller">
      {taller ? (
        <FormCuentaTaller
          taller={taller}
          email={user?.email ?? ""}
          userId={perfil.id}
        />
      ) : (
        <EstadoVacio
          icono={Store}
          titulo="Aún no tienes un taller registrado"
          descripcion="Completa tu registro de taller para administrar tu negocio."
          cta={{ href: "/registro/taller", label: "Registrar mi taller" }}
        />
      )}
    </DashboardShell>
  );
}
