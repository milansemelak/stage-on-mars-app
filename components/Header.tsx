"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { TRIAL_DAYS } from "@/lib/constants";

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);

  // Check subscription status + trial days
  useEffect(() => {
    if (!user) return;

    // Check Stripe subscription
    fetch("/api/stripe/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.active) {
          setIsSubscribed(true);
          return;
        }

        // Check profile (master player code)
        import("@/lib/supabase").then(({ createClient }) => {
          const sb = createClient();
          if (sb) {
            sb.from("profiles")
              .select("is_subscribed")
              .eq("id", user.id)
              .single()
              .then(({ data: profile }: { data: { is_subscribed?: boolean } | null }) => {
                if (profile?.is_subscribed) {
                  setIsSubscribed(true);
                  return;
                }
                // Calculate trial days
                const created = new Date(user.created_at || Date.now());
                const days = Math.ceil(TRIAL_DAYS - (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
                setTrialDaysLeft(Math.max(0, days));
              });
          }
        });
      })
      .catch(() => {
        // Fallback: just show trial days
        const created = new Date(user.created_at || Date.now());
        const days = Math.ceil(TRIAL_DAYS - (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
        setTrialDaysLeft(Math.max(0, days));
      });
  }, [user]);

  const showSubscribe = user && !isSubscribed && trialDaysLeft !== null;

  return (
    <header>
      <div className="mx-auto max-w-5xl flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
        <button onClick={() => router.push("/")} className="flex-shrink-0 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Stage On Mars"
            className="h-12 sm:h-[70px] w-auto object-contain invert"
          />
        </button>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Subscribe CTA for trial users */}
              {showSubscribe && (
                <Link
                  href="/auth/subscribe"
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    trialDaysLeft <= 7
                      ? "bg-mars/20 text-mars border border-mars/30 hover:bg-mars/30"
                      : "text-mars/60 hover:text-mars border border-mars/15 hover:border-mars/30"
                  }`}
                >
                  {trialDaysLeft > 0
                    ? `${trialDaysLeft}d · ${t.authSubscribe}`
                    : t.authSubscribe}
                </Link>
              )}
              <span className="text-white/20 text-xs hidden sm:inline truncate max-w-[120px]">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-xs font-medium text-white/30 hover:text-white/70 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5 whitespace-nowrap"
              >
                {t.authLogout}
              </button>
              <div className="w-px h-4 bg-white/10" />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-xs font-medium text-white/30 hover:text-white/70 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5 whitespace-nowrap"
              >
                {t.authLogin}
              </Link>
              <div className="w-px h-4 bg-white/10" />
            </>
          )}
          <Link
            href="/history"
            className="text-xs font-medium text-white/30 hover:text-white/70 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5 whitespace-nowrap"
          >
            {t.savedPlays}
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <button
            onClick={() => {
              const order = ["en", "sk", "cs"] as const;
              const next = order[(order.indexOf(lang) + 1) % order.length];
              setLang(next);
            }}
            className="text-xs font-medium text-white bg-white/10 rounded-lg px-2.5 py-1.5 hover:bg-white/15 transition-colors"
          >
            {lang === "en" ? "EN" : lang === "sk" ? "SK" : "CZ"}
          </button>
        </div>
      </div>
    </header>
  );
}
