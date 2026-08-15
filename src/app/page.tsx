import Image from "next/image";
import Link from "next/link";
import { Search, MessageCircle, Siren, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSFloatingButton } from "@/components/layout/SOSFloatingButton";
import { buttonVariants } from "@/components/ui/Button";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { TarjetaTaller } from "@/features/talleres/components/TarjetaTaller";
import { getTalleresDestacados } from "@/features/talleres/data";
import { TIPOS_PROBLEMA } from "@/features/solicitudes/mock";

const COMO_FUNCIONA = [
  {
    n: "1",
    titulo: "Describe tu problema",
    texto: "Cuéntanos qué le pasa a tu auto y marca tu ubicación.",
  },
  {
    n: "2",
    titulo: "Conecta por WhatsApp",
    texto: "Contacta al instante al mecánico o taller más cercano.",
  },
  {
    n: "3",
    titulo: "Recibe ayuda rápida",
    texto: "El mecánico llega a ti o te agenda una cita. Sin complicaciones.",
  },
];

export default async function HomePage() {
  const destacados = await getTalleresDestacados();

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="bg-surface-inverse">
          <div className="mx-auto grid max-w-7xl items-center gap-xl px-md py-2xl md:grid-cols-2 md:px-lg">
            <div className="flex flex-col gap-lg">
              <span className="inline-flex w-fit items-center gap-xs rounded-full bg-emergency/15 px-md py-xs font-caption text-sm font-semibold text-emergency">
                <Siren size={14} /> Ayuda de emergencia 24/7
              </span>
              <h1 className="font-heading text-4xl font-extrabold leading-tight text-foreground-inverse md:text-5xl">
                Ayuda mecánica confiable, a un mensaje de{" "}
                <span className="text-whatsapp">WhatsApp</span> de distancia
              </h1>
              <p className="max-w-[28rem] font-body text-lg text-foreground-inverse-secondary">
                Conecta con mecánicos y talleres cercanos en segundos. Ya sea una
                revisión o una emergencia en la carretera, la ayuda está a un
                mensaje de distancia.
              </p>

              {/* Buscador */}
              <form
                action="/talleres"
                className="flex flex-col gap-sm rounded-2xl bg-surface-card p-sm shadow-lg sm:flex-row"
              >
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-md top-1/2 -translate-y-1/2 text-foreground-secondary"
                  />
                  <input
                    name="q"
                    placeholder="¿Qué servicio necesitas?"
                    className="w-full rounded-lg bg-surface-page py-2.5 pl-10 pr-md font-body text-sm text-foreground-primary placeholder:text-foreground-secondary focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "primary" }))}
                >
                  Buscar
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-x-md gap-y-xs text-sm text-foreground-inverse-secondary">
                <span>+500 mecánicos verificados</span>
                <span className="hidden h-1 w-1 rounded-full bg-foreground-inverse-secondary sm:block" />
                <span>Respuesta en minutos</span>
              </div>
            </div>

            {/* Imagen */}
            <div className="relative hidden h-96 overflow-hidden rounded-3xl md:block">
              <Image
                src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1000&q=70"
                alt="Mecánico trabajando en un motor"
                fill
                sizes="50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section className="mx-auto max-w-7xl px-md py-2xl md:px-lg">
          <div className="mb-lg flex flex-col gap-xs">
            <h2 className="font-heading text-3xl font-bold text-foreground-primary">
              Elige el servicio que necesitas
            </h2>
            <p className="font-body text-foreground-secondary">
              Selecciona el tipo de problema y te conectamos con el especialista
              indicado.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-md sm:grid-cols-3 lg:grid-cols-5">
            {TIPOS_PROBLEMA.slice(0, 10).map((t) => (
              <Link key={t.key} href={`/solicitar?tipo=${t.key}`}>
                <CategoryCard icono={t.icono} label={t.label} className="w-full" />
              </Link>
            ))}
          </div>
        </section>

        {/* BANDA DE EMERGENCIA */}
        <section className="bg-emergency">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-md px-md py-xl text-center md:flex-row md:justify-between md:px-lg md:text-left">
            <div className="flex items-center gap-md">
              <Siren size={40} className="shrink-0 text-foreground-inverse" />
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-foreground-inverse">
                  ¿Tu auto se quedó en la carretera?
                </h2>
                <p className="font-body text-foreground-inverse/90">
                  Activa el SOS y contacta ayuda de emergencia de inmediato por
                  WhatsApp.
                </p>
              </div>
            </div>
            <Link
              href="/solicitar?prioridad=emergencia"
              className={cn(
                "bg-surface-card text-emergency hover:bg-surface-page",
                buttonVariants({ variant: "primary", size: "lg" })
              )}
            >
              <Siren size={20} /> Solicitar ayuda urgente
            </Link>
          </div>
        </section>

        {/* DESTACADOS */}
        {destacados.length > 0 && (
          <section className="mx-auto max-w-7xl px-md py-2xl md:px-lg">
            <div className="mb-lg flex items-end justify-between gap-md">
              <div className="flex flex-col gap-xs">
                <h2 className="font-heading text-3xl font-bold text-foreground-primary">
                  Mecánicos y talleres destacados
                </h2>
                <p className="font-body text-foreground-secondary">
                  Los mejor calificados cerca de ti.
                </p>
              </div>
              <Link
                href="/talleres"
                className="hidden items-center gap-xs font-caption text-sm font-semibold text-action-primary hover:underline sm:flex"
              >
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
              {destacados.map((taller) => (
                <TarjetaTaller key={taller.id} taller={taller} />
              ))}
            </div>
          </section>
        )}

        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" className="bg-surface-inverse">
          <div className="mx-auto max-w-7xl px-md py-2xl md:px-lg">
            <h2 className="mb-lg text-center font-heading text-3xl font-bold text-foreground-inverse">
              Cómo funciona
            </h2>
            <div className="grid gap-lg md:grid-cols-3">
              {COMO_FUNCIONA.map((paso) => (
                <div
                  key={paso.n}
                  className="flex flex-col items-center gap-sm rounded-2xl border border-white/10 p-lg text-center"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary font-heading text-xl font-bold text-foreground-inverse">
                    {paso.n}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-foreground-inverse">
                    {paso.titulo}
                  </h3>
                  <p className="font-body text-sm text-foreground-inverse-secondary">
                    {paso.texto}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-xl flex justify-center">
              <Link
                href="/solicitar"
                className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }))}
              >
                <MessageCircle size={20} /> Solicitar ayuda ahora
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SOSFloatingButton />
    </>
  );
}
