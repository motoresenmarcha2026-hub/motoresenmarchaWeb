import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormCuentaVendedor } from "@/features/vendedores/components/FormCuentaVendedor";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { requireVendedor, getUser } from "@/lib/auth/dal";
import { getVendedorDelUsuario } from "@/features/vendedores/data";
import { vendedorShell } from "@/features/usuarios/shell";

export default async function VendedorCuentaPage() {
  const perfil = await requireVendedor();
  const [user, vendedor] = await Promise.all([getUser(), getVendedorDelUsuario()]);

  return (
    <DashboardShell profile={vendedorShell(perfil, vendedor)} navKey="vendedor">
      {vendedor ? (
        <FormCuentaVendedor
          vendedor={vendedor}
          email={user?.email ?? ""}
          userId={perfil.id}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-border-subtle p-2xl text-center">
          <h1 className="font-heading text-xl font-bold text-foreground-primary">
            Aún no tienes un negocio registrado
          </h1>
          <p className="mt-xs font-body text-foreground-secondary">
            Completa tu registro de vendedor para administrar tu refaccionaria.
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
