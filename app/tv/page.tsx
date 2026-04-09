import Link from "next/link";

export const metadata = {
  title: "Human on Mars — TV Show",
};

const STRUCTURE = [
  {
    phase: "01",
    title: "Otvorenie \u2014 Mesiac",
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
    title: "Prechod \u2014 Mars",
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
    title: "Kontext \u2014 Biznis",
    time: "cca 8\u201310 min",
    question: "Aká je najväčšia otázka, ktorú si musí biznis zodpovedať, aby sa posunul vpred?",
    goal: [
      "Dostať ho do premýšľania mimo seba.",
      "Vytvoriť prvú vrstvu abstrakcie.",
    ],
    note: "Rozšírenie do systému.",
  },
  {
    phase: "04",
    title: "Kontext \u2014 Ľudstvo",
    time: "cca 8\u201310 min",
    question: "Aká je najväčšia otázka, ktorú si musí ľudstvo zodpovedať, aby sa posunulo vpred?",
    goal: [
      "Otvoriť mierku.",
      "Dostať ho úplne mimo osobného rámca.",
    ],
    note: "Ešte širšia perspektíva.",
  },
  {
    phase: "05",
    title: "Zlom \u2014 Yemi",
    time: "cca 10\u201312 min",
    question: "A keď to zúžime len na teba \u2014 aká je tvoja otázka?",
    goal: [
      "Presun z abstrakcie do osobnej roviny.",
      "Moment, kde už nemôže hovoriť za systém.",
    ],
    note: "Návrat späť k nemu.",
    followUp: "To je dobré. Ale aká je tá tvoja?",
  },
  {
    phase: "06",
    title: "Záver \u2014 Uchopenie",
    time: "cca 3\u20135 min",
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
    <div className="min-h-screen bg-neutral-50 text-black">
      {/* Header bar */}
      <nav className="border-b border-neutral-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between">
          <Link href="/business">
            <img src="/logo.png" alt="Stage On Mars" className="h-7 w-auto opacity-50 hover:opacity-100 transition-opacity" />
          </Link>
          <span className="text-neutral-300 text-[10px] uppercase tracking-[0.3em] font-bold">Confidential</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12 sm:py-16">

        {/* ─── TITLE BLOCK ─── */}
        <div className="mb-12 sm:mb-16">
          <p className="text-mars text-[11px] uppercase tracking-[0.3em] font-bold mb-3">Stage on Mars Presents</p>
          <h1 className="text-[40px] sm:text-[56px] font-bold tracking-[-0.04em] leading-[1.05] mb-2">
            Human <span className="font-mercure italic text-mars">on Mars</span>
          </h1>
          <p className="text-neutral-400 text-[15px] uppercase tracking-[0.15em] font-semibold mb-8">TV Show</p>

          <div className="h-px bg-neutral-200 mb-8" />

          <div className="flex items-baseline gap-3">
            <p className="text-neutral-400 text-[11px] uppercase tracking-[0.2em] font-bold">Produkčný Brief</p>
            <div className="h-px bg-neutral-200 flex-1" />
          </div>
          <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.03em] mt-2">
            Yemi A.D. <span className="font-mercure italic text-mars">on Mars</span>
          </h2>
        </div>

        {/* ─── FORMAT GRID ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 sm:mb-16 pb-12 sm:pb-16 border-b border-neutral-200">
          <div>
            <p className="text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Formát</p>
            <p className="text-[14px] font-semibold leading-snug">Rozhovor na kruhovom javisku Stage on Mars</p>
          </div>
          <div>
            <p className="text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Dĺžka</p>
            <p className="text-[14px] font-semibold">cca 45 min</p>
          </div>
          <div>
            <p className="text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Účastníci</p>
            <p className="text-[14px] font-semibold">Yemi A.D. a moderátor (Playmaker)</p>
          </div>
          <div>
            <p className="text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Cieľ</p>
            <p className="text-[14px] font-semibold leading-snug">Zachytiť moment, kde sa rozhovor presunie z&nbsp;všeobecného uvažovania do osobnej, nepomenovanej otázky</p>
          </div>
        </div>

        {/* ─── PRIESTOR A ATMOSFÉRA ─── */}
        <div className="mb-12 sm:mb-16 pb-12 sm:pb-16 border-b border-neutral-200">
          <div className="flex items-baseline gap-3 mb-6">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-mars">Priestor a Atmosféra</h3>
            <div className="h-px bg-neutral-200 flex-1" />
          </div>

          <div className="space-y-4 text-[15px] leading-[1.7] text-neutral-700 max-w-xl">
            <p>Scéna je čistá, minimálna. Kruhové javisko je centrálny prvok. Dvaja ľudia oproti sebe, bez stola a bez bariér.</p>
            <p>Rozhovor má pôsobiť sústredene, bez rušenia. Dôležité sú pauzy, pohľady a zmena tempa.</p>
          </div>

          <div className="mt-8">
            <p className="text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold mb-3">Kamera sleduje</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CAMERA.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-mars text-[10px] mt-1.5">&#9679;</span>
                  <p className="text-[14px] text-neutral-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-[14px] text-neutral-900 font-semibold italic">
            Nejde o zaznamenanie odpovedí, ale situácie.
          </p>
        </div>

        {/* ─── ŠTRUKTÚRA ROZHOVORU ─── */}
        <div className="mb-12 sm:mb-16 pb-12 sm:pb-16 border-b border-neutral-200">
          <div className="flex items-baseline gap-3 mb-8">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-mars">Štruktúra Rozhovoru</h3>
            <div className="h-px bg-neutral-200 flex-1" />
          </div>

          <p className="text-[15px] text-neutral-500 mb-8">Rozhovor má jasnú gradáciu. Začína širšie a postupne sa zužuje.</p>

          <div className="space-y-0">
            {STRUCTURE.map((block, i) => (
              <div key={i} className={`py-6 ${i < STRUCTURE.length - 1 ? "border-b border-neutral-100" : ""}`}>
                {/* Phase header */}
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-mars text-[12px] font-mono font-bold">{block.phase}</span>
                  <h4 className="text-[18px] sm:text-[20px] font-bold tracking-[-0.02em]">{block.title}</h4>
                  <span className="text-neutral-300 text-[12px] ml-auto shrink-0">{block.time}</span>
                </div>

                <p className="text-neutral-400 text-[13px] mb-4 pl-8">{block.note}</p>

                {/* Question */}
                <div className="pl-8 mb-4">
                  <p className="text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Otázka</p>
                  <p className="text-[17px] sm:text-[19px] font-mercure italic leading-[1.35] text-black">
                    {block.question}
                  </p>
                </div>

                {/* Follow-up */}
                {block.followUp && (
                  <div className="pl-8 mb-4 ml-4 border-l-2 border-mars/30 pl-4">
                    <p className="text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Ak odpoveď ostáva všeobecná</p>
                    <p className="text-[16px] font-mercure italic text-mars leading-[1.35]">
                      {block.followUp}
                    </p>
                  </div>
                )}

                {/* Goals */}
                <div className="pl-8 space-y-1">
                  <p className="text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Cieľ</p>
                  {block.goal.map((g, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-neutral-300 text-[8px] mt-1.5">&#9679;</span>
                      <p className="text-[13px] text-neutral-500 leading-[1.5]">{g}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── KĽÚČOVÉ PRINCÍPY ─── */}
        <div className="mb-12 sm:mb-16 pb-12 sm:pb-16 border-b border-neutral-200">
          <div className="flex items-baseline gap-3 mb-6">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-mars">Kľúčové Princípy</h3>
            <div className="h-px bg-neutral-200 flex-1" />
          </div>

          <div className="space-y-2">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-mars text-[10px] mt-1.5">&#9679;</span>
                <p className="text-[15px] text-neutral-700 leading-[1.6]">{p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── POINTA ─── */}
        <div className="mb-16">
          <div className="flex items-baseline gap-3 mb-6">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-mars">Pointa</h3>
            <div className="h-px bg-neutral-200 flex-1" />
          </div>

          <div className="max-w-xl">
            <p className="text-[16px] sm:text-[18px] text-neutral-500 leading-[1.6] mb-4">
              Rozhovor ide od sveta k človeku.<br />
              Od abstrakcie k osobnej otázke.
            </p>
            <p className="text-[16px] sm:text-[18px] text-black leading-[1.6] font-semibold">
              Kľúčový moment je, keď hosť prestane hovoriť za biznis alebo ľudstvo a&nbsp;pomenuje svoju vlastnú otázku.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 pt-6 pb-4 flex items-center justify-between">
          <img src="/logo.png" alt="Stage on Mars" className="h-5 opacity-20" />
          <a href="mailto:play@stageonmars.com" className="text-neutral-300 text-[11px] hover:text-neutral-500 transition-colors">play@stageonmars.com</a>
        </div>
      </div>
    </div>
  );
}
