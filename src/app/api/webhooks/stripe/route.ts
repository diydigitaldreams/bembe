import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 }
    );
  }

  let supabaseAdmin: ReturnType<typeof getSupabaseAdmin>;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 503 }
    );
  }
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
          supabaseAdmin
        );
        break;

      case "account.updated":
        await handleAccountUpdated(
          event.data.object as Stripe.Account,
          supabaseAdmin
        );
        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`Error processing webhook ${event.type}:`, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabaseAdmin: SupabaseClient
) {
  const type = session.metadata?.type;

  if (type === "walk_purchase") {
    await handleWalkPurchase(session, supabaseAdmin);
  } else if (type === "subscription" || type === "artist_subscription") {
    await handleSubscription(session, supabaseAdmin);
  }
}

async function handleWalkPurchase(
  session: Stripe.Checkout.Session,
  supabaseAdmin: SupabaseClient
) {
  const walkId = session.metadata?.walk_id;
  if (!walkId) {
    console.error("Walk purchase webhook missing walk_id in metadata");
    return;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;

  let userId: string | null = null;
  if (customerId) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();
    userId = profile?.id ?? null;
  }

  const { error: insertError } = await supabaseAdmin
    .from("walk_purchases")
    .insert({
      user_id: userId,
      walk_id: walkId,
      amount_cents: session.amount_total ?? 0,
      stripe_payment_id: session.payment_intent as string | null,
    });

  if (insertError) {
    console.error("Failed to insert walk purchase:", insertError);
    throw insertError;
  }

  // Increment total_plays
  const { data: walk } = await supabaseAdmin
    .from("art_walks")
    .select("total_plays")
    .eq("id", walkId)
    .single();

  if (walk) {
    await supabaseAdmin
      .from("art_walks")
      .update({ total_plays: walk.total_plays + 1 })
      .eq("id", walkId);
  }
}

async function handleSubscription(
  session: Stripe.Checkout.Session,
  supabaseAdmin: SupabaseClient
) {
  const plan = session.metadata?.plan;
  if (!plan) {
    console.error("Subscription webhook missing plan in metadata");
    return;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;

  if (!customerId) {
    console.error("Subscription webhook missing customer");
    return;
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!profile) {
    console.error("No profile found for Stripe customer:", customerId);
    return;
  }

  const subscriptionId = session.subscription as string | null;

  let periodEnd: string | null = null;
  if (subscriptionId) {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    // Stripe's type definition wraps the response; access the underlying data
    const periodEndUnix = (sub as unknown as { current_period_end: number }).current_period_end;
    periodEnd = new Date(periodEndUnix * 1000).toISOString();
  }

  const dbPlan = plan === "artist_pro" ? "pro" : "free";

  const { error } = await supabaseAdmin
    .from("artist_subscriptions")
    .upsert(
      {
        artist_id: profile.id,
        plan: dbPlan,
        stripe_subscription_id: subscriptionId,
        current_period_end: periodEnd,
      },
      { onConflict: "artist_id" }
    );

  if (error) {
    console.error("Failed to upsert artist subscription:", error);
    throw error;
  }
}

async function handleAccountUpdated(
  account: Stripe.Account,
  supabaseAdmin: SupabaseClient
) {
  const artistId = account.metadata?.bembe_artist_id;
  if (!artistId) return;

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ stripe_account_id: account.id })
    .eq("id", artistId);

  if (error) {
    console.error("Failed to update profile stripe_account_id:", error);
  }
}
