import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
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
  const filename = formData.get("filename") as string | null;

  if (!file || !walkId) {
    return NextResponse.json(
      { error: "file and walkId are required" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported image format. Accepted: jpeg, png, webp" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File exceeds 10 MB limit" },
      { status: 400 },
    );
  }

  const ext = EXT_MAP[file.type] ?? "bin";
  const name = filename || `${Date.now()}`;
  const filePath = `${user.id}/${walkId}/${name}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("Image upload failed:", uploadError);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(filePath);

  return NextResponse.json({ url: publicUrl }, { status: 200 });
}
