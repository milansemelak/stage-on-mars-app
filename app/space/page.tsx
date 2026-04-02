"use client";

import Link from "next/link";

const STATS = [
  { number: "360", unit: "m²", label: "Total area" },
  { number: "8", unit: "m", label: "Circular main stage diameter" },
  { number: "100", unit: "", label: "Maximum capacity" },
];

const PRICING = [
  { label: "HOURLY", price: "10 000 CZK" },
  { label: "6 HOURS", price: "45 000 CZK" },
  { label: "FULL DAY", price: "75 000 CZK" },
];

const FORMATS = [
  "Corporate & team events",
  "Leadership & culture programs",
  "Experiential product launches",
  "Public & partner events",
  "Performances & podcasts",
  "Creative formats connecting art, business & dialogue",
];

export default function SpacePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="relative h-screen">
        <img
          src="/space1.png"
          alt="Stage on Mars — the space"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <p className="text-mars text-xs font-bold uppercase tracking-[0.3em] mb-6">
            Flagship Studio
          </p>
          <h1 className="text-[56px] sm:text-[80px] md:text-[112px] font-bold leading-[0.88] tracking-[-0.04em] mb-6">
            Space<br />Stage on Mars
          </h1>
          <p className="text-[#EDEDED]/50 text-lg sm:text-xl max-w-lg mt-4">
            A unique venue in Prague for human play, dialogue, and creative communication.
          </p>
          <a
            href="https://www.google.com/maps/place/data=!4m2!3m1!1s0x470b95600a6be199:0xa70a6c664c2eca2e"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 text-[#EDEDED]/35 text-xs sm:text-sm tracking-wide hover:text-white/60 transition-colors"
          >
            Palác Dunaj — Národní 138/10, Praha
          </a>
          <div className="mt-12">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 bg-mars hover:bg-mars-light text-white font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-[0_8px_40px_-4px_rgba(255,85,0,0.35)] hover:shadow-[0_12px_50px_-4px_rgba(255,85,0,0.5)]"
            >
              Book the Space
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Photo strip */}
      <section className="grid grid-cols-3 gap-1">
        <div className="aspect-[4/3] overflow-hidden">
          <img src="/space2.png" alt="The space" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="aspect-[4/3] overflow-hidden">
          <img src="/space3.png" alt="The atmosphere" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="aspect-[4/3] overflow-hidden">
          <img src="/space5.png" alt="The space" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
      </section>
      <section className="grid grid-cols-2 gap-1 mt-1">
        <div className="aspect-[4/3] overflow-hidden">
          <img src="/space6.jpg" alt="The space" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="aspect-[4/3] overflow-hidden">
          <img src="/space7.jpg" alt="The space" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
      </section>

      {/* Disposition */}
      <section className="py-24 sm:py-36 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — layout image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
                <img src="/layout.jpg" alt="Stage layout" className="w-full" />
              </div>
            </div>

            {/* Right — stats */}
            <div>
              <p className="text-mars text-xs font-bold uppercase tracking-[0.3em] mb-4">
                Disposition
              </p>
              <h2 className="text-[40px] sm:text-[56px] font-bold leading-[0.92] tracking-[-0.03em] mb-12">
                Built for Play.
              </h2>

              <div className="space-y-8">
                {STATS.map((s) => (
                  <div key={s.label} className="flex items-baseline gap-4">
                    <span className="text-[56px] sm:text-[72px] font-bold tracking-[-0.04em] leading-none text-mars">
                      {s.number}
                    </span>
                    {s.unit && (
                      <span className="text-[24px] sm:text-[32px] font-bold text-white/50 tracking-[-0.02em]">
                        {s.unit}
                      </span>
                    )}
                    <span className="text-[#EDEDED]/40 text-sm sm:text-base ml-2">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 space-y-3 text-[#EDEDED]/50 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-mars/60" />
                  Sound system, lighting design, production
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-mars/60" />
                  Backstage, dressing room, production area
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rental Options */}
      <section className="py-24 sm:py-36 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <p className="text-mars text-xs font-bold uppercase tracking-[0.3em] mb-4">
            Rental
          </p>
          <h2 className="text-[40px] sm:text-[56px] font-bold leading-[0.92] tracking-[-0.03em] mb-8">
            Your Stage, Your Format.
          </h2>
          <p className="text-[#EDEDED]/50 text-lg sm:text-xl max-w-2xl mb-16 leading-relaxed">
            The space can be rented with full production and direction by Stage on Mars, or as a standalone venue.
          </p>

          {/* Formats grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
            {FORMATS.map((f) => (
              <div key={f} className="flex items-start gap-3 px-5 py-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="text-mars mt-0.5 text-lg">&#x2192;</span>
                <span className="text-[#EDEDED]/80 text-sm sm:text-base">{f}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <p className="text-mars text-xs font-bold uppercase tracking-[0.3em] mb-8">
            Pricing
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {PRICING.map((p, i) => (
              <div
                key={p.label}
                className={`rounded-2xl p-8 text-center border transition-all ${
                  i === 2
                    ? "border-mars/30 bg-mars/[0.06] shadow-[0_0_40px_-8px_rgba(255,85,0,0.15)]"
                    : "border-white/[0.08] bg-white/[0.03]"
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#EDEDED]/40 mb-3">
                  {p.label}
                </p>
                <p className="text-3xl sm:text-4xl font-bold tracking-[-0.03em]">
                  {p.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width space photo with booking CTA */}
      <section id="contact" className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
        <img
          src="/space3.png"
          alt="Stage on Mars atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-[40px] sm:text-[56px] font-bold leading-[0.92] tracking-[-0.03em] mb-6">
            Book the Space.
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <a
              href="mailto:play@stageonmars.com"
              className="inline-flex items-center gap-3 bg-mars hover:bg-mars-light text-white font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-[0_8px_40px_-4px_rgba(255,85,0,0.35)] hover:shadow-[0_12px_50px_-4px_rgba(255,85,0,0.5)]"
            >
              Write to Us
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
            <a
              href="tel:+420602336338"
              className="inline-flex items-center gap-3 border border-white/15 hover:border-white/30 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all"
            >
              +420 602 336 338
            </a>
          </div>
        </div>
      </section>

      {/* Contact details */}
      <section className="py-16 sm:py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-[#EDEDED]/40 text-sm">
            <a
              href="https://www.google.com/maps/place/data=!4m2!3m1!1s0x470b95600a6be199:0xa70a6c664c2eca2e"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Palác Dunaj, Národní 138/10, Praha
            </a>
            <span className="hidden sm:block">|</span>
            <a
              href="mailto:play@stageonmars.com"
              className="hover:text-white transition-colors"
            >
              play@stageonmars.com
            </a>
          </div>

          {/* Back to business page */}
          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <Link
              href="/business"
              className="text-[#EDEDED]/30 hover:text-[#EDEDED]/70 text-sm transition-colors"
            >
              &larr; Back to Stage on Mars for Business
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
