import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormRegistroConductor } from "@/features/usuarios/components/FormRegistroConductor";

export default function RegistroConductorPage() {
  return (
    <div className="flex flex-col gap-lg">
      <div>
        <Link
          href="/registro"
          className="inline-flex items-center gap-xs font-caption text-sm text-foreground-secondary hover:text-foreground-primary"
        >
          <ArrowLeft size={16} /> Volver
        </Link>
        <h1 className="mt-sm font-heading text-3xl font-extrabold text-foreground-primary">
          Regístrate como conductor
        </h1>
        <p className="font-body text-foreground-secondary">
          Crea tu cuenta para pedir ayuda mecánica y agendar citas.
        </p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface-card p-lg">
        <FormRegistroConductor />
      </div>
    </div>
  );
}
