import type { CategoriaRefaccionMeta } from "./types";

/**
 * Catálogo estático de categorías de refacciones. Se reutiliza en el registro
 * del vendedor, los filtros del marketplace y el formulario de inventario.
 * (No hay datos mock de productos: la fuente de verdad es Supabase.)
 */
export const CATEGORIAS_REFACCION: CategoriaRefaccionMeta[] = [
  { key: "motor", label: "Motor", icono: "Cog" },
  { key: "frenos", label: "Frenos", icono: "Disc3" },
  { key: "suspension", label: "Suspensión", icono: "Gauge" },
  { key: "electrico", label: "Eléctrico", icono: "Zap" },
  { key: "bateria", label: "Baterías", icono: "BatteryCharging" },
  { key: "filtros", label: "Filtros", icono: "Settings2" },
  { key: "lubricantes", label: "Lubricantes y aceites", icono: "Wrench" },
  { key: "llantas", label: "Llantas y rines", icono: "LifeBuoy" },
  { key: "transmision", label: "Transmisión", icono: "Settings2" },
  { key: "carroceria", label: "Carrocería", icono: "Car" },
  { key: "accesorios", label: "Accesorios", icono: "Wrench" },
];

/** Metadata (etiqueta/ícono) de una categoría; fallback legible si no existe. */
export function categoriaMeta(key: string): CategoriaRefaccionMeta {
  return (
    CATEGORIAS_REFACCION.find((c) => c.key === key) ?? {
      key,
      label: key,
      icono: "Wrench",
    }
  );
}
