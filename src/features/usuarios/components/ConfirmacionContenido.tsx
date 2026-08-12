"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

type Tipo = "conductor" | "taller" | "solicitud";

const CONTENIDO: Record<
  Tipo,
  {
    titulo: string;
    mensaje: string;
    ctas: { href: string; label: string; variant: "primary" | "outline" }[];
  }
> = {
  conductor: {
    titulo: "¡Cuenta creada!",
    mensaje:
      "Tu cuenta de conductor está lista. Ya puedes buscar mecánicos y pedir ayuda cuando la necesites.",
    ctas: [
      { href: "/talleres", label: "Explorar talleres", variant: "primary" },
      { href: "/", label: "Ir al inicio", variant: "outline" },
    ],
  },
  taller: {
    titulo: "¡Taller registrado!",
    mensaje:
      "Tu taller ya forma parte del marketplace. Entra a tu panel para gestionar solicitudes y citas.",
    ctas: [
      { href: "/panel/solicitudes", label: "Ir a mi panel", variant: "primary" },
      { href: "/", label: "Ir al inicio", variant: "outline" },
    ],
  },
  solicitud: {
    titulo: "¡Solicitud enviada!",
    mensaje:
      "El mecánico recibió tu solicitud y te contactará por WhatsApp. Mantén tu teléfono a la mano.",
    ctas: [
      { href: "/citas/mis-citas", label: "Ver mis citas", variant: "primary" },
      { href: "/talleres", label: "Ver más talleres", variant: "outline" },
    ],
  },
};

export function ConfirmacionContenido() {
  const params = useSearchParams();
  const tipo = (params.get("tipo") as Tipo | null) ?? "solicitud";
  const c = CONTENIDO[tipo] ?? CONTENIDO.solicitud;

  return (
    <div className="mx-auto flex max-w-[36rem] flex-col items-center gap-md rounded-2xl border border-border-subtle bg-surface-card p-2xl text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-status-available/15 text-status-available">
        <CheckCircle2 size={40} />
      </span>
      <h1 className="font-heading text-3xl font-extrabold text-foreground-primary">
        {c.titulo}
      </h1>
      <p className="font-body text-foreground-secondary">{c.mensaje}</p>
      <div className="mt-sm flex w-full flex-col gap-sm sm:flex-row sm:justify-center">
        {c.ctas.map((cta) => (
          <Link
            key={cta.href}
            href={cta.href}
            className={cn(buttonVariants({ variant: cta.variant, size: "lg" }))}
          >
            {cta.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
