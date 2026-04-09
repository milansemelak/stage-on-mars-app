import Link from "next/link";

export const metadata = {
  title: "Human on Mars — TV Show",
};

const STRUCTURE = [
  {
    phase: "01",
    title: "Otvorenie — Mesiac",
    time: "cca 5 min",
    question: "Čo pre teba znamená Mesiac?",
    goal: [
      "Otvoriť jeho jazyk, jeho spôsob uvažovania.",
      "Nevstupovať do faktov ani projektov.",
    ],
    note: "Rozhovor začína v jeho svete, nie v jeho práci.",
  },
  {
    phase: "02",
    title: "Prechod — Mars",
    time: "cca 5 min",
    question: "Prečo berieš Moonshot na Mars?",
    goal: [
      "Ukázať, prečo používa tento priestor, keď niečo rieši.",
      "Dostať ho z rozprávania o sebe do spôsobu, ako uvažuje.",
    ],
    note: "Prepojenie jeho sveta s priestorom, v ktorom sa nachádza.",
  },
  {
    phase: "03",
    title: "Kontext — Biznis",
    time: "cca 8–10 min",
    question: "Aká je najväčšia otázka, ktorú si musí biznis zodpovedať, aby sa posunul vpred?",
    goal: [
      "Dostať ho do premýšľania mimo seba.",
      "Vytvoriť prvú vrstvu abstrakcie.",
    ],
    note: "Rozšírenie do systému.",
  },
  {
    phase: "04",
    title: "Kontext — Ľudstvo",
    time: "cca 8–10 min",
    question: "Aká je najväčšia otázka, ktorú si musí ľudstvo zodpovedať, aby sa posunulo vpred?",
    goal: [
      "Otvoriť mierku.",
      "Dostať ho úplne mimo osobného rámca.",
    ],
    note: "Ešte širšia perspektíva.",
  },
  {
    phase: "05",
    title: "Zlom — Yemi",
    time: "cca 10–12 min",
    question: "A keď to zúžime len na teba — aká je tvoja otázka?",
    goal: [
      "Presun z abstrakcie do osobnej roviny.",
      "Moment, kde už nemôže hovoriť za systém.",
    ],
    note: "Návrat späť k nemu.",
    followUp: "To je dobré. Ale aká je tá tvoja?",
  },
  {
    phase: "06",
    title: "Záver — Uchopenie",
    time: "cca 3–5 min",
    question: "Čo si teraz povedal? Čo je pre teba teraz jasné?",
    goal: [
      "Nezhrnúť rozhovor.",
      "Zachytiť moment, ktorý vznikol.",
    ],
    note: "Krátke pomenovanie toho, čo sa stalo.",
  },
];

const PRINCIPLES = [
  "Neísť do minulosti",
  "Nenechať rozhovor skĺznuť do príbehov",
  "Držať tempo, ale neponáhľať",
  "Ticho je súčasť formátu",
  "Ak odpovede znejú príliš hladko, ešte to nie je ono",
  "Dôležitý je moment zlomu z \u201Ehovorím všeobecne\u201C do \u201Ehovorím za seba\u201C",
];

const CAMERA = [
  "Momenty ticha",
  "Váhanie a hľadanie slov",
  "Prechod z plynulého rozprávania do zastavenia",
  "Moment, keď sa rozhovor stane osobným",
];

export default function TVPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-center px-5 pt-8 pb-4">
        <Link href="/business">
          <img src="/logo.png" alt="Stage On Mars" className="h-8 sm:h-9 w-auto opacity-60 hover:opacity-100 transition-opacity" />
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-5 sm:px-6 pb-16">

        {/* ═══ HERO ═══ */}
        <div className="bg-black rounded-t-3xl overflow-hidden px-8 sm:px-12 pt-12 pb-10 text-center">
          <p className="text-mars/50 text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Stage on Mars Presents</p>
          <h1 className="text-[36px] sm:text-[52px] font-bold tracking-[-0.04em] leading-[1.05] mb-3">
            <span className="text-white">Human </span>
            <span className="font-mercure italic text-mars">on Mars</span>
          </h1>
          <p className="text-white/30 text-[13px] sm:text-[15px] uppercase tracking-[0.2em] font-bold">TV Show</p>
        </div>

        {/* ═══ TEAR ═══ */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
        </div>

        {/* ═══ EPISODE TITLE — orange band ═══ */}
        <div className="bg-mars px-8 sm:px-12 py-8 text-center">
          <p className="text-black/30 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Produkčný Brief</p>
          <h2 className="font-mercure italic text-black text-[28px] sm:text-[38px] leading-[1.15]">
            Yemi <span className="not-italic font-bold">on Mars</span>
          </h2>
        </div>

        {/* ═══ TEAR ═══ */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
        </div>

        {/* ═══ FORMAT INFO — black section ═══ */}
        <div className="bg-black px-8 sm:px-12 py-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-mars/50 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Formát</p>
              <p className="text-white text-[14px] font-semibold">Rozhovor na kruhovom javisku</p>
            </div>
            <div>
              <p className="text-mars/50 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Dĺžka</p>
              <p className="text-white text-[14px] font-semibold">cca 45 min</p>
            </div>
            <div>
              <p className="text-mars/50 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Účastníci</p>
              <p className="text-white text-[14px] font-semibold">Yemi A.D. + Playmaker</p>
            </div>
            <div>
              <p className="text-mars/50 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Cieľ</p>
              <p className="text-white text-[14px] font-semibold leading-snug">Zachytiť moment zlomu</p>
            </div>
          </div>

          <div className="border-t border-white/[0.08] mt-6 pt-5">
            <p className="text-white/60 text-[13px] leading-[1.6]">
              Zachytiť moment, kde sa rozhovor presunie z všeobecného uvažovania do osobnej, nepomenovanej otázky.
            </p>
          </div>
        </div>

        {/* ═══ TEAR ═══ */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
        </div>

        {/* ═══ PRIESTOR A ATMOSFÉRA — orange section ═══ */}
        <div className="bg-mars px-8 sm:px-12 py-8">
          <p className="text-black/30 text-[10px] uppercase tracking-[0.2em] font-bold mb-4 text-center">Priestor a Atmosféra</p>

          <div className="space-y-3 text-black text-[14px] leading-[1.6] text-center">
            <p>Scéna je čistá, minimálna. Kruhové javisko je centrálny prvok.</p>
            <p>Dvaja ľudia oproti sebe, bez stola a bez bariér.</p>
            <p className="text-black/60 text-[13px]">
              Rozhovor má pôsobiť sústredene, bez rušenia.<br />
              Dôležité sú pauzy, pohľady a zmena tempa.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-black/10">
            <p className="text-black/40 text-[9px] uppercase tracking-[0.2em] font-bold mb-3 text-center">Kamera sleduje</p>
            <div className="flex flex-wrap justify-center gap-2">
              {CAMERA.map((item, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-black/10 text-black text-[11px] font-semibold">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <p className="text-black/50 text-[12px] text-center mt-5 italic">
            Nejde o zaznamenanie odpovedí, ale situácie.
          </p>
        </div>

        {/* ═══ TEAR ═══ */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
        </div>

        {/* ═══ ŠTRUKTÚRA ROZHOVORU — black section ═══ */}
        <div className="bg-black px-8 sm:px-12 py-8">
          <p className="text-mars text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-center">Štruktúra Rozhovoru</p>

          <div className="space-y-0">
            {STRUCTURE.map((block, i) => (
              <div key={i} className={`py-5 ${i < STRUCTURE.length - 1 ? "border-b border-white/[0.06]" : ""}`}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-mars/30 text-[11px] font-mono font-bold">{block.phase}</span>
                  <h3 className="text-white text-[16px] sm:text-[18px] font-bold tracking-[-0.02em]">{block.title}</h3>
                  <span className="text-white/20 text-[11px] ml-auto shrink-0">{block.time}</span>
                </div>

                <p className="text-white/30 text-[12px] mb-3">{block.note}</p>

                <div className="bg-white/[0.04] rounded-xl px-4 py-3 mb-3">
                  <p className="text-mars/40 text-[9px] uppercase tracking-[0.15em] font-bold mb-1">Otázka</p>
                  <p className="font-mercure italic text-white text-[15px] sm:text-[17px] leading-[1.3]">
                    &ldquo;{block.question}&rdquo;
                  </p>
                </div>

                {block.followUp && (
                  <div className="bg-mars/10 rounded-xl px-4 py-3 mb-3 border border-mars/20">
                    <p className="text-mars/50 text-[9px] uppercase tracking-[0.15em] font-bold mb-1">Ak odpoveď ostáva všeobecná</p>
                    <p className="font-mercure italic text-mars text-[15px] leading-[1.3]">
                      &ldquo;{block.followUp}&rdquo;
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  {block.goal.map((g, j) => (
                    <p key={j} className="text-white/40 text-[12px] leading-[1.5] pl-3 border-l border-mars/20">
                      {g}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ TEAR ═══ */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
        </div>

        {/* ═══ PRINCÍPY — orange section ═══ */}
        <div className="bg-mars px-8 sm:px-12 py-8">
          <p className="text-black/30 text-[10px] uppercase tracking-[0.2em] font-bold mb-4 text-center">Kľúčové Princípy</p>
          <div className="space-y-2">
            {PRINCIPLES.map((p, i) => (
              <p key={i} className="text-black text-[13px] sm:text-[14px] leading-[1.5] text-center font-medium">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* ═══ TEAR ═══ */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10" />
        </div>

        {/* ═══ POINTA — black closing ═══ */}
        <div className="bg-black rounded-b-3xl overflow-hidden px-8 sm:px-12 py-10 text-center">
          <p className="text-mars/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Pointa</p>
          <p className="text-white/80 text-[14px] sm:text-[16px] leading-[1.6] mb-4">
            Rozhovor ide od sveta k človeku.<br />
            Od abstrakcie k osobnej otázke.
          </p>
          <p className="text-white text-[14px] sm:text-[16px] leading-[1.6] font-semibold">
            Kľúčový moment je, keď hosť prestane hovoriť za biznis alebo ľudstvo<br />
            a pomenuje svoju vlastnú otázku.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-6 pb-4 flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Stage on Mars" className="h-6 opacity-15" />
          <a href="mailto:play@stageonmars.com" className="text-neutral-300 text-[11px] hover:text-neutral-500 transition-colors">play@stageonmars.com</a>
        </div>
      </div>
    </div>
  );
}
