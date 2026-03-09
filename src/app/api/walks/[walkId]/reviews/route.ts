import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ walkId: string }>;
};

// GET /api/walks/:walkId/reviews — Fetch reviews for a walk
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const { walkId } = await context.params;
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      walk_id,
      user_id,
      rating,
      comment,
      created_at,
      user:profiles!reviews_user_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `
    )
    .eq("walk_id", walkId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }

  return NextResponse.json({ reviews: reviews || [] });
}

// POST /api/walks/:walkId/reviews — Submit a review
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const { walkId } = await context.params;
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

  let body: { rating?: number; comment?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { rating, comment } = body;

  if (typeof rating !== "number" || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json(
      { error: "Rating must be an integer from 1 to 5" },
      { status: 400 }
    );
  }

  if (comment !== undefined && typeof comment !== "string") {
    return NextResponse.json(
      { error: "Comment must be a string" },
      { status: 400 }
    );
  }

  const trimmedComment = comment?.trim().slice(0, 1000) || null;

  // Verify walk exists
  const { data: walk } = await supabase
    .from("art_walks")
    .select("id")
    .eq("id", walkId)
    .single();

  if (!walk) {
    return NextResponse.json(
      { error: "Walk not found" },
      { status: 404 }
    );
  }

  // Upsert review (one per user per walk via unique constraint)
  const { data: review, error } = await supabase
    .from("reviews")
    .upsert(
      {
        walk_id: walkId,
        user_id: user.id,
        rating,
        comment: trimmedComment,
      },
      { onConflict: "walk_id,user_id" }
    )
    .select(
      `
      id,
      walk_id,
      user_id,
      rating,
      comment,
      created_at,
      user:profiles!reviews_user_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `
    )
    .single();

  if (error) {
    console.error("Failed to save review:", error);
    return NextResponse.json(
      { error: "Failed to save review" },
      { status: 500 }
    );
  }

  return NextResponse.json({ review }, { status: 201 });
}
