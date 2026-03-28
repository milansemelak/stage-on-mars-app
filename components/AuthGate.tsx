"use client";

import { useState, useEffect, ReactNode } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

export default function AuthGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "gate" | "authed">("loading");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Check URL params for returning from Stripe
    const params = new URLSearchParams(window.location.search);
    const subscribedEmail = params.get("email");
    if (params.get("subscribed") === "true" && subscribedEmail) {
      localStorage.setItem(STORAGE_KEYS.email, subscribedEmail);
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
      setStatus("authed");
      return;
    }

    // Check saved email
    const savedEmail = localStorage.getItem(STORAGE_KEYS.email);
    if (savedEmail) {
      verifyEmail(savedEmail, true);
    } else {
      setStatus("gate");
    }
  }, []);

  async function verifyEmail(emailToCheck: string, silent = false) {
    if (!silent) setChecking(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToCheck }),
      });
      const data = await res.json();

      if (data.active) {
        localStorage.setItem(STORAGE_KEYS.email, emailToCheck);
        setStatus("authed");
      } else {
        if (silent) {
          // Saved email no longer active — show gate
          localStorage.removeItem(STORAGE_KEYS.email);
          setStatus("gate");
        } else {
          // Redirect to Stripe Checkout
          const checkoutRes = await fetch("/api/stripe/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailToCheck }),
          });
          const checkoutData = await checkoutRes.json();

          if (checkoutData.active) {
            // Already subscribed
            localStorage.setItem(STORAGE_KEYS.email, emailToCheck);
            setStatus("authed");
          } else if (checkoutData.url) {
            window.location.href = checkoutData.url;
          } else {
            setError("Something went wrong. Try again.");
          }
        }
      }
    } catch {
      if (silent) {
        setStatus("gate");
      } else {
        setError("Connection error. Try again.");
      }
    } finally {
      setChecking(false);
    }
  }

  function handleSubmit() {
    const trimmed = email.trim();
    if (!trimmed) return;
    verifyEmail(trimmed);
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-mars/30 border-t-mars rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "authed") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            The Playmaker
          </h1>
          <p className="text-white/40 text-sm">
            by Stage on Mars
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="Your email"
            autoFocus
            className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white text-center placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-mars/50 focus:border-mars transition-colors"
          />

          {error && (
            <p className="text-red-400/80 text-xs">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!email.trim() || checking}
            className="w-full py-3 rounded-lg bg-mars hover:bg-mars-light disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            {checking ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Checking...
              </span>
            ) : (
              "Continue"
            )}
          </button>

          <p className="text-white/15 text-xs leading-relaxed">
            Enter your email to access The Playmaker.
            <br />
            New here? You&apos;ll be redirected to subscribe.
          </p>
        </div>
      </div>
    </div>
  );
}
