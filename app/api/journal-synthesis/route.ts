import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getAnthropicClient } from "@/lib/anthropic";

export async function GET(request: NextRequest) {
  const bustCache = request.nextUrl.searchParams.has("bust");
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
      return NextResponse.json({
        synthesis: cached.synthesis,
        playCount: cached.play_count,
      });
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

    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      temperature: 0.7,
      system:
        "You are a perceptive systemic observer for Stage on Mars. Analyze the user's play history and identify: 1) recurring themes, 2) blind spots or avoidance patterns, 3) emerging growth edges. Write 2-3 sentences, direct and honest. Address the user as 'you'. No platitudes.",
      messages: [
        {
          role: "user",
          content: `Questions asked (most recent first):\n${questions.join("\n")}\n\nPerspectives received:\n${perspectives.slice(0, 30).join("\n")}\n\nSynthesize the patterns.`,
        },
      ],
    });

    const synthesis =
      response.content[0].type === "text"
        ? response.content[0].text.trim()
        : "";

    if (synthesis) {
      await supabase.from("journal_syntheses").upsert(
        {
          user_id: user.id,
          synthesis,
          play_count: playCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    return NextResponse.json({ synthesis, playCount });
  } catch (error) {
    console.error("Journal synthesis error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
