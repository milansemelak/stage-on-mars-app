"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-8">
        {/* Mars circle */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mx-auto shadow-lg shadow-orange-500/20" />

        <h1 className="text-5xl font-bold tracking-tight">
          {t.landingHeadline1} <span className="text-orange-500">&times;</span>{" "}
          {t.landingHeadline2}{" "}
          <span className="text-orange-500">=</span> {t.landingHeadline3}
        </h1>

        <p className="text-lg text-white/50 max-w-lg mx-auto leading-relaxed">
          {t.landingDesc}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/play"
            className="px-8 py-3 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold transition-colors"
          >
            {t.generateAPlay}
          </Link>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/10">
          <div className="text-left">
            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2">
              {t.ask}
            </h3>
            <p className="text-xs text-white/40 leading-relaxed">{t.askDesc}</p>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2">
              {t.play}
            </h3>
            <p className="text-xs text-white/40 leading-relaxed">{t.playDesc}</p>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2">
              {t.see}
            </h3>
            <p className="text-xs text-white/40 leading-relaxed">{t.seeDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
