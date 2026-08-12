"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Pencil } from "lucide-react";
import { FormField, Textarea, Input } from "@/components/ui/FormField";
import { SelectorTipoProblema } from "./SelectorTipoProblema";
import { SelectorPrioridad } from "./SelectorPrioridad";
import { ResumenSolicitud } from "./ResumenSolicitud";
import { getTallerPorId } from "@/features/talleres/mock";
import { CONDUCTOR_ACTUAL } from "@/features/usuarios/mock";
import type { TipoProblema, Prioridad } from "../types";

/** Formulario completo de solicitud de servicio con panel de resumen. */
export function FormularioSolicitud() {
  const params = useSearchParams();
  const tallerId = params.get("taller") ?? undefined;
  const taller = tallerId ? getTallerPorId(tallerId) : undefined;

  const tipoInicial = (params.get("tipo") as TipoProblema | null) ?? null;
  const prioridadInicial =
    (params.get("prioridad") as Prioridad | null) ?? "normal";

  const [tipo, setTipo] = useState<TipoProblema | null>(tipoInicial);
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [prioridad, setPrioridad] = useState<Prioridad>(prioridadInicial);

  return (
    <div className="grid gap-xl lg:grid-cols-[1fr_360px]">
      {/* Formulario */}
      <form className="flex flex-col gap-xl" onSubmit={(e) => e.preventDefault()}>
        {/* Tipo de problema */}
        <fieldset className="flex flex-col gap-md">
          <legend className="font-heading text-lg font-bold text-foreground-primary">
            ¿Qué tipo de problema tienes?
          </legend>
          <SelectorTipoProblema valor={tipo} onChange={setTipo} />
        </fieldset>

        {/* Descripción */}
        <FormField
          label="Describe el problema"
          htmlFor="descripcion"
          hint="Cuéntanos qué pasa: ruidos, luces, cuándo empezó, etc."
        >
          <Textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej. El motor hace un ruido metálico al acelerar…"
          />
        </FormField>

        {/* Ubicación */}
        <FormField label="Tu ubicación" htmlFor="ubicacion" required>
          <div className="flex flex-col gap-sm">
            <div className="flex items-center justify-center rounded-xl border border-border-subtle bg-surface-page py-xl text-foreground-secondary">
              <MapPin size={28} />
              <span className="ml-sm font-caption text-sm">
                Mapa (marca tu ubicación)
              </span>
            </div>
            <div className="relative">
              <Pencil
                size={16}
                className="absolute left-md top-1/2 -translate-y-1/2 text-foreground-secondary"
              />
              <Input
                id="ubicacion"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Dirección o referencia"
                className="pl-9"
              />
            </div>
          </div>
        </FormField>

        {/* Prioridad */}
        <fieldset className="flex flex-col gap-md">
          <legend className="font-heading text-lg font-bold text-foreground-primary">
            Prioridad
          </legend>
          <SelectorPrioridad valor={prioridad} onChange={setPrioridad} />
        </fieldset>
      </form>

      {/* Resumen (sticky en desktop) */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResumenSolicitud
          tipo={tipo}
          descripcion={descripcion}
          ubicacion={ubicacion}
          prioridad={prioridad}
          taller={taller}
          cliente={CONDUCTOR_ACTUAL.nombre}
        />
      </div>
    </div>
  );
}
