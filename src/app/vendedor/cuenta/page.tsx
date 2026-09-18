import { ShoppingBag } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FormCuentaVendedor } from "@/features/vendedores/components/FormCuentaVendedor";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
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
        <EstadoVacio
          icono={ShoppingBag}
          titulo="Aún no tienes un negocio registrado"
          descripcion="Completa tu registro de vendedor para administrar tu refaccionaria."
          cta={{ href: "/registro/vendedor", label: "Registrar mi negocio" }}
        />
      )}
    </DashboardShell>
  );
}
