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
 */
export function MapaUbicacion({
  punto,
  radioKm,
  onMover,
}: {
  punto: PuntoUbicacion;
  radioKm: number;
  onMover: (p: PuntoUbicacion) => void;
}) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<L.Map | null>(null);
  const marcadorRef = useRef<L.Marker | null>(null);
  const circuloRef = useRef<L.Circle | null>(null);
  const onMoverRef = useRef(onMover);
  onMoverRef.current = onMover;

  // Montaje único del mapa
  useEffect(() => {
    if (!contenedorRef.current || mapaRef.current) return;

    const mapa = L.map(contenedorRef.current, {
      center: [punto.lat, punto.lng],
      zoom: 12,
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
      radius: radioKm * 1000,
      color: "#1E56A8",
      weight: 2,
      fillColor: "#1E56A8",
      fillOpacity: 0.2,
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

  // Sincronizar pin/círculo/vista cuando cambian punto o radio
  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa) return;
    marcadorRef.current?.setLatLng([punto.lat, punto.lng]);
    circuloRef.current?.setLatLng([punto.lat, punto.lng]);
    circuloRef.current?.setRadius(radioKm * 1000);
    mapa.panTo([punto.lat, punto.lng]);
  }, [punto.lat, punto.lng, radioKm]);

  return (
    <div
      ref={contenedorRef}
      data-testid="mapa-ubicacion"
      className="h-[300px] w-full rounded-xl border border-border-subtle"
    />
  );
}
