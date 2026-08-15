import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FormularioSolicitud } from "@/features/solicitudes/components/FormularioSolicitud";
import { getTaller } from "@/features/talleres/data";
import { getPerfil } from "@/lib/auth/dal";
import type { TipoProblema, Prioridad } from "@/features/solicitudes/types";

export default async function SolicitarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const tallerId = sp.taller ?? null;
  const tipoInicial = (sp.tipo as TipoProblema | null) ?? null;
  const prioridadInicial = (sp.prioridad as Prioridad | null) ?? "normal";

  const [taller, perfil] = await Promise.all([
    tallerId ? getTaller(tallerId) : Promise.resolve(null),
    getPerfil(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-md py-xl md:px-lg">
          <div className="mb-lg flex items-center justify-between gap-md">
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-foreground-primary">
                Solicitar servicio
              </h1>
              <p className="font-body text-foreground-secondary">
                Describe tu problema y contacta al taller por WhatsApp.
              </p>
            </div>
            <Link
              href="/talleres"
              className="shrink-0 whitespace-nowrap font-caption text-sm font-semibold text-action-primary hover:underline"
            >
              Cambiar taller
            </Link>
          </div>

          <FormularioSolicitud
            taller={taller ?? undefined}
            tipoInicial={tipoInicial}
            prioridadInicial={prioridadInicial}
            clienteNombre={perfil?.nombre ?? ""}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
