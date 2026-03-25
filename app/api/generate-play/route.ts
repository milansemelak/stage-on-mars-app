import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import { GenerateRequest, Play } from "@/lib/types";

const anthropic = new Anthropic();

async function callWithRetry(params: Anthropic.MessageCreateParamsNonStreaming, retries = 3): Promise<Anthropic.Message> {
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
  try {
    const body: GenerateRequest = await request.json();
    const { question, context, lang } = body;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const message = await callWithRetry({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      temperature: 1.0,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(question, context, lang),
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
