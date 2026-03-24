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
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Input section — centered when no play, top when play exists */}
      <div
        className={`w-full ${
          play ? "pt-4 sm:pt-8" : "pt-4 sm:pt-12"
        }`}
      >
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
          {!play && (
            <div className="space-y-1 mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {t.headline}
              </h1>
              <p className="text-white/30 text-sm sm:text-base">
                {t.subheadline}
              </p>
            </div>
          )}

          <QuestionInput
            question={question}
            onChange={setQuestion}
            onSubmit={generatePlay}
            loading={loading}
            context={context}
            onContextChange={setContext}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-auto max-w-3xl px-5 sm:px-8 mt-6">
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Play result */}
      {play && (
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 py-6 sm:py-8 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/30">
              &ldquo;{askedQuestion}&rdquo;
            </p>
            <button
              onClick={generatePlay}
              disabled={loading}
              className="text-xs text-orange-400/70 hover:text-orange-400 transition-colors"
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
