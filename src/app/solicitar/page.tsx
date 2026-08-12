import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FormularioSolicitud } from "@/features/solicitudes/components/FormularioSolicitud";

export default function SolicitarPage() {
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
              className="font-caption text-sm font-semibold text-action-primary hover:underline"
            >
              Cambiar taller
            </Link>
          </div>

          <Suspense
            fallback={
              <p className="font-body text-foreground-secondary">Cargando…</p>
            }
          >
            <FormularioSolicitud />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
