import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSFloatingButton } from "@/components/layout/SOSFloatingButton";
import { TalleresCliente } from "@/features/talleres/components/TalleresCliente";
import { getTalleres } from "@/features/talleres/data";

// Datos reales desde Supabase (con fallback a mock).
export default async function TalleresPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { q } = await searchParams;
  const talleres = await getTalleres();

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
                Talleres mecánicos cerca de ti
              </h1>
              <p className="mt-sm max-w-[38rem] font-body text-foreground-inverse-secondary">
                Encuentra al especialista indicado, revisa calificaciones y
                contáctalo por WhatsApp al instante.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-md py-lg md:px-lg">
          <TalleresCliente talleres={talleres} textoInicial={q ?? ""} />
        </div>
      </main>

      <Footer />
      <SOSFloatingButton />
    </>
  );
}
