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
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <img src="/logo.png" alt="Stage on Mars" className="h-8 sm:h-10 w-auto mx-auto mb-16 opacity-70" />

        {/* Bold statement */}
        <h1 className="text-black text-[42px] sm:text-[56px] font-bold tracking-[-0.04em] leading-[1] mb-3">
          This is your
          <br />
          <span className="font-mercure italic text-mars">ticket to Mars.</span>
        </h1>

        <div className="mt-12">
          <form onSubmit={handleEnter} className="space-y-3">
            {hasPassword && (
              <>
                <input
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(false); }}
                  type="password"
                  placeholder="Access code"
                  autoFocus
                  className={`w-full rounded-lg bg-neutral-100 border ${error ? "border-red-400" : "border-transparent"} focus:border-mars/40 px-4 py-3.5 text-[15px] text-black placeholder:text-neutral-400 focus:outline-none transition-colors text-center tracking-[0.1em]`}
                />
                {error && <p className="text-red-500 text-[12px]">Wrong code.</p>}
              </>
            )}
            <button
              type="submit"
              disabled={hasPassword && !input.trim()}
              className={`w-full py-4 rounded-lg font-bold text-[14px] uppercase tracking-[0.15em] transition-all ${
                hasPassword && !input.trim()
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-mars text-white hover:bg-mars-light active:scale-[0.98]"
              }`}
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
