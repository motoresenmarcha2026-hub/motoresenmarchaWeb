"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputBaseClass } from "@/components/ui/FormField";
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
      {/* Buscador + toggle disponibles */}
      <div className="flex flex-col gap-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-md top-1/2 -translate-y-1/2 text-foreground-secondary"
          />
          <input
            type="search"
            value={filtros.texto}
            onChange={(e) => onChange({ ...filtros, texto: e.target.value })}
            placeholder="Buscar por nombre, mecánico o servicio…"
            className={cn(inputBaseClass, "pl-10")}
          />
        </div>
        <label className="flex cursor-pointer items-center gap-sm rounded-lg border border-border-subtle bg-surface-card px-md py-2.5">
          <input
            type="checkbox"
            checked={filtros.soloDisponibles}
            onChange={(e) =>
              onChange({ ...filtros, soloDisponibles: e.target.checked })
            }
            className="h-4 w-4 accent-status-available"
          />
          <span className="font-caption text-sm text-foreground-primary">
            Solo disponibles
          </span>
        </label>
      </div>

      {/* Chips de especialidad */}
      <div className="flex items-center gap-sm overflow-x-auto pb-xs">
        <SlidersHorizontal
          size={16}
          className="shrink-0 text-foreground-secondary"
        />
        <ChipFiltro
          label="Todas"
          activo={filtros.especialidad === "todas"}
          onClick={() => onChange({ ...filtros, especialidad: "todas" })}
        />
        {ESPECIALIDADES.map((e) => (
          <ChipFiltro
            key={e.key}
            label={e.label}
            activo={filtros.especialidad === e.key}
            onClick={() => onChange({ ...filtros, especialidad: e.key })}
          />
        ))}
      </div>

      <p className="font-data text-sm text-foreground-secondary">
        {totalResultados}{" "}
        {totalResultados === 1 ? "taller encontrado" : "talleres encontrados"}
      </p>
    </div>
  );
}

function ChipFiltro({
  label,
  activo,
  onClick,
}: {
  label: string;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-md py-1.5 font-caption text-sm font-medium transition-colors",
        activo
          ? "border-action-primary bg-action-primary text-foreground-inverse"
          : "border-border-subtle bg-surface-card text-foreground-secondary hover:border-foreground-secondary"
      )}
    >
      {label}
    </button>
  );
}
