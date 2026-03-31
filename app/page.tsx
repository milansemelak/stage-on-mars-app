"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { STORAGE_KEYS } from "@/lib/constants";

const PERSONAL_QUESTIONS_KEYS = [
  "personalQ1", "personalQ2", "personalQ3", "personalQ4", "personalQ5",
  "personalQ6", "personalQ7", "personalQ8", "personalQ9", "personalQ10",
] as const;

export default function Home() {
  const { t } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [suggestionIdx] = useState(() => Math.floor(Math.random() * PERSONAL_QUESTIONS_KEYS.length));
  const suggestion = t[PERSONAL_QUESTIONS_KEYS[suggestionIdx]] as string;

  // Logged-in users go straight to play
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/play");
    }
  }, [user, authLoading, router]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const q = question.trim() || suggestion;
    localStorage.setItem(STORAGE_KEYS.pendingQuestion, q);
    router.push("/auth/signup");
  }

  // Show nothing while checking auth (avoids flash)
  if (authLoading || user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-mars/30 border-t-mars rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center pt-12 sm:pt-0 sm:justify-center px-6 pb-10 sm:pb-24">
        <div className="max-w-xl w-full text-center space-y-6 sm:space-y-10 animate-fade-slide-up">

          {/* Formula — the core concept */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-mars/60 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
              {t.heroTagline}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              {t.heroFormula}
            </h1>
            <p className="text-white/35 text-sm sm:text-lg max-w-md mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>

          {/* How it works — 3 steps */}
          <div className="flex items-start justify-center gap-3 sm:gap-8 text-center max-w-lg mx-auto">
            <div className="flex-1 space-y-1.5 sm:space-y-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-mars/10 border border-mars/20 flex items-center justify-center mx-auto">
                <span className="text-mars text-xs sm:text-sm font-bold">1</span>
              </div>
              <p className="text-white/80 text-xs sm:text-sm font-semibold">{t.stepAsk}</p>
              <p className="text-white/30 text-[11px] sm:text-xs leading-relaxed hidden sm:block">{t.stepAskDesc}</p>
            </div>
            <div className="pt-3 sm:pt-5 text-white/10">
              <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
            </div>
            <div className="flex-1 space-y-1.5 sm:space-y-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-mars/10 border border-mars/20 flex items-center justify-center mx-auto">
                <span className="text-mars text-xs sm:text-sm font-bold">2</span>
              </div>
              <p className="text-white/80 text-xs sm:text-sm font-semibold">{t.stepPlay}</p>
              <p className="text-white/30 text-[11px] sm:text-xs leading-relaxed hidden sm:block">{t.stepPlayDesc}</p>
            </div>
            <div className="pt-3 sm:pt-5 text-white/10">
              <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
            </div>
            <div className="flex-1 space-y-1.5 sm:space-y-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-mars/10 border border-mars/20 flex items-center justify-center mx-auto">
                <span className="text-mars text-xs sm:text-sm font-bold">3</span>
              </div>
              <p className="text-white/80 text-xs sm:text-sm font-semibold">{t.stepSee}</p>
              <p className="text-white/30 text-[11px] sm:text-xs leading-relaxed hidden sm:block">{t.stepSeeDesc}</p>
            </div>
          </div>

          {/* Question input */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={t.placeholder}
              rows={2}
              className="w-full rounded-2xl bg-white/[0.06] border border-white/15 focus:border-mars/40 px-5 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors resize-none text-base sm:text-lg"
            />
            <button
              type="submit"
              className="w-full px-12 py-4 sm:py-5 rounded-2xl bg-mars hover:bg-mars-light text-white font-black text-base sm:text-lg uppercase tracking-[0.2em] transition-all duration-200 shadow-[0_4px_30px_rgba(255,85,0,0.4)] hover:shadow-[0_4px_40px_rgba(255,85,0,0.6)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.heroSubmit}
            </button>
          </form>

          {/* Question suggestion */}
          <button
            onClick={() => setQuestion(suggestion)}
            className="text-white/30 hover:text-white/50 text-sm transition-colors group"
          >
            {t.trySuggestion}:{" "}
            <span className="font-mercure italic text-white/40 group-hover:text-mars/60 transition-colors">
              &ldquo;{suggestion}&rdquo;
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
