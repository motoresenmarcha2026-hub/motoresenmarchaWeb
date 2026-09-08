import Image from "next/image";
import Link from "next/link";
import { Search, Siren, ArrowRight, MapPin, ChevronRight } from "lucide-react";
import { cn, formatearDistancia } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RielDeAvance } from "@/components/layout/RielDeAvance";
import { SOSFloatingButton } from "@/components/layout/SOSFloatingButton";
import { buttonVariants } from "@/components/ui/Button";
import { Icono } from "@/components/ui/Icono";
import { ParadasTalleres } from "@/features/talleres/components/ParadasTalleres";
import { getTalleresDestacados } from "@/features/talleres/data";
import { TarjetaRefaccion } from "@/features/refacciones/components/TarjetaRefaccion";
import { getRefaccionesDestacadas } from "@/features/refacciones/data";
import { TIPOS_PROBLEMA } from "@/features/solicitudes/mock";

const COMO_FUNCIONA = [
  {
    verbo: "Describe",
    titulo: "Describe tu problema",
    texto: "Cuéntanos qué le pasa a tu auto y marca tu ubicación.",
  },
  {
    verbo: "Conecta",
    titulo: "Conecta por WhatsApp",
    texto: "Contacta al instante al mecánico o taller más cercano.",
  },
  {
    verbo: "Arranca",
    titulo: "Recibe ayuda rápida",
    texto: "El mecánico llega a ti o te agenda una cita. Sin complicaciones.",
  },
];

export default async function HomePage() {
  const [destacados, refaccionesDestacadas] = await Promise.all([
    getTalleresDestacados(),
    getRefaccionesDestacadas(),
  ]);

  // El taller más cercano: un taller real de la base, no un dato inventado.
  const siguiente = destacados[0];

  return (
    <>
      <Header />
      <RielDeAvance />

      <main className="flex-1 pb-[5.5rem]">
        {/* ═══════════════ VAGÓN 0 — PRIMERA PANTALLA ═══════════════ */}
        <section className="grano-papel relative overflow-hidden border-b-2 border-border-primary bg-surface-page">
          {/*
            La cuña de composición: entra desde el borde izquierdo y cruza la
            sección entera por debajo del texto y de la plancha fotográfica.
            No es un tinte dentro de la foto — es el elemento que empuja.
          */}
          <span
            aria-hidden
            className="tinta-roja pointer-events-none absolute inset-x-0 bottom-0 top-[32%] lg:top-[62%]"
            style={{ clipPath: "polygon(0 18%, 100% 0, 100% 100%, 0 100%)" }}
          />

          <div className="relative mx-auto grid max-w-7xl gap-xl px-md pb-xl pt-lg md:px-lg lg:grid-cols-[1.1fr_minmax(0,40%)] lg:gap-2xl lg:pb-2xl">
            <div className="flex flex-col justify-center gap-lg">
              {/* Versales anguladas, a sangre por el borde izquierdo */}
              {/*
                Un solo eje para todo el bloque. Rotar cada línea un grado
                distinto se lee como error de render; el mundo pone bloques
                enteros sobre un eje, y el escalonado a la izquierda lo
                refuerza en vez de contradecirlo.
              */}
              <h1 className="sangra-izq origin-top-left -rotate-[3.6deg] font-heading text-[clamp(3rem,10.5vw,6.75rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.015em] text-foreground-primary">
                <span className="block">Ayuda</span>
                <span className="block pl-[0.08em]">mecánica</span>
                <span className="block pl-[0.16em]">confiable</span>
              </h1>

              <p className="max-w-[32rem] font-body text-lg leading-snug text-foreground-primary">
                A un mensaje de WhatsApp de distancia. Conecta con mecánicos y
                talleres cercanos en segundos, ya sea una revisión o una
                emergencia en la carretera.
              </p>

              {/* Dos acciones. El buscador vive en el vagón de servicios. */}
              <div className="flex flex-wrap items-center gap-md">
                <Link
                  href="/solicitar?prioridad=emergencia"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-surface-inverse text-foreground-inverse hover:bg-action-primary-dark"
                  )}
                >
                  <Siren size={20} aria-hidden /> Pedir ayuda ahora
                </Link>
                <Link
                  href="/talleres"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "text-foreground-inverse hover:text-foreground-inverse hover:decoration-foreground-inverse"
                  )}
                >
                  Ver talleres <ArrowRight size={18} aria-hidden />
                </Link>
              </div>

              {/* El taller más cercano — columna izquierda, dato real */}
              {siguiente && (
                <div className="max-w-[26rem] border-2 border-border-primary bg-surface-card">
                  <div className="flex items-center gap-sm border-b-2 border-border-primary bg-surface-inverse px-md py-1.5">
                    <span
                      aria-hidden
                      className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-emergency"
                    />
                    <span className="font-heading text-xs font-extrabold uppercase tracking-[0.14em] text-foreground-inverse">
                      El taller más cercano
                    </span>
                  </div>
                  <Link
                    href={`/talleres/${siguiente.id}`}
                    className="group/parada block px-md py-sm transition-colors hover:bg-surface-page"
                  >
                    <p className="font-heading text-2xl font-extrabold uppercase leading-none text-foreground-primary group-hover/parada:text-emergency">
                      {siguiente.nombre}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-sm font-body text-sm text-foreground-secondary">
                      <span className="inline-flex items-center gap-xs">
                        <MapPin size={13} aria-hidden />
                        <span className="cifras">
                          {formatearDistancia(siguiente.distanciaKm)}
                        </span>
                      </span>
                      <span aria-hidden className="text-foreground-secondary">·</span>
                      <span className="cifras">{siguiente.etaMin} min</span>
                      <span aria-hidden className="text-foreground-secondary">·</span>
                      <span className="truncate">{siguiente.ubicacion.ciudad}</span>
                    </p>
                  </Link>
                </div>
              )}
            </div>

            {/* Plancha fotográfica: gris con trama de medios tonos, filo angulado */}
            <div className="relative flex min-h-[15rem] flex-col lg:min-h-[26rem]">
              <div className="filo-cuna relative flex-1 overflow-hidden border-2 border-border-primary bg-surface-inverse">
                {siguiente?.fotoUrl ? (
                  <Image
                    src={siguiente.fotoUrl}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="plancha-foto object-cover"
                    priority
                  />
                ) : null}
                <span
                  aria-hidden
                  className="plancha-foto-trama absolute inset-0"
                  style={{ ["--trama" as string]: "7px" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ VAGÓN 1 — MANIFIESTO DE FALLAS ═══════════ */}
        <section className="border-b-2 border-border-primary bg-surface-page">
          <div className="mx-auto max-w-7xl px-md py-xl md:px-lg">
            <h2 className="font-heading text-3xl font-extrabold uppercase leading-none text-foreground-primary md:text-4xl">
              Elige el servicio que necesitas
            </h2>
            <p className="mt-xs max-w-[36rem] font-body text-foreground-secondary">
              Selecciona el tipo de problema y te conectamos con el especialista
              indicado.
            </p>

            {/* Buscador: aquí es donde de verdad sirve buscar un servicio */}
            <form action="/talleres" className="mt-lg flex max-w-[34rem] gap-sm">
              <div className="relative flex-1">
                <Search
                  size={18}
                  aria-hidden
                  className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-foreground-secondary"
                />
                <input
                  name="q"
                  placeholder="¿Qué servicio necesitas?"
                  aria-label="Buscar servicio o taller"
                  className="peer h-12 w-full rounded-none border-2 border-border-primary bg-surface-card pl-11 pr-md font-body text-base text-foreground-primary placeholder:text-foreground-secondary focus:border-emergency focus:outline-none"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 border-b-[10px] border-l-[10px] border-b-border-primary border-l-transparent peer-focus:border-b-emergency"
                />
              </div>
              <button type="submit" className={cn(buttonVariants())}>
                Buscar
              </button>
            </form>

            {/* Manifiesto: opciones reglados, no una rejilla de tarjetas iguales */}
            <div className="mt-lg border-2 border-border-primary bg-surface-card">
              <div className="flex items-center justify-between gap-md border-b-2 border-border-primary bg-surface-inverse px-md py-1.5">
                <span className="font-heading text-xs font-extrabold uppercase tracking-[0.14em] text-foreground-inverse">
                  ¿Qué le pasa a tu auto?
                </span>
                <span className="cifras font-heading text-xs font-bold uppercase tracking-[0.14em] text-foreground-inverse-secondary">
                  {TIPOS_PROBLEMA.slice(0, 10).length} opciones
                </span>
              </div>
              <ul className="md:grid md:grid-cols-2">
                {TIPOS_PROBLEMA.slice(0, 10).map((t, i) => (
                  <li
                    key={t.key}
                    className={cn(
                      "border-b-2 border-border-primary last:border-b-0",
                      i % 2 === 0 && "md:border-r-2",
                      i >= 8 && "md:border-b-0"
                    )}
                  >
                    <Link
                      href={`/solicitar?tipo=${t.key}`}
                      className="group/renglon flex items-center gap-md px-md py-3 transition-colors hover:bg-emergency"
                    >
                      <Icono
                        nombre={t.icono}
                        size={22}
                        className="shrink-0 text-foreground-primary transition-colors group-hover/renglon:text-foreground-inverse"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-base font-extrabold uppercase leading-none tracking-[0.04em] text-foreground-primary transition-colors group-hover/renglon:text-foreground-inverse">
                          {t.label}
                        </span>
                        <span className="mt-0.5 block truncate font-body text-sm text-foreground-secondary transition-colors group-hover/renglon:text-foreground-inverse">
                          {t.descripcion}
                        </span>
                      </span>
                      <ChevronRight
                        size={18}
                        aria-hidden
                        className="shrink-0 text-emergency transition-[color,transform] duration-150 ease-press group-hover/renglon:translate-x-1 group-hover/renglon:text-foreground-inverse"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════════ BANDA SOS — la plancha de pintura roja ═══════════ */}
        <section className="relative overflow-hidden border-b-2 border-border-primary bg-emergency">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-emergency-dark"
            style={{ clipPath: "polygon(0 0, 100% 0, 58% 100%, 0 100%)" }}
          />
          <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-lg px-md py-xl md:flex-row md:items-center md:justify-between md:px-lg">
            <div className="flex items-start gap-md">
              <Siren size={44} aria-hidden className="mt-1 shrink-0 text-foreground-inverse" />
              <div>
                <h2 className="font-heading text-3xl font-extrabold uppercase leading-none text-foreground-inverse md:text-4xl">
                  ¿Tu auto se quedó en la carretera?
                </h2>
                <p className="mt-sm max-w-[34rem] font-body text-foreground-inverse">
                  Activa el SOS y contacta ayuda de emergencia de inmediato por
                  WhatsApp.
                </p>
              </div>
            </div>
            <Link
              href="/solicitar?prioridad=emergencia"
              className={cn(
                buttonVariants({ size: "lg" }),
                "shrink-0 bg-surface-inverse text-foreground-inverse hover:bg-action-primary-dark"
              )}
            >
              <Siren size={20} aria-hidden /> Solicitar ayuda urgente
            </Link>
          </div>
        </section>

        {/* ═══════════════ VAGÓN 2 — TALLERES ═══════════════ */}
        {destacados.length > 0 && (
          <section className="border-b-2 border-border-primary bg-surface-page">
            <div className="mx-auto max-w-7xl px-md py-xl md:px-lg">
              <div className="mb-lg flex flex-wrap items-end justify-between gap-md">
                <div>
                  <h2 className="font-heading text-3xl font-extrabold uppercase leading-none text-foreground-primary md:text-4xl">
                    Mecánicos y talleres destacados
                  </h2>
                  <p className="mt-xs font-body text-foreground-secondary">
                    Los mejor calificados cerca de ti.
                  </p>
                </div>
                <Link
                  href="/talleres"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  Ver todos <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
              <ParadasTalleres talleres={destacados} />
            </div>
          </section>
        )}

        {/* ═══════════════ VAGÓN 3 — REFACCIONES ═══════════════ */}
        <section className="border-b-2 border-border-primary bg-surface-card">
          <div className="mx-auto max-w-7xl px-md py-xl md:px-lg">
            <div className="mb-lg flex flex-wrap items-end justify-between gap-md">
              <div>
                <h2 className="font-heading text-3xl font-extrabold uppercase leading-none text-foreground-primary md:text-4xl">
                  Refacciones destacadas
                </h2>
                <p className="mt-xs font-body text-foreground-secondary">
                  Autopartes de vendedores verificados.
                </p>
              </div>
              {refaccionesDestacadas.length > 0 && (
                <Link
                  href="/refacciones"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  Ver todas <ArrowRight size={16} aria-hidden />
                </Link>
              )}
            </div>

            {refaccionesDestacadas.length > 0 ? (
              <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
                {refaccionesDestacadas.map((r) => (
                  <TarjetaRefaccion key={r.id} refaccion={r} />
                ))}
              </div>
            ) : (
              /* Aún no hay refacciones declarado. Un hueco silencioso se lee como error. */
              <div className="border-2 border-dashed border-border-primary bg-surface-page px-md py-xl text-center">
                <p className="font-heading text-xl font-extrabold uppercase leading-none text-foreground-primary">
                  Aún no hay refacciones
                </p>
                <p className="mx-auto mt-sm max-w-[30rem] font-body text-foreground-secondary">
                  Todavía no hay refacciones publicadas. En cuanto los vendedores
                  suban su inventario, aparecerán aquí.
                </p>
                <Link
                  href="/registro/vendedor"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-md")}
                >
                  Vender refacciones <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════ VAGÓN 4 — LA RUTA ═══════════ */}
        <section id="como-funciona" className="relative overflow-hidden bg-surface-inverse">
          <div className="relative mx-auto max-w-7xl px-md py-2xl md:px-lg">
            <h2 className="font-heading text-3xl font-extrabold uppercase leading-none text-foreground-inverse md:text-4xl">
              Cómo funciona
            </h2>

            {/* La ruta: tres paradas sobre una línea, no tres columnas en una caja */}
            <ol className="mt-2xl grid gap-xl md:grid-cols-3">
              {COMO_FUNCIONA.map((paso, i) => (
                <li key={paso.verbo} className="relative">
                  {/* El riel entre paradas */}
                  <span
                    aria-hidden
                    className="absolute left-0 right-0 top-[9px] hidden h-[2px] bg-emergency-plancha/50 md:block"
                  />
                  {i === COMO_FUNCIONA.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute right-0 top-[9px] hidden h-[2px] w-1/2 bg-surface-inverse md:block"
                    />
                  )}
                  {/* La parada */}
                  <span
                    aria-hidden
                    className="relative block h-5 w-5 border-[3px] border-emergency-plancha bg-surface-inverse"
                  />
                  <p className="mt-md font-heading text-4xl font-extrabold uppercase leading-none text-emergency-plancha">
                    {paso.verbo}.
                  </p>
                  <h3 className="mt-sm font-heading text-base font-bold uppercase tracking-[0.08em] text-foreground-inverse">
                    {paso.titulo}
                  </h3>
                  <p className="mt-xs max-w-[24rem] font-body text-sm leading-relaxed text-foreground-inverse-secondary">
                    {paso.texto}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer />
      <SOSFloatingButton />
    </>
  );
}
