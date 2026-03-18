import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";
import { APP_URL } from "@/lib/constants";
import { z } from "zod";

const PLATFORM_FEE_PERCENT = 12;
const MIN_TIP_CENTS = 200; // $2 minimum
const MAX_TIP_CENTS = 50000; // $500 maximum

const tipSchema = z.object({
  artistId: z.string().uuid(),
  amount: z.number().int().min(MIN_TIP_CENTS).max(MAX_TIP_CENTS),
  message: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = tipSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request body" },
        { status: 400 }
      );
    }

    const { artistId, amount, message } = parsed.data;

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

    const appUrl = APP_URL;
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
