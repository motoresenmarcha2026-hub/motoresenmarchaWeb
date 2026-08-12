import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases condicionalmente y resuelve conflictos de Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea un precio en pesos mexicanos. */
export function formatearPrecio(monto: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(monto);
}

/** Formatea una distancia en km de forma legible. */
export function formatearDistancia(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Formatea un tiempo estimado (ETA) en minutos. */
export function formatearEta(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/** Formatea una fecha ISO a formato legible en español. */
export function formatearFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Construye un enlace de WhatsApp (wa.me) con mensaje opcional. */
export function enlaceWhatsApp(telefono: string, mensaje?: string): string {
  const num = telefono.replace(/[^0-9]/g, "");
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : "";
  // TODO: conectar a Supabase — registrar el contacto/mensaje en la BD.
  return `https://wa.me/${num}${texto}`;
}
