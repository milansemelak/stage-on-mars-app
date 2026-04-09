"use client";

import { useState } from "react";
import Link from "next/link";
import type { Mission } from "@/lib/types";

type CrewMember = { name: string; question: string };

const CODEX = [
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
  const [openCodex, setOpenCodex] = useState<number | null>(null);

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
          <div className="px-8 sm:px-10 pt-4 pb-5">
            <div className="border-t border-white/[0.08] pt-3">
              <div className="grid grid-cols-4 gap-x-3 gap-y-2">
                <div>
                  <p className="text-white/25 text-[8px] uppercase tracking-[0.15em]">Date</p>
                  <p className="text-white text-[12px] font-semibold whitespace-nowrap">{dateFormatted}</p>
                </div>
                <div>
                  <p className="text-white/25 text-[8px] uppercase tracking-[0.15em]">Launch</p>
                  <p className="text-white text-[12px] font-semibold whitespace-nowrap">{mission.time || "—"}</p>
                </div>
                <div>
                  <p className="text-white/25 text-[8px] uppercase tracking-[0.15em]">Crew</p>
                  <p className="text-white text-[12px] font-semibold">{mission.group_size}</p>
                </div>
                <div>
                  <p className="text-white/25 text-[8px] uppercase tracking-[0.15em]">Dresscode</p>
                  <p className="text-white text-[12px] font-semibold whitespace-nowrap">{mission.dresscode || "Dress to Play"}</p>
                </div>
              </div>
              {(mission.captain || mission.facilitator) && (
                <div className="grid grid-cols-3 gap-x-3 gap-y-2 mt-2">
                  <div>
                    <p className="text-white/25 text-[8px] uppercase tracking-[0.15em]">Location</p>
                    {mission.maps_url ? (
                      <a href={mission.maps_url} target="_blank" rel="noopener noreferrer" className="text-white text-[12px] font-semibold underline underline-offset-2 decoration-white/20 hover:decoration-white/60 transition-colors whitespace-nowrap">
                        Stage on Mars
                      </a>
                    ) : (
                      <p className="text-white text-[12px] font-semibold whitespace-nowrap">Stage on Mars</p>
                    )}
                  </div>
                  {mission.captain && (
                    <div>
                      <p className="text-white/25 text-[8px] uppercase tracking-[0.15em]">Captain</p>
                      <p className="text-white text-[12px] font-semibold whitespace-nowrap">{mission.captain}</p>
                    </div>
                  )}
                  {mission.facilitator && (
                    <div>
                      <p className="text-white/25 text-[8px] uppercase tracking-[0.15em]">Pilot</p>
                      <p className="text-white text-[12px] font-semibold whitespace-nowrap">{mission.facilitator}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ TEAR LINE 1 ═══ */}
        <div className="relative bg-black">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-white z-10" />
          <div className="border-t border-dashed border-white/15 mx-6" />
        </div>

        {/* ═══ TICKET: CAPTAIN'S QUESTION ═══ */}
        <div className="bg-black px-8 sm:px-10 py-6 text-center">
          <p className="text-mars/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">The Captain&apos;s Question</p>
          <p className="font-mercure italic text-mars text-[20px] sm:text-[26px] leading-[1.3]">
            &ldquo;{mission.question}&rdquo;
          </p>
        </div>

        {/* Welcome message */}
        {mission.welcome_message && (
          <div className="bg-black px-8 sm:px-10 pb-6">
            <div className="border-t border-white/[0.08] pt-4">
              <p className="text-white/70 text-[13px] leading-[1.6] whitespace-pre-line">
                {mission.welcome_message}
              </p>
            </div>
          </div>
        )}

        {/* ═══ TEAR LINE 2 ═══ */}
        <div className="relative bg-black">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-white z-10" />
          <div className="border-t border-dashed border-white/15 mx-6" />
        </div>

        {/* ═══ TICKET: CREW + REGISTRATION ═══ */}
        <div className="bg-black px-8 sm:px-10 py-6">
          <p className="text-mars/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-center">Crew Manifest</p>
          {crew.length > 0 ? (
            <div className="mb-4">
              {crew.map((member, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-mars text-[12px] font-bold tabular-nums w-5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-white/70 text-[14px] font-medium">{member.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/20 text-[13px] mb-4">No crew members yet. Be the first to board.</p>
          )}

          {!registered ? (
            <div className="border-t border-white/[0.08] pt-4">
              <p className="text-mars text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Board This Mission</p>
              <p className="text-white/35 text-[12px] mb-3">Register your seat and bring a question worth playing.</p>

              {error && (
                <p className="text-red-400 text-[12px] mb-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">{error}</p>
              )}

              <form onSubmit={handleRegister} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="w-full rounded-lg bg-white/[0.06] border border-white/[0.08] px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-mars/40 transition-colors" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email" required className="w-full rounded-lg bg-white/[0.06] border border-white/[0.08] px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-mars/40 transition-colors" />
                </div>
                <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Your question — what do you want to explore?" required rows={2} className="w-full rounded-lg bg-white/[0.06] border border-white/[0.08] px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-mars/40 transition-colors resize-none" />
                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !email.trim() || !question.trim()}
                  className={`w-full py-3 rounded-lg font-bold text-[13px] uppercase tracking-[0.1em] transition-all ${
                    submitting || !name.trim() || !email.trim() || !question.trim()
                      ? "bg-white/[0.04] text-white/20 cursor-not-allowed border border-white/[0.06]"
                      : "bg-mars text-white hover:bg-mars-light active:scale-[0.99]"
                  }`}
                >
                  {submitting ? "Boarding..." : "Board"}
                </button>
              </form>
            </div>
          ) : (
            <div className="border-t border-white/[0.08] pt-4 text-center">
              <p className="text-white text-[18px] font-bold mb-1">You&apos;re on the manifest.</p>
              <p className="text-white/30 text-[13px]">See you on Mars, {name.split(" ")[0]}.</p>
            </div>
          )}
        </div>

        {/* ═══ QUESTIONS TO PLAY — orange band ═══ */}
        {crew.some((m) => m.question) && (
          <div className="bg-mars px-8 sm:px-10 py-6">
            <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Questions to Play</p>
            <div className="space-y-3">
              {crew.filter((m) => m.question).map((member, i) => (
                <div key={i}>
                  <p className="text-white font-mercure italic text-[16px] sm:text-[18px] leading-[1.3] mb-0.5">
                    &ldquo;{member.question}&rdquo;
                  </p>
                  <p className="text-white/40 text-[11px]">{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TEAR LINE 3 ═══ */}
        <div className="relative bg-black">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-white z-10" />
          <div className="border-t border-dashed border-white/15 mx-6" />
        </div>

        {/* ═══ TICKET: SOUNDTRACK ═══ */}
        <div className="bg-black px-8 sm:px-10 py-6">
          <p className="text-mars/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Soundtrack</p>
          <p className="text-white/25 text-[11px] mb-3">
            Add your song to the{" "}
            <a href="https://open.spotify.com/playlist/33g5Ukkzcd2bUbvkKMMxr2" target="_blank" rel="noopener noreferrer" className="text-mars font-semibold hover:underline">
              playlist
            </a>. It might become part of the game.
          </p>
          <div className="rounded-xl overflow-hidden">
            <iframe
              src="https://open.spotify.com/embed/playlist/33g5Ukkzcd2bUbvkKMMxr2?utm_source=generator&theme=0"
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="border-0"
            />
          </div>
        </div>

        {/* ═══ TEAR LINE 4 ═══ */}
        <div className="relative bg-black">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-white z-10" />
          <div className="border-t border-dashed border-white/15 mx-6" />
        </div>

        {/* ═══ TICKET: CODEX OF MARS ═══ */}
        <div className="bg-black rounded-b-3xl overflow-hidden px-8 sm:px-10 py-6">
          <p className="text-mars/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Codex of Mars</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {CODEX.map((rule, i) => (
              <button
                key={i}
                onClick={() => setOpenCodex(openCodex === i ? null : i)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                  openCodex === i
                    ? "bg-mars/20 text-mars border border-mars/30"
                    : "bg-white/[0.05] text-white/30 border border-white/[0.06] hover:text-white/50 hover:border-white/12"
                }`}
              >
                {rule.title}
              </button>
            ))}
          </div>
          {openCodex !== null && (
            <p className="text-white/30 text-[11px] leading-[1.5] pl-0.5">{CODEX[openCodex].body}</p>
          )}
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
