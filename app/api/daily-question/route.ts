import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getAnthropicClient } from "@/lib/anthropic";

const STARTER_QUESTIONS: Record<string, string[]> = {
  en: [
    "What am I avoiding at work?",
    "What would I do today if nobody was watching?",
    "What conversation keeps replaying in my head?",
    "What would change if I said no more often?",
    "What do I keep saying I'll start tomorrow?",
    "What am I protecting that doesn't need protection?",
    "Why do I keep saying yes when I mean no?",
    "What would my team say about me if I wasn't in the room?",
  ],
  sk: [
    "Čomu sa v práci vyhýbam?",
    "Čo by som dnes robil, keby sa nikto nepozeral?",
    "Aký rozhovor sa mi stále prehráva v hlave?",
    "Čo by sa zmenilo, keby som častejšie povedal nie?",
    "Čo stále hovorím, že začnem zajtra?",
    "Čo chránim, čo ochranu nepotrebuje?",
    "Prečo stále hovorím áno, keď myslím nie?",
    "Čo by o mne povedal môj tím, keby som nebol v miestnosti?",
  ],
  cs: [
    "Čemu se v práci vyhýbám?",
    "Co bych dnes dělal, kdyby se nikdo nedíval?",
    "Jaký rozhovor se mi pořád přehrává v hlavě?",
    "Co by se změnilo, kdybych častěji řekl ne?",
    "Co pořád říkám, že začnu zítra?",
    "Co chráním, co ochranu nepotřebuje?",
    "Proč pořád říkám ano, když myslím ne?",
    "Co by o mně řekl můj tým, kdybych nebyl v místnosti?",
  ],
};

function getStarterQuestion(lang: string): string {
  const pool = STARTER_QUESTIONS[lang] || STARTER_QUESTIONS.en;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const refresh = url.searchParams.get("refresh") === "1";
    const lang = url.searchParams.get("lang") || "en";

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
      return NextResponse.json({ question: getStarterQuestion(lang) });
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

    const langInstruction = lang === "sk"
      ? "Odpovedaj VÝLUČNE po slovensky."
      : lang === "cs"
      ? "Odpovídej VÝHRADNĚ česky."
      : "Respond in English.";

    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      temperature: 0.8,
      system: `You generate one question for the Stage on Mars play simulator — a tool where people turn real questions into systemic plays with characters and perspectives.

The question MUST be something a real person would actually ask about their life, work, or relationships. It should be a question worth playing out on stage.

GOOD examples: "What am I avoiding at work?", "Why do I keep saying yes when I mean no?", "What does my team actually need from me?", "Am I in the right place?"
BAD examples: "What would your stage smell like?", "If you were a color what would you be?", "What does the universe whisper?" — these are meaningless nonsense. NEVER generate abstract/poetic/surreal questions.

${langInstruction}
Output ONLY the question. Max 12 words. No quotes.`,
      messages: [
        {
          role: "user",
          content: `Recent questions this person asked:\n${recentQuestions.join("\n")}\n\nRecent daily questions (DO NOT repeat these):\n${recentDailyQuestions.join("\n")}\n\nGenerate one new question that connects to their patterns but goes somewhere fresh. Must be a real, grounded question someone would genuinely want to explore.`,
        },
      ],
    });

    let generatedQuestion =
      response.content[0].type === "text"
        ? response.content[0].text.trim().replace(/^["']|["']$/g, "")
        : getStarterQuestion(lang);

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
    // Fallback to curated starter question on any error
    const fallbackLang = (() => {
      try { return new URL(request.url).searchParams.get("lang") || "en"; } catch { return "en"; }
    })();
    return NextResponse.json({ question: getStarterQuestion(fallbackLang) });
  }
}
