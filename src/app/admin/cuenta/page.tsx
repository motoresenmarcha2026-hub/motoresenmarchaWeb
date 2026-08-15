import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormularioCuenta } from "@/features/usuarios/components/FormularioCuenta";
import { requireAdmin, getUser } from "@/lib/auth/dal";

export default async function AdminCuentaPage() {
  const perfil = await requireAdmin();
  const user = await getUser();

  return (
    <DashboardShell
      profile={{
        nombre: perfil.nombre ?? "Administrador",
        subtitulo: "Administración",
        avatarUrl: perfil.avatar_url ?? undefined,
        badge: "Admin",
      }}
      navKey="admin"
    >
      <FormularioCuenta
        titulo="Administrar cuenta"
        descripcion="Datos de la cuenta de administración de la plataforma."
        campos={[
          { label: "Nombre", valor: perfil.nombre ?? "", name: "nombre" },
          {
            label: "Correo electrónico",
            valor: user?.email ?? "",
            type: "email",
          },
          { label: "Teléfono", valor: perfil.telefono ?? "", name: "telefono" },
          { label: "Rol", valor: "Administrador" },
        ]}
      />
    </DashboardShell>
  );
}
