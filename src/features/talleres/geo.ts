/** Utilidades de geolocalización del marketplace. */

export interface Punto {
  lat: number;
  lng: number;
}

/** Distancia en km entre dos puntos (fórmula de haversine). */
export function haversineKm(a: Punto, b: Punto): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
}

/** ETA estimado en minutos para tránsito urbano (~20 km/h + arranque). */
export function etaMinutos(km: number): number {
  return Math.max(5, Math.round(km * 3));
}
