import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/panel", "/cuenta", "/citas", "/vendedor", "/onboarding"],
    },
    sitemap: "https://www.motoresenmarcha.com/sitemap.xml",
  };
}
