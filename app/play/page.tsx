"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QuestionInput from "@/components/QuestionInput";
import PlayCard from "@/components/PlayCard";
import { Play, HistoryEntry } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { MAX_HISTORY, STORAGE_KEYS } from "@/lib/constants";

const LOADING_MESSAGES_KEYS = [
  "loading1",
  "loading2",
  "loading3",
  "loading4",
  "loading5",
  "loading6",
] as const;

const PERSONAL_QUESTIONS_KEYS = [
  "personalQ1",
  "personalQ2",
  "personalQ3",
  "personalQ4",
  "personalQ5",
  "personalQ6",
  "personalQ7",
  "personalQ8",
  "personalQ9",
  "personalQ10",
] as const;

const BUSINESS_QUESTIONS_KEYS = [
  "businessQ1",
  "businessQ2",
  "businessQ3",
  "businessQ4",
  "businessQ5",
  "businessQ6",
  "businessQ7",
  "businessQ8",
  "businessQ9",
  "businessQ10",
] as const;

function PlaySkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden animate-fade-slide-up">
      <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-4 w-1/3" />
        </div>
        {/* Image */}
        <div className="space-y-2">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-16 w-full" />
        </div>
        {/* Characters */}
        <div className="space-y-3">
          <div className="skeleton h-3 w-20" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="skeleton h-16 w-full" />
            <div className="skeleton h-16 w-full" />
            <div className="skeleton h-16 w-full" />
            <div className="skeleton h-16 w-full" />
          </div>
        </div>
        {/* Author role */}
        <div className="space-y-2">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-12 w-full" />
        </div>
        {/* Ending */}
        <div className="space-y-2">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function PlayPage() {
  const [question, setQuestion] = useState("");
  const [clientName, setClientName] = useState("");
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
  const generatingRef = useRef(false);
  const pendingFollowUp = useRef(false);

  // Random question suggestion — aligned with current context
  const questionPool = context === "personal" ? PERSONAL_QUESTIONS_KEYS : BUSINESS_QUESTIONS_KEYS;
  const dailyQuestion = t[questionPool[questionIdx % questionPool.length]];

  // Pick a random question on mount
  useEffect(() => {
    setQuestionIdx(Math.floor(Math.random() * questionPool.length));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rotate suggestion when context changes
  useEffect(() => {
    setQuestionIdx(Math.floor(Math.random() * questionPool.length));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  // Load play count
  useEffect(() => {
    const history = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.playHistory) || "[]"
    );
    setPlayCount(history.length);
  }, []);

  // Auto-generate when follow-up question is set
  useEffect(() => {
    if (pendingFollowUp.current && question.trim()) {
      pendingFollowUp.current = false;
      // Small delay to let scroll finish
      setTimeout(() => generatePlay(), 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  // Cycle loading messages
  useEffect(() => {
    if (!loading) return;
    setLoadingMsg(0);
    const interval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % LOADING_MESSAGES_KEYS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  const generatePlay = useCallback(async () => {
    if (!question.trim() || generatingRef.current) return;

    generatingRef.current = true;
    setLoading(true);
    setError(null);
    setPlay(null);
    setAskedQuestion(question);

    try {
      const response = await fetch("/api/generate-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context, lang, clientName: clientName.trim() || undefined }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate play");
      }

      const data = await response.json();
      setPlay(data.plays[0]);

      // Save to localStorage
      const history: HistoryEntry[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.playHistory) || "[]"
      );
      const rxNumber = `SOM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      history.unshift({
        question,
        context,
        play: data.plays[0],
        timestamp: Date.now(),
        rxNumber,
        clientName: clientName.trim() || undefined,
      });
      localStorage.setItem(
        STORAGE_KEYS.playHistory,
        JSON.stringify(history.slice(0, MAX_HISTORY))
      );
      setPlayCount(Math.min(history.length, MAX_HISTORY));

      // Rotate question suggestion
      setQuestionIdx((prev) => (prev + 1) % questionPool.length);

      // Scroll to play after a short delay
      setTimeout(() => {
        playRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch {
      setError(t.errorMessage);
    } finally {
      setLoading(false);
      generatingRef.current = false;
    }
  }, [question, context, lang, clientName, questionPool.length, t.errorMessage]);

  function handlePlayUpdate(updatedPlay: Play) {
    setPlay(updatedPlay);
    const history: HistoryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.playHistory) || "[]");
    const idx = history.findIndex(
      (e) =>
        e.play.name === updatedPlay.name && e.question === askedQuestion
    );
    if (idx !== -1) {
      history[idx].play = updatedPlay;
      localStorage.setItem(STORAGE_KEYS.playHistory, JSON.stringify(history));
    }
  }

  function useDailyQuestion() {
    setQuestion(dailyQuestion);
  }

  return (
    <div className="min-h-[calc(100vh-72px)]">
      {/* Input section */}
      <div className={`${!play && !loading ? "pt-8 sm:pt-16" : "pt-4 sm:pt-10"} transition-all`}>
        <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
          {!play && !loading && (
            <div className="mb-8 sm:mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {t.headline}
              </h1>
              <p className="text-white/35 text-sm sm:text-base mt-1">
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
            clientName={clientName}
            onClientNameChange={setClientName}
          />

          {/* Daily question suggestion — only when no play */}
          {!play && !loading && (
            <div className="mt-5 space-y-2">
              <button
                onClick={useDailyQuestion}
                className="text-white/30 hover:text-white/50 text-sm transition-colors text-left group"
              >
                {t.trySuggestion}: <span className="font-mercure italic text-white/40 group-hover:text-mars/60 transition-colors">&ldquo;{dailyQuestion}&rdquo;</span>
              </button>

              {/* Play counter */}
              {playCount > 0 && (
                <div className="text-white/15 text-xs">
                  {playCount} {t.playsGenerated}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading state — skeleton */}
      {loading && (
        <div className="mx-auto max-w-2xl px-5 sm:px-8 mt-4 sm:mt-6">
          <div className="py-2 flex items-center justify-center">
            <p className="font-mercure text-white/40 text-sm sm:text-base italic animate-fade-in text-center" key={loadingMsg}>
              {t[LOADING_MESSAGES_KEYS[loadingMsg]]}
            </p>
          </div>
          <PlaySkeleton />
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

          <PlayCard
            play={play}
            question={askedQuestion}
            onPlayUpdate={handlePlayUpdate}
            onAskQuestion={(q) => {
              setQuestion(q);
              setPlay(null);
              pendingFollowUp.current = true;
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            clientName={clientName.trim() || undefined}
          />
        </div>
      )}
    </div>
  );
}
