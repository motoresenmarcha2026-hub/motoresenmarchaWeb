"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TarjetaSolicitud } from "./TarjetaSolicitud";
import type { Solicitud, EstadoSolicitud } from "../types";

type Tab = "todas" | EstadoSolicitud;

const TABS: { key: Tab; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "pendiente", label: "Pendientes" },
  { key: "agendado", label: "Agendadas" },
  { key: "completado", label: "Completadas" },
];

/** Contenido del panel de citas y solicitudes con filtro por estado. */
export function PanelSolicitudes({ solicitudes }: { solicitudes: Solicitud[] }) {
  const [tab, setTab] = useState<Tab>("todas");

  const filtradas =
    tab === "todas"
      ? solicitudes
      : solicitudes.filter((s) => s.estado === tab);

  return (
    <div className="flex flex-col gap-md">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground-primary">
          Citas y solicitudes
        </h1>
        <p className="font-body text-foreground-secondary">
          Gestiona las solicitudes de tus clientes y agenda citas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-xs overflow-x-auto border-b border-border-subtle">
        {TABS.map((t) => {
          const activo = tab === t.key;
          const count =
            t.key === "todas"
              ? solicitudes.length
              : solicitudes.filter((s) => s.estado === t.key).length;
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

      {/* Lista */}
      {filtradas.length > 0 ? (
        <div className="flex flex-col gap-md">
          {filtradas.map((s) => (
            <TarjetaSolicitud key={s.id} solicitud={s} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border-subtle p-xl text-center font-body text-sm text-foreground-secondary">
          No hay solicitudes en esta categoría.
        </p>
      )}
    </div>
  );
}
