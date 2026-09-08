"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Chip de filtro en la voz del mundo: filete de tinta, esquina viva, y
 * plancha roja cuando está activo. Reemplaza la píldora `rounded-full`, que
 * era el único radio que los tokens no alcanzan.
 */
export function Chip({
  label,
  activo,
  onClick,
  className,
}: {
  label: string;
  activo: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={cn(
        "inline-flex h-11 shrink-0 items-center rounded-none border-2 px-md font-heading text-xs font-extrabold uppercase tracking-[0.1em] transition-colors",
        activo
          ? "border-emergency bg-emergency text-foreground-inverse"
          : "border-border-primary bg-surface-card text-foreground-primary hover:bg-surface-page",
        className
      )}
    >
      {label}
    </button>
  );
}
