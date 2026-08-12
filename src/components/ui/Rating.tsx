import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  /** Valor 0–5 (puede ser decimal). */
  valor: number;
  /** Número de reseñas (opcional, se muestra entre paréntesis). */
  numResenas?: number;
  size?: number;
  /** Muestra el valor numérico junto a las estrellas. */
  mostrarValor?: boolean;
  className?: string;
}

/** Calificación con estrellas (llenado proporcional). */
export function Rating({
  valor,
  numResenas,
  size = 16,
  mostrarValor = true,
  className,
}: RatingProps) {
  return (
    <div className={cn("inline-flex items-center gap-xs", className)}>
      <div className="flex items-center" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          const lleno = valor >= i + 1;
          const parcial = !lleno && valor > i;
          return (
            <span key={i} className="relative">
              <Star size={size} className="text-border-subtle" />
              {(lleno || parcial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: lleno ? "100%" : `${(valor - i) * 100}%` }}
                >
                  <Star
                    size={size}
                    className="fill-action-urgent text-action-urgent"
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {mostrarValor && (
        <span className="font-data text-sm font-semibold text-foreground-primary">
          {valor.toFixed(1)}
        </span>
      )}
      {numResenas !== undefined && (
        <span className="font-caption text-sm text-foreground-secondary">
          ({numResenas})
        </span>
      )}
      <span className="sr-only">
        {valor.toFixed(1)} de 5 estrellas
        {numResenas !== undefined ? `, ${numResenas} reseñas` : ""}
      </span>
    </div>
  );
}
