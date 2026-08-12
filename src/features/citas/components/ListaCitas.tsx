"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TarjetaCita } from "./TarjetaCita";
import type { Cita } from "../types";

type Tab = "proximas" | "completadas" | "canceladas";

const TABS: { key: Tab; label: string }[] = [
  { key: "proximas", label: "Próximas" },
  { key: "completadas", label: "Completadas" },
  { key: "canceladas", label: "Canceladas" },
];

function pertenece(cita: Cita, tab: Tab): boolean {
  if (tab === "proximas")
    return cita.estado === "pendiente" || cita.estado === "confirmada";
  if (tab === "completadas") return cita.estado === "completada";
  return cita.estado === "cancelada";
}

/** Lista de citas del conductor con filtro por pestaña. */
export function ListaCitas({ citas }: { citas: Cita[] }) {
  const [tab, setTab] = useState<Tab>("proximas");
  const filtradas = citas.filter((c) => pertenece(c, tab));

  return (
    <div className="flex flex-col gap-md">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground-primary">
          Mis citas y reservas
        </h1>
        <p className="font-body text-foreground-secondary">
          Consulta el estado de tus citas con los talleres.
        </p>
      </div>

      <div className="flex gap-xs overflow-x-auto border-b border-border-subtle">
        {TABS.map((t) => {
          const activo = tab === t.key;
          const count = citas.filter((c) => pertenece(c, t.key)).length;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "shrink-0 border-b-2 px-sm py-sm font-caption text-sm font-semibold transition-colors",
                activo
                  ? "border-action-primary text-action-primary"
                  : "border-transparent text-foreground-secondary hover:text-foreground-primary"
              )}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {filtradas.length > 0 ? (
        <div className="flex flex-col gap-sm">
          {filtradas.map((c) => (
            <TarjetaCita key={c.id} cita={c} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border-subtle p-xl text-center font-body text-sm text-foreground-secondary">
          No tienes citas en esta categoría.
        </p>
      )}
    </div>
  );
}
