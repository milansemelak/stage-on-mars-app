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

// Valid supernova code prefixes — any code matching PREFIX + number is valid
// e.g. SUPERNOVA_PREFIXES=PLAYER means PLAYER1, PLAYER2, PLAYER999 all work
const VALID_PREFIXES = (process.env.SUPERNOVA_CODES || "").split(",").map((c) => c.trim().toUpperCase()).filter(Boolean);

function isValidCode(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  return VALID_PREFIXES.some((prefix) => {
    if (normalized === prefix) return true; // exact match
    // Check if code is PREFIX + number (e.g. PLAYER1, PLAYER42)
    if (normalized.startsWith(prefix) && /^\d+$/.test(normalized.slice(prefix.length))) return true;
    return false;
  });
}

export async function POST(request: NextRequest) {
  try {
    const { code, userId } = await request.json();

    if (!code || !userId) {
      return NextResponse.json({ success: false, error: "Missing code or user." }, { status: 400 });
    }

    if (!isValidCode(code)) {
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
