import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgendarCita } from "@/features/citas/components/AgendarCita";
import { getTaller } from "@/features/talleres/data";

export default async function AgendarCitaPage({
  params,
}: {
  params: Promise<{ tallerId: string }>;
}) {
  const { tallerId } = await params;
  const taller = await getTaller(tallerId);
  if (!taller) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-md py-xl md:px-lg">
          <Link
            href={`/talleres/${taller.id}`}
            className="inline-flex items-center gap-xs font-caption text-sm text-foreground-secondary hover:text-foreground-primary"
          >
            <ArrowLeft size={16} /> Volver al perfil
          </Link>
          <h1 className="mt-sm font-heading text-3xl font-extrabold text-foreground-primary">
            Agendar una cita
          </h1>
          <p className="mb-lg font-body text-foreground-secondary">
            Reserva un horario con {taller.nombre}.
          </p>

          <AgendarCita taller={taller} />
        </div>
      </main>
      <Footer />
    </>
  );
}
