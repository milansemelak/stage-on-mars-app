import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  const validCode = process.env.ACCESS_CODE || "mars2025";

  if (code === validCode) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Invalid code" }, { status: 401 });
}
