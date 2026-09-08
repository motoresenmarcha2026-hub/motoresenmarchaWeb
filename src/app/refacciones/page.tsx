import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSFloatingButton } from "@/components/layout/SOSFloatingButton";
import { RefaccionesCliente } from "@/features/refacciones/components/RefaccionesCliente";
import { getRefacciones } from "@/features/refacciones/data";

export const metadata = {
  title: "Refacciones y autopartes",
  description:
    "Encuentra refacciones y autopartes de vendedores verificados y contáctalos por WhatsApp en Motores en Marcha.",
};

export default async function RefaccionesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { q } = await searchParams;
  const refacciones = await getRefacciones();

  return (
    <>
      <Header />

      <main className="flex-1 pb-[5.5rem]">
        {/* Encabezado */}
        <section className="relative overflow-hidden bg-surface-inverse">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-emergency"
            style={{ clipPath: "polygon(0 0, 100% 0, 55% 100%, 0 100%)" }}
          />
          <div className="relative mx-auto flex max-w-7xl flex-col gap-md px-md py-xl md:flex-row md:items-end md:justify-between md:px-lg">
            <div>
              <h1 className="font-heading text-4xl font-extrabold uppercase leading-none text-foreground-inverse md:text-5xl">
                Refacciones y autopartes
              </h1>
              <p className="mt-sm max-w-[38rem] font-body text-foreground-inverse-secondary">
                Compara precios, revisa la compatibilidad y contacta al vendedor
                por WhatsApp al instante.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-md py-lg md:px-lg">
          <RefaccionesCliente refacciones={refacciones} textoInicial={q ?? ""} />
        </div>
      </main>

      <Footer />
      <SOSFloatingButton />
    </>
  );
}
