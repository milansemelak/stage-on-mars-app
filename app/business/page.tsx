"use client";

import { useState, useEffect } from "react";
import PhoneAnimation from "@/components/PhoneAnimation";

const TESTIMONIALS = [
  {
    name: "Vik Maraj",
    company: "Unstoppable Conversations",
    quote: "Absolutely genius. The fastest way to break through corporate thinking.",
  },
  {
    name: "Radka Dohnalová",
    company: "ATAIRU",
    quote: "The power of this format lies in its ability to shift perspectives. It lets people break free from ingrained patterns of thinking. The result is incredible.",
  },
  {
    name: "Raul Rodriguez",
    company: "Dajana Rodriguez",
    quote: "You drop the titles, the ego, the learned masks and go deep. For me it was a moment that gave me completely new thoughts and a view on things I hadn't seen before.",
  },
];

export default function BusinessPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", question: "" });
  const [sent, setSent] = useState(false);

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

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <img src="/logo.png" alt="Stage On Mars" className="h-7 sm:h-14 w-auto invert" />
          <a
            href="#contact"
            className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] text-[#0a0a0a] bg-mars hover:bg-mars-light px-5 sm:px-9 py-2 sm:py-2.5 rounded-full transition-all"
          >
            Book a Play
          </a>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          HERO — cinematic full-screen, single CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 relative overflow-hidden">
        <img src="/space2.png" alt="" className="absolute inset-0 w-full h-full object-cover scale-105" style={{ filter: 'brightness(0.45) contrast(1.15) saturate(1.3)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_42%,_rgba(255,85,0,0.10)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_45%,_transparent_30%,_rgba(0,0,0,0.65)_100%)]" />

        <div className="relative z-10 max-w-5xl flex flex-col items-center">
          <p className="text-mars text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-4 sm:mb-6" style={{ textShadow: '0 1px 20px rgba(0,0,0,0.6)' }}>Reality Play Platform</p>
          <h1 className="text-[38px] sm:text-[64px] md:text-[80px] lg:text-[100px] font-bold leading-[0.95] tracking-[-0.04em] sm:tracking-[-0.05em]" style={{ textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}>
            Going to <span className="text-mars" style={{ textShadow: '0 0 60px rgba(255,85,0,0.35), 0 0 120px rgba(255,85,0,0.15), 0 2px 40px rgba(0,0,0,0.5)' }}>Mars.</span>
            <br />
            Are you coming?
          </h1>

          <p className="font-mercure text-[#EDEDED]/50 text-[15px] sm:text-[22px] leading-[22px] sm:leading-[32px] max-w-[280px] sm:max-w-lg mx-auto mt-5 sm:mt-10" style={{ textShadow: '0 1px 20px rgba(0,0,0,0.6)' }}>
            Turn real questions into plays. See what no meeting, report, or strategy deck can show you.
          </p>

          <div className="mt-8 sm:mt-14">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 sm:gap-3 text-[11px] sm:text-[15px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-white bg-mars hover:bg-mars-light px-6 sm:px-10 py-3 sm:py-4 rounded-full transition-all shadow-[0_8px_40px_-4px_rgba(255,85,0,0.35)] hover:shadow-[0_12px_50px_-4px_rgba(255,85,0,0.5)]"
            >
              Book a Play
              <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps over cinematic photo
      ═══════════════════════════════════════════════════════════════ */}

      <section id="experience" className="relative overflow-hidden">
        <img src="/exp.jpg" alt="Stage on Mars — live experience" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-end min-h-[70vh] sm:min-h-[80vh] px-4 sm:px-6 pb-10 sm:pb-16">
          <div className="flex items-center gap-3 sm:gap-6 text-center">
            <div>
              <p className="text-white font-bold text-[14px] sm:text-[20px] tracking-[-0.02em]">Bring a real question</p>
              <p className="font-mercure text-white/40 text-[11px] sm:text-[13px] mt-1 hidden sm:block">Something no meeting resolves.</p>
            </div>
            <span className="text-mars/50 text-[18px] sm:text-[24px] font-light">→</span>
            <div>
              <p className="text-white font-bold text-[14px] sm:text-[20px] tracking-[-0.02em]">Play it on stage</p>
              <p className="font-mercure text-white/40 text-[11px] sm:text-[13px] mt-1 hidden sm:block">What&apos;s hidden becomes visible.</p>
            </div>
            <span className="text-mars/50 text-[18px] sm:text-[24px] font-light">→</span>
            <div>
              <p className="text-white font-bold text-[14px] sm:text-[20px] tracking-[-0.02em]">See beyond</p>
              <p className="font-mercure text-white/40 text-[11px] sm:text-[13px] mt-1 hidden sm:block">What needs to shift.</p>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          THE SPACE — full-bleed cinematic venue hero
      ═══════════════════════════════════════════════════════════════ */}

      <section className="relative overflow-hidden">
        <div className="relative h-[60vh] sm:h-[75vh]">
          <img
            src="/space1.png"
            alt="Stage on Mars — flagship space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
            <p className="text-mars text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-3 sm:mb-4">Where it happens</p>
            <h2 className="text-[22px] sm:text-[32px] md:text-[38px] font-bold leading-[0.92] tracking-[-0.03em] mb-3 sm:mb-5">
              The Flagship Stage.
            </h2>
            <p className="font-mercure text-[#EDEDED]/50 text-[13px] sm:text-[18px] max-w-[240px] sm:max-w-md mb-3 sm:mb-6">
              A stage built for reality play.
            </p>
            <div className="mt-2 sm:mt-4">
              <p className="text-[16px] sm:text-[24px] font-bold tracking-[-0.02em]">Národní 138/10, Praha</p>
              <p className="font-mercure text-[#EDEDED]/35 text-[12px] sm:text-[16px] mt-1 sm:mt-2">One of a kind in the world.</p>
            </div>
            <div className="mt-6 sm:mt-10">
              <a
                href="/space"
                className="inline-flex items-center gap-2 sm:gap-3 bg-mars hover:bg-mars-light text-white font-bold text-xs sm:text-sm uppercase tracking-[0.12em] px-6 sm:px-10 py-3 sm:py-4 rounded-xl transition-all shadow-[0_8px_40px_-4px_rgba(255,85,0,0.35)] hover:shadow-[0_12px_50px_-4px_rgba(255,85,0,0.5)]"
              >
                Explore the Stage
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          PROOF — case studies + logos + testimonials as one flow
      ═══════════════════════════════════════════════════════════════ */}

      {/* Case studies */}
      <section className="pt-12 sm:pt-20 pb-8 sm:pb-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-mars text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-center mb-6 sm:mb-10">Who&apos;s played their reality</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
            {[
              { tag: "700 years of tradition", name: "House of Lobkowicz", quote: "The experience opens new perspectives. It either confirms what you believe, or shows you a different reality.", author: "Alexandra Lobkowicz" },
              { tag: "Expansion to 3 countries", name: "Direct Group", quote: "Partly thanks to dreaming on Mars, Direct Group is flying forward today.", author: "Pavel Řehák" },
              { tag: "Face Your Fear", name: "Oktagon MMA", quote: "Brilliant and healing for the company and our people.", author: "Ondřej Novotný" },
            ].map((cs) => (
              <div key={cs.name} className="space-y-3">
                <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.2em]">{cs.tag}</p>
                <h4 className="text-[16px] sm:text-[18px] font-bold tracking-[-0.02em]">{cs.name}</h4>
                <p className="font-mercure italic text-[#EDEDED]/40 text-[13px] sm:text-[14px] leading-[20px] sm:leading-[22px]">&ldquo;{cs.quote}&rdquo;</p>
                <p className="text-mars/50 text-[11px] font-bold">&mdash; {cs.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client logos */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <p className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white/20 mb-6 sm:mb-10">Trusted by leaders at</p>
        <div className="max-w-4xl mx-auto">
          <img src="/clients.png" alt="Clients" className="w-full invert opacity-80" />
        </div>
      </section>

      {/* Testimonials — cinematic, each quote gets its own moment */}
      <section className="relative overflow-hidden py-12 sm:py-20 px-4 sm:px-6">
        <img src="/fotka5.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a0a0a]/85" />
        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Hero quote — the short killer one, massive */}
          <div className="text-center mb-12 sm:mb-20">
            <p className="font-mercure italic text-white text-[24px] sm:text-[42px] md:text-[52px] leading-[1.15] tracking-[-0.02em] max-w-4xl mx-auto">
              &ldquo;{TESTIMONIALS[0].quote}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3 mt-5 sm:mt-8">
              <div className="w-8 h-[2px] bg-mars/50" />
              <p className="text-white/80 font-bold text-[13px] sm:text-[15px]">{TESTIMONIALS[0].name}</p>
              <p className="font-mercure text-white/40 text-[13px] sm:text-[15px]">{TESTIMONIALS[0].company}</p>
            </div>
          </div>

          {/* Two supporting quotes side by side */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-12">
            {TESTIMONIALS.slice(1).map((t) => (
              <div key={t.name} className="border-l-2 border-mars/20 pl-5 sm:pl-6">
                <p className="font-mercure italic text-white/70 text-[14px] sm:text-[16px] leading-[1.6] tracking-[-0.2px] mb-3">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-white/70 font-bold text-[12px] sm:text-[13px]">{t.name}</p>
                  <p className="text-white/30 text-[12px] sm:text-[13px]">·</p>
                  <p className="font-mercure text-white/35 text-[12px] sm:text-[13px]">{t.company}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          PRODUCTS — after proof (trust first, buy second)
      ═══════════════════════════════════════════════════════════════ */}

      <section className="py-10 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-mars text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-center mb-3 sm:mb-4">Reality plays</p>
          <h3 className="text-[22px] sm:text-[32px] font-bold text-center mb-2 sm:mb-3 tracking-[-0.03em] leading-[0.94]">Bestselling Plays</h3>
          <p className="font-mercure text-[#EDEDED]/40 text-center text-[12px] sm:text-[14px] mb-6 sm:mb-10">Each one starts with a question. Each one ends beyond where you started.</p>

          {/* Play cards — theatrical scene style */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">

            {/* Strategy */}
            <a href="#contact" className="group relative rounded-xl overflow-hidden cursor-pointer block">
              {/* Stage circle glow */}
              <div className="absolute inset-0 bg-[#080808]" />
              <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-[radial-gradient(circle,_rgba(255,85,0,0.12)_0%,_rgba(255,85,0,0.04)_40%,_transparent_70%)] group-hover:bg-[radial-gradient(circle,_rgba(255,85,0,0.20)_0%,_rgba(255,85,0,0.06)_40%,_transparent_70%)] transition-all duration-700" />
              <svg className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[70%] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-mars" /><circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-mars" /></svg>
              <div className="relative z-10 p-5 sm:p-6 flex flex-col min-h-[220px] sm:min-h-[260px] justify-between">
                <div>
                  <p className="text-mars/50 text-[9px] font-bold uppercase tracking-[0.25em] mb-2">4 hours · up to 20 people</p>
                  <h3 className="text-[22px] sm:text-[26px] font-bold leading-[0.92] tracking-[-0.03em]">Strategy<br />on Mars</h3>
                </div>
                <div>
                  <p className="text-white/45 text-[12px] sm:text-[13px] leading-[18px] sm:leading-[20px] mb-3">
                    A reality play that cuts through the noise. Your leadership team plays out the real dynamics — not the ones in the report. You see what&apos;s actually driving decisions.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/25 text-[11px] font-mercure">from 75 000 CZK</span>
                    <span className="text-mars text-[10px] font-bold uppercase tracking-[0.15em] group-hover:text-white transition-colors duration-300 flex items-center gap-1">
                      I&apos;ll take my team
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current group-hover:translate-x-1 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            </a>

            {/* Creativity */}
            <a href="#contact" className="group relative rounded-xl overflow-hidden cursor-pointer block">
              <div className="absolute inset-0 bg-[#080808]" />
              <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-[radial-gradient(circle,_rgba(180,120,255,0.10)_0%,_rgba(180,120,255,0.03)_40%,_transparent_70%)] group-hover:bg-[radial-gradient(circle,_rgba(180,120,255,0.18)_0%,_rgba(180,120,255,0.05)_40%,_transparent_70%)] transition-all duration-700" />
              <svg className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[70%] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400" /><circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-purple-400" /></svg>
              <div className="relative z-10 p-5 sm:p-6 flex flex-col min-h-[220px] sm:min-h-[260px] justify-between">
                <div>
                  <p className="text-purple-400/50 text-[9px] font-bold uppercase tracking-[0.25em] mb-2">3 hours · up to 30 people</p>
                  <h3 className="text-[22px] sm:text-[26px] font-bold leading-[0.92] tracking-[-0.03em]">Creativity<br />on Mars</h3>
                </div>
                <div>
                  <p className="text-white/45 text-[12px] sm:text-[13px] leading-[18px] sm:leading-[20px] mb-3">
                    A reality play that unlocks your team&apos;s creative potential. Everyone plays, everyone creates — no hierarchy, no limits. What&apos;s stuck starts moving.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/25 text-[11px] font-mercure">from 55 000 CZK</span>
                    <span className="text-mars text-[10px] font-bold uppercase tracking-[0.15em] group-hover:text-white transition-colors duration-300 flex items-center gap-1">
                      I&apos;ll take my team
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current group-hover:translate-x-1 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            </a>

            {/* Leaders */}
            <a href="#contact" className="group relative rounded-xl overflow-hidden cursor-pointer block">
              <div className="absolute inset-0 bg-[#080808]" />
              <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-[radial-gradient(circle,_rgba(80,200,180,0.10)_0%,_rgba(80,200,180,0.03)_40%,_transparent_70%)] group-hover:bg-[radial-gradient(circle,_rgba(80,200,180,0.18)_0%,_rgba(80,200,180,0.05)_40%,_transparent_70%)] transition-all duration-700" />
              <svg className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[70%] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-teal-400" /><circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-teal-400" /></svg>
              <div className="relative z-10 p-5 sm:p-6 flex flex-col min-h-[220px] sm:min-h-[260px] justify-between">
                <div>
                  <p className="text-teal-400/50 text-[9px] font-bold uppercase tracking-[0.25em] mb-2">3 hours · up to 12 people</p>
                  <h3 className="text-[22px] sm:text-[26px] font-bold leading-[0.92] tracking-[-0.03em]">Leaders<br />on Mars</h3>
                  <p className="font-mercure italic text-white/30 text-[12px] mt-1">Not a team. Just you.</p>
                </div>
                <div>
                  <p className="text-white/45 text-[12px] sm:text-[13px] leading-[18px] sm:leading-[20px] mb-3">
                    Bring your own question. Play it out with people who lead people. A reality play for individuals ready to see beyond their current perspective.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/25 text-[11px] font-mercure">1 900 CZK / person</span>
                    <span className="text-mars text-[10px] font-bold uppercase tracking-[0.15em] group-hover:text-white transition-colors duration-300 flex items-center gap-1">
                      I&apos;m coming
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current group-hover:translate-x-1 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            </a>

            {/* Tailor-Made */}
            <a href="#contact" className="group relative rounded-xl overflow-hidden cursor-pointer block">
              <div className="absolute inset-0 bg-[#080808]" />
              <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-[radial-gradient(circle,_rgba(255,85,0,0.08)_0%,_rgba(255,180,50,0.04)_40%,_transparent_70%)] group-hover:bg-[radial-gradient(circle,_rgba(255,85,0,0.16)_0%,_rgba(255,180,50,0.06)_40%,_transparent_70%)] transition-all duration-700" />
              <svg className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[70%] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-mars" /><circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-mars" /><circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-mars" /></svg>
              <div className="relative z-10 p-5 sm:p-6 flex flex-col min-h-[220px] sm:min-h-[260px] justify-between">
                <div>
                  <p className="text-mars/50 text-[9px] font-bold uppercase tracking-[0.25em] mb-2">Custom format · Your team, your rules</p>
                  <h3 className="text-[22px] sm:text-[26px] font-bold leading-[0.92] tracking-[-0.03em]">Tailor-Made<br />Experience</h3>
                </div>
                <div>
                  <p className="text-white/45 text-[12px] sm:text-[13px] leading-[18px] sm:leading-[20px] mb-3">
                    Your question is unique. So is the play. We design a bespoke reality play for your organization — custom format, custom duration, anywhere in the world. For leadership teams that need more than an off-the-shelf experience.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/25 text-[11px] font-mercure">On request</span>
                    <span className="text-mars text-[10px] font-bold uppercase tracking-[0.15em] group-hover:text-white transition-colors duration-300 flex items-center gap-1">
                      Design your play
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current group-hover:translate-x-1 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            </a>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          THE PLAYMAKER — interactive phone animation, digital teaser
      ═══════════════════════════════════════════════════════════════ */}

      <section className="relative overflow-hidden border-t border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.06)_0%,_transparent_50%)]" />
        <div className="relative z-10 pt-12 sm:pt-20 pb-14 sm:pb-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-10">
              <p className="text-mars text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-3 sm:mb-4">Not ready for live?</p>
              <h2 className="text-[22px] sm:text-[32px] font-bold leading-[0.92] tracking-[-0.03em] mb-3 sm:mb-4">
                Try it digitally.
              </h2>
              <p className="font-mercure text-[#EDEDED]/40 text-[12px] sm:text-[14px] max-w-[260px] sm:max-w-md mx-auto">
                Your question becomes a reality play — instantly. See what you can&apos;t see yet.
              </p>
            </div>

            {/* iPhone with side labels */}
            <div style={{ transform: 'scale(0.65)', transformOrigin: 'top center', marginBottom: '-35%' }}>
              <div className="relative flex items-start justify-center">

                {/* LEFT side labels — hidden on mobile */}
                <div className="hidden lg:flex flex-col items-end gap-14 pt-[80px] pr-12 w-[260px] flex-shrink-0">
                  <div className="text-right max-w-[220px]">
                    <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Question</p>
                    <p className="text-white/40 text-sm leading-relaxed">Ask any real question. Strategy, culture, leadership — the play starts with what matters to you.</p>
                  </div>
                  <div className="text-right max-w-[220px]">
                    <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Characters</p>
                    <p className="text-white/40 text-sm leading-relaxed">AI generates characters — concrete and abstract forces that shape your reality.</p>
                  </div>
                  <div className="text-right max-w-[220px]">
                    <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">The Stage</p>
                    <p className="text-white/40 text-sm leading-relaxed">A systemic constellation — characters positioned in space, revealing what&apos;s hidden in your reality.</p>
                  </div>
                </div>

                {/* THE iPHONE */}
                <div className="relative flex-shrink-0 w-[300px] sm:w-[340px] lg:w-[360px]">
                  <div className="relative rounded-[48px] border-[3px] border-white/[0.15] bg-black overflow-hidden shadow-[0_0_100px_rgba(255,85,0,0.06),0_20px_80px_rgba(0,0,0,0.7)]" style={{ aspectRatio: '393/852' }}>
                    <div className="absolute top-0 left-0 right-0 flex justify-center pt-[10px] z-20">
                      <div className="w-[100px] h-[28px] bg-black rounded-full" />
                    </div>
                    <PhoneAnimation />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-[7px] z-20">
                      <div className="w-[110px] h-[4px] bg-white/20 rounded-full" />
                    </div>
                  </div>
                  <div className="absolute -inset-20 bg-mars/[0.04] rounded-full blur-[100px] -z-10" />
                </div>

                {/* RIGHT side labels — hidden on mobile */}
                <div className="hidden lg:flex flex-col items-start gap-14 pt-[80px] pl-12 w-[260px] flex-shrink-0">
                  <div className="text-left max-w-[220px]">
                    <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Play Card</p>
                    <p className="text-white/40 text-sm leading-relaxed">Every question generates a unique reality play — complete with setting, characters, and your role.</p>
                  </div>
                  <div className="text-left max-w-[220px]">
                    <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Your Role</p>
                    <p className="text-white/40 text-sm leading-relaxed">You&apos;re not a spectator. You&apos;re the author — you decide what happens next on the stage.</p>
                  </div>
                  <div className="text-left max-w-[220px]">
                    <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Perspective</p>
                    <p className="text-white/40 text-sm leading-relaxed">The play doesn&apos;t give you answers. It lets you see beyond your current reality.</p>
                  </div>
                </div>
              </div>

              {/* Mobile-only labels */}
              <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-6 mt-10 px-2">
                <div>
                  <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Question</p>
                  <p className="text-white/35 text-xs leading-relaxed">Ask any real question — strategy, culture, leadership.</p>
                </div>
                <div>
                  <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Characters</p>
                  <p className="text-white/35 text-xs leading-relaxed">AI generates characters — forces that shape your reality.</p>
                </div>
                <div>
                  <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">The Stage</p>
                  <p className="text-white/35 text-xs leading-relaxed">A constellation revealing what&apos;s hidden in your reality.</p>
                </div>
                <div>
                  <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Play Card</p>
                  <p className="text-white/35 text-xs leading-relaxed">A unique reality play with setting, characters, and your role.</p>
                </div>
                <div>
                  <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Your Role</p>
                  <p className="text-white/35 text-xs leading-relaxed">You&apos;re the author — you decide what happens next.</p>
                </div>
                <div>
                  <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Perspective</p>
                  <p className="text-white/35 text-xs leading-relaxed">Not answers — a way to see beyond your current reality.</p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 sm:mt-14 text-center space-y-3">
                <a
                  href="https://playbook.stageonmars.com/play"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-white bg-mars hover:bg-mars-light text-sm font-bold uppercase tracking-[0.1em] px-8 py-4 rounded-xl transition-all group shadow-[0_8px_40px_-4px_rgba(255,85,0,0.35)] hover:shadow-[0_12px_50px_-4px_rgba(255,85,0,0.5)]"
                >
                  Play Now
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current group-hover:translate-x-1 transition-transform"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          TEAM
      ═══════════════════════════════════════════════════════════════ */}

      <section className="py-12 sm:py-24 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src="/team.jpg"
                alt="Stage on Mars team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
            </div>
            <div className="space-y-6">
              <p className="text-mars text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]">The team</p>
              <p className="font-mercure text-[#EDEDED]/50 text-[16px] sm:text-[18px] leading-[26px]">
                Originally created during the COVID pandemic by Milan Semelak and Zuzana Semelak, who laid the foundations of Reality Play through experimentation with systemic constellations, theatre, and improvisation.
              </p>
              <p className="font-mercure text-[#EDEDED]/50 text-[16px] sm:text-[18px] leading-[26px]">
                In 2023, joined by David Vais as partner and investor, they evolved Reality Play into a platform, opened the flagship stage, and turned Stage on Mars into a recognized brand.
              </p>
              <p className="text-white/70 text-[15px] leading-[24px] font-bold">
                800+ reality plays created. London, Zurich, Bucharest.
              </p>
              <p className="text-[#EDEDED]/40 text-[14px] leading-[22px]">
                <span className="font-bold text-[#EDEDED]/50">Current team:</span> Milan Semelak, David Vais, Tomas Pavlik, Jan Piskor, Andrea Sturalova
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-mars hover:text-mars-light text-sm font-bold uppercase tracking-[0.1em] transition-colors group"
              >
                Get in touch
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          CONTACT + FOOTER
      ═══════════════════════════════════════════════════════════════ */}

      <section id="contact" className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden border-t border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.06)_0%,_transparent_60%)]" />
        <div className="relative z-10 max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <p className="text-mars text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-3 sm:mb-4">Get in touch</p>
            <h2 className="text-[22px] sm:text-[32px] font-bold leading-[0.94] tracking-[-0.03em]">What&apos;s your question?</h2>
            <p className="font-mercure text-[#EDEDED]/30 text-[12px] sm:text-[14px]">We reply within 24 hours.</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4 py-8">
              <div className="text-mars text-5xl">&#10003;</div>
              <p className="font-mercure text-[#EDEDED]/50 text-lg">Thank you. We&apos;ll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/10 focus:border-mars/40 px-4 py-3.5 text-[#EDEDED] placeholder:text-[#EDEDED]/20 focus:outline-none transition-colors"
                />
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company"
                  className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/10 focus:border-mars/40 px-4 py-3.5 text-[#EDEDED] placeholder:text-[#EDEDED]/20 focus:outline-none transition-colors"
                />
              </div>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/10 focus:border-mars/40 px-4 py-3.5 text-[#EDEDED] placeholder:text-[#EDEDED]/20 focus:outline-none transition-colors"
              />
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="What's your question?"
                rows={3}
                className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/10 focus:border-mars/40 px-4 py-3.5 text-[#EDEDED] placeholder:text-[#EDEDED]/20 focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-mars hover:bg-mars-light text-white font-bold text-base uppercase tracking-[0.15em] transition-all shadow-[0_4px_30px_rgba(255,85,0,0.3)] hover:shadow-[0_4px_40px_rgba(255,85,0,0.5)]"
              >
                Let&apos;s Talk
              </button>
            </form>
          )}

          <div className="text-center space-y-2">
            <p className="font-mercure text-[#EDEDED]/35 text-sm">or reach us directly</p>
            <p className="font-mercure text-[#EDEDED]/50">
              <a href="mailto:play@stageonmars.com" className="hover:text-mars transition-colors font-bold">play@stageonmars.com</a>
              {" "}&middot;{" "}
              <a href="tel:+420602336338" className="hover:text-mars transition-colors">+420 602 336 338</a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mercure text-[#EDEDED]/15 text-xs">
            <span>&copy; {new Date().getFullYear()} Stage on Mars</span>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/stage_on_mars" target="_blank" rel="noopener noreferrer" className="hover:text-[#EDEDED]/30 transition-colors">Instagram</a>
              <a href="https://www.linkedin.com/company/stageonmars" target="_blank" rel="noopener noreferrer" className="hover:text-[#EDEDED]/30 transition-colors">LinkedIn</a>
              <a href="https://playbook.stageonmars.com" className="hover:text-[#EDEDED]/30 transition-colors">Playbook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
