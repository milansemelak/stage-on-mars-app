"use client";

import { useState, useEffect, useRef } from "react";
import type { Play } from "@/lib/types";
import PlayCard from "@/components/PlayCard";

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
  const [activeTab, setActiveTab] = useState<"live" | "digital">("live");
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
    setActiveTab("live");

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

  function reset() {
    setQuestion("");
    setSubmitted(false);
    setPlay(null);
    setAskedQuestion("");
    setError("");
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
            <h1 className="text-[30px] sm:text-[48px] md:text-[56px] font-bold leading-[0.95] tracking-[-0.04em]">
              Play with reality to see<br />what&apos;s <span className="text-mars">possible.</span>
            </h1>
          </div>

          {/* THE INPUT */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden focus-within:border-white/20 transition-colors">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's your question?"
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


      {/* ── RESULTS: The page reshapes around your question ── */}
      {submitted && (
        <section ref={resultRef} className="relative px-4 sm:px-6 pb-16 sm:pb-28">
          <div className="max-w-3xl mx-auto">

            {/* The question echo */}
            <div className="text-center mb-10 sm:mb-16 pt-8 sm:pt-12">
              <p className="font-mercure italic text-white/20 text-[13px] sm:text-[15px]">&ldquo;{askedQuestion}&rdquo;</p>
              <button onClick={reset} className="text-white/10 text-[10px] uppercase tracking-[0.15em] mt-3 hover:text-white/25 transition-colors">
                Change question
              </button>
            </div>

            {/* LIVE / DIGITAL tabs */}
            <div className="flex justify-center gap-1 mb-10 sm:mb-14">
              <button
                onClick={() => setActiveTab("live")}
                className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                  activeTab === "live"
                    ? "bg-mars text-white"
                    : "bg-white/[0.04] text-white/30 hover:text-white/50"
                }`}
              >
                Live on stage
              </button>
              <button
                onClick={() => setActiveTab("digital")}
                className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                  activeTab === "digital"
                    ? "bg-mars text-white"
                    : "bg-white/[0.04] text-white/30 hover:text-white/50"
                }`}
              >
                Digital play
              </button>
            </div>


            {/* ── LIVE TAB ── */}
            {activeTab === "live" && (
              <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,85,0,0.04)_0%,_transparent_60%)]" />
                <div className="relative z-10">
                  <p className="text-mars/40 text-[10px] uppercase tracking-[0.2em] mb-5">Your question becomes a live play</p>

                  <h3 className="text-[28px] sm:text-[40px] font-bold tracking-[-0.03em] mb-2">{liveRec.name}</h3>
                  <p className="text-white/20 text-[12px] sm:text-[13px] mb-6">{liveRec.duration} · {liveRec.people} · {liveRec.price}</p>

                  <p className="font-mercure text-white/35 text-[14px] sm:text-[16px] leading-[1.7] mb-8 max-w-xl">
                    {liveRec.pitch}
                  </p>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-[#0a0a0a] bg-mars hover:bg-mars-light px-6 sm:px-8 py-3 rounded-full transition-all"
                  >
                    Book this play
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                  </a>
                </div>
              </div>
            )}


            {/* ── DIGITAL TAB ── */}
            {activeTab === "digital" && (
              <div>
                {loading && (
                  <div className="text-center py-16">
                    <div className="inline-flex gap-1.5 mb-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-mars" style={{ animation: `glow-pulse 1s ease-in-out ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                    <p className="text-white/25 text-[13px]">Creating your play...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-12">
                    <p className="text-mars/60 text-[13px]">{error}</p>
                    <button onClick={generate} className="text-mars text-[11px] font-bold uppercase tracking-[0.15em] mt-4 hover:text-white transition-colors">
                      Try again →
                    </button>
                  </div>
                )}

                {play && !loading && (
                  <div>
                    <PlayCard
                      play={play}
                      question={askedQuestion}
                      onPlayUpdate={(updated) => setPlay(updated)}
                      onAskQuestion={(q) => {
                        setQuestion(q);
                        setAskedQuestion(q);
                        setLoading(true);
                        setPlay(null);
                        fetch("/api/generate-play", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ question: q, context, lang: "en" }),
                        })
                          .then((r) => r.json())
                          .then((data) => { if (data.plays?.[0]) setPlay(data.plays[0]); })
                          .catch(() => setError("Failed to generate."))
                          .finally(() => setLoading(false));
                      }}
                    />
                  </div>
                )}
              </div>
            )}

          </div>
        </section>
      )}


      {/* ── PROOF — always visible ── */}
      {!submitted && (
        <>
          <FadeIn className="py-10 sm:py-16 px-4">
            <div className="max-w-3xl mx-auto">
              <img src="/clients.png" alt="Clients" className="w-full invert opacity-[0.3]" />
            </div>
          </FadeIn>

          <section className="py-12 sm:py-20">
            <Voices />
          </section>

          {/* THE SPACE */}
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
        </>
      )}


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
