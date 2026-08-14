"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { limpiarDatosDemo } from "../actions";

/**
 * Botón de limpieza de datos de demostración con confirmación en dos pasos
 * (primer clic arma la acción, segundo clic la ejecuta).
 */
export function BotonLimpiarDemo({ demoCount }: { demoCount: number }) {
  const [armado, setArmado] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  if (demoCount === 0 && !resultado) {
    return (
      <p className="font-body text-sm text-foreground-secondary">
        No hay datos de demostración en la plataforma. 🎉
      </p>
    );
  }

  function ejecutar() {
    startTransition(async () => {
      const res = await limpiarDatosDemo();
      if (res.error) {
        setError(res.error);
      } else {
        setResultado(res.ok ?? "Limpieza completada.");
      }
      setArmado(false);
    });
  }

  if (resultado) {
    return (
      <p className="rounded-lg bg-status-available/10 px-md py-2.5 font-body text-sm text-status-available">
        {resultado}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      <p className="font-body text-sm text-foreground-secondary">
        Hay <strong>{demoCount} talleres de demostración</strong> (del seed,
        sin dueño real) con sus reseñas, citas y solicitudes asociadas. Los
        talleres y usuarios reales no se tocan.
      </p>

      {error && (
        <p className="rounded-lg bg-emergency/10 px-md py-2.5 font-caption text-sm text-emergency">
          {error}
        </p>
      )}

      {armado ? (
        <div className="flex flex-wrap items-center gap-sm rounded-xl border border-emergency/40 bg-emergency/10 p-md">
          <AlertTriangle size={18} className="shrink-0 text-emergency" />
          <p className="flex-1 font-caption text-sm font-semibold text-foreground-primary">
            ¿Seguro? Esta acción no se puede deshacer.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setArmado(false)}
            disabled={pendiente}
          >
            Cancelar
          </Button>
          <Button
            variant="emergency"
            size="sm"
            onClick={ejecutar}
            disabled={pendiente}
          >
            {pendiente ? "Eliminando…" : "Sí, eliminar datos de demo"}
          </Button>
        </div>
      ) : (
        <div>
          <Button variant="emergency" size="md" onClick={() => setArmado(true)}>
            <Trash2 size={16} /> Eliminar datos de demostración
          </Button>
        </div>
      )}
    </div>
  );
}
