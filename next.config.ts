import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto (evita que Next detecte lockfiles fuera del repo).
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      // Supabase Storage (fotos reales de talleres subidas por sus dueños).
      { protocol: "https", hostname: "ygxxsgypnoflqbwrrlxq.supabase.co" },
      // Placeholders del seed / mock.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
