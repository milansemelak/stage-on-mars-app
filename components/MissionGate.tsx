"use client";

import { useState, useEffect, useMemo } from "react";

function useStars(count: number) {
  return useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      w: (((i * 7 + 13) % 20) / 10) + 0.5,
      top: ((i * 37 + 11) % 100),
      left: ((i * 53 + 7) % 100),
      opacity: ((i * 17 + 3) % 25) / 100 + 0.05,
      duration: ((i * 11 + 5) % 40) / 10 + 3,
      delay: ((i * 23 + 9) % 50) / 10,
    })),
  [count]);
}

function useOrbitDots(count: number) {
  return useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      angle: (i / count) * 360,
      duration: 60 + ((i * 13) % 40),
      size: ((i * 7) % 3) + 1,
      opacity: ((i * 11) % 15) / 100 + 0.08,
    })),
  [count]);
}

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
  const stars = useStars(80);
  const orbitDots = useOrbitDots(12);

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
        setEntering(true);
        setTimeout(() => {
          sessionStorage.setItem(storageKey, "granted");
          setUnlocked(true);
        }, 1200);
      } else {
        setError(true);
        setInput("");
      }
    } else {
      setEntering(true);
      setTimeout(() => {
        sessionStorage.setItem(storageKey, "granted");
        setUnlocked(true);
      }, 1200);
    }
  }

  if (checking) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className={`min-h-screen bg-[#050508] text-[#EDEDED] flex flex-col items-center justify-center px-4 relative overflow-hidden transition-all duration-1000 ${entering ? "scale-110 opacity-0" : ""}`}>

      {/* Deep space gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0510] via-[#050508] to-[#0a0508] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.03)_0%,_transparent_70%)] pointer-events-none" />

      {/* Nebula glow — top */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-mars/[0.025] blur-[150px] pointer-events-none" />

      {/* Mars planet glow — center behind content */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-mars/[0.06] blur-[100px]" />
        <div className="absolute inset-[30%] rounded-full bg-mars/[0.08] blur-[60px]" />
      </div>

      {/* Orbit rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-white/[0.03] animate-[spin_120s_linear_infinite]" />
        <div className="absolute inset-[-15%] rounded-full border border-white/[0.02] animate-[spin_180s_linear_infinite_reverse]" />
        <div className="absolute inset-[15%] rounded-full border border-mars/[0.04] animate-[spin_90s_linear_infinite]" />

        {/* Orbit particles */}
        {orbitDots.map((dot) => (
          <div
            key={dot.id}
            className="absolute top-1/2 left-1/2 rounded-full bg-mars"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              opacity: dot.opacity,
              transform: `rotate(${dot.angle}deg) translateX(${dot.id % 2 === 0 ? '250' : '190'}px)`,
              animation: `spin ${dot.duration}s linear infinite${dot.id % 2 ? ' reverse' : ''}`,
            }}
          />
        ))}
      </div>

      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              width: `${s.w}px`,
              height: `${s.w}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Horizontal scan lines (subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)', backgroundSize: '100% 3px' }} />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md text-center">

        {/* Logo */}
        <div className="mb-6">
          <img
            src="/logo.png"
            alt="Stage on Mars"
            className="h-8 sm:h-10 w-auto mx-auto invert opacity-60"
          />
        </div>

        {/* Ticket card */}
        <div className="relative mb-6">
          {/* Outer glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-mars/20 via-mars/5 to-transparent blur-sm opacity-50" />

          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
            {/* Top accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-mars to-transparent opacity-60" />

            <div className="px-8 sm:px-12 pt-10 pb-8">
              {/* Pre-title */}
              <p className="text-mars/40 text-[9px] uppercase tracking-[0.5em] font-bold mb-6 animate-[fadeIn_1s_ease-out]">
                Boarding Authorization
              </p>

              {/* Main headline */}
              <h1 className="mb-3 animate-[fadeIn_1.2s_ease-out]">
                <span className="block text-white/90 text-[15px] sm:text-[17px] font-light tracking-[0.05em] mb-2">
                  This is your
                </span>
                <span className="block font-mercure italic text-mars text-[48px] sm:text-[60px] leading-[1] tracking-[-0.02em]">
                  ticket
                </span>
                <span className="block font-mercure italic text-mars/60 text-[30px] sm:text-[38px] leading-[1] tracking-[-0.02em]">
                  to Mars
                </span>
              </h1>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3 my-6 animate-[fadeIn_1.5s_ease-out]">
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-mars/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-mars/40" />
                <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-mars/30" />
              </div>

              {/* Sub text */}
              <p className="text-white/25 text-[12px] sm:text-[13px] tracking-[0.05em] leading-[1.6] max-w-[260px] mx-auto animate-[fadeIn_1.8s_ease-out]">
                You have been selected for a mission.<br />
                The stage is waiting.
              </p>
            </div>

            {/* Tear line */}
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#050508]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-[#050508]" />
              <div className="border-t border-dashed border-white/[0.06] mx-5" />
            </div>

            {/* Bottom section — password or enter */}
            <div className="px-8 sm:px-12 pt-6 pb-8">
              <form onSubmit={handleEnter} className="space-y-3">
                {hasPassword && (
                  <>
                    <div className="animate-[fadeIn_2s_ease-out]">
                      <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] mb-2">Access Code Required</p>
                      <input
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setError(false); }}
                        type="password"
                        placeholder="_ _ _ _ _ _"
                        autoFocus
                        className={`w-full rounded-xl bg-white/[0.03] border ${
                          error ? "border-red-500/30 bg-red-500/[0.03]" : "border-white/[0.06]"
                        } focus:border-mars/30 px-4 py-3.5 text-[16px] text-white placeholder:text-white/15 focus:outline-none transition-all text-center tracking-[0.3em] font-light`}
                      />
                    </div>
                    {error && (
                      <p className="text-red-400/60 text-[11px] tracking-[0.05em]">Access denied. Try again.</p>
                    )}
                  </>
                )}
                <button
                  type="submit"
                  disabled={hasPassword && !input.trim()}
                  className={`group relative w-full py-4 rounded-xl font-bold text-[12px] uppercase tracking-[0.25em] transition-all duration-300 animate-[fadeIn_2.2s_ease-out] overflow-hidden ${
                    hasPassword && !input.trim()
                      ? "bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/[0.04]"
                      : "bg-mars text-white border border-mars/50 shadow-[0_0_40px_-10px_rgba(255,85,0,0.5)] hover:shadow-[0_0_60px_-10px_rgba(255,85,0,0.7)] hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  <span className="relative z-10">Enter Mars</span>
                  {!(hasPassword && !input.trim()) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mission code at bottom */}
        <p className="text-white/10 text-[10px] tracking-[0.4em] uppercase font-mono">
          {missionCode}
        </p>
      </div>

      {/* Bottom email */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <p className="text-white/[0.06] text-[9px] tracking-[0.3em] uppercase">play@stageonmars.com</p>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.03; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.3); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
