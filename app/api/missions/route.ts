import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

function generateCode(company: string): string {
  const slug = company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug}-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, question, date, location, group_size, venue, welcome_message, spotify_url, rules, host_name, host_email, time, captain, facilitator, dresscode, maps_url, password } = body;

    if (!company || !question || !date) {
      return NextResponse.json({ error: "Company, question, and date are required" }, { status: 400 });
    }

    const code = generateCode(company);
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("missions")
      .insert({
        code,
        company,
        question,
        date,
        location: location || "",
        group_size: group_size || "",
        venue: venue || "",
        welcome_message: welcome_message || "",
        spotify_url: spotify_url || "",
        rules: rules || "",
        host_name: host_name || "",
        host_email: host_email || "",
        time: time || "",
        captain: captain || "",
        facilitator: facilitator || "",
        dresscode: dresscode || "Dress to Play",
        maps_url: maps_url || "",
        password: password || "",
      })
      .select()
      .single();

    if (error) {
      console.error("Mission create error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      code: data.code,
      url: `/business/mission/${data.code}`,
    });
  } catch (error) {
    console.error("Mission API error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
