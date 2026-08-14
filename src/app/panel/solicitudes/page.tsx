import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PanelSolicitudes } from "@/features/solicitudes/components/PanelSolicitudes";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { requirePerfil } from "@/lib/auth/dal";
import { getTallerDelUsuario } from "@/features/talleres/data";
import { getSolicitudesDelTaller } from "@/features/solicitudes/data";
import { getCitasDelTaller } from "@/features/citas/data";

export default async function PanelSolicitudesPage() {
  const perfil = await requirePerfil();
  const taller = await getTallerDelUsuario();

  const [solicitudes, citas] = taller
    ? await Promise.all([getSolicitudesDelTaller(), getCitasDelTaller()])
    : [[], []];

  return (
    <DashboardShell
      profile={{
        nombre: taller?.nombre ?? perfil.nombre ?? "Mi taller",
        subtitulo: taller?.ubicacion.ciudad ?? perfil.ciudad ?? "",
        avatarUrl: taller?.avatarUrl || undefined,
        badge: taller?.disponibilidad === "available" ? "Disponible" : "Ocupado",
      }}
      navKey="taller"
    >
      {taller ? (
        <div className="flex flex-col gap-md">
          {!taller.fotoUrl && (
            <div className="flex flex-wrap items-center justify-between gap-sm rounded-2xl border border-action-urgent/40 bg-action-urgent/10 p-md">
              <div>
                <p className="font-heading font-bold text-foreground-primary">
                  📸 Tu taller aún no tiene foto
                </p>
                <p className="font-caption text-sm text-foreground-secondary">
                  Los talleres con foto generan más confianza y reciben más
                  solicitudes. Súbela ahora, toma un minuto.
                </p>
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
        <div className="rounded-2xl border border-dashed border-border-subtle p-2xl text-center">
          <h1 className="font-heading text-xl font-bold text-foreground-primary">
            Aún no tienes un taller registrado
          </h1>
          <p className="mt-xs font-body text-foreground-secondary">
            Completa tu registro de taller para empezar a recibir solicitudes.
          </p>
          <Link
            href="/registro/taller"
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "mt-md"
            )}
          >
            Registrar mi taller
          </Link>
        </div>
      )}
    </DashboardShell>
  );
}
