"use client";

import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang } = useI18n();

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
    </header>
  );
}
