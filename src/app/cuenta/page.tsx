import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormularioCuenta } from "@/features/usuarios/components/FormularioCuenta";
import { requirePerfil, getUser } from "@/lib/auth/dal";

export default async function CuentaConductorPage() {
  const perfil = await requirePerfil();
  const user = await getUser();

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
      <FormularioCuenta
        titulo="Información de la cuenta"
        descripcion="Administra tus datos personales y de contacto."
        campos={[
          { label: "Nombre completo", valor: perfil.nombre ?? "" },
          {
            label: "Correo electrónico",
            valor: user?.email ?? "",
            type: "email",
          },
          { label: "Teléfono / WhatsApp", valor: perfil.telefono ?? "" },
          { label: "Ciudad", valor: perfil.ciudad ?? "" },
        ]}
      />
    </DashboardShell>
  );
}
