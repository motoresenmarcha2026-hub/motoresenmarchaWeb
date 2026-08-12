"use client";

import * as React from "react";
import Link from "next/link";
import { Wrench, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/talleres", label: "Mecánicos" },
  { href: "/solicitar", label: "Solicitar ayuda" },
  { href: "/#como-funciona", label: "Cómo funciona" },
];

/** Logo de marca. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-sm font-heading", className)}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emergency text-foreground-inverse">
        <Wrench size={18} />
      </span>
      <span className="text-lg font-extrabold uppercase tracking-tight text-foreground-inverse">
        Motores en Marcha
      </span>
    </Link>
  );
}

/** Header principal (barra oscura). Responsive con menú móvil. */
export function Header() {
  const [abierto, setAbierto] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface-inverse">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-md px-md md:px-lg">
        <Logo />

        {/* Nav desktop */}
        <nav className="hidden items-center gap-lg md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-sm font-medium text-foreground-inverse-secondary transition-colors hover:text-foreground-inverse"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Acciones desktop */}
        <div className="hidden items-center gap-sm md:flex">
          <Link
            href="/login"
            className="font-body text-sm font-medium text-foreground-inverse-secondary transition-colors hover:text-foreground-inverse"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className={cn(buttonVariants({ variant: "emergency", size: "sm" }))}
          >
            Registrarse
          </Link>
        </div>

        {/* Toggle móvil */}
        <button
          type="button"
          className="text-foreground-inverse md:hidden"
          onClick={() => setAbierto((v) => !v)}
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
        >
          {abierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {abierto && (
        <div className="border-t border-white/10 bg-surface-inverse px-md pb-md md:hidden">
          <nav className="flex flex-col gap-xs py-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAbierto(false)}
                className="rounded-lg px-sm py-2.5 font-body text-sm font-medium text-foreground-inverse-secondary hover:bg-white/5 hover:text-foreground-inverse"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-sm pt-sm">
            <Link
              href="/login"
              onClick={() => setAbierto(false)}
              className={cn(
                buttonVariants({ variant: "outline", size: "md", fullWidth: true }),
                "border-white/30 text-foreground-inverse hover:bg-white hover:text-foreground-primary"
              )}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              onClick={() => setAbierto(false)}
              className={cn(
                buttonVariants({ variant: "emergency", size: "md", fullWidth: true })
              )}
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
