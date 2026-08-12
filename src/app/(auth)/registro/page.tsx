import Link from "next/link";
import { SelectorTipoUsuario } from "@/features/usuarios/components/SelectorTipoUsuario";

export default function RegistroTipoPage() {
  return (
    <div className="flex flex-col gap-lg">
      <div className="text-center">
        <span className="font-caption text-sm font-semibold uppercase tracking-wide text-accent-primary">
          Crear cuenta
        </span>
        <h1 className="mt-xs font-heading text-3xl font-extrabold text-foreground-primary">
          ¿Cómo quieres usar la plataforma?
        </h1>
        <p className="mt-xs font-body text-foreground-secondary">
          Elige el tipo de cuenta que mejor se ajusta a ti. Puedes cambiarlo
          después.
        </p>
      </div>

      <SelectorTipoUsuario />

      <p className="text-center font-caption text-sm text-foreground-secondary">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-action-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
