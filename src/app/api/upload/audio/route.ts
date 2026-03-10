import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = new Set([
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp4",
  "audio/webm",
]);

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

const EXT_MAP: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
  "audio/webm": "webm",
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 },
    );
  }

  const file = formData.get("file") as File | null;
  const walkId = formData.get("walkId") as string | null;
  const stopIndex = formData.get("stopIndex") as string | null;

  if (!file || !walkId || stopIndex === null) {
    return NextResponse.json(
      { error: "file, walkId, and stopIndex are required" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported audio format. Accepted: mp3, wav, ogg, m4a, webm" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File exceeds 50 MB limit" },
      { status: 400 },
    );
  }

  const ext = EXT_MAP[file.type] ?? "bin";
  const filePath = `${user.id}/${walkId}/${stopIndex}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("audio")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("Audio upload failed:", uploadError);
    return NextResponse.json(
      { error: "Failed to upload audio" },
      { status: 500 },
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("audio").getPublicUrl(filePath);

  return NextResponse.json({ url: publicUrl }, { status: 200 });
}
