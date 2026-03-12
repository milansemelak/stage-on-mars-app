"use client";

import { useState } from "react";
import QuestionInput from "@/components/QuestionInput";
import ModeSelector from "@/components/ModeSelector";
import PlayCard from "@/components/PlayCard";
import { Mode, Play } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function PlayPage() {
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<Mode>("guide");
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [askedQuestion, setAskedQuestion] = useState<string>("");
  const { lang, t } = useI18n();

  async function generatePlay() {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setPlays([]);
    setAskedQuestion(question);

    try {
      const response = await fetch("/api/generate-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, mode, lang }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate play");
      }

      const data = await response.json();
      setPlays(data.plays);

      // Save to localStorage
      const history = JSON.parse(
        localStorage.getItem("som-play-history") || "[]"
      );
      history.unshift({
        question,
        mode,
        plays: data.plays,
        timestamp: Date.now(),
      });
      localStorage.setItem(
        "som-play-history",
        JSON.stringify(history.slice(0, 20))
      );
    } catch {
      setError(t.errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t.headline}</h1>
        <p className="text-white/40 text-sm">{t.subheadline}</p>
      </div>

      <ModeSelector mode={mode} onChange={setMode} />
      <QuestionInput
        question={question}
        onChange={setQuestion}
        onSubmit={generatePlay}
        loading={loading}
      />

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {plays.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white/80">
                {plays.length === 1 ? t.yourPlay : t.playOptions}
              </h2>
              <p className="text-sm text-white/30 mt-0.5">
                {t.forQuestion}: &ldquo;{askedQuestion}&rdquo;
              </p>
            </div>
            <button
              onClick={generatePlay}
              disabled={loading}
              className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              {t.regenerate}
            </button>
          </div>

          {plays.map((play, i) => (
            <PlayCard
              key={i}
              play={play}
              index={plays.length > 1 ? i : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
