"use client";

import { useState } from "react";
import Link from "next/link";
import type { Mission } from "@/lib/types";

type CrewMember = { name: string; question: string };

const RULES_OF_MARS = [
  { title: "Freedom", body: "This experience gives you absolute freedom of expression. It is essentially a hole in reality. You can ask anything, create anything, share and express yourself exactly as you feel. No one will judge you here. Enjoy it fully." },
  { title: "Responsibility", body: "Freedom and responsibility go hand in hand. At Stage on Mars you have space to express yourself, to be seen, to create. At the same time, your boundaries are yours alone and they matter. You do not have to accept any idea, role, or direction that does not resonate with you. You can say no. You can step back. You can change your mind at any time. We are in this together." },
  { title: "Alcohol", body: "During the experience, alcohol and other psychoactive substances are not permitted. If you want to be high, immersion in the game will be more than enough." },
  { title: "Dress Code", body: "Dress comfortably. Wear whatever you feel good playing in. If you arrive in a pink dinosaur costume — yes it has happened — we will be delighted." },
  { title: "Play to Play", body: "This is not a performance. There is no audience. You are doing this only for yourself. How you choose to express yourself is entirely up to you. You can stay silent. You can sing opera, dance, recite, mumble, or simply speak like a human being. Play for the sake of the game itself." },
  { title: "Own Truth", body: "A lot happens on Mars. Emotions. Thoughts. Observations. New angles of view. What does not happen on Mars is universal truth. We do not come here to agree. We come here to expand our horizons. And when we leave, each of us takes away something different. Our own truth." },
  { title: "Confidentiality", body: "What happens on Mars stays on Mars. We are here to play, explore, and push boundaries together. And that means trust is essential. Everything we create, share, and experience here stays within this space. If there is anything you are unsure about or want to keep private, let us know. This is a space of respect, safety, and openness." },
  { title: "Questions", body: "Not every question will turn into a game. There will not be time for all of them. But everyone will have the opportunity to share their question and invite others to step into it." },
  { title: "Punctuality", body: "It is important to arrive on time. The introduction and the pre-flight briefing are an essential part of the entire experience." },
];

export default function BoardingPass({ mission, initialCrew }: { mission: Mission; initialCrew: CrewMember[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const [crew, setCrew] = useState<CrewMember[]>(initialCrew);

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
    <div className="min-h-screen bg-black">
      {/* Warm ambient glow from top */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,_rgba(255,85,0,0.06),_transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 pt-6 pb-12">

        {/* ═══════════════════════════════════════
            THE TICKET — BOARDING PASS
            ═══════════════════════════════════════ */}
        <div className="relative mb-6">
          {/* Glow behind ticket */}
          <div className="absolute -inset-2 rounded-[28px] bg-mars/10 blur-2xl" />

          <div className="relative rounded-[22px] overflow-hidden border border-mars/15" style={{ background: "linear-gradient(170deg, #1a1510 0%, #110f0c 60%, #0d0b09 100%)" }}>

            {/* Orange top bar */}
            <div className="h-1.5 bg-gradient-to-r from-mars/80 via-mars to-mars/80" />

            {/* ── HEADER: Logo + Mission Briefing ── */}
            <div className="px-6 sm:px-8 pt-6 pb-4 flex items-start justify-between">
              <div>
                <p className="text-mars/40 text-[8px] uppercase tracking-[0.5em] font-bold">Mission Briefing</p>
              </div>
              <img src="/logo.png" alt="Stage on Mars" className="h-4 sm:h-5 invert opacity-20" />
            </div>

            {/* ── TITLE ── */}
            <div className="px-6 sm:px-8 pb-8">
              <h1 className="text-[34px] sm:text-[48px] font-black tracking-[-0.05em] leading-[0.95]">
                <span className="text-white">{mission.company}</span>
                <br />
                <span className="font-mercure italic text-mars" style={{ textShadow: "0 0 40px rgba(255,85,0,0.3)" }}>on Mars</span>
              </h1>
            </div>

            {/* ── FLIGHT DATA ── */}
            <div className="px-6 sm:px-8 pb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4">
                <div>
                  <p className="text-mars/30 text-[8px] uppercase tracking-[0.4em] mb-0.5">Date</p>
                  <p className="text-white/80 text-[13px] font-bold">{dateFormatted}</p>
                </div>
                {mission.time && (
                  <div>
                    <p className="text-mars/30 text-[8px] uppercase tracking-[0.4em] mb-0.5">Launch</p>
                    <p className="text-white/80 text-[13px] font-bold">{mission.time}</p>
                  </div>
                )}
                <div>
                  <p className="text-mars/30 text-[8px] uppercase tracking-[0.4em] mb-0.5">Crew</p>
                  <p className="text-white/80 text-[13px] font-bold">{mission.group_size}</p>
                </div>
                <div>
                  <p className="text-mars/30 text-[8px] uppercase tracking-[0.4em] mb-0.5">Dresscode</p>
                  <p className="text-white/80 text-[13px] font-bold">{mission.dresscode || "Dress to Play"}</p>
                </div>
              </div>

              {(mission.location || mission.venue || mission.captain || mission.facilitator) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 mt-4">
                  {(mission.location || mission.venue) && (
                    <div>
                      <p className="text-mars/30 text-[8px] uppercase tracking-[0.4em] mb-0.5">Base</p>
                      {mission.maps_url ? (
                        <a href={mission.maps_url} target="_blank" rel="noopener noreferrer" className="text-white/80 text-[13px] font-bold underline underline-offset-2 decoration-mars/20 hover:decoration-mars/60 transition-colors">
                          {mission.location || mission.venue}
                        </a>
                      ) : (
                        <p className="text-white/80 text-[13px] font-bold">{mission.location || mission.venue}</p>
                      )}
                    </div>
                  )}
                  {mission.captain && (
                    <div>
                      <p className="text-mars/30 text-[8px] uppercase tracking-[0.4em] mb-0.5">Captain</p>
                      <p className="text-white/80 text-[13px] font-bold">{mission.captain}</p>
                    </div>
                  )}
                  {mission.facilitator && (
                    <div>
                      <p className="text-mars/30 text-[8px] uppercase tracking-[0.4em] mb-0.5">Pilot</p>
                      <p className="text-white/80 text-[13px] font-bold">{mission.facilitator}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── TEAR LINE ── */}
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-black shadow-[inset_2px_0_4px_rgba(255,85,0,0.05)]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-black shadow-[inset_-2px_0_4px_rgba(255,85,0,0.05)]" />
              <div className="border-t border-dashed border-mars/10 mx-6" />
            </div>

            {/* ── THE QUESTION ── */}
            <div className="px-6 sm:px-8 py-6">
              <p className="text-mars/30 text-[8px] uppercase tracking-[0.5em] font-bold mb-3">The Question</p>
              <p className="font-mercure italic text-mars text-[22px] sm:text-[30px] leading-[1.25]" style={{ textShadow: "0 0 60px rgba(255,85,0,0.15)" }}>
                &ldquo;{mission.question}&rdquo;
              </p>
            </div>

            {/* Bottom accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-mars/20 to-transparent" />
          </div>
        </div>

        {/* ═══ WELCOME MESSAGE — compact ═══ */}
        {mission.welcome_message && (
          <div className="mb-6 px-1">
            <p className="text-white/30 text-[12px] sm:text-[13px] leading-[1.6] whitespace-pre-line">
              {mission.welcome_message}
            </p>
          </div>
        )}

        {/* ═══ CREW MANIFEST ═══ */}
        <div className="mb-6">
          <p className="text-mars/30 text-[8px] uppercase tracking-[0.5em] font-bold mb-3 px-1">Crew Manifest</p>
          {crew.length > 0 ? (
            <div className="px-1">
              {crew.map((member, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/[0.03] last:border-0">
                  <span className="text-mars/40 text-[11px] font-mono tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-white/50 text-[13px] font-medium">{member.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/10 text-[12px] px-1">No crew members yet. Be the first to board.</p>
          )}
        </div>

        {/* ═══ QUESTIONS TO PLAY ═══ */}
        {crew.some((m) => m.question) && (
          <div className="relative rounded-[18px] overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-mars via-[#e04a00] to-[#cc3d00]" />
            <div className="relative px-6 sm:px-8 py-6">
              <p className="text-white/40 text-[8px] uppercase tracking-[0.5em] font-bold mb-4">Questions to Play</p>
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
          </div>
        )}

        {/* ═══ BOARD THIS MISSION ═══ */}
        <div className="relative rounded-[18px] overflow-hidden border border-mars/10 mb-6" style={{ background: "linear-gradient(170deg, #1a1510 0%, #110f0c 100%)" }}>
          <div className="px-6 sm:px-8 py-6">
            {!registered ? (
              <>
                <p className="text-mars/30 text-[8px] uppercase tracking-[0.5em] font-bold mb-4">Board This Mission</p>
                <p className="text-white/20 text-[12px] mb-5">Register your seat and bring a question worth playing.</p>

                {error && (
                  <p className="text-red-400 text-[12px] mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">{error}</p>
                )}

                <form onSubmit={handleRegister} className="space-y-2.5">
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 text-[13px] text-white placeholder:text-white/15 focus:outline-none focus:border-mars/25 transition-colors" />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email" required className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 text-[13px] text-white placeholder:text-white/15 focus:outline-none focus:border-mars/25 transition-colors" />
                  </div>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Your question — what do you want to explore on Mars?"
                    required
                    rows={2}
                    className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 text-[13px] text-white placeholder:text-white/15 focus:outline-none focus:border-mars/25 transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !email.trim() || !question.trim()}
                    className={`w-full py-3.5 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] transition-all ${
                      submitting || !name.trim() || !email.trim() || !question.trim()
                        ? "bg-white/[0.03] text-white/10 cursor-not-allowed"
                        : "bg-gradient-to-r from-mars to-[#ff6b2b] text-white hover:brightness-110 active:scale-[0.99] shadow-[0_0_30px_-5px_rgba(255,85,0,0.5)]"
                    }`}
                  >
                    {submitting ? "Boarding..." : "Board"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-white text-[22px] font-black tracking-[-0.02em] mb-1">You&apos;re on the manifest.</p>
                <p className="text-white/20 text-[13px]">See you on Mars, {name.split(" ")[0]}.</p>
              </div>
            )}
          </div>
        </div>

        {/* ═══ PRE-FLIGHT RULES ═══ */}
        <div className="mb-6 px-1">
          <p className="text-mars/30 text-[8px] uppercase tracking-[0.5em] font-bold mb-4">Pre-Flight Briefing</p>
          <div className="space-y-3">
            {RULES_OF_MARS.map((rule, i) => (
              <div key={i}>
                <p className="text-mars/40 text-[10px] font-black uppercase tracking-[0.15em] mb-0.5">{rule.title}</p>
                <p className="text-white/20 text-[11px] leading-[1.6]">{rule.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SOUNDTRACK ═══ */}
        <div className="relative rounded-[18px] overflow-hidden border border-mars/10 mb-6" style={{ background: "linear-gradient(170deg, #1a1510 0%, #110f0c 100%)" }}>
          <div className="px-6 sm:px-8 py-6">
            <p className="text-mars/30 text-[8px] uppercase tracking-[0.5em] font-bold mb-1">Soundtrack</p>
            <p className="text-white/20 text-[12px] mb-4">
              Add your song to the{" "}
              <a href="https://open.spotify.com/playlist/33g5Ukkzcd2bUbvkKMMxr2" target="_blank" rel="noopener noreferrer" className="text-mars/60 font-bold hover:text-mars transition-colors">
                Stage on Mars playlist
              </a>
              . It might become part of the game.
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
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="pt-4 pb-4 flex flex-col items-center gap-3">
          <img src="/logo.png" alt="Stage on Mars" className="h-7 invert opacity-10" />
          <a href="mailto:play@stageonmars.com" className="text-white/8 text-[10px] hover:text-white/20 transition-colors">play@stageonmars.com</a>
        </div>
      </div>
    </div>
  );
}
