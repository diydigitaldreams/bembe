import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createConnectAccount, createAccountLink } from "@/lib/stripe/client";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      stripe_account_id: profile.stripe_account_id || null,
      connected: !!profile.stripe_account_id,
    });
  } catch (error) {
    console.error("Failed to get Connect status:", error);
    return NextResponse.json(
      { error: "Failed to get Connect status" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if artist already has a connected account
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const returnUrl = `${appUrl}/artist/dashboard?stripe=connected`;
    const refreshUrl = `${appUrl}/artist/dashboard?stripe=refresh`;

    let stripeAccountId = profile.stripe_account_id;

    // Create a new Connect account if one doesn't exist
    if (!stripeAccountId) {
      const account = await createConnectAccount(
        user.id,
        user.email || ""
      );
      stripeAccountId = account.id;

      // Save stripe_account_id to profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ stripe_account_id: stripeAccountId })
        .eq("id", user.id);

      if (updateError) {
        console.error("Failed to save stripe_account_id:", updateError);
        return NextResponse.json(
          { error: "Failed to save account" },
          { status: 500 }
        );
      }
    }

    // Generate onboarding link
    const accountLink = await createAccountLink(
      stripeAccountId,
      returnUrl,
      refreshUrl
    );

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Failed to create Connect account:", error);
    return NextResponse.json(
      { error: "Failed to create Connect account" },
      { status: 500 }
    );
  }
}
