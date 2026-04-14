import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { HistoryEntry } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const entries: HistoryEntry[] = body.entries;

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ migrated: 0, skipped: 0 });
    }

    const rows = entries.map((e) => ({
      user_id: user.id,
      question: e.question,
      context: e.context || "personal",
      play_data: e.play,
      timestamp: e.timestamp,
      favorite: e.favorite || false,
      rx_number: e.rxNumber || null,
      client_name: e.clientName || null,
      thread_id: e.threadId || null,
    }));

    // Bulk insert, skip duplicates via unique index on (user_id, timestamp)
    const { data, error } = await supabase
      .from("plays")
      .upsert(rows, { onConflict: "user_id,timestamp", ignoreDuplicates: true })
      .select("id");

    if (error) {
      console.error("Migration error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const migrated = data?.length || 0;
    return NextResponse.json({ migrated, skipped: entries.length - migrated });
  } catch (error) {
    console.error("Migration API error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
