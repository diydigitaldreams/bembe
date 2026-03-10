import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/sponsors/analytics?sponsor_id=...
 * Returns foot traffic analytics for a sponsor's sponsored walks.
 */
export async function GET(request: NextRequest) {
  const sponsorId = request.nextUrl.searchParams.get("sponsor_id");
  if (!sponsorId) {
    return NextResponse.json({ error: "sponsor_id required" }, { status: 400 });
  }

  const supabase = await createClient();

  // Get sponsor's active walk sponsorships
  const { data: sponsorships, error: spError } = await supabase
    .from("walk_sponsorships")
    .select("walk_id, amount_cents")
    .eq("sponsor_id", sponsorId)
    .eq("is_active", true);

  if (spError) {
    return NextResponse.json({ error: "Failed to fetch sponsorships" }, { status: 500 });
  }

  if (!sponsorships || sponsorships.length === 0) {
    return NextResponse.json({
      sponsored_walks: 0,
      total_plays: 0,
      total_impressions: 0,
      walks: [],
    });
  }

  const walkIds = sponsorships.map((s) => s.walk_id);

  // Get walk data with play counts
  const { data: walks } = await supabase
    .from("art_walks")
    .select("id, title, neighborhood, total_plays")
    .in("id", walkIds);

  const totalPlays = (walks || []).reduce((sum, w) => sum + (w.total_plays || 0), 0);

  // Estimate impressions (each play = ~1 map view with sponsor pin visible)
  const totalImpressions = totalPlays;

  return NextResponse.json({
    sponsored_walks: sponsorships.length,
    total_plays: totalPlays,
    total_impressions: totalImpressions,
    monthly_spend_cents: sponsorships.reduce((sum, s) => sum + s.amount_cents, 0),
    walks: (walks || []).map((w) => ({
      id: w.id,
      title: w.title,
      neighborhood: w.neighborhood,
      plays: w.total_plays,
    })),
  });
}
