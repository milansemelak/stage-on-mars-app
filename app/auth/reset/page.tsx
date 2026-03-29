"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const { t } = useI18n();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/auth/reset/confirm` }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t.authResetTitle}
          </h1>
          <p className="text-white/40 text-sm">
            {t.authResetDesc}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-mars/10 border border-mars/20 p-4">
              <p className="text-white/70 text-sm">{t.authResetSent}</p>
            </div>
            <Link
              href="/auth/login"
              className="text-white/30 hover:text-white/50 text-xs transition-colors inline-block"
            >
              {t.authLogin}
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleReset} className="space-y-4">
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

              {error && (
                <p className="text-red-400/80 text-xs">{error}</p>
              )}

              <button
                type="submit"
                disabled={!email.trim() || loading}
                className="w-full py-3 rounded-lg bg-mars hover:bg-mars-light disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.authResetSending}
                  </span>
                ) : (
                  t.authResetSend
                )}
              </button>
            </form>

            <Link
              href="/auth/login"
              className="text-white/25 hover:text-white/40 text-xs transition-colors inline-block"
            >
              {t.authLogin}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
