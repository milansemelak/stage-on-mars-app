import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const resend = getResend();
    await resend.emails.send({
      from: "Stage on Mars <welcome@stageonmars.com>",
      to: email,
      subject: "Welcome to Stage on Mars",
      html: buildWelcomeEmail(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Welcome email error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

function buildWelcomeEmail(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 60px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px;">

          <!-- Logo area -->
          <tr>
            <td align="center" style="padding-bottom: 48px;">
              <span style="font-size: 28px; font-weight: 800; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">
                STAGE ON MARS
              </span>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom: 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #FF5500, transparent);"></div>
            </td>
          </tr>

          <!-- Welcome text -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <h1 style="margin: 0 0 16px; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                Welcome, Player.
              </h1>
              <p style="margin: 0; font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.5);">
                You've just unlocked a new way to see.<br>
                Every question holds a world. Let's play it out.
              </p>
            </td>
          </tr>

          <!-- The formula -->
          <tr>
            <td style="padding-bottom: 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
                <tr>
                  <td align="center" style="padding: 32px 24px;">
                    <p style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,255,255,0.25);">
                      The Formula
                    </p>
                    <p style="margin: 0; font-size: 22px; font-weight: 600; color: #FF5500; letter-spacing: 1px;">
                      Question &times; Play = Perspective
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- How it works -->
          <tr>
            <td style="padding-bottom: 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 50%; background-color: rgba(255,85,0,0.15); color: #FF5500; font-size: 12px; font-weight: 700;">1</span>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.5;">
                            <strong style="color: #ffffff;">Ask a question</strong> — something real, something alive
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 50%; background-color: rgba(255,85,0,0.15); color: #FF5500; font-size: 12px; font-weight: 700;">2</span>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.5;">
                            <strong style="color: #ffffff;">Receive a play</strong> — a scene, characters, and your role
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 50%; background-color: rgba(255,85,0,0.15); color: #FF5500; font-size: 12px; font-weight: 700;">3</span>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.5;">
                            <strong style="color: #ffffff;">See what you couldn't see</strong> — a new perspective emerges
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding-bottom: 48px;">
              <a href="https://playbook.stageonmars.com/play" style="display: inline-block; padding: 16px 48px; background-color: #FF5500; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 1px; border-radius: 12px; text-transform: uppercase;">
                Start Playing
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom: 32px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center">
              <p style="margin: 0 0 8px; font-size: 12px; color: rgba(255,255,255,0.15);">
                &copy; ${new Date().getFullYear()} Stage on Mars. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.1);">
                What happens or doesn't happen is up to you.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
