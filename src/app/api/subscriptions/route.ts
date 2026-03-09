import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";

const SUBSCRIPTION_PRICE_CENTS = 500; // $5/month
const APPLICATION_FEE_PERCENT = 12;

export async function POST(request: NextRequest) {
  try {
    const { artistId } = await request.json();

    if (!artistId || typeof artistId !== "string") {
      return NextResponse.json(
        { error: "artistId is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Look up the artist's Stripe Connect account ID
    const { data: artist, error: artistError } = await supabase
      .from("profiles")
      .select("stripe_account_id, full_name")
      .eq("id", artistId)
      .single();

    if (artistError || !artist?.stripe_account_id) {
      return NextResponse.json(
        { error: "Artist not found or payments not configured" },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create a Stripe Price for the $5/month subscription dynamically
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: SUBSCRIPTION_PRICE_CENTS,
      recurring: { interval: "month" },
      product_data: {
        name: `Subscription to ${artist.full_name}`,
        metadata: {
          bembe_artist_id: artistId,
          type: "artist_subscription",
        },
      },
    });

    // Create a Checkout Session in subscription mode with Connect
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      subscription_data: {
        application_fee_percent: APPLICATION_FEE_PERCENT,
        transfer_data: {
          destination: artist.stripe_account_id,
        },
        metadata: {
          type: "artist_subscription",
          artist_id: artistId,
          patron_id: user.id,
        },
      },
      metadata: {
        type: "artist_subscription",
        artist_id: artistId,
        patron_id: user.id,
      },
      success_url: `${appUrl}/artist/${artistId}?subscribed=true`,
      cancel_url: `${appUrl}/artist/${artistId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Subscription checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription checkout" },
      { status: 500 }
    );
  }
}
