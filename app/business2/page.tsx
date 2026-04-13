"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ── Fade-in on scroll ── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); obs.unobserve(el); } },
      { threshold: 0.05 }
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
    <div className="h-[100px] sm:h-[120px] flex flex-col items-center justify-center text-center">
      <p className={`font-mercure italic text-white/80 text-[14px] sm:text-[18px] leading-[1.4] max-w-lg transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        &ldquo;{VOICES[idx].text}&rdquo;
      </p>
      <p className={`text-mars text-[11px] mt-3 font-bold transition-all duration-700 delay-100 ${visible ? "opacity-100" : "opacity-0"}`}>
        {VOICES[idx].name} · {VOICES[idx].co}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════ */

export default function BusinessPage() {
  const [entered, setEntered] = useState(false);

  // Contact form
  const [formData, setFormData] = useState({ name: "", email: "", company: "", question: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 500);
    return () => clearTimeout(t);
  }, []);

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Mars inquiry from ${formData.name} @ ${formData.company}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\n\nQuestion:\n${formData.question}`);
    window.open(`mailto:play@stageonmars.com?subject=${subject}&body=${body}`);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] overflow-x-hidden">

      <style jsx global>{`
        .fade-section { opacity: 0; transform: translateY(12px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-section.is-visible { opacity: 1; transform: translateY(0); }
        @keyframes glow-pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.15); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>


      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">

        {/* Spotlight cone */}
        <div
          className={`absolute transition-all duration-[3000ms] ${entered ? "opacity-100" : "opacity-0"}`}
          style={{
            top: "-20%", left: "50%", transform: "translateX(-50%)",
            width: "120%", height: "80%",
            background: "conic-gradient(from 180deg at 50% 0%, transparent 35%, rgba(255,85,0,0.06) 45%, rgba(255,85,0,0.12) 50%, rgba(255,85,0,0.06) 55%, transparent 65%)",
          }}
        />
        <div
          className={`absolute w-[600px] h-[600px] rounded-full transition-all duration-[2500ms] delay-500 ${entered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "radial-gradient(ellipse, rgba(255,85,0,0.14) 0%, rgba(255,85,0,0.04) 40%, transparent 70%)", top: "20%", left: "50%", transform: "translate(-50%, -50%)" }}
        />

        <div className={`relative z-10 w-full flex flex-col items-center transition-all duration-[1500ms] delay-[800ms] ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          {/* Logo */}
          <div className="mb-6 sm:mb-8" style={{ animation: "float 6s ease-in-out infinite" }}>
            <img src="/logo.png" alt="Stage On Mars" className="h-12 sm:h-14 md:h-18 w-auto invert mx-auto" />
          </div>

          {/* Headline */}
          <h1 className="text-center mb-6 sm:mb-8">
            <span className="block text-[clamp(28px,6vw,64px)] font-black tracking-[-0.04em] leading-[1.05] text-white">
              Play with reality.
            </span>
            <span className="block text-[clamp(28px,6vw,64px)] font-black tracking-[-0.04em] leading-[1.05] text-mars">
              Create what&apos;s next.
            </span>
          </h1>

          {/* One line — what it is */}
          <p className="text-white/30 text-[14px] sm:text-[16px] text-center max-w-md mb-10 sm:mb-14 leading-[1.6]">
            Your team plays out the question that matters most.
            <br className="hidden sm:block" />
            On stage. With real people. New perspectives emerge.
          </p>

          {/* CTA — the only action */}
          <Link href="/business/play" className="group">
            <div className="relative px-10 sm:px-14 py-5 sm:py-6 rounded-full bg-mars hover:bg-mars-light transition-all duration-500 shadow-[0_0_80px_-12px_rgba(255,85,0,0.5)] hover:shadow-[0_0_100px_-12px_rgba(255,85,0,0.6)] group-hover:scale-[1.03]">
              <span className="text-white font-black text-[14px] sm:text-[16px] tracking-[0.2em] uppercase">
                Build your play
              </span>
            </div>
          </Link>

          <p className="text-white/15 text-[11px] mt-5 tracking-[0.15em]">
            Free to inquire · Reply within 24h
          </p>
        </div>
      </section>


      {/* ── PROOF — one block, everything ── */}
      <FadeIn className="px-4 pb-6 sm:pb-10 -mt-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent" />

            {/* Stats row */}
            <div className="grid grid-cols-3 border-b border-white/[0.06]">
              <div className="text-center py-8 sm:py-10">
                <p className="text-mars text-[32px] sm:text-[44px] font-black tracking-[-0.04em] leading-[0.9]">800+</p>
                <p className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-2">plays run</p>
              </div>
              <div className="text-center py-8 sm:py-10 border-x border-white/[0.06]">
                <p className="text-mars text-[32px] sm:text-[44px] font-black tracking-[-0.04em] leading-[0.9]">4<span className="text-[18px] sm:text-[24px]">h</span></p>
                <p className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-2">to clarity</p>
              </div>
              <div className="text-center py-8 sm:py-10">
                <p className="text-mars text-[32px] sm:text-[44px] font-black tracking-[-0.04em] leading-[0.9]">5</p>
                <p className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-2">countries</p>
              </div>
            </div>

            {/* Voice */}
            <div className="py-6 sm:py-8 px-6 sm:px-10 border-b border-white/[0.06]">
              <Voices />
            </div>

            {/* Clients */}
            <div className="px-6 sm:px-10 py-6 sm:py-8">
              <p className="text-white/15 text-[9px] uppercase tracking-[0.3em] text-center mb-4 font-bold">Trusted by</p>
              <p className="text-white/50 text-[12px] sm:text-[13px] leading-[2.2] tracking-wide text-center max-w-xl mx-auto">
                Forbes <span className="text-white/15 mx-0.5">·</span>{" "}
                Škoda <span className="text-white/15 mx-0.5">·</span>{" "}
                YPO <span className="text-white/15 mx-0.5">·</span>{" "}
                PwC <span className="text-white/15 mx-0.5">·</span>{" "}
                O₂ <span className="text-white/15 mx-0.5">·</span>{" "}
                Oktagon MMA <span className="text-white/15 mx-0.5">·</span>{" "}
                House of Lobkowicz <span className="text-white/15 mx-0.5">·</span>{" "}
                London Business School <span className="text-white/15 mx-0.5">·</span>{" "}
                Česká spořitelna <span className="text-white/15 mx-0.5">·</span>{" "}
                Raiffeisenbank
              </p>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── SPACE ── */}
      <FadeIn className="px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/15 to-transparent" />
            <div className="relative h-[35vh] sm:h-[50vh]">
              <img src="/space1.png" alt="Stage on Mars — flagship space" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/20" />
            </div>
            <div className="px-6 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-mars/60 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-1.5">The Stage</p>
                <p className="text-white/90 text-[16px] sm:text-[20px] font-bold tracking-[-0.02em]">Národní 138/10, Praha</p>
                <p className="text-white/40 text-[13px] mt-0.5">The flagship space. Where reality plays happen.</p>
              </div>
              <a href="/space" className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white/[0.08] text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] hover:border-mars/30 hover:text-mars/70 transition-all">
                Explore →
              </a>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── TEAM ── */}
      <FadeIn className="px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <div className="grid sm:grid-cols-2">
              <div className="relative aspect-[4/3] sm:aspect-auto">
                <img src="/team.jpg" alt="Stage on Mars team" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/30 hidden sm:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent sm:hidden" />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center space-y-4">
                <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold">The Crew</p>
                <p className="text-white/45 text-[13px] sm:text-[14px] leading-[1.7]">
                  Systemic constellations meets theatre meets improvisation. Created in 2020.
                </p>
                <p className="text-white/45 text-[13px] sm:text-[14px] leading-[1.7]">
                  In 2023, David Vais joined. Platform built. Stage opened. Brand born.
                </p>
                <p className="text-white/70 text-[13px] font-bold pt-1">
                  800+ reality plays. Prague · London · Zurich.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── CONTACT ── */}
      <FadeIn className="px-4 pt-3 sm:pt-4 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto">
          <div id="contact" className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/15 to-transparent" />

            <div className="p-6 sm:p-10">
              <div className="max-w-md mx-auto space-y-8">
                <div className="text-center">
                  <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-4">Get on stage</p>
                  <h2 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">
                    What&apos;s your question?
                  </h2>
                  <p className="text-white/30 text-[13px] mt-2">We reply within 24 hours.</p>
                </div>

                {sent ? (
                  <div className="text-center py-8">
                    <p className="text-white/60 text-[14px]">Thank you. We&apos;ll be in touch.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-2.5">
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <input name="name" value={formData.name} onChange={handleContactChange} placeholder="Name" required className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/30 focus:outline-none transition-colors" />
                      <input name="company" value={formData.company} onChange={handleContactChange} placeholder="Company" className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/30 focus:outline-none transition-colors" />
                    </div>
                    <input name="email" type="email" value={formData.email} onChange={handleContactChange} placeholder="Email" required className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/30 focus:outline-none transition-colors" />
                    <textarea name="question" value={formData.question} onChange={handleContactChange} placeholder="Your question" rows={3} className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/30 focus:outline-none transition-colors resize-none" />
                    <button type="submit" className="w-full py-4 rounded-full bg-mars hover:bg-mars-light text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_40px_-8px_rgba(255,85,0,0.4)]">
                      Let&apos;s Talk
                    </button>
                  </form>
                )}

                <p className="text-center text-white/15 text-[11px]">
                  <a href="mailto:play@stageonmars.com" className="hover:text-mars transition-colors">play@stageonmars.com</a>
                  {" · "}
                  <a href="tel:+420602336338" className="hover:text-mars transition-colors">+420 602 336 338</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── INSTAGRAM ── */}
      <FadeIn className="px-4 py-3 sm:py-4 pb-8 sm:pb-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-white/15 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold text-center mb-4 sm:mb-6">@stage_on_mars</p>
          <div
            className="[&_behold-widget]:block"
            ref={(el) => {
              if (el && !document.querySelector('script[src*="behold.so"]')) {
                const s = document.createElement("script");
                s.type = "module";
                s.src = "https://w.behold.so/widget.js";
                document.head.append(s);
              }
            }}
            dangerouslySetInnerHTML={{ __html: '<behold-widget feed-id="dIhZfoeR63aCCPOqfshk"></behold-widget>' }}
          />
        </div>
      </FadeIn>

      {/* FOOTER */}
      <footer className="py-6 px-6 border-t border-white/[0.03]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-white/25 text-[10px]">
          <span>&copy; {new Date().getFullYear()} Stage on Mars</span>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/stage_on_mars" target="_blank" rel="noopener noreferrer" className="hover:text-white/65 transition-colors">Instagram</a>
            <a href="https://www.linkedin.com/company/stageonmars" target="_blank" rel="noopener noreferrer" className="hover:text-white/65 transition-colors">LinkedIn</a>
            <a href="https://playbook.stageonmars.com" className="hover:text-white/65 transition-colors">Playbook</a>
            <Link href="/business/codex" className="hover:text-white/65 transition-colors">Codex</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
