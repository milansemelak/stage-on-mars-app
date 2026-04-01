"use client";

import { useState } from "react";

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
          HERO — cinematic full-screen
      ═══════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 relative overflow-hidden">
        {/* Background image with cinematic treatment */}
        <img src="/space2.png" alt="" className="absolute inset-0 w-full h-full object-cover scale-105" style={{ filter: 'brightness(0.45) contrast(1.15) saturate(1.3)' }} />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_42%,_rgba(255,85,0,0.10)_0%,_transparent_70%)]" />
        {/* Strong vignette for text pop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_45%,_transparent_30%,_rgba(0,0,0,0.65)_100%)]" />

        <div className="relative z-10 max-w-5xl flex flex-col items-center">
          {/* Eyebrow */}
          <p className="text-mars/60 text-[10px] sm:text-sm font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-4 sm:mb-6" style={{ textShadow: '0 1px 20px rgba(0,0,0,0.6)' }}>Live Reality Plays for Leadership Teams</p>
          <h1 className="text-[38px] sm:text-[64px] md:text-[80px] lg:text-[100px] font-bold leading-[0.88] tracking-[-0.04em] sm:tracking-[-0.05em]" style={{ textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}>
            Play to see
            <br />
            <span className="text-mars" style={{ textShadow: '0 0 60px rgba(255,85,0,0.35), 0 0 120px rgba(255,85,0,0.15), 0 2px 40px rgba(0,0,0,0.5)' }}>beyond reality.</span>
          </h1>

          {/* Subline */}
          <p className="font-mercure text-[#EDEDED]/50 text-[15px] sm:text-[22px] leading-[22px] sm:leading-[32px] max-w-[280px] sm:max-w-lg mx-auto mt-5 sm:mt-10" style={{ textShadow: '0 1px 20px rgba(0,0,0,0.6)' }}>
            Turn real questions into plays. See what no meeting, report, or strategy deck can show you.
          </p>

          {/* Single CTA */}
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

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps + venue
      ═══════════════════════════════════════════════════════════════ */}

      <section id="experience" className="relative overflow-hidden">
        <img src="/exp.jpg" alt="Stage on Mars — live experience" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/85 to-[#0a0a0a]/95" />
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-20 sm:pt-40 pb-12 sm:pb-24">
          <p className="text-mars text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-3 sm:mb-4">How It Works</p>
          <h2 className="text-[32px] sm:text-[56px] md:text-[72px] font-bold leading-[0.88] tracking-[-0.04em] mb-3 sm:mb-4">
            Play it. See it.
          </h2>
          <p className="font-mercure text-[#EDEDED]/60 text-[14px] sm:text-[20px] mb-10 sm:mb-20 max-w-[280px] sm:max-w-xl">
            Your question becomes a reality play on stage. What&apos;s invisible becomes obvious.
          </p>

          {/* 3 steps */}
          <div className="grid grid-cols-3 gap-4 sm:gap-12 text-center max-w-4xl mx-auto">
            <div className="space-y-2 sm:space-y-3">
              <p className="text-mars/40 text-[28px] sm:text-[56px] font-bold leading-none">1</p>
              <h3 className="text-[13px] sm:text-[22px] font-bold tracking-[-0.02em]">Bring a real question</h3>
              <p className="font-mercure text-[#EDEDED]/40 text-[11px] sm:text-[14px] leading-[16px] sm:leading-[20px]">Something no meeting resolves. Something that shapes what happens next.</p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <p className="text-mars/40 text-[28px] sm:text-[56px] font-bold leading-none">2</p>
              <h3 className="text-[13px] sm:text-[22px] font-bold tracking-[-0.02em]">Play it into reality</h3>
              <p className="font-mercure text-[#EDEDED]/40 text-[11px] sm:text-[14px] leading-[16px] sm:leading-[20px]">Step into roles. Play the situation out on stage. What&apos;s hidden becomes visible.</p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <p className="text-mars/40 text-[28px] sm:text-[56px] font-bold leading-none">3</p>
              <h3 className="text-[13px] sm:text-[22px] font-bold tracking-[-0.02em]">See beyond</h3>
              <p className="font-mercure text-[#EDEDED]/40 text-[11px] sm:text-[14px] leading-[16px] sm:leading-[20px]">You see what&apos;s really driving it — beyond the current reality. And what needs to shift.</p>
            </div>
          </div>

          {/* Venue detail — absorbed from The Space chapter */}
          <div className="mt-12 sm:mt-24 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-6 max-w-2xl mx-auto">
            <img src="/space1.png" alt="Stage on Mars — flagship space" className="w-full sm:w-48 h-28 sm:h-32 object-cover rounded-xl" />
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-mars/50 mb-1">The Flagship Stage</p>
              <p className="text-[18px] sm:text-[22px] font-bold tracking-[-0.02em]">Národní 138/10, Praha</p>
              <p className="font-mercure text-[#EDEDED]/35 text-[12px] sm:text-[14px] mt-1">A stage built for reality play. One of a kind in the world.</p>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          PROOF — case studies, logos, testimonials in one flow
      ═══════════════════════════════════════════════════════════════ */}

      {/* Case studies */}
      <section className="pt-16 sm:pt-32 pb-10 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[22px] sm:text-[48px] font-bold text-center mb-8 sm:mb-16 leading-[0.94] tracking-[-0.03em]">WHO&apos;S PLAYED THEIR REALITY?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
            {[
              { tag: "700 years of tradition", name: "House of Lobkowicz", quote: "The experience opens new perspectives. It either confirms what you believe, or shows you a different reality.", author: "Alexandra Lobkowicz" },
              { tag: "Expansion to 3 countries", name: "Direct Group", quote: "Partly thanks to dreaming on Mars, Direct Group is flying forward today.", author: "Pavel Řehák" },
              { tag: "Face Your Fear", name: "Oktagon MMA", quote: "Brilliant and healing for the company and our people.", author: "Ondřej Novotný" },
            ].map((cs) => (
              <div key={cs.name} className="space-y-4">
                <p className="text-mars/40 text-[10px] font-bold uppercase tracking-[0.2em]">{cs.tag}</p>
                <h4 className="text-[22px] sm:text-[26px] font-bold tracking-[-0.025em]">{cs.name}</h4>
                <p className="font-mercure italic text-[#EDEDED]/40 text-[16px] leading-[24px]">&ldquo;{cs.quote}&rdquo;</p>
                <p className="text-mars/50 text-[12px] font-bold">&mdash; {cs.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client logos — no border, flows into next */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <p className="text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-white/20 mb-6 sm:mb-10">Trusted by leaders at</p>
        <div className="max-w-4xl mx-auto">
          <img src="/clients.png" alt="Clients" className="w-full invert opacity-80" />
        </div>
      </section>

      {/* Testimonials — on fotka5 */}
      <section className="relative overflow-hidden py-14 sm:py-36 px-4 sm:px-6">
        <img src="/fotka5.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a0a0a]/85" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-mars/50 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-8 sm:mb-20 text-center">What they say about us</p>
          <div className="space-y-8 sm:space-y-16">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`${i % 2 === 0 ? 'sm:pr-24' : 'sm:pl-24'}`}>
                <p className="font-mercure italic text-white/90 text-[15px] sm:text-[18px] leading-[1.6] tracking-[-0.2px] mb-3 sm:mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-mars/50" />
                  <p className="text-white/90 font-bold text-sm">{t.name}</p>
                  <p className="font-mercure text-white/50 text-sm">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          PRODUCTS — after proof, with Playmaker link
      ═══════════════════════════════════════════════════════════════ */}

      <section className="py-14 sm:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-[26px] sm:text-[52px] font-bold text-center mb-3 sm:mb-6 tracking-[-0.03em] leading-[0.94]">Bestselling Plays</h3>
          <p className="font-mercure text-[#EDEDED]/40 text-center text-[13px] sm:text-[20px] mb-10 sm:mb-28">Each one starts with a question. Each one ends beyond where you started.</p>

          <div className="space-y-6 sm:space-y-8">
            {/* Strategy */}
            <div className="group relative rounded-2xl border border-white/[0.06] hover:border-mars/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,85,0,0.06)_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 grid md:grid-cols-2 gap-5 md:gap-16 p-5 sm:p-12 items-center">
                <div>
                  <div className="w-6 sm:w-8 h-[2px] bg-mars/50 mb-4 sm:mb-6" />
                  <h3 className="text-[28px] sm:text-[56px] font-bold leading-[0.92] tracking-[-0.04em]">Strategy<br />on Mars</h3>
                  <div className="mt-3 sm:mt-6 flex items-center gap-3 sm:gap-5 text-white/30 text-[11px] sm:text-sm">
                    <span>4 hours</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>up to 20 people</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>from 75 000 CZK</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/55 text-[14px] sm:text-[17px] leading-[22px] sm:leading-[28px]">
                    A reality play that cuts through the noise. Your leadership team plays out the real dynamics — not the ones in the report. You see what&apos;s actually driving decisions.
                  </p>
                  <a href="#contact" className="mt-5 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 text-mars hover:text-white text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] group/link transition-colors duration-300">
                    I&apos;ll take my team
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover/link:translate-x-1.5 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Creativity */}
            <div className="group relative rounded-2xl border border-white/[0.06] hover:border-mars/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,85,0,0.06)_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 grid md:grid-cols-2 gap-5 md:gap-16 p-5 sm:p-12 items-center">
                <div>
                  <div className="w-6 sm:w-8 h-[2px] bg-mars/50 mb-4 sm:mb-6" />
                  <h3 className="text-[28px] sm:text-[56px] font-bold leading-[0.92] tracking-[-0.04em]">Creativity<br />on Mars</h3>
                  <div className="mt-3 sm:mt-6 flex items-center gap-3 sm:gap-5 text-white/30 text-[11px] sm:text-sm">
                    <span>3 hours</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>up to 30 people</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>from 55 000 CZK</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/55 text-[14px] sm:text-[17px] leading-[22px] sm:leading-[28px]">
                    A reality play that unlocks your team&apos;s creative potential. Everyone plays, everyone creates — no hierarchy, no limits. What&apos;s stuck starts moving.
                  </p>
                  <a href="#contact" className="mt-5 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 text-mars hover:text-white text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] group/link transition-colors duration-300">
                    I&apos;ll take my team
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover/link:translate-x-1.5 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Leaders */}
            <div className="group relative rounded-2xl border border-white/[0.06] hover:border-mars/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,85,0,0.06)_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 grid md:grid-cols-2 gap-5 md:gap-16 p-5 sm:p-12 items-center">
                <div>
                  <div className="w-6 sm:w-8 h-[2px] bg-mars/50 mb-4 sm:mb-6" />
                  <h3 className="text-[28px] sm:text-[56px] font-bold leading-[0.92] tracking-[-0.04em]">Leaders<br />on Mars</h3>
                  <div className="mt-3 sm:mt-6 flex items-center gap-3 sm:gap-5 text-white/30 text-[11px] sm:text-sm">
                    <span>3 hours</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>up to 12 people</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>1 900 CZK / person</span>
                  </div>
                </div>
                <div>
                  <p className="font-mercure italic text-white/35 text-[13px] sm:text-[15px] mb-2 sm:mb-3">Not a team. Just you.</p>
                  <p className="text-white/55 text-[14px] sm:text-[17px] leading-[22px] sm:leading-[28px]">
                    Bring your own question. Play it out with people who lead people. A reality play for individuals ready to see beyond their current perspective.
                  </p>
                  <a href="#contact" className="mt-5 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 text-mars hover:text-white text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] group/link transition-colors duration-300">
                    I&apos;m coming
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover/link:translate-x-1.5 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Tailor-Made */}
            <div className="group relative rounded-2xl border border-mars/20 hover:border-mars/40 bg-gradient-to-br from-mars/[0.06] via-mars/[0.03] to-transparent hover:from-mars/[0.10] hover:via-mars/[0.05] transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.08)_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 grid md:grid-cols-2 gap-5 md:gap-16 p-5 sm:p-12 items-center">
                <div>
                  <div className="w-6 sm:w-8 h-[2px] bg-mars mb-4 sm:mb-6" />
                  <h3 className="text-[28px] sm:text-[56px] font-bold leading-[0.92] tracking-[-0.04em]">Tailor-Made<br />Experience</h3>
                  <div className="mt-3 sm:mt-6 flex items-center gap-3 sm:gap-5 text-white/30 text-[11px] sm:text-sm">
                    <span>Custom format</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>Your team, your rules</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>On request</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/55 text-[14px] sm:text-[17px] leading-[22px] sm:leading-[28px]">
                    Your question is unique. So is the play. We design a bespoke reality play for your organization — custom format, custom duration, anywhere in the world. For leadership teams that need more than an off-the-shelf experience.
                  </p>
                  <a href="#contact" className="mt-5 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 text-mars hover:text-white text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] group/link transition-colors duration-300">
                    Design your play
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover/link:translate-x-1.5 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Playmaker link card — digital teaser */}
            <a
              href="https://playbook.stageonmars.com/play"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-white/[0.06] hover:border-mars/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 sm:p-8">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-mars/10 border border-mars/20 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 fill-mars/60"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>
                  </div>
                  <div>
                    <p className="text-[16px] sm:text-[22px] font-bold tracking-[-0.02em]">The Playmaker</p>
                    <p className="font-mercure text-[#EDEDED]/35 text-[12px] sm:text-[15px] mt-0.5">Try it digitally first — turn your question into a reality play, instantly.</p>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-white/20 group-hover:fill-mars group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
              </div>
            </a>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          TEAM
      ═══════════════════════════════════════════════════════════════ */}

      <section className="py-16 sm:py-40 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-20 items-center">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src="/team.jpg"
                alt="Stage on Mars team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
            </div>
            <div className="space-y-6">
              <p className="text-mars text-xs font-bold uppercase tracking-[0.3em]">The Team</p>
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

      <section id="contact" className="py-16 sm:py-40 px-4 sm:px-6 relative overflow-hidden border-t border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.06)_0%,_transparent_60%)]" />
        <div className="relative z-10 max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-[28px] sm:text-[60px] font-bold leading-[0.94] tracking-[-0.03em]">What&apos;s your question?</h2>
            <p className="font-mercure text-[#EDEDED]/30 text-[13px] sm:text-[20px]">We reply within 24 hours.</p>
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
