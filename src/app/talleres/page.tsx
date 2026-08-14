import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSFloatingButton } from "@/components/layout/SOSFloatingButton";
import { TalleresCliente } from "@/features/talleres/components/TalleresCliente";
import { getTalleres } from "@/features/talleres/data";

// Datos reales desde Supabase (con fallback a mock).
export default async function TalleresPage() {
  const talleres = await getTalleres();

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Encabezado */}
        <section className="bg-surface-inverse">
          <div className="mx-auto flex max-w-7xl flex-col gap-md px-md py-xl md:flex-row md:items-end md:justify-between md:px-lg">
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-foreground-inverse md:text-4xl">
                Talleres mecánicos cerca de ti
              </h1>
              <p className="mt-xs font-body text-foreground-inverse-secondary">
                Encuentra al especialista indicado, revisa calificaciones y
                contáctalo por WhatsApp al instante.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-md py-lg md:px-lg">
          <TalleresCliente talleres={talleres} />
        </div>
      </main>

      <Footer />
      <SOSFloatingButton />
    </>
  );
}
