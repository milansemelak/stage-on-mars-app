"use client";

import { useState } from "react";
import Link from "next/link";
import type { Mission } from "@/lib/types";

type CrewMember = { name: string; question: string };

const CODEX = [
  { title: "Freedom", body: "Absolute freedom of expression. Ask anything, create anything, share exactly as you feel. No judgement." },
  { title: "Responsibility", body: "Your boundaries are yours alone. You can say no, step back, or change your mind at any time." },
  { title: "Alcohol", body: "No alcohol or substances during the experience. The game itself will be more than enough." },
  { title: "Dress Code", body: "Wear whatever you feel good playing in. Comfort over formality." },
  { title: "Play to Play", body: "No audience. No performance. Play for the sake of the game itself." },
  { title: "Own Truth", body: "We don't come here to agree. We come here to expand our horizons. Each takes away something different." },
  { title: "Confidentiality", body: "What happens on Mars stays on Mars. Trust is essential." },
  { title: "Questions", body: "Not every question becomes a game. But everyone gets to share theirs." },
  { title: "Punctuality", body: "Arrive on time. The intro and pre-flight briefing are essential." },
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

        {/* ═══ ONE UNIFIED TICKET ═══ */}
        <div className="bg-black rounded-3xl overflow-hidden shadow-[0_4px_60px_-12px_rgba(0,0,0,0.25)] mb-6">

          {/* Header — logo + picto */}
          <div className="px-8 sm:px-12 pt-10 pb-6 flex items-center justify-between">
            <img src="/logo.png" alt="Stage on Mars" className="h-8 sm:h-10 invert opacity-80" />
            <img src="/picto.png" alt="" className="h-10 sm:h-12 w-auto" />
          </div>

          {/* Expedition name */}
          <div className="px-8 sm:px-12 pb-8">
            <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Boarding Pass</p>
            <h1 className="text-[36px] sm:text-[48px] font-bold tracking-[-0.04em] leading-[1.05]">
              <span className="text-white">{mission.company} </span>
              <span className="font-mercure italic text-mars">on Mars</span>
            </h1>
          </div>

          {/* Flight data */}
          <div className="px-8 sm:px-12 pb-6">
            <div className="border-t border-white/[0.08] pt-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-4">
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-0.5">Date</p>
                  <p className="text-white text-[14px] font-semibold">{dateFormatted}</p>
                </div>
                {mission.time && (
                  <div>
                    <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-0.5">Launch</p>
                    <p className="text-white text-[14px] font-semibold">{mission.time}</p>
                  </div>
                )}
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-0.5">Crew</p>
                  <p className="text-white text-[14px] font-semibold">{mission.group_size}</p>
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-0.5">Dresscode</p>
                  <p className="text-white text-[14px] font-semibold">{mission.dresscode || "Dress to Play"}</p>
                </div>
              </div>

              {(mission.location || mission.venue || mission.captain || mission.facilitator) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4 mt-4">
                  {(mission.location || mission.venue) && (
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-0.5">Base</p>
                      {mission.maps_url ? (
                        <a href={mission.maps_url} target="_blank" rel="noopener noreferrer" className="text-white text-[14px] font-semibold underline underline-offset-2 decoration-white/20 hover:decoration-white/60 transition-colors">
                          {mission.location || mission.venue}
                        </a>
                      ) : (
                        <p className="text-white text-[14px] font-semibold">{mission.location || mission.venue}</p>
                      )}
                    </div>
                  )}
                  {mission.captain && (
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-0.5">Captain</p>
                      <p className="text-white text-[14px] font-semibold">{mission.captain}</p>
                    </div>
                  )}
                  {mission.facilitator && (
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-0.5">Pilot</p>
                      <p className="text-white text-[14px] font-semibold">{mission.facilitator}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tear line */}
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-white" />
            <div className="border-t border-dashed border-white/15 mx-6" />
          </div>

          {/* The question */}
          <div className="px-8 sm:px-12 py-8">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">The Captain&apos;s Question</p>
            <p className="font-mercure italic text-mars text-[22px] sm:text-[30px] leading-[1.3]">
              &ldquo;{mission.question}&rdquo;
            </p>
          </div>

          {/* Welcome message */}
          {mission.welcome_message && (
            <div className="px-8 sm:px-12 pb-8">
              <div className="border-t border-white/[0.08] pt-6">
                <p className="text-white/45 text-[13px] leading-[1.6] whitespace-pre-line">
                  {mission.welcome_message}
                </p>
              </div>
            </div>
          )}

          {/* Crew manifest */}
          <div className="px-8 sm:px-12 pb-6">
            <div className="border-t border-white/[0.08] pt-5">
              <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Crew Manifest</p>
              {crew.length > 0 ? (
                <div>
                  {crew.map((member, i) => (
                    <div key={i} className="flex items-center gap-4 py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-mars text-[13px] font-bold tabular-nums w-6">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-white/70 text-[15px] font-medium">{member.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/20 text-[14px]">No crew members yet. Be the first to board.</p>
              )}
            </div>
          </div>

          {/* Board this mission */}
          <div className="px-8 sm:px-12 pb-8">
            <div className="border-t border-white/[0.08] pt-5">
              {!registered ? (
                <>
                  <p className="text-mars text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Board This Mission</p>
                  <p className="text-white/40 text-[14px] mb-5">Register your seat and bring a question worth playing.</p>

                  {error && (
                    <p className="text-red-400 text-[13px] mb-3 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">{error}</p>
                  )}

                  <form onSubmit={handleRegister} className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="w-full rounded-xl bg-white/[0.08] border-2 border-mars/15 px-4 py-3.5 text-[15px] text-white placeholder:text-white/35 focus:outline-none focus:border-mars/50 transition-colors" />
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email" required className="w-full rounded-xl bg-white/[0.08] border-2 border-mars/15 px-4 py-3.5 text-[15px] text-white placeholder:text-white/35 focus:outline-none focus:border-mars/50 transition-colors" />
                    </div>
                    <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Your question — what do you want to explore on Mars?" required rows={2} className="w-full rounded-xl bg-white/[0.08] border-2 border-mars/15 px-4 py-3.5 text-[15px] text-white placeholder:text-white/35 focus:outline-none focus:border-mars/50 transition-colors resize-none" />
                    <button
                      type="submit"
                      disabled={submitting || !name.trim() || !email.trim() || !question.trim()}
                      className={`w-full py-4 rounded-xl font-bold text-[15px] uppercase tracking-[0.12em] transition-all ${
                        submitting || !name.trim() || !email.trim() || !question.trim()
                          ? "bg-mars/20 text-mars/30 cursor-not-allowed border-2 border-mars/10"
                          : "bg-mars text-white hover:bg-mars-light active:scale-[0.99] shadow-[0_0_30px_-5px_rgba(255,85,0,0.4)]"
                      }`}
                    >
                      {submitting ? "Boarding..." : "Board this mission"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white text-[22px] font-bold mb-1">You&apos;re on the manifest.</p>
                  <p className="text-white/30 text-[14px]">See you on Mars, {name.split(" ")[0]}.</p>
                </div>
              )}
            </div>
          </div>

          {/* Questions to play — orange band */}
          {crew.some((m) => m.question) && (
            <div className="bg-mars px-8 sm:px-12 py-7">
              <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Questions to Play</p>
              <div className="space-y-4">
                {crew.filter((m) => m.question).map((member, i) => (
                  <div key={i}>
                    <p className="text-white font-mercure italic text-[17px] sm:text-[20px] leading-[1.3] mb-0.5">
                      &ldquo;{member.question}&rdquo;
                    </p>
                    <p className="text-white/40 text-[12px]">{member.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soundtrack — inside the ticket */}
          <div className="px-8 sm:px-12 py-8">
            <div className="border-t border-white/[0.08] pt-5">
              <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Soundtrack</p>
              <p className="text-white/30 text-[12px] mb-4">
                Add your song to the{" "}
                <a href="https://open.spotify.com/playlist/33g5Ukkzcd2bUbvkKMMxr2" target="_blank" rel="noopener noreferrer" className="text-mars font-semibold hover:underline">
                  playlist
                </a>. It might become part of the game.
              </p>
              <div className="rounded-xl overflow-hidden">
                <iframe
                  src="https://open.spotify.com/embed/playlist/33g5Ukkzcd2bUbvkKMMxr2?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="border-0"
                />
              </div>
            </div>
          </div>

          {/* Codex of Mars — small pill buttons */}
          <div className="px-8 sm:px-12 pb-10">
            <div className="border-t border-white/[0.08] pt-5">
              <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Codex of Mars</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {CODEX.map((rule, i) => (
                  <button
                    key={i}
                    onClick={() => setOpenCodex(openCodex === i ? null : i)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                      openCodex === i
                        ? "bg-mars/20 text-mars border border-mars/30"
                        : "bg-white/[0.06] text-white/40 border border-white/[0.08] hover:text-white/60 hover:border-white/15"
                    }`}
                  >
                    {rule.title}
                  </button>
                ))}
              </div>
              {openCodex !== null && (
                <p className="text-white/35 text-[12px] leading-[1.6] pl-1">{CODEX[openCodex].body}</p>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 pb-4 flex flex-col items-center gap-3">
          <img src="/logo.png" alt="Stage on Mars" className="h-7 opacity-20" />
          <a href="mailto:play@stageonmars.com" className="text-neutral-300 text-[11px] hover:text-neutral-500 transition-colors">play@stageonmars.com</a>
        </div>
      </div>
    </div>
  );
}
