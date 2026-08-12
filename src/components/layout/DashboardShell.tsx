"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { NAVS, type NavKey } from "@/features/usuarios/nav";

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

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-page">
        <div className="mx-auto flex max-w-7xl flex-col gap-lg px-md py-lg md:flex-row md:px-lg">
          {/* Sidebar */}
          <aside className="md:w-64 md:shrink-0">
            <div className="rounded-2xl border border-border-subtle bg-surface-card p-md">
              {/* Perfil */}
              <div className="flex flex-col items-center gap-sm border-b border-border-subtle pb-md text-center">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-surface-page">
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
                  <p className="font-heading font-bold text-foreground-primary">
                    {profile.nombre}
                  </p>
                  <p className="font-caption text-xs text-foreground-secondary">
                    {profile.subtitulo}
                  </p>
                </div>
                {profile.badge && (
                  <span className="rounded-full bg-status-available/15 px-sm py-xs font-caption text-xs font-semibold text-status-available">
                    {profile.badge}
                  </span>
                )}
              </div>

              {/* Navegación */}
              <nav className="flex gap-xs overflow-x-auto pt-md md:flex-col md:overflow-visible">
                {navItems.map((item) => {
                  const activo = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex shrink-0 items-center gap-sm rounded-lg px-sm py-2.5 font-caption text-sm font-medium transition-colors",
                        activo
                          ? "bg-action-primary text-foreground-inverse"
                          : "text-foreground-secondary hover:bg-surface-page"
                      )}
                    >
                      <Icon size={18} />
                      <span className="whitespace-nowrap">{item.label}</span>
                      {item.badge ? (
                        <span
                          className={cn(
                            "ml-auto rounded-full px-1.5 text-xs font-bold",
                            activo
                              ? "bg-white/20"
                              : "bg-emergency text-foreground-inverse"
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
                <Link
                  href="/"
                  className="flex shrink-0 items-center gap-sm rounded-lg px-sm py-2.5 font-caption text-sm font-medium text-emergency transition-colors hover:bg-emergency/10"
                >
                  <LogOut size={18} />
                  <span className="whitespace-nowrap">Cerrar sesión</span>
                </Link>
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
