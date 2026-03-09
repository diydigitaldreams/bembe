import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bembe.vercel.app";
  const supabase = await createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/discover`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/map`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/neighborhoods`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/earn`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Dynamic walk pages
  const { data: walks } = await supabase
    .from("art_walks")
    .select("id, updated_at")
    .eq("is_published", true);

  const walkPages: MetadataRoute.Sitemap = (walks || []).map((walk) => ({
    url: `${baseUrl}/walk/${walk.id}`,
    lastModified: walk.updated_at ? new Date(walk.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic artist pages
  const { data: artists } = await supabase
    .from("profiles")
    .select("id, updated_at")
    .in("role", ["artist", "both"]);

  const artistPages: MetadataRoute.Sitemap = (artists || []).map((artist) => ({
    url: `${baseUrl}/artist/${artist.id}`,
    lastModified: artist.updated_at ? new Date(artist.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...walkPages, ...artistPages];
}
