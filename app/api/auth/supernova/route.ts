import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service-level access to update profiles
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

// Valid supernova codes — add codes here
const VALID_CODES = new Set(
  (process.env.SUPERNOVA_CODES || "").split(",").map((c) => c.trim().toUpperCase()).filter(Boolean)
);

export async function POST(request: NextRequest) {
  try {
    const { code, userId } = await request.json();

    if (!code || !userId) {
      return NextResponse.json({ success: false, error: "Missing code or user." }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    if (!VALID_CODES.has(normalizedCode)) {
      return NextResponse.json({ success: false, error: "Invalid Supernova code." });
    }

    // Mark user as subscribed in profiles table
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("profiles")
      .update({ is_subscribed: true, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      console.error("Failed to update profile:", error);
      return NextResponse.json({ success: false, error: "Failed to activate. Try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Supernova code error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
