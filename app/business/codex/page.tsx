"use client";

import { useState } from "react";
import Link from "next/link";

const CONTENT = {
  en: {
    tag: "Codex of Mars",
    p1: "Stage on Mars is a place where people play with reality to create what\u2019s next. It is designed for intelligent, rational people who have reached the edge of what logic, analysis, and discussion can solve on their own and want to explore their situation in a different way.",
    p2: "At the core of Stage on Mars is Systemic Play, a method that turns questions into live plays. Using imagination, theatre, and systemic constellations, people step into roles, relationships, and tensions that shape a situation. What is usually hidden becomes visible. New perspectives emerge. And with them, new possibilities for what comes next.",
    p3: "Stage on Mars is not about escaping reality. It is about stepping into it differently. By playing it out, participants can see what matters, understand the dynamics at work, and discover paths forward that are difficult to reach through words alone.",
    p4: "Systemic Play is not therapy. It belongs to the world of creativity, imagination, and self-expression. Its purpose is not to heal, but to explore, reveal, and create. Because the experience is immersive and emotionally engaging, it can stir strong personal responses. For this reason, Stage on Mars is not recommended for individuals currently experiencing acute mental health challenges.",
    p5: "Each experience is guided by a Playmaker, who works with people, questions, and situations to shape the play. The Playmaker is supported by a Producer, who ensures the flow of the experience and enriches it through thoughtful audiovisual production.",
    p6: "The core values of Stage on Mars are freedom, responsibility, humor, humility, and truthfulness.",
  },
  cs: {
    tag: "Codex of Mars",
    p1: "Stage on Mars je m\u00edsto, kde si lid\u00e9 hraj\u00ed s realitou, aby mohli tvo\u0159it to, co p\u0159ijde d\u00e1l. Je ur\u010den\u00e9 pro inteligentn\u00ed a racion\u00e1ln\u00ed lidi, kte\u0159\u00ed u\u017e narazili na hranici toho, co lze vy\u0159e\u0161it samotnou logikou, anal\u00fdzou a debatou, a cht\u011bj\u00ed svou situaci prozkoumat jinak.",
    p2: "V j\u00e1dru Stage on Mars je Systemick\u00e1 hra, metoda, kter\u00e1 m\u011bn\u00ed ot\u00e1zky v \u017eiv\u00e9 hry. Pomoc\u00ed imaginace, divadla a systemick\u00fdch konstelac\u00ed lid\u00e9 vstupuj\u00ed do rol\u00ed, vztah\u016f a nap\u011bt\u00ed, kter\u00e1 utv\u00e1\u0159ej\u00ed danou situaci. To, co b\u00fdv\u00e1 skryt\u00e9, se st\u00e1v\u00e1 viditeln\u00fdm. Objevuj\u00ed se nov\u00e9 perspektivy. A s nimi i nov\u00e9 mo\u017enosti toho, co m\u016f\u017ee p\u0159ij\u00edt d\u00e1l.",
    p3: "Stage on Mars nen\u00ed \u00fat\u011bk od reality. Je to zp\u016fsob, jak do n\u00ed vstoupit jinak. T\u00edm, \u017ee ji rozehrajeme, mohou \u00fa\u010dastn\u00edci uvid\u011bt, na \u010dem z\u00e1le\u017e\u00ed, pochopit dynamiky, kter\u00e9 jsou ve h\u0159e, a objevit cesty vp\u0159ed, ke kter\u00fdm se samotn\u00fdmi slovy dost\u00e1v\u00e1 t\u011b\u017eko.",
    p4: "Systemick\u00e1 hra nen\u00ed terapie. Pat\u0159\u00ed do sv\u011bta kreativity, imaginace a sebevyj\u00e1d\u0159en\u00ed. Jej\u00edm c\u00edlem nen\u00ed l\u00e9\u010dit, ale zkoumat, odhalovat a tvo\u0159it. Proto\u017ee je z\u00e1\u017eitek pohlcuj\u00edc\u00ed a emo\u010dn\u011b siln\u00fd, m\u016f\u017ee otev\u00edrat i intenzivn\u00ed osobn\u00ed reakce. Z tohoto d\u016fvodu nen\u00ed Stage on Mars vhodn\u00e9 pro lidi, kte\u0159\u00ed pr\u00e1v\u011b proch\u00e1zej\u00ed akutn\u00edmi psychick\u00fdmi obt\u00ed\u017eemi.",
    p5: "Ka\u017edou zku\u0161enost\u00ed prov\u00e1z\u00ed Playmaker, kter\u00fd pracuje s lidmi, ot\u00e1zkami a situacemi a vytv\u00e1\u0159\u00ed samotnou hru. Podporuje ho Producer, kter\u00fd zaji\u0161\u0165uje plynul\u00fd pr\u016fb\u011bh a obohacuje cel\u00fd z\u00e1\u017eitek promy\u0161lenou audiovizu\u00e1ln\u00ed produkc\u00ed.",
    p6: "Hodnotami Stage on Mars jsou svoboda, odpov\u011bdnost, humor, pokora a pravdivost.",
  },
} as const;

type Lang = keyof typeof CONTENT;

const VALUES = {
  en: ["Freedom", "Responsibility", "Humor", "Humility", "Truthfulness"],
  cs: ["Svoboda", "Odpov\u011bdnost", "Humor", "Pokora", "Pravdivost"],
};

export default function CodexPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = CONTENT[lang];
  const v = VALUES[lang];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED]">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.04]">
        <Link href="/business">
          <img src="/logo.png" alt="Stage On Mars" className="h-7 sm:h-8 w-auto invert opacity-70 hover:opacity-100 transition-opacity" />
        </Link>
        <button
          onClick={() => setLang(lang === "en" ? "cs" : "en")}
          className="text-white/30 hover:text-white/60 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors"
        >
          {lang === "en" ? "CZ" : "EN"}
        </button>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-6 sm:pb-10 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-mars/[0.03] rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-bold mb-6">
            {t.tag}
          </p>

          <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-mars/40 to-transparent mx-auto" />
        </div>
      </section>

      {/* Body */}
      <section className="px-6 py-10 sm:py-16">
        <div className="max-w-[520px] mx-auto space-y-6">
          <p className="font-mercure text-white/60 text-[15px] sm:text-[17px] leading-[1.45]">
            {t.p1}
          </p>

          <p className="font-mercure text-white/60 text-[15px] sm:text-[17px] leading-[1.45]">
            {t.p2}
          </p>

          <p className="font-mercure text-white/60 text-[15px] sm:text-[17px] leading-[1.45]">
            {t.p3}
          </p>

          <p className="font-mercure text-white/60 text-[15px] sm:text-[17px] leading-[1.45]">
            {t.p4}
          </p>

          <p className="font-mercure text-white/60 text-[15px] sm:text-[17px] leading-[1.45]">
            {t.p5}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="max-w-[520px] mx-auto">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-8 sm:px-10 sm:py-10 text-center">
            <p className="font-mercure text-white/60 text-[15px] sm:text-[17px] leading-[1.45] mb-6">
              {t.p6}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5">
              {v.map((value, i) => (
                <span key={value} className="flex items-center gap-4 sm:gap-5">
                  <span className="text-mars/60 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em]">
                    {value}
                  </span>
                  {i < v.length - 1 && (
                    <span className="w-[3px] h-[3px] rounded-full bg-mars/20" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="pb-12 sm:pb-20 px-6">
        <div className="max-w-[520px] mx-auto text-center space-y-6">
          <div className="w-12 h-[1px] bg-white/[0.06] mx-auto" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/25 text-[13px]">
            <a href="mailto:play@stageonmars.com" className="hover:text-white/50 transition-colors">
              play@stageonmars.com
            </a>
            <span className="hidden sm:block text-white/10">|</span>
            <a href="tel:+420602336338" className="hover:text-white/50 transition-colors">
              +420 602 336 338
            </a>
          </div>
          <div className="pt-2">
            <Link href="/business" className="text-white/20 hover:text-white/50 text-[13px] transition-colors">
              Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
