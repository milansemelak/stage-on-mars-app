"use client";

import { useState, useEffect, ReactNode } from "react";

export default function AuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("som-access");
    setAuthed(token === "granted");
  }, []);

  async function handleSubmit() {
    if (!code.trim() || checking) return;
    setChecking(true);
    setError(false);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      if (res.ok) {
        localStorage.setItem("som-access", "granted");
        setAuthed(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setChecking(false);
    }
  }

  // Loading state
  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated
  if (authed) return <>{children}</>;

  // Gate
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Stage on Mars
          </h1>
          <p className="text-white/30 text-sm">
            Enter your access code
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="Access code"
            autoFocus
            className={`w-full rounded-lg bg-white/5 border px-4 py-3 text-white text-center text-lg tracking-widest placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors ${
              error
                ? "border-red-500/50 focus:border-red-500"
                : "border-white/20 focus:border-orange-500"
            }`}
          />

          {error && (
            <p className="text-red-400/80 text-xs">Wrong code. Try again.</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!code.trim() || checking}
            className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            {checking ? "..." : "Enter"}
          </button>
        </div>

        <p className="text-white/10 text-xs">
          stageonmars.com
        </p>
      </div>
    </div>
  );
}
