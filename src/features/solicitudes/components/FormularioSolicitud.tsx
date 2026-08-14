"use client";

import { useState } from "react";
import { MapPin, Pencil } from "lucide-react";
import { FormField, Textarea, Input } from "@/components/ui/FormField";
import { SelectorTipoProblema } from "./SelectorTipoProblema";
import { SelectorPrioridad } from "./SelectorPrioridad";
import { ResumenSolicitud } from "./ResumenSolicitud";
import type { Taller } from "@/features/talleres/types";
import type { TipoProblema, Prioridad } from "../types";

interface Props {
  taller?: Taller;
  tipoInicial?: TipoProblema | null;
  prioridadInicial?: Prioridad;
  clienteNombre?: string;
}

export function FormularioSolicitud({
  taller,
  tipoInicial = null,
  prioridadInicial = "normal",
  clienteNombre = "",
}: Props) {
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
          cliente={clienteNombre}
        />
      </div>
    </div>
  );
}
