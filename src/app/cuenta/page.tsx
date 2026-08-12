import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormularioCuenta } from "@/features/usuarios/components/FormularioCuenta";
import { CONDUCTOR_ACTUAL } from "@/features/usuarios/mock";

// TODO: conectar a Supabase — datos del conductor autenticado y actualización.
export default function CuentaConductorPage() {
  const v = CONDUCTOR_ACTUAL.vehiculo;

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
      <FormularioCuenta
        titulo="Información de la cuenta"
        descripcion="Administra tus datos personales y de contacto."
        campos={[
          { label: "Nombre completo", valor: CONDUCTOR_ACTUAL.nombre },
          { label: "Correo electrónico", valor: CONDUCTOR_ACTUAL.email, type: "email" },
          { label: "Teléfono / WhatsApp", valor: CONDUCTOR_ACTUAL.telefono },
          { label: "Ciudad", valor: CONDUCTOR_ACTUAL.ciudad ?? "" },
          {
            label: "Vehículo",
            valor: v ? `${v.marca} ${v.modelo} ${v.anio}` : "",
          },
          { label: "Placa", valor: v?.placa ?? "" },
        ]}
      />
    </DashboardShell>
  );
}
