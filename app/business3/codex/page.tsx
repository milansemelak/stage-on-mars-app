"use client";

import Link from "next/link";
import Nav from "../_components/Nav";

const PILLARS = [
  { tag: "People", body: "Players, Pilot, Client, Director. Everyone holds a role. The stage doesn't work without all of them." },
  { tag: "Space", body: "The stage is sacred. Circular, intimate, no hiding. Národní 10 is built for it." },
  { tag: "Method", body: "Systemic Play. Question × Play = Perspective. No slides. No fixing. A scene." },
];

const RULES = [
  "Bring a question, not a problem.",
  "What happens or doesn't happen is up to you.",
  "The goal is not a solution. The goal is a perspective.",
  "Freedom and responsibility live in the same body.",
];

export default function CodexIntro() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-[70svh] flex items-center px-6 pt-28 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(255,85,0,0.06) 0%, transparent 55%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-mars text-[11px] font-bold uppercase tracking-[0.28em] mb-7">
            Codex
          </p>
          <h1 className="text-[44px] sm:text-[72px] md:text-[88px] font-black tracking-[-0.04em] leading-[1.02] mb-8">
            <span className="text-white">The rules</span>
            <br />
            <span className="text-mars font-mercure italic">of the stage.</span>
          </h1>
          <p className="text-white/60 text-[16px] sm:text-[19px] leading-[1.55] max-w-xl mx-auto">
            Three pillars. A handful of rules. The method that holds every play we run.
          </p>
        </div>
      </section>

      {/* PILLARS */}
      <section className="relative px-5 sm:px-8 py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.28em] mb-10 text-center">
            Three pillars
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {PILLARS.map((p) => (
              <div
                key={p.tag}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 sm:p-8"
              >
                <p className="text-mars text-[10px] font-bold uppercase tracking-[0.25em] mb-5">
                  {p.tag}
                </p>
                <p className="text-white/70 text-[15px] leading-[1.65]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="relative px-5 sm:px-8 py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.28em] mb-8 text-center">
            Rules
          </p>
          <ol className="divide-y divide-white/[0.08]">
            {RULES.map((r, i) => (
              <li key={r} className="py-6 flex items-start gap-6">
                <span className="text-white/20 font-mercure italic text-[28px] leading-none w-10 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[18px] sm:text-[22px] font-black tracking-[-0.01em] leading-[1.3]">
                  {r}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-24 border-t border-white/[0.06] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[30px] sm:text-[44px] font-black tracking-[-0.03em] leading-[1.1] mb-6">
            The full codex
            <br />
            <span className="text-mars font-mercure italic">lives here.</span>
          </h2>
          <Link
            href="/business/codex"
            className="inline-flex items-center gap-2 bg-mars text-black px-7 py-3.5 text-[12px] uppercase tracking-[0.22em] font-bold hover:bg-white transition-colors"
          >
            Open the Codex
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
