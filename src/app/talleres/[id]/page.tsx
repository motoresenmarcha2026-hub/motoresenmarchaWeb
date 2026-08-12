import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSFloatingButton } from "@/components/layout/SOSFloatingButton";
import { PerfilTaller } from "@/features/talleres/components/PerfilTaller";
import { ListaResenas } from "@/features/resenas/components/ListaResenas";
import { getTaller } from "@/features/talleres/data";
import { getResenas } from "@/features/resenas/data";

export default async function PerfilMecanicoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const taller = await getTaller(id);
  if (!taller) notFound();

  const resenas = await getResenas(taller.id);

  return (
    <>
      <Header />
      <main className="flex-1">
        <PerfilTaller taller={taller} />

        {/* Reseñas */}
        <section className="border-t border-border-subtle bg-surface-page">
          <div className="mx-auto max-w-7xl px-md py-2xl md:px-lg">
            <h2 className="mb-lg font-heading text-2xl font-bold text-foreground-primary">
              Reseñas de clientes
            </h2>
            <ListaResenas resenas={resenas} />
          </div>
        </section>
      </main>
      <Footer />
      <SOSFloatingButton />
    </>
  );
}
