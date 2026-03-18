import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "crypto";
import { seed } from "@/scripts/seed";

// ---------------------------------------------------------------------------
// POST /api/seed — Seed the database with demo data
// Requires BEMBE_ADMIN_KEY header. Only works if no walks exist yet.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  // 1. Auth check (timing-safe comparison to prevent timing attacks)
  const adminKey = request.headers.get("x-admin-key") || request.headers.get("bembe_admin_key");
  const expectedKey = process.env.BEMBE_ADMIN_KEY;
  if (!adminKey || !expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized — invalid or missing BEMBE_ADMIN_KEY header" },
      { status: 401 }
    );
  }
  const encoder = new TextEncoder();
  const a = encoder.encode(adminKey);
  const b = encoder.encode(expectedKey);
  if (a.byteLength !== b.byteLength || !timingSafeEqual(a, b)) {
    return NextResponse.json(
      { error: "Unauthorized — invalid or missing BEMBE_ADMIN_KEY header" },
      { status: 401 }
    );
  }

  // 2. Guard against double-seeding
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server misconfiguration — missing Supabase env vars" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { count, error: countError } = await supabase
    .from("art_walks")
    .select("id", { count: "exact", head: true });

  if (countError) {
    return NextResponse.json(
      { error: `Failed to check existing data: ${countError.message}` },
      { status: 500 }
    );
  }

  if (count && count > 0) {
    return NextResponse.json(
      {
        error: "Database already contains walks — seed aborted to prevent duplicates",
        existing_walks: count,
      },
      { status: 409 }
    );
  }

  // 3. Run seed
  try {
    const result = await seed();
    return NextResponse.json(
      {
        message: "Database seeded successfully",
        created: result,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Seed failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
