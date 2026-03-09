import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Auth check — prevent unauthenticated OpenAI spend
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { success: rateLimitOk } = rateLimit(user.id);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { artistDescription, stopTitle, neighborhood } =
      await request.json();

    if (!artistDescription || !stopTitle) {
      return NextResponse.json(
        { error: "artistDescription and stopTitle are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a cultural storyteller for Puerto Rico. Polish the artist's description into an engaging audio walk narration that highlights local culture, history, and art. Keep the artist's authentic voice. Output in the same language as the input (Spanish or English).

Return a JSON object with two fields:
- "polishedDescription": The polished narration text (2-3 paragraphs)
- "suggestedAudioScript": A ready-to-read audio script version with natural pauses indicated by "..." and emphasis with *asterisks*`;

    const userPrompt = `Stop Title: ${stopTitle}
Neighborhood: ${neighborhood || "Puerto Rico"}
Artist's Description: ${artistDescription}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate content" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({
      polishedDescription: content.polishedDescription,
      suggestedAudioScript: content.suggestedAudioScript,
    });
  } catch (error) {
    console.error("Generate stop error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
