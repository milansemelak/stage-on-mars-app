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
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are writing a welcome message for a Stage on Mars crew invitation. Stage on Mars is an experiential method where teams play out real questions on stage using systemic play.

The company is "${company}" and the meta-question for the play is: "${question}".

Write a welcome message following this exact structure and tone:

1. Start with "Invitation to play." on its own line, then a blank line.
2. Address the crew warmly — acknowledge who they are and invite them into a space beyond roles, titles and ready-made answers.
3. State the shared meta-question they will explore.
4. Briefly explain the mechanics: "On Mars we use systemic play to experience the system itself. By stepping into different perspectives, we uncover patterns, challenge assumptions and open new ways forward that are difficult to see from within."
5. Describe what they will explore together, tailored to their meta-question.
6. Ask them to register and send one question they believe matters. Say: "Your question becomes part of the play."
7. End with: "This is not a workshop. It is a chance to play the future before it becomes real."

Tone: warm, inviting, slightly mysterious. No corporate language. No emojis. No quotes around the text. Speak directly to the crew.

IMPORTANT RULES:
- Always start with "Invitation to play." on its own line.
- Maximum 10 sentences total (including "Invitation to play." and the closing line).
- Keep it tight — around 100-120 words.`,
        },
      ],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch {
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
