import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { cn, enlaceWhatsApp, formatearDistancia } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { BadgeDisponibilidad, BadgeEta } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { especialidadMeta } from "../mock";
import type { Taller } from "../types";

/** Tarjeta de taller para el marketplace y la Home (Card/Taller Marketplace). */
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
        "flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Foto */}
      <div className="relative h-44 w-full">
        <Image
          src={taller.fotoUrl}
          alt={`Taller ${taller.nombre}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute left-sm top-sm">
          <BadgeDisponibilidad estado={taller.disponibilidad} className="bg-surface-card/90 backdrop-blur" />
        </div>
        {taller.verificado && (
          <span className="absolute right-sm top-sm inline-flex items-center gap-xs rounded-full bg-action-primary/90 px-sm py-xs text-xs font-semibold text-foreground-inverse backdrop-blur">
            <ShieldCheck size={12} /> Verificado
          </span>
        )}
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col gap-sm p-md">
        <div className="flex items-start justify-between gap-sm">
          <div>
            <h3 className="font-heading text-lg font-bold leading-tight text-foreground-primary">
              {taller.nombre}
            </h3>
            <p className="font-caption text-sm text-foreground-secondary">
              {taller.mecanicoPrincipal}
            </p>
          </div>
          <BadgeEta minutos={taller.etaMin} />
        </div>

        <Rating valor={taller.rating} numResenas={taller.numResenas} />

        {/* Especialidades */}
        <div className="flex flex-wrap gap-xs">
          {taller.especialidades.slice(0, 3).map((e) => (
            <Tag key={e}>{especialidadMeta(e).label}</Tag>
          ))}
        </div>

        {/* Ubicación */}
        <p className="flex items-center gap-xs font-caption text-sm text-foreground-secondary">
          <MapPin size={14} className="shrink-0" />
          <span className="min-w-0 truncate">{taller.ubicacion.direccion}</span>
          <span className="shrink-0 whitespace-nowrap">
            · {formatearDistancia(taller.distanciaKm)}
          </span>
        </p>

        {/* Acciones */}
        <div className="mt-auto flex gap-sm pt-sm">
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
