import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { InventarioRefacciones } from "@/features/refacciones/components/InventarioRefacciones";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { requireVendedor } from "@/lib/auth/dal";
import { getVendedorDelUsuario } from "@/features/vendedores/data";
import { getRefaccionesDelVendedor } from "@/features/refacciones/data";
import { vendedorShell } from "@/features/usuarios/shell";

export default async function VendedorRefaccionesPage() {
  const perfil = await requireVendedor();
  const vendedor = await getVendedorDelUsuario();
  const refacciones = vendedor ? await getRefaccionesDelVendedor() : [];

  return (
    <DashboardShell profile={vendedorShell(perfil, vendedor)} navKey="vendedor">
      {vendedor ? (
        <InventarioRefacciones refacciones={refacciones} userId={perfil.id} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border-subtle p-2xl text-center">
          <h1 className="font-heading text-xl font-bold text-foreground-primary">
            Aún no tienes un negocio registrado
          </h1>
          <p className="mt-xs font-body text-foreground-secondary">
            Completa tu registro de vendedor para empezar a publicar refacciones.
          </p>
          <Link
            href="/registro/vendedor"
            className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-md")}
          >
            Registrar mi negocio
          </Link>
        </div>
      )}
    </DashboardShell>
  );
}
