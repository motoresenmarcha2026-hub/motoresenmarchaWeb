import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Tono del suelo sobre el que se imprime. Sobre plancha oscura la tinta
 * negra desaparece: el valor medía 1:1 en la ficha del taller.
 */
type TonoRating = "tinta" | "papel";

interface RatingProps {
  /** Valor 0–5 (puede ser decimal). */
  valor: number;
  /** Número de reseñas (opcional, se muestra entre paréntesis). */
  numResenas?: number;
  size?: number;
  /** Muestra el valor numérico junto a las estrellas. */
  mostrarValor?: boolean;
  /** `papel` para imprimir sobre plancha oscura. */
  tono?: TonoRating;
  className?: string;
}

/** Calificación con estrellas (llenado proporcional). */
export function Rating({
  valor,
  numResenas,
  size = 16,
  mostrarValor = true,
  tono = "tinta",
  className,
}: RatingProps) {
  const sobrePapel = tono === "papel";
  return (
    <div className={cn("inline-flex items-center gap-xs", className)}>
      <div className="flex items-center" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          const lleno = valor >= i + 1;
          const parcial = !lleno && valor > i;
          return (
            <span key={i} className="relative">
              <Star
                size={size}
                className={sobrePapel ? "text-foreground-inverse-secondary" : "text-border-subtle"}
              />
              {(lleno || parcial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: lleno ? "100%" : `${(valor - i) * 100}%` }}
                >
                  <Star
                    size={size}
                    className={
                      sobrePapel
                        ? "fill-emergency-plancha text-emergency-plancha"
                        : "fill-action-urgent text-action-urgent"
                    }
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {mostrarValor && (
        <span
          className={cn(
            "cifras font-heading text-sm font-extrabold",
            sobrePapel ? "text-foreground-inverse" : "text-foreground-primary"
          )}
        >
          {valor.toFixed(1)}
        </span>
      )}
      {numResenas !== undefined && (
        <span
          className={cn(
            "cifras font-body text-sm",
            sobrePapel ? "text-foreground-inverse-secondary" : "text-foreground-secondary"
          )}
        >
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
