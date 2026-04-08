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

  const inputClass = "w-full rounded-xl bg-white/[0.06] border-2 border-white/[0.08] px-4 py-3.5 text-[15px] text-white placeholder:text-white/25 focus:outline-none focus:border-mars/40 transition-colors";

  return (
    <div className="min-h-screen bg-[#111]">
      {/* ═══ NAV ═══ */}
      <nav className="flex items-center justify-center px-5 py-7">
        <Link href="/business">
          <img src="/logo.png" alt="Stage On Mars" className="h-7 sm:h-8 w-auto invert opacity-40 hover:opacity-70 transition-opacity" />
        </Link>
      </nav>

      <div className="max-w-xl mx-auto px-4 sm:px-6 pb-12 space-y-5">

        {/* ═══ THE TICKET ═══ */}
        <div className="rounded-3xl overflow-hidden shadow-[0_8px_60px_-12px_rgba(255,85,0,0.12)]">
          <div className="h-1 bg-mars" />

          <div className="bg-[#1a1a1a] px-6 sm:px-10 pt-8 sm:pt-10 pb-8">
            <h1 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.04em] leading-[1.05] mb-10 text-white">
              {mission.company} <span className="font-mercure italic text-mars">on Mars</span>
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-6">
              <div>
                <p className="text-mars/60 text-[10px] uppercase tracking-[0.2em] mb-1">Date</p>
                <p className="text-white text-[15px] font-semibold">{dateFormatted}</p>
              </div>
              {mission.time && (
                <div>
                  <p className="text-mars/60 text-[10px] uppercase tracking-[0.2em] mb-1">Time</p>
                  <p className="text-white text-[15px] font-semibold">{mission.time}</p>
                </div>
              )}
              <div>
                <p className="text-mars/60 text-[10px] uppercase tracking-[0.2em] mb-1">Crew</p>
                <p className="text-white text-[15px] font-semibold">{mission.group_size}</p>
              </div>
              <div>
                <p className="text-mars/60 text-[10px] uppercase tracking-[0.2em] mb-1">Dresscode</p>
                <p className="text-white text-[15px] font-semibold">{mission.dresscode || "Dress to Play"}</p>
              </div>
            </div>

            {(mission.location || mission.venue || mission.captain || mission.facilitator) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-6 mt-6">
                {(mission.location || mission.venue) && (
                  <div className="col-span-2">
                    <p className="text-mars/60 text-[10px] uppercase tracking-[0.2em] mb-1">Location</p>
                    {mission.maps_url ? (
                      <a href={mission.maps_url} target="_blank" rel="noopener noreferrer" className="text-white text-[15px] font-semibold underline underline-offset-4 decoration-mars/30 hover:decoration-mars transition-colors">
                        {mission.location || mission.venue}
                      </a>
                    ) : (
                      <p className="text-white text-[15px] font-semibold">{mission.location || mission.venue}</p>
                    )}
                  </div>
                )}
                {mission.captain && (
                  <div>
                    <p className="text-mars/60 text-[10px] uppercase tracking-[0.2em] mb-1">Captain</p>
                    <p className="text-white text-[15px] font-semibold">{mission.captain}</p>
                  </div>
                )}
                {mission.facilitator && (
                  <div>
                    <p className="text-mars/60 text-[10px] uppercase tracking-[0.2em] mb-1">Pilot</p>
                    <p className="text-white text-[15px] font-semibold">{mission.facilitator}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tear line */}
          <div className="relative bg-[#1a1a1a]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#111]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-[#111]" />
            <div className="border-t-2 border-dashed border-white/[0.06] mx-6" />
          </div>

          {/* Question */}
          <div className="bg-[#1a1a1a] px-6 sm:px-10 py-8">
            <p className="font-mercure italic text-mars text-[22px] sm:text-[28px] leading-[1.35]">
              &ldquo;{mission.question}&rdquo;
            </p>
          </div>
        </div>

        {/* ═══ WELCOME MESSAGE ═══ */}
        {mission.welcome_message && (
          <div className="rounded-3xl bg-[#1a1a1a] px-6 sm:px-10 py-8 sm:py-10">
            <p className="text-white/50 text-[15px] sm:text-[17px] leading-[1.9] whitespace-pre-line">
              {mission.welcome_message}
            </p>
          </div>
        )}

        {/* ═══ CREW MANIFEST ═══ */}
        <div className="rounded-3xl bg-[#1a1a1a] px-6 sm:px-10 py-7 sm:py-8">
          <h2 className="text-white text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] mb-5">
            Who is flying to Mars?
          </h2>
          {crew.length > 0 ? (
            <div className="space-y-0">
              {crew.map((member, i) => (
                <div key={i} className="flex items-center gap-4 py-2.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-mars text-[14px] font-bold tabular-nums w-6">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-white/80 text-[16px] font-medium">{member.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/20 text-[15px]">No crew members yet. Be the first to board.</p>
          )}
        </div>

        {/* ═══ QUESTIONS TO PLAY ═══ */}
        {crew.some((m) => m.question) && (
          <div className="rounded-3xl bg-mars px-6 sm:px-10 py-7 sm:py-8">
            <h2 className="text-white text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] mb-5">
              Your Questions
            </h2>
            <div className="space-y-5">
              {crew.filter((m) => m.question).map((member, i) => (
                <div key={i}>
                  <p className="text-white font-mercure italic text-[18px] sm:text-[20px] leading-[1.35] mb-1">
                    &ldquo;{member.question}&rdquo;
                  </p>
                  <p className="text-white/50 text-[13px] font-medium">{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ REGISTRATION ═══ */}
        <div className="rounded-3xl bg-[#1a1a1a] px-6 sm:px-10 py-7 sm:py-8">
          {!registered ? (
            <>
              <h2 className="text-white text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] mb-1">
                Join the crew.
              </h2>
              <p className="text-white/30 text-[14px] mb-6">Register and bring a question worth playing.</p>

              {error && (
                <p className="text-red-400 text-[13px] mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">{error}</p>
              )}

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className={inputClass} />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email" required className={inputClass} />
                </div>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Your question — what do you want to explore on Mars?"
                  required
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !email.trim() || !question.trim()}
                  className={`w-full py-4 rounded-xl font-bold text-[15px] uppercase tracking-[0.1em] transition-all ${
                    submitting || !name.trim() || !email.trim() || !question.trim()
                      ? "bg-white/[0.04] text-white/20 cursor-not-allowed"
                      : "bg-mars text-white hover:brightness-110 active:scale-[0.99] shadow-[0_4px_24px_-4px_rgba(255,85,0,0.4)]"
                  }`}
                >
                  {submitting ? "Boarding..." : "Board this mission"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-white text-[24px] font-bold mb-2">You&apos;re in.</p>
              <p className="text-white/30 text-[15px]">See you on Mars, {name.split(" ")[0]}.</p>
            </div>
          )}
        </div>

        {/* ═══ RULES ═══ */}
        <div className="rounded-3xl bg-[#1a1a1a] px-6 sm:px-10 py-7 sm:py-8">
          <h2 className="text-white text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] mb-6">
            Rules of Mars
          </h2>
          <div className="space-y-4">
            {RULES_OF_MARS.map((rule, i) => (
              <div key={i}>
                <p className="text-mars text-[12px] font-bold uppercase tracking-[0.12em] mb-1">{rule.title}</p>
                <p className="text-white/35 text-[13px] leading-[1.7]">{rule.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SPOTIFY ═══ */}
        <div className="rounded-3xl bg-[#1a1a1a] px-6 sm:px-10 py-7 sm:py-8">
          <h2 className="text-white text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] mb-1">
            Add music to the play.
          </h2>
          <p className="text-white/30 text-[14px] leading-[1.6] mb-5">
            Here&apos;s our{" "}
            <a href="https://open.spotify.com/playlist/33g5Ukkzcd2bUbvkKMMxr2" target="_blank" rel="noopener noreferrer" className="text-mars font-medium hover:underline">
              Stage on Mars playlist
            </a>
            . Add your song — it might become part of the game and stay on Mars forever.
          </p>
          <div className="rounded-2xl overflow-hidden">
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

        {/* ═══ FOOTER ═══ */}
        <div className="pt-6 pb-4 space-y-4">
          <div className="flex justify-center">
            <img src="/logo.png" alt="Stage on Mars" className="h-8 invert opacity-25" />
          </div>
          <p className="text-white/15 text-[11px] text-center">
            <a href="mailto:play@stageonmars.com" className="hover:text-white/30 transition-colors">play@stageonmars.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
