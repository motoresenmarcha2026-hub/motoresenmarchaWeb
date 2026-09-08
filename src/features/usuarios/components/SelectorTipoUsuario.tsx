import Link from "next/link";
import { Car, Wrench, Package, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

const TIPOS = [
  {
    href: "/registro/conductor",
    icono: Car,
    titulo: "Soy conductor",
    texto:
      "Busca mecánicos, pide ayuda de emergencia y agenda citas para tu vehículo.",
    cta: "Regístrate como conductor",
    variante: "primary" as const,
  },
  {
    href: "/registro/taller",
    icono: Wrench,
    titulo: "Soy taller / mecánico",
    texto:
      "Recibe solicitudes, gestiona citas y haz crecer tu taller en el marketplace.",
    cta: "Regístrate como taller",
    variante: "emergency" as const,
  },
  {
    href: "/registro/vendedor",
    icono: Package,
    titulo: "Soy vendedor de refacciones",
    texto:
      "Publica tu catálogo de autopartes y recibe pedidos de conductores y talleres por WhatsApp.",
    cta: "Regístrate como vendedor",
    variante: "primary" as const,
  },
];

/** Selección del tipo de cuenta: conductor, taller o vendedor. */
export function SelectorTipoUsuario() {
  return (
    <div className="grid gap-md sm:grid-cols-3">
      {TIPOS.map((t) => {
        const Icono = t.icono;
        return (
          <div
            key={t.href}
            className="flex flex-col items-start gap-md border-2 border-border-primary bg-surface-card p-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center border-2 border-border-primary bg-surface-page text-foreground-primary">
              <Icono size={24} aria-hidden />
            </span>
            <div>
              <h2 className="font-heading text-xl font-extrabold uppercase leading-none text-foreground-primary">
                {t.titulo}
              </h2>
              <p className="mt-sm font-body text-sm leading-relaxed text-foreground-secondary">
                {t.texto}
              </p>
            </div>
            <Link
              href={t.href}
              className={cn(
                buttonVariants({ variant: t.variante, fullWidth: true }),
                "mt-auto"
              )}
            >
              {t.cta} <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
