import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { cn, enlaceWhatsApp, formatearDistancia } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { BadgeDisponibilidad } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { especialidadMeta } from "../mock";
import type { Taller } from "../types";

/**
 * Tarjeta de taller con la geometría del componente del mundo: la plancha
 * fotográfica se corta en diagonal, la esquina roja entra por arriba a la
 * izquierda, y abajo corre la banda de tinta con la medición. Al enfocar o
 * pasar, el filete se vuelve rojo — el estado activo del sistema.
 */
export function TarjetaTaller({
  taller,
  className,
}: {
  taller: Taller;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group/plancha flex flex-col rounded-none border-2 border-border-primary bg-surface-card",
        "transition-[border-color,transform] duration-200 ease-drive",
        "hover:-translate-y-0.5 hover:border-emergency focus-within:border-emergency",
        className
      )}
    >
      {/* Plancha fotográfica, cortada en diagonal */}
      <div
        className="relative h-44 w-full overflow-hidden bg-surface-inverse"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 86%, 0 100%)" }}
      >
        {taller.fotoUrl ? (
          <Image
            src={taller.fotoUrl}
            alt={`Taller ${taller.nombre}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="plancha-foto object-cover transition-[filter] duration-300 ease-drive group-hover/plancha:grayscale-0 group-hover/plancha:contrast-100"
          />
        ) : null}
        <span aria-hidden className="plancha-foto-trama absolute inset-0" />

        {/*
          La cuña de la esquina, con geometría fija y tinta plena. Antes iba
          por multiplicación y su extensión la decidía la luminancia de la
          foto: una plancha clara salía casi entera roja y otra sin nada.
          Igual en toda tarjeta, y acotada para que la trama siga leyéndose.
        */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-24 w-36 bg-emergency"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />

        <span className="absolute left-0 top-sm">
          <BadgeDisponibilidad estado={taller.disponibilidad} />
        </span>

        {taller.verificado && (
          <span className="absolute right-sm top-sm inline-flex items-center gap-xs bg-surface-inverse px-sm py-1 font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-inverse">
            <ShieldCheck size={12} aria-hidden /> Verificado
          </span>
        )}
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col gap-sm px-md pb-md pt-sm">
        <div className="min-w-0">
          <h3 className="font-heading text-xl font-extrabold uppercase leading-none text-foreground-primary">
            {taller.nombre}
          </h3>
          <p className="mt-1 font-body text-sm text-foreground-secondary">
            {taller.mecanicoPrincipal}
          </p>
        </div>

        <Rating valor={taller.rating} numResenas={taller.numResenas} />

        <div className="flex flex-wrap gap-xs">
          {taller.especialidades.slice(0, 3).map((e) => (
            <Tag key={e}>{especialidadMeta(e).label}</Tag>
          ))}
        </div>

        <p className="flex items-center gap-xs font-body text-sm text-foreground-secondary">
          <MapPin size={14} aria-hidden className="shrink-0" />
          <span className="min-w-0 truncate">{taller.ubicacion.direccion}</span>
        </p>

        {/* Banda de tinta: la medición del renglón */}
        <div className="-mx-md flex items-center justify-between gap-sm bg-surface-inverse px-md py-1.5">
          <span className="cifras font-heading text-xs font-extrabold uppercase tracking-[0.12em] text-foreground-inverse">
            {formatearDistancia(taller.distanciaKm)}
          </span>
          <span aria-hidden className="h-[2px] flex-1 bg-emergency/50" />
          <span className="cifras font-heading text-xs font-extrabold uppercase tracking-[0.12em] text-foreground-inverse">
            {taller.etaMin} min
          </span>
        </div>

        {/* Acciones */}
        <div className="mt-auto flex gap-sm pt-xs">
          <a
            href={enlaceWhatsApp(
              taller.whatsapp,
              `Hola ${taller.nombre}, necesito ayuda con mi vehículo.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "whatsapp", size: "sm", fullWidth: true })
            )}
          >
            {/* TODO: conectar a Supabase — registrar el contacto */}
            WhatsApp
          </a>
          <Link
            href={`/talleres/${taller.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm", fullWidth: true })
            )}
          >
            Ver perfil
          </Link>
        </div>
      </div>
    </article>
  );
}
