import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSFloatingButton } from "@/components/layout/SOSFloatingButton";
import { PerfilRefaccion } from "@/features/refacciones/components/PerfilRefaccion";
import { getRefaccion } from "@/features/refacciones/data";

// Memoizado por request: lo comparten generateMetadata y la página.
const getRefaccionCached = cache(getRefaccion);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const refaccion = await getRefaccionCached(id);
  if (!refaccion) return {};

  const titulo = `${refaccion.nombre}${refaccion.marca ? ` — ${refaccion.marca}` : ""} | Refacciones`;
  const descripcion =
    refaccion.descripcion ||
    `${refaccion.nombre}: refacción disponible en Motores en Marcha. Contacta al vendedor por WhatsApp.`;

  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      images: refaccion.fotoUrl ? [{ url: refaccion.fotoUrl }] : undefined,
    },
  };
}

export default async function DetalleRefaccionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const refaccion = await getRefaccionCached(id);
  if (!refaccion) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <PerfilRefaccion refaccion={refaccion} />
      </main>
      <Footer />
      <SOSFloatingButton />
    </>
  );
}
