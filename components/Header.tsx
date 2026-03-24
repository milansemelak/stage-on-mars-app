"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang } = useI18n();

  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <Link href="/play" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Stage On Mars"
            width={200}
            height={50}
            className="h-10 sm:h-12 w-auto invert"
            priority
          />
        </Link>
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
