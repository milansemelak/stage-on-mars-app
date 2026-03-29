"use client";

import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function Home() {
  const { t } = useI18n();
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Top bar — Log in */}
      {!user && (
        <div className="flex justify-end px-6 pt-4">
          <Link
            href="/auth/login"
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Log in
          </Link>
        </div>
      )}

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-24">
        <div className="max-w-xl w-full text-center space-y-10 animate-fade-slide-up">
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

          <Link
            href="/play"
            className="inline-block px-12 sm:px-16 py-4 sm:py-5 rounded-2xl bg-mars hover:bg-mars-light text-white font-black text-base sm:text-lg uppercase tracking-[0.2em] transition-all duration-200 shadow-[0_4px_30px_rgba(255,85,0,0.4)] hover:shadow-[0_4px_40px_rgba(255,85,0,0.6)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.heroSubmit}
          </Link>
        </div>
      </section>

      {/* Credibility + Counter */}
      <section className="px-6 pb-20">
        <div className="max-w-md mx-auto animate-fade-slide-up stagger-3 text-center space-y-6">
          <p className="text-white/25 text-xs sm:text-sm leading-relaxed">
            {t.credibility}
          </p>

          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">815<span className="text-white/30">+</span></p>
              <p className="text-white/15 text-[10px] uppercase tracking-widest mt-1">{t.counterLive}</p>
            </div>
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
