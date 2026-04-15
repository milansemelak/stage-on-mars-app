"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <div className="h-[120px] sm:h-[140px] flex flex-col items-center justify-center text-center">
      <p className={`font-mercure italic text-white/85 text-[16px] sm:text-[20px] leading-[1.4] max-w-lg transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        &ldquo;{VOICES[idx].text}&rdquo;
      </p>
      <p className={`text-mars text-[11px] mt-3 font-bold tracking-[0.1em] transition-all duration-700 delay-100 ${visible ? "opacity-100" : "opacity-0"}`}>
        {VOICES[idx].name} · {VOICES[idx].co}
      </p>
    </div>
  );
}

/* ── Hero question input — submits to /business/play?q= ── */
function QuestionCTA({ variant = "hero" }: { variant?: "hero" | "inline" }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const valid = q.trim().length > 3;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    router.push(`/business/play?q=${encodeURIComponent(q.trim())}`);
  }

  const wrap = variant === "hero" ? "max-w-xl" : "max-w-lg";

  return (
    <form onSubmit={submit} className={`w-full ${wrap} mx-auto`}>
      <div className="relative group/input">
        {/* Outer glow ring — reacts to focus */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-mars/40 via-white/[0.1] to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700 blur-[1px]" />
        {/* Ambient glow */}
        <div className="absolute -inset-6 rounded-3xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000" style={{ background: "radial-gradient(ellipse at center, rgba(255,85,0,0.08) 0%, transparent 70%)" }} />

        <div className="relative rounded-2xl border border-white/[0.12] group-focus-within/input:border-mars/30 bg-white/[0.025] backdrop-blur-sm transition-all duration-500 overflow-hidden">
          <textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What's the real question your team is sitting with?"
            rows={2}
            className="w-full bg-transparent px-5 sm:px-6 pt-5 pb-3 text-white/90 placeholder:text-white/40 focus:outline-none resize-none text-[15px] sm:text-[17px] leading-relaxed min-h-[6rem]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(e as unknown as React.FormEvent); }
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!valid}
        className={`mt-4 w-full py-5 rounded-full font-black text-[13px] sm:text-[15px] tracking-[0.25em] uppercase transition-all duration-500 ${
          valid
            ? "bg-mars hover:bg-mars-light text-white shadow-[0_0_80px_-12px_rgba(255,85,0,0.55)] hover:shadow-[0_0_100px_-12px_rgba(255,85,0,0.7)]"
            : "text-white/30 border border-white/[0.12] cursor-not-allowed"
        }`}
      >
        Build your play →
      </button>
    </form>
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
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">

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

          {/* Headline — sacred two lines */}
          <h1 className="text-center mb-5 sm:mb-6">
            <span className="block text-[clamp(28px,6vw,64px)] font-black tracking-[-0.04em] leading-[1.05] text-white">
              Play with reality.
            </span>
            <span className="block text-[clamp(28px,6vw,64px)] font-black tracking-[-0.04em] leading-[1.05] text-mars">
              Create what&apos;s next.
            </span>
          </h1>

          {/* One line — what it is */}
          <p className="text-white/45 text-[14px] sm:text-[16px] text-center max-w-md mb-8 sm:mb-10 leading-[1.6]">
            Your team plays out the question that matters most. On stage. With real people. New perspectives emerge.
          </p>

          {/* Question input + CTA — the product starts here */}
          <QuestionCTA />

          <p className="text-white/40 text-[11px] mt-5 tracking-[0.15em] text-center">
            Free to inquire · Reply within 24h · Engagements scoped per question
          </p>
        </div>
      </section>


      {/* ── PROOF — promise → voice → stats → logos ── */}
      <FadeIn className="px-4 pb-6 sm:pb-10 -mt-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent" />

            {/* Promise — the one sentence */}
            <div className="px-6 sm:px-10 py-8 sm:py-10 text-center border-b border-white/[0.06]">
              <p className="text-mars/70 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-4">What you leave with</p>
              <p className="text-white/90 text-[18px] sm:text-[22px] font-bold tracking-[-0.02em] leading-[1.35] max-w-xl mx-auto">
                A stuck decision, unstuck. In four hours. Without another deck, framework, or consultant.
              </p>
            </div>

            {/* Voice — strongest quote rotation */}
            <div className="py-6 sm:py-8 px-6 sm:px-10 border-b border-white/[0.06]">
              <Voices />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 border-b border-white/[0.06]">
              <div className="text-center py-8 sm:py-10">
                <p className="text-mars text-[32px] sm:text-[44px] font-black tracking-[-0.04em] leading-[0.9]">800+</p>
                <p className="text-white/45 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-2 font-bold">plays run</p>
              </div>
              <div className="text-center py-8 sm:py-10 border-x border-white/[0.06]">
                <p className="text-mars text-[32px] sm:text-[44px] font-black tracking-[-0.04em] leading-[0.9]">9<span className="text-white/30 text-[20px] sm:text-[26px] mx-0.5">/</span>10</p>
                <p className="text-white/45 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-2 font-bold">unblocked</p>
              </div>
              <div className="text-center py-8 sm:py-10">
                <p className="text-mars text-[32px] sm:text-[44px] font-black tracking-[-0.04em] leading-[0.9]">4<span className="text-[18px] sm:text-[24px]">h</span></p>
                <p className="text-white/45 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-2 font-bold">to clarity</p>
              </div>
            </div>

            {/* Logos — real marks, not text */}
            <div className="px-6 sm:px-10 py-8 sm:py-10">
              <p className="text-white/45 text-[9px] uppercase tracking-[0.3em] text-center mb-6 font-bold">Trusted by</p>
              <div className="flex items-center justify-center">
                <img
                  src="/clients.png"
                  alt="Forbes · Škoda · YPO · PwC · O₂ · Oktagon MMA · House of Lobkowicz · London Business School · Česká spořitelna · Raiffeisenbank · Lasvit · Ipsen · MSD · Direct · Markíza · Tatra Banka · Logport · PSN · Fantasy Trading · Atairu · Alaskan Fisherman"
                  className="w-full max-w-2xl opacity-75 invert"
                  style={{ filter: "invert(1) brightness(1.1) contrast(0.9)" }}
                />
              </div>
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
                <p className="text-mars/80 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-1.5">The Stage</p>
                <p className="text-white/90 text-[16px] sm:text-[20px] font-bold tracking-[-0.02em]">Národní 138/10, Praha</p>
                <p className="text-white/50 text-[13px] mt-0.5">The flagship space. Where reality plays happen.</p>
              </div>
              <a href="/space" className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white/[0.1] text-white/60 text-[11px] font-bold uppercase tracking-[0.15em] hover:border-mars/40 hover:text-mars transition-all">
                Explore →
              </a>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── CASE SNIPPET — one concrete outcome ── */}
      <FadeIn className="px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/15 to-transparent" />
            <div className="p-6 sm:p-10">
              <p className="text-mars/80 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-5">Recent play</p>
              <div className="grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-start">
                <div className="shrink-0">
                  <p className="text-white/50 text-[10px] uppercase tracking-[0.25em] font-bold mb-1">Client</p>
                  <p className="text-white/90 text-[15px] font-bold">Global CPG Leadership</p>
                  <p className="text-white/50 text-[12px] mt-0.5">15 execs · 4 hours</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-[0.25em] font-bold mb-1.5">The question</p>
                    <p className="text-white/85 text-[15px] sm:text-[16px] font-mercure italic leading-[1.5]">
                      &ldquo;Why does our strategy keep losing the room the moment we leave it?&rdquo;
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-[0.25em] font-bold mb-1.5">What emerged</p>
                    <p className="text-white/75 text-[14px] leading-[1.6]">
                      The strategy wasn&apos;t the problem. The silent disagreement between two board members was. Once it played out on stage, nobody could pretend it wasn&apos;t there. They left with a decision the whole room could stand behind — and a first step everyone already agreed to.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── TEAM — compressed ── */}
      <FadeIn className="px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <div className="grid sm:grid-cols-[1.1fr_1fr]">
              <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[240px]">
                <img src="/team.jpg" alt="Stage on Mars team" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/40 hidden sm:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent sm:hidden" />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center space-y-3">
                <p className="text-mars/80 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold">The Crew</p>
                <p className="text-white/80 text-[14px] sm:text-[15px] leading-[1.6]">
                  Constellations, theatre, improvisation. 800+ plays. Prague · London · Zurich.
                </p>
                <Link href="/team" className="inline-flex items-center gap-1 text-mars/80 hover:text-mars text-[12px] font-bold uppercase tracking-[0.15em] transition-colors">
                  Meet them →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── SECOND CTA — ready to play? ── */}
      <FadeIn className="px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-mars/15 bg-gradient-to-b from-mars/[0.04] to-transparent overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/40 to-transparent" />
            <div className="p-8 sm:p-12 text-center">
              <p className="text-white/90 text-[20px] sm:text-[26px] font-bold tracking-[-0.02em] mb-2">
                Ready? Ask your question.
              </p>
              <p className="text-white/50 text-[13px] sm:text-[14px] mb-6 sm:mb-8 leading-[1.5]">
                Type it raw. We&apos;ll design the play around it.
              </p>
              <QuestionCTA variant="inline" />
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── CONTACT ── */}
      <FadeIn className="px-4 pt-3 sm:pt-4 pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto">
          <div id="contact" className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/15 to-transparent" />

            <div className="p-6 sm:p-10">
              <div className="max-w-md mx-auto space-y-8">
                <div className="text-center">
                  <p className="text-mars/80 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-4">Or write us directly</p>
                  <h2 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">
                    Tell us about your team.
                  </h2>
                  <p className="text-white/50 text-[13px] mt-2">We reply within 24 hours.</p>
                </div>

                {sent ? (
                  <div className="text-center py-8">
                    <p className="text-white/75 text-[14px]">Thank you. We&apos;ll be in touch.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-2.5">
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <input name="name" value={formData.name} onChange={handleContactChange} placeholder="Name" required className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/30 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/40 focus:outline-none transition-colors" />
                      <input name="company" value={formData.company} onChange={handleContactChange} placeholder="Company" className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/30 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/40 focus:outline-none transition-colors" />
                    </div>
                    <input name="email" type="email" value={formData.email} onChange={handleContactChange} placeholder="Email" required className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/30 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/40 focus:outline-none transition-colors" />
                    <textarea name="question" value={formData.question} onChange={handleContactChange} placeholder="Your question or context" rows={3} className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/30 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/40 focus:outline-none transition-colors resize-none" />
                    <button type="submit" className="w-full py-4 rounded-full bg-mars hover:bg-mars-light text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_40px_-8px_rgba(255,85,0,0.45)]">
                      Let&apos;s Talk
                    </button>
                  </form>
                )}

                <p className="text-center text-white/45 text-[11px]">
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
          <p className="text-white/40 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold text-center mb-4 sm:mb-6">@stage_on_mars</p>
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
      <footer className="py-6 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-white/45 text-[10px]">
          <span>&copy; {new Date().getFullYear()} Stage on Mars</span>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/stage_on_mars" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="https://www.linkedin.com/company/stageonmars" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://playbook.stageonmars.com" className="hover:text-white transition-colors">Playbook</a>
            <Link href="/business/codex" className="hover:text-white transition-colors">Codex</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
