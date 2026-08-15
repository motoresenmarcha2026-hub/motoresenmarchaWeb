"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LocateFixed, Search, SlidersHorizontal } from "lucide-react";
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

/** Escalera de radios; 0 = "Todos" (sin límite). De 10 en 10 hasta todos. */
const RADIOS = [2, 5, 10, 20, 30, 40, 50, 0];

export function etiquetaRadio(r: number): string {
  return r === 0 ? "Todos los talleres" : `${r} kilómetros`;
}

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
  const [direccion, setDireccion] = useState("");
  const [buscando, setBuscando] = useState(false);

  /** Geocodifica la dirección escrita (Nominatim/OSM) y mueve el pin. */
  async function buscarDireccion() {
    const q = direccion.trim();
    if (!q || buscando) return;
    setBuscando(true);
    setError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=mx&q=${encodeURIComponent(q)}`,
        { headers: { Accept: "application/json" } }
      );
      const data: { lat: string; lon: string }[] = await res.json();
      if (data[0]) {
        setPunto({ lat: Number(data[0].lat), lng: Number(data[0].lon) });
      } else {
        setError(
          "No encontramos esa dirección. Agrega más detalle (colonia, ciudad) o mueve el pin en el mapa."
        );
      }
    } catch {
      setError("No se pudo buscar la dirección. Intenta de nuevo.");
    } finally {
      setBuscando(false);
    }
  }

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

  /** +/− del mapa recorren la escalera de radios (0 = Todos al final). */
  function moverRadio(paso: 1 | -1) {
    const i = RADIOS.indexOf(radio);
    const siguiente = RADIOS[Math.min(RADIOS.length - 1, Math.max(0, i + paso))];
    setRadio(siguiente);
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

          {/* Alternativa sin permisos: escribir la dirección */}
          <div className="flex gap-sm">
            <input
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  buscarDireccion();
                }
              }}
              placeholder="O escribe tu dirección o colonia…"
              className={inputBaseClass}
            />
            <Button
              variant="outline"
              onClick={buscarDireccion}
              disabled={buscando}
              aria-label="Buscar dirección"
            >
              <Search size={16} />
              {buscando ? "Buscando…" : "Buscar"}
            </Button>
          </div>

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
                  {etiquetaRadio(r)}
                </option>
              ))}
            </select>
          </div>

          {/* Mapa interactivo */}
          <MapaUbicacion
            punto={punto}
            radioKm={radio}
            onMover={setPunto}
            onAmpliarRadio={() => moverRadio(1)}
            onReducirRadio={() => moverRadio(-1)}
          />

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
