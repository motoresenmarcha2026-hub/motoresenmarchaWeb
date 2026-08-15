"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface PuntoUbicacion {
  lat: number;
  lng: number;
}

/** Pin azul (action-primary) como divIcon — evita los assets rotos de Leaflet. */
const PIN_ICON = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#1E56A8" stroke="#ffffff" stroke-width="1.5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="#ffffff" stroke="none"/></svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/**
 * Mapa Leaflet/OpenStreetMap con pin arrastrable y círculo de radio,
 * según el diseño del modal "Cambiar ubicación" (nodo i46XY).
 * Los botones +/− amplían o reducen el RADIO (no el zoom); el mapa se
 * reencuadra solo para mantener el círculo visible. radioKm = 0 → todos.
 */
export function MapaUbicacion({
  punto,
  radioKm,
  onMover,
  onAmpliarRadio,
  onReducirRadio,
}: {
  punto: PuntoUbicacion;
  radioKm: number;
  onMover: (p: PuntoUbicacion) => void;
  /** Sin estos callbacks el mapa es solo selector de punto (sin botones +/−). */
  onAmpliarRadio?: () => void;
  onReducirRadio?: () => void;
}) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<L.Map | null>(null);
  const marcadorRef = useRef<L.Marker | null>(null);
  const circuloRef = useRef<L.Circle | null>(null);
  const onMoverRef = useRef(onMover);
  useEffect(() => {
    onMoverRef.current = onMover;
  }, [onMover]);

  // Montaje único del mapa
  useEffect(() => {
    if (!contenedorRef.current || mapaRef.current) return;

    const mapa = L.map(contenedorRef.current, {
      center: [punto.lat, punto.lng],
      zoom: 12,
      zoomControl: false, // los +/− del diseño controlan el radio
      attributionControl: true,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(mapa);

    const marcador = L.marker([punto.lat, punto.lng], {
      icon: PIN_ICON,
      draggable: true,
    }).addTo(mapa);

    const circulo = L.circle([punto.lat, punto.lng], {
      radius: radioKm > 0 ? radioKm * 1000 : 0,
      color: "#1E56A8",
      weight: 2,
      fillColor: "#1E56A8",
      fillOpacity: 0.2,
      opacity: radioKm > 0 ? 1 : 0,
    }).addTo(mapa);

    marcador.on("dragend", () => {
      const p = marcador.getLatLng();
      onMoverRef.current({ lat: p.lat, lng: p.lng });
    });
    mapa.on("click", (e: L.LeafletMouseEvent) => {
      onMoverRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapaRef.current = mapa;
    marcadorRef.current = marcador;
    circuloRef.current = circulo;

    return () => {
      mapa.remove();
      mapaRef.current = null;
      marcadorRef.current = null;
      circuloRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizar pin/círculo/encuadre cuando cambian punto o radio
  useEffect(() => {
    const mapa = mapaRef.current;
    const circulo = circuloRef.current;
    if (!mapa || !circulo) return;

    marcadorRef.current?.setLatLng([punto.lat, punto.lng]);
    circulo.setLatLng([punto.lat, punto.lng]);

    if (radioKm > 0) {
      circulo.setRadius(radioKm * 1000);
      circulo.setStyle({ opacity: 1, fillOpacity: 0.2 });
      // Encuadrar el círculo completo
      mapa.fitBounds(circulo.getBounds(), { padding: [24, 24] });
    } else {
      // Sin radio (selector de punto / "Todos"): solo seguir el pin
      circulo.setStyle({ opacity: 0, fillOpacity: 0 });
      mapa.panTo([punto.lat, punto.lng]);
    }
  }, [punto.lat, punto.lng, radioKm]);

  return (
    <div className="relative">
      <div
        ref={contenedorRef}
        data-testid="mapa-ubicacion"
        className="h-[300px] w-full rounded-xl border border-border-subtle"
      />
      {/* Controles de radio (diseño: +/− amplían/reducen el radio) */}
      {onAmpliarRadio && onReducirRadio && (
      <div className="absolute left-4 top-4 z-[1000] flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-surface-card shadow-md">
        <button
          type="button"
          aria-label="Ampliar radio"
          data-testid="radio-mas"
          onClick={onAmpliarRadio}
          className="flex h-9 w-9 items-center justify-center border-b border-border-subtle font-heading text-lg font-bold text-foreground-primary hover:bg-surface-page"
        >
          +
        </button>
        <button
          type="button"
          aria-label="Reducir radio"
          data-testid="radio-menos"
          onClick={onReducirRadio}
          className="flex h-9 w-9 items-center justify-center font-heading text-lg font-bold text-foreground-primary hover:bg-surface-page"
        >
          −
        </button>
      </div>
      )}
    </div>
  );
}
