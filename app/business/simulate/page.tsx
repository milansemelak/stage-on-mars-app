"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Play, Perspective } from "@/lib/types";
import StageSimulation from "@/components/StageSimulation";

/* ══════════════════════════════════════════════════════════════════
   SIMULATE PAGE INNER (uses useSearchParams)
   ══════════════════════════════════════════════════════════════════ */

function SimulatePageInner() {
  const searchParams = useSearchParams();
  const questionParam = searchParams.get("q") || "";
  const companyParam = searchParams.get("company") || "";

  const [play, setPlay] = useState<Play | null>(null);
  const [playLoading, setPlayLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simReady, setSimReady] = useState(false);
  const [simPhase, setSimPhase] = useState<"cast" | "stage" | "perspectives">("cast");
  const [simEnded, setSimEnded] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  async function fetchSimulation(currentPlay: Play) {
    setSimLoading(true);
    setSimReady(false);
    try {
      const res = await fetch("/api/generate-mars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ play: currentPlay, question: questionParam, lang: "en" }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const updated = {
        ...currentPlay,
        simulation: data.simulation,
        simulationSteps: data.simulationSteps,
        perspectives: data.perspectives,
        followUpQuestion: data.followUpQuestion || undefined,
      };
      setPlay(updated);
      setSimReady(true);
    } catch {
      setError("Simulation failed. Try again.");
    } finally {
      setSimLoading(false);
    }
  }

  async function startSimulation() {
    setPlayLoading(true);
    setError("");
    setSimPhase("cast");
    setSimEnded(false);

    try {
      const res = await fetch("/api/generate-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionParam, context: "business", lang: "en", clientName: companyParam || undefined }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.plays?.[0]) {
        const generatedPlay = data.plays[0];
        setPlay(generatedPlay);
        setPlayLoading(false);
        fetchSimulation(generatedPlay);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setPlayLoading(false);
    }
  }

  // Auto-start on mount
  useEffect(() => {
    if (!questionParam || started) return;
    setStarted(true);
    startSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionParam]);

  if (!questionParam) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-[14px] mb-4">No question provided.</p>
          <a href="/business" className="text-[#FF5500] text-[13px] font-bold uppercase tracking-[0.15em] hover:opacity-80 transition-opacity">
            &larr; Back to Stage on Mars
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] overflow-x-hidden">

      <style jsx global>{`
        @keyframes glow-pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.15); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>

      {/* Header */}
      <div className="pt-8 sm:pt-12 pb-4 px-4">
        <div className="max-w-3xl mx-auto">
          <a href="/business" className="group/logo inline-flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 text-white/30 group-hover/logo:text-[#FF5500]/60 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            <img src="/logo.png" alt="Stage On Mars" className="h-8 sm:h-10 w-auto invert opacity-40 group-hover/logo:opacity-80 transition-opacity" />
          </a>
        </div>
      </div>

      {/* Page content */}
      <section className="relative px-4">
        <div className="max-w-3xl mx-auto">

          {/* Title + question */}
          <div className="text-center mb-8 sm:mb-12" style={{ animation: "fadeIn 0.6s ease both" }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
              <p className="text-[#FF5500]/70 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold">Play Simulator</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] px-5 py-4 max-w-lg mx-auto">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF5500]/50 mt-2" />
                <div>
                  <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] mb-1">Your question</p>
                  <p className="font-mercure italic text-white/50 text-[14px] leading-[1.5]">&ldquo;{questionParam}&rdquo;</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {playLoading && (
            <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/30 to-transparent" />
              <div className="text-center py-20 sm:py-28">
                <div className="inline-flex gap-2 mb-5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" style={{ animation: `glow-pulse 1.2s ease-in-out ${i * 0.25}s infinite` }} />
                  ))}
                </div>
                <p className="text-white/65 text-[13px] sm:text-[14px] font-mercure italic">Creating your play...</p>
              </div>
            </div>
          )}

          {/* Simulator interface */}
          {play && !playLoading && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute -inset-4 sm:-inset-8 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.04)_0%,_transparent_70%)] pointer-events-none" />

                <div className="space-y-4">

                  {/* Phase nav tabs */}
                  <div className="flex items-center gap-1 rounded-xl bg-white/[0.05] border border-white/[0.12] p-1">
                    {[
                      { id: "cast" as const, label: "Cast", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" },
                      { id: "stage" as const, label: "Stage", icon: "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15l3.5-4.5 2.5 3.01L14.5 9l4.5 6H5z" },
                      { id: "perspectives" as const, label: "Perspectives", icon: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          if (tab.id === "stage" && !simReady) return;
                          if (tab.id === "perspectives" && !simEnded) return;
                          setSimPhase(tab.id);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] sm:text-[14px] uppercase tracking-[0.15em] font-bold transition-all ${
                          simPhase === tab.id
                            ? "bg-white/[0.06] text-white/80"
                            : (tab.id === "stage" && !simReady) || (tab.id === "perspectives" && !simEnded)
                            ? "text-white/25 cursor-not-allowed"
                            : "text-white/65 hover:text-white/60"
                        }`}
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d={tab.icon} /></svg>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Cast phase */}
                  {simPhase === "cast" && (
                    <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/30 to-transparent" />
                      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
                        <h3 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">{play.name}</h3>
                        <p className="text-white/60 text-[11px] mt-1 font-mercure italic">{play.mood} &middot; {play.characters.length} characters</p>
                      </div>
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                        <p className="text-[#FF5500]/70 text-[13px] sm:text-[14px] uppercase tracking-[0.25em] mb-4 font-bold">Characters on stage</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {play.characters.map((char, i) => (
                            <div key={i} className="rounded-xl bg-white/[0.05] border border-white/[0.10] p-4 hover:border-white/[0.15] transition-all" style={{ animation: `fadeIn 0.5s ease ${i * 0.1}s both` }}>
                              <div className="flex items-center gap-2.5 mb-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5500]/20 to-[#FF5500]/5 flex items-center justify-center text-[11px] font-bold text-[#FF5500]/60">{char.name.charAt(0)}</div>
                                <p className="text-white/70 text-[13px] font-bold tracking-[-0.01em]">{char.name}</p>
                              </div>
                              <p className="text-white/65 text-[11px] leading-[1.5] font-mercure">{char.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {play.image && (
                        <div className="mx-6 sm:mx-8 mb-6 sm:mb-8 rounded-xl bg-[#FF5500]/[0.03] border border-[#FF5500]/[0.06] p-4">
                          <p className="text-[#FF5500]/70 text-[9px] uppercase tracking-[0.25em] mb-2 font-bold">Opening image</p>
                          <p className="text-white/55 text-[13px] leading-[1.6] font-mercure italic">{play.image}</p>
                        </div>
                      )}
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                        <button
                          onClick={() => { if (simReady) setSimPhase("stage"); }}
                          disabled={!simReady}
                          className={`w-full py-4 rounded-xl text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.15em] transition-all ${
                            simReady ? "bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500]/80 hover:bg-[#FF5500]/15 hover:border-[#FF5500]/30 cursor-pointer" : "bg-white/[0.05] border border-white/[0.10] text-white/70 cursor-wait"
                          }`}
                        >
                          {simReady ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8 5v14l11-7z" /></svg>
                              Enter the Stage
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <div className="inline-flex gap-1.5">
                                {[0, 1, 2].map((i) => (
                                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" style={{ animation: `glow-pulse 1.2s ease-in-out ${i * 0.25}s infinite` }} />
                                ))}
                              </div>
                              Choreographing the stage...
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Stage phase */}
                  {simPhase === "stage" && simReady && play.simulationSteps && (
                    <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/30 to-transparent" />
                      <div className="p-4 sm:p-6">
                        <StageSimulation simulationSteps={play.simulationSteps} characters={play.characters} simulation={play.simulation} onEnd={() => { setSimEnded(true); setSimPhase("perspectives"); }} />
                      </div>
                    </div>
                  )}

                  {/* Perspectives phase */}
                  {simPhase === "perspectives" && simEnded && (
                    <div className="space-y-4">
                      {play.perspectives && play.perspectives.length > 0 && (
                        <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/30 to-transparent" />
                          <div className="p-6 sm:p-8">
                            <p className="text-[#FF5500]/70 text-[13px] sm:text-[14px] uppercase tracking-[0.25em] mb-5 font-bold">Perspectives revealed</p>
                            <div className="space-y-3">
                              {play.perspectives.map((p, i) => {
                                const perspective = typeof p === "object" ? (p as Perspective) : null;
                                return (
                                  <div key={i} className="rounded-xl bg-white/[0.05] border border-white/[0.10] p-4 hover:border-white/[0.15] transition-all" style={{ animation: `fadeIn 0.6s ease ${i * 0.15}s both` }}>
                                    {perspective ? (
                                      <div className="flex gap-3">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5500]/20 to-[#FF5500]/5 flex items-center justify-center text-[11px] font-bold text-[#FF5500]/60 mt-0.5">{perspective.character.charAt(0)}</div>
                                        <div>
                                          <p className="text-[#FF5500]/60 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">{perspective.character}</p>
                                          <p className="text-white/65 text-[13px] leading-[1.6] font-mercure italic">{perspective.insight}</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-white/65 text-[13px] leading-[1.6] font-mercure italic">{String(p)}</p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {play.followUpQuestion && (
                        <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/30 to-transparent" />
                          <div className="text-center py-8 sm:py-10 px-6">
                            <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] mb-3">What if you asked</p>
                            <p className="font-mercure italic text-white/55 text-[16px] sm:text-[20px] leading-[1.4] mb-5">&ldquo;{play.followUpQuestion}&rdquo;</p>
                            <a
                              href={`/business/simulate?q=${encodeURIComponent(play.followUpQuestion)}${companyParam ? `&company=${encodeURIComponent(companyParam)}` : ""}`}
                              className="text-[#FF5500]/70 text-[11px] font-bold uppercase tracking-[0.15em] hover:text-[#FF5500] transition-colors"
                            >
                              Ask this question &rarr;
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Big CTA — take it live */}
                      <div className="rounded-2xl overflow-hidden bg-[#FF5500] mt-2">
                        <div className="px-6 sm:px-10 py-10 sm:py-14 text-center">
                          <p className="text-white/60 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-3">This was a simulation</p>
                          <h3 className="text-white text-[22px] sm:text-[30px] font-bold tracking-[-0.03em] leading-[1.15] mb-3">
                            Imagine this with real people.<br />On a real stage.
                          </h3>
                          <p className="font-mercure italic text-white/70 text-[13px] sm:text-[15px] leading-[1.5] max-w-md mx-auto mb-6">
                            Your team, your questions, and perspectives no algorithm can generate.
                          </p>
                          <a
                            href="/business#contact"
                            className="inline-flex items-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-[#0a0a0a] text-white text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-[#1a1a1a] transition-all shadow-lg"
                          >
                            Book your play on Mars &rarr;
                          </a>
                        </div>
                      </div>

                      <button onClick={() => { setSimEnded(false); setSimPhase("cast"); }} className="w-full py-3 rounded-xl border border-white/[0.10] text-white/60 text-[10px] uppercase tracking-[0.15em] font-bold hover:text-white/55 hover:border-white/[0.15] transition-all">
                        &larr; Back to cast
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {error && <p className="text-red-400/60 text-[12px] mt-4 text-center">{error}</p>}
            </div>
          )}

          {/* Error outside of play */}
          {!play && !playLoading && error && (
            <div className="text-center py-16">
              <p className="text-red-400/60 text-[13px] mb-4">{error}</p>
              <button
                onClick={() => { setStarted(false); setError(""); }}
                className="text-[#FF5500] text-[12px] font-bold uppercase tracking-[0.15em] hover:opacity-80 transition-opacity"
              >
                Try again
              </button>
            </div>
          )}

          {/* Start over */}
          <div className="text-center mt-8 mb-16">
            <a href="/business" className="text-white/20 text-[10px] uppercase tracking-[0.15em] hover:text-[#FF5500]/60 transition-colors">
              Start over with a different question
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════
   PAGE EXPORT (with Suspense boundary for useSearchParams)
   ══════════════════════════════════════════════════════════════════ */

export default function SimulatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] flex items-center justify-center">
        <div className="inline-flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-[#FF5500]" style={{ animation: `glow-pulse 1.2s ease-in-out ${i * 0.3}s infinite` }} />
          ))}
        </div>
      </div>
    }>
      <SimulatePageInner />
    </Suspense>
  );
}
