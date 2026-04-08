"use client";

import { useState } from "react";
import type { Mission } from "@/lib/types";

function Barcode({ code }: { code: string }) {
  const bars = code.split("").flatMap((c, i) => {
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

const DEFAULT_RULES = [
  "What happens on Mars, stays on Mars.",
  "There are no wrong moves — only moves.",
  "Play your character, not yourself.",
  "Listen more than you speak.",
  "The question is the compass.",
];

export default function BoardingPass({ mission, initialCrewCount }: { mission: Mission; initialCrewCount: number }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const [crewCount, setCrewCount] = useState(initialCrewCount);

  const missionDate = new Date(mission.date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  const gate = `M-${String(mission.code.charCodeAt(0) % 20 + 1).padStart(2, "0")}`;
  const rules = mission.rules ? mission.rules.split("\n").filter(Boolean) : DEFAULT_RULES;

  const spotifyId = mission.spotify_url
    ? mission.spotify_url.match(/playlist\/([a-zA-Z0-9]+)/)?.[1] || ""
    : "";

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
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
      setCrewCount(data.crew_count);
    } catch {
      setError("Connection failed. Try again.");
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      {/* ── BOARDING PASS CARD ── */}
      <div className="relative rounded-2xl border border-white/[0.1] bg-white/[0.02] overflow-hidden">
        {/* Top accent */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-mars/50 to-transparent" />

        <div className="px-6 sm:px-10 pt-8 pb-6">
          {/* Header row */}
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

          {/* Flight info grid */}
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

          {/* Location */}
          {(mission.location || mission.venue) && (
            <div className="mb-6">
              <p className="text-mars/35 text-[9px] uppercase tracking-[0.3em] mb-1">Location</p>
              <p className="text-white/50 text-[13px]">{mission.location || mission.venue}</p>
            </div>
          )}
        </div>

        {/* ── TEAR LINE ── */}
        <div className="relative my-0">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0a0a0a]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-[#0a0a0a]" />
          <div className="border-t-2 border-dashed border-white/[0.06] mx-6" />
        </div>

        <div className="px-6 sm:px-10 pt-6 pb-8">
          {/* Mission question */}
          <div className="mb-6">
            <p className="text-mars/35 text-[9px] uppercase tracking-[0.3em] mb-2">Your Mission</p>
            <p className="font-mercure italic text-white/60 text-[16px] sm:text-[18px] leading-[1.5]">
              &ldquo;{mission.question}&rdquo;
            </p>
          </div>

          {/* Welcome message */}
          {mission.welcome_message && (
            <div className="mb-6">
              <p className="text-white/40 text-[13px] sm:text-[14px] leading-[1.6]">
                {mission.welcome_message}
              </p>
            </div>
          )}

          {/* Barcode */}
          <div className="mt-8">
            <Barcode code={mission.code} />
            <p className="text-center text-white/15 text-[10px] tracking-[0.3em] uppercase mt-2">
              {mission.code}
            </p>
          </div>
        </div>
      </div>

      {/* ── REGISTRATION ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent" />
        <div className="px-6 sm:px-10 py-8">
          {!registered ? (
            <>
              <p className="text-mars/50 text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Board this mission</p>
              <p className="text-white/30 text-[13px] mb-6">Register your seat and bring your question.</p>

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
                  placeholder="Your question for Mars (optional)"
                  rows={2}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-mars/30 px-4 py-3 text-[13px] text-white placeholder:text-white/25 focus:outline-none transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !email.trim()}
                  className={`w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-[0.15em] transition-all ${
                    submitting || !name.trim() || !email.trim()
                      ? "bg-white/[0.06] text-white/25 cursor-not-allowed"
                      : "bg-mars hover:bg-mars-light text-white shadow-[0_4px_20px_-4px_rgba(255,85,0,0.3)]"
                  }`}
                >
                  {submitting ? "Boarding..." : "Board this mission"}
                </button>
              </form>

              {crewCount > 0 && (
                <p className="text-white/15 text-[11px] text-center mt-4">{crewCount} crew member{crewCount !== 1 ? "s" : ""} registered</p>
              )}
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
              {crewCount > 0 && (
                <p className="text-white/15 text-[11px] mt-4">{crewCount} crew member{crewCount !== 1 ? "s" : ""} on board</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RULES ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="px-6 sm:px-10 py-8">
          <p className="text-mars/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-5">Rules of Play</p>
          <div className="space-y-3">
            {rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-mars/30 text-[11px] font-bold mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-white/50 text-[13px] sm:text-[14px] leading-[1.5]">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SPOTIFY ── */}
      {spotifyId && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="px-6 sm:px-10 py-8">
            <p className="text-mars/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-5">Mission Soundtrack</p>
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
      )}
    </div>
  );
}
