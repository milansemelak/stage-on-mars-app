"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang } = useI18n();

  return (
    <header className="border-b border-white/[0.06]">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
        <Link href="/play" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Stage On Mars"
            width={200}
            height={50}
            className="h-8 sm:h-10 w-auto invert"
            priority
          />
        </Link>
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
