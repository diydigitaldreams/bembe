import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";

const PLATFORM_FEE_PERCENT = 12;
const MIN_TIP_CENTS = 200; // $2 minimum
const MAX_TIP_CENTS = 50000; // $500 maximum

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { artistId, amount, message } = body as {
      artistId: string;
      amount: number;
      message?: string;
    };

    // Validate required fields
    if (!artistId || !amount) {
      return NextResponse.json(
        { error: "artistId and amount are required" },
        { status: 400 }
      );
    }

    // Validate amount
    if (
      typeof amount !== "number" ||
      !Number.isInteger(amount) ||
      amount < MIN_TIP_CENTS ||
      amount > MAX_TIP_CENTS
    ) {
      return NextResponse.json(
        { error: `Amount must be an integer between ${MIN_TIP_CENTS} and ${MAX_TIP_CENTS} cents` },
        { status: 400 }
      );
    }

    // Validate message length
    if (message && message.length > 200) {
      return NextResponse.json(
        { error: "Message must be 200 characters or fewer" },
        { status: 400 }
      );
    }

    // Look up the artist's Stripe connected account
    const supabase = await createClient();
    const { data: artist, error: artistError } = await supabase
      .from("profiles")
      .select("id, full_name, stripe_account_id")
      .eq("id", artistId)
      .single();

    if (artistError || !artist) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      );
    }

    if (!artist.stripe_account_id) {
      return NextResponse.json(
        { error: "Artist has not set up payouts yet" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENT / 100));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Tip for ${artist.full_name}`,
              description: message || "Thank you for your art!",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: artist.stripe_account_id,
        },
      },
      metadata: {
        type: "tip",
        artist_id: artistId,
        message: message || "",
      },
      success_url: `${appUrl}/artist/${artistId}?tipped=true`,
      cancel_url: `${appUrl}/artist/${artistId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create tip checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
