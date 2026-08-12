import Link from "next/link";
import { Car, Wrench, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

/** Selección del tipo de cuenta: conductor o taller. */
export function SelectorTipoUsuario() {
  return (
    <div className="grid gap-md sm:grid-cols-2">
      {/* Conductor */}
      <div className="flex flex-col items-start gap-md rounded-2xl border border-border-subtle bg-surface-card p-lg">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-action-primary/10 text-action-primary">
          <Car size={24} />
        </span>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground-primary">
            Soy conductor
          </h2>
          <p className="mt-xs font-body text-sm text-foreground-secondary">
            Busca mecánicos, pide ayuda de emergencia y agenda citas para tu
            vehículo.
          </p>
        </div>
        <Link
          href="/registro/conductor"
          className={cn(
            buttonVariants({ variant: "primary", fullWidth: true }),
            "mt-auto"
          )}
        >
          Regístrate como conductor <ArrowRight size={18} />
        </Link>
      </div>

      {/* Taller */}
      <div className="flex flex-col items-start gap-md rounded-2xl border border-border-subtle bg-surface-card p-lg">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emergency/10 text-emergency">
          <Wrench size={24} />
        </span>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground-primary">
            Soy taller / mecánico
          </h2>
          <p className="mt-xs font-body text-sm text-foreground-secondary">
            Recibe solicitudes, gestiona citas y haz crecer tu taller en el
            marketplace.
          </p>
        </div>
        <Link
          href="/registro/taller"
          className={cn(
            buttonVariants({ variant: "emergency", fullWidth: true }),
            "mt-auto"
          )}
        >
          Regístrate como taller <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
