"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export default function ResetConfirmPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useI18n();

  // Supabase puts the token in the URL hash — we need to let it process
  useEffect(() => {
    // Give Supabase a moment to pick up the hash token and establish session
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/play"), 2000);
  }

  if (!ready) {
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
            {t.authResetTitle}
          </h1>
        </div>

        {success ? (
          <div className="rounded-lg bg-mars/10 border border-mars/20 p-4">
            <p className="text-white/70 text-sm">{t.authResetSuccess}</p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder={t.authNewPasswordMin}
              autoFocus
              required
              minLength={6}
              className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-mars/50 focus:border-mars transition-colors"
            />

            {error && (
              <p className="text-red-400/80 text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={!password.trim() || loading}
              className="w-full py-3 rounded-lg bg-mars hover:bg-mars-light disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.authResetSaving}
                </span>
              ) : (
                t.authResetSave
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
