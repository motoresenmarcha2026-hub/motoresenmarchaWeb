import Link from "next/link";
import { SelectorTipoUsuario } from "@/features/usuarios/components/SelectorTipoUsuario";

export default function RegistroTipoPage() {
  return (
    <div className="flex flex-col gap-lg">
      <div className="text-center">
        <span className="font-heading text-xs font-extrabold uppercase tracking-[0.14em] text-emergency-dark">
          Crear cuenta
        </span>
        <h1 className="mt-xs font-heading text-4xl font-extrabold uppercase leading-none text-foreground-primary md:text-5xl">
          ¿Cómo quieres usar la plataforma?
        </h1>
        <p className="mt-xs font-body text-foreground-secondary">
          Elige el tipo de cuenta que mejor se ajusta a ti. Puedes cambiarlo
          después.
        </p>
      </div>

      <SelectorTipoUsuario />

      <p className="text-center font-body text-sm text-foreground-secondary">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="inline-flex min-h-11 items-center font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-primary underline-offset-4 hover:text-emergency-dark hover:underline hover:decoration-2">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
