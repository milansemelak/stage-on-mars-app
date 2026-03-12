import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import { GenerateRequest, Play } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { question, mode, context, lang } = body;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      temperature: 1.0,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(question, mode, context, lang),
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
    return NextResponse.json(
      { error: "Failed to generate play. Please try again." },
      { status: 500 }
    );
  }
}
