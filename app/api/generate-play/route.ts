import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildUserPrompt, buildValidationPrompt } from "@/lib/prompt";
import { GenerateRequest, Play } from "@/lib/types";
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

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: GenerateRequest = await request.json();
    const { question, context, lang, clientName, count } = body;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const message = await callWithRetry({
      model: "claude-sonnet-4-20250514",
      max_tokens: count === 3 ? 8192 : 4096,
      temperature: 1.0,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(question, context, lang, clientName, count),
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    let plays: Play[];
    try {
      plays = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        plays = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse play response");
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
              content: buildValidationPrompt(JSON.stringify(plays), lang),
            },
          ],
        });

        const validatedText = validationMsg.content[0].type === "text" ? validationMsg.content[0].text : "";
        try {
          const validated = JSON.parse(validatedText);
          if (Array.isArray(validated) && validated.length > 0) {
            plays = validated;
          }
        } catch {
          const jsonMatch = validatedText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            try {
              const validated = JSON.parse(jsonMatch[0]);
              if (Array.isArray(validated) && validated.length > 0) {
                plays = validated;
              }
            } catch { /* keep original */ }
          }
        }
      } catch (err) {
        console.error("Language validation failed, using original:", err);
      }
    }

    // Sanitize Cyrillic characters that sometimes leak into output
    const sanitizedJson = sanitizeCyrillic(JSON.stringify(plays));
    plays = JSON.parse(sanitizedJson);

    return NextResponse.json({ plays });
  } catch (error) {
    console.error("Error generating play:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate play: ${message}` },
      { status: 500 }
    );
  }
}
