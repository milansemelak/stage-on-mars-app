"use client";

import { useState, useEffect, useRef } from "react";
import type { Play, Perspective } from "@/lib/types";
import StageSimulation from "@/components/StageSimulation";

/* ── Fade-in on scroll ── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useFadeIn();
  return <div ref={ref} className={`fade-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

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
    <div className="h-[160px] sm:h-[200px] flex flex-col items-center justify-center text-center px-4">
      <p className={`font-mercure italic text-white/60 text-[16px] sm:text-[24px] md:text-[28px] leading-[1.35] max-w-2xl transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        &ldquo;{VOICES[idx].text}&rdquo;
      </p>
      <p className={`text-white/15 text-[11px] mt-4 transition-all duration-700 delay-100 ${visible ? "opacity-100" : "opacity-0"}`}>
        {VOICES[idx].name} · {VOICES[idx].co}
      </p>
    </div>
  );
}

/* ── Dynamic "X on Mars" naming from question ── */
type LiveFormat = {
  name: string;
  theme: string;
  duration: string;
  people: string;
  price: string;
  pitch: string;
};

const THEME_MAP: [RegExp, string][] = [
  [/strateg|decision|direction|priorit/i, "Strategy"],
  [/creat|innovat|idea|inspir|imagin/i, "Creativity"],
  [/trust|relationship|conflict|tension|team dynam/i, "Trust"],
  [/vision|future|dream|ambition|purpose|mission/i, "Vision"],
  [/fear|afraid|risk|uncertain|anxiety|worry/i, "Courage"],
  [/stuck|block|stagnat|plateau|comfort zone/i, "Breakthrough"],
  [/grow|scale|expand|bigger|next level/i, "Growth"],
  [/lead|manage|ceo|founder|boss|authority/i, "Leadership"],
  [/cultur|value|identity|who are we|belong/i, "Identity"],
  [/chang|transform|transition|restructur|pivot/i, "Transformation"],
  [/talent|hire|retain|people leav|turnover/i, "Talent"],
  [/communi|speak|listen|silent|voice|heard/i, "Voice"],
  [/power|control|dominan|hierarchy|ego/i, "Power"],
  [/money|profit|revenue|cost|budget|financ/i, "Value"],
  [/customer|client|market|brand|compet/i, "Market"],
  [/family|partner|marriage|parent|child/i, "Connection"],
  [/health|burnout|exhaust|energy|balanc/i, "Balance"],
  [/success|failure|win|lose|perform/i, "Performance"],
  [/impossible|crazy|never|can.t|no way/i, "Impossible"],
];

function deriveTheme(question: string): string {
  for (const [pattern, theme] of THEME_MAP) {
    if (pattern.test(question)) return theme;
  }
  // Extract a keyword from the question as fallback
  const words = question.replace(/[?.,!]/g, "").split(/\s+/).filter(w => w.length > 4);
  if (words.length > 0) {
    const w = words[Math.floor(words.length / 2)];
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }
  return "Reality";
}

function recommendLive(question: string): LiveFormat {
  const theme = deriveTheme(question);
  return {
    name: `${theme} on Mars`,
    theme,
    duration: "3–4 hours",
    people: "up to 20 people",
    price: "from 55 000 CZK",
    pitch: `A live reality play designed for this question. Your team plays it out on stage — the real dynamics, not the ones in the report. You see what you couldn't see before.`,
  };
}


/* ══════════════════════════════════════════════════════════════════
    PAGE
   ══════════════════════════════════════════════════════════════════ */

export default function BusinessPage() {
  const [entered, setEntered] = useState(false);
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState<"personal" | "business">("business");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [play, setPlay] = useState<Play | null>(null);
  const [askedQuestion, setAskedQuestion] = useState("");
  const [error, setError] = useState("");
  const [showDigital, setShowDigital] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simReady, setSimReady] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Contact form
  const [formData, setFormData] = useState({ name: "", email: "", company: "", question: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 500);
    return () => clearTimeout(t);
  }, []);

  async function generate() {
    if (!question.trim()) return;
    setSubmitted(true);
    setLoading(true);
    setError("");
    setPlay(null);
    setAskedQuestion(question);
    setShowDigital(false);

    // Scroll to results
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);

    try {
      const res = await fetch("/api/generate-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context, lang: "en" }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.plays?.[0]) {
        setPlay(data.plays[0]);
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSimulation(currentPlay: Play) {
    setSimLoading(true);
    setSimReady(false);
    try {
      const res = await fetch("/api/generate-mars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ play: currentPlay, question: askedQuestion || question, lang: "en" }),
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

  function openDigital() {
    setShowDigital(true);
    if (play && !play.simulation) {
      fetchSimulation(play);
    } else if (play?.simulation) {
      setSimReady(true);
    }
  }

  function reset() {
    setQuestion("");
    setSubmitted(false);
    setPlay(null);
    setAskedQuestion("");
    setError("");
    setShowDigital(false);
    setSimLoading(false);
    setSimReady(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Mars inquiry from ${formData.name} @ ${formData.company}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\n\nQuestion:\n${formData.question || askedQuestion}`);
    window.open(`mailto:play@stageonmars.com?subject=${subject}&body=${body}`);
    setSent(true);
  }

  const liveRec = recommendLive(askedQuestion);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] overflow-x-hidden">

      <style jsx global>{`
        .fade-section { opacity: 0; transform: translateY(24px); transition: opacity 0.9s ease, transform 0.9s ease; }
        .fade-section.is-visible { opacity: 1; transform: translateY(0); }
        @keyframes glow-pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.15); } }
      `}</style>

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${entered ? "opacity-100" : "opacity-0"}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
          <img src="/logo.png" alt="Stage On Mars" className="h-6 sm:h-9 w-auto invert opacity-70" />
          <a href="#contact" className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-[#0a0a0a] bg-mars hover:bg-mars-light px-5 sm:px-7 py-2 sm:py-2.5 rounded-full transition-all">
            Book a Play
          </a>
        </div>
      </nav>


      {/* ── HERO: The question IS the experience ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">

        {/* Ambient glow */}
        <div
          className={`absolute w-[400px] h-[400px] rounded-full transition-all duration-[3000ms] ${entered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "radial-gradient(circle, rgba(255,85,0,0.06) 0%, transparent 70%)", top: "30%", left: "50%", transform: "translate(-50%, -50%)" }}
        />

        <div className={`relative z-10 w-full max-w-lg transition-all duration-[1500ms] delay-[800ms] ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          <div className="text-center mb-10 sm:mb-14">
            <p className="text-mars/40 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] mb-5 sm:mb-6">Reality Play Platform</p>
            <h1 className="text-[36px] sm:text-[56px] md:text-[72px] lg:text-[86px] font-bold leading-[0.92] tracking-[-0.04em]">
              Play with reality.
              <br />
              <span className="text-mars">See what&apos;s possible.</span>
            </h1>
          </div>

          {/* THE INPUT */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden focus-within:border-white/20 transition-colors">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's the one question that could change your reality?"
              rows={3}
              className="w-full bg-transparent px-5 sm:px-6 pt-5 pb-3 text-white/90 placeholder:text-white/20 focus:outline-none resize-none text-base sm:text-lg leading-relaxed min-h-[7rem]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); }
              }}
            />
          </div>

          <button
            onClick={generate}
            disabled={!question.trim() || loading}
            className={`w-full mt-3 py-5 rounded-2xl font-black text-xl sm:text-2xl tracking-widest uppercase transition-all duration-300 ${
              question.trim()
                ? "bg-mars hover:bg-mars-light text-white shadow-[0_8px_40px_-4px_rgba(255,85,0,0.35)]"
                : "bg-mars text-white/40 cursor-not-allowed opacity-50"
            }`}
          >
            {loading ? "Creating..." : "Play"}
          </button>

        </div>
      </section>


      {/* ── RESULTS: Live invitation → Digital play → Social proof ── */}
      {submitted && (
        <section ref={resultRef} className="relative px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">

            {/* The question echo */}
            <div className="text-center mb-12 sm:mb-20 pt-8 sm:pt-12">
              <p className="text-white/10 text-[10px] uppercase tracking-[0.3em] mb-3">Your question</p>
              <p className="font-mercure italic text-white/30 text-[16px] sm:text-[20px] leading-[1.4]">&ldquo;{askedQuestion}&rdquo;</p>
              <button onClick={reset} className="text-white/10 text-[10px] uppercase tracking-[0.15em] mt-4 hover:text-mars/40 transition-colors">
                Ask something else
              </button>
            </div>

            {/* ═══ LIVE PLAY INVITATION ═══ */}
            <div className="relative rounded-3xl overflow-hidden mb-6 sm:mb-8">
              {/* Background: space photo with overlay */}
              <div className="absolute inset-0">
                <img src="/space1.png" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/90 via-[#0a0a0a]/75 to-[#0a0a0a]/85" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              </div>
              <div className="absolute inset-0 border border-mars/[0.1] rounded-3xl" />
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-mars/25 to-transparent" />

              <div className="relative z-10 p-8 sm:p-12 md:p-16 lg:p-20">
                {/* Label */}
                <div className="inline-flex items-center gap-2 mb-10 sm:mb-14">
                  <div className="w-1.5 h-1.5 rounded-full bg-mars" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                  <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold">We designed your live play</p>
                </div>

                {/* Title */}
                <h3 className="text-[44px] sm:text-[64px] md:text-[80px] lg:text-[96px] font-black tracking-[-0.04em] leading-[0.88] mb-6 sm:mb-8">
                  {liveRec.theme}
                  <br />
                  <span className="text-mars">on Mars</span>
                </h3>

                <p className="font-mercure text-white/35 text-[15px] sm:text-[18px] md:text-[20px] leading-[1.7] mb-10 sm:mb-14 max-w-xl">
                  {liveRec.pitch}
                </p>

                {/* Details strip */}
                <div className="flex flex-wrap gap-6 sm:gap-10 mb-10 sm:mb-14">
                  {[
                    { label: "Duration", value: liveRec.duration },
                    { label: "Players", value: liveRec.people },
                    { label: "Stage", value: "Praha flagship" },
                    { label: "Guide", value: "Systemic facilitator" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-white/12 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mb-1">{item.label}</p>
                      <p className="text-white/50 text-[13px] sm:text-[14px] font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-3 text-[12px] sm:text-[14px] font-black uppercase tracking-[0.15em] text-[#0a0a0a] bg-mars hover:bg-mars-light px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all shadow-[0_8px_40px_-4px_rgba(255,85,0,0.3)] hover:shadow-[0_12px_50px_-4px_rgba(255,85,0,0.45)]"
                  >
                    Book this play
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                  </a>
                  <p className="text-white/20 text-[12px] sm:text-[13px]">{liveRec.price}</p>
                </div>
              </div>
            </div>


            {/* ═══ DIGITAL PLAY — natural transition ═══ */}
            <div className="relative mt-0">
              {!showDigital && play && !loading ? (
                <button
                  onClick={openDigital}
                  className="w-full relative rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:border-mars/[0.15] hover:bg-white/[0.03] transition-all duration-500 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.03)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 py-10 sm:py-14 px-8 sm:px-12 text-center">
                    <p className="text-white/15 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] mb-3">Or try it right here</p>
                    <p className="text-white/50 text-[18px] sm:text-[22px] md:text-[26px] font-bold tracking-[-0.02em] group-hover:text-white/70 transition-colors">
                      Simulate this play digitally
                    </p>
                    <p className="font-mercure text-white/15 text-[12px] sm:text-[14px] mt-3 group-hover:text-white/25 transition-colors">
                      AI-generated reality play you can walk through now
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 text-mars/40 text-[11px] font-bold uppercase tracking-[0.15em] group-hover:text-mars/70 transition-colors">
                      <span>Open Playmaker</span>
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /></svg>
                    </div>
                  </div>
                </button>
              ) : showDigital && play ? (
                <div className="relative">
                  <div className="absolute -inset-4 sm:-inset-8 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.04)_0%,_transparent_70%)] pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-mars" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                      <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold">Digital Playmaker</p>
                    </div>
                    <button onClick={() => setShowDigital(false)} className="text-white/15 text-[10px] uppercase tracking-[0.15em] hover:text-white/30 transition-colors">
                      Close
                    </button>
                  </div>

                  {/* Play title bar */}
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">{play.name}</h3>
                    <p className="text-white/20 text-[11px] mt-1 font-mercure italic">{play.mood} · {play.characters.length} characters</p>
                  </div>

                  {/* ── STAGE SIMULATION — the hero ── */}
                  <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">

                    {simLoading && (
                      <div className="text-center py-20 sm:py-28">
                        <div className="inline-flex gap-2 mb-5">
                          {[0, 1, 2].map((i) => (
                            <div key={i} className="w-2.5 h-2.5 rounded-full bg-mars" style={{ animation: `glow-pulse 1.2s ease-in-out ${i * 0.25}s infinite` }} />
                          ))}
                        </div>
                        <p className="text-white/25 text-[13px] sm:text-[14px] font-mercure italic">Choreographing the stage...</p>
                      </div>
                    )}

                    {simReady && play.simulation && play.simulationSteps && (
                      <div className="p-4 sm:p-6">
                        <StageSimulation
                          steps={play.simulationSteps}
                          characters={play.characters}
                          simulation={play.simulation}
                        />
                      </div>
                    )}

                    {/* Perspectives — revealed after simulation */}
                    {simReady && play.perspectives && play.perspectives.length > 0 && (
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

                  {/* Follow-up question — outside the card */}
                  {simReady && play.followUpQuestion && (
                    <div className="text-center mt-10 sm:mt-14">
                      <p className="text-white/12 text-[10px] uppercase tracking-[0.25em] mb-3">What if you asked</p>
                      <p className="font-mercure italic text-white/35 text-[16px] sm:text-[20px] leading-[1.4] mb-5">&ldquo;{play.followUpQuestion}&rdquo;</p>
                      <button
                        onClick={() => {
                          const followUp = play.followUpQuestion!;
                          reset();
                          setTimeout(() => {
                            setQuestion(followUp);
                          }, 100);
                        }}
                        className="text-mars/50 text-[11px] font-bold uppercase tracking-[0.15em] hover:text-mars transition-colors"
                      >
                        Ask this question →
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

          </div>
        </section>
      )}


      {/* ── SOCIAL PROOF — always visible below ── */}
      <FadeIn className="py-10 sm:py-16 px-4 mt-8 sm:mt-12">
        <div className="max-w-3xl mx-auto">
          <img src="/clients.png" alt="Clients" className="w-full invert opacity-[0.3]" />
        </div>
      </FadeIn>

      <section className="py-12 sm:py-20">
        <Voices />
      </section>

      {/* THE SPACE */}
      {!submitted && (
        <section className="relative h-[45vh] sm:h-[65vh]">
          <img src="/space1.png" alt="Stage on Mars — flagship space" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-[#0a0a0a]/40" />
          <div className="absolute inset-0 flex items-end px-6 sm:px-12 pb-8 sm:pb-12">
            <div className="flex items-end justify-between w-full">
              <div>
                <p className="text-white/70 text-[16px] sm:text-[20px] font-bold tracking-[-0.02em]">Národní 138/10, Praha</p>
                <p className="font-mercure text-white/20 text-[11px] sm:text-[13px] mt-1">The flagship stage.</p>
              </div>
              <a href="/space" className="text-mars/40 text-[11px] font-bold uppercase tracking-[0.15em] hover:text-mars transition-colors">Explore →</a>
            </div>
          </div>
        </section>
      )}

      {/* TEAM */}
      <FadeIn className="py-16 sm:py-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-14 items-center">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <img src="/team.jpg" alt="Stage on Mars team" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 via-transparent to-transparent" />
            </div>
            <div className="space-y-4">
              <p className="font-mercure text-white/30 text-[13px] sm:text-[15px] leading-[1.7]">
                Born during COVID. Systemic constellations meets theatre meets improvisation.
              </p>
              <p className="font-mercure text-white/30 text-[13px] sm:text-[15px] leading-[1.7]">
                In 2023, David Vais joined. Platform built. Stage opened. Brand born.
              </p>
              <p className="text-white/50 text-[12px] sm:text-[13px] font-bold mt-4">
                800+ reality plays. London, Zurich, Bucharest.
              </p>
              <p className="text-white/15 text-[11px]">
                Milan Semelak · David Vais · Tomas Pavlik · Jan Piskor · Andrea Sturalova
              </p>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── CONTACT ── */}
      <section id="contact" className="py-16 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.03)_0%,_transparent_60%)]" />


        <FadeIn>
          <div className="max-w-md mx-auto space-y-8 relative z-10">
            <div className="text-center">
              <h2 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">
                {submitted ? "Let\u2019s make it happen." : "What\u2019s your question?"}
              </h2>
              <p className="font-mercure text-white/20 text-[12px] sm:text-[13px] mt-2">We reply within 24 hours.</p>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <p className="font-mercure text-white/40 text-[14px]">Thank you. We&apos;ll be in touch.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-2.5">
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <input name="name" value={formData.name} onChange={handleContactChange} placeholder="Name" required className="font-mercure w-full rounded-lg bg-white/[0.03] border border-white/[0.05] focus:border-mars/20 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/12 focus:outline-none transition-colors" />
                  <input name="company" value={formData.company} onChange={handleContactChange} placeholder="Company" className="font-mercure w-full rounded-lg bg-white/[0.03] border border-white/[0.05] focus:border-mars/20 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/12 focus:outline-none transition-colors" />
                </div>
                <input name="email" type="email" value={formData.email} onChange={handleContactChange} placeholder="Email" required className="font-mercure w-full rounded-lg bg-white/[0.03] border border-white/[0.05] focus:border-mars/20 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/12 focus:outline-none transition-colors" />
                <textarea name="question" value={formData.question || askedQuestion} onChange={handleContactChange} placeholder="Your question" rows={3} className="font-mercure w-full rounded-lg bg-white/[0.03] border border-white/[0.05] focus:border-mars/20 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/12 focus:outline-none transition-colors resize-none" />
                <button type="submit" className="w-full py-3 rounded-lg bg-mars hover:bg-mars-light text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all">
                  Let&apos;s Talk
                </button>
              </form>
            )}

            <p className="text-center font-mercure text-white/10 text-[11px]">
              <a href="mailto:play@stageonmars.com" className="hover:text-mars transition-colors">play@stageonmars.com</a>
              {" · "}
              <a href="tel:+420602336338" className="hover:text-mars transition-colors">+420 602 336 338</a>
            </p>
          </div>
        </FadeIn>
      </section>


      {/* FOOTER */}
      <footer className="py-6 px-6 border-t border-white/[0.03]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-white/10 text-[10px]">
          <span>&copy; {new Date().getFullYear()} Stage on Mars</span>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/stage_on_mars" target="_blank" rel="noopener noreferrer" className="hover:text-white/25 transition-colors">Instagram</a>
            <a href="https://www.linkedin.com/company/stageonmars" target="_blank" rel="noopener noreferrer" className="hover:text-white/25 transition-colors">LinkedIn</a>
            <a href="https://playbook.stageonmars.com" className="hover:text-white/25 transition-colors">Playbook</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
