import Image from "next/image";
import { Rating } from "@/components/ui/Rating";
import { formatearFecha } from "@/lib/utils";
import type { Resena } from "../types";

/** Lista de reseñas de clientes (grid de tarjetas). */
export function ListaResenas({ resenas }: { resenas: Resena[] }) {
  if (resenas.length === 0) {
    return (
      <p className="font-body text-sm text-foreground-secondary">
        Este taller aún no tiene reseñas.
      </p>
    );
  }

  return (
    <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
      {resenas.map((r) => (
        <article
          key={r.id}
          className="flex flex-col gap-sm rounded-xl border border-border-subtle bg-surface-card p-md"
        >
          <div className="flex items-center gap-sm">
            {r.autorAvatarUrl && (
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={r.autorAvatarUrl}
                  alt={r.autor}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-caption text-sm font-semibold text-foreground-primary">
                {r.autor}
              </p>
              <p className="font-caption text-xs text-foreground-secondary">
                {formatearFecha(r.createdAt)}
              </p>
            </div>
          </div>
          <Rating valor={r.rating} mostrarValor={false} size={14} />
          <p className="font-body text-sm text-foreground-secondary">
            {r.comentario}
          </p>
          {r.servicio && (
            <p className="mt-auto font-caption text-xs text-foreground-secondary">
              {r.servicio}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
