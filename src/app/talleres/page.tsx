"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSFloatingButton } from "@/components/layout/SOSFloatingButton";
import { TarjetaTaller } from "@/features/talleres/components/TarjetaTaller";
import { ModalTalleresCercanos } from "@/features/talleres/components/ModalTalleresCercanos";
import {
  FiltrosBusqueda,
  FILTROS_INICIALES,
  type EstadoFiltros,
} from "@/features/talleres/components/FiltrosBusqueda";
import { TALLERES, especialidadMeta } from "@/features/talleres/mock";

export default function TalleresPage() {
  const [filtros, setFiltros] = useState<EstadoFiltros>(FILTROS_INICIALES);

  const resultados = useMemo(() => {
    const texto = filtros.texto.trim().toLowerCase();
    return TALLERES.filter((t) => {
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
    }).sort((a, b) => a.distanciaKm - b.distanciaKm);
  }, [filtros]);

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Encabezado */}
        <section className="bg-surface-inverse">
          <div className="mx-auto flex max-w-7xl flex-col gap-md px-md py-xl md:flex-row md:items-end md:justify-between md:px-lg">
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-foreground-inverse md:text-4xl">
                Talleres mecánicos cerca de ti
              </h1>
              <p className="mt-xs font-body text-foreground-inverse-secondary">
                Encuentra al especialista indicado, revisa calificaciones y
                contáctalo por WhatsApp al instante.
              </p>
            </div>
            <ModalTalleresCercanos talleres={TALLERES} />
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-md py-lg md:px-lg">
          {/* Filtros */}
          <FiltrosBusqueda
            filtros={filtros}
            onChange={setFiltros}
            totalResultados={resultados.length}
          />

          {/* Grid de resultados */}
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
        </div>
      </main>

      <Footer />
      <SOSFloatingButton />
    </>
  );
}
