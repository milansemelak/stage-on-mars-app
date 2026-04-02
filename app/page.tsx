"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { Play, Perspective } from "@/lib/types";
import StageSimulation from "@/components/StageSimulation";

/* ── Cycling quotes ── */
const VOICES = [
  { text: "Absolutely genius. The fastest way to break through corporate thinking.", name: "Vik Maraj", co: "Unstoppable Conversations" },
  { text: "It either confirms what you believe, or shows you a different reality.", name: "Alexandra Lobkowicz", co: "House of Lobkowicz" },
  { text: "You drop the titles, the ego, the learned masks and go deep.", name: "Raul Rodriguez", co: "Dajana Rodriguez" },
  { text: "Brilliant and healing for the company and our people.", name: "Ondřej Novotný", co: "Oktagon MMA" },
];

function Voices() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx((i) => (i + 1) % VOICES.length); setVisible(true); }, 800);
    }, 4500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-[100px] sm:h-[120px] flex flex-col items-center justify-center text-center">
      <p className={`font-mercure italic text-white/50 text-[14px] sm:text-[18px] md:text-[22px] leading-[1.4] max-w-xl transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        &ldquo;{VOICES[idx].text}&rdquo;
      </p>
      <p className={`text-mars/25 text-[10px] mt-3 transition-all duration-700 delay-100 ${visible ? "opacity-100" : "opacity-0"}`}>
        {VOICES[idx].name} · {VOICES[idx].co}
      </p>
    </div>
  );
}

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [entered, setEntered] = useState(false);
  const [question, setQuestion] = useState("");
  const [play, setPlay] = useState<Play | null>(null);
  const [loading, setLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simReady, setSimReady] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  // Logged-in users go straight to play
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/play");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 400);
    return () => clearTimeout(t);
  }, []);

  async function fetchSimulation(currentPlay: Play) {
    setSimLoading(true);
    setSimReady(false);
    try {
      const res = await fetch("/api/generate-mars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ play: currentPlay, question, lang: "en" }),
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

  async function generate() {
    if (!question.trim()) return;
    setLoading(true);
    setPlay(null);
    setError("");
    setSimReady(false);

    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);

    try {
      const res = await fetch("/api/generate-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, lang: "en" }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.plays?.[0]) {
        const generatedPlay = data.plays[0];
        setPlay(generatedPlay);
        setLoading(false);
        fetchSimulation(generatedPlay);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  function reset() {
    setQuestion("");
    setPlay(null);
    setLoading(false);
    setError("");
    setSimReady(false);
    setSimLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Show nothing while checking auth
  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-mars/30 border-t-mars rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] overflow-x-hidden">

      <style jsx global>{`
        @keyframes glow-pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.15); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">

        {/* Ambient glows */}
        <div
          className={`absolute w-[600px] h-[600px] rounded-full transition-all duration-[3000ms] ${entered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "radial-gradient(circle, rgba(255,85,0,0.07) 0%, transparent 60%)", top: "25%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
        <div
          className={`absolute w-[300px] h-[300px] rounded-full transition-all duration-[4000ms] delay-[1000ms] ${entered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "radial-gradient(circle, rgba(255,85,0,0.04) 0%, transparent 70%)", top: "65%", left: "25%", transform: "translate(-50%, -50%)" }}
        />
        <div
          className={`absolute w-[200px] h-[200px] rounded-full transition-all duration-[4000ms] delay-[1500ms] ${entered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "radial-gradient(circle, rgba(255,85,0,0.03) 0%, transparent 70%)", top: "35%", left: "80%", transform: "translate(-50%, -50%)" }}
        />

        <div className={`relative z-10 w-full max-w-lg transition-all duration-[1500ms] delay-[600ms] ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          <div className="text-center mb-10 sm:mb-14">
            {/* Logo */}
            <div className="mb-6 sm:mb-8" style={{ animation: "float 6s ease-in-out infinite" }}>
              <img src="/logo.png" alt="Stage On Mars" className="h-10 sm:h-14 md:h-18 w-auto invert mx-auto" />
            </div>
            <p className="text-mars/40 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] mb-5 sm:mb-6">Digital Playmaker</p>
            <h1 className="text-[clamp(28px,7vw,72px)] font-bold leading-[0.95] tracking-[-0.04em] text-center">
              Ask a question.
              <br />
              <span className="text-mars">See the play.</span>
            </h1>
            <p className="text-white/25 text-[13px] sm:text-[15px] mt-4 sm:mt-5 max-w-sm mx-auto leading-relaxed">
              AI turns your question into a reality play with characters, a stage, and perspectives you haven&apos;t seen.
            </p>
          </div>

          {/* THE INPUT */}
          <div className="relative group/input">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-mars/30 via-white/[0.08] to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700 blur-[1px]" />
            <div className="absolute -inset-6 rounded-3xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000" style={{ background: "radial-gradient(ellipse at center, rgba(255,85,0,0.06) 0%, transparent 70%)" }} />

            <div className="relative rounded-2xl border border-white/[0.12] group-focus-within/input:border-mars/25 bg-white/[0.025] backdrop-blur-sm px-5 sm:px-6 pt-5 pb-4 transition-all duration-500">
              <p className="text-mars/50 text-[9px] uppercase tracking-[0.25em] mb-3">Your question</p>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What's the one question you'd put on stage?"
                rows={2}
                className="w-full bg-transparent border-0 px-0 pt-0 pb-2 text-white text-[17px] sm:text-[20px] placeholder:text-white/25 focus:outline-none resize-none leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); }
                }}
              />
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!question.trim() || loading}
            className={`w-full mt-8 py-4 sm:py-5 rounded-full font-black text-base sm:text-lg tracking-[0.25em] uppercase transition-all duration-500 ${
              question.trim() && !loading
                ? "bg-mars hover:bg-mars-light text-white shadow-[0_0_60px_-8px_rgba(255,85,0,0.5)]"
                : "text-white/20 border border-white/[0.12] cursor-not-allowed"
            }`}
          >
            {loading ? "Creating..." : "Play"}
          </button>

          {/* Sign in link */}
          <p className="text-center mt-6 text-white/15 text-[11px]">
            Already have an account?{" "}
            <button onClick={() => router.push("/auth/login")} className="text-mars/40 hover:text-mars/70 transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </section>


      {/* ── PLAY RESULT ── */}
      {(play || loading) && (
        <section ref={resultRef} className="relative px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="max-w-3xl mx-auto">

            {/* Question echo */}
            <div className="text-center mb-10 sm:mb-14 pt-4">
              <p className="text-white/10 text-[10px] uppercase tracking-[0.3em] mb-3">Your question</p>
              <p className="font-mercure italic text-white/30 text-[16px] sm:text-[20px] leading-[1.4]">&ldquo;{question}&rdquo;</p>
              <button onClick={reset} className="text-white/10 text-[10px] uppercase tracking-[0.15em] mt-4 hover:text-mars/40 transition-colors">
                Ask something else
              </button>
            </div>

            {error && (
              <div className="text-center mb-8">
                <p className="text-red-400/60 text-[13px]">{error}</p>
                <button onClick={generate} className="text-mars/50 text-[11px] font-bold uppercase tracking-[0.15em] mt-2 hover:text-mars transition-colors">
                  Try again
                </button>
              </div>
            )}

            {/* Play info */}
            {play && (
              <div className="mb-6 sm:mb-8 text-center">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-mars" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                  <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold">Digital Playmaker</p>
                </div>
                <h3 className="text-[24px] sm:text-[32px] font-black tracking-[-0.03em]">{play.name}</h3>
                <p className="text-white/20 text-[11px] mt-1 font-mercure italic">{play.mood} · {play.characters.length} characters</p>
              </div>
            )}

            {/* Stage simulation */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
              {(loading || simLoading) && (
                <div className="text-center py-20 sm:py-28">
                  <div className="inline-flex gap-2 mb-5">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-mars" style={{ animation: `glow-pulse 1.2s ease-in-out ${i * 0.25}s infinite` }} />
                    ))}
                  </div>
                  <p className="text-white/25 text-[13px] sm:text-[14px] font-mercure italic">
                    {loading ? "Creating your play..." : "Choreographing the stage..."}
                  </p>
                </div>
              )}

              {simReady && play && play.simulation && play.simulationSteps && (
                <div className="p-4 sm:p-6">
                  <StageSimulation
                    simulationSteps={play.simulationSteps}
                    characters={play.characters}
                    simulation={play.simulation}
                  />
                </div>
              )}

              {simReady && play && play.perspectives && play.perspectives.length > 0 && (
                <div className="p-6 sm:p-8 border-t border-white/[0.04]">
                  <p className="text-mars/30 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mb-5 font-bold">Perspectives</p>
                  <div className="space-y-3">
                    {play.perspectives.map((p, i) => {
                      const perspective = typeof p === "object" ? (p as Perspective) : null;
                      return (
                        <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
                          {perspective ? (
                            <>
                              <p className="text-mars/40 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">{perspective.character}</p>
                              <p className="text-white/45 text-[13px] leading-[1.6] font-mercure italic">{perspective.insight}</p>
                            </>
                          ) : (
                            <p className="text-white/45 text-[13px] leading-[1.6] font-mercure italic">{String(p)}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Follow-up question */}
            {simReady && play && play.followUpQuestion && (
              <div className="text-center mt-10 sm:mt-14">
                <p className="text-white/12 text-[10px] uppercase tracking-[0.25em] mb-3">What if you asked</p>
                <p className="font-mercure italic text-white/35 text-[16px] sm:text-[20px] leading-[1.4] mb-5">&ldquo;{play.followUpQuestion}&rdquo;</p>
                <button
                  onClick={() => {
                    const followUp = play.followUpQuestion!;
                    reset();
                    setTimeout(() => { setQuestion(followUp); }, 100);
                  }}
                  className="text-mars/50 text-[11px] font-bold uppercase tracking-[0.15em] hover:text-mars transition-colors"
                >
                  Ask this question →
                </button>
              </div>
            )}
          </div>
        </section>
      )}


      {/* ── SOCIAL PROOF ── */}
      {!play && !loading && (
        <div className={`px-4 pb-16 sm:pb-24 transition-all duration-[1500ms] delay-[1200ms] ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/15 to-transparent" />
              <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8">
                <Voices />
              </div>
              <div className="mx-6 sm:mx-10 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              <div className="px-6 sm:px-10 py-6 sm:py-8">
                <p className="text-white/15 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-center mb-5">Trusted by</p>
                <img src="/clients.png" alt="Clients" className="w-full max-w-md mx-auto invert opacity-[0.2] hover:opacity-[0.35] transition-opacity duration-700" />
              </div>
            </div>

            {/* Business CTA */}
            <div className="text-center mt-10 sm:mt-14">
              <p className="text-white/15 text-[11px] mb-3">Looking for your team?</p>
              <a href="/business" className="text-mars/40 text-[11px] font-bold uppercase tracking-[0.15em] hover:text-mars/70 transition-colors">
                Explore business plays →
              </a>
            </div>
          </div>
        </div>
      )}


      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.04] py-8 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <img src="/logo.png" alt="Stage On Mars" className="h-5 invert opacity-20" />
          <p className="text-white/10 text-[10px]">© {new Date().getFullYear()} Stage on Mars</p>
        </div>
      </footer>
    </div>
  );
}
