"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useI18n();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message === "Invalid login credentials"
        ? t.authWrongCredentials
        : signInError.message
      );
      setLoading(false);
      return;
    }

    router.push("/play");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t.authWelcomeBack}
          </h1>
          <p className="text-white/40 text-sm">
            Stage on Mars
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder={t.authPassword}
            required
            className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-mars/50 focus:border-mars transition-colors"
          />

          {error && (
            <p className="text-red-400/80 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={!email.trim() || !password.trim() || loading}
            className="w-full py-3 rounded-lg bg-mars hover:bg-mars-light disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t.authLoggingIn}
              </span>
            ) : (
              t.authLogin
            )}
          </button>
        </form>

        <div className="space-y-2">
          <Link href="/auth/reset" className="text-white/20 hover:text-white/40 text-xs transition-colors block">
            {t.authForgotPassword}
          </Link>
          <p className="text-white/25 text-xs">
            {t.authNoAccount}{" "}
            <Link href="/auth/signup" className="text-mars/70 hover:text-mars transition-colors">
              {t.authCreateOne}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
