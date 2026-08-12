import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormRegistroTaller } from "@/features/usuarios/components/FormRegistroTaller";

export default function RegistroTallerPage() {
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
          Regístrate como taller
        </h1>
        <p className="font-body text-foreground-secondary">
          Publica tu taller en el marketplace y empieza a recibir solicitudes.
        </p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface-card p-lg">
        <FormRegistroTaller />
      </div>
    </div>
  );
}
