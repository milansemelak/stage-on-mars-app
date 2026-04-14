import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getAnthropicClient } from "@/lib/anthropic";

const STARTER_QUESTIONS = [
  "What am I avoiding that keeps showing up anyway?",
  "What would change if I stopped trying to control this?",
  "What conversation am I postponing?",
  "What would I do if I trusted myself more?",
  "Where am I performing instead of being present?",
];

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().slice(0, 10);

    // Check cache for today's question
    const { data: cached } = await supabase
      .from("daily_questions")
      .select("generated_question")
      .eq("user_id", user.id)
      .eq("question_date", today)
      .single();

    if (cached) {
      return NextResponse.json({ question: cached.generated_question });
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

    // Build context from recent plays
    const recentQuestions = plays.map((p) => p.question);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      temperature: 0.9,
      system:
        "You generate one deeply personal, probing question for the Stage on Mars play simulator. The question should challenge the user's assumptions and reference patterns from their previous plays. Output ONLY the question, nothing else. Max 20 words.",
      messages: [
        {
          role: "user",
          content: `Recent questions this person asked:\n${recentQuestions.join("\n")}\n\nRecent perspectives they received:\n${recentPerspectives.slice(0, 15).join("\n")}\n\nGenerate one new question that goes deeper. Don't repeat their previous questions. Reference patterns you notice.`,
        },
      ],
    });

    const generatedQuestion =
      response.content[0].type === "text"
        ? response.content[0].text.trim()
        : STARTER_QUESTIONS[0];

    // Cache for today
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
