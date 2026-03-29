"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

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
  const [showCodeField, setShowCodeField] = useState(false);
  const router = useRouter();
  const supabase = createClient();

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
      }
    } catch {
      // Fail silently
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        {step === "signup" ? (
          <>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Unlock The Playmaker
              </h1>
              <p className="text-white/40 text-sm">
                Unlimited plays, perspectives, and simulations.
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
                placeholder="Email"
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
                placeholder="Password (min 6 characters)"
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
                  "Continue"
                )}
              </button>
            </form>

            <p className="text-white/25 text-xs">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-mars/70 hover:text-mars transition-colors">
                Log in
              </Link>
            </p>
          </>
        ) : (
          <>
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
              Signed up as {email}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
