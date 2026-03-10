import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WalkPlayerClient from "@/components/walk-player-client";

export default async function WalkPlayerPage({
  params,
}: {
  params: Promise<{ walkId: string }>;
}) {
  const { walkId } = await params;
  const supabase = await createClient();

  const { data: walk, error } = await supabase
    .from("art_walks")
    .select(
      `
      id,
      title,
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

  const stops = (walk.stops || []).sort(
    (a: { order_index: number }, b: { order_index: number }) =>
      a.order_index - b.order_index
  );

  if (stops.length === 0) {
    notFound();
  }

  // Fetch active sponsors near the walk stops (BEM-48)
  const { data: sponsors } = await supabase
    .from("business_sponsors")
    .select("id, business_name, logo_url, lat, lng")
    .eq("is_active", true);

  // Filter sponsors within 500m of any walk stop
  const nearbySponsorPins = (sponsors || []).filter((s) => {
    return stops.some((stop: { lat: number; lng: number }) => {
      const dlat = (s.lat - stop.lat) * 111320;
      const dlng = (s.lng - stop.lng) * 111320 * Math.cos((stop.lat * Math.PI) / 180);
      return Math.sqrt(dlat * dlat + dlng * dlng) <= 500;
    });
  });

  return (
    <WalkPlayerClient
      walkId={walk.id}
      walkTitle={walk.title}
      stops={stops}
      sponsorPins={nearbySponsorPins}
    />
  );
}
