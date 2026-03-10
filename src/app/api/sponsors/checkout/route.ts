import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";

const TIER_PRICES: Record<string, { amount: number; name: string }> = {
  starter: { amount: 4900, name: "Bembe Sponsor — Starter" },
  growth: { amount: 14900, name: "Bembe Sponsor — Growth" },
  premium: { amount: 39900, name: "Bembe Sponsor — Premium" },
};

/**
 * POST /api/sponsors/checkout
 * Creates a Stripe Checkout session for a sponsor subscription.
 */
export async function POST(request: NextRequest) {
  let body: { tier?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const tier = body.tier;
  if (!tier || !TIER_PRICES[tier]) {
    return NextResponse.json(
      { error: "Invalid tier. Must be starter, growth, or premium." },
      { status: 400 }
    );
  }

  const { amount, name } = TIER_PRICES[tier];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name },
            unit_amount: amount,
            recurring: { interval: "month" },
            tax_behavior: "exclusive",
          },
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: true },
      metadata: {
        type: "sponsor_subscription",
        tier,
      },
      success_url: `${appUrl}/sponsors?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${appUrl}/sponsors`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("Sponsor checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
