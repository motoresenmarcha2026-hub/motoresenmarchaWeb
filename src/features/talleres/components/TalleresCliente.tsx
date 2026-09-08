"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputBaseClass } from "@/components/ui/FormField";
import { ParadasTalleres } from "./ParadasTalleres";
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
export function TalleresCliente({
  talleres,
  textoInicial = "",
}: {
  talleres: Taller[];
  /** Búsqueda inicial (?q= del buscador del hero). */
  textoInicial?: string;
}) {
  const [filtros, setFiltros] = useState<EstadoFiltros>({
    ...FILTROS_INICIALES,
    texto: textoInicial,
  });
  const [ubicacion, setUbicacion] = useState<UbicacionElegida | null>(null);
  const [orden, setOrden] = useState<Orden>("cercania");

  // Al entrar: pedir la ubicación del navegador. Si la dan, ordenamos por
  // cercanía real ("Todos": sin filtrar por radio). Si no, todo sigue igual
  // y queda el pin manual del modal.
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    let cancelado = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelado) return;
        setUbicacion({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          radioKm: 0,
        });
      },
      () => {
        /* permiso denegado: sin ubicación automática */
      },
      { timeout: 8_000 }
    );
    return () => {
      cancelado = true;
    };
  }, []);

  const resultados = useMemo(() => {
    const texto = filtros.texto.trim().toLowerCase();

    // Con ubicación elegida: recalcular distancia/ETA reales y filtrar por
    // radio (radioKm = 0 significa "Todos": solo ordena, no filtra).
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
        .filter(
          (t) => ubicacion.radioKm === 0 || t.distanciaKm <= ubicacion.radioKm
        );
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
              className="inline-flex h-11 items-center gap-sm border-2 border-border-primary bg-surface-inverse px-md font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-inverse transition-colors hover:bg-action-primary-dark"
            >
              <MapPin size={15} aria-hidden className="text-emergency-plancha" />
              <span className="cifras">
                {ubicacion.radioKm === 0
                  ? "Cerca de ti · todos los talleres"
                  : `Cerca de ti · radio de ${ubicacion.radioKm} km`}
              </span>
              <X size={14} aria-hidden />
              {/*
                Texto oculto que SUMA al nombre accesible en vez de
                reemplazarlo: un aria-label aquí borraba la ubicación para
                los lectores de pantalla y dejaba solo "quitar filtro".
              */}
              <span className="sr-only">Quitar el filtro de ubicación</span>
            </button>
          ) : null}
          <ModalTalleresCercanos
            ubicacionActual={ubicacion}
            onAplicar={(u) => {
              setUbicacion(u);
              setOrden("cercania");
            }}
          />
        </div>

        <label className="flex items-center gap-sm font-heading text-xs font-extrabold uppercase tracking-[0.1em] text-foreground-secondary">
          Ordenar por
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className={cn(inputBaseClass, "h-11 w-auto py-0 font-body text-sm normal-case tracking-normal text-foreground-primary")}
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
        <div className="mt-lg">
          <ParadasTalleres talleres={resultados} />
        </div>
      ) : (
        <div className="mt-xl border-2 border-dashed border-border-primary bg-surface-card px-md py-2xl text-center">
          <p className="font-heading text-xl font-extrabold uppercase leading-none text-foreground-primary">
            No encontramos talleres con esos filtros
          </p>
          <p className="mx-auto mt-sm max-w-[30rem] font-body text-foreground-secondary">
            {ubicacion
              ? "Amplía el radio de búsqueda o quita el filtro de ubicación."
              : "Prueba con otra especialidad o quita el filtro de disponibilidad."}
          </p>
        </div>
      )}
    </>
  );
}
