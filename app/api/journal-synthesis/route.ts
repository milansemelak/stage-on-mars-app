import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getAnthropicClient } from "@/lib/anthropic";

export async function GET(request: NextRequest) {
  const bustCache = request.nextUrl.searchParams.has("bust");
  const lang = request.nextUrl.searchParams.get("lang") || "en";

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Count user's plays
    const { count } = await supabase
      .from("plays")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const playCount = count || 0;

    if (playCount < 5) {
      return NextResponse.json({ synthesis: null, playCount });
    }

    // Check cached synthesis
    const { data: cached } = await supabase
      .from("journal_syntheses")
      .select("synthesis, play_count")
      .eq("user_id", user.id)
      .single();

    if (cached && cached.play_count === playCount && !bustCache) {
      try {
        const parsed = JSON.parse(cached.synthesis);
        return NextResponse.json({ synthesis: parsed, playCount: cached.play_count });
      } catch {
        // Old format — force regeneration
      }
    }

    // Fetch perspectives from recent plays
    const { data: plays } = await supabase
      .from("plays")
      .select("question, play_data")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(30);

    const perspectives: string[] = [];
    const questions: string[] = [];

    for (const p of plays || []) {
      questions.push(p.question);
      const pd = p.play_data as {
        perspectives?: Array<string | { insight: string; character: string }>;
      };
      if (pd?.perspectives) {
        for (const persp of pd.perspectives) {
          if (typeof persp === "string") {
            perspectives.push(persp);
          } else if (persp.insight) {
            perspectives.push(`${persp.character}: ${persp.insight}`);
          }
        }
      }
    }

    const langInstruction = lang === "sk"
      ? "Odpovedaj VÝLUČNE po slovensky. Žiadna angličtina."
      : lang === "cs"
      ? "Odpovídej VÝHRADNĚ česky. Žádná angličtina."
      : "Respond in English.";

    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      temperature: 0.7,
      system: `You notice patterns in someone's Stage on Mars play history. Keep it casual and observational — like a sharp friend noticing something, not a therapist diagnosing.

Return JSON with 3 short observations:
- theme: what topic or tension keeps coming back across their questions (1 sentence, max 15 words)
- blindSpot: something interesting the plays keep pointing to that they don't seem to notice (1 sentence, max 15 words)
- edge: where it looks like things are heading (1 sentence, max 15 words)

${langInstruction}

Format: {"theme":"...","blindSpot":"...","edge":"..."}
No markdown. Keep it short and specific. Address them as "you".`,
      messages: [
        {
          role: "user",
          content: `${playCount} plays analyzed.\n\nQuestions asked (most recent first):\n${questions.join("\n")}\n\nPerspectives received:\n${perspectives.slice(0, 30).join("\n")}`,
        },
      ],
    });

    const raw =
      response.content[0].type === "text"
        ? response.content[0].text.trim()
        : "";

    let synthesisObj: { theme: string; blindSpot: string; edge: string } | null = null;

    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        synthesisObj = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fallback: treat as plain text for backwards compat
      synthesisObj = { theme: raw, blindSpot: "", edge: "" };
    }

    if (synthesisObj) {
      await supabase.from("journal_syntheses").upsert(
        {
          user_id: user.id,
          synthesis: JSON.stringify(synthesisObj),
          play_count: playCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    return NextResponse.json({ synthesis: synthesisObj, playCount });
  } catch (error) {
    console.error("Journal synthesis error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
