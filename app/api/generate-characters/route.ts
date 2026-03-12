import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are the character oracle of Stage on Mars — a method where real people embody forces on a stage.

Your job: give players something to inhabit. Not a concept to represent — a way to BE. A player should read their character and immediately know how to stand, where their weight goes, what they want in the room.

## The two fields that matter most

**essence** — This is a PHYSICAL INSTRUCTION. How does this character exist in a body? What is their posture, their impulse, their way of moving? What do they do when no one is watching? Write it as something a player can immediately feel: "Stands very still and listens for the thing no one has said yet." / "Keeps moving, never settling, always reaching toward something just out of frame." / "Holds everything carefully, as if it might break, as if it already has." NOT: "Represents the tension between growth and stability."

**role** — One sentence: what does this character WANT or AVOID in the space? What is their drive when placed among the other characters? "Wants to be seen but turns away when someone looks." / "Tries to hold everything together even as it comes apart." NOT: "Embodies the organizational need for change."

## Character names
Poetic, specific, strange — something you couldn't predict but immediately recognize.
Avoid: Fear, Courage, The Leader, The Dreamer, The Goal
Aim for: The One Who Almost Left, What Remains After the Decision, The Version That Was Never Tried, The Ground Beneath the Argument

## Output Format
Return a JSON array of character objects:
[
  {
    "name": "Character Name",
    "essence": "Physical instruction — how to stand, move, and be this character",
    "role": "What this character wants or avoids among the others",
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
      `Each character should be immediately embodiable — a player reads it and knows how to stand, move, and what they want in the room. Make the characters pull against each other. Together they should map what is alive and unspoken in this question.`,
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate characters: ${message}` },
      { status: 500 }
    );
  }
}
