"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputBaseClass } from "@/components/ui/FormField";
import { Chip } from "@/components/ui/Chip";
import { ESPECIALIDADES } from "../mock";
import type { Especialidad } from "../types";

export interface EstadoFiltros {
  texto: string;
  especialidad: Especialidad | "todas";
  soloDisponibles: boolean;
}

export const FILTROS_INICIALES: EstadoFiltros = {
  texto: "",
  especialidad: "todas",
  soloDisponibles: false,
};

/** Barra de filtros del marketplace de talleres. */
export function FiltrosBusqueda({
  filtros,
  onChange,
  totalResultados,
}: {
  filtros: EstadoFiltros;
  onChange: (f: EstadoFiltros) => void;
  totalResultados: number;
}) {
  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-sm md:flex-row md:items-stretch">
        <div className="relative flex-1">
          <Search
            size={18}
            aria-hidden
            className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-foreground-secondary"
          />
          <input
            type="search"
            value={filtros.texto}
            onChange={(e) => onChange({ ...filtros, texto: e.target.value })}
            placeholder="Buscar por nombre, mecánico o servicio…"
            className={cn(inputBaseClass, "pl-11")}
          />
        </div>

        {/* Interruptor de tinta: casilla cuadrada, plancha roja al activarse */}
        <label
          className={cn(
            "flex cursor-pointer select-none items-center gap-sm border-2 border-border-primary px-md py-3 font-heading text-xs font-extrabold uppercase tracking-[0.1em] transition-colors",
            filtros.soloDisponibles
              ? "bg-status-available text-foreground-inverse"
              : "bg-surface-card text-foreground-primary hover:bg-surface-page"
          )}
        >
          <input
            type="checkbox"
            checked={filtros.soloDisponibles}
            onChange={(e) =>
              onChange({ ...filtros, soloDisponibles: e.target.checked })
            }
            className="h-4 w-4 rounded-none accent-status-available"
          />
          Solo disponibles
        </label>
      </div>

      <div className="flex gap-sm overflow-x-auto pb-xs [-webkit-overflow-scrolling:touch]">
        <Chip
          label="Todas"
          activo={filtros.especialidad === "todas"}
          onClick={() => onChange({ ...filtros, especialidad: "todas" })}
        />
        {ESPECIALIDADES.map((e) => (
          <Chip
            key={e.key}
            label={e.label}
            activo={filtros.especialidad === e.key}
            onClick={() => onChange({ ...filtros, especialidad: e.key })}
          />
        ))}
      </div>

      <p className="cifras font-heading text-xs font-extrabold uppercase tracking-[0.12em] text-foreground-secondary">
        {totalResultados}{" "}
        {totalResultados === 1 ? "taller encontrado" : "talleres encontrados"}
      </p>
    </div>
  );
}
