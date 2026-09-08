"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo?: string;
  children: React.ReactNode;
  className?: string;
}

/** Modal / overlay accesible y controlado. */
export function Modal({
  abierto,
  onCerrar,
  titulo,
  children,
  className,
}: ModalProps) {
  React.useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
    >
      <div
        className="absolute inset-0 bg-surface-inverse/80"
        onClick={onCerrar}
      />
      <div
        className={cn(
          "relative z-10 max-h-[85vh] w-full max-w-[42rem] overflow-y-auto rounded-none border-2 border-border-primary bg-surface-card",
          className
        )}
      >
        <div className="flex items-center justify-between gap-md border-b-2 border-border-primary bg-surface-inverse pl-md">
          {titulo && (
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-[0.12em] text-foreground-inverse">
              {titulo}
            </h2>
          )}
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-none text-foreground-inverse transition-colors hover:bg-emergency"
          >
            <X size={20} aria-hidden />
          </button>
        </div>
        <div className="p-lg">{children}</div>
      </div>
    </div>
  );
}
