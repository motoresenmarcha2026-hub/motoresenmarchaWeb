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
        <PanelSolicitudes
          solicitudes={solicitudes}
          citas={citas}
          tallerId={taller.id}
        />
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
