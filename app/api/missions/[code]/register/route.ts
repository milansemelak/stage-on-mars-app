import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "play@stageonmars.com";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { name, email, question } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const supabase = await createServerSupabase();

    // Find mission
    const { data: mission, error: missionError } = await supabase
      .from("missions")
      .select("*")
      .eq("code", code)
      .single();

    if (missionError || !mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    // Insert registration
    const { error: regError } = await supabase
      .from("crew_registrations")
      .insert({
        mission_id: mission.id,
        name,
        email,
        question: question || "",
      });

    if (regError) {
      if (regError.code === "23505") {
        return NextResponse.json({ error: "You are already registered for this mission" }, { status: 409 });
      }
      console.error("Registration error:", regError);
      return NextResponse.json({ error: regError.message }, { status: 500 });
    }

    // Get crew count
    const { count } = await supabase
      .from("crew_registrations")
      .select("*", { count: "exact", head: true })
      .eq("mission_id", mission.id);

    // Send emails
    const resend = getResend();
    const missionDate = new Date(mission.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    await Promise.allSettled([
      resend.emails.send({
        from: "Stage on Mars <onboarding@resend.dev>",
        to: email,
        subject: `You're on the manifest — ${mission.company} on Mars`,
        html: buildCrewEmail(name, mission.company, missionDate, mission.location || mission.venue, code),
      }),
      resend.emails.send({
        from: "Stage on Mars <onboarding@resend.dev>",
        to: ADMIN_EMAIL,
        subject: `New crew: ${name} — ${mission.company} on Mars`,
        html: buildAdminEmail(name, email, question, mission.company, count || 0),
      }),
    ]);

    return NextResponse.json({ success: true, crew_count: count || 0 });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

function buildCrewEmail(name: string, company: string, date: string, location: string, code: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 60px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px;">
          <tr>
            <td align="center" style="padding-bottom: 48px;">
              <span style="font-size: 28px; font-weight: 800; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">STAGE ON MARS</span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #FF5500, transparent);"></div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <p style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,85,0,0.6);">Boarding Confirmed</p>
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #ffffff;">You're on the manifest, ${name.split(" ")[0]}.</h1>
              <p style="margin: 0; font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.5);">
                Your seat on the flight to Mars is confirmed.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <p style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,85,0,0.4);">Mission</p>
                          <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #ffffff;">${company} on Mars</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <p style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,85,0,0.4);">Date</p>
                          <p style="margin: 4px 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">${date}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,85,0,0.4);">Location</p>
                          <p style="margin: 4px 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">${location}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom: 48px;">
              <a href="https://playbook.stageonmars.com/business/mission/${code}" style="display: inline-block; padding: 16px 48px; background-color: #FF5500; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: 1px; border-radius: 12px; text-transform: uppercase;">View Mission</a>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 32px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent);"></div>
            </td>
          </tr>
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.1);">What happens or doesn't happen is up to you.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildAdminEmail(name: string, email: string, question: string, company: string, crewCount: number): string {
  const now = new Date().toLocaleString("en-GB", { timeZone: "Europe/Prague" });
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px;">
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,85,0,0.6);">New Crew Member — ${company} on Mars</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 8px;">
              <p style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">${name}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 16px;">
              <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.4);">${email}</p>
            </td>
          </tr>
          ${question ? `<tr>
            <td style="padding-bottom: 16px;">
              <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.5);">Question: "${question}"</p>
            </td>
          </tr>` : ""}
          <tr>
            <td>
              <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.3);">Crew count: ${crewCount} · ${now} (Prague)</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
