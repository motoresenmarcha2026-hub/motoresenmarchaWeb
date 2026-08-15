import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormularioCuenta } from "@/features/usuarios/components/FormularioCuenta";
import { requirePerfil, getUser } from "@/lib/auth/dal";
import { perfilShell } from "@/features/usuarios/shell";

export default async function CuentaConductorPage() {
  const perfil = await requirePerfil();
  const user = await getUser();

  return (
    <DashboardShell profile={perfilShell(perfil)} navKey="conductor">
      <FormularioCuenta
        titulo="Información de la cuenta"
        descripcion="Administra tus datos personales y de contacto."
        campos={[
          { label: "Nombre completo", valor: perfil.nombre ?? "", name: "nombre" },
          {
            label: "Correo electrónico",
            valor: user?.email ?? "",
            type: "email",
          },
          {
            label: "Teléfono / WhatsApp",
            valor: perfil.telefono ?? "",
            name: "telefono",
          },
          { label: "Ciudad", valor: perfil.ciudad ?? "", name: "ciudad" },
        ]}
      />
    </DashboardShell>
  );
}
