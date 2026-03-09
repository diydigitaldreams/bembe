import { NextRequest, NextResponse } from "next/server";
import { createCoupon, createPromoCode } from "@/lib/stripe/client";

/**
 * POST /api/coupons
 * Creates a test coupon + promotion code for testing the purchase flow.
 * Protected: only works when BEMBE_ADMIN_KEY header matches.
 */
export async function POST(request: NextRequest) {
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.BEMBE_ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name = "Test Coupon",
      code = "BEMBETEST",
      percentOff = 100,
      maxRedemptions = 100,
    } = body;

    const coupon = await createCoupon({
      name,
      percentOff,
      maxRedemptions,
    });

    const promoCode = await createPromoCode(
      coupon.id,
      code,
      maxRedemptions
    );

    return NextResponse.json({
      coupon: {
        id: coupon.id,
        name: coupon.name,
        percent_off: coupon.percent_off,
      },
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
