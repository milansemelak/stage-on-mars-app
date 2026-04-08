"use client";

import { useState } from "react";
import Link from "next/link";

const CONTENT = {
  en: {
    tag: "Codex of Mars",
    p1: "Stage on Mars is an Experiential Search Platform, a place where people step beyond the limits of intellect and words to search for new ways forward. It is designed for rational, intelligent individuals who have already reached the edge of what can be solved by logic alone and who now seek new perspectives, connections, and possibilities.",
    p2: "At the heart of the platform is Systemic Play, a way to play out any system using imagination, theatre, and systemic constellations. Through this immersive exploration, participants uncover hidden dynamics and collectively enrich their perspectives.",
    p3: "Systemic Play is not a form of therapy. It belongs in the realm of creativity, imagination, and self-expression. The purpose is not to heal, but to explore, expand perspective, and spark new possibilities. Because the experience is immersive and emotionally engaging, it may stir strong personal responses. For this reason, Stage on Mars is not recommended for individuals currently experiencing acute mental health challenges.",
    p4: "Each experience is guided by a Playmaker, a facilitator who works with people, questions, and ideas to create the systemic play. The Playmaker is supported by a Producer, who ensures smooth flow and enriches the journey with thoughtful audiovisual production.",
    p5: "The core values of Stage on Mars are freedom, responsibility, humor, humility, and truthfulness.",
  },
  cs: {
    tag: "Codex of Mars",
    p1: "Stage on Mars je platforma pro zážitkové hledání. Je to prostor, kde lidé mohou překročit hranice intelektu a slov a vydat se hledat nové cesty vpřed. Je pro všechny, kdo už zjistili, že samotná logika nestačí, a chtějí objevovat nové perspektivy, spojení a možnosti.",
    p2: "Metoda Systemické hry umožňuje rozehrát jakýkoli systém pomocí imaginace, divadla a systemických konstelací. V tomto pohlcujícím prostředí účastníci odkrývají skryté dynamiky a společně obohacují své pohledy.",
    p3: "Systemická hra není terapie. Je to prostor pro kreativitu, imaginaci a sebevyjádření. Přináší však intenzivní a silné prožitky, a proto není vhodná pro lidi, kteří právě čelí vážnějším psychickým obtížím.",
    p4: "Každou zkušenost vede Playmaker, průvodce, který pracuje s lidmi, otázkami a nápady a vytváří samotnou hru. Podporuje ho Producer, který zajišťuje hladký průběh a obohacuje cestu pečlivě připravenou audiovizuální produkcí.",
    p5: "Hodnotami Stage on Mars jsou svoboda, odpovědnost, humor, pokora a pravdivost.",
  },
} as const;

type Lang = keyof typeof CONTENT;

const VALUES = {
  en: ["Freedom", "Responsibility", "Humor", "Humility", "Truthfulness"],
  cs: ["Svoboda", "Odpovědnost", "Humor", "Pokora", "Pravdivost"],
};

export default function CodexPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = CONTENT[lang];
  const v = VALUES[lang];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="relative pt-24 sm:pt-36 pb-16 sm:pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-mars/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Lang toggle */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {(["en", "cs"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg transition-all ${
                  lang === l
                    ? "bg-mars/15 text-mars border border-mars/25"
                    : "text-white/25 hover:text-white/50 border border-transparent"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <p className="text-mars/60 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
            {t.tag}
          </p>

          <div className="w-8 h-[1px] bg-mars/30 mx-auto mb-12" />
        </div>
      </section>

      {/* Body */}
      <section className="px-6 pb-24 sm:pb-36">
        <div className="max-w-xl mx-auto space-y-10">
          <p className="font-mercure text-white/70 text-[15px] sm:text-[17px] leading-[1.8]">
            {t.p1}
          </p>

          <div className="w-6 h-[1px] bg-white/10 mx-auto" />

          <p className="font-mercure text-white/70 text-[15px] sm:text-[17px] leading-[1.8]">
            {t.p2}
          </p>

          <div className="w-6 h-[1px] bg-white/10 mx-auto" />

          <p className="font-mercure text-white/60 text-[14px] sm:text-[15px] leading-[1.8]">
            {t.p3}
          </p>

          <div className="w-6 h-[1px] bg-white/10 mx-auto" />

          <p className="font-mercure text-white/70 text-[15px] sm:text-[17px] leading-[1.8]">
            {t.p4}
          </p>

          {/* Values */}
          <div className="pt-8">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 sm:p-10 text-center">
              <p className="font-mercure text-white/70 text-[15px] sm:text-[17px] leading-[1.8] mb-8">
                {t.p5}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {v.map((value, i) => (
                  <span key={value} className="flex items-center gap-3 sm:gap-4">
                    <span className="text-mars/80 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em]">
                      {value}
                    </span>
                    {i < v.length - 1 && (
                      <span className="w-1 h-1 rounded-full bg-mars/30" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer nav */}
      <section className="pb-16 sm:pb-24 px-6">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="w-12 h-[1px] bg-white/[0.06] mx-auto" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[#EDEDED]/40 text-sm">
            <a href="mailto:play@stageonmars.com" className="hover:text-white transition-colors">
              play@stageonmars.com
            </a>
            <span className="hidden sm:block">|</span>
            <a href="tel:+420602336338" className="hover:text-white transition-colors">
              +420 602 336 338
            </a>
          </div>
          <div className="pt-6">
            <Link href="/business" className="text-white/30 hover:text-white/70 text-sm transition-colors">
              &larr; Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
