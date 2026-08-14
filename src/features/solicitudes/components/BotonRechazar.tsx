"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { rechazarSolicitud } from "../actions";

/** Botón que rechaza una solicitud (UPDATE estado='rechazado' vía server action). */
export function BotonRechazar({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          setError(false);
          const res = await rechazarSolicitud(id);
          if (res.error) setError(true);
        })
      }
      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
    >
      <X size={16} /> {pending ? "Rechazando…" : error ? "Reintentar" : "Rechazar"}
    </button>
  );
}
