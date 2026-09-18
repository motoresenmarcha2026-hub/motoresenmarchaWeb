import Link from "next/link";
import { Camera, Store } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PanelSolicitudes } from "@/features/solicitudes/components/PanelSolicitudes";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { requirePerfil } from "@/lib/auth/dal";
import { getTallerDelUsuario } from "@/features/talleres/data";
import { getSolicitudesDelTaller } from "@/features/solicitudes/data";
import { getCitasDelTaller } from "@/features/citas/data";
import { tallerShell } from "@/features/usuarios/shell";

export default async function PanelSolicitudesPage() {
  const perfil = await requirePerfil();
  const taller = await getTallerDelUsuario();

  const [solicitudes, citas] = taller
    ? await Promise.all([getSolicitudesDelTaller(), getCitasDelTaller()])
    : [[], []];

  return (
    <DashboardShell profile={tallerShell(perfil, taller)} navKey="taller">
      {taller ? (
        <div className="flex flex-col gap-md">
          {!taller.fotoUrl && (
            <div className="flex flex-wrap items-center justify-between gap-sm border-2 border-action-urgent bg-surface-card p-md">
              <div className="flex items-center gap-sm">
                <Camera size={20} className="shrink-0 text-action-urgent" />
                <div>
                  <p className="font-heading text-sm font-extrabold uppercase text-foreground-primary">
                    Tu taller aún no tiene foto
                  </p>
                  <p className="font-body text-sm text-foreground-secondary">
                    Los talleres con foto generan más confianza y reciben más
                    solicitudes. Súbela ahora, toma un minuto.
                  </p>
                </div>
              </div>
              <Link
                href="/panel/cuenta"
                className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
              >
                Subir foto
              </Link>
            </div>
          )}
          <PanelSolicitudes
            solicitudes={solicitudes}
            citas={citas}
            tallerId={taller.id}
          />
        </div>
      ) : (
        <EstadoVacio
          icono={Store}
          titulo="Aún no tienes un taller registrado"
          descripcion="Completa tu registro de taller para empezar a recibir solicitudes."
          cta={{ href: "/registro/taller", label: "Registrar mi taller" }}
        />
      )}
    </DashboardShell>
  );
}
