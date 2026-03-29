"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function SubscribePage() {
  const { user, loading: authLoading } = useAuth();
  const [supernovaCode, setSupernovaCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [checkingCode, setCheckingCode] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCodeField, setShowCodeField] = useState(false);
  const router = useRouter();

  // Redirect to signup (which now includes subscription) if not authenticated
  if (!authLoading && !user) {
    router.push("/auth/signup");
    return null;
  }

  async function handleSubscribe() {
    if (!user?.email) return;
    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();

      if (data.active) {
        // Already subscribed
        router.push("/play");
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Fail silently
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleSupernovaCode(e: React.FormEvent) {
    e.preventDefault();
    if (!supernovaCode.trim()) return;

    setCheckingCode(true);
    setCodeError("");

    try {
      const res = await fetch("/api/auth/supernova", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: supernovaCode.trim(), userId: user?.id }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/play");
      } else {
        setCodeError(data.error || "Invalid code.");
      }
    } catch {
      setCodeError("Something went wrong. Try again.");
    } finally {
      setCheckingCode(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-mars/30 border-t-mars rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Unlock The Playmaker
          </h1>
          <p className="text-white/40 text-sm">
            Unlimited plays, perspectives, and simulations.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSubscribe}
            disabled={checkoutLoading}
            className="w-full py-4 rounded-lg bg-mars hover:bg-mars-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors"
          >
            {checkoutLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </span>
            ) : (
              "Subscribe"
            )}
          </button>

          {/* Supernova code */}
          {!showCodeField ? (
            <button
              onClick={() => setShowCodeField(true)}
              className="text-white/20 hover:text-white/40 text-xs transition-colors"
            >
              Have a Supernova code?
            </button>
          ) : (
            <form onSubmit={handleSupernovaCode} className="space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={supernovaCode}
                  onChange={(e) => {
                    setSupernovaCode(e.target.value);
                    setCodeError("");
                  }}
                  placeholder="Enter Supernova code"
                  autoFocus
                  className="flex-1 rounded-lg bg-white/5 border border-white/20 px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-mars/50 focus:border-mars transition-colors"
                />
                <button
                  type="submit"
                  disabled={!supernovaCode.trim() || checkingCode}
                  className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                >
                  {checkingCode ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
              {codeError && (
                <p className="text-red-400/80 text-xs">{codeError}</p>
              )}
            </form>
          )}
        </div>

        <p className="text-white/15 text-xs">
          Logged in as {user?.email}
        </p>
      </div>
    </div>
  );
}
