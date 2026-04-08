import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const supabase = await createServerSupabase();

    const { data: mission, error } = await supabase
      .from("missions")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    const { count } = await supabase
      .from("crew_registrations")
      .select("*", { count: "exact", head: true })
      .eq("mission_id", mission.id);

    return NextResponse.json({ mission, crew_count: count || 0 });
  } catch (error) {
    console.error("Mission fetch error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("missions")
      .update(body)
      .eq("code", code)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data || data.length === 0) return NextResponse.json({ error: "Mission not found or update blocked by RLS" }, { status: 404 });
    return NextResponse.json({ mission: data[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
