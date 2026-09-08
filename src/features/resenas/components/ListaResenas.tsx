import Image from "next/image";
import { Rating } from "@/components/ui/Rating";
import { formatearFecha } from "@/lib/utils";
import type { Resena } from "../types";

/**
 * Reseñas como entradas regladas dentro de una sola plancha, no como una
 * rejilla de tarjetas iguales: se leen en orden y escanean mejor en celular.
 */
export function ListaResenas({ resenas }: { resenas: Resena[] }) {
  if (resenas.length === 0) {
    return (
      <p className="border-2 border-dashed border-border-primary bg-surface-card px-md py-lg text-center font-body text-foreground-secondary">
        Este taller aún no tiene reseñas.
      </p>
    );
  }

  return (
    <ul className="border-2 border-border-primary bg-surface-card">
      {resenas.map((r) => (
        <li
          key={r.id}
          className="flex flex-col gap-sm border-b-2 border-border-primary px-md py-md last:border-b-0 sm:flex-row sm:gap-md"
        >
          <div className="flex shrink-0 items-center gap-sm sm:w-44 sm:flex-col sm:items-start">
            {r.autorAvatarUrl && (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden border-2 border-border-primary bg-surface-inverse">
                <Image
                  src={r.autorAvatarUrl}
                  alt=""
                  fill
                  sizes="40px"
                  className="plancha-foto object-cover"
                />
                <span
                  aria-hidden
                  className="plancha-foto-trama absolute inset-0"
                  style={{ ["--trama" as string]: "4px" }}
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-heading text-sm font-extrabold uppercase leading-none tracking-[0.04em] text-foreground-primary">
                {r.autor}
              </p>
              <p className="cifras mt-0.5 font-body text-xs text-foreground-secondary">
                {formatearFecha(r.createdAt)}
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <Rating valor={r.rating} mostrarValor={false} size={14} />
            <p className="mt-xs max-w-[65ch] font-body leading-relaxed text-foreground-primary">
              {r.comentario}
            </p>
            {r.servicio && (
              <p className="mt-sm font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-secondary">
                {r.servicio}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
