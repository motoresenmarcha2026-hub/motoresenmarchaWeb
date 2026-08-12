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
        className="absolute inset-0 bg-surface-inverse/60 backdrop-blur-sm"
        onClick={onCerrar}
      />
      <div
        className={cn(
          "relative z-10 max-h-[85vh] w-full max-w-[42rem] overflow-y-auto rounded-2xl bg-surface-card p-lg shadow-xl",
          className
        )}
      >
        <div className="mb-md flex items-center justify-between">
          {titulo && (
            <h2 className="font-heading text-xl font-bold text-foreground-primary">
              {titulo}
            </h2>
          )}
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="ml-auto rounded-full p-xs text-foreground-secondary hover:bg-surface-page"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
