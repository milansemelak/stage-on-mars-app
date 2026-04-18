import { NextResponse } from "next/server";

// Reads Calendly availability for the Decisions on Mars event type and
// returns the next available slot as an ISO string. If the token or event
// type URI is missing, or the Calendly API fails, returns { slot: null }
// so the page can fall back to a static label.
//
// Env vars expected in .env.local:
//   CALENDLY_TOKEN              personal access token
//   CALENDLY_EVENT_TYPE_URI     e.g. https://api.calendly.com/event_types/UUID

export const revalidate = 600; // cache for 10 min at the edge

export async function GET() {
  const token = process.env.CALENDLY_TOKEN;
  const eventTypeUri = process.env.CALENDLY_EVENT_TYPE_URI;

  if (!token || !eventTypeUri) {
    return NextResponse.json({ slot: null, reason: "unconfigured" });
  }

  // Calendly requires start_time to be strictly in the future, and the
  // window must be strictly less than 7 days. Scan forward in ~6.9-day
  // chunks up to 60 days to find the first open slot.
  const BUFFER_MS = 60 * 1000; // 1 min buffer so start is always future
  const WINDOW_MS = 7 * 24 * 60 * 60 * 1000 - 60 * 1000; // just under 7 days
  const baseStart = Date.now() + BUFFER_MS;

  for (let chunk = 0; chunk < 9; chunk++) {
    const start = new Date(baseStart + chunk * WINDOW_MS);
    const end = new Date(start.getTime() + WINDOW_MS);

    const url = new URL("https://api.calendly.com/event_type_available_times");
    url.searchParams.set("event_type", eventTypeUri);
    url.searchParams.set("start_time", start.toISOString());
    url.searchParams.set("end_time", end.toISOString());

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      return NextResponse.json({ slot: null, reason: `calendly_${res.status}` });
    }

    const data = (await res.json()) as {
      collection?: Array<{ start_time: string; status: string }>;
    };
    const available = data.collection?.find((s) => s.status === "available");
    if (available) {
      return NextResponse.json({ slot: available.start_time });
    }
  }

  return NextResponse.json({ slot: null, reason: "no_availability" });
}
