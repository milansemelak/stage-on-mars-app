import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are the character generator of Stage on Mars.

Generate characters for a Systemic Play. Each character is just a NAME — maximum 2 words. Short, vivid, immediately evocative. Like a title someone can step into.

Examples: Evil Queen, Crazy President, Silent Witness, Burning Bridge, Broken Clock, Hungry Ghost, Lost Captain, Frozen River, Loud Silence, Golden Cage

RULES:
- Maximum 2 words per name
- No descriptions, no explanations
- Names should create tension and contrast when placed together
- Names should feel like someone you could become on a stage
- Together the characters should map what is alive in the question

## Output Format
Return a JSON array of objects with ONLY "name" and "energy":
[
  { "name": "Evil Queen", "energy": "burning" },
  { "name": "Silent Witness", "energy": "quiet" }
]

Energy options: quiet, loud, tense, flowing, grounded, searching, burning, frozen

Return ONLY valid JSON — no markdown, no explanation.`;

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
        ? " IMPORTANT: Generate ALL names in Slovak language (slovenčina)."
        : lang === "cs"
        ? " IMPORTANT: Generate ALL names in Czech language (čeština)."
        : "";

    const prompt = [
      `Generate exactly ${count} characters for this question:`,
      "",
      `"${question}"`,
      "",
      `Context: ${contextType}`,
      langInstruction,
      "",
      `Return ONLY a JSON array of exactly ${count} objects with "name" (max 2 words) and "energy". No other text.`,
    ].join("\n");

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate characters: ${message}` },
      { status: 500 }
    );
  }
}
