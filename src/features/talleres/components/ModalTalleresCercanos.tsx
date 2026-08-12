"use client";

import { useState } from "react";
import { MapPin, LocateFixed } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { inputBaseClass } from "@/components/ui/FormField";
import { TarjetaMecanico } from "./TarjetaMecanico";
import type { Taller } from "../types";

const RADIOS = [2, 5, 10, 20];

/** Modal de talleres cercanos: ajusta el radio y muestra los más próximos. */
export function ModalTalleresCercanos({ talleres }: { talleres: Taller[] }) {
  const [abierto, setAbierto] = useState(false);
  const [radio, setRadio] = useState(10);

  const cercanos = talleres
    .filter((t) => t.distanciaKm <= radio)
    .sort((a, b) => a.distanciaKm - b.distanciaKm)
    .slice(0, 5);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setAbierto(true)}>
        <MapPin size={16} /> Talleres cercanos
      </Button>

      <Modal
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        titulo="Talleres cercanos"
      >
        <div className="flex flex-col gap-md">
          <Button variant="outline" fullWidth>
            <LocateFixed size={18} /> Usar mi ubicación
          </Button>

          {/* Radio */}
          <div>
            <label className="mb-xs block font-caption text-sm font-semibold text-foreground-primary">
              A la redonda
            </label>
            <select
              value={radio}
              onChange={(e) => setRadio(Number(e.target.value))}
              className={inputBaseClass}
            >
              {RADIOS.map((r) => (
                <option key={r} value={r}>
                  {r} kilómetros
                </option>
              ))}
            </select>
          </div>

          {/* Mapa (placeholder) */}
          <div className="flex h-40 items-center justify-center rounded-xl border border-border-subtle bg-surface-page text-foreground-secondary">
            <MapPin size={24} />
            <span className="ml-sm font-caption text-sm">
              Mapa · radio de {radio} km
            </span>
          </div>

          {/* Lista rápida */}
          <div className="flex flex-col gap-sm">
            <p className="font-caption text-sm font-semibold text-foreground-primary">
              {cercanos.length} talleres en {radio} km
            </p>
            {cercanos.map((t) => (
              <TarjetaMecanico key={t.id} taller={t} />
            ))}
          </div>

          <div className={cn("flex justify-end gap-sm pt-sm")}>
            <Button variant="ghost" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setAbierto(false)}>
              Aplicar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
