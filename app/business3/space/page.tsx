"use client";

import Link from "next/link";
import Nav from "../_components/Nav";

const STATS = [
  { n: "360", u: "m²", l: "Total area" },
  { n: "8", u: "m", l: "Circular main stage" },
  { n: "100", u: "", l: "Max capacity" },
];

const FORMATS = [
  "Corporate & team events",
  "Leadership & culture programs",
  "Experiential product launches",
  "Public & partner events",
  "Performances & podcasts",
  "Creative formats connecting art, business & dialogue",
];

export default function SpaceIntro() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-[90svh] flex items-center px-6 pt-28 pb-20 overflow-hidden">
        <img
          src="/space1.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#0a0a0a]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-mars text-[11px] font-bold uppercase tracking-[0.28em] mb-7">
            Space — Národní 10
          </p>
          <h1 className="text-[48px] sm:text-[76px] md:text-[96px] font-black tracking-[-0.04em] leading-[1.0] mb-8">
            <span className="text-white">Host at</span>
            <br />
            <span className="text-mars font-mercure italic">Národní 10.</span>
          </h1>
          <p className="text-white/70 text-[17px] sm:text-[20px] leading-[1.55] max-w-xl mb-10">
            360 m² stage in the heart of Prague. Circular, intimate, built for presence. One booking per week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/space"
              className="inline-flex items-center gap-2 bg-mars text-black px-7 py-3.5 text-[12px] uppercase tracking-[0.22em] font-bold hover:bg-white transition-colors"
            >
              Host here
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative px-5 sm:px-8 py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-[36px] sm:text-[52px] font-bold tracking-[-0.03em]">
                {s.n}
                <span className="text-white/40 text-[18px] sm:text-[24px] ml-1">{s.u}</span>
              </p>
              <p className="text-white/45 text-[10px] uppercase tracking-[0.22em] mt-2">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FORMATS */}
      <section className="relative px-5 sm:px-8 py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.28em] mb-8 text-center">
            Good for
          </p>
          <ul className="divide-y divide-white/[0.08]">
            {FORMATS.map((f) => (
              <li key={f} className="py-4 flex items-center gap-4 text-[16px] sm:text-[18px] text-white/75">
                <span className="text-mars text-[11px]">—</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-24 border-t border-white/[0.06] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[30px] sm:text-[44px] font-black tracking-[-0.03em] leading-[1.1] mb-6">
            Pricing, tours, availability
            <br />
            <span className="text-mars font-mercure italic">on the Space page.</span>
          </h2>
          <Link
            href="/space"
            className="inline-flex items-center gap-2 bg-mars text-black px-7 py-3.5 text-[12px] uppercase tracking-[0.22em] font-bold hover:bg-white transition-colors"
          >
            Open the Space page
            <span>→</span>
          </Link>
        </div>
      </section>

      <footer className="relative px-6 py-12 border-t border-white/[0.06] text-center">
        <p className="text-white/30 text-[11px] uppercase tracking-[0.22em]">
          Stage on Mars · Národní 138/10, Prague
        </p>
      </footer>
    </div>
  );
}
