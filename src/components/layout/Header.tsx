"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthNav } from "@/components/layout/AuthNav";

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
      <Image
        src="/logo.png"
        alt="Motores en Marcha"
        width={40}
        height={40}
        className="rounded-full"
        priority
      />
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
        <div className="hidden md:flex">
          <AuthNav variant="desktop" />
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
          <AuthNav variant="mobile" onNavigate={() => setAbierto(false)} />
        </div>
      )}
    </header>
  );
}
