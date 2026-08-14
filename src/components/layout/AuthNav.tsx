"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { cerrarSesion } from "@/features/usuarios/actions";

type Rol = "conductor" | "taller" | "admin";

/** Lee la sesión de Supabase en el cliente y se actualiza en vivo. */
function useSesion() {
  const [user, setUser] = React.useState<User | null>(null);
  const [rol, setRol] = React.useState<Rol | null>(null);
  const [listo, setListo] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();

    async function cargar(u: User | null) {
      setUser(u);
      if (u) {
        const { data } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", u.id)
          .single();
        setRol((data?.rol as Rol) ?? null);
      } else {
        setRol(null);
      }
      setListo(true);
    }

    supabase.auth.getUser().then(({ data }) => cargar(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => cargar(session?.user ?? null));

    return () => subscription.unsubscribe();
  }, []);

  return { user, rol, listo };
}

/** Acciones de sesión del Header (desktop y móvil). */
export function AuthNav({
  variant = "desktop",
  onNavigate,
}: {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const { user, rol, listo } = useSesion();
  const cuentaHref =
    rol === "admin"
      ? "/admin"
      : rol === "taller"
        ? "/panel/cuenta"
        : "/cuenta";

  // Evita parpadeo entre estados mientras carga la sesión.
  if (!listo) return <div className="h-9" aria-hidden />;

  if (variant === "mobile") {
    return user ? (
      <div className="flex flex-col gap-sm pt-sm">
        <Link
          href={cuentaHref}
          onClick={onNavigate}
          className={cn(
            buttonVariants({ variant: "outline", size: "md", fullWidth: true }),
            "border-white/30 text-foreground-inverse hover:bg-white hover:text-foreground-primary"
          )}
        >
          Mi cuenta
        </Link>
        <form action={cerrarSesion}>
          <button
            type="submit"
            className={cn(buttonVariants({ variant: "emergency", size: "md", fullWidth: true }))}
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    ) : (
      <div className="flex flex-col gap-sm pt-sm">
        <Link
          href="/login"
          onClick={onNavigate}
          className={cn(
            buttonVariants({ variant: "outline", size: "md", fullWidth: true }),
            "border-white/30 text-foreground-inverse hover:bg-white hover:text-foreground-primary"
          )}
        >
          Iniciar sesión
        </Link>
        <Link
          href="/registro"
          onClick={onNavigate}
          className={cn(buttonVariants({ variant: "emergency", size: "md", fullWidth: true }))}
        >
          Registrarse
        </Link>
      </div>
    );
  }

  // Desktop
  return user ? (
    <div className="flex items-center gap-sm">
      <Link
        href={cuentaHref}
        className="flex items-center gap-xs font-body text-sm font-medium text-foreground-inverse-secondary transition-colors hover:text-foreground-inverse"
      >
        <UserRound size={16} />
        Mi cuenta
      </Link>
      <form action={cerrarSesion}>
        <button
          type="submit"
          className="flex items-center gap-xs rounded-lg px-sm py-2 font-body text-sm font-medium text-foreground-inverse-secondary transition-colors hover:text-foreground-inverse"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
          Salir
        </button>
      </form>
    </div>
  ) : (
    <div className="flex items-center gap-sm">
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
  );
}
