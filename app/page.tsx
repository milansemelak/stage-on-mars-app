"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { STORAGE_KEYS } from "@/lib/constants";

export default function Home() {
  const { t } = useI18n();
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [digitalPlays, setDigitalPlays] = useState(0);

  // Count total plays generated (from all users on this device, as a proxy)
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.playHistory) || "[]");
      setDigitalPlays(history.length);
    } catch { /* */ }
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    router.push(`/play?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-24">
        <div className="max-w-xl w-full text-center space-y-8 animate-fade-slide-up">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-mars/70 text-xs font-bold uppercase tracking-[0.25em]">
                Stage on Mars
              </p>
              <p className="text-white/30 text-sm tracking-wide">
                {t.heroTagline}
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {t.heroFormula}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.heroPlaceholder}
              autoFocus
              className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-6 py-4 text-white text-center text-lg placeholder:text-white/20 focus:outline-none focus:border-mars/50 focus:bg-white/[0.06] transition-all"
            />
            <button
              type="submit"
              disabled={!question.trim()}
              className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase text-sm transition-all duration-300 ${
                question.trim()
                  ? "bg-mars hover:bg-mars-light text-white shadow-[0_4px_30px_rgba(255,85,0,0.4)] hover:shadow-[0_4px_40px_rgba(255,85,0,0.6)] scale-100 hover:scale-[1.01]"
                  : "bg-white/[0.04] text-white/15 cursor-not-allowed"
              }`}
            >
              {t.heroSubmit}
            </button>
          </form>
        </div>
      </section>

      {/* Credibility + Counter */}
      <section className="px-6 pb-20">
        <div className="max-w-md mx-auto animate-fade-slide-up stagger-3 text-center space-y-6">
          <p className="text-white/25 text-xs sm:text-sm leading-relaxed">
            {t.credibility}
          </p>

          {/* Play counter — only show digital when meaningful */}
          <div className="flex items-center justify-center gap-8 sm:gap-12">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">815<span className="text-white/30">+</span></p>
              <p className="text-white/15 text-[10px] uppercase tracking-widest mt-1">{t.counterLive}</p>
            </div>
            {digitalPlays >= 100 && (
              <>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-mars">{digitalPlays}</p>
                  <p className="text-white/15 text-[10px] uppercase tracking-widest mt-1">{t.counterDigital}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-12 pt-8 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-white/20 text-xs">
          <span className="tracking-wide">Stage on Mars</span>
          <a
            href="https://stageonmars.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/40 transition-colors"
          >
            stageonmars.com
          </a>
        </div>
      </footer>
    </div>
  );
}
