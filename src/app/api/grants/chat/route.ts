import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT_EN = `You are Bembé's Grant Assistant, specializing in arts and culture grants available to artists in Puerto Rico. You help artists find grants, understand requirements, and prepare applications.

Key knowledge areas:
- NEA (National Endowment for the Arts) programs
- Instituto de Cultura Puertorriqueña (ICP) grants
- Fundación Puertorriqueña de las Humanidades
- Fondos Flamboyán para las Artes
- Municipal cultural programs across Puerto Rico
- General grant writing best practices

Be warm, encouraging, and practical. Keep responses concise (2-3 paragraphs max). If you don't know something specific, say so honestly and suggest where they might find the information. Always respond in the same language the user writes in.`;

const SYSTEM_PROMPT_ES = `Eres el Asistente de Becas de Bembé, especializado en becas de arte y cultura disponibles para artistas en Puerto Rico. Ayudas a artistas a encontrar becas, entender requisitos y preparar solicitudes.

Áreas clave de conocimiento:
- Programas del NEA (National Endowment for the Arts)
- Becas del Instituto de Cultura Puertorriqueña (ICP)
- Fundación Puertorriqueña de las Humanidades
- Fondos Flamboyán para las Artes
- Programas culturales municipales en Puerto Rico
- Mejores prácticas de redacción de becas

Sé cálido, alentador y práctico. Mantén las respuestas concisas (2-3 párrafos máximo). Si no sabes algo específico, dilo honestamente y sugiere dónde podrían encontrar la información. Siempre responde en el mismo idioma que usa el usuario.`;

export async function POST(request: NextRequest) {
  // Auth check — prevent unauthenticated OpenAI spend
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Grant assistant is not configured" },
      { status: 503 }
    );
  }

  let body: { messages?: { role: string; content: string }[]; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { messages = [], locale = "en" } = body;

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  // Only send last 10 messages for context
  const recentMessages = messages.slice(-10).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: locale === "es" ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT_EN,
          },
          ...recentMessages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI API error:", err);
      return NextResponse.json(
        { error: "Grant assistant temporarily unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No response";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Grant chat error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
