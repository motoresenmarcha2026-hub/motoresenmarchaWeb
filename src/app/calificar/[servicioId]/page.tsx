import { notFound } from "next/navigation";
import { Wrench, Calendar, Clock, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FormularioCalificacion } from "@/features/resenas/components/FormularioCalificacion";
import { formatearFecha } from "@/lib/utils";
import { getCita } from "@/features/citas/data";

export default async function CalificarPage({
  params,
}: {
  params: Promise<{ servicioId: string }>;
}) {
  const { servicioId } = await params;
  const servicio = await getCita(servicioId);
  if (!servicio) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto grid max-w-7xl gap-xl px-md py-2xl md:grid-cols-2 md:px-lg">
          {/* Resumen del servicio */}
          <div className="flex flex-col gap-lg">
            <div>
              <span className="inline-flex items-center gap-xs rounded-full bg-status-available/15 px-md py-xs font-caption text-sm font-semibold text-status-available">
                Servicio completado
              </span>
              <h1 className="mt-md font-heading text-3xl font-extrabold text-foreground-primary md:text-4xl">
                Califica tu servicio
              </h1>
              <p className="mt-xs font-body text-foreground-secondary">
                Tu opinión ayuda a mantener una comunidad de talleres confiables.
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface-card p-lg">
              <div className="flex items-center gap-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-page text-accent-primary">
                  <Wrench size={24} />
                </span>
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground-primary">
                    {servicio.tallerNombre}
                  </h2>
                  <p className="font-caption text-sm text-foreground-secondary">
                    {servicio.servicio}
                  </p>
                </div>
              </div>
              <dl className="mt-md flex flex-col gap-sm font-caption text-sm">
                <Fila
                  icon={<Calendar size={14} />}
                  label="Fecha"
                  valor={formatearFecha(servicio.fecha)}
                />
                <Fila
                  icon={<Clock size={14} />}
                  label="Hora"
                  valor={servicio.hora}
                />
                <Fila
                  icon={<MapPin size={14} />}
                  label="Cliente"
                  valor={servicio.clienteNombre}
                />
              </dl>
            </div>
          </div>

          {/* Formulario */}
          <FormularioCalificacion
            tallerId={servicio.tallerId}
            servicio={servicio.servicio}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

function Fila({
  icon,
  label,
  valor,
}: {
  icon: React.ReactNode;
  label: string;
  valor: string;
}) {
  return (
    <div className="flex items-center justify-between gap-md">
      <dt className="inline-flex items-center gap-xs text-foreground-secondary">
        {icon} {label}
      </dt>
      <dd className="font-semibold text-foreground-primary">{valor}</dd>
    </div>
  );
}
