import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para el navegador (client components).
 * Usa la publishable key (segura en el cliente con RLS activo).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
