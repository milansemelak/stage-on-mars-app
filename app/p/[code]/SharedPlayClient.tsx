"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import type { Play, Perspective, Character } from "@/lib/types";
import StageSimulation from "@/components/StageSimulation";

type SharedPlayData = {
  id: string;
  code: string;
  play_data: Play;
  question: string;
  lang: string;
  client_name: string;
  created_at: string;
};

export default function SharedPlayClient({ code }: { code: string }) {
  const { t, setLang } = useI18n();
  const [data, setData] = useState<SharedPlayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/plays/${code}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((json) => {
        setData(json.sharedPlay);
        if (json.sharedPlay?.lang) {
          const lang = json.sharedPlay.lang as "en" | "sk" | "cs";
          setLang(lang);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [code, setLang]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-mars/30 border-t-mars rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
        <img src="/logo.png" alt="Stage On Mars" className="h-10 sm:h-14 w-auto invert mb-8" />
        <h1 className="text-white text-[22px] sm:text-[28px] font-black tracking-[-0.03em] mb-3">
          {t.playNotFound}
        </h1>
        <p className="text-white/50 text-sm mb-8 text-center max-w-md">
          {t.playNotFoundDesc}
        </p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-full bg-mars hover:bg-mars-light text-white text-[12px] font-bold uppercase tracking-[0.15em] transition-all"
        >
          {t.goHome}
        </a>
      </div>
    );
  }

  const play = data.play_data;
  const question = data.question;
  const clientName = data.client_name;

  const structured = (play.perspectives || [])
    .map((p) => (typeof p === "object" ? (p as Perspective) : null))
    .filter((p): p is Perspective => p !== null);

  const isAuthorPerspective = (sp: Perspective) => {
    const matched = play.characters.find(
      (c: Character) => c.name.toLowerCase() === sp.character.toLowerCase()
    );
    return !matched && !!sp.character;
  };
  const authorP = structured.find(isAuthorPerspective);
  const charPs = structured.filter((p) => !isAuthorPerspective(p));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED]">
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <header className="border-b border-white/[0.06] px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Stage On Mars" className="h-6 sm:h-8 w-auto invert" />
          </a>
          <span className="text-white/30 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold">
            {t.sharedPlay}
          </span>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">

          <div className="mb-8 sm:mb-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center px-5 sm:px-7 py-3 border-b border-white/[0.04]">
              <div className="inline-flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-mars" />
                <p className="text-mars/60 text-[10px] uppercase tracking-[0.25em] font-bold">
                  {t.sharedPlay}
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-7 py-6 sm:py-8">
              <h1 className="text-[26px] sm:text-[34px] font-black tracking-[-0.03em] leading-[1.05] mb-2">
                {play.name}
              </h1>

              <p className="font-mercure italic text-white/35 text-[13px] sm:text-[14px] leading-[1.5]">
                &ldquo;{question}&rdquo;
              </p>

              {play.image && (
                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                  <p className="text-mars text-[10px] uppercase tracking-[0.3em] font-black mb-2.5">
                    {t.theImage}
                  </p>
                  <p className="font-mercure italic text-white/75 text-[15px] sm:text-[16px] leading-[1.55]">
                    {play.image}
                  </p>
                </div>
              )}

              {play.mood && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {play.mood.split(/[,·]/).map((m, i) => {
                    const tag = m.trim();
                    if (!tag) return null;
                    return (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-mars text-black text-[10px] font-black uppercase tracking-[0.15em] shadow-[0_2px_12px_rgba(255,85,0,0.25)]"
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}

              {play.characters && play.characters.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                  <p className="text-mars text-[10px] uppercase tracking-[0.3em] font-black mb-3">
                    {t.characters}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {clientName && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[rgba(255,215,0,0.12)] border border-[rgba(255,215,0,0.55)] shadow-[0_0_16px_rgba(255,215,0,0.08)]">
                        <div className="w-2 h-2 rounded-full bg-[rgba(255,215,0,1)] shadow-[0_0_6px_rgba(255,215,0,0.8)]" />
                        <span className="text-[rgba(255,230,130,1)] text-[12px] font-bold">
                          {clientName}
                        </span>
                      </div>
                    )}
                    {play.characters.map((c: Character, i: number) => {
                      const isAbstract = c.description?.toLowerCase() === "abstract";
                      return (
                        <div
                          key={i}
                          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border ${
                            isAbstract
                              ? "bg-white/[0.06] border-white/40"
                              : "bg-mars/[0.15] border-mars/60"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isAbstract
                                ? "bg-white"
                                : "bg-mars shadow-[0_0_6px_rgba(255,85,0,0.6)]"
                            }`}
                          />
                          <span
                            className={`text-[12px] font-bold ${
                              isAbstract ? "text-white" : "text-mars-light"
                            }`}
                          >
                            {c.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {play.simulation && play.simulationSteps && (
            <div className="rounded-2xl border border-white/[0.06] bg-[#060606] overflow-hidden mb-8 sm:mb-10">
              <div className="p-4 sm:p-6">
                <StageSimulation
                  simulationSteps={play.simulationSteps}
                  characters={play.characters}
                  simulation={play.simulation}
                  clientName={clientName || undefined}
                />
              </div>
            </div>
          )}

          {structured.length > 0 && (
            <div className="rounded-2xl border border-mars/[0.12] bg-gradient-to-b from-mars/[0.04] to-transparent px-4 py-7 sm:p-10">
              <div className="text-center mb-6 sm:mb-8">
                <p className="text-mars/60 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold mb-2">
                  {t.whatTheStageRevealed}
                </p>
                <h3 className="font-mercure italic text-white/85 text-[18px] sm:text-[26px] leading-[1.25]">
                  {t.landingStageShowedYou}
                </h3>
              </div>

              {authorP && (
                <div
                  className="relative rounded-2xl border-2 border-[rgba(255,215,0,0.35)] bg-gradient-to-b from-[rgba(255,215,0,0.08)] to-[rgba(255,215,0,0.02)] px-5 py-8 sm:p-10 shadow-[0_0_40px_-16px_rgba(255,215,0,0.35)] sm:shadow-[0_0_80px_-20px_rgba(255,215,0,0.35)] mb-6 sm:mb-8 mt-3"
                  style={{ animation: "fadeIn 0.6s ease 0s both" }}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 max-w-[calc(100%-24px)] px-2.5 sm:px-3 py-1 rounded-full bg-black border border-[rgba(255,215,0,0.5)] whitespace-nowrap overflow-hidden">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em] sm:tracking-[0.25em] text-[rgba(255,215,0,0.95)] truncate block">
                      {authorP.character} · {t.landingYouBadge}
                    </span>
                  </div>
                  <p className="text-white text-[17px] sm:text-[24px] leading-[1.45] sm:leading-[1.4] font-mercure italic text-center">
                    {authorP.insight}
                  </p>
                </div>
              )}

              {charPs.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="h-px flex-1 bg-white/[0.08]" />
                    <span className="text-white/35 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">
                      {t.characters}
                    </span>
                    <div className="h-px flex-1 bg-white/[0.08]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {charPs.map((sp, i) => {
                      const matched = play.characters.find(
                        (c: Character) =>
                          c.name.toLowerCase() === sp.character.toLowerCase()
                      );
                      const isAbstract =
                        matched?.description?.toLowerCase() === "abstract";
                      const accent = isAbstract
                        ? {
                            dot: "bg-white/70",
                            text: "text-white/70",
                            border: "border-white/[0.12]",
                            bg: "bg-white/[0.02]",
                          }
                        : {
                            dot: "bg-mars shadow-[0_0_6px_rgba(255,85,0,0.5)]",
                            text: "text-mars",
                            border: "border-mars/20",
                            bg: "bg-mars/[0.04]",
                          };
                      return (
                        <div
                          key={i}
                          className={`rounded-xl border ${accent.border} ${accent.bg} p-4 sm:p-5`}
                          style={{
                            animation: `fadeIn 0.6s ease ${(i + 1) * 0.15}s both`,
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${accent.dot}`}
                            />
                            <p
                              className={`${accent.text} text-[10px] font-bold uppercase tracking-[0.18em]`}
                            >
                              {sp.character}
                            </p>
                          </div>
                          <p className="text-white/85 text-[15px] leading-[1.5] font-mercure italic">
                            {sp.insight}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {play.followUpQuestion && (
            <div className="text-center mt-10 sm:mt-14">
              <p className="text-white/25 text-[10px] uppercase tracking-[0.25em] mb-3 font-bold">
                {t.nextQuestion}
              </p>
              <p className="font-mercure italic text-white/60 text-[17px] sm:text-[22px] leading-[1.35] mb-5 max-w-xl mx-auto">
                &ldquo;{play.followUpQuestion}&rdquo;
              </p>
            </div>
          )}

          <div className="mt-12 sm:mt-16 text-center">
            <a
              href="/"
              className="inline-flex items-center px-7 sm:px-9 py-3.5 rounded-full bg-mars hover:bg-mars-light text-white text-[12px] font-bold uppercase tracking-[0.15em] transition-all shadow-[0_0_40px_-8px_rgba(255,85,0,0.6)]"
            >
              {t.createYourOwn} &rarr;
            </a>
          </div>
        </div>
      </main>

      <footer className="py-6 px-6 border-t border-white/[0.03]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-white/25 text-[10px]">
          <span>&copy; {new Date().getFullYear()} Stage on Mars</span>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/stage_on_mars"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/65 transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/stageonmars"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/65 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
