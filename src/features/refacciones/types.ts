/**
 * Tipos del dominio de refacciones (autopartes) y su vendedor.
 * Mapean a las tablas de Postgres/Supabase `refacciones` y `vendedores`.
 */

/** Categoría / tipo de refacción. Se guarda como texto en la BD. */
export type CategoriaRefaccion =
  | "motor"
  | "frenos"
  | "suspension"
  | "electrico"
  | "bateria"
  | "filtros"
  | "lubricantes"
  | "llantas"
  | "transmision"
  | "carroceria"
  | "accesorios";

/** Etiqueta legible + ícono para cada categoría (para UI). */
export interface CategoriaRefaccionMeta {
  key: string;
  label: string;
  /** Nombre de ícono lucide-react (registrado en components/ui/Icono). */
  icono: string;
}

/**
 * Tabla `refacciones`. Un producto pertenece a un vendedor (`vendedorId`).
 * Los campos `vendedor*` son datos del join con `vendedores` (para el
 * marketplace y el detalle); son opcionales porque el inventario del propio
 * vendedor no los necesita.
 */
export interface Refaccion {
  id: string;
  vendedorId: string;
  nombre: string;
  slug: string;
  categoria: string;
  /** Precio en la moneda indicada (MXN por defecto). */
  precio: number;
  moneda: string;
  stock: number;
  marca: string;
  /** Modelos/años compatibles en texto libre. */
  modeloCompatible: string;
  fotoUrl: string;
  descripcion: string;
  activo: boolean;
  destacado: boolean;
  // Join con vendedores (marketplace / detalle):
  vendedorNombre?: string;
  vendedorWhatsapp?: string;
  vendedorCiudad?: string;
}

/** Estado de los filtros del marketplace de refacciones. */
export interface RefaccionFiltros {
  texto: string;
  categoria: string | null;
}
