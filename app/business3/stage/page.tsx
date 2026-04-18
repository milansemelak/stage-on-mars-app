"use client";

import Link from "next/link";
import Nav from "../_components/Nav";

const WHO = [
  "Executive teams at a turning point",
  "Boards that need alignment, not a deck",
  "Offsites that refuse to be another offsite",
  "Leadership teams with one hard question",
];

const FORMAT = [
  { head: "Four hours.", body: "One question. A real play. The room gets unstuck." },
  { head: "Your question.", body: "Not ours. You bring the one you can't stop circling." },
  { head: "Real stage.", body: "Národní 10, Prague — or we travel to you." },
  { head: "Milan facilitates.", body: "Founder-led. Every play. No associate hand-offs." },
];

export default function StagePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-[85svh] flex items-center px-6 pt-28 pb-20 overflow-hidden">
        <img
          src="/team.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/70 to-[#0a0a0a]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-mars text-[11px] font-bold uppercase tracking-[0.28em] mb-7">
            Stage — B2B
          </p>
          <h1 className="text-[48px] sm:text-[76px] md:text-[96px] font-black tracking-[-0.04em] leading-[1.0] mb-8">
            <span className="text-white">Bring your team</span>
            <br />
            <span className="text-mars font-mercure italic">to stage.</span>
          </h1>
          <p className="text-white/60 text-[17px] sm:text-[20px] leading-[1.55] max-w-xl mb-10">
            Your team&apos;s real question, played out on stage. In four hours, the room gets unstuck. 800+ plays with Forbes, Škoda, PwC, YPO.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/business"
              className="inline-flex items-center gap-2 bg-mars text-black px-7 py-3.5 text-[12px] uppercase tracking-[0.22em] font-bold hover:bg-white transition-colors"
            >
              Build a play
              <span>→</span>
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 border border-white/25 text-white/85 hover:border-white hover:text-white px-7 py-3.5 text-[12px] uppercase tracking-[0.22em] font-bold transition-colors"
            >
              Talk first
            </Link>
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="relative px-5 sm:px-8 py-20 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.28em] mb-10 text-center">
            Who we work with
          </p>
          <ul className="max-w-xl mx-auto divide-y divide-white/[0.08]">
            {WHO.map((w) => (
              <li key={w} className="py-5 flex items-center gap-4 text-[17px] sm:text-[20px] text-white/80">
                <span className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] w-6">
                  —
                </span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FORMAT */}
      <section className="relative px-5 sm:px-8 py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.28em] mb-10 text-center">
            The format
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {FORMAT.map((f) => (
              <div
                key={f.head}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 sm:p-8"
              >
                <h3 className="text-[22px] sm:text-[26px] font-black tracking-[-0.02em] mb-3">
                  {f.head}
                </h3>
                <p className="text-white/55 text-[14px] leading-[1.6]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — deep dive */}
      <section className="relative px-6 py-24 border-t border-white/[0.06] text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.28em] mb-5">
            The full page
          </p>
          <h2 className="text-[30px] sm:text-[44px] font-black tracking-[-0.03em] leading-[1.1] mb-6">
            The formula, the voices,
            <br />
            <span className="text-mars font-mercure italic">the clients.</span>
          </h2>
          <p className="text-white/55 text-[15px] leading-[1.6] mb-8 max-w-lg mx-auto">
            The full Stage page holds the method, the voices from clients, and the way we build a play with you.
          </p>
          <Link
            href="/business"
            className="inline-flex items-center gap-2 bg-mars text-black px-7 py-3.5 text-[12px] uppercase tracking-[0.22em] font-bold hover:bg-white transition-colors"
          >
            Open the full Stage page
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="relative px-6 py-12 border-t border-white/[0.06] text-center">
        <p className="text-white/30 text-[11px] uppercase tracking-[0.22em]">
          Stage on Mars · Národní 138/10, Prague
        </p>
      </footer>
    </div>
  );
}
