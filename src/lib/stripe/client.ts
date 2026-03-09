import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
  });
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return Reflect.get(getStripe(), prop);
  },
});

const PLATFORM_FEE_PERCENT = 12;

/**
 * Creates a Stripe Express connected account for artist payouts.
 * Call this when an artist first sets up their payout info.
 */
export async function createConnectAccount(
  artistId: string,
  email: string
): Promise<Stripe.Account> {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    metadata: {
      bembe_artist_id: artistId,
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: "individual",
    settings: {
      payouts: {
        schedule: {
          interval: "weekly",
          weekly_anchor: "monday",
        },
      },
    },
  });

  return account;
}

/**
 * Generates an account onboarding link for an artist's Express account.
 */
export async function createAccountLink(
  stripeAccountId: string,
  returnUrl: string,
  refreshUrl: string
): Promise<Stripe.AccountLink> {
  return stripe.accountLinks.create({
    account: stripeAccountId,
    type: "account_onboarding",
    return_url: returnUrl,
    refresh_url: refreshUrl,
  });
}

/**
 * Creates a Checkout Session for purchasing an art walk.
 * Uses Stripe Connect destination charges so the platform takes a 12% fee
 * and the artist receives the rest directly.
 */
export async function createCheckoutSession(
  walkId: string,
  walkTitle: string,
  priceCents: number,
  artistStripeAccountId: string,
  couponCode?: string
): Promise<Stripe.Checkout.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const platformFee = Math.round(priceCents * (PLATFORM_FEE_PERCENT / 100));

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: walkTitle,
            description: `Art walk experience in Puerto Rico`,
          },
          unit_amount: priceCents,
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
    allow_promotion_codes: true,
    metadata: {
      type: "walk_purchase",
      walk_id: walkId,
    },
    success_url: `${appUrl}/walk/${walkId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/walk/${walkId}`,
  };

  if (couponCode) {
    sessionParams.discounts = [{ coupon: couponCode }];
    sessionParams.allow_promotion_codes = undefined;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return session;
}

/**
 * Creates a Stripe coupon for testing or promotions.
 */
export async function createCoupon(
  params: {
    percentOff?: number;
    amountOff?: number;
    currency?: string;
    name: string;
    maxRedemptions?: number;
  }
): Promise<Stripe.Coupon> {
  const couponParams: Stripe.CouponCreateParams = {
    name: params.name,
    max_redemptions: params.maxRedemptions,
  };

  if (params.percentOff) {
    couponParams.percent_off = params.percentOff;
  } else if (params.amountOff) {
    couponParams.amount_off = params.amountOff;
    couponParams.currency = params.currency || "usd";
  }

  return stripe.coupons.create(couponParams);
}

/**
 * Creates a Stripe promotion code from a coupon (user-facing code).
 */
export async function createPromoCode(
  couponId: string,
  code: string,
  maxRedemptions?: number
): Promise<Stripe.PromotionCode> {
  return stripe.promotionCodes.create({
    promotion: { type: "coupon", coupon: couponId },
    code,
    max_redemptions: maxRedemptions,
  });
}

/**
 * Creates a Checkout Session for a subscription plan.
 * artist_pro — unlocks analytics, priority placement, unlimited walks
 * patron_premium — ad-free experience, offline walks, early access
 */
export async function createSubscriptionCheckout(
  plan: "artist_pro" | "patron_premium",
  customerId: string
): Promise<Stripe.Checkout.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const priceIds: Record<string, string> = {
    artist_pro: process.env.STRIPE_PRICE_ARTIST_PRO!,
    patron_premium: process.env.STRIPE_PRICE_PATRON_PREMIUM!,
  };

  const priceId = priceIds[plan];
  if (!priceId) {
    throw new Error(`No Stripe price ID configured for plan: ${plan}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      type: "subscription",
      plan,
    },
    success_url: `${appUrl}/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/settings/billing`,
  });

  return session;
}
