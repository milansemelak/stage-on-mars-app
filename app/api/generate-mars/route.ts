import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { MARS_SYSTEM_PROMPT, buildMarsPrompt, buildValidationPrompt } from "@/lib/prompt";
import { Play } from "@/lib/types";
import { rateLimit } from "@/lib/rate-limit";
import { getAnthropicClient } from "@/lib/anthropic";
import { sanitizeCyrillic } from "@/lib/sanitize";

async function callWithRetry(params: Anthropic.MessageCreateParamsNonStreaming, retries = 3): Promise<Anthropic.Message> {
  const anthropic = getAnthropicClient();
  for (let i = 0; i < retries; i++) {
    try {
      return await anthropic.messages.create(params);
    } catch (error: unknown) {
      const isOverloaded = error instanceof Error && error.message.includes("529");
      const isRateLimit = error instanceof Error && error.message.includes("rate");
      if ((isOverloaded || isRateLimit) && i < retries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries reached");
}

type MarsRequest = {
  play: Play;
  question: string;
  lang?: "en" | "sk" | "cs";
  clientName?: string;
};

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: MarsRequest = await request.json();
    const { play, question, lang, clientName } = body;

    if (!play || !question?.trim()) {
      return NextResponse.json(
        { error: "Play and question are required" },
        { status: 400 }
      );
    }

    const message = await callWithRetry({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      temperature: 1.0,
      system: MARS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildMarsPrompt(play, question, lang, clientName),
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Mars response");
      }
    }

    // Language validation pass for SK/CS — fix invented words and grammar
    if (lang === "sk" || lang === "cs") {
      try {
        const validationMsg = await callWithRetry({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          temperature: 0,
          messages: [
            {
              role: "user",
              content: buildValidationPrompt(JSON.stringify(parsed), lang),
            },
          ],
        });

        const validatedText = validationMsg.content[0].type === "text" ? validationMsg.content[0].text : "";
        try {
          const validated = JSON.parse(validatedText);
          if (validated && typeof validated === "object") {
            parsed = validated;
          }
        } catch {
          const jsonMatch = validatedText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const validated = JSON.parse(jsonMatch[0]);
              if (validated && typeof validated === "object") {
                parsed = validated;
              }
            } catch { /* keep original */ }
          }
        }
      } catch (err) {
        console.error("Language validation failed, using original:", err);
      }
    }

    // Repair pass — if perspectives < 4 or no author perspective, ask LLM to add missing
    const playCharacters = (play.characters || []).map((c) => c.name.toLowerCase());
    const perspectivesArr = Array.isArray(parsed.perspectives) ? parsed.perspectives as Array<{ character?: string; insight?: string }> : [];
    const hasAuthor = perspectivesArr.some((p) => {
      const c = (p?.character || "").toLowerCase();
      if (!c) return false;
      return !playCharacters.includes(c);
    });
    if (perspectivesArr.length < 4 || !hasAuthor) {
      const authorLabel = clientName || (lang === "sk" || lang === "cs" ? "Autor" : "The Author");
      try {
        const repairMsg = await callWithRetry({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          temperature: 0.8,
          system: MARS_SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: `Here is a play response that is missing the author perspective or has fewer than 4 perspectives. Return a FIXED JSON that preserves simulationSteps and followUpQuestion unchanged, but has EXACTLY 4 perspectives in this exact order: [author, character, character, character]. The author perspective MUST have "character": "${authorLabel}" and be a first-person realization from inside the play. The other 3 must each be paired with a DIFFERENT character from this list: ${(play.characters || []).map(c => c.name).join(", ")}. Language: ${lang || "en"}. Return ONLY JSON, no markdown.\n\nOriginal play context:\nQuestion: "${question}"\nPlay: ${play.name}\nAuthor's Role: ${play.authorRole}\n\nOriginal response:\n${JSON.stringify(parsed)}`,
            },
          ],
        });
        const repairText = repairMsg.content[0].type === "text" ? repairMsg.content[0].text : "";
        let repaired: Record<string, unknown> | null = null;
        try {
          repaired = JSON.parse(repairText);
        } catch {
          const jsonMatch = repairText.match(/\{[\s\S]*\}/);
          if (jsonMatch) { try { repaired = JSON.parse(jsonMatch[0]); } catch { /* noop */ } }
        }
        if (repaired && Array.isArray((repaired as Record<string, unknown>).perspectives) && ((repaired as Record<string, unknown>).perspectives as unknown[]).length === 4) {
          parsed = repaired as Record<string, unknown>;
        }
      } catch (err) {
        console.error("Repair pass failed, using original:", err);
      }
    }

    // Sanitize Cyrillic characters that sometimes leak into output
    const sanitizedJson = sanitizeCyrillic(JSON.stringify(parsed));
    parsed = JSON.parse(sanitizedJson);

    // Build result with backward compat — produce both simulation (string) and simulationSteps
    const result: Record<string, unknown> = {
      perspectives: parsed.perspectives,
      followUpQuestion: parsed.followUpQuestion || null,
    };

    if (parsed.simulationSteps && Array.isArray(parsed.simulationSteps)) {
      result.simulationSteps = parsed.simulationSteps;
      // Also produce flat simulation string for text display / export
      result.simulation = (parsed.simulationSteps as { narration: string }[])
        .map((s) => s.narration)
        .join(" ");
    } else if (parsed.simulation) {
      // Old format fallback
      result.simulation = parsed.simulation;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating Mars perspective:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate: ${message}` },
      { status: 500 }
    );
  }
}
