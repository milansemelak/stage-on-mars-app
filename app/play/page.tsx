"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuestionInput from "@/components/QuestionInput";
import PlayCard from "@/components/PlayCard";
import PerspectivesJournal from "@/components/PerspectivesJournal";
import DailyQuestionCard from "@/components/DailyQuestionCard";
import { Play, HistoryEntry } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { TRIAL_DAYS, STORAGE_KEYS } from "@/lib/constants";
import { usePlayHistory } from "@/hooks/usePlayHistory";

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

export default function PlayPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-mars/30 border-t-mars rounded-full animate-spin" />
      </div>
    }>
      <PlayPage />
    </Suspense>
  );
}

function PlayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [question, setQuestion] = useState("");
  const [clientName, setClientName] = useState("");
  const [context, setContext] = useState<"personal" | "business">("personal");
  const [play, setPlay] = useState<Play | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [askedQuestion, setAskedQuestion] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [accessStatus, setAccessStatus] = useState<"loading" | "active" | "trial-expired" | "no-account">("loading");
  const [questionIdx, setQuestionIdx] = useState(0);
  const { lang, t } = useI18n();
  const playRef = useRef<HTMLDivElement>(null);
  const generatingRef = useRef(false);
  const [followUpTrigger, setFollowUpTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<"play" | "journal">("play");

  // Random question suggestion
  const questionPool = context === "personal" ? PERSONAL_QUESTIONS_KEYS : BUSINESS_QUESTIONS_KEYS;
  const dailyQuestion = t[questionPool[questionIdx % questionPool.length]];

  useEffect(() => {
    setQuestionIdx(Math.floor(Math.random() * questionPool.length));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Read ?q= param or pending question from localStorage
  const initialQuestionHandled = useRef(false);
  useEffect(() => {
    if (initialQuestionHandled.current) return;

    const q = searchParams.get("q");
    const pending = localStorage.getItem(STORAGE_KEYS.pendingQuestion);

    if (q?.trim()) {
      initialQuestionHandled.current = true;
      setQuestion(q.trim());
      localStorage.removeItem(STORAGE_KEYS.pendingQuestion);
      window.history.replaceState({}, "", "/play");
    } else if (pending?.trim()) {
      // Pre-fill question from auth flow but don't auto-generate
      initialQuestionHandled.current = true;
      setQuestion(pending.trim());
      localStorage.removeItem(STORAGE_KEYS.pendingQuestion);
    }

    // Clean subscribed param from URL
    if (searchParams.get("subscribed") === "true") {
      window.history.replaceState({}, "", "/play");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Rotate suggestion when context changes
  useEffect(() => {
    setQuestionIdx(Math.floor(Math.random() * questionPool.length));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  const { history: playHistoryData, savePlay, updatePlay } = usePlayHistory(user?.id);
  const currentTimestampRef = useRef(0);
  const currentThreadIdRef = useRef<string | null>(null);

  // Determine access status
  useEffect(() => {
    if (authLoading) return;

    // No account → need to sign up
    if (!user) {
      setAccessStatus("no-account");
      return;
    }

    // If coming back from Stripe/code with ?subscribed=true, skip checks
    if (searchParams.get("subscribed") === "true") {
      setAccessStatus("active");
      return;
    }

    // Check subscription (Stripe + Supabase profile for master player code users)
    let resolved = false;

    fetch("/api/stripe/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (resolved) return;
        if (data.active) {
          resolved = true;
          setAccessStatus("active");
          return;
        }

        // Check Supabase profile (master player code users)
        try {
          const { createClient } = await import("@/lib/supabase");
          const sb = createClient();
          if (sb) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: profile } = await sb.from("profiles").select("is_subscribed").eq("id", user.id).single() as { data: any };
            if (profile?.is_subscribed) {
              resolved = true;
              setAccessStatus("active");
              return;
            }
          }
        } catch {}

        if (resolved) return;

        // No subscription — check trial period
        const createdAt = new Date(user.created_at || Date.now());
        const now = new Date();
        const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceCreation <= TRIAL_DAYS) {
          setAccessStatus("active");
        } else {
          setAccessStatus("trial-expired");
        }
      })
      .catch(() => {
        // If verification fails, fall back to trial check
        if (resolved) return;
        const createdAt = new Date(user.created_at || Date.now());
        const now = new Date();
        const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceCreation <= TRIAL_DAYS) {
          setAccessStatus("active");
        } else {
          setAccessStatus("trial-expired");
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  // Auto-generate when follow-up question is triggered
  useEffect(() => {
    if (followUpTrigger > 0 && question.trim() && accessStatus === "active") {
      setTimeout(() => generatePlay(), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followUpTrigger]);

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

    // No account → save question, redirect to signup
    if (!user) {
      localStorage.setItem(STORAGE_KEYS.pendingQuestion, question.trim());
      router.push("/auth/signup");
      return;
    }

    // Trial expired → save question, redirect to subscribe
    if (accessStatus === "trial-expired") {
      localStorage.setItem(STORAGE_KEYS.pendingQuestion, question.trim());
      router.push("/auth/subscribe");
      return;
    }

    generatingRef.current = true;
    setLoading(true);
    setError(null);
    setPlay(null);
    setAskedQuestion(question);

    // Fresh question → new thread; follow-up → reuse current thread
    const isFollowUp = followUpTrigger > 0 && currentThreadIdRef.current;
    if (!isFollowUp) {
      currentThreadIdRef.current = Date.now().toString(36);
    }

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

      // Save to server + localStorage
      const ts = Date.now();
      currentTimestampRef.current = ts;
      const rxNumber = `SOM-${ts.toString(36).toUpperCase().slice(-6)}`;
      savePlay({
        question,
        context,
        play: data.plays[0],
        timestamp: ts,
        rxNumber,
        clientName: clientName.trim() || undefined,
        threadId: currentThreadIdRef.current || undefined,
      });

      // Rotate question suggestion
      setQuestionIdx((prev) => (prev + 1) % questionPool.length);

      // Scroll to play
      setTimeout(() => {
        playRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch {
      setError(t.errorMessage);
    } finally {
      setLoading(false);
      generatingRef.current = false;
    }
  }, [question, context, lang, clientName, questionPool.length, t.errorMessage, user, accessStatus, router, savePlay]);

  function handlePlayUpdate(updatedPlay: Play) {
    setPlay(updatedPlay);
    if (currentTimestampRef.current) {
      updatePlay(currentTimestampRef.current, updatedPlay);
    }
  }

  function useDailyQuestion() {
    setQuestion(dailyQuestion);
  }

  // Loading spinner while auth is checking
  if (authLoading || accessStatus === "loading") {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-mars/30 border-t-mars rounded-full animate-spin" />
      </div>
    );
  }

  // No account gate
  if (accessStatus === "no-account") {
    return (
      <div className="min-h-[calc(100vh-72px)]">
        <div className="pt-8 sm:pt-16">
          <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
            <div className="mb-8 sm:mb-10">
              <h1 className="text-[28px] sm:text-[36px] font-black tracking-[-0.03em] leading-[1.1]">
                {t.headline}
              </h1>
              <p className="text-white/25 text-[13px] sm:text-[14px] mt-2 tracking-wide">
                {t.subheadline}
              </p>
            </div>
            <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/15 to-transparent" />
              <div className="p-6 sm:p-8 text-center space-y-5">
                <div className="space-y-2">
                  <p className="text-white/70 text-base sm:text-lg font-bold">
                    {t.accountRequiredTitle}
                  </p>
                  <p className="text-white/25 text-[13px] sm:text-[14px]">
                    {t.accountRequiredDesc}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      if (question.trim()) {
                        localStorage.setItem(STORAGE_KEYS.pendingQuestion, question.trim());
                      }
                      router.push("/auth/signup");
                    }}
                    className="w-full py-4 rounded-full bg-mars hover:bg-mars-light text-white font-black text-sm tracking-[0.15em] uppercase transition-all shadow-[0_0_40px_-8px_rgba(255,85,0,0.4)]"
                  >
                    {t.createAccount}
                  </button>
                  <button
                    onClick={() => {
                      if (question.trim()) {
                        localStorage.setItem(STORAGE_KEYS.pendingQuestion, question.trim());
                      }
                      router.push("/auth/login");
                    }}
                    className="text-white/20 hover:text-white/40 text-[12px] transition-colors"
                  >
                    {t.alreadyHaveAccount}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Trial expired gate
  if (accessStatus === "trial-expired") {
    return (
      <div className="min-h-[calc(100vh-72px)]">
        <div className="pt-8 sm:pt-16">
          <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
            <div className="mb-8 sm:mb-10">
              <h1 className="text-[28px] sm:text-[36px] font-black tracking-[-0.03em] leading-[1.1]">
                {t.headline}
              </h1>
              <p className="text-white/25 text-[13px] sm:text-[14px] mt-2 tracking-wide">
                {t.subheadline}
              </p>
            </div>
            <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/15 to-transparent" />
              <div className="p-6 sm:p-8 text-center space-y-5">
                <div className="space-y-2">
                  <p className="text-white/70 text-base sm:text-lg font-bold">
                    {t.trialExpiredTitle}
                  </p>
                  <p className="text-white/25 text-[13px] sm:text-[14px]">
                    {t.trialExpiredDesc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (question.trim()) {
                      localStorage.setItem(STORAGE_KEYS.pendingQuestion, question.trim());
                    }
                    router.push("/auth/subscribe");
                  }}
                  className="w-full py-4 rounded-full bg-mars hover:bg-mars-light text-white font-black text-sm tracking-[0.15em] uppercase transition-all shadow-[0_0_40px_-8px_rgba(255,85,0,0.4)]"
                >
                  {t.authSubscribe}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)]">
      {/* Tab bar */}
      <div className="mx-auto w-full max-w-2xl px-5 sm:px-8 pt-4 sm:pt-6">
        <div className="flex gap-6 border-b border-white/[0.06]">
          <button
            onClick={() => setActiveTab("play")}
            className={`pb-3 text-[13px] font-bold uppercase tracking-[0.15em] transition-all relative ${
              activeTab === "play" ? "text-white" : "text-white/25 hover:text-white/45"
            }`}
          >
            {t.playTab}
            {activeTab === "play" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-mars" />}
          </button>
          <button
            onClick={() => setActiveTab("journal")}
            className={`pb-3 text-[13px] font-bold uppercase tracking-[0.15em] transition-all relative ${
              activeTab === "journal" ? "text-white" : "text-white/25 hover:text-white/45"
            }`}
          >
            {t.journalTab}
            {activeTab === "journal" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-mars" />}
          </button>
        </div>
      </div>

      {activeTab === "journal" ? (
        <div className="mx-auto w-full max-w-2xl px-5 sm:px-8 py-6 sm:py-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
            {t.journalTitle}
          </h2>
          <PerspectivesJournal history={playHistoryData} />
        </div>
      ) : (
        <>
          {/* Input section */}
          <div className={`${!play && !loading ? "pt-4 sm:pt-10" : "pt-2 sm:pt-6"} transition-all`}>
            <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
              {!play && !loading && (
                <div className="mb-8 sm:mb-10">
                  <h1 className="text-[28px] sm:text-[36px] font-black tracking-[-0.03em] leading-[1.1]">
                    {t.headline}
                  </h1>
                  <p className="text-white/25 text-[13px] sm:text-[14px] mt-2 tracking-wide">
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

              {/* Daily question suggestion */}
              {!play && !loading && (
                <div className="mt-5 space-y-3">
                  {playHistoryData.length >= 3 ? (
                    <DailyQuestionCard
                      onUseQuestion={(q) => {
                        setQuestion(q);
                        setFollowUpTrigger((n) => n + 1);
                      }}
                    />
                  ) : (
                    <button
                      onClick={useDailyQuestion}
                      className="text-white/30 hover:text-white/50 text-sm transition-colors text-left group"
                    >
                      {t.trySuggestion}: <span className="font-mercure italic text-white/40 group-hover:text-mars/60 transition-colors">&ldquo;{dailyQuestion}&rdquo;</span>
                    </button>
                  )}

                  {playHistoryData.length > 0 && (
                    <div className="text-white/15 text-xs">
                      {playHistoryData.length} {t.playsGenerated}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Loading state */}
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

          {/* Play result */}
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
                  // Trigger auto-generation (increment counter to always fire)
                  setFollowUpTrigger((n) => n + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                clientName={clientName.trim() || undefined}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
