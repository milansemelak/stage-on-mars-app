"use client";

import { useState } from "react";
import QuestionInput from "@/components/QuestionInput";
import PlayCard from "@/components/PlayCard";
import { Play } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function PlayPage() {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState<"personal" | "business">("personal");
  const [play, setPlay] = useState<Play | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [askedQuestion, setAskedQuestion] = useState("");
  const { lang, t } = useI18n();

  async function generatePlay() {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setPlay(null);
    setAskedQuestion(question);

    try {
      const response = await fetch("/api/generate-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context, lang }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate play");
      }

      const data = await response.json();
      setPlay(data.plays[0]);

      // Save to localStorage
      const history = JSON.parse(
        localStorage.getItem("som-play-history") || "[]"
      );
      history.unshift({
        question,
        context,
        play: data.plays[0],
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

      <QuestionInput
        question={question}
        onChange={setQuestion}
        onSubmit={generatePlay}
        loading={loading}
        context={context}
        onContextChange={setContext}
      />

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {play && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white/80">
                {t.yourPlay}
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

          <PlayCard play={play} question={askedQuestion} />
        </div>
      )}
    </div>
  );
}
