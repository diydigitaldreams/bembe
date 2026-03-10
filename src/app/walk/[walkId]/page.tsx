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

  // Check if the current user has already purchased this walk
  let purchased = false;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && walk.price_cents > 0) {
    const { data: purchase } = await supabase
      .from("walk_purchases")
      .select("id")
      .eq("walk_id", walkId)
      .eq("user_id", user.id)
      .maybeSingle();

    purchased = !!purchase;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: walk.title,
    description: walk.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: walk.neighborhood,
      addressRegion: walk.municipality,
      addressCountry: "PR",
    },
    ...(walk.cover_image_url && { image: walk.cover_image_url }),
    ...(walk.price_cents > 0 && {
      offers: {
        "@type": "Offer",
        price: (walk.price_cents / 100).toFixed(2),
        priceCurrency: "USD",
      },
    }),
    provider: {
      "@type": "Organization",
      name: "Bembe",
      url: "https://bembe.vercel.app",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WalkDetailClient walk={walk} purchased={purchased} />
    </>
  );
}
