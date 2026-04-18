"use client";

import Link from "next/link";
import Nav from "./_components/Nav";

const LEGS = [
  {
    kebab: "stage",
    eyebrow: "Stage — B2B",
    title: "Bring your team to stage.",
    body: "Your team's real question, played out on stage. In four hours, the room gets unstuck.",
    cta: "Build a play",
    href: "/business3/stage",
    meta: "For executive teams, boards, offsites.",
  },
  {
    kebab: "club",
    eyebrow: "The Question Club",
    title: "Play your question now.",
    body: "A digital simulator and a monthly live session in Prague. For the people who carry the questions.",
    cta: "Play your first question",
    href: "/business3/club",
    meta: "For founders, leaders, coaches.",
  },
  {
    kebab: "space",
    eyebrow: "Space — Národní 10",
    title: "Host at Národní 10.",
    body: "360 m² stage in the heart of Prague. For events, launches, performances.",
    cta: "Host here",
    href: "/business3/space",
    meta: "One booking per week.",
  },
];

const CLIENTS = [
  "Forbes", "Škoda", "YPO", "PwC", "O₂", "UniCredit",
  "Oktagon MMA", "House of Lobkowicz", "London Business School",
  "Česká spořitelna", "Lasvit", "Ipsen", "MSD", "Raiffeisenbank",
];

export default function Business3Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
        {/* ambient orange glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, rgba(255,85,0,0.08) 0%, transparent 55%)",
          }}
        />
        {/* grain */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "256px",
          }}
        />

        <div className="relative z-10 max-w-4xl w-full text-center">
          <p className="text-mars text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.28em] mb-8">
            Systemic Play — Prague
          </p>
          <h1 className="text-[40px] sm:text-[72px] md:text-[92px] font-black tracking-[-0.04em] leading-[1.02] mb-8">
            <span className="text-white">Play the future.</span>
            <br />
            <span className="text-mars font-mercure italic">Then decide it.</span>
          </h1>
          <p className="text-white/55 text-[16px] sm:text-[19px] leading-[1.5] max-w-xl mx-auto font-light">
            We move what your organization can&apos;t.
          </p>

          <div className="mt-14 flex items-center justify-center gap-2 text-white/30 text-[11px] uppercase tracking-[0.25em]">
            <span className="w-8 h-px bg-white/20" />
            <span>Three ways in</span>
            <span className="w-8 h-px bg-white/20" />
          </div>
        </div>
      </section>

      {/* THREE LEGS */}
      <section className="relative px-5 sm:px-8 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
          {LEGS.map((leg) => (
            <Link
              key={leg.kebab}
              href={leg.href}
              className="group relative block rounded-2xl border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.04] hover:border-mars/40 p-7 sm:p-8 transition-all"
            >
              <p className="text-mars text-[10px] font-bold uppercase tracking-[0.25em] mb-5">
                {leg.eyebrow}
              </p>
              <h2 className="text-[24px] sm:text-[28px] font-black tracking-[-0.02em] leading-[1.15] mb-4">
                {leg.title}
              </h2>
              <p className="text-white/55 text-[14px] leading-[1.55] mb-8">
                {leg.body}
              </p>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-7">
                {leg.meta}
              </p>
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-white group-hover:text-mars transition-colors">
                <span>{leg.cta}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FORMULA STRIP */}
      <section className="relative px-6 py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.28em] mb-6">
            Method of Systemic Play
          </p>
          <p className="text-[22px] sm:text-[32px] font-black tracking-[-0.02em]">
            <span className="text-white/90">Question</span>
            <span className="text-white/20 mx-3 font-light">×</span>
            <span className="text-white/90">Play</span>
            <span className="text-white/20 mx-3 font-light">=</span>
            <span className="text-mars font-mercure italic">Perspective</span>
          </p>
          <p className="mt-6 text-white/45 text-[14px] font-mercure italic leading-[1.7] max-w-lg mx-auto">
            Your question becomes a real play on stage. People step into roles. Your perspective shifts.
          </p>
        </div>
      </section>

      {/* TRUST */}
      <section className="relative px-5 sm:px-8 py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-14 max-w-xl mx-auto">
            <div className="text-center">
              <p className="text-[28px] sm:text-[40px] font-bold tracking-[-0.03em]">800+</p>
              <p className="text-white/45 text-[10px] uppercase tracking-[0.22em] mt-1">Reality plays</p>
            </div>
            <div className="text-center border-x border-white/[0.08]">
              <p className="text-[28px] sm:text-[40px] font-bold tracking-[-0.03em]">5</p>
              <p className="text-white/45 text-[10px] uppercase tracking-[0.22em] mt-1">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-[28px] sm:text-[40px] font-bold tracking-[-0.03em]">2020</p>
              <p className="text-white/45 text-[10px] uppercase tracking-[0.22em] mt-1">Founded</p>
            </div>
          </div>

          <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.28em] mb-6">
            Trusted by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-white/55 text-[13px] tracking-[-0.01em]">
            {CLIENTS.map((c, i) => (
              <span key={c} className="flex items-center gap-6">
                {c}
                {i < CLIENTS.length - 1 && <span className="text-white/15">·</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative px-6 py-12 border-t border-white/[0.06] text-center">
        <p className="text-white/30 text-[11px] uppercase tracking-[0.22em]">
          Stage on Mars · Národní 138/10, Prague
        </p>
      </footer>
    </div>
  );
}
