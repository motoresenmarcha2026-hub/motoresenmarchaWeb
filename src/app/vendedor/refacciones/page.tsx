import { ShoppingBag } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { InventarioRefacciones } from "@/features/refacciones/components/InventarioRefacciones";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
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
        <EstadoVacio
          icono={ShoppingBag}
          titulo="Aún no tienes un negocio registrado"
          descripcion="Completa tu registro de vendedor para empezar a publicar refacciones."
          cta={{ href: "/registro/vendedor", label: "Registrar mi negocio" }}
        />
      )}
    </DashboardShell>
  );
}
