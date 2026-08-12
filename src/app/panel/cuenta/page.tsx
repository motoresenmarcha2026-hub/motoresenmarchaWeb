import { Tag } from "@/components/ui/Tag";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormularioCuenta } from "@/features/usuarios/components/FormularioCuenta";
import { TALLER_ACTUAL } from "@/features/usuarios/mock";
import { getTallerPorId, especialidadMeta } from "@/features/talleres/mock";

// TODO: conectar a Supabase — datos del taller autenticado y actualización.
export default function PanelCuentaPage() {
  const taller = getTallerPorId(TALLER_ACTUAL.id);

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
      <FormularioCuenta
        titulo="Información del taller"
        descripcion="Administra los datos de tu negocio y publícalos en el marketplace."
        seccionLabel="Datos del negocio"
        campos={[
          { label: "Nombre del taller", valor: TALLER_ACTUAL.nombreComercial },
          { label: "Nombre del contacto", valor: TALLER_ACTUAL.nombre },
          { label: "Correo", valor: TALLER_ACTUAL.email, type: "email" },
          { label: "Teléfono / WhatsApp", valor: TALLER_ACTUAL.telefono },
          { label: "RFC", valor: TALLER_ACTUAL.rfc ?? "" },
          { label: "Dirección", valor: TALLER_ACTUAL.direccion, anchoCompleto: true },
        ]}
      >
        {taller && (
          <div className="mt-lg">
            <p className="mb-sm font-caption text-sm font-semibold text-foreground-primary">
              Servicios que ofreces
            </p>
            <div className="flex flex-wrap gap-xs">
              {taller.especialidades.map((e) => (
                <Tag key={e}>{especialidadMeta(e).label}</Tag>
              ))}
            </div>
          </div>
        )}
      </FormularioCuenta>
    </DashboardShell>
  );
}
