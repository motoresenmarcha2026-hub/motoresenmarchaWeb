import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSFloatingButton } from "@/components/layout/SOSFloatingButton";
import { PerfilTaller } from "@/features/talleres/components/PerfilTaller";
import { ListaResenas } from "@/features/resenas/components/ListaResenas";
import { getTaller } from "@/features/talleres/data";
import { getResenas } from "@/features/resenas/data";

// Memoizado por request: lo comparten generateMetadata y la página.
const getTallerCached = cache(getTaller);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const taller = await getTallerCached(id);
  if (!taller) return {};

  const titulo = `${taller.nombre} — Taller mecánico en ${taller.ubicacion.ciudad || "México"}`;
  const descripcion =
    taller.descripcion ||
    `${taller.nombre}: taller mecánico con calificación ${taller.rating.toFixed(1)}. Contáctalo por WhatsApp en Motores en Marcha.`;

  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      images: taller.fotoUrl ? [{ url: taller.fotoUrl }] : undefined,
    },
  };
}

export default async function PerfilMecanicoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const taller = await getTallerCached(id);
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
