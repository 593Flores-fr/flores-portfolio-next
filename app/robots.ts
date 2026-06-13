import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_URL ?? "https://flores.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/espace/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
