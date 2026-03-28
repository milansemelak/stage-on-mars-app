import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { MARS_SYSTEM_PROMPT, buildMarsPrompt } from "@/lib/prompt";
import { Play } from "@/lib/types";

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

type MarsRequest = {
  play: Play;
  question: string;
  lang?: "en" | "sk" | "cs";
  clientName?: string;
};

export async function POST(request: NextRequest) {
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
      max_tokens: 2048,
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

    let result: { simulation: string; perspectives: string[] };
    try {
      result = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Mars response");
      }
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
