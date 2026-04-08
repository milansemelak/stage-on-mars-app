import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { company, question } = await req.json();

    if (!company || !question) {
      return NextResponse.json({ error: "Missing company or question" }, { status: 400 });
    }

    const anthropic = getAnthropicClient();

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are writing a short welcome message for a Stage on Mars crew invitation. Stage on Mars is an experiential method where teams play out real questions on stage.

The company is "${company}" and the meta-question for the play is: "${question}".

Write a warm, concise welcome message (3-4 sentences max). Start with "Invitation to play." on its own line, then a blank line, then the message. The tone should be inviting, slightly mysterious, and exciting — like boarding a flight to somewhere unknown. Don't explain what Stage on Mars is. Don't use corporate language. Speak to the crew directly. No emojis. No quotes around the text.`,
        },
      ],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch {
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
