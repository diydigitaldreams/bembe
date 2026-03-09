import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WalkDetailClient from "@/components/walk-detail-client";

interface PageProps {
  params: Promise<{ walkId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { walkId } = await params;
  const supabase = await createClient();

  const { data: walk } = await supabase
    .from("art_walks")
    .select("title, description, neighborhood, municipality, cover_image_url")
    .eq("id", walkId)
    .single();

  if (!walk) {
    return { title: "Walk not found | Bembe" };
  }

  const title = `${walk.title} — ${walk.neighborhood} | Bembe`;
  const description = walk.description?.slice(0, 160) || `Audio art walk in ${walk.neighborhood}, ${walk.municipality}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(walk.cover_image_url && { images: [walk.cover_image_url] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(walk.cover_image_url && { images: [walk.cover_image_url] }),
    },
  };
}

export default async function WalkDetailPage({ params }: PageProps) {
  const { walkId } = await params;
  const supabase = await createClient();

  const { data: walk, error } = await supabase
    .from("art_walks")
    .select(
      `
      *,
      artist:profiles!art_walks_artist_id_fkey (
        id,
        full_name,
        avatar_url,
        bio,
        location
      ),
      stops:walk_stops (
        id,
        walk_id,
        order_index,
        title,
        description,
        audio_url,
        image_urls,
        lat,
        lng,
        trigger_radius_meters,
        duration_seconds
      )
    `
    )
    .eq("id", walkId)
    .single();

  if (error || !walk) {
    notFound();
  }

  // Sort stops by order_index
  if (walk.stops) {
    (walk.stops as { order_index: number }[]).sort(
      (a, b) => a.order_index - b.order_index
    );
  }

  return <WalkDetailClient walk={walk} />;
}
