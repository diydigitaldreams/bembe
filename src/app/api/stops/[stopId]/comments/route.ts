import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_BODY_LENGTH = 280;

// ---------------------------------------------------------------------------
// GET /api/stops/[stopId]/comments — List timed comments for a stop
// ---------------------------------------------------------------------------
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ stopId: string }> }
) {
  const { stopId } = await params;
  const supabase = await createClient();

  const { data: comments, error } = await supabase
    .from("stop_comments")
    .select(
      `
      *,
      user:profiles!stop_comments_user_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `
    )
    .eq("stop_id", stopId)
    .order("timestamp_ms", { ascending: true });

  if (error) {
    console.error("Failed to fetch stop comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }

  return NextResponse.json({ comments: comments ?? [] });
}

// ---------------------------------------------------------------------------
// POST /api/stops/[stopId]/comments — Create a timed comment
// ---------------------------------------------------------------------------
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ stopId: string }> }
) {
  const { stopId } = await params;
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

  const { timestamp_ms, body: commentBody } = body as {
    timestamp_ms?: number;
    body?: string;
  };

  if (
    timestamp_ms === undefined ||
    typeof timestamp_ms !== "number" ||
    !Number.isInteger(timestamp_ms) ||
    timestamp_ms < 0
  ) {
    return NextResponse.json(
      { error: "timestamp_ms must be a non-negative integer" },
      { status: 400 }
    );
  }

  if (!commentBody || typeof commentBody !== "string" || !commentBody.trim()) {
    return NextResponse.json(
      { error: "body is required and must be non-empty" },
      { status: 400 }
    );
  }

  if (commentBody.length > MAX_BODY_LENGTH) {
    return NextResponse.json(
      { error: `body must be ${MAX_BODY_LENGTH} characters or fewer` },
      { status: 400 }
    );
  }

  // Verify stop exists
  const { data: stop } = await supabase
    .from("walk_stops")
    .select("id")
    .eq("id", stopId)
    .single();

  if (!stop) {
    return NextResponse.json({ error: "Stop not found" }, { status: 404 });
  }

  const { data: comment, error: insertError } = await supabase
    .from("stop_comments")
    .insert({
      stop_id: stopId,
      user_id: user.id,
      timestamp_ms,
      body: commentBody.trim(),
    })
    .select(
      `
      *,
      user:profiles!stop_comments_user_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `
    )
    .single();

  if (insertError) {
    console.error("Failed to create stop comment:", insertError);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }

  return NextResponse.json({ comment }, { status: 201 });
}
