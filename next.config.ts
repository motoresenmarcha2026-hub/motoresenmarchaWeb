import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto (evita que Next detecte lockfiles fuera del repo).
  turbopack: { root: __dirname },
  images: {
    // Imágenes de prueba (mock). TODO: conectar a Supabase Storage para fotos reales.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
