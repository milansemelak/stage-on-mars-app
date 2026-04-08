import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { password } = await request.json();

    const supabase = await createServerSupabase();
    const { data: mission, error } = await supabase
      .from("missions")
      .select("password")
      .eq("code", code)
      .single();

    if (error || !mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    if (mission.password && mission.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
