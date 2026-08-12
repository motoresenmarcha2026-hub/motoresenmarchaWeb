import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BadgeDisponibilidad } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { especialidadMeta } from "../mock";
import type { Taller } from "../types";

/** Tarjeta compacta de mecánico (Mechanic Card) — variante horizontal. */
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
        "flex items-center gap-md rounded-xl border border-border-subtle bg-surface-card p-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
        <Image
          src={taller.avatarUrl}
          alt={taller.mecanicoPrincipal}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-sm">
          <h3 className="truncate font-heading text-base font-bold text-foreground-primary">
            {taller.mecanicoPrincipal}
          </h3>
          <BadgeDisponibilidad estado={taller.disponibilidad} />
        </div>
        <p className="truncate font-caption text-sm text-foreground-secondary">
          {taller.nombre} ·{" "}
          {especialidadMeta(taller.especialidades[0]).label}
        </p>
        <Rating valor={taller.rating} numResenas={taller.numResenas} size={14} />
      </div>
    </Link>
  );
}
