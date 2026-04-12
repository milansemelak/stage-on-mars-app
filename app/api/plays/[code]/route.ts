import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const supabase = await createServerSupabase();

    const { data: sharedPlay, error } = await supabase
      .from("shared_plays")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !sharedPlay) {
      return NextResponse.json(
        { error: "Shared play not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ sharedPlay });
  } catch (error) {
    console.error("Shared play fetch error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
