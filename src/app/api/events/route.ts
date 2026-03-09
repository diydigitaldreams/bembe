import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/events
 * List published events, sorted by start date (upcoming first).
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const offset = (page - 1) * limit;
  const neighborhood = searchParams.get("neighborhood");
  const q = searchParams.get("q");

  let query = supabase
    .from("events")
    .select("*, organizer:profiles!organizer_id(id, full_name, avatar_url)", { count: "exact" })
    .eq("is_published", true)
    .gte("ends_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (neighborhood) {
    query = query.eq("neighborhood", neighborhood);
  }

  if (q) {
    const sanitized = q.replace(/[.,%()]/g, "");
    if (sanitized.trim()) {
      query = query.or(`title.ilike.%${sanitized}%,description.ilike.%${sanitized}%`);
    }
  }

  const { data: events, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    events: events || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    },
  });
}

/**
 * POST /api/events
 * Create a new event. Requires authentication.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      location_name,
      neighborhood,
      lat,
      lng,
      starts_at,
      ends_at,
      ticket_price_cents = 0,
      max_capacity = 0,
      rsvp_url = "",
      is_published = false,
    } = body;

    if (!title || !location_name || !starts_at || !ends_at) {
      return NextResponse.json(
        { error: "Missing required fields: title, location_name, starts_at, ends_at" },
        { status: 400 }
      );
    }

    if (new Date(ends_at) <= new Date(starts_at)) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        organizer_id: user.id,
        title,
        description: description || "",
        cover_image_url: "",
        location_name,
        neighborhood: neighborhood || "",
        lat: lat || 18.4655,
        lng: lng || -66.1057,
        starts_at,
        ends_at,
        ticket_price_cents,
        max_capacity,
        rsvp_url,
        is_published,
      })
      .select("*, organizer:profiles!organizer_id(id, full_name, avatar_url)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
