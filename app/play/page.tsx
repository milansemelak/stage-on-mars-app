"use client";

import { useState, useEffect, useRef } from "react";
import QuestionInput from "@/components/QuestionInput";
import PlayCard from "@/components/PlayCard";
import { Play } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

const LOADING_MESSAGES_KEYS = [
  "loading1",
  "loading2",
  "loading3",
  "loading4",
  "loading5",
] as const;

const DAILY_QUESTIONS_KEYS = [
  "dailyQ1",
  "dailyQ2",
  "dailyQ3",
  "dailyQ4",
  "dailyQ5",
  "dailyQ6",
  "dailyQ7",
] as const;

export default function PlayPage() {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState<"personal" | "business">("personal");
  const [play, setPlay] = useState<Play | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [askedQuestion, setAskedQuestion] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const { lang, t } = useI18n();
  const playRef = useRef<HTMLDivElement>(null);

  // Random question suggestion — changes on each load/generate
  const dailyQuestion = t[DAILY_QUESTIONS_KEYS[questionIdx]];

  // Pick a random question on mount
  useEffect(() => {
    setQuestionIdx(Math.floor(Math.random() * DAILY_QUESTIONS_KEYS.length));
  }, []);

  // Load play count
  useEffect(() => {
    const history = JSON.parse(
      localStorage.getItem("som-play-history") || "[]"
    );
    setPlayCount(history.length);
  }, []);

  // Cycle loading messages
  useEffect(() => {
    if (!loading) return;
    setLoadingMsg(0);
    const interval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % LOADING_MESSAGES_KEYS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

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
        JSON.stringify(history.slice(0, 50))
      );
      setPlayCount(history.length);

      // Rotate question suggestion
      setQuestionIdx((prev) => (prev + 1) % DAILY_QUESTIONS_KEYS.length);

      // Scroll to play after a short delay
      setTimeout(() => {
        playRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch {
      setError(t.errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function useDailyQuestion() {
    setQuestion(dailyQuestion);
  }

  return (
    <div className="min-h-[calc(100vh-72px)]">
      {/* Input section */}
      <div className="pt-4 sm:pt-10">
        <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
          {!play && !loading && (
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

          {/* Daily question suggestion — only when no play */}
          {!play && !loading && (
            <button
              onClick={useDailyQuestion}
              className="mt-4 text-white/20 hover:text-white/50 text-sm transition-colors text-left"
            >
              Try: <span className="font-mercure italic">&ldquo;{dailyQuestion}&rdquo;</span>
            </button>
          )}

          {/* Play counter — only when no play showing */}
          {!play && !loading && playCount > 0 && (
            <div className="mt-3 text-white/10 text-xs">
              {playCount} {t.playsGenerated}
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mx-auto max-w-2xl px-5 sm:px-8 mt-12 sm:mt-16">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-8 h-8 border-2 border-mars/20 border-t-mars rounded-full animate-spin" />
            <p className="font-mercure text-white/40 text-sm sm:text-base italic animate-fade-in" key={loadingMsg}>
              {t[LOADING_MESSAGES_KEYS[loadingMsg]]}
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-auto max-w-2xl px-5 sm:px-8 mt-6">
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Play result — animated entrance */}
      {play && (
        <div ref={playRef} className="mx-auto w-full max-w-2xl px-5 sm:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-4 animate-fade-slide-up">
            <p className="text-sm text-white/25 italic truncate mr-4">
              &ldquo;{askedQuestion}&rdquo;
            </p>
            <button
              onClick={generatePlay}
              disabled={loading}
              className="text-xs text-mars-light/60 hover:text-mars-light transition-colors whitespace-nowrap border border-mars/20 rounded-lg px-3 py-1.5 hover:border-mars/40"
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
