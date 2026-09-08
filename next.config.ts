import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto (evita que Next detecte lockfiles fuera del repo).
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      // Supabase Storage (fotos reales de talleres subidas por sus dueños).
      { protocol: "https", hostname: "ygxxsgypnoflqbwrrlxq.supabase.co" },
      // Avatares de cuentas de Google (login con Google).
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Placeholders del mock. `images.unsplash.com` se retiró: ya no hay
      // ninguna referencia en el código y la tesis del mundo rechaza la
      // fotografía de stock. `picsum` sigue solo para avatares de mock.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
