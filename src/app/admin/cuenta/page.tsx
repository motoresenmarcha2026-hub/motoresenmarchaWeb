import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormularioCuenta } from "@/features/usuarios/components/FormularioCuenta";

// TODO: conectar a Supabase — cuenta del administrador autenticado.
export default function AdminCuentaPage() {
  return (
    <DashboardShell
      profile={{
        nombre: "Admin Motores",
        subtitulo: "Administrador",
        badge: "Admin",
      }}
      navKey="admin"
    >
      <FormularioCuenta
        titulo="Administrar cuenta"
        descripcion="Datos de la cuenta de administración de la plataforma."
        campos={[
          { label: "Nombre", valor: "Admin Motores" },
          { label: "Correo electrónico", valor: "admin@motoresenmarcha.mx", type: "email" },
          { label: "Teléfono", valor: "+52 55 0000 0000" },
          { label: "Rol", valor: "Administrador" },
        ]}
      />
    </DashboardShell>
  );
}
