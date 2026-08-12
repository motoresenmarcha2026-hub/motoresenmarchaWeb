"use client";

import { useMemo, useState } from "react";
import { TarjetaTaller } from "./TarjetaTaller";
import {
  FiltrosBusqueda,
  FILTROS_INICIALES,
  type EstadoFiltros,
} from "./FiltrosBusqueda";
import { especialidadMeta } from "../mock";
import type { Taller } from "../types";

/** Listado de talleres con filtros en cliente (recibe los datos por props). */
export function TalleresCliente({ talleres }: { talleres: Taller[] }) {
  const [filtros, setFiltros] = useState<EstadoFiltros>(FILTROS_INICIALES);

  const resultados = useMemo(() => {
    const texto = filtros.texto.trim().toLowerCase();
    return talleres.filter((t) => {
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
  }, [filtros, talleres]);

  return (
    <>
      <FiltrosBusqueda
        filtros={filtros}
        onChange={setFiltros}
        totalResultados={resultados.length}
      />

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
            Prueba con otra especialidad o quita el filtro de disponibilidad.
          </p>
        </div>
      )}
    </>
  );
}
