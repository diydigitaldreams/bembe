import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe/client";

/**
 * POST /api/walks/[walkId]/checkout
 * Creates a Stripe Checkout session for purchasing a walk.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ walkId: string }> }
) {
  const { walkId } = await params;

  const supabase = await createClient();

  // Fetch the walk
  const { data: walk, error: walkError } = await supabase
    .from("art_walks")
    .select("*, artist:profiles!art_walks_artist_id_fkey(stripe_account_id)")
    .eq("id", walkId)
    .eq("is_published", true)
    .single();

  if (walkError || !walk) {
    return NextResponse.json({ error: "Walk not found" }, { status: 404 });
  }

  if (walk.price_cents === 0) {
    return NextResponse.json(
      { error: "This walk is free — no checkout needed" },
      { status: 400 }
    );
  }

  const artistStripeId = walk.artist?.stripe_account_id;
  if (!artistStripeId) {
    return NextResponse.json(
      { error: "Artist has not set up payments yet" },
      { status: 400 }
    );
  }

  try {
    const session = await createCheckoutSession(
      walk.id,
      walk.title,
      walk.price_cents,
      artistStripeId
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
