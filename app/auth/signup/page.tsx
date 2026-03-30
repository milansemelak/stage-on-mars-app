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
  const [showCode, setShowCode] = useState(false);
  const [masterCode, setMasterCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const { t } = useI18n();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError("");
    setCodeError("");

    // Create account
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Auto sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Send welcome email (fire and forget)
    fetch("/api/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    }).catch(() => {});

    // If master player code entered, validate it
    if (showCode && masterCode.trim() && data.user?.id) {
      try {
        const res = await fetch("/api/auth/supernova", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: masterCode.trim(), userId: data.user.id }),
        });
        const result = await res.json();

        if (!result.success) {
          setCodeError(result.error || t.authCheckoutError);
          setLoading(false);
          // Account is created, just code failed — still go to play
          router.push("/play");
          return;
        }
      } catch {
        // Code validation failed but account was created — go to play
      }
    }

    // Go straight to play — trial starts now
    router.push("/play");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t.signupTitle}
          </h1>
          <p className="text-white/40 text-sm">
            {t.signupDesc}
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

          {/* Master Player Code — collapsible */}
          {showCode ? (
            <div className="space-y-2">
              <input
                type="text"
                value={masterCode}
                onChange={(e) => {
                  setMasterCode(e.target.value);
                  setCodeError("");
                }}
                placeholder={t.authSupernovaPlaceholder}
                className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-mars/50 focus:border-mars transition-colors"
              />
              {codeError && (
                <p className="text-red-400/80 text-xs">{codeError}</p>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCode(true)}
              className="text-white/25 hover:text-white/40 text-xs transition-colors"
            >
              {t.authSupernovaHave}
            </button>
          )}

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
      </div>
    </div>
  );
}
