import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!code) {
    return NextResponse.json({ error: "Gift code is required" }, { status: 400 });
  }

  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Look up the gift
  const { data: gift, error: giftError } = await supabase
    .from("walk_gifts")
    .select("*")
    .eq("gift_code", code)
    .single();

  if (giftError || !gift) {
    return NextResponse.json({ error: "Gift not found" }, { status: 404 });
  }

  if (gift.status === "redeemed") {
    return NextResponse.json(
      { error: "This gift has already been redeemed" },
      { status: 400 }
    );
  }

  if (gift.status !== "paid") {
    return NextResponse.json(
      { error: "This gift has not been paid for yet" },
      { status: 400 }
    );
  }

  // Record the purchase for the redeemer
  const { error: purchaseError } = await supabase
    .from("walk_purchases")
    .insert({
      user_id: user.id,
      walk_id: gift.walk_id,
      amount_cents: 0, // Gift — no charge to redeemer
      stripe_payment_id: gift.stripe_session_id,
    });

  if (purchaseError) {
    console.error("Failed to insert gift purchase:", purchaseError);
    return NextResponse.json(
      { error: "Failed to redeem gift" },
      { status: 500 }
    );
  }

  // Mark the gift as redeemed
  await supabase
    .from("walk_gifts")
    .update({
      status: "redeemed",
      redeemed_by: user.id,
      redeemed_at: new Date().toISOString(),
    })
    .eq("gift_code", code);

  // Atomically increment total_plays on the walk
  await supabase.rpc("increment_plays", { walk: gift.walk_id });

  return NextResponse.json({ success: true });
}
