"use client";

import { useState } from "react";
import type { Mission } from "@/lib/types";

type CrewMember = { name: string; question: string };

function Barcode({ code }: { code: string }) {
  const bars = code.split("").flatMap((c, ci) => {
    const w = (c.charCodeAt(0) % 3) + 1;
    return [w, 1];
  });
  return (
    <div className="flex items-end justify-center gap-[0.5px] h-8 opacity-30">
      {bars.map((w, i) => (
        <div key={i} className="bg-mars/80" style={{ width: `${w}px`, height: `${20 + (i % 7) * 3}px` }} />
      ))}
    </div>
  );
}

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
  const spotifyId = "33g5Ukkzcd2bUbvkKMMxr2";

  const infoItems = [
    { label: "Date", value: dateFormatted },
    mission.time ? { label: "Time", value: mission.time } : null,
    { label: "Crew", value: mission.group_size },
    { label: "Dresscode", value: mission.dresscode || "Dress to Play" },
  ].filter(Boolean) as { label: string; value: string }[];

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
    <div className="space-y-0">

      {/* ═══════════════════════════════════════════
          HERO — THE QUESTION
          ═══════════════════════════════════════════ */}
      <div className="relative py-12 sm:py-16 mb-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.04)_0%,_transparent_70%)]" />
        <div className="relative text-center">
          <p className="text-mars/30 text-[9px] uppercase tracking-[0.5em] mb-6">The Question</p>
          <p className="font-mercure italic text-mars/90 text-[24px] sm:text-[32px] md:text-[38px] leading-[1.3] max-w-xl mx-auto px-4">
            &ldquo;{mission.question}&rdquo;
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          WELCOME MESSAGE
          ═══════════════════════════════════════════ */}
      {mission.welcome_message && (
        <div className="max-w-md mx-auto mb-14 px-2">
          <p className="text-white/35 text-[13px] sm:text-[14px] leading-[1.8] whitespace-pre-line text-center">
            {mission.welcome_message}
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          BOARDING PASS — THE TICKET
          ═══════════════════════════════════════════ */}
      <div className="relative mb-10">
        {/* Outer glow */}
        <div className="absolute -inset-[2px] rounded-[22px] bg-gradient-to-b from-mars/15 via-mars/5 to-transparent blur-[1px] opacity-60" />

        <div className="relative rounded-[20px] bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] overflow-hidden">
          {/* Top mars accent */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-mars/60 to-transparent" />

          {/* Header */}
          <div className="px-6 sm:px-10 pt-8 pb-6">
            <div className="flex items-start justify-between mb-2">
              <p className="text-mars/30 text-[8px] uppercase tracking-[0.5em]">Boarding Pass</p>
              {mission.facilitator && (
                <div className="text-right">
                  <p className="text-mars/25 text-[8px] uppercase tracking-[0.4em] mb-0.5">Pilot</p>
                  <p className="text-white/40 text-[12px] font-medium">{mission.facilitator}</p>
                </div>
              )}
            </div>

            <h2 className="text-[24px] sm:text-[32px] font-bold tracking-[-0.03em] leading-[1.1] mb-8">
              <span className="text-white/90">{mission.company}</span>
              <span className="font-mercure italic text-mars ml-2">on Mars</span>
            </h2>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
              {infoItems.map((item) => (
                <div key={item.label}>
                  <p className="text-mars/25 text-[8px] uppercase tracking-[0.4em] mb-1">{item.label}</p>
                  <p className="text-white/70 text-[13px] sm:text-[14px] font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Location + Captain row */}
            {(mission.location || mission.venue || mission.captain) && (
              <div className="flex flex-wrap gap-x-10 gap-y-3 mt-5">
                {(mission.location || mission.venue) && (
                  <div>
                    <p className="text-mars/25 text-[8px] uppercase tracking-[0.4em] mb-1">Location</p>
                    {mission.maps_url ? (
                      <a href={mission.maps_url} target="_blank" rel="noopener noreferrer" className="text-white/50 text-[13px] hover:text-mars/80 transition-colors underline underline-offset-2 decoration-white/10 hover:decoration-mars/30">
                        {mission.location || mission.venue}
                      </a>
                    ) : (
                      <p className="text-white/50 text-[13px]">{mission.location || mission.venue}</p>
                    )}
                  </div>
                )}
                {mission.captain && (
                  <div>
                    <p className="text-mars/25 text-[8px] uppercase tracking-[0.4em] mb-1">Captain</p>
                    <p className="text-white/50 text-[13px]">{mission.captain}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Tear line ── */}
          <div className="relative my-0">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#0a0a0a] border-r border-white/[0.04]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-[#0a0a0a] border-l border-white/[0.04]" />
            <div className="border-t border-dashed border-white/[0.06] mx-5" />
          </div>

          {/* Barcode section */}
          <div className="px-6 sm:px-10 py-6 flex items-center justify-between">
            <div className="flex-1">
              <Barcode code={mission.code} />
            </div>
            <p className="text-white/10 text-[9px] tracking-[0.4em] uppercase font-mono ml-4 shrink-0">
              {mission.code}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          CREW MANIFEST
          ═══════════════════════════════════════════ */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
          <p className="text-mars/30 text-[9px] uppercase tracking-[0.4em] font-bold shrink-0">Crew Manifest</p>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {crew.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {crew.map((member, i) => (
              <div
                key={i}
                className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-mars/15 transition-colors"
              >
                <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-mars/20 to-mars/5 border border-mars/15 flex items-center justify-center">
                  <span className="text-mars/70 text-[9px] font-bold uppercase">
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <p className="text-white/50 text-[12px] font-medium group-hover:text-white/70 transition-colors">{member.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/10 text-[12px] text-center py-6">No crew members yet. Be the first to board.</p>
        )}
        <p className="text-white/10 text-[10px] text-center mt-3">{crew.length} registered</p>
      </div>

      {/* ═══════════════════════════════════════════
          QUESTIONS TO PLAY
          ═══════════════════════════════════════════ */}
      {crew.some((m) => m.question) && (
        <div className="relative mb-10 rounded-2xl overflow-hidden">
          {/* Orange gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-mars via-mars to-[#cc4400]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />

          <div className="relative px-6 sm:px-10 py-8">
            <p className="text-black/30 text-[9px] uppercase tracking-[0.4em] font-bold mb-6">Questions to Play</p>
            <div className="space-y-5">
              {crew.filter((m) => m.question).map((member, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-black/15">
                  <p className="font-mercure italic text-black/75 text-[15px] sm:text-[17px] leading-[1.4] mb-1">
                    &ldquo;{member.question}&rdquo;
                  </p>
                  <p className="text-black/35 text-[11px] font-medium">{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          REGISTRATION FORM
          ═══════════════════════════════════════════ */}
      <div className="relative mb-10 rounded-2xl overflow-hidden">
        <div className="absolute -inset-[1px] rounded-[18px] bg-gradient-to-b from-mars/10 to-transparent blur-[0.5px]" />
        <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.06] overflow-hidden">
          <div className="px-6 sm:px-10 py-8 sm:py-10">
            {!registered ? (
              <>
                <div className="text-center mb-8">
                  <p className="text-mars/40 text-[9px] uppercase tracking-[0.4em] font-bold mb-3">Join the Crew</p>
                  <p className="text-white/25 text-[13px] leading-[1.6]">Register your seat and bring a question worth playing.</p>
                </div>

                {error && (
                  <p className="text-red-400/80 text-[12px] mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center">{error}</p>
                )}

                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] focus:border-mars/25 px-4 py-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none transition-colors"
                    />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Your email"
                      required
                      className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] focus:border-mars/25 px-4 py-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none transition-colors"
                    />
                  </div>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Your question to play — what do you want to explore on Mars?"
                    required
                    rows={2}
                    className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] focus:border-mars/25 px-4 py-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !email.trim() || !question.trim()}
                    className={`group relative w-full py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-[0.2em] transition-all overflow-hidden ${
                      submitting || !name.trim() || !email.trim() || !question.trim()
                        ? "bg-white/[0.03] text-white/15 cursor-not-allowed border border-white/[0.04]"
                        : "bg-mars text-white border border-mars/40 shadow-[0_0_30px_-8px_rgba(255,85,0,0.4)] hover:shadow-[0_0_50px_-8px_rgba(255,85,0,0.6)] hover:scale-[1.01] active:scale-[0.99]"
                    }`}
                  >
                    <span className="relative z-10">{submitting ? "Boarding..." : "Board this mission"}</span>
                    {!(submitting || !name.trim() || !email.trim() || !question.trim()) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-mars/15 border border-mars/25 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-6 h-6 text-mars/80" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-white/80 text-[18px] sm:text-[22px] font-bold mb-2 tracking-[-0.02em]">You&apos;re on the manifest.</p>
                <p className="text-white/25 text-[13px]">See you on Mars, {name.split(" ")[0]}.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          RULES OF MARS
          ═══════════════════════════════════════════ */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/[0.04]" />
          <p className="text-mars/25 text-[9px] uppercase tracking-[0.4em] font-bold shrink-0">Rules of Mars</p>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/[0.04]" />
        </div>

        <div className="space-y-1">
          {RULES_OF_MARS.map((rule, i) => (
            <div key={i} className="relative pl-4 border-l border-white/[0.04] py-0.5 hover:border-mars/15 transition-colors">
              <p className="text-mars/35 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] mb-0.5">{rule.title}</p>
              <p className="text-white/25 text-[11px] sm:text-[12px] leading-[1.6]">{rule.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SPOTIFY
          ═══════════════════════════════════════════ */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/[0.04]" />
          <p className="text-mars/25 text-[9px] uppercase tracking-[0.4em] font-bold shrink-0">Soundtrack</p>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/[0.04]" />
        </div>

        <p className="text-white/30 text-[12px] sm:text-[13px] leading-[1.6] mb-5 text-center max-w-sm mx-auto">
          Here&apos;s our{" "}
          <a href="https://open.spotify.com/playlist/33g5Ukkzcd2bUbvkKMMxr2" target="_blank" rel="noopener noreferrer" className="text-mars/50 hover:text-mars/70 transition-colors underline underline-offset-2 decoration-mars/15">
            Stage on Mars playlist
          </a>
          . Add your song — it might become part of the game and stay on Mars forever.
        </p>
        <div className="rounded-xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
          <iframe
            src={`https://open.spotify.com/embed/playlist/${spotifyId}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="border-0"
          />
        </div>
      </div>
    </div>
  );
}
