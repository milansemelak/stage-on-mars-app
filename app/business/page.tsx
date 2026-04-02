"use client";

import { useState, useEffect, useRef } from "react";
import PhoneAnimation from "@/components/PhoneAnimation";

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
  return (
    <div ref={ref} className={`fade-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── Cycling quotes ── */
const VOICES = [
  { text: "Absolutely genius. The fastest way to break through corporate thinking.", name: "Vik Maraj", co: "Unstoppable Conversations" },
  { text: "It either confirms what you believe, or shows you a different reality.", name: "Alexandra Lobkowicz", co: "House of Lobkowicz" },
  { text: "You drop the titles, the ego, the learned masks and go deep.", name: "Raul Rodriguez", co: "Dajana Rodriguez" },
  { text: "Partly thanks to dreaming on Mars, Direct Group is flying forward today.", name: "Pavel Řehák", co: "Direct Group" },
  { text: "Brilliant and healing for the company and our people.", name: "Ondřej Novotný", co: "Oktagon MMA" },
];

function Voices() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % VOICES.length);
        setVisible(true);
      }, 800);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[200px] sm:h-[240px] flex flex-col items-center justify-center text-center px-4">
      <p
        className={`font-mercure italic text-white/70 text-[18px] sm:text-[28px] md:text-[34px] leading-[1.35] max-w-3xl transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
      >
        &ldquo;{VOICES[idx].text}&rdquo;
      </p>
      <p
        className={`text-white/20 text-[11px] sm:text-[12px] mt-5 transition-all duration-700 delay-100 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {VOICES[idx].name} · {VOICES[idx].co}
      </p>
    </div>
  );
}

/* ── Constellation — draws on scroll ── */
function Constellation() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = window.innerHeight;
      const p = Math.max(0, Math.min(1, (h - rect.top) / (h + rect.height)));
      setProgress(p);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const outerCircumference = 2 * Math.PI * 140;
  const innerCircumference = 2 * Math.PI * 95;
  const coreCircumference = 2 * Math.PI * 50;

  return (
    <div ref={ref} className="flex items-center justify-center py-8">
      <svg viewBox="0 0 300 300" className="w-[240px] sm:w-[320px] md:w-[380px]">
        {/* Outer ring */}
        <circle
          cx="150" cy="150" r="140"
          fill="none" stroke="rgba(255,85,0,0.15)" strokeWidth="0.5"
          strokeDasharray={outerCircumference}
          strokeDashoffset={outerCircumference * (1 - progress)}
          className="transition-all duration-100"
        />
        {/* Inner ring */}
        <circle
          cx="150" cy="150" r="95"
          fill="none" stroke="rgba(255,85,0,0.12)" strokeWidth="0.4"
          strokeDasharray={innerCircumference}
          strokeDashoffset={innerCircumference * (1 - Math.max(0, (progress - 0.2) / 0.8))}
          className="transition-all duration-100"
        />
        {/* Core */}
        <circle
          cx="150" cy="150" r="50"
          fill="none" stroke="rgba(255,85,0,0.10)" strokeWidth="0.3"
          strokeDasharray={coreCircumference}
          strokeDashoffset={coreCircumference * (1 - Math.max(0, (progress - 0.4) / 0.6))}
          className="transition-all duration-100"
        />
        {/* Character dots — appear at different thresholds */}
        {[
          { cx: 150, cy: 18, t: 0.3 },
          { cx: 260, cy: 100, t: 0.4 },
          { cx: 230, cy: 240, t: 0.5 },
          { cx: 70, cy: 230, t: 0.55 },
          { cx: 40, cy: 100, t: 0.6 },
          { cx: 150, cy: 100, t: 0.7 },
          { cx: 190, cy: 170, t: 0.75 },
          { cx: 110, cy: 160, t: 0.8 },
        ].map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx} cy={dot.cy} r="3"
            fill={`rgba(255,85,0,${progress > dot.t ? 0.6 : 0})`}
            className="transition-all duration-500"
          />
        ))}
      </svg>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════
    PAGE
   ══════════════════════════════════════════════════════════════════ */

export default function BusinessPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", question: "" });
  const [sent, setSent] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 500);
    return () => clearTimeout(t);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Mars inquiry from ${formData.name} @ ${formData.company}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\n\nQuestion:\n${formData.question}`);
    window.open(`mailto:play@stageonmars.com?subject=${subject}&body=${body}`);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] overflow-x-hidden">

      {/* Global styles */}
      <style jsx global>{`
        .fade-section {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .fade-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        @keyframes float-dot {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
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


      {/* ── OPENING: The dot, then the words ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">

        {/* The orange presence — always there */}
        <div
          className={`absolute w-3 h-3 rounded-full bg-mars transition-all duration-[2000ms] ${entered ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          style={{ animation: entered ? "glow-pulse 3s ease-in-out infinite" : "none", top: "42%", left: "50%", marginLeft: "-6px", marginTop: "-6px" }}
        />

        {/* The glow behind the dot */}
        <div
          className={`absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full transition-all duration-[3000ms] ${entered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "radial-gradient(circle, rgba(255,85,0,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />

        <div className={`relative z-10 transition-all duration-[1500ms] delay-[800ms] ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-mars/40 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] mb-6 sm:mb-8">Reality Play Platform</p>
          <h1 className="text-[34px] sm:text-[56px] md:text-[72px] lg:text-[86px] font-bold leading-[0.95] tracking-[-0.04em]">
            Going to <span className="text-mars">Mars.</span>
            <br />
            Are you coming?
          </h1>
          <p className={`font-mercure text-white/25 text-[14px] sm:text-[17px] mt-6 sm:mt-10 transition-all duration-[1500ms] delay-[1600ms] ${entered ? "opacity-100" : "opacity-0"}`}>
            Play with reality to see the impossible.
          </p>
        </div>
      </section>


      {/* ── THE QUESTION ── */}
      <FadeIn className="py-20 sm:py-36 px-4">
        <p className="font-mercure italic text-white/20 text-[16px] sm:text-[22px] md:text-[26px] text-center max-w-2xl mx-auto leading-relaxed">
          What question would you play out<br className="hidden sm:block" /> if no one was watching?
        </p>
      </FadeIn>


      {/* ── THE CONSTELLATION ── */}
      <section className="py-12 sm:py-20">
        <Constellation />
        <FadeIn className="text-center mt-6 sm:mt-10" delay={200}>
          <p className="text-white/50 text-[14px] sm:text-[18px] font-bold tracking-[-0.02em]">Národní 138/10, Praha</p>
          <p className="font-mercure text-white/15 text-[12px] sm:text-[13px] mt-1.5">The flagship stage. One of a kind.</p>
          <a href="/space" className="inline-block text-mars/50 text-[11px] font-bold uppercase tracking-[0.15em] mt-4 hover:text-mars transition-colors">
            Explore →
          </a>
        </FadeIn>
      </section>


      {/* ── LOGOS — quiet ── */}
      <FadeIn className="py-10 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <img src="/clients.png" alt="Clients" className="w-full invert opacity-[0.35]" />
        </div>
      </FadeIn>


      {/* ── VOICES — cycling ── */}
      <section className="py-16 sm:py-28">
        <Voices />
      </section>


      {/* ── THE PLAYS ── */}
      <FadeIn className="py-12 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {[
            { name: "Strategy on Mars", detail: "4h · up to 20", price: "from 75 000 CZK", desc: "Play out the real dynamics — not the ones in the report.", color: "255,85,0" },
            { name: "Creativity on Mars", detail: "3h · up to 30", price: "from 55 000 CZK", desc: "Everyone plays, everyone creates. No hierarchy.", color: "180,120,255" },
            { name: "Leaders on Mars", detail: "3h · up to 12", price: "1 900 CZK / person", desc: "Your question. People who lead people.", color: "80,200,180" },
            { name: "Tailor-Made", detail: "Custom", price: "On request", desc: "Your question is unique. So is the play.", color: "255,160,50" },
          ].map((play) => (
            <a
              key={play.name}
              href="#contact"
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between py-5 sm:py-7 border-b border-white/[0.04] hover:border-white/[0.08] cursor-pointer transition-all"
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} style={{ background: `radial-gradient(ellipse at 30% 50%, rgba(${play.color},0.04) 0%, transparent 70%)` }} />
              <div className="relative z-10 flex-1">
                <h3 className="text-[16px] sm:text-[19px] font-bold tracking-[-0.02em] group-hover:text-mars transition-colors duration-300">{play.name}</h3>
                <p className="font-mercure text-white/20 text-[12px] sm:text-[13px] mt-0.5">{play.desc}</p>
              </div>
              <div className="relative z-10 flex items-center gap-4 sm:gap-6 mt-2 sm:mt-0">
                <span className="text-white/15 text-[11px]">{play.detail}</span>
                <span className="text-white/15 text-[11px] font-mercure">{play.price}</span>
                <span className="text-mars opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[13px]">→</span>
              </div>
            </a>
          ))}
        </div>
      </FadeIn>


      {/* ── THE PHONE — from darkness ── */}
      <FadeIn className="py-16 sm:py-28">
        <div className="flex flex-col items-center">
          <div style={{ transform: 'scale(0.5)', transformOrigin: 'top center', marginBottom: '-42%' }}>
            <div className="relative w-[300px] sm:w-[340px] mx-auto">
              <div className="relative rounded-[48px] border-[2px] border-white/[0.08] bg-black overflow-hidden" style={{ aspectRatio: '393/852' }}>
                <div className="absolute top-0 left-0 right-0 flex justify-center pt-[10px] z-20">
                  <div className="w-[100px] h-[28px] bg-black rounded-full" />
                </div>
                <PhoneAnimation />
                <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-[7px] z-20">
                  <div className="w-[110px] h-[4px] bg-white/15 rounded-full" />
                </div>
              </div>
              {/* Subtle glow */}
              <div className="absolute -inset-16 bg-mars/[0.03] rounded-full blur-[80px] -z-10" />
            </div>
            <div className="mt-8 text-center">
              <a
                href="https://playbook.stageonmars.com/play"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mars/50 text-[11px] font-bold uppercase tracking-[0.15em] hover:text-mars transition-colors"
              >
                Play Now →
              </a>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── TEAM ── */}
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
              <p className="text-white/15 text-[11px] sm:text-[12px]">
                Milan Semelak · David Vais · Tomas Pavlik · Jan Piskor · Andrea Sturalova
              </p>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── THE QUESTION AGAIN — ending where we started ── */}
      <section id="contact" className="py-20 sm:py-32 px-4 relative">

        {/* The dot returns */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <div className="w-2.5 h-2.5 rounded-full bg-mars" style={{ animation: "glow-pulse 3s ease-in-out infinite" }} />
        </div>

        <FadeIn>
          <div className="max-w-md mx-auto space-y-8">
            <h2 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em] text-center">What&apos;s yours?</h2>

            {sent ? (
              <div className="text-center py-8">
                <p className="font-mercure text-white/40 text-[14px]">Thank you. We&apos;ll be in touch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="font-mercure w-full rounded-lg bg-white/[0.03] border border-white/[0.05] focus:border-mars/20 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/12 focus:outline-none transition-colors" />
                  <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="font-mercure w-full rounded-lg bg-white/[0.03] border border-white/[0.05] focus:border-mars/20 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/12 focus:outline-none transition-colors" />
                </div>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="font-mercure w-full rounded-lg bg-white/[0.03] border border-white/[0.05] focus:border-mars/20 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/12 focus:outline-none transition-colors" />
                <textarea name="question" value={formData.question} onChange={handleChange} placeholder="Your question" rows={3} className="font-mercure w-full rounded-lg bg-white/[0.03] border border-white/[0.05] focus:border-mars/20 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/12 focus:outline-none transition-colors resize-none" />
                <button type="submit" className="w-full py-3 rounded-lg bg-mars hover:bg-mars-light text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all">
                  Let&apos;s Talk
                </button>
              </form>
            )}

            <p className="text-center font-mercure text-white/12 text-[11px]">
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
