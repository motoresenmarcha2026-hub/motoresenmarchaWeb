import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

/** Estado vacío reutilizable para secciones sin contenido todavía. */
export function EstadoVacio({
  icono: Icono,
  titulo,
  descripcion,
  cta,
}: {
  icono: LucideIcon;
  titulo: string;
  descripcion: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center rounded-none border-2 border-dashed border-border-primary bg-surface-card p-2xl text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-none border-2 border-border-primary bg-surface-page text-foreground-primary">
        <Icono size={28} />
      </span>
      <h1 className="mt-md font-heading text-xl font-extrabold uppercase text-foreground-primary">
        {titulo}
      </h1>
      <p className="mt-xs max-w-[28rem] font-body text-sm text-foreground-secondary">
        {descripcion}
      </p>
      {cta && (
        <Link
          href={cta.href}
          className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-md")}
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
