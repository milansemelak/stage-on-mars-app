"use client";

import { useState } from "react";
import type { Mission } from "@/lib/types";

type CrewMember = { name: string; question: string };

function Barcode({ code }: { code: string }) {
  const bars = code.split("").flatMap((c) => {
    const w = (c.charCodeAt(0) % 3) + 1;
    return [w, 1];
  });
  return (
    <div className="flex items-end justify-center gap-[1px] h-10 opacity-20">
      {bars.map((w, i) => (
        <div key={i} className="bg-mars" style={{ width: `${w}px`, height: `${24 + (i % 7) * 4}px` }} />
      ))}
    </div>
  );
}

const RULES_OF_MARS = [
  {
    title: "Freedom",
    body: "This experience gives you absolute freedom of expression. It is essentially a hole in reality. You can ask anything, create anything, share and express yourself exactly as you feel. No one will judge you here. Enjoy it fully.\n\nFreedom and responsibility go hand in hand. At Stage on Mars you have space to express yourself, to be seen, to create. At the same time, your boundaries are yours alone and they matter. You do not have to accept any idea, role, or direction that does not resonate with you. You can say no. You can step back. You can change your mind at any time. We are in this together.",
  },
  {
    title: "Responsibility",
    body: "During the experience, alcohol and other psychoactive substances are not permitted. If you want to be high, immersion in the game will be more than enough.",
  },
  {
    title: "Dress Code",
    body: "Dress comfortably. Wear whatever you feel good playing in. If you arrive in a pink dinosaur costume — yes it has happened — we will be delighted.",
  },
  {
    title: "Play to Play",
    body: "This is not a performance. There is no audience. You are doing this only for yourself. How you choose to express yourself is entirely up to you. You can stay silent. You can sing opera, dance, recite, mumble, or simply speak like a human being. Play for the sake of the game itself.",
  },
  {
    title: "Own Truth",
    body: "A lot happens on Mars. Emotions. Thoughts. Observations. New angles of view. What does not happen on Mars is universal truth. We do not come here to agree. We come here to expand our horizons. And when we leave, each of us takes away something different. Our own truth.",
  },
  {
    title: "Confidentiality",
    body: "What happens on Mars stays on Mars. We are here to play, explore, and push boundaries together. And that means trust is essential. Everything we create, share, and experience here stays within this space. If there is anything you are unsure about or want to keep private, let us know. This is a space of respect, safety, and openness.",
  },
  {
    title: "Questions",
    body: "Not every question will turn into a game. There will not be time for all of them. But everyone will have the opportunity to share their question and invite others to step into it.",
  },
  {
    title: "Punctuality",
    body: "It is important to arrive on time. The introduction and the pre-flight briefing are an essential part of the entire experience.",
  },
];

export default function BoardingPass({ mission, initialCrew }: { mission: Mission; initialCrew: CrewMember[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const [crew, setCrew] = useState<CrewMember[]>(initialCrew);

  const missionDate = new Date(mission.date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  const gate = `M-${String(mission.code.charCodeAt(0) % 20 + 1).padStart(2, "0")}`;
  const rules = RULES_OF_MARS;
  const spotifyId = "33g5Ukkzcd2bUbvkKMMxr2";

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

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setSubmitting(false);
        return;
      }

      setRegistered(true);
      setCrew((prev) => [...prev, { name, question }]);
    } catch {
      setError("Connection failed. Try again.");
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      {/* ── BOARDING PASS CARD ── */}
      <div className="relative rounded-2xl border border-white/[0.1] bg-white/[0.02] overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-mars/50 to-transparent" />

        <div className="px-6 sm:px-10 pt-8 pb-6">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-mars/40 text-[9px] uppercase tracking-[0.4em] mb-1">Boarding Pass</p>
              <p className="text-white/80 text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">
                {mission.company} <span className="font-mercure italic text-mars">on Mars</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-mars/40 text-[9px] uppercase tracking-[0.4em] mb-1">Gate</p>
              <p className="text-white/60 text-[20px] sm:text-[26px] font-bold tracking-tight">{gate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div>
              <p className="text-mars/35 text-[9px] uppercase tracking-[0.3em] mb-1">From</p>
              <p className="text-white/70 text-[14px] font-bold">Earth</p>
            </div>
            <div>
              <p className="text-mars/35 text-[9px] uppercase tracking-[0.3em] mb-1">To</p>
              <p className="text-mars text-[14px] font-bold">Mars</p>
            </div>
            <div>
              <p className="text-mars/35 text-[9px] uppercase tracking-[0.3em] mb-1">Date</p>
              <p className="text-white/70 text-[14px] font-bold">{missionDate}</p>
            </div>
            <div>
              <p className="text-mars/35 text-[9px] uppercase tracking-[0.3em] mb-1">Crew</p>
              <p className="text-white/70 text-[14px] font-bold">{mission.group_size}</p>
            </div>
          </div>

          {(mission.location || mission.venue) && (
            <div className="mb-6">
              <p className="text-mars/35 text-[9px] uppercase tracking-[0.3em] mb-1">Location</p>
              <p className="text-white/50 text-[13px]">{mission.location || mission.venue}</p>
            </div>
          )}
        </div>

        {/* Tear line */}
        <div className="relative my-0">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0a0a0a]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-[#0a0a0a]" />
          <div className="border-t-2 border-dashed border-white/[0.06] mx-6" />
        </div>

        <div className="px-6 sm:px-10 pt-6 pb-8">
          <div className="mb-6">
            <p className="text-mars/35 text-[9px] uppercase tracking-[0.3em] mb-2">Your Mission</p>
            <p className="font-mercure italic text-white/60 text-[16px] sm:text-[18px] leading-[1.5]">
              &ldquo;{mission.question}&rdquo;
            </p>
          </div>

          {mission.welcome_message && (
            <div className="mb-6">
              <p className="text-white/40 text-[13px] sm:text-[14px] leading-[1.7] whitespace-pre-line">
                {mission.welcome_message}
              </p>
            </div>
          )}

          <div className="mt-8">
            <Barcode code={mission.code} />
            <p className="text-center text-white/15 text-[10px] tracking-[0.3em] uppercase mt-2">
              {mission.code}
            </p>
          </div>
        </div>
      </div>

      {/* ── CREW MANIFEST ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent" />
        <div className="px-6 sm:px-10 py-8">
          <div className="flex items-center justify-between mb-5">
            <p className="text-mars/40 text-[10px] uppercase tracking-[0.3em] font-bold">Crew Manifest</p>
            <p className="text-white/15 text-[11px]">{crew.length} registered</p>
          </div>

          {crew.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {crew.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="shrink-0 w-7 h-7 rounded-full bg-mars/10 border border-mars/20 flex items-center justify-center">
                    <span className="text-mars/60 text-[10px] font-bold uppercase">
                      {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <p className="text-white/60 text-[12px] font-medium truncate">{member.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/15 text-[12px] text-center py-4">No crew members yet. Be the first to board.</p>
          )}
        </div>
      </div>

      {/* ── QUESTIONS TO PLAY ── */}
      {crew.some((m) => m.question) && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent" />
          <div className="px-6 sm:px-10 py-8">
            <p className="text-mars/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-5">Questions to Play</p>
            <div className="space-y-4">
              {crew
                .filter((m) => m.question)
                .map((member, i) => (
                  <div key={i} className="relative pl-4 border-l-2 border-mars/15">
                    <p className="font-mercure italic text-white/50 text-[14px] sm:text-[15px] leading-[1.5] mb-1.5">
                      &ldquo;{member.question}&rdquo;
                    </p>
                    <p className="text-white/20 text-[11px]">{member.name}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── REGISTRATION ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent" />
        <div className="px-6 sm:px-10 py-8">
          {!registered ? (
            <>
              <p className="text-mars/50 text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Board this mission</p>
              <p className="text-white/30 text-[13px] mb-6">Register your seat and send your question to play.</p>

              {error && (
                <p className="text-red-400/80 text-[12px] mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">{error}</p>
              )}

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-mars/30 px-4 py-3 text-[13px] text-white placeholder:text-white/25 focus:outline-none transition-colors"
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Your email"
                    required
                    className="w-full rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-mars/30 px-4 py-3 text-[13px] text-white placeholder:text-white/25 focus:outline-none transition-colors"
                  />
                </div>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Your question to play — what do you want to explore on Mars?"
                  required
                  rows={2}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-mars/30 px-4 py-3 text-[13px] text-white placeholder:text-white/25 focus:outline-none transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !email.trim() || !question.trim()}
                  className={`w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-[0.15em] transition-all ${
                    submitting || !name.trim() || !email.trim() || !question.trim()
                      ? "bg-white/[0.06] text-white/25 cursor-not-allowed"
                      : "bg-mars hover:bg-mars-light text-white shadow-[0_4px_20px_-4px_rgba(255,85,0,0.3)]"
                  }`}
                >
                  {submitting ? "Boarding..." : "Board this mission"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-10 h-10 rounded-full bg-mars/20 border border-mars/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-mars" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-white/80 text-[16px] sm:text-[18px] font-bold mb-2">You&apos;re on the manifest.</p>
              <p className="text-white/30 text-[12px] sm:text-[13px]">See you on Mars, {name.split(" ")[0]}.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── RULES ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="px-6 sm:px-10 py-8">
          <p className="text-mars/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-5">Rules of Mars</p>
          <div className="space-y-5">
            {rules.map((rule, i) => (
              <div key={i} className="relative pl-4 border-l border-mars/15">
                <p className="text-mars/50 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.15em] mb-1.5">{rule.title}</p>
                <p className="text-white/40 text-[12px] sm:text-[13px] leading-[1.7] whitespace-pre-line">{rule.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SPOTIFY ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="px-6 sm:px-10 py-8">
          <p className="text-mars/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Add music to the play.</p>
          <p className="text-white/50 text-[13px] sm:text-[14px] leading-[1.6] mb-5">
            Here&apos;s our{" "}
            <a
              href="https://open.spotify.com/playlist/33g5Ukkzcd2bUbvkKMMxr2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mars/70 hover:text-mars transition-colors underline underline-offset-2"
            >
              Stage on Mars playlist
            </a>{" "}
            and everyone can add something to it. Maybe your song will become part of the game… and stay on Mars forever.
          </p>
          <div className="rounded-xl overflow-hidden">
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
    </div>
  );
}
