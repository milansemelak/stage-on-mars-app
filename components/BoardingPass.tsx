"use client";

import { useState } from "react";
import Link from "next/link";
import type { Mission } from "@/lib/types";

type CrewMember = { name: string; question: string };

const RULES = [
  { title: "Freedom", body: "Ask anything, create anything. No judgement." },
  { title: "Responsibility", body: "Your boundaries are yours. Say no anytime." },
  { title: "Alcohol", body: "No substances. The game is enough." },
  { title: "Dress Code", body: "Comfort over formality." },
  { title: "Play to Play", body: "No audience. Play for the game itself." },
  { title: "Own Truth", body: "We don't agree. We expand horizons." },
  { title: "Confidentiality", body: "What happens on Mars stays on Mars." },
  { title: "Questions", body: "Everyone shares. Not all become games." },
  { title: "Punctuality", body: "Arrive on time. The briefing is essential." },
];

export default function BoardingPass({ mission, initialCrew }: { mission: Mission; initialCrew: CrewMember[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const [crew, setCrew] = useState<CrewMember[]>(initialCrew);
  const [openRule, setOpenRule] = useState<number | null>(null);

  const dateFormatted = new Date(mission.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !question.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/missions/${mission.code}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, question }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); setSubmitting(false); return; }
      setRegistered(true);
      setCrew((prev) => [...prev, { name, question }]);
    } catch { setError("Connection failed. Try again."); }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-center px-5 pt-8 pb-4">
        <Link href="/business">
          <img src="/logo.png" alt="Stage On Mars" className="h-8 sm:h-9 w-auto opacity-60 hover:opacity-100 transition-opacity" />
        </Link>
      </nav>

      <div className="max-w-lg mx-auto px-5 sm:px-6 pb-16">

        {/* ═══ TICKET: HEADER ═══ */}
        <div className="bg-black rounded-t-3xl overflow-hidden">
          <div className="px-8 sm:px-10 pt-8 pb-2 flex items-start justify-between">
            <div>
              <p className="text-mars/60 text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Boarding Pass</p>
              <h1 className="text-[32px] sm:text-[42px] font-bold tracking-[-0.04em] leading-[1.05]">
                <span className="text-white">{mission.company} </span>
                <span className="font-mercure italic text-mars">on Mars</span>
              </h1>
            </div>
            <img src="/picto.png" alt="" className="h-10 sm:h-12 w-auto mt-1" />
          </div>

          {/* Flight data */}
          <div className="px-8 sm:px-10 pt-6 pb-8">
            <div className="border-t border-white/[0.08] pt-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-mars/50 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Date</p>
                  <p className="text-white text-[14px] font-semibold whitespace-nowrap">{dateFormatted}</p>
                </div>
                <div>
                  <p className="text-mars/50 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Launch</p>
                  <p className="text-white text-[14px] font-semibold whitespace-nowrap">{mission.time || "—"}</p>
                </div>
                <div>
                  <p className="text-mars/50 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Crew</p>
                  <p className="text-white text-[14px] font-semibold">{mission.group_size}</p>
                </div>
                <div>
                  <p className="text-mars/50 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Dresscode</p>
                  <p className="text-white text-[14px] font-semibold whitespace-nowrap">{mission.dresscode || "Dress to Play"}</p>
                </div>
                <div>
                  <p className="text-mars/50 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Location</p>
                  {mission.maps_url ? (
                    <a href={mission.maps_url} target="_blank" rel="noopener noreferrer" className="text-white text-[14px] font-semibold underline underline-offset-2 decoration-white/20 hover:decoration-white/60 transition-colors whitespace-nowrap">
                      Stage on Mars
                    </a>
                  ) : (
                    <p className="text-white text-[14px] font-semibold whitespace-nowrap">Stage on Mars</p>
                  )}
                </div>
                {mission.captain && (
                  <div>
                    <p className="text-mars/50 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Captain</p>
                    <p className="text-white text-[14px] font-semibold whitespace-nowrap">{mission.captain}</p>
                  </div>
                )}
                {mission.facilitator && (
                  <div>
                    <p className="text-mars/50 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Pilot</p>
                    <p className="text-white text-[14px] font-semibold whitespace-nowrap">{mission.facilitator}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ TEAR ═══ */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
        </div>

        {/* ═══ CAPTAIN'S QUESTION — hero orange band, bigger ═══ */}
        <div className="bg-mars px-8 sm:px-10 py-10 text-center">
          <p className="text-black/30 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">The Captain&apos;s Question</p>
          <p className="font-mercure italic text-black text-[24px] sm:text-[32px] leading-[1.2]">
            &ldquo;{mission.question}&rdquo;
          </p>
        </div>

        {/* ═══ TEAR ═══ */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
        </div>

        {/* ═══ WELCOME + CREW + REGISTRATION — consolidated black section ═══ */}
        <div className="bg-black px-8 sm:px-10 py-6">

          {/* Welcome message */}
          {mission.welcome_message && (
            <div className="mb-6 pb-6 border-b border-white/[0.08]">
              <p className="text-white/80 text-[13px] leading-[1.5] whitespace-pre-line">
                {mission.welcome_message}
              </p>
            </div>
          )}

          {/* Crew manifest — inline */}
          <div className="mb-6 pb-6 border-b border-white/[0.08]">
            <p className="text-mars text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-center">Crew Manifest</p>
            {crew.length > 0 ? (
              <div className="text-center">
                <p className="text-white/60 text-[14px]">
                  {crew.map((m) => m.name).join(" · ")}
                </p>
              </div>
            ) : (
              <p className="text-white/20 text-[13px] text-center">No crew members yet. Be the first to board.</p>
            )}
          </div>

          {/* Registration */}
          {!registered ? (
            <>
              <p className="text-mars text-[10px] uppercase tracking-[0.2em] font-bold mb-1 text-center">Board This Mission</p>
              <p className="text-white/60 text-[12px] mb-3 text-center">Register your seat and bring a question worth playing.</p>

              {error && (
                <p className="text-red-400 text-[12px] mb-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">{error}</p>
              )}

              <form onSubmit={handleRegister} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="w-full rounded-xl bg-white/[0.08] border-2 border-mars/20 px-4 py-3 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-mars/60 transition-colors" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email" required className="w-full rounded-xl bg-white/[0.08] border-2 border-mars/20 px-4 py-3 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-mars/60 transition-colors" />
                </div>
                <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Your question — what do you want to explore?" required rows={2} className="w-full rounded-xl bg-white/[0.08] border-2 border-mars/20 px-4 py-3 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-mars/60 transition-colors resize-none" />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-bold text-[14px] uppercase tracking-[0.1em] bg-mars text-white hover:bg-mars-light active:scale-[0.99] shadow-[0_0_30px_-5px_rgba(255,85,0,0.5)] transition-all"
                >
                  {submitting ? "Boarding..." : "Board This Mission"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <p className="text-white text-[18px] font-bold mb-1">You&apos;re on the manifest.</p>
              <p className="text-white/30 text-[13px]">See you on Mars, {name.split(" ")[0]}.</p>
            </div>
          )}
        </div>

        {/* ═══ QUESTIONS TO PLAY — orange band ═══ */}
        {crew.some((m) => m.question) && (
          <>
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          </div>
          <div className="bg-mars px-8 sm:px-10 py-5 text-center">
            <p className="text-black/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Questions to Play</p>
            <div className="space-y-1">
              {crew.filter((m) => m.question).map((member, i) => (
                <div key={i}>
                  <p className="text-black font-mercure italic text-[15px] sm:text-[17px] leading-[1.3]">
                    &ldquo;{member.question}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
          </>
        )}

        {/* ═══ TEAR ═══ */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
        </div>

        {/* ═══ RULES — black section ═══ */}
        <div className="bg-black px-8 sm:px-10 py-6">
          <div className="text-center">
            <p className="text-mars text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Rules of Mars</p>
            <div className="flex flex-wrap justify-center gap-2">
              {RULES.map((rule, i) => (
                <button
                  key={i}
                  onClick={() => setOpenRule(openRule === i ? null : i)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                    openRule === i
                      ? "bg-mars text-white"
                      : "bg-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.12]"
                  }`}
                >
                  {rule.title}
                </button>
              ))}
            </div>
            {openRule !== null && (
              <p className="text-white/50 text-[12px] leading-[1.5] mt-3">{RULES[openRule].body}</p>
            )}
          </div>
        </div>

        {/* ═══ TEAR ═══ */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
        </div>

        {/* ═══ SOUNDTRACK — orange section ═══ */}
        <div className="bg-mars px-8 sm:px-10 py-6 text-center">
          <p className="text-black/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Soundtrack</p>
          <div className="rounded-xl overflow-hidden mb-4">
            <iframe
              src="https://open.spotify.com/embed/playlist/33g5Ukkzcd2bUbvkKMMxr2?utm_source=generator&theme=0"
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="border-0"
            />
          </div>
          <a
            href="https://open.spotify.com/playlist/33g5Ukkzcd2bUbvkKMMxr2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-[12px] font-bold uppercase tracking-[0.05em] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            Add Your Music
          </a>
        </div>

        {/* ═══ TEAR ═══ */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
        </div>

        {/* ═══ CODEX — compact closing, just a link ═══ */}
        <div className="bg-black rounded-b-3xl overflow-hidden px-8 sm:px-10 py-6 text-center">
          <p className="text-mars/40 text-[10px] tracking-[0.15em] font-bold mb-2">
            Freedom · Responsibility · Humor · Humility · Truthfulness
          </p>
          <Link href="/business/codex" className="text-mars hover:text-mars-light text-[12px] font-bold uppercase tracking-[0.1em] transition-colors">
            Read the Codex of Mars →
          </Link>
        </div>

        {/* Footer */}
        <div className="pt-6 pb-4 flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Stage on Mars" className="h-6 opacity-15" />
          <a href="mailto:play@stageonmars.com" className="text-neutral-300 text-[11px] hover:text-neutral-500 transition-colors">play@stageonmars.com</a>
        </div>
      </div>
    </div>
  );
}
