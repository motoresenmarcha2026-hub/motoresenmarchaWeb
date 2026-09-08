"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputBaseClass } from "@/components/ui/FormField";
import { TarjetaRefaccion } from "./TarjetaRefaccion";
import { Chip } from "@/components/ui/Chip";
import { CATEGORIAS_REFACCION, categoriaMeta } from "../mock";
import type { Refaccion } from "../types";

type Orden = "recientes" | "precio-asc" | "precio-desc";

const ORDENES: { key: Orden; label: string }[] = [
  { key: "recientes", label: "Más recientes" },
  { key: "precio-asc", label: "Precio: menor a mayor" },
  { key: "precio-desc", label: "Precio: mayor a menor" },
];

/** Listado de refacciones con filtros (categoría, texto) y orden (en cliente). */
export function RefaccionesCliente({
  refacciones,
  textoInicial = "",
}: {
  refacciones: Refaccion[];
  /** Búsqueda inicial (?q= del buscador). */
  textoInicial?: string;
}) {
  const [texto, setTexto] = useState(textoInicial);
  const [categoria, setCategoria] = useState<string | null>(null);
  const [orden, setOrden] = useState<Orden>("recientes");

  const resultados = useMemo(() => {
    const q = texto.trim().toLowerCase();
    const filtrados = refacciones.filter((r) => {
      if (categoria && r.categoria !== categoria) return false;
      if (q) {
        const heno = [
          r.nombre,
          r.marca,
          r.modeloCompatible,
          r.categoria ? categoriaMeta(r.categoria).label : "",
          r.vendedorNombre ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!heno.includes(q)) return false;
      }
      return true;
    });

    return [...filtrados].sort((a, b) => {
      if (orden === "precio-asc") return a.precio - b.precio;
      if (orden === "precio-desc") return b.precio - a.precio;
      return 0; // recientes: ya vienen ordenadas por created_at desc
    });
  }, [refacciones, texto, categoria, orden]);

  return (
    <>
      {/* Buscador */}
      <div className="relative">
        <Search
          size={18}
          aria-hidden
          className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-foreground-secondary"
        />
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Busca por nombre, marca o modelo…"
          className={cn(inputBaseClass, "pl-11")}
        />
      </div>

      {/* Chips de categoría */}
      <div className="mt-md flex gap-sm overflow-x-auto pb-xs [-webkit-overflow-scrolling:touch]">
        <Chip
          label="Todas"
          activo={categoria === null}
          onClick={() => setCategoria(null)}
        />
        {CATEGORIAS_REFACCION.map((c) => (
          <Chip
            key={c.key}
            label={c.label}
            activo={categoria === c.key}
            onClick={() => setCategoria(categoria === c.key ? null : c.key)}
          />
        ))}
      </div>

      {/* Orden + conteo */}
      <div className="mt-md flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
        <p className="cifras font-heading text-xs font-extrabold uppercase tracking-[0.12em] text-foreground-secondary">
          {resultados.length}{" "}
          {resultados.length === 1 ? "refacción encontrada" : "refacciones encontradas"}
        </p>
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
        <div className="mt-lg grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((r) => (
            <TarjetaRefaccion key={r.id} refaccion={r} />
          ))}
        </div>
      ) : (
        <div className="mt-xl border-2 border-dashed border-border-primary bg-surface-card px-md py-2xl text-center">
          <p className="font-heading text-xl font-extrabold uppercase leading-none text-foreground-primary">
            No encontramos refacciones con esos filtros
          </p>
          <p className="mx-auto mt-sm max-w-[30rem] font-body text-foreground-secondary">
            Prueba con otra categoría o cambia tu búsqueda.
          </p>
        </div>
      )}
    </>
  );
}
