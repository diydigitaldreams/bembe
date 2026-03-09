import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!code) {
    return NextResponse.json({ error: "Gift code is required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: gift, error } = await supabase
    .from("walk_gifts")
    .select(
      `
      gift_code,
      sender_name,
      message,
      status,
      walk_id,
      walk:art_walks!walk_gifts_walk_id_fkey (
        title,
        neighborhood
      )
    `
    )
    .eq("gift_code", code)
    .single();

  if (error || !gift) {
    return NextResponse.json({ error: "Gift not found" }, { status: 404 });
  }

  const walk = gift.walk as unknown as { title: string; neighborhood: string } | null;

  return NextResponse.json({
    walk_title: walk?.title || "Art Walk",
    sender_name: gift.sender_name,
    message: gift.message,
    status: gift.status,
    walk_id: gift.walk_id,
    neighborhood: walk?.neighborhood || "",
  });
}
