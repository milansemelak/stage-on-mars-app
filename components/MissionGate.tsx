"use client";

import { useState, useEffect } from "react";

export default function MissionGate({
  missionCode,
  hasPassword,
  children,
}: {
  missionCode: string;
  hasPassword: boolean;
  children: React.ReactNode;
}) {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);
  const [entering, setEntering] = useState(false);

  const storageKey = `mars-access-${missionCode}`;

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved === "granted") setUnlocked(true);
    setChecking(false);
  }, [storageKey]);

  async function handleEnter(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(false);

    if (hasPassword) {
      const res = await fetch(`/api/missions/${missionCode}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: input }),
      });
      if (!res.ok) { setError(true); setInput(""); return; }
    }

    setEntering(true);
    setTimeout(() => {
      sessionStorage.setItem(storageKey, "granted");
      setUnlocked(true);
    }, 600);
  }

  if (checking) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className={`min-h-screen bg-white flex flex-col items-center justify-center px-6 transition-opacity duration-500 ${entering ? "opacity-0" : ""}`}>
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Stage on Mars"
          className="w-36 sm:w-44 mx-auto mb-16 opacity-80"
        />

        {/* Ticket card */}
        <div className="bg-black rounded-3xl px-8 sm:px-12 pt-12 pb-10 mb-6 text-center shadow-[0_4px_60px_-12px_rgba(0,0,0,0.15)]">
          <p className="text-white/40 text-[13px] sm:text-[15px] mb-4">
            Invitation to play.
          </p>
          <h1 className="text-white text-[34px] sm:text-[48px] font-bold tracking-[-0.04em] leading-[1.1] mb-8">
            This is your ticket
            <br />
            <span className="font-mercure italic text-mars">to Mars.</span>
          </h1>

          {/* Tear line inside the ticket */}
          <div className="relative mb-8">
            <div className="absolute left-[-2rem] sm:left-[-3rem] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white" />
            <div className="absolute right-[-2rem] sm:right-[-3rem] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white" />
            <div className="border-t border-dashed border-white/15" />
          </div>

          {/* Password + Enter */}
          <form onSubmit={handleEnter} className="space-y-3">
            {hasPassword && (
              <>
                <input
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(false); }}
                  type="password"
                  placeholder="Access code"
                  autoFocus
                  className={`w-full rounded-lg bg-white/10 border ${error ? "border-red-500/50" : "border-white/10"} focus:border-mars/40 px-4 py-3.5 text-[15px] text-white placeholder:text-white/30 focus:outline-none transition-colors text-center tracking-[0.05em]`}
                />
                {error && <p className="text-red-400 text-[12px]">Wrong code.</p>}
              </>
            )}
            <button
              type="submit"
              disabled={hasPassword && !input.trim()}
              className={`w-full py-4 rounded-xl font-bold text-[14px] uppercase tracking-[0.15em] transition-all ${
                hasPassword && !input.trim()
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : "bg-mars text-white hover:bg-mars-light active:scale-[0.98]"
              }`}
            >
              Enter Mars
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
