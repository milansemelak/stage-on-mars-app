"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

type Character = {
  name: string;
  energy: string;
};

const energyColors: Record<string, string> = {
  quiet: "border-blue-500/40 bg-blue-500/5",
  loud: "border-orange-500/40 bg-orange-500/5",
  tense: "border-red-500/40 bg-red-500/5",
  flowing: "border-cyan-500/40 bg-cyan-500/5",
  grounded: "border-green-500/40 bg-green-500/5",
  searching: "border-purple-500/40 bg-purple-500/5",
};

function getEnergyStyle(energy: string) {
  const key = energy.toLowerCase().split("/")[0].trim();
  return energyColors[key] || "border-white/20 bg-white/5";
}

export default function CharacterGenerator() {
  const { lang, t } = useI18n();
  const [question, setQuestion] = useState("");
  const [playerCount, setPlayerCount] = useState(4);
  const [context, setContext] = useState<"personal" | "business">("personal");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setCharacters([]);

    try {
      const res = await fetch("/api/generate-characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, playerCount, context, lang }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCharacters(data.characters);
    } catch {
      setError(t.errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{t.characterGeneratorTitle}</h2>
        <p className="text-white/40 text-sm">{t.characterGeneratorSub}</p>
      </div>

      <div className="space-y-4">
        {/* Question */}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.characterPlaceholder}
          rows={2}
          className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              generate();
            }
          }}
        />

        {/* Controls row */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Personal / Business toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/20">
            <button
              onClick={() => setContext("personal")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                context === "personal"
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {t.personal}
            </button>
            <button
              onClick={() => setContext("business")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                context === "business"
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {t.business}
            </button>
          </div>

          {/* Player count */}
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-sm">{t.players}:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
                className="w-7 h-7 rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors text-lg leading-none flex items-center justify-center"
              >
                −
              </button>
              <span className="text-white font-medium w-4 text-center">{playerCount}</span>
              <button
                onClick={() => setPlayerCount(Math.min(12, playerCount + 1))}
                className="w-7 h-7 rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors text-lg leading-none flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading || !question.trim()}
            className="ml-auto px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t.generating}
              </span>
            ) : (
              t.generateCharacters
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {characters.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-white/30 uppercase tracking-wider">{t.characters} — {characters.length}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {characters.map((char, i) => (
              <div
                key={i}
                className={`rounded-lg border px-4 py-3 flex items-center justify-between ${getEnergyStyle(char.energy)}`}
              >
                <span className="font-semibold text-white">{char.name}</span>
                <span className="text-xs text-white/30 italic">{char.energy}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
