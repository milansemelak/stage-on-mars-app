"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"signup" | "unlock">("signup");
  const [userId, setUserId] = useState<string | null>(null);
  const [supernovaCode, setSupernovaCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [checkingCode, setCheckingCode] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useI18n();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError("");

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Auto sign in after signup
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    setUserId(data.user?.id || null);
    setStep("unlock");
    setLoading(false);

    // Send welcome email (fire and forget)
    fetch("/api/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    }).catch(() => {});
  }

  async function handleSubscribe() {
    if (!email.trim()) return;
    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
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
    if (!supernovaCode.trim() || !userId) return;

    setCheckingCode(true);
    setCodeError("");

    try {
      const res = await fetch("/api/auth/supernova", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: supernovaCode.trim(), userId }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/play?subscribed=true");
      } else {
        setCodeError(data.error || t.authCheckoutError);
      }
    } catch {
      setCodeError(t.authCheckoutError);
    } finally {
      setCheckingCode(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        {step === "signup" ? (
          <>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {t.unlockPlaymaker}
              </h1>
              <p className="text-white/40 text-sm">
                {t.unlockDesc}
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder={t.authEmail}
                autoFocus
                required
                className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-mars/50 focus:border-mars transition-colors"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder={t.authPasswordMin}
                required
                minLength={6}
                className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-mars/50 focus:border-mars transition-colors"
              />

              {error && (
                <p className="text-red-400/80 text-xs">{error}</p>
              )}

              <button
                type="submit"
                disabled={!email.trim() || !password.trim() || loading}
                className="w-full py-4 rounded-lg bg-mars hover:bg-mars-light disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </span>
                ) : (
                  t.authContinue
                )}
              </button>
            </form>

            <p className="text-white/25 text-xs">
              {t.alreadyHaveAccount.split("?")[0]}?{" "}
              <Link href="/auth/login" className="text-mars/70 hover:text-mars transition-colors">
                {t.authLogin}
              </Link>
            </p>
          </>
        ) : (
          <>
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
              {t.authSignedUpAs} {email}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
