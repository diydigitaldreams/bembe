import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ walkId: string }>;
};

// ---------------------------------------------------------------------------
// GET /api/walks/:walkId — Fetch single walk with stops and artist info
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const { walkId } = await context.params;
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
    return NextResponse.json(
      { error: "Walk not found" },
      { status: 404 }
    );
  }

  // Sort stops by order_index client-side as a safety net
  if (walk.stops) {
    (walk.stops as { order_index: number }[]).sort(
      (a, b) => a.order_index - b.order_index
    );
  }

  return NextResponse.json({ walk });
}

// ---------------------------------------------------------------------------
// PATCH /api/walks/:walkId — Update walk (artist only)
// ---------------------------------------------------------------------------

const ALLOWED_FIELDS = new Set([
  "title",
  "description",
  "cover_image_url",
  "price_cents",
  "duration_minutes",
  "distance_km",
  "neighborhood",
  "municipality",
  "is_published",
]);

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { walkId } = await context.params;
  const supabase = await createClient();

  // Verify the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Verify the user owns this walk
  const { data: existing } = await supabase
    .from("art_walks")
    .select("artist_id")
    .eq("id", walkId)
    .single();

  if (!existing) {
    return NextResponse.json(
      { error: "Walk not found" },
      { status: 404 }
    );
  }

  if (existing.artist_id !== user.id) {
    return NextResponse.json(
      { error: "You can only edit your own walks" },
      { status: 403 }
    );
  }

  // Parse and validate the update payload
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Filter to only allowed fields
  const updates: Record<string, unknown> = {};
  for (const key of Object.keys(body)) {
    if (ALLOWED_FIELDS.has(key)) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  // Validate price if provided
  if (
    "price_cents" in updates &&
    (typeof updates.price_cents !== "number" || updates.price_cents < 0)
  ) {
    return NextResponse.json(
      { error: "price_cents must be a non-negative number" },
      { status: 400 }
    );
  }

  const { data: walk, error } = await supabase
    .from("art_walks")
    .update(updates)
    .eq("id", walkId)
    .select(
      `
      *,
      artist:profiles!art_walks_artist_id_fkey (
        id,
        full_name,
        avatar_url,
        location
      )
    `
    )
    .single();

  if (error) {
    console.error("Failed to update walk:", error);
    return NextResponse.json(
      { error: "Failed to update walk" },
      { status: 500 }
    );
  }

  return NextResponse.json({ walk });
}
