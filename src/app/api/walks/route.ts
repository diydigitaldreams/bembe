import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

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
        location
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
    // Use Postgres full-text search against the GIN index
    query = query.textSearch("title", search, {
      type: "websearch",
      config: "spanish",
    });
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
