import type { MetadataRoute } from "next";
import { getTalleres } from "@/features/talleres/data";
import { getRefacciones } from "@/features/refacciones/data";

const BASE = "https://www.motoresenmarcha.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/talleres`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/refacciones`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/solicitar`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/registro`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terminos`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/cookies`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const [talleres, refacciones] = await Promise.all([
    getTalleres(),
    getRefacciones(),
  ]);
  const perfiles: MetadataRoute.Sitemap = talleres.map((t) => ({
    url: `${BASE}/talleres/${t.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const productos: MetadataRoute.Sitemap = refacciones.map((r) => ({
    url: `${BASE}/refacciones/${r.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...estaticas, ...perfiles, ...productos];
}
