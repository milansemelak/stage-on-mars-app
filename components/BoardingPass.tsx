"use client";

import { useState } from "react";
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
    <div className="space-y-3">

      {/* ═══ THE TICKET ═══ */}
      <div className="bg-black text-white rounded-2xl overflow-hidden">
        <div className="px-6 sm:px-8 pt-8 pb-6">
          <h1 className="text-[36px] sm:text-[48px] font-bold tracking-[-0.04em] leading-[1.1] mb-8">
            {mission.company} <span className="font-mercure italic text-mars">on Mars</span>
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-5">
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-0.5">Date</p>
              <p className="text-white text-[14px] font-semibold">{dateFormatted}</p>
            </div>
            {mission.time && (
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-0.5">Time</p>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-5 mt-4">
              {(mission.location || mission.venue) && (
                <div className="col-span-2">
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-0.5">Location</p>
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

        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-white" />
          <div className="border-t border-dashed border-white/10 mx-5" />
        </div>

        <div className="px-6 sm:px-8 py-6">
          <p className="font-mercure italic text-mars text-[20px] sm:text-[26px] leading-[1.3]">
            &ldquo;{mission.question}&rdquo;
          </p>
        </div>
      </div>

      {/* ═══ WELCOME MESSAGE ═══ */}
      {mission.welcome_message && (
        <div className="rounded-2xl border border-neutral-200 px-6 sm:px-8 py-6 sm:py-8">
          <p className="text-black/70 text-[15px] sm:text-[16px] leading-[1.8] whitespace-pre-line">
            {mission.welcome_message}
          </p>
        </div>
      )}

      {/* ═══ CREW MANIFEST ═══ */}
      <div className="bg-black text-white rounded-2xl px-6 sm:px-8 py-6 sm:py-8">
        <h2 className="text-[20px] sm:text-[24px] font-bold tracking-[-0.03em] mb-4">
          Who is flying to Mars?
        </h2>
        {crew.length > 0 ? (
          <div className="space-y-0.5">
            {crew.map((member, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <span className="text-mars text-[13px] font-bold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-white text-[15px] font-medium">{member.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/30 text-[15px]">No crew members yet. Be the first to board.</p>
        )}
      </div>

      {/* ═══ QUESTIONS TO PLAY ═══ */}
      {crew.some((m) => m.question) && (
        <div className="bg-mars rounded-2xl px-6 sm:px-8 py-6 sm:py-8">
          <h2 className="text-white text-[20px] sm:text-[24px] font-bold tracking-[-0.03em] mb-4">
            Your Questions
          </h2>
          <div className="space-y-4">
            {crew.filter((m) => m.question).map((member, i) => (
              <div key={i}>
                <p className="text-white text-[16px] sm:text-[18px] font-bold leading-[1.3] mb-0.5">
                  {member.question}
                </p>
                <p className="text-white/50 text-[12px]">{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ REGISTRATION ═══ */}
      <div className="rounded-2xl border border-neutral-200 px-6 sm:px-8 py-6 sm:py-8">
        {!registered ? (
          <>
            <h2 className="text-black text-[20px] sm:text-[24px] font-bold tracking-[-0.03em] mb-1">
              Join the crew.
            </h2>
            <p className="text-neutral-400 text-[14px] mb-6">Register and bring a question worth playing.</p>

            {error && (
              <p className="text-red-600 text-[13px] mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200">{error}</p>
            )}

            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-[14px] text-black placeholder:text-neutral-400 focus:outline-none focus:border-mars transition-colors" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email" required className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-[14px] text-black placeholder:text-neutral-400 focus:outline-none focus:border-mars transition-colors" />
              </div>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Your question — what do you want to explore on Mars?"
                required
                rows={2}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-[14px] text-black placeholder:text-neutral-400 focus:outline-none focus:border-mars transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={submitting || !name.trim() || !email.trim() || !question.trim()}
                className={`w-full py-3.5 rounded-lg font-bold text-[14px] uppercase tracking-[0.1em] transition-all ${
                  submitting || !name.trim() || !email.trim() || !question.trim()
                    ? "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                    : "bg-mars text-white hover:bg-mars-light active:scale-[0.99]"
                }`}
              >
                {submitting ? "Boarding..." : "Board this mission"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-black text-[22px] font-bold mb-1">You&apos;re in.</p>
            <p className="text-neutral-400 text-[14px]">See you on Mars, {name.split(" ")[0]}.</p>
          </div>
        )}
      </div>

      {/* ═══ RULES ═══ */}
      <div className="bg-black text-white rounded-2xl px-6 sm:px-8 py-6 sm:py-8">
        <h2 className="text-[20px] sm:text-[24px] font-bold tracking-[-0.03em] mb-5">
          Rules of Mars
        </h2>
        <div className="space-y-3">
          {RULES_OF_MARS.map((rule, i) => (
            <div key={i}>
              <p className="text-white text-[13px] font-bold uppercase tracking-[0.1em] mb-0.5">{rule.title}</p>
              <p className="text-white/45 text-[13px] leading-[1.6]">{rule.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SPOTIFY ═══ */}
      <div className="rounded-2xl border border-neutral-200 px-6 sm:px-8 py-6 sm:py-8">
        <h2 className="text-black text-[20px] sm:text-[24px] font-bold tracking-[-0.03em] mb-1">
          Add music to the play.
        </h2>
        <p className="text-neutral-500 text-[14px] leading-[1.6] mb-5">
          Here&apos;s our{" "}
          <a href="https://open.spotify.com/playlist/33g5Ukkzcd2bUbvkKMMxr2" target="_blank" rel="noopener noreferrer" className="text-mars font-medium hover:underline">
            Stage on Mars playlist
          </a>
          . Add your song — it might become part of the game and stay on Mars forever.
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

      {/* ═══ BRANDING FOOTER ═══ */}
      <div className="pt-4 pb-2 flex justify-center">
        <img src="/logo.png" alt="Stage on Mars" className="h-6 opacity-30" />
      </div>
    </div>
  );
}
