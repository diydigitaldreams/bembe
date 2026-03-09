import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bembe.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/artist/dashboard", "/artist/analytics", "/artist/walks/new"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
