"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Selector interactivo de estrellas (1–5) para calificar. */
export function EstrellasCalificacion({
  valor,
  onChange,
  size = 40,
}: {
  valor: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const activo = hover || valor;

  return (
    <div className="flex items-center gap-xs" role="radiogroup" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valor === n}
          aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={cn(
              n <= activo
                ? "fill-action-urgent text-action-urgent"
                : "text-border-subtle"
            )}
          />
        </button>
      ))}
    </div>
  );
}
