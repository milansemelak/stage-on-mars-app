"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";

export default function SubscribePage() {
  const { user, loading: authLoading } = useAuth();
  const [supernovaCode, setSupernovaCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [checkingCode, setCheckingCode] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { t } = useI18n();

  // Redirect to signup (which now includes subscription) if not authenticated
  if (!authLoading && !user) {
    router.push("/auth/signup");
    return null;
  }

  async function handleSubscribe() {
    if (!user?.email) return;
    setCheckoutLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();

      if (data.active) {
        router.push("/play");
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        setError(t.authCheckoutError);
      }
    } catch {
      setError(t.authCheckoutError);
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
        setCodeError(data.error || t.authCheckoutError);
      }
    } catch {
      setCodeError(t.authCheckoutError);
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
            {t.unlockPlaymaker}
          </h1>
          <p className="text-white/40 text-sm">
            {t.unlockDesc}
          </p>
        </div>

        <div className="space-y-5">
          {/* Supernova code — primary */}
          <form onSubmit={handleSupernovaCode} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={supernovaCode}
                onChange={(e) => {
                  setSupernovaCode(e.target.value);
                  setCodeError("");
                }}
                placeholder={t.authSupernovaPlaceholder}
                className="flex-1 rounded-lg bg-white/5 border border-white/20 px-4 py-3.5 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-mars/50 focus:border-mars transition-colors"
              />
              <button
                type="submit"
                disabled={!supernovaCode.trim() || checkingCode}
                className="px-5 py-3.5 rounded-lg bg-mars hover:bg-mars-light disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold transition-colors"
              >
                {checkingCode ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                ) : (
                  t.authUnlock
                )}
              </button>
            </div>
            {codeError && (
              <p className="text-red-400/80 text-xs">{codeError}</p>
            )}
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-xs">{t.authOr}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Subscribe — secondary */}
          <button
            onClick={handleSubscribe}
            disabled={checkoutLoading}
            className="w-full py-3.5 rounded-lg bg-white/[0.06] border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white/70 font-medium transition-colors"
          >
            {checkoutLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </span>
            ) : (
              t.authSubscribe
            )}
          </button>

          {error && (
            <p className="text-red-400/80 text-xs">{error}</p>
          )}
        </div>

        <p className="text-white/15 text-xs">
          {t.authLoggedInAs} {user?.email}
        </p>
      </div>
    </div>
  );
}
