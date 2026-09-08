import Image from "next/image";
import Link from "next/link";
import { Store, ImageOff } from "lucide-react";
import { cn, enlaceWhatsApp, formatearPrecio } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { categoriaMeta } from "../mock";
import type { Refaccion } from "../types";

/**
 * Plancha de refacción: la pieza del catálogo.
 * Misma gramática que la plancha de taller — fotografía tramada bajo cuña de
 * geometría fija, filete de tinta, y banda de medición abajo con el precio en
 * cifras tabulares, que es medición y no adorno.
 */
export function TarjetaRefaccion({
  refaccion,
  className,
}: {
  refaccion: Refaccion;
  className?: string;
}) {
  const enStock = refaccion.stock > 0;

  return (
    <article
      className={cn(
        "group/pieza flex flex-col rounded-none border-2 border-border-primary bg-surface-card",
        "transition-[border-color,transform] duration-200 ease-drive",
        "hover:-translate-y-0.5 hover:border-emergency focus-within:border-emergency",
        className
      )}
    >
      {/* Plancha fotográfica */}
      <div className="relative h-44 w-full overflow-hidden border-b-2 border-border-primary bg-surface-inverse">
        {refaccion.fotoUrl ? (
          <Image
            src={refaccion.fotoUrl}
            alt={refaccion.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="plancha-foto object-cover transition-[filter] duration-300 ease-drive group-hover/pieza:grayscale-0 group-hover/pieza:contrast-100"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-foreground-inverse-secondary">
            <ImageOff size={30} aria-hidden />
          </span>
        )}
        <span aria-hidden className="plancha-foto-trama absolute inset-0" />
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-24 w-36 bg-emergency"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />

        <span
          className={cn(
            "absolute right-sm top-sm inline-flex items-center px-sm py-1 font-heading text-xs font-extrabold uppercase tracking-[0.1em]",
            enStock
              ? "bg-status-available text-foreground-inverse"
              : "bg-status-busy text-foreground-inverse"
          )}
        >
          {enStock ? "En stock" : "Sin stock"}
        </span>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col gap-sm px-md pb-md pt-sm">
        <h3 className="font-heading text-xl font-extrabold uppercase leading-none text-foreground-primary">
          {refaccion.nombre}
        </h3>

        <div className="flex flex-wrap gap-xs">
          {refaccion.categoria && (
            <Tag>{categoriaMeta(refaccion.categoria).label}</Tag>
          )}
          {refaccion.marca && <Tag>{refaccion.marca}</Tag>}
        </div>

        {refaccion.modeloCompatible && (
          <p className="font-body text-sm text-foreground-secondary">
            Compatible: {refaccion.modeloCompatible}
          </p>
        )}

        {refaccion.vendedorNombre && (
          <p className="flex items-center gap-xs font-body text-sm text-foreground-secondary">
            <Store size={14} aria-hidden className="shrink-0" />
            <span className="min-w-0 truncate">{refaccion.vendedorNombre}</span>
          </p>
        )}

        {/* Banda de medición: el precio es una cifra, no un adorno */}
        <div className="-mx-md mt-auto flex items-center justify-between gap-sm bg-surface-inverse px-md py-1.5">
          <span className="font-heading text-xs font-extrabold uppercase tracking-[0.12em] text-foreground-inverse-secondary">
            Precio
          </span>
          <span aria-hidden className="h-[2px] flex-1 bg-emergency-plancha/60" />
          <span className="cifras font-heading text-base font-extrabold uppercase tracking-[0.06em] text-foreground-inverse">
            {formatearPrecio(refaccion.precio)}
          </span>
        </div>

        {/* Acciones */}
        <div className="flex gap-sm pt-xs">
          {refaccion.vendedorWhatsapp && (
            <a
              href={enlaceWhatsApp(
                refaccion.vendedorWhatsapp,
                `Hola, me interesa la refacción "${refaccion.nombre}" que vi en Motores en Marcha.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "whatsapp", size: "sm", fullWidth: true })
              )}
            >
              WhatsApp
            </a>
          )}
          <Link
            href={`/refacciones/${refaccion.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm", fullWidth: true })
            )}
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
