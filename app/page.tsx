"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    router.push(`/play?q=${encodeURIComponent(question.trim())}`);
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
      {/* Top bar — Log in */}
      <div className="flex justify-end px-6 pt-4">
        <Link
          href="/auth/login"
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          {t.authLogin}
        </Link>
      </div>

      {/* Hero — minimal */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        <div className="max-w-xl w-full text-center space-y-8 animate-fade-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            {t.heroHeadline}
          </h1>

          {/* Question input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={t.placeholder}
              rows={2}
              className="w-full rounded-2xl bg-white/[0.06] border border-white/15 focus:border-mars/40 px-5 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors resize-none text-base sm:text-lg"
            />
            <button
              type="submit"
              disabled={!question.trim()}
              className="inline-block px-12 sm:px-16 py-4 sm:py-5 rounded-2xl bg-mars hover:bg-mars-light disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg uppercase tracking-[0.2em] transition-all duration-200 shadow-[0_4px_30px_rgba(255,85,0,0.4)] hover:shadow-[0_4px_40px_rgba(255,85,0,0.6)] hover:scale-[1.02] active:scale-[0.98]"
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
