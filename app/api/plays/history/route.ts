import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { MAX_HISTORY } from "@/lib/constants";

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("plays")
      .select("*")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(MAX_HISTORY);

    if (error) {
      console.error("Fetch plays error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ plays: data || [], count: data?.length || 0 });
  } catch (error) {
    console.error("Plays history GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { question, context, play_data, timestamp, rx_number, client_name, thread_id } = body;

    if (!question || !play_data || !timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("plays")
      .insert({
        user_id: user.id,
        question,
        context: context || "personal",
        play_data,
        timestamp,
        rx_number: rx_number || null,
        client_name: client_name || null,
        thread_id: thread_id || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert play error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, success: true });
  } catch (error) {
    console.error("Plays history POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, timestamp, favorite, play_data } = body;

    // Support lookup by id or by timestamp (for entries migrated without id)
    const updates: Record<string, unknown> = {};
    if (typeof favorite === "boolean") updates.favorite = favorite;
    if (play_data) updates.play_data = play_data;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    let query = supabase.from("plays").update(updates).eq("user_id", user.id);
    if (id) {
      query = query.eq("id", id);
    } else if (timestamp) {
      query = query.eq("timestamp", timestamp);
    } else {
      return NextResponse.json({ error: "id or timestamp required" }, { status: 400 });
    }

    const { error } = await query;

    if (error) {
      console.error("Update play error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Plays history PATCH error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
