import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are the character oracle of Stage on Mars — a method where real people embody forces, and a question reveals itself through those bodies in space.

Your job: conjure characters for a Systemic Play. Characters are not people. They are not roles. They are what is ALIVE inside the question — forces, contradictions, silences, energies, archetypes, wounds, thresholds.

## What makes a great character
- It has a quality you can FEEL in your body when you imagine becoming it
- It's specific enough to be strange, universal enough to be recognized
- It shouldn't be named after a job title or a literal function
- The name should be poetic and precise — "The Weight That Never Asked Permission", "The One Who Stayed", "First Light Before the Decision"
- The essence should be felt, not explained
- Characters should pull against each other — tension, longing, opposition
- Together they should map what is alive but unspoken in the system

## Think beyond the obvious
Obvious (avoid): Fear, Courage, The Boss, The Team, The Goal
Alive (aim for): The Silence Between Two Decisions, The Version Who Left, The Door That Was Always There, The Thing That Keeps Moving Even When Told to Stop, The Older Brother of the Future

## Output Format
Return a JSON array of character objects:
[
  {
    "name": "Character Name",
    "essence": "One vivid sentence — what this character IS and what it feels like to be it",
    "role": "How this character relates to or pulls on the question",
    "energy": "quiet/loud/tense/flowing/grounded/searching/burning/frozen/orbiting/etc"
  }
]

Return ONLY valid JSON — no markdown, no explanation. Just the array.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, playerCount, context, lang } = body;

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const count = Math.max(2, Math.min(12, parseInt(playerCount) || 4));
    const contextType = context === "business" ? "business/organizational" : "personal";

    const langInstruction =
      lang === "sk"
        ? " IMPORTANT: Generate ALL content (name, essence, role, energy) in Slovak language (slovenčina)."
        : lang === "cs"
        ? " IMPORTANT: Generate ALL content (name, essence, role, energy) in Czech language (čeština)."
        : "";

    const prompt = [
      `Generate exactly ${count} characters for a Systemic Play exploring this question:`,
      "",
      `"${question}"`,
      "",
      `Context type: ${contextType}`,
      "",
      `Conjure ${count} characters that collectively map what is alive and unspoken in this question. Make them strange, specific, and embodiable — they should feel inevitable once named, yet surprising. They should create genuine tension and pull when placed together in a space.`,
      langInstruction,
      "",
      "Remember: return ONLY a JSON array of exactly " + count + " character objects. No other text.",
    ].join("\n");

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      temperature: 1.0,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    let characters;
    try {
      characters = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        characters = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse characters response");
      }
    }

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("Error generating characters:", error);
    return NextResponse.json(
      { error: "Failed to generate characters. Please try again." },
      { status: 500 }
    );
  }
}
