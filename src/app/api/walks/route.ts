import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// ---------------------------------------------------------------------------
// POST /api/walks — Create a new walk with stops
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const {
    title,
    description,
    neighborhood,
    municipality,
    cover_image_url,
    price_cents,
    duration_minutes,
    distance_km,
    is_published,
    stops,
  } = body as {
    title?: string;
    description?: string;
    neighborhood?: string;
    municipality?: string;
    cover_image_url?: string;
    price_cents?: number;
    duration_minutes?: number;
    distance_km?: number;
    is_published?: boolean;
    stops?: {
      title: string;
      description: string;
      lat: number;
      lng: number;
      duration_seconds?: number;
    }[];
  };

  if (!title?.trim()) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  if (!neighborhood?.trim()) {
    return NextResponse.json(
      { error: "Neighborhood is required" },
      { status: 400 }
    );
  }

  // Insert the walk
  const { data: walk, error: walkError } = await supabase
    .from("art_walks")
    .insert({
      artist_id: user.id,
      title: title.trim(),
      description: (description || "").trim(),
      cover_image_url: cover_image_url || "",
      price_cents: price_cents ?? 0,
      duration_minutes: duration_minutes ?? 0,
      distance_km: distance_km ?? 0,
      neighborhood: neighborhood.trim(),
      municipality: (municipality || neighborhood).trim(),
      is_published: is_published ?? false,
    })
    .select()
    .single();

  if (walkError) {
    console.error("Failed to create walk:", walkError);
    return NextResponse.json(
      { error: "Failed to create walk" },
      { status: 500 }
    );
  }

  // Insert stops if provided
  if (stops && stops.length > 0) {
    const stopRows = stops.map((s, i) => ({
      walk_id: walk.id,
      order_index: i,
      title: s.title || `Stop ${i + 1}`,
      description: s.description || "",
      lat: s.lat ?? 18.4655,
      lng: s.lng ?? -66.1057,
      duration_seconds: s.duration_seconds ?? 0,
    }));

    const { error: stopsError } = await supabase
      .from("walk_stops")
      .insert(stopRows);

    if (stopsError) {
      console.error("Failed to create stops:", stopsError);
      return NextResponse.json(
        { error: "Walk created but stops failed to save" },
        { status: 500 }
      );
    }
  }

  // Re-fetch with relations
  const { data: fullWalk } = await supabase
    .from("art_walks")
    .select(
      `
      *,
      artist:profiles!art_walks_artist_id_fkey (id, full_name, avatar_url, location),
      stops:walk_stops (*)
    `
    )
    .eq("id", walk.id)
    .single();

  return NextResponse.json({ walk: fullWalk ?? walk }, { status: 201 });
}

// ---------------------------------------------------------------------------
// GET /api/walks — List published walks
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE), 10))
  );
  const offset = (page - 1) * limit;

  // Filters
  const neighborhood = searchParams.get("neighborhood");
  const municipality = searchParams.get("municipality");
  const minPrice = searchParams.get("min_price"); // cents
  const maxPrice = searchParams.get("max_price"); // cents
  const featured = searchParams.get("featured");
  const search = searchParams.get("q");
  const artistId = searchParams.get("artist_id");
  const sortBy = searchParams.get("sort"); // newest, popular, price_asc, price_desc

  let query = supabase
    .from("art_walks")
    .select(
      `
      *,
      artist:profiles!art_walks_artist_id_fkey (
        id,
        full_name,
        avatar_url,
        location,
        lat,
        lng
      )
    `,
      { count: "exact" }
    )
    .eq("is_published", true);

  // Apply filters
  if (neighborhood) {
    query = query.ilike("neighborhood", neighborhood);
  }

  if (municipality) {
    query = query.ilike("municipality", municipality);
  }

  if (minPrice) {
    const min = parseInt(minPrice, 10);
    if (!isNaN(min)) query = query.gte("price_cents", min);
  }

  if (maxPrice) {
    const max = parseInt(maxPrice, 10);
    if (!isNaN(max)) query = query.lte("price_cents", max);
  }

  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  if (artistId) {
    query = query.eq("artist_id", artistId);
  }

  if (search) {
    // Sanitize search input to prevent PostgREST filter injection
    const sanitized = search.replace(/[.,%()]/g, "");
    if (sanitized.trim()) {
      query = query.or(`title.ilike.%${sanitized}%,description.ilike.%${sanitized}%`);
    }
  }

  // Sorting
  switch (sortBy) {
    case "popular":
      query = query.order("total_plays", { ascending: false });
      break;
    case "price_asc":
      query = query.order("price_cents", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_cents", { ascending: false });
      break;
    case "rating":
      query = query.order("avg_rating", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data: walks, count, error } = await query;

  if (error) {
    console.error("Failed to fetch walks:", error);
    return NextResponse.json(
      { error: "Failed to fetch walks" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    walks: walks ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      total_pages: count ? Math.ceil(count / limit) : 0,
    },
  });
}
