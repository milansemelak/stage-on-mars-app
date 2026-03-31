"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const { user, signOut } = useAuth();
  const router = useRouter();

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
