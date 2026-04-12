import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { play_data, question, lang, client_name } = body;

    if (!play_data || !question) {
      return NextResponse.json(
        { error: "play_data and question are required" },
        { status: 400 }
      );
    }

    const code = generateCode();
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("shared_plays")
      .insert({
        code,
        play_data,
        question,
        lang: lang || "en",
        client_name: client_name || "",
      })
      .select()
      .single();

    if (error) {
      console.error("Shared play create error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, code: data.code });
  } catch (error) {
    console.error("Shared plays API error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
