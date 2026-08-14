"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LocateFixed, SlidersHorizontal } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { inputBaseClass } from "@/components/ui/FormField";
import type { PuntoUbicacion } from "./MapaUbicacion";

// Leaflet toca `window` — solo cliente.
const MapaUbicacion = dynamic(
  () => import("./MapaUbicacion").then((m) => m.MapaUbicacion),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-border-subtle bg-surface-page font-caption text-sm text-foreground-secondary">
        Cargando mapa…
      </div>
    ),
  }
);

const RADIOS = [2, 5, 10, 20];
/** Centro por defecto: CDMX (donde vive el seed). */
const CENTRO_DEFAULT: PuntoUbicacion = { lat: 19.4326, lng: -99.1332 };

export interface UbicacionElegida extends PuntoUbicacion {
  radioKm: number;
}

/**
 * Modal "Cambiar ubicación" (diseño i46XY): geolocalización, radio a la
 * redonda y mapa interactivo con pin arrastrable. Al aplicar entrega la
 * ubicación elegida para ordenar/filtrar talleres por cercanía real.
 */
export function ModalTalleresCercanos({
  ubicacionActual,
  onAplicar,
}: {
  ubicacionActual: UbicacionElegida | null;
  onAplicar: (u: UbicacionElegida) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [punto, setPunto] = useState<PuntoUbicacion>(
    ubicacionActual ?? CENTRO_DEFAULT
  );
  const [radio, setRadio] = useState(ubicacionActual?.radioKm ?? 10);
  const [ubicando, setUbicando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function usarMiUbicacion() {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }
    setUbicando(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPunto({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setUbicando(false);
      },
      () => {
        setError(
          "No pudimos obtener tu ubicación. Revisa los permisos del navegador o mueve el pin manualmente."
        );
        setUbicando(false);
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  }

  function aplicar() {
    onAplicar({ ...punto, radioKm: radio });
    setAbierto(false);
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setAbierto(true)}>
        <SlidersHorizontal size={16} /> Elegir ubicación
      </Button>

      <Modal
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        titulo="Cambiar ubicación"
      >
        <div className="flex flex-col gap-md">
          <Button
            variant="outline"
            fullWidth
            onClick={usarMiUbicacion}
            disabled={ubicando}
          >
            <LocateFixed size={18} />
            {ubicando ? "Ubicando…" : "Usar mi ubicación"}
          </Button>

          {error && (
            <p className="rounded-lg bg-emergency/10 px-md py-2.5 font-caption text-sm text-emergency">
              {error}
            </p>
          )}

          {/* Radio */}
          <div>
            <label
              htmlFor="radio-km"
              className="mb-xs block font-caption text-sm text-foreground-secondary"
            >
              A la redonda
            </label>
            <select
              id="radio-km"
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

          {/* Mapa interactivo */}
          <MapaUbicacion punto={punto} radioKm={radio} onMover={setPunto} />

          <p className="font-caption text-xs text-foreground-secondary">
            Arrastra el pin o toca el mapa para moverte. Usa + / − para ampliar
            o reducir el radio a la redonda.
          </p>

          <div className="flex justify-end gap-sm border-t border-border-subtle pt-md">
            <Button variant="ghost" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={aplicar}>
              Aplicar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
