"use client";

import Link from "next/link";
import Nav from "../_components/Nav";

const BENEFITS = [
  {
    tag: "Digital",
    title: "The simulator.",
    body: "Drop your question in. It gets played out. You walk away with a perspective you didn't have.",
  },
  {
    tag: "Live",
    title: "Monthly session at Národní 10.",
    body: "One evening a month. Members bring a question. Someone's gets played on the real stage.",
  },
  {
    tag: "Community",
    title: "People who ask.",
    body: "Founders, leaders, coaches. The ones carrying the questions that don't have a neat answer.",
  },
  {
    tag: "Archive",
    title: "Every play you've run.",
    body: "Questions, characters, perspectives. Yours to return to.",
  },
];

const STEPS = [
  { n: "01", head: "Ask.", body: "Type the question you've been circling." },
  { n: "02", head: "Play.", body: "A play unfolds — characters, movement, a scene." },
  { n: "03", head: "Shift.", body: "You walk away with a perspective, not a solution." },
];

export default function ClubPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-[90svh] flex items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(255,85,0,0.06) 0%, transparent 55%)",
          }}
        />
        <div className="relative z-10 max-w-3xl text-center">
          <p className="text-mars text-[11px] font-bold uppercase tracking-[0.28em] mb-7">
            Membership · Prague
          </p>
          <h1 className="text-[44px] sm:text-[72px] md:text-[88px] font-black tracking-[-0.04em] leading-[1.02] mb-8">
            <span className="text-white">The Question</span>
            <br />
            <span className="text-mars font-mercure italic">Club.</span>
          </h1>
          <p className="text-white/60 text-[17px] sm:text-[20px] leading-[1.5] max-w-xl mx-auto mb-10">
            For the people who carry the questions. A digital simulator, a live stage in Prague, and a room full of others who ask.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/play"
              className="inline-flex items-center gap-2 bg-mars text-black px-7 py-3.5 text-[12px] uppercase tracking-[0.22em] font-bold hover:bg-white transition-colors"
            >
              Play your first question
              <span>→</span>
            </Link>
            <Link
              href="#join"
              className="inline-flex items-center gap-2 border border-white/25 text-white/85 hover:border-white hover:text-white px-7 py-3.5 text-[12px] uppercase tracking-[0.22em] font-bold transition-colors"
            >
              Join the club
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="relative px-5 sm:px-8 py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.28em] mb-10 text-center">
            What you get
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 sm:p-8"
              >
                <p className="text-mars text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
                  {b.tag}
                </p>
                <h3 className="text-[22px] sm:text-[26px] font-black tracking-[-0.02em] mb-3">
                  {b.title}
                </h3>
                <p className="text-white/55 text-[14px] leading-[1.6]">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative px-5 sm:px-8 py-20 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.28em] mb-10 text-center">
            How it works
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <p className="text-white/20 font-mercure italic text-[44px] leading-none mb-4">
                  {s.n}
                </p>
                <h3 className="text-[22px] font-black tracking-[-0.02em] mb-3">
                  {s.head}
                </h3>
                <p className="text-white/55 text-[14px] leading-[1.6]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRIDGE WIREFRAME — PHASE 3 PREVIEW */}
      <section className="relative px-5 sm:px-8 py-20 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.28em] mb-3 text-center">
            Preview · Bridge from Club to Stage
          </p>
          <p className="text-white/45 text-[12px] text-center mb-10 font-mercure italic">
            Mock of what appears after a play in /play — not live yet.
          </p>
          <div className="rounded-2xl border border-mars/25 bg-gradient-to-b from-mars/[0.08] to-transparent p-7 sm:p-10">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-mars text-[10px] font-bold uppercase tracking-[0.25em] mt-1">
                ↳ After your play
              </span>
            </div>
            <h3 className="text-[24px] sm:text-[30px] font-black tracking-[-0.02em] leading-[1.15] mb-4">
              This one wants to be lived.
            </h3>
            <p className="text-white/60 text-[15px] leading-[1.6] mb-6 max-w-xl">
              Some questions need weight. A strategic call. A team fracture. An identity at a turning point. When a question is that heavy, the digital play is the beginning — not the end.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/business"
                className="inline-flex items-center gap-2 bg-mars text-black px-6 py-3 text-[11px] uppercase tracking-[0.22em] font-bold hover:bg-white transition-colors"
              >
                Take this question to stage
                <span>→</span>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 border border-white/20 text-white/70 hover:border-white hover:text-white px-6 py-3 text-[11px] uppercase tracking-[0.22em] transition-colors"
              >
                Save for later
              </Link>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] mb-4">
              Member dashboard · Questions that want to be lived
            </p>
            <ul className="divide-y divide-white/[0.06]">
              {[
                { q: "Should we restructure before Q3 or after?", tag: "Strategic", date: "2 days ago" },
                { q: "Who am I becoming as a leader?", tag: "Identity", date: "1 week ago" },
                { q: "Is the team ready without me?", tag: "Collective", date: "3 weeks ago" },
              ].map((row) => (
                <li key={row.q} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-white/85 text-[14px] truncate">&ldquo;{row.q}&rdquo;</p>
                    <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] mt-1">
                      {row.tag} · {row.date}
                    </p>
                  </div>
                  <span className="text-mars text-[11px] uppercase tracking-[0.2em] whitespace-nowrap">
                    → Stage
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* BRIDGE COPY TO STAGE */}
      <section className="relative px-6 py-24 border-t border-white/[0.06] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[30px] sm:text-[44px] font-black tracking-[-0.03em] leading-[1.1] mb-6">
            When your question needs weight,
            <br />
            <span className="text-mars font-mercure italic">bring it to stage live.</span>
          </h2>
          <p className="text-white/55 text-[15px] leading-[1.6] mb-8 max-w-lg mx-auto">
            For teams and organizations, we build a full play on the real stage. Four hours. The room gets unstuck.
          </p>
          <Link
            href="/business3/stage"
            className="inline-flex items-center gap-2 text-white hover:text-mars text-[12px] uppercase tracking-[0.22em] font-bold"
          >
            See Stage <span>→</span>
          </Link>
        </div>
      </section>

      {/* PRICING PLACEHOLDER */}
      <section id="join" className="relative px-5 sm:px-8 py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.28em] mb-8 text-center">
            Membership
          </p>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-12 text-center">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.25em] mb-4">
              Pricing in review
            </p>
            <h3 className="text-[28px] sm:text-[36px] font-black tracking-[-0.02em] mb-5">
              We&apos;re finalizing the shape of the club.
            </h3>
            <p className="text-white/55 text-[15px] leading-[1.6] mb-8 max-w-lg mx-auto">
              Leave your email. When doors open, you&apos;re on the first list.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 bg-transparent border border-white/20 focus:border-mars outline-none px-4 py-3 text-[14px] placeholder-white/30 transition-colors"
              />
              <button
                type="button"
                className="bg-mars text-black px-6 py-3 text-[12px] uppercase tracking-[0.22em] font-bold hover:bg-white transition-colors"
              >
                Notify me
              </button>
            </form>
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
