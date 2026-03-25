"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, t } = useI18n();

  function handleLogoClick() {
    window.location.reload();
  }

  return (
    <header className="border-b border-white/[0.06]">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
        <button onClick={handleLogoClick} className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Stage On Mars"
            className="h-[60px] sm:h-[70px] w-auto invert"
          />
        </button>
        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="text-xs font-medium text-white/30 hover:text-white/70 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
          >
            {t.savedPlays}
          </Link>
          <div className="w-px h-4 bg-white/10" />
        <div className="flex gap-1">
          {(["en", "sk", "cs"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`text-xs font-medium transition-all rounded-lg px-2.5 py-1.5 ${
                lang === l
                  ? "text-white bg-white/10"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {l === "en" ? "EN" : l === "sk" ? "SK" : "CZ"}
            </button>
          ))}
        </div>
        </div>
      </div>
    </header>
  );
}
