import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getAnthropicClient } from "@/lib/anthropic";

// Mix of light, medium, and deep questions — not all existential
const STARTER_QUESTIONS = [
  // Light / playful
  "What makes me laugh that I probably shouldn't?",
  "What would I do today if nobody was watching?",
  "What rule do I secretly enjoy breaking?",
  "What would my 10-year-old self think of me right now?",
  "What compliment would I never give myself?",
  "What am I surprisingly good at that nobody knows?",
  // Medium
  "What conversation keeps replaying in my head?",
  "What would change if I said no more often?",
  "What do I keep saying I'll start tomorrow?",
  "Where do I feel most free?",
  "What am I protecting that doesn't need protection?",
  "What would I do differently if I had 6 months?",
  // Deep
  "What am I avoiding that keeps showing up anyway?",
  "What would change if I stopped trying to control this?",
  "What would I do if I trusted myself more?",
  "What part of myself have I been negotiating away?",
];

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if refresh is requested (bypass cache)
    const url = new URL(request.url);
    const refresh = url.searchParams.get("refresh") === "1";

    const today = new Date().toISOString().slice(0, 10);

    // Check cache for today's question (skip if refresh)
    if (!refresh) {
      const { data: cached } = await supabase
        .from("daily_questions")
        .select("generated_question")
        .eq("user_id", user.id)
        .eq("question_date", today)
        .single();

      if (cached) {
        return NextResponse.json({ question: cached.generated_question });
      }
    }

    // Fetch recent perspectives and questions from plays
    const { data: plays } = await supabase
      .from("plays")
      .select("question, play_data")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(10);

    // New user with no history → return a curated starter question
    if (!plays || plays.length === 0) {
      const q =
        STARTER_QUESTIONS[Math.floor(Math.random() * STARTER_QUESTIONS.length)];
      return NextResponse.json({ question: q });
    }

    // Fetch recent daily questions to avoid repeats
    const { data: recentDailyQs } = await supabase
      .from("daily_questions")
      .select("generated_question")
      .eq("user_id", user.id)
      .order("question_date", { ascending: false })
      .limit(5);

    const recentDailyQuestions = recentDailyQs?.map((q) => q.generated_question) || [];

    // Build context from recent plays
    const recentQuestions = plays.map((p) => p.question);
    const recentPerspectives: string[] = [];
    for (const p of plays) {
      const pd = p.play_data as { perspectives?: Array<string | { insight: string }> };
      if (pd?.perspectives) {
        for (const persp of pd.perspectives.slice(0, 3)) {
          if (typeof persp === "string") {
            recentPerspectives.push(persp);
          } else if (persp.insight) {
            recentPerspectives.push(persp.insight);
          }
        }
      }
    }

    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      temperature: 1.0,
      system:
        "You generate one question for the Stage on Mars play simulator. VARY THE TONE: sometimes playful, sometimes provocative, sometimes tender, sometimes absurd, sometimes practical. NOT always deep/philosophical. Alternate between light and heavy. The question should feel like it came from a curious friend, not a therapist. Output ONLY the question, nothing else. Max 15 words. No quotes around it.",
      messages: [
        {
          role: "user",
          content: `Recent questions this person asked:\n${recentQuestions.join("\n")}\n\nRecent perspectives they received:\n${recentPerspectives.slice(0, 10).join("\n")}\n\nRecent daily questions (DO NOT repeat or rephrase these):\n${recentDailyQuestions.join("\n")}\n\nGenerate one fresh question. Pick a DIFFERENT tone than their recent questions — if they've been heavy, go light; if practical, go existential. Don't repeat previous questions.`,
        },
      ],
    });

    let generatedQuestion =
      response.content[0].type === "text"
        ? response.content[0].text.trim().replace(/^["']|["']$/g, "")
        : STARTER_QUESTIONS[0];

    // Strip any leading/trailing quotes
    generatedQuestion = generatedQuestion.replace(/^["'""]|["'""]$/g, "");

    // Cache for today (upsert so refresh overwrites)
    await supabase.from("daily_questions").upsert(
      {
        user_id: user.id,
        question_date: today,
        generated_question: generatedQuestion,
      },
      { onConflict: "user_id,question_date" }
    );

    return NextResponse.json({ question: generatedQuestion });
  } catch (error) {
    console.error("Daily question error:", error);
    // Fallback to curated question on any error
    const q =
      STARTER_QUESTIONS[Math.floor(Math.random() * STARTER_QUESTIONS.length)];
    return NextResponse.json({ question: q });
  }
}
