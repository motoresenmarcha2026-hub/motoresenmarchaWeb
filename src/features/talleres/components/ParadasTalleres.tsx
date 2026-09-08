import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck, ChevronRight } from "lucide-react";
import { cn, enlaceWhatsApp, formatearDistancia } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { BadgeDisponibilidad } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { especialidadMeta } from "../mock";
import type { Taller } from "../types";

/**
 * Los talleres como paradas de una línea, no como tarjetas iguales.
 *
 * La tesis del mundo dice "cada taller una parada", así que la parada más
 * cercana manda la composición con su propia plancha y el resto corre como
 * renglones reglados sobre el riel. Una rejilla de tres tarjetas idénticas
 * es justo la topología que el contrato rechaza por nombre.
 */
export function ParadasTalleres({ talleres }: { talleres: Taller[] }) {
  if (talleres.length === 0) return null;

  /*
    La parada principal se lleva una plancha enorme, así que no puede ser
    simplemente la primera de la lista: un registro a medio llenar —sin foto,
    sin calificación— acabaría siendo lo más prominente de la página. Se
    elige la primera ficha que tenga con qué sostener ese tamaño y, si
    ninguna lo tiene, todas corren como renglones.
  */
  const iLider = talleres.findIndex(
    (t) => Boolean(t.fotoUrl) && (t.rating > 0 || t.verificado)
  );
  const lider = iLider >= 0 ? talleres[iLider] : null;
  const resto = lider ? talleres.filter((t) => t.id !== lider.id) : talleres;

  return (
    <div className="border-2 border-border-primary bg-surface-card">
      {/* ── La parada principal ── */}
      {lider && (
      <article className="group/lider grid gap-0 md:grid-cols-[minmax(0,38%)_1fr]">
        <div className="relative min-h-[13rem] overflow-hidden border-b-2 border-border-primary bg-surface-inverse md:border-b-0 md:border-r-2">
          {lider.fotoUrl ? (
            <>
              <Image
                src={lider.fotoUrl}
                alt={`Taller ${lider.nombre}`}
                fill
                sizes="(max-width: 768px) 100vw, 38vw"
                className="plancha-foto object-cover"
              />
              <span aria-hidden className="plancha-foto-trama absolute inset-0" />
            </>
          ) : (
            <span aria-hidden className="plancha-foto-trama absolute inset-0" />
          )}
          {/* Cuña de geometría fija: entra igual en toda plancha */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-28 w-40 bg-emergency"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          />
          <span className="absolute left-0 top-sm">
            <BadgeDisponibilidad estado={lider.disponibilidad} />
          </span>
        </div>

        <div className="flex flex-col gap-sm p-md">
          <div className="flex flex-wrap items-start justify-between gap-sm">
            <div className="min-w-0">
              <h3 className="font-heading text-3xl font-extrabold uppercase leading-none text-foreground-primary">
                {lider.nombre}
              </h3>
              <p className="mt-1 font-body text-sm text-foreground-secondary">
                {lider.mecanicoPrincipal}
              </p>
            </div>
            {lider.verificado && (
              <span className="inline-flex shrink-0 items-center gap-xs bg-surface-inverse px-sm py-1 font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-inverse">
                <ShieldCheck size={12} aria-hidden /> Verificado
              </span>
            )}
          </div>

          <Rating valor={lider.rating} numResenas={lider.numResenas} />

          <div className="flex flex-wrap gap-xs">
            {lider.especialidades.slice(0, 4).map((e) => (
              <Tag key={e}>{especialidadMeta(e).label}</Tag>
            ))}
          </div>

          <p className="flex items-center gap-xs font-body text-sm text-foreground-secondary">
            <MapPin size={14} aria-hidden className="shrink-0" />
            <span className="min-w-0 truncate">{lider.ubicacion.direccion}</span>
          </p>

          {/* Sin coordenadas no hay medición: "0 m · 0 min" es ruido, no dato */}
          {lider.distanciaKm > 0 && (
            <div className="-mx-md flex items-center justify-between gap-sm bg-surface-inverse px-md py-1.5">
              <span className="cifras font-heading text-xs font-extrabold uppercase tracking-[0.12em] text-foreground-inverse">
                {formatearDistancia(lider.distanciaKm)}
              </span>
              <span aria-hidden className="h-[2px] flex-1 bg-emergency-plancha/60" />
              <span className="cifras font-heading text-xs font-extrabold uppercase tracking-[0.12em] text-foreground-inverse">
                {lider.etaMin} min
              </span>
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-sm pt-xs">
            <a
              href={enlaceWhatsApp(
                lider.whatsapp,
                `Hola ${lider.nombre}, necesito ayuda con mi vehículo.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "whatsapp", size: "sm" }))}
            >
              {/* TODO: conectar a Supabase — registrar el contacto */}
              WhatsApp
            </a>
            <Link
              href={`/talleres/${lider.id}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Ver perfil
            </Link>
          </div>
        </div>
      </article>
      )}

      {/* ── Las paradas siguientes, sobre el riel ── */}
      {resto.length > 0 && (
        <ul className="border-t-2 border-border-primary">
          {resto.map((t) => (
            <li
              key={t.id}
              className="group/parada relative border-b-2 border-border-primary transition-colors last:border-b-0 hover:bg-surface-page"
            >
              {/*
                El renglón entero es el enlace, y el botón de WhatsApp va
                como hermano posicionado encima. Así ninguno queda anidado
                dentro del otro y los dos conservan su área de toque real.
              */}
              <Link
                href={`/talleres/${t.id}`}
                className="flex items-center gap-md py-3 pl-md pr-md sm:pr-[calc(8.5rem+var(--sos-invade))]"
              >
                <span
                  aria-hidden
                  className="h-3 w-3 shrink-0 border-[3px] border-emergency bg-surface-card transition-colors group-hover/parada:bg-emergency"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-lg font-extrabold uppercase leading-none text-foreground-primary transition-colors group-hover/parada:text-emergency">
                    {t.nombre}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-sm gap-y-0.5">
                    <Rating valor={t.rating} numResenas={t.numResenas} size={13} />
                    {/*
                      Distancia y ETA no se esconden en celular: son la prueba
                      del producto y el celular en la calle es la escena
                      primaria, no la reducida.
                    */}
                    {t.distanciaKm > 0 && (
                      <span className="cifras font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-primary">
                        {formatearDistancia(t.distanciaKm)}
                        <span aria-hidden className="px-xs text-foreground-secondary">
                          ·
                        </span>
                        {t.etaMin} min
                      </span>
                    )}
                    <span className="hidden truncate font-body text-sm text-foreground-secondary sm:inline">
                      {t.especialidades
                        .slice(0, 2)
                        .map((e) => especialidadMeta(e).label)
                        .join(" · ")}
                    </span>
                  </span>
                </span>
                <ChevronRight
                  size={18}
                  aria-hidden
                  className="shrink-0 text-emergency transition-transform duration-150 ease-press group-hover/parada:translate-x-1"
                />
                {/* El botón de WhatsApp va como hermano posicionado; el
                    renglón le reserva el espacio con su padding derecho. */}
              </Link>

              {/* El contacto es el producto: cada parada lo ofrece directo */}
              <a
                href={enlaceWhatsApp(
                  t.whatsapp,
                  `Hola ${t.nombre}, necesito ayuda con mi vehículo.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contactar a ${t.nombre} por WhatsApp`}
                className={cn(
                  buttonVariants({ variant: "whatsapp", size: "sm" }),
                  // En celular baja a su propia franja; en escritorio se
                  // queda a la derecha pero fuera de --zona-sos, que es donde
                  // flota el sello de emergencia.
                  "relative z-10 mx-md mb-3 w-[calc(100%-2rem)] justify-center",
                  "sm:absolute sm:right-[calc(1rem+var(--sos-invade))] sm:top-1/2 sm:mx-0 sm:mb-0 sm:w-auto sm:-translate-y-1/2"
                )}
              >
                {/* TODO: conectar a Supabase — registrar el contacto */}
                WhatsApp
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
