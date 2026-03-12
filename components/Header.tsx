"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Stage On Mars"
            width={200}
            height={50}
            className="h-[60px] md:h-[120px] w-auto invert"
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "en" ? "sk" : "en")}
            className="text-xs font-medium text-white/50 hover:text-white transition-colors border border-white/20 rounded px-2 py-1"
          >
            {lang === "en" ? "SK" : "EN"}
          </button>
          <a
            href="https://www.stageonmars.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {t.humanFutureSimulator}
          </a>
        </div>
      </div>
    </header>
  );
}
