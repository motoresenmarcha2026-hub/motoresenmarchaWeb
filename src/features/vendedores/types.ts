/**
 * Tipos del dominio de vendedores (la "tienda" del rol vendedor).
 * Mapean a la tabla de Postgres/Supabase `vendedores`.
 */
export interface Vendedor {
  id: string;
  ownerId: string | null;
  nombreNegocio: string;
  slug: string;
  ciudad: string;
  direccion: string;
  whatsapp: string;
  logoUrl: string;
  descripcion: string;
  categorias: string[];
  verificado: boolean;
  destacado: boolean;
  lat: number | null;
  lng: number | null;
}
