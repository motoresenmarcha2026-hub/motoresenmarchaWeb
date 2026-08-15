import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck, MessageCircle, Calendar } from "lucide-react";
import { cn, enlaceWhatsApp } from "@/lib/utils";
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

/** Cabecera + detalles del perfil de un taller/mecánico. */
export function PerfilTaller({ taller }: { taller: Taller }) {
  return (
    <>
      {/* Hero oscuro */}
      <section className="bg-surface-inverse">
        <div className="mx-auto max-w-7xl px-md py-lg md:px-lg">
          <nav className="mb-md font-caption text-sm text-foreground-inverse-secondary">
            <Link href="/talleres" className="hover:text-foreground-inverse">
              Talleres
            </Link>{" "}
            / <span className="text-foreground-inverse">{taller.nombre}</span>
          </nav>

          <div className="grid items-center gap-xl md:grid-cols-2">
            <div className="flex flex-col gap-md">
              <BadgeDisponibilidad
                estado={taller.disponibilidad}
                className="w-fit"
              />
              <h1 className="font-heading text-4xl font-extrabold text-foreground-inverse">
                {taller.nombre}
              </h1>
              <p className="font-body text-foreground-inverse-secondary">
                {taller.mecanicoPrincipal}
              </p>
              <div className="flex flex-wrap items-center gap-md">
                <Rating valor={taller.rating} numResenas={taller.numResenas} />
                {taller.verificado && (
                  <span className="inline-flex items-center gap-xs font-caption text-sm text-status-available">
                    <ShieldCheck size={16} /> Verificado
                  </span>
                )}
                <span className="inline-flex items-center gap-xs font-caption text-sm text-foreground-inverse-secondary">
                  <MapPin size={16} /> {taller.ubicacion.ciudad}
                </span>
              </div>
              <div className="flex flex-wrap gap-xs">
                {taller.especialidades.map((e) => (
                  <Tag
                    key={e}
                    className="border-white/20 bg-white/5 text-foreground-inverse-secondary"
                  >
                    {especialidadMeta(e).label}
                  </Tag>
                ))}
              </div>

              {/* Acciones */}
              <div className="mt-sm flex flex-col gap-sm sm:flex-row">
                <a
                  href={enlaceWhatsApp(
                    taller.whatsapp,
                    `Hola ${taller.nombre}, vi tu perfil en Motores en Marcha.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "whatsapp" }))}
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <Link
                  href={`/citas/agendar/${taller.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-white/30 text-foreground-inverse hover:bg-white hover:text-foreground-primary"
                  )}
                >
                  <Calendar size={18} /> Agendar cita
                </Link>
                <Link
                  href={`/solicitar?taller=${taller.id}`}
                  className={cn(buttonVariants({ variant: "primary" }))}
                >
                  Solicitar servicio
                </Link>
              </div>
            </div>

            {/* Foto */}
            <div className="relative hidden h-80 overflow-hidden rounded-3xl md:block">
              <Image
                src={taller.fotoUrl}
                alt={taller.nombre}
                fill
                sizes="50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sobre + disponibilidad */}
      <section className="mx-auto max-w-7xl px-md py-2xl md:px-lg">
        {/* 2 cols en tablet (la card de horarios necesita ~300px), 3 en desktop */}
        <div className="grid gap-xl md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-md font-heading text-2xl font-bold text-foreground-primary">
              Sobre {taller.mecanicoPrincipal}
            </h2>
            <p className="font-body text-foreground-secondary">
              {taller.descripcion}
            </p>
          </div>

          {/* Disponibilidad */}
          <aside className="rounded-2xl border border-border-subtle bg-surface-card p-lg">
            <h3 className="mb-md font-heading text-lg font-bold text-foreground-primary">
              Disponibilidad
            </h3>
            <ul className="flex flex-col gap-xs">
              {taller.horarios.map((h) => (
                <li
                  key={h.dia}
                  className="flex items-center justify-between gap-md font-caption text-sm"
                >
                  <span className="min-w-0 truncate text-foreground-secondary">
                    {DIAS[h.dia]}
                  </span>
                  <span className="shrink-0 whitespace-nowrap font-data tabular-nums text-foreground-primary">
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
