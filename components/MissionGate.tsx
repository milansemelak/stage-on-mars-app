"use client";

import { useState, useEffect } from "react";

export default function MissionGate({
  missionCode,
  children,
}: {
  missionCode: string;
  children: React.ReactNode;
}) {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  const storageKey = `mars-access-${missionCode}`;

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved === "granted") {
      setUnlocked(true);
    }
    setChecking(false);
  }, [storageKey]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);

    const res = await fetch(`/api/missions/${missionCode}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input }),
    });

    if (res.ok) {
      sessionStorage.setItem(storageKey, "granted");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
    }
  }

  if (checking) return null;

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <div className="w-12 h-12 rounded-full bg-mars/10 border border-mars/20 flex items-center justify-center mx-auto mb-5">
            <svg className="w-5 h-5 text-mars/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <p className="text-mars/50 text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Restricted Mission</p>
          <p className="text-white/30 text-[13px]">Enter the access code to view this mission briefing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            type="password"
            placeholder="Access code"
            autoFocus
            className={`w-full rounded-xl bg-white/[0.04] border ${error ? "border-red-500/40" : "border-white/[0.1]"} focus:border-mars/30 px-4 py-3.5 text-[14px] text-white placeholder:text-white/25 focus:outline-none transition-colors text-center tracking-[0.1em]`}
          />
          {error && (
            <p className="text-red-400/70 text-[12px]">Wrong access code. Try again.</p>
          )}
          <button
            type="submit"
            disabled={!input.trim()}
            className={`w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-[0.15em] transition-all ${
              !input.trim()
                ? "bg-mars/30 text-white/40 cursor-not-allowed"
                : "bg-mars hover:bg-mars-light text-white shadow-[0_4px_20px_-4px_rgba(255,85,0,0.3)]"
            }`}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
