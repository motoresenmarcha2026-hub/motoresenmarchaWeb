import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormCuentaTaller } from "@/features/talleres/components/FormCuentaTaller";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { requirePerfil, getUser } from "@/lib/auth/dal";
import { getTallerDelUsuario } from "@/features/talleres/data";

export default async function PanelCuentaPage() {
  const perfil = await requirePerfil();
  const [user, taller] = await Promise.all([getUser(), getTallerDelUsuario()]);

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
        <FormCuentaTaller
          taller={taller}
          email={user?.email ?? ""}
          userId={perfil.id}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-border-subtle p-2xl text-center">
          <h1 className="font-heading text-xl font-bold text-foreground-primary">
            Aún no tienes un taller registrado
          </h1>
          <p className="mt-xs font-body text-foreground-secondary">
            Completa tu registro de taller para administrar tu negocio.
          </p>
          <Link
            href="/registro/taller"
            className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-md")}
          >
            Registrar mi taller
          </Link>
        </div>
      )}
    </DashboardShell>
  );
}
