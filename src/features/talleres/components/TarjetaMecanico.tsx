import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BadgeDisponibilidad } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { especialidadMeta } from "../mock";
import type { Taller } from "../types";

/** Renglón compacto de mecánico — variante horizontal sobre el riel. */
export function TarjetaMecanico({
  taller,
  className,
}: {
  taller: Taller;
  className?: string;
}) {
  return (
    <Link
      href={`/talleres/${taller.id}`}
      className={cn(
        "group/mec flex items-center gap-md rounded-none border-2 border-border-primary bg-surface-card p-sm transition-colors hover:border-emergency",
        className
      )}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden border-2 border-border-primary bg-surface-inverse">
        {taller.avatarUrl ? (
          <Image
            src={taller.avatarUrl}
            alt=""
            fill
            sizes="64px"
            className="plancha-foto object-cover"
          />
        ) : null}
        <span
          aria-hidden
          className="plancha-foto-trama absolute inset-0"
          style={{ ["--trama" as string]: "4px" }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-sm">
          <h3 className="truncate font-heading text-base font-extrabold uppercase leading-none text-foreground-primary">
            {taller.mecanicoPrincipal}
          </h3>
          <BadgeDisponibilidad estado={taller.disponibilidad} />
        </div>
        <p className="mt-0.5 truncate font-body text-sm text-foreground-secondary">
          {taller.nombre} · {especialidadMeta(taller.especialidades[0]).label}
        </p>
        <Rating valor={taller.rating} numResenas={taller.numResenas} size={14} />
      </div>
    </Link>
  );
}
