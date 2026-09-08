import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck, MessageCircle, Calendar } from "lucide-react";
import { cn, enlaceWhatsApp, formatearDistancia } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { BadgeDisponibilidad } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { especialidadMeta } from "../mock";
import type { Taller, Horario } from "../types";

const DIAS: Record<Horario["dia"], string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

/**
 * La ficha de la parada. Plancha de tinta arriba con la fotografía tramada,
 * y abajo el horario como tabla de itinerario — filas regladas y cifras
 * tabulares, que es como este mundo presenta una medición.
 */
export function PerfilTaller({ taller }: { taller: Taller }) {
  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-border-primary bg-surface-inverse">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-emergency"
          style={{ clipPath: "polygon(0 0, 100% 0, 55% 100%, 0 100%)" }}
        />

        <div className="relative mx-auto max-w-7xl px-md py-lg md:px-lg">
          <nav className="mb-md font-heading text-xs font-bold uppercase tracking-[0.12em] text-foreground-inverse-secondary">
            <Link
              href="/talleres"
              className="inline-flex min-h-11 items-center underline-offset-4 hover:text-foreground-inverse hover:underline hover:decoration-emergency-plancha hover:decoration-2"
            >
              Talleres
            </Link>
            <span aria-hidden className="px-xs">
              /
            </span>
            <span className="text-foreground-inverse">{taller.nombre}</span>
          </nav>

          <div className="grid items-center gap-xl md:grid-cols-2">
            <div className="flex flex-col gap-md">
              <BadgeDisponibilidad estado={taller.disponibilidad} className="w-fit" />

              <h1 className="font-heading text-4xl font-extrabold uppercase leading-none text-foreground-inverse md:text-5xl">
                {taller.nombre}
              </h1>
              <p className="font-body text-foreground-inverse-secondary">
                {taller.mecanicoPrincipal}
              </p>

              <div className="flex flex-wrap items-center gap-md">
                <Rating valor={taller.rating} numResenas={taller.numResenas} tono="papel" />
                {taller.verificado && (
                  <span className="inline-flex items-center gap-xs bg-surface-page px-sm py-1 font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-primary">
                    <ShieldCheck size={13} aria-hidden /> Verificado
                  </span>
                )}
                <span className="inline-flex items-center gap-xs font-body text-sm text-foreground-inverse-secondary">
                  <MapPin size={15} aria-hidden /> {taller.ubicacion.ciudad}
                </span>
                {taller.distanciaKm > 0 && (
                  <span className="cifras font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-inverse">
                    {formatearDistancia(taller.distanciaKm)}
                    <span aria-hidden className="px-xs text-foreground-inverse-secondary">
                      ·
                    </span>
                    {taller.etaMin} min
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-xs">
                {taller.especialidades.map((e) => (
                  <Tag
                    key={e}
                    className="border-foreground-inverse-secondary text-foreground-inverse"
                  >
                    {especialidadMeta(e).label}
                  </Tag>
                ))}
              </div>

              <div className="mt-sm flex flex-col gap-sm sm:flex-row sm:flex-wrap">
                <a
                  href={enlaceWhatsApp(
                    taller.whatsapp,
                    `Hola ${taller.nombre}, vi tu perfil en Motores en Marcha.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "whatsapp" }))}
                >
                  <MessageCircle size={18} aria-hidden /> WhatsApp
                </a>
                <Link
                  href={`/citas/agendar/${taller.id}`}
                  className={cn(
                    buttonVariants({ size: "md" }),
                    "bg-surface-page text-foreground-primary hover:bg-surface-card"
                  )}
                >
                  <Calendar size={18} aria-hidden /> Agendar cita
                </Link>
                <Link
                  href={`/solicitar?taller=${taller.id}`}
                  className={cn(buttonVariants({ variant: "ghost" }), "text-foreground-inverse hover:text-foreground-inverse")}
                >
                  Solicitar servicio
                </Link>
              </div>
            </div>

            {/* Plancha fotográfica */}
            <div className="filo-cuna relative hidden h-80 overflow-hidden border-2 border-border-subtle md:block">
              {taller.fotoUrl ? (
                <Image
                  src={taller.fotoUrl}
                  alt={taller.nombre}
                  fill
                  sizes="50vw"
                  className="plancha-foto object-cover"
                  priority
                />
              ) : null}
              <span aria-hidden className="plancha-foto-trama absolute inset-0" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-md py-2xl md:px-lg">
        <div className="grid gap-xl md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-extrabold uppercase leading-none text-foreground-primary">
              Sobre {taller.mecanicoPrincipal}
            </h2>
            <p className="mt-md max-w-[65ch] font-body leading-relaxed text-foreground-secondary">
              {taller.descripcion}
            </p>
          </div>

          {/* Itinerario */}
          <aside className="border-2 border-border-primary bg-surface-card">
            <div className="border-b-2 border-border-primary bg-surface-inverse px-md py-1.5">
              <h3 className="font-heading text-xs font-extrabold uppercase tracking-[0.14em] text-foreground-inverse">
                Disponibilidad
              </h3>
            </div>
            <ul>
              {taller.horarios.map((h) => (
                <li
                  key={h.dia}
                  className="flex items-center justify-between gap-md border-b border-border-subtle px-md py-2 last:border-b-0"
                >
                  <span className="min-w-0 truncate font-body text-sm text-foreground-secondary">
                    {DIAS[h.dia]}
                  </span>
                  <span
                    className={cn(
                      "cifras shrink-0 whitespace-nowrap font-heading text-xs font-extrabold uppercase tracking-[0.08em]",
                      h.cerrado ? "text-foreground-secondary" : "text-foreground-primary"
                    )}
                  >
                    {h.cerrado ? "Cerrado" : `${h.abre} – ${h.cierra}`}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
