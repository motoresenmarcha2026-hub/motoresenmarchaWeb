import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormRegistroConductor } from "@/features/usuarios/components/FormRegistroConductor";

export default function RegistroConductorPage() {
  return (
    <div className="flex flex-col gap-lg">
      <div>
        <Link
          href="/registro"
          className="inline-flex min-h-11 items-center gap-xs font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-secondary hover:text-foreground-primary"
        >
          <ArrowLeft size={16} /> Volver
        </Link>
        <h1 className="mt-sm font-heading text-4xl font-extrabold uppercase leading-none text-foreground-primary md:text-5xl">
          Regístrate como conductor
        </h1>
        <p className="font-body text-foreground-secondary">
          Crea tu cuenta para pedir ayuda mecánica y agendar citas.
        </p>
      </div>

      <div className="border-2 border-border-primary bg-surface-card p-lg">
        <FormRegistroConductor />
      </div>
    </div>
  );
}
