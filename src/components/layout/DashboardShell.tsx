"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { NAVS, type NavKey } from "@/features/usuarios/nav";
import { cerrarSesion } from "@/features/usuarios/actions";

export interface DashboardProfile {
  nombre: string;
  subtitulo: string;
  avatarUrl?: string;
  badge?: string;
}

/**
 * Shell de dashboard con sidebar (perfil + navegación). Compartido por el
 * panel del taller y las pantallas de cuenta del conductor/admin.
 * Recibe `navKey` (no los items) para no cruzar componentes de íconos por el
 * boundary server→client.
 */
export function DashboardShell({
  profile,
  navKey,
  children,
}: {
  profile: DashboardProfile;
  navKey: NavKey;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = NAVS[navKey];
  const navRef = useRef<HTMLElement>(null);

  // En móvil la nav es una fila con scroll: asegurar que el ítem activo
  // quede visible al entrar (si no, el usuario no sabe dónde está).
  useEffect(() => {
    navRef.current
      ?.querySelector('[data-activo="true"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-page">
        <div className="mx-auto flex max-w-7xl flex-col gap-lg px-md py-lg md:flex-row md:px-lg">
          {/* Sidebar: plancha con barra de título en tinta, perfil y navegación en renglones reglados. */}
          <aside className="md:w-64 md:shrink-0">
            <div className="border-2 border-border-primary bg-surface-card">
              <div className="border-b-2 border-border-primary bg-surface-inverse px-md py-1.5">
                <h2 className="font-heading text-xs font-extrabold uppercase tracking-[0.14em] text-foreground-inverse">
                  Mi cuenta
                </h2>
              </div>

              {/* Perfil */}
              <div className="flex flex-col items-center gap-sm border-b-2 border-border-primary p-md text-center">
                <div className="relative h-16 w-16 overflow-hidden border-2 border-border-primary bg-surface-page">
                  {profile.avatarUrl && (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.nombre}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-heading text-sm font-extrabold uppercase leading-tight text-foreground-primary">
                    {profile.nombre}
                  </p>
                  <p className="font-body text-xs text-foreground-secondary">
                    {profile.subtitulo}
                  </p>
                </div>
                {profile.badge && (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-none px-sm py-1 font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-inverse",
                      badgeTono(profile.badge)
                    )}
                  >
                    {profile.badge}
                  </span>
                )}
              </div>

              {/* Navegación: fila con scroll en móvil (con máscara como
                  affordance), columna en md+. El renglón activo es la parada
                  actual del riel: plancha sólida, no tinte. */}
              <nav
                ref={navRef}
                className="flex overflow-x-auto [-webkit-overflow-scrolling:touch] [mask-image:linear-gradient(to_right,black_85%,transparent)] md:flex-col md:overflow-visible md:[mask-image:none]"
              >
                {navItems.map((item) => {
                  const activo = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      data-activo={activo || undefined}
                      className={cn(
                        "flex shrink-0 items-center gap-sm border-b border-border-subtle px-sm py-sm font-heading text-xs font-extrabold uppercase tracking-[0.06em] transition-colors",
                        activo
                          ? "bg-action-primary text-foreground-inverse"
                          : "text-foreground-secondary hover:bg-surface-page"
                      )}
                    >
                      <Icon size={16} />
                      <span className="whitespace-nowrap">{item.label}</span>
                      {item.badge ? (
                        <span
                          className={cn(
                            "ml-auto rounded-none px-1.5 py-0.5 font-heading text-xs font-extrabold text-foreground-inverse",
                            activo ? "bg-foreground-inverse/20" : "bg-emergency"
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
                <form action={cerrarSesion} className="shrink-0 md:contents">
                  <button
                    type="submit"
                    className="flex w-full shrink-0 items-center gap-sm px-sm py-sm font-heading text-xs font-extrabold uppercase tracking-[0.06em] text-foreground-secondary transition-colors hover:text-emergency"
                  >
                    <LogOut size={16} />
                    <span className="whitespace-nowrap">Cerrar sesión</span>
                  </button>
                </form>
              </nav>
            </div>
          </aside>

          {/* Contenido */}
          <section className="min-w-0 flex-1">{children}</section>
        </div>
      </main>
    </>
  );
}

/** Tono del sello de perfil según el texto (disponibilidad real o etiqueta de rol). */
function badgeTono(badge: string): string {
  if (badge === "Disponible" || badge === "Verificado") return "bg-status-available";
  if (badge === "Ocupado") return "bg-status-busy";
  return "bg-action-primary";
}
