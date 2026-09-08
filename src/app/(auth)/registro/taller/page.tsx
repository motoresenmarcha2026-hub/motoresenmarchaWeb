import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormRegistroTaller } from "@/features/usuarios/components/FormRegistroTaller";

export default function RegistroTallerPage() {
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
          Regístrate como taller
        </h1>
        <p className="font-body text-foreground-secondary">
          Publica tu taller en el marketplace y empieza a recibir solicitudes.
        </p>
      </div>

      <div className="border-2 border-border-primary bg-surface-card p-lg">
        <FormRegistroTaller />
      </div>
    </div>
  );
}
