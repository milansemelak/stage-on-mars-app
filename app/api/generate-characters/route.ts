import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a character designer for Stage on Mars — a Systemic Play method combining systemic constellations and theatrical improvisation.

Your job is to suggest characters for a Systemic Play based on a question. Characters are not people — they are forces, qualities, emotions, perspectives, or elements of the system being explored. Each player embodies one character.

## Character Design Principles
- Characters represent what is ALIVE in the system behind the question
- For personal questions: inner forces, emotions, parts of self, life energies
- For business questions: organizational forces, values, roles, tensions, resources
- Characters should be poetic and evocative, not literal
- Each character should have a clear essence that can be embodied physically
- Characters should create interesting tensions and relationships when placed together
- They should collectively map the field of the question

## Output Format
Return a JSON array of character objects:
[
  {
    "name": "Character Name",
    "essence": "One sentence describing what this character IS and embodies",
    "role": "How this character relates to the question/system",
    "energy": "quiet/loud/tense/flowing/grounded/searching/etc"
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
      `Design ${count} characters that collectively map the forces alive in this question. Make them diverse in energy and perspective — they should create interesting dynamics when placed together in a space.`,
      langInstruction,
      "",
      "Remember: return ONLY a JSON array of exactly " + count + " character objects. No other text.",
    ].join("\n");

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
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
