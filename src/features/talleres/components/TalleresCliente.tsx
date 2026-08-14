"use client";

import { useMemo, useState } from "react";
import { MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputBaseClass } from "@/components/ui/FormField";
import { TarjetaTaller } from "./TarjetaTaller";
import {
  FiltrosBusqueda,
  FILTROS_INICIALES,
  type EstadoFiltros,
} from "./FiltrosBusqueda";
import {
  ModalTalleresCercanos,
  type UbicacionElegida,
} from "./ModalTalleresCercanos";
import { haversineKm, etaMinutos } from "../geo";
import { especialidadMeta } from "../mock";
import type { Taller } from "../types";

type Orden = "cercania" | "rating" | "resenas";

const ORDENES: { key: Orden; label: string }[] = [
  { key: "cercania", label: "Cercanía" },
  { key: "rating", label: "Mejor calificación" },
  { key: "resenas", label: "Más reseñas" },
];

/** Listado de talleres con filtros, ubicación real y orden (en cliente). */
export function TalleresCliente({ talleres }: { talleres: Taller[] }) {
  const [filtros, setFiltros] = useState<EstadoFiltros>(FILTROS_INICIALES);
  const [ubicacion, setUbicacion] = useState<UbicacionElegida | null>(null);
  const [orden, setOrden] = useState<Orden>("cercania");

  const resultados = useMemo(() => {
    const texto = filtros.texto.trim().toLowerCase();

    // Con ubicación elegida: recalcular distancia/ETA reales y filtrar por radio.
    let base = talleres;
    if (ubicacion) {
      base = talleres
        .filter((t) => t.ubicacion.lat !== 0 || t.ubicacion.lng !== 0)
        .map((t) => {
          const km = haversineKm(ubicacion, t.ubicacion);
          return {
            ...t,
            distanciaKm: Math.round(km * 10) / 10,
            etaMin: etaMinutos(km),
          };
        })
        .filter((t) => t.distanciaKm <= ubicacion.radioKm);
    }

    const filtrados = base.filter((t) => {
      if (filtros.soloDisponibles && t.disponibilidad !== "available") {
        return false;
      }
      if (
        filtros.especialidad !== "todas" &&
        !t.especialidades.includes(filtros.especialidad)
      ) {
        return false;
      }
      if (texto) {
        const heno = [
          t.nombre,
          t.mecanicoPrincipal,
          t.ubicacion.direccion,
          ...t.especialidades.map((e) => especialidadMeta(e).label),
        ]
          .join(" ")
          .toLowerCase();
        if (!heno.includes(texto)) return false;
      }
      return true;
    });

    return [...filtrados].sort((a, b) => {
      if (orden === "rating") return b.rating - a.rating;
      if (orden === "resenas") return b.numResenas - a.numResenas;
      return a.distanciaKm - b.distanciaKm;
    });
  }, [filtros, talleres, ubicacion, orden]);

  return (
    <>
      <FiltrosBusqueda
        filtros={filtros}
        onChange={setFiltros}
        totalResultados={resultados.length}
      />

      {/* Location Bar (diseño LBTH5 → frAi0) */}
      <div className="mt-md flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-sm">
          {ubicacion ? (
            <button
              type="button"
              onClick={() => setUbicacion(null)}
              className="flex items-center gap-xs rounded-xl border border-action-primary/40 bg-action-primary/10 px-md py-2.5 font-body text-sm font-medium text-foreground-primary"
            >
              <MapPin size={16} className="text-action-primary" />
              Cerca de ti · radio de {ubicacion.radioKm} km
              <X size={14} className="text-foreground-secondary" />
            </button>
          ) : (
            <span className="flex items-center gap-xs rounded-xl border border-border-subtle bg-surface-card px-md py-2.5 font-body text-sm font-medium text-foreground-primary">
              <MapPin size={16} className="text-action-primary" />
              Ordena por cercanía
            </span>
          )}
          <ModalTalleresCercanos
            ubicacionActual={ubicacion}
            onAplicar={(u) => {
              setUbicacion(u);
              setOrden("cercania");
            }}
          />
        </div>

        <label className="flex items-center gap-sm font-body text-sm text-foreground-secondary">
          Ordenar por
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className={cn(inputBaseClass, "w-auto py-2")}
          >
            {ORDENES.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {resultados.length > 0 ? (
        <div className="mt-lg grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((taller) => (
            <TarjetaTaller key={taller.id} taller={taller} />
          ))}
        </div>
      ) : (
        <div className="mt-2xl rounded-2xl border border-dashed border-border-subtle p-2xl text-center">
          <p className="font-heading text-lg font-bold text-foreground-primary">
            No encontramos talleres con esos filtros
          </p>
          <p className="mt-xs font-body text-sm text-foreground-secondary">
            {ubicacion
              ? "Amplía el radio de búsqueda o quita el filtro de ubicación."
              : "Prueba con otra especialidad o quita el filtro de disponibilidad."}
          </p>
        </div>
      )}
    </>
  );
}
