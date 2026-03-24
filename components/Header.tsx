"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/play" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Stage On Mars"
              width={160}
              height={40}
              className="h-8 w-auto invert"
              priority
            />
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/play"
              className="text-xs font-medium text-white/50 hover:text-white transition-colors"
            >
              {t.headline}
            </Link>
            <Link
              href="/history"
              className="text-xs font-medium text-white/50 hover:text-white transition-colors"
            >
              {t.savedPlays}
            </Link>
          </nav>
        </div>
        <div className="flex gap-1">
          {(["en", "sk", "cs"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`text-xs font-medium transition-colors border rounded px-2 py-1 ${
                lang === l
                  ? "text-white border-orange-500 bg-orange-500/20"
                  : "text-white/50 border-white/20 hover:text-white"
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
