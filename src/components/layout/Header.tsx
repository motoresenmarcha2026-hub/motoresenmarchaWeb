"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthNav } from "@/components/layout/AuthNav";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/talleres", label: "Mecánicos" },
  { href: "/refacciones", label: "Refacciones" },
  { href: "/solicitar", label: "Solicitar ayuda" },
  { href: "/#como-funciona", label: "Cómo funciona" },
];

/** Marca. La cuña roja bajo el nombre es la firma del mundo. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group/logo flex min-h-11 items-center gap-sm", className)}
    >
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        className="shrink-0"
        priority
      />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-lg font-extrabold uppercase tracking-[0.04em] text-foreground-inverse">
          Motores en Marcha
        </span>
        <span
          aria-hidden
          className="mt-[3px] h-[3px] w-full bg-emergency transition-[width] duration-300 ease-drive group-hover/logo:w-2/3"
          style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }}
        />
      </span>
    </Link>
  );
}

/**
 * Barra de navegación del mundo: plancha de tinta negra con la cuña roja
 * entrando desde la izquierda y bloque rojo marcando la parada actual.
 *
 * El corte sigue en `lg` y no en `md` a propósito: en iPad vertical el nav
 * no cabe sin romperse.
 */
export function Header() {
  const [abierto, setAbierto] = React.useState(false);
  const pathname = usePathname();

  // Un enlace con ancla nunca es "la parada actual": `/#como-funciona`
  // marcaba activo en `/` al mismo tiempo que Inicio.
  const esActiva = (href: string) =>
    href.includes("#") ? false : href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-emergency bg-surface-inverse">
      {/* La cuña entra desde la izquierda, detrás de la marca */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-64 bg-emergency/90"
        style={{ clipPath: "polygon(0 0, 100% 0, 62% 100%, 0 100%)" }}
      />
      <span aria-hidden className="trama-papel pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-md px-md md:px-lg">
        <Logo />

        <nav className="hidden items-stretch self-stretch lg:flex">
          {NAV.map((item) => {
            const activa = esActiva(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activa ? "page" : undefined}
                className={cn(
                  "flex items-center whitespace-nowrap px-md font-heading text-sm font-bold uppercase tracking-[0.08em] transition-colors",
                  activa
                    ? "bg-emergency text-foreground-inverse"
                    : "text-foreground-inverse-secondary hover:bg-white/10 hover:text-foreground-inverse"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex">
          <AuthNav variant="desktop" />
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center text-foreground-inverse lg:hidden"
          onClick={() => setAbierto((v) => !v)}
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
        >
          {abierto ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {abierto && (
        <div className="relative border-t-2 border-emergency bg-surface-inverse px-md pb-md lg:hidden">
          <nav className="flex flex-col py-sm">
            {NAV.map((item) => {
              const activa = esActiva(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setAbierto(false)}
                  aria-current={activa ? "page" : undefined}
                  className={cn(
                    "border-l-[3px] px-md py-3 font-heading text-base font-bold uppercase tracking-[0.06em] transition-colors",
                    activa
                      ? "border-emergency bg-emergency/15 text-foreground-inverse"
                      : "border-transparent text-foreground-inverse-secondary hover:border-emergency hover:text-foreground-inverse"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <AuthNav variant="mobile" onNavigate={() => setAbierto(false)} />
        </div>
      )}
    </header>
  );
}
