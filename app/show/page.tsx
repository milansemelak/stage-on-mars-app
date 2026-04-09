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
    question: "Aká je najväčšia otázka, ktorú si musí Yemi zodpovedať, aby sa posunul vpred?",
    goal: [
      "Presun z abstrakcie do osobnej roviny.",
      "Moment, kde už nemôže hovoriť za systém.",
    ],
    note: "Návrat späť k nemu.",
    followUp: "To je dobré. Ale aká je tá tvoja?",
  },
  {
    phase: "06",
    title: "Záver \u2014 Ďalšia verzia Yemiho",
    time: "3\u20135 min",
    question: "Aká je ďalšia verzia Yemiho? Kým ide byť?",
    goal: [
      "Bez zhrnutia. Bez vysvetľovania.",
      "Bez návratu k tomu, čo už zaznelo.",
    ],
    note: "Rozhovor sa uzavrie jednou vecou.",
  },
];

const PRINCIPLES = [
  "Neísť do minulosti",
  "Nenechať rozhovor skĺznuť do mudrovania",
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-3 sm:gap-4 py-3 border-b border-neutral-100">
      <p className="text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold pt-0.5 shrink-0">{label}</p>
      <div>{children}</div>
    </div>
  );
}

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
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-2">Stage on Mars Presents</p>
          <h1 className="text-[32px] sm:text-[48px] font-bold tracking-[-0.04em] leading-[1.05] mb-1">
            Human <span className="font-mercure italic text-mars">on Mars</span>
          </h1>
          <p className="text-neutral-400 text-[12px] sm:text-[13px] uppercase tracking-[0.15em] font-semibold">Talks from Outer Space</p>
        </div>

        {/* BRIEF INFO — grid rows */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Produkčný Brief</p>

          <Row label="Epizóda">
            <p className="text-[15px] sm:text-[17px] font-bold tracking-[-0.02em]">
              Yemi A.D. <span className="font-mercure italic text-mars">on Mars</span>
            </p>
          </Row>
          <Row label="Formát">
            <p className="text-[13px] font-semibold">Rozhovor na kruhovom javisku</p>
          </Row>
          <Row label="Dĺžka">
            <p className="text-[13px] font-semibold">cca 45 min</p>
          </Row>
          <Row label="Účastníci">
            <p className="text-[13px] font-semibold">Yemi A.D. a Milan Šemelák</p>
          </Row>
          <Row label="Cieľ">
            <p className="text-[13px] leading-[1.5] text-neutral-700">
              Zachytiť moment, kde sa rozhovor presunie z&nbsp;všeobecného uvažovania do osobnej, nepomenovanej otázky.
            </p>
          </Row>
        </div>

        {/* PRIESTOR A ATMOSFÉRA — grid rows */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Priestor a Atmosféra</p>

          <Row label="Scéna">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Čistá, minimálna. Kruhové javisko je centrálny prvok. Dvaja ľudia oproti sebe, bez stola a&nbsp;bez bariér.
            </p>
          </Row>
          <Row label="Atmosféra">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Sústredená, bez rušenia. Dôležité sú pauzy, pohľady a zmena tempa.
            </p>
          </Row>
          <Row label="Kamera">
            <div className="space-y-0.5">
              {CAMERA.map((item, i) => (
                <p key={i} className="text-[12px] sm:text-[13px] text-neutral-600 before:content-['·'] before:text-mars before:font-bold before:mr-1.5">{item}</p>
              ))}
            </div>
          </Row>
          <Row label="Kľúčové">
            <p className="text-[13px] text-neutral-900 font-semibold italic">Nejde o zaznamenanie odpovedí, ale situácie.</p>
          </Row>
        </div>

        {/* ŠTRUKTÚRA ROZHOVORU */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-1">Štruktúra Rozhovoru</p>
          <p className="text-[12px] text-neutral-400 mb-4">Začína širšie, postupne sa zužuje.</p>

          {STRUCTURE.map((block, i) => (
            <div key={i} className={`grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-3 sm:gap-4 py-4 ${i < STRUCTURE.length - 1 ? "border-b border-neutral-100" : ""}`}>
              {/* Left column — phase info */}
              <div>
                <span className="text-mars text-[12px] font-mono font-bold">{block.phase}</span>
                <p className="text-neutral-300 text-[11px] mt-0.5">{block.time}</p>
              </div>

              {/* Right column — content */}
              <div>
                <h4 className="text-[15px] sm:text-[16px] font-bold tracking-[-0.02em] mb-0.5">{block.title}</h4>
                <p className="text-neutral-400 text-[11px] sm:text-[12px] mb-2">{block.note}</p>

                {/* Question */}
                <div className="border-l-2 border-mars pl-3 py-1 mb-2 bg-neutral-100/60 rounded-r-lg">
                  <p className="text-[14px] sm:text-[16px] font-mercure italic leading-[1.3] text-black">
                    {block.question}
                  </p>
                </div>

                {/* Follow-up */}
                {block.followUp && (
                  <div className="border-l-2 border-mars/40 pl-3 py-1 mb-2">
                    <p className="text-neutral-400 text-[9px] uppercase tracking-[0.15em] font-bold mb-0.5">Ak odpoveď ostáva všeobecná</p>
                    <p className="text-[13px] sm:text-[14px] font-mercure italic text-mars leading-[1.3]">
                      {block.followUp}
                    </p>
                  </div>
                )}

                {/* Goals */}
                <div className="flex flex-col gap-0.5">
                  {block.goal.map((g, j) => (
                    <p key={j} className="text-[11px] sm:text-[12px] text-neutral-400 leading-[1.5] before:content-['·'] before:text-neutral-300 before:mr-1.5">{g}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* KĽÚČOVÉ PRINCÍPY */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Kľúčové Princípy</p>
          <Row label="Pravidlá">
            <div className="space-y-0.5">
              {PRINCIPLES.map((p, i) => (
                <p key={i} className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">{p}</p>
              ))}
            </div>
          </Row>
        </div>

        {/* POINTA */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Pointa</p>
          <Row label="Záver">
            <div>
              <p className="text-[13px] sm:text-[14px] text-neutral-400 leading-[1.6] mb-1">
                Rozhovor ide od sveta k človeku. Od abstrakcie k osobnej otázke.
              </p>
              <p className="text-[13px] sm:text-[14px] text-black leading-[1.6] font-semibold">
                Kľúčový moment je, keď hosť prestane hovoriť za biznis alebo ľudstvo a&nbsp;pomenuje svoju vlastnú otázku.
              </p>
            </div>
          </Row>
        </div>

        {/* THE SPACE */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">The Space</p>
          <Row label="Javisko">
            <div className="rounded-xl overflow-hidden">
              <img src="/stage.jpg" alt="Stage on Mars \u2014 the circular stage" className="w-full h-auto" />
            </div>
          </Row>
        </div>

        {/* VÝSTUP */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Výstup</p>
          <Row label="YouTube">
            <p className="text-[13px] font-semibold">Long formát pre YouTube</p>
          </Row>
          <Row label="Promo">
            <p className="text-[13px] font-semibold">Short video pre Stage on Mars promotion</p>
          </Row>
          <Row label="Social">
            <p className="text-[13px] font-semibold">Reels pre Instagram a LinkedIn</p>
          </Row>
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
