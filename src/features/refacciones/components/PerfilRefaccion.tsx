import Image from "next/image";
import Link from "next/link";
import { ImageOff, Store, MapPin } from "lucide-react";
import { cn, enlaceWhatsApp, formatearPrecio } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { categoriaMeta } from "../mock";
import type { Refaccion } from "../types";

/**
 * Ficha de la pieza. Plancha fotográfica tramada a la izquierda y, a la
 * derecha, la ficha técnica como renglones reglados: el precio va en la
 * banda de tinta con cifras tabulares, porque es medición.
 */
export function PerfilRefaccion({ refaccion }: { refaccion: Refaccion }) {
  const enStock = refaccion.stock > 0;

  return (
    <div className="mx-auto max-w-7xl px-md py-lg md:px-lg">
      <nav className="mb-md font-heading text-xs font-bold uppercase tracking-[0.12em] text-foreground-secondary">
        <Link
          href="/refacciones"
          className="underline-offset-4 hover:text-emergency-dark hover:underline hover:decoration-2"
        >
          Refacciones
        </Link>
        <span aria-hidden className="px-xs">
          /
        </span>
        <span className="text-foreground-primary">{refaccion.nombre}</span>
      </nav>

      <div className="grid gap-lg md:grid-cols-2">
        {/* Plancha fotográfica */}
        <div className="relative aspect-square w-full overflow-hidden border-2 border-border-primary bg-surface-inverse">
          {refaccion.fotoUrl ? (
            <Image
              src={refaccion.fotoUrl}
              alt={refaccion.nombre}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="plancha-foto object-cover"
              priority
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-foreground-inverse-secondary">
              <ImageOff size={44} aria-hidden />
            </span>
          )}
          <span aria-hidden className="plancha-foto-trama absolute inset-0" />
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-40 w-56 bg-emergency"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          />
        </div>

        {/* Ficha técnica */}
        <div className="flex flex-col gap-md">
          <div className="flex flex-wrap gap-xs">
            {refaccion.categoria && (
              <Tag>{categoriaMeta(refaccion.categoria).label}</Tag>
            )}
            {refaccion.marca && <Tag>{refaccion.marca}</Tag>}
          </div>

          <h1 className="font-heading text-4xl font-extrabold uppercase leading-none text-foreground-primary">
            {refaccion.nombre}
          </h1>

          {/* Banda de medición: precio y existencias */}
          <div className="flex flex-wrap items-center justify-between gap-sm border-2 border-border-primary bg-surface-inverse px-md py-2">
            <span className="cifras font-heading text-3xl font-extrabold uppercase leading-none tracking-[0.02em] text-foreground-inverse">
              {formatearPrecio(refaccion.precio)}
            </span>
            <span
              className={cn(
                "inline-flex items-center px-sm py-1 font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-inverse",
                enStock ? "bg-status-available" : "bg-status-busy"
              )}
            >
              <span className="cifras">
                {enStock ? `${refaccion.stock} disponibles` : "Sin stock"}
              </span>
            </span>
          </div>

          {(refaccion.modeloCompatible || refaccion.descripcion) && (
            <dl className="border-2 border-border-primary bg-surface-card">
              {refaccion.modeloCompatible && (
                <div className="border-b-2 border-border-primary px-md py-2">
                  <dt className="font-heading text-xs font-extrabold uppercase tracking-[0.12em] text-foreground-secondary">
                    Compatible con
                  </dt>
                  <dd className="mt-0.5 font-body text-foreground-primary">
                    {refaccion.modeloCompatible}
                  </dd>
                </div>
              )}
              {refaccion.descripcion && (
                <div className="px-md py-2">
                  <dt className="font-heading text-xs font-extrabold uppercase tracking-[0.12em] text-foreground-secondary">
                    Descripción
                  </dt>
                  <dd className="mt-0.5 max-w-[65ch] font-body leading-relaxed text-foreground-primary">
                    {refaccion.descripcion}
                  </dd>
                </div>
              )}
            </dl>
          )}

          {/* Vendedor */}
          <div className="border-2 border-border-primary bg-surface-card">
            <div className="border-b-2 border-border-primary bg-surface-inverse px-md py-1.5">
              <span className="font-heading text-xs font-extrabold uppercase tracking-[0.14em] text-foreground-inverse">
                Vendedor
              </span>
            </div>
            <div className="px-md py-sm">
              <p className="flex items-center gap-xs font-heading text-lg font-extrabold uppercase leading-none text-foreground-primary">
                <Store size={16} aria-hidden className="text-emergency" />
                {refaccion.vendedorNombre ?? "Vendedor"}
              </p>
              {refaccion.vendedorCiudad && (
                <p className="mt-1 flex items-center gap-xs font-body text-sm text-foreground-secondary">
                  <MapPin size={14} aria-hidden /> {refaccion.vendedorCiudad}
                </p>
              )}
            </div>
          </div>

          {refaccion.vendedorWhatsapp && (
            <a
              href={enlaceWhatsApp(
                refaccion.vendedorWhatsapp,
                `Hola, me interesa la refacción "${refaccion.nombre}" que vi en Motores en Marcha.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "whatsapp", size: "lg", fullWidth: true })
              )}
            >
              Contactar por WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
