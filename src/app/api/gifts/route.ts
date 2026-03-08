import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";

const PLATFORM_FEE_PERCENT = 12;

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const body = await request.json();
  const { walkId, senderName, recipientEmail, message } = body as {
    walkId: string;
    senderName: string;
    recipientEmail?: string;
    message?: string;
  };

  if (!walkId || !senderName) {
    return NextResponse.json(
      { error: "walkId and senderName are required" },
      { status: 400 }
    );
  }

  // Fetch the walk details
  const { data: walk, error: walkError } = await supabase
    .from("art_walks")
    .select(
      `
      *,
      artist:profiles!art_walks_artist_id_fkey (
        id,
        stripe_account_id
      )
    `
    )
    .eq("id", walkId)
    .eq("is_published", true)
    .single();

  if (walkError || !walk) {
    return NextResponse.json(
      { error: "Walk not found" },
      { status: 404 }
    );
  }

  if (walk.price_cents === 0) {
    return NextResponse.json(
      { error: "Free walks cannot be gifted" },
      { status: 400 }
    );
  }

  const artistStripeAccountId = walk.artist?.stripe_account_id;
  if (!artistStripeAccountId) {
    return NextResponse.json(
      { error: "Artist has not set up payments yet" },
      { status: 400 }
    );
  }

  // Generate a unique gift code
  const giftCode = crypto.randomUUID().replace(/-/g, "").slice(0, 16);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const platformFee = Math.round(walk.price_cents * (PLATFORM_FEE_PERCENT / 100));

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Gift: ${walk.title}`,
            description: `Art walk gift from ${senderName}`,
          },
          unit_amount: walk.price_cents,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: platformFee,
      transfer_data: {
        destination: artistStripeAccountId,
      },
    },
    metadata: {
      type: "walk_gift",
      walk_id: walkId,
      gift_code: giftCode,
      sender_name: senderName,
      recipient_email: recipientEmail || "",
      message: message?.slice(0, 300) || "",
    },
    success_url: `${appUrl}/gift/${giftCode}`,
    cancel_url: `${appUrl}/walk/${walkId}`,
  });

  // Insert gift record (pending payment)
  const { error: insertError } = await supabase.from("walk_gifts").insert({
    gift_code: giftCode,
    walk_id: walkId,
    sender_name: senderName,
    recipient_email: recipientEmail || null,
    message: message?.slice(0, 300) || null,
    stripe_session_id: session.id,
    status: "pending",
  });

  if (insertError) {
    console.error("Failed to create gift record:", insertError);
    return NextResponse.json(
      { error: "Failed to create gift" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    checkoutUrl: session.url,
    giftCode,
  });
}
