import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

let cachedKey: string | null = null;

function getApiKey(): string {
  if (cachedKey) return cachedKey;

  // Try process.env first
  let key = process.env.ANTHROPIC_API_KEY;

  // Fallback: read .env.local directly (Next.js 16 Turbopack workaround)
  if (!key) {
    try {
      const envPath = path.join(process.cwd(), ".env.local");
      const content = fs.readFileSync(envPath, "utf8");
      const match = content.match(/^ANTHROPIC_API_KEY=(.+)$/m);
      if (match) key = match[1].trim();
    } catch {
      /* ignore */
    }
  }

  if (key) cachedKey = key;
  return key || "";
}

export function getAnthropicClient(): Anthropic {
  return new Anthropic({
    apiKey: getApiKey(),
  });
}
