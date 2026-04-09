import Link from "next/link";

export const metadata = {
  title: "Human on Mars \u2014 Talks from Outer Space",
};

const STRUCTURE = [
  {
    phase: "01",
    title: "Otvorenie \u2014 Mesiac",
    time: "5 min",
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
    time: "5 min",
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
    time: "8\u201310 min",
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
    time: "8\u201310 min",
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
    time: "10\u201312 min",
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
    time: "3\u20135 min",
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
      {/* Header */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-5 sm:px-10 py-4 flex items-center justify-between">
          <Link href="/business">
            <img src="/logo.png" alt="Stage On Mars" className="h-6 sm:h-7 w-auto opacity-50 hover:opacity-100 transition-opacity" />
          </Link>
          <span className="text-neutral-300 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold">Confidential</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 sm:px-10 py-8 sm:py-12">

        {/* TITLE */}
        <div className="mb-6 sm:mb-8">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-2">Stage on Mars Presents</p>
          <h1 className="text-[32px] sm:text-[48px] font-bold tracking-[-0.04em] leading-[1.05] mb-1">
            Human <span className="font-mercure italic text-mars">on Mars</span>
          </h1>
          <p className="text-neutral-400 text-[12px] sm:text-[13px] uppercase tracking-[0.15em] font-semibold">Talks from Outer Space</p>
        </div>

        {/* EPISODE */}
        <div className="mb-6">
          <p className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Produkčný Brief</p>
          <h2 className="text-[22px] sm:text-[30px] font-bold tracking-[-0.03em]">
            Yemi A.D. <span className="font-mercure italic text-mars">on Mars</span>
          </h2>
        </div>

        {/* FORMAT */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-neutral-400 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold mb-0.5">Formát</p>
            <p className="text-[12px] sm:text-[13px] font-semibold leading-snug">Rozhovor na kruhovom javisku</p>
          </div>
          <div>
            <p className="text-neutral-400 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold mb-0.5">Dĺžka</p>
            <p className="text-[12px] sm:text-[13px] font-semibold">cca 45 min</p>
          </div>
          <div>
            <p className="text-neutral-400 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold mb-0.5">Účastníci</p>
            <p className="text-[12px] sm:text-[13px] font-semibold">Yemi A.D. a Milan Šemelák</p>
          </div>
          <div>
            <p className="text-neutral-400 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold mb-0.5">Cieľ</p>
            <p className="text-[12px] sm:text-[13px] font-semibold leading-snug">Zachytiť moment zlomu</p>
          </div>
        </div>

        <p className="text-[14px] leading-[1.6] text-neutral-600 mb-8 sm:mb-10">
          Zachytiť moment, kde sa rozhovor presunie z&nbsp;všeobecného uvažovania do osobnej, nepomenovanej otázky.
        </p>

        {/* PRIESTOR A ATMOSFÉRA */}
        <div className="mb-8 sm:mb-10">
          <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-mars mb-3">Priestor a Atmosféra</h3>

          <p className="text-[13px] sm:text-[14px] leading-[1.7] text-neutral-700 mb-4">
            Scéna je čistá, minimálna. Kruhové javisko je centrálny prvok. Dvaja ľudia oproti sebe, bez stola a&nbsp;bez bariér. Rozhovor má pôsobiť sústredene, bez rušenia. Dôležité sú pauzy, pohľady a zmena tempa.
          </p>

          <p className="text-neutral-400 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold mb-2">Kamera sleduje</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 mb-3">
            {CAMERA.map((item, i) => (
              <p key={i} className="text-[12px] sm:text-[13px] text-neutral-600 before:content-['·'] before:text-mars before:font-bold before:mr-1.5">{item}</p>
            ))}
          </div>

          <p className="text-[13px] text-neutral-900 font-semibold italic">
            Nejde o zaznamenanie odpovedí, ale situácie.
          </p>
        </div>

        {/* ŠTRUKTÚRA ROZHOVORU */}
        <div className="mb-8 sm:mb-10">
          <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-mars mb-1">Štruktúra Rozhovoru</h3>
          <p className="text-[12px] sm:text-[13px] text-neutral-400 mb-5">Rozhovor má jasnú gradáciu. Začína širšie a postupne sa zužuje.</p>

          <div className="space-y-0">
            {STRUCTURE.map((block, i) => (
              <div key={i} className={`py-4 ${i < STRUCTURE.length - 1 ? "border-b border-neutral-100" : ""}`}>
                {/* Phase header */}
                <div className="flex items-baseline gap-2 sm:gap-2.5 mb-0.5">
                  <span className="text-mars text-[11px] font-mono font-bold shrink-0">{block.phase}</span>
                  <h4 className="text-[15px] sm:text-[17px] font-bold tracking-[-0.02em]">{block.title}</h4>
                  <span className="text-neutral-300 text-[11px] ml-auto shrink-0">{block.time}</span>
                </div>

                <p className="text-neutral-400 text-[11px] sm:text-[12px] mb-2.5 ml-6 sm:ml-7">{block.note}</p>

                {/* Question */}
                <div className="ml-6 sm:ml-7 mb-2.5 border-l-2 border-mars pl-3 sm:pl-4 py-1.5 bg-neutral-100/60 rounded-r-lg">
                  <p className="text-[15px] sm:text-[17px] font-mercure italic leading-[1.3] text-black">
                    {block.question}
                  </p>
                </div>

                {/* Follow-up */}
                {block.followUp && (
                  <div className="ml-6 sm:ml-7 mb-2.5 border-l-2 border-mars/40 pl-3 sm:pl-4 py-1.5">
                    <p className="text-neutral-400 text-[9px] uppercase tracking-[0.15em] font-bold mb-0.5">Ak odpoveď ostáva všeobecná</p>
                    <p className="text-[14px] sm:text-[15px] font-mercure italic text-mars leading-[1.3]">
                      {block.followUp}
                    </p>
                  </div>
                )}

                {/* Goals */}
                <div className="ml-6 sm:ml-7 flex flex-col gap-0.5">
                  {block.goal.map((g, j) => (
                    <p key={j} className="text-[11px] sm:text-[12px] text-neutral-400 leading-[1.5] before:content-['·'] before:text-neutral-300 before:mr-1.5">{g}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KĽÚČOVÉ PRINCÍPY */}
        <div className="mb-8 sm:mb-10">
          <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-mars mb-3">Kľúčové Princípy</h3>
          <div className="space-y-0.5">
            {PRINCIPLES.map((p, i) => (
              <p key={i} className="text-[13px] sm:text-[14px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">{p}</p>
            ))}
          </div>
        </div>

        {/* POINTA */}
        <div className="mb-8 sm:mb-10">
          <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-mars mb-2">Pointa</h3>
          <p className="text-[14px] sm:text-[15px] text-neutral-400 leading-[1.6] mb-1">
            Rozhovor ide od sveta k človeku. Od abstrakcie k osobnej otázke.
          </p>
          <p className="text-[14px] sm:text-[16px] text-black leading-[1.6] font-semibold">
            Kľúčový moment je, keď hosť prestane hovoriť za biznis alebo ľudstvo a&nbsp;pomenuje svoju vlastnú otázku.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 pt-4 flex items-center justify-between">
          <img src="/logo.png" alt="Stage on Mars" className="h-4 sm:h-5 opacity-20" />
          <a href="mailto:play@stageonmars.com" className="text-neutral-300 text-[10px] sm:text-[11px] hover:text-neutral-500 transition-colors">play@stageonmars.com</a>
        </div>
      </div>
    </div>
  );
}
