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

  const storageKey = `mars-access-${missionCode}`;

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved === "granted") {
      setUnlocked(true);
    }
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

      if (res.ok) {
        sessionStorage.setItem(storageKey, "granted");
        setUnlocked(true);
      } else {
        setError(true);
        setInput("");
      }
    } else {
      sessionStorage.setItem(storageKey, "granted");
      setUnlocked(true);
    }
  }

  if (checking) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mars/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-mars/[0.06] blur-[80px] pointer-events-none" />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.05,
              animation: `pulse ${Math.random() * 4 + 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm text-center">
        {/* Logo */}
        <div className="mb-10">
          <img
            src="/logo.png"
            alt="Stage on Mars"
            className="h-10 sm:h-12 w-auto mx-auto invert opacity-80"
          />
        </div>

        {/* Main text */}
        <div className="mb-10">
          <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-bold mb-5">
            Mission Briefing
          </p>
          <h1 className="text-[32px] sm:text-[42px] font-bold tracking-[-0.03em] leading-[1.1] mb-4">
            <span className="text-white">This is your</span>
            <br />
            <span className="font-mercure italic text-mars">ticket to Mars</span>
          </h1>
          <div className="w-12 h-[1px] bg-mars/20 mx-auto" />
        </div>

        {/* Password or Enter */}
        <form onSubmit={handleEnter} className="space-y-3">
          {hasPassword && (
            <>
              <input
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(false); }}
                type="password"
                placeholder="Enter access code"
                autoFocus
                className={`w-full rounded-xl bg-white/[0.04] border ${
                  error ? "border-red-500/40" : "border-white/[0.08]"
                } focus:border-mars/30 px-4 py-3.5 text-[14px] text-white placeholder:text-white/20 focus:outline-none transition-colors text-center tracking-[0.1em]`}
              />
              {error && (
                <p className="text-red-400/70 text-[12px]">Wrong access code. Try again.</p>
              )}
            </>
          )}
          <button
            type="submit"
            disabled={hasPassword && !input.trim()}
            className={`w-full py-4 rounded-xl font-bold text-[13px] uppercase tracking-[0.2em] transition-all ${
              hasPassword && !input.trim()
                ? "bg-mars/20 text-white/30 cursor-not-allowed"
                : "bg-mars hover:bg-mars-light text-white shadow-[0_8px_40px_-8px_rgba(255,85,0,0.4)] hover:shadow-[0_8px_50px_-8px_rgba(255,85,0,0.5)] hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            Enter Mars
          </button>
        </form>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-white/10 text-[10px] tracking-[0.2em] uppercase">play@stageonmars.com</p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
