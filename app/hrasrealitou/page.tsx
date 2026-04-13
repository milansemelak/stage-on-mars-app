import Link from "next/link";

export const metadata = {
  title: "Hra s realitou — Stage on Mars",
  description: "Živý, interaktívny show formát, kde sa skutočné otázky menia na živé situácie. S Milanom Šemelákom.",
  openGraph: {
    title: "Hra s realitou",
    description: "Dajte mi svoju otázku. A zahráme ju.",
    siteName: "Stage on Mars",
    type: "website",
    images: [
      {
        url: "/stage.jpg",
        width: 1200,
        height: 630,
        alt: "Stage on Mars — the circular stage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hra s realitou",
    description: "Dajte mi svoju otázku. A zahráme ju.",
    images: ["/stage.jpg"],
  },
};

const FORMAT_FLOW = [
  {
    phase: "01",
    title: "Otvorenie",
    description: "Nastavenie pravidiel a energie.\nRýchle, jasné, bez vysvetľovania.",
  },
  {
    phase: "02",
    title: "Warm-up (bezpečná hra)",
    description: 'Hra s absurdnými alebo "bulvárnymi" situáciami.\nCieľ: uvoľniť publikum, ukázať princíp.',
  },
  {
    phase: "03",
    title: "Prvá reálna otázka",
    description: 'Prechod z "hry" do reality.\nKrátka, živá situácia z publika.',
  },
  {
    phase: "04",
    title: "Hlbšia hra",
    description: "Eskalácia: viac napätia, viac pravdy, viac dynamiky.",
  },
  {
    phase: "05",
    title: "Talk segment (voliteľné)",
    description: "Rozhovor s hosťom.\nNie o príbehu — o otázke, ktorú žije.",
  },
  {
    phase: "06",
    title: "Finále",
    description: "Najsilnejšia hra večera.\nBez vysvetlenia. Len skúsenosť.",
  },
  {
    phase: "07",
    title: "Záver",
    description: "Krátke uzavretie.\nOtvorenie priestoru na vlastnú reflexiu.",
  },
];

const PRINCIPLES = [
  "Realita sa neanalyzuje. Hrá sa.",
  "Žiadne rady. Žiadne vysvetlenia.",
  "Rýchlosť je dôležitejšia než presnosť.",
  "Humor otvára dvere k pravde.",
  "Každý je súčasťou systému.",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Otázka",
    description: "Niekto z publika prinesie skutočnú otázku alebo situáciu.",
  },
  {
    step: "02",
    title: "Obsadenie",
    description: "Milan vyberie ľudí z publika a priradí im role:",
    items: ["ľudia zo života", "časti osobnosti", "neviditeľné sily (strach, tlak, očakávania…)"],
  },
  {
    step: "03",
    title: "Hra",
    description: "Situácia sa začne odvíjať.\nBez scenára. Bez prípravy.",
  },
  {
    step: "04",
    title: "Zmena",
    description: "Objaví sa nový pohľad, posun alebo uvedomenie.\nNiekedy jemné. Niekedy veľmi silné.",
  },
];

const EXPERIENCE = [
  "vidia svoj problém zvonka",
  "zažijú nové perspektívy",
  "uvoľnia napätie cez humor",
  "odchádzajú s pocitom posunu",
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-3 sm:gap-4 py-3 border-b border-neutral-100">
      <p className="text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold pt-0.5 shrink-0">{label}</p>
      <div>{children}</div>
    </div>
  );
}

export default function HraSRealitouPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-black">
      {/* Header */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-5 sm:px-10 py-4 flex items-center justify-between">
          <Link href="/business">
            <img src="/logo.png" alt="Stage On Mars" className="h-6 sm:h-7 w-auto opacity-50 hover:opacity-100 transition-opacity" />
          </Link>
          <span className="text-neutral-300 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold">Hra s realitou</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 sm:px-10 py-8 sm:py-12">

        {/* TITLE */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-2">Stage on Mars Presents</p>
          <h1 className="text-[32px] sm:text-[48px] font-bold tracking-[-0.04em] leading-[1.05] mb-1">
            Hra s <span className="font-mercure italic text-mars">realitou</span>
          </h1>
          <p className="text-neutral-400 text-[12px] sm:text-[13px] uppercase tracking-[0.15em] font-semibold">S Milanom Šemelákom</p>
        </div>

        {/* WHAT IS IT */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">What Is It</p>

          <Row label="Formát">
            <p className="text-[13px] font-semibold">Živý, interaktívny show formát</p>
          </Row>
          <Row label="Princíp">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Skutočné otázky sa menia na živé situácie.
              Diváci prinesú otázku, problém alebo napätie zo svojho života.
              Milan Šemelák z&nbsp;nich v&nbsp;reálnom čase vytvorí systém — obsadí ľudí do rolí a&nbsp;nechá situáciu odohrať.
            </p>
          </Row>
          <Row label="Výsledok">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              To, čo bolo neviditeľné alebo zamotané, sa zrazu stáva viditeľným.
            </p>
          </Row>
          <Row label="Kľúčové">
            <p className="text-[13px] text-neutral-900 font-semibold italic">Nie je to vysvetlené. Je to zahrané.</p>
          </Row>
        </div>

        {/* WHY IT EXISTS */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Why It Exists</p>

          <Row label="Problém">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Ľudia sú zaseknutí vo vlastných príbehoch.
              Premýšľajú, analyzujú, hľadajú odpovede —
              ale nevidia, čo sa skutočne deje.
            </p>
          </Row>
          <Row label="Účel">
            <div className="space-y-0.5">
              <p className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">ukázať realitu zvonka</p>
              <p className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">umožniť zažiť inú perspektívu</p>
              <p className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">vytvoriť priestor, kde sa veci môžu pohnúť</p>
            </div>
          </Row>
          <Row label="Kľúčové">
            <p className="text-[13px] text-neutral-900 font-semibold italic">Nie cez rady. Cez skúsenosť.</p>
          </Row>
        </div>

        {/* HOW IT WORKS */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-1">How It Works</p>
          <p className="text-[12px] text-neutral-400 mb-4">Od otázky po zmenu. V reálnom čase.</p>

          {HOW_IT_WORKS.map((block, i) => (
            <div key={i} className={`grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-3 sm:gap-4 py-4 ${i < HOW_IT_WORKS.length - 1 ? "border-b border-neutral-100" : ""}`}>
              <div>
                <span className="text-mars text-[12px] font-mono font-bold">{block.step}</span>
              </div>
              <div>
                <h4 className="text-[15px] sm:text-[16px] font-bold tracking-[-0.02em] mb-0.5">{block.title}</h4>
                {block.description.split("\n").map((line, j) => (
                  <p key={j} className="text-[13px] leading-[1.6] text-neutral-700">{line}</p>
                ))}
                {block.items && (
                  <div className="mt-1 space-y-0.5">
                    {block.items.map((item, j) => (
                      <p key={j} className="text-[12px] sm:text-[13px] text-neutral-600 before:content-['·'] before:text-mars before:font-bold before:mr-1.5">{item}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FORMAT FLOW */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-1">Format Flow</p>
          <p className="text-[12px] text-neutral-400 mb-4">Štruktúra večera od otvorenia po záver.</p>

          {FORMAT_FLOW.map((block, i) => (
            <div key={i} className={`grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-3 sm:gap-4 py-4 ${i < FORMAT_FLOW.length - 1 ? "border-b border-neutral-100" : ""}`}>
              <div>
                <span className="text-mars text-[12px] font-mono font-bold">{block.phase}</span>
              </div>
              <div>
                <h4 className="text-[15px] sm:text-[16px] font-bold tracking-[-0.02em] mb-0.5">{block.title}</h4>
                {block.description.split("\n").map((line, j) => (
                  <p key={j} className="text-[13px] leading-[1.6] text-neutral-700">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* KEY PRINCIPLES */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Key Principles</p>
          <Row label="Pravidlá">
            <div className="space-y-0.5">
              {PRINCIPLES.map((p, i) => (
                <p key={i} className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">{p}</p>
              ))}
            </div>
          </Row>
        </div>

        {/* ROLE OF THE HOST */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Role of the Host</p>

          <Row label="Kto">
            <p className="text-[15px] sm:text-[17px] font-bold tracking-[-0.02em]">
              Milan <span className="font-mercure italic text-mars">Šemelák</span>
            </p>
          </Row>
          <Row label="Nie je">
            <p className="text-[13px] leading-[1.6] text-neutral-700">facilitátor ani kouč</p>
          </Row>
          <Row label="Je">
            <div className="space-y-0.5">
              <p className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">režisér</p>
              <p className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">moderátor</p>
              <p className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">pozorovateľ reality</p>
            </div>
          </Row>
          <Row label="Kľúčové">
            <p className="text-[13px] text-neutral-900 font-semibold italic">Vytvára situácie, v ktorých sa veci ukážu samy.</p>
          </Row>
        </div>

        {/* WHAT PEOPLE EXPERIENCE */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">What People Experience</p>
          <Row label="Zážitok">
            <div className="space-y-0.5">
              {EXPERIENCE.map((item, i) => (
                <p key={i} className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">{item}</p>
              ))}
            </div>
          </Row>
          <Row label="Kľúčové">
            <p className="text-[13px] text-neutral-900 font-semibold italic">
              Nie preto, že dostali odpoveď. Ale preto, že niečo uvideli inak.
            </p>
          </Row>
        </div>

        {/* THE SPACE */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">The Space</p>
          <Row label="Javisko">
            <div className="rounded-xl overflow-hidden">
              <img src="/stage.jpg" alt="Stage on Mars — the circular stage" className="w-full h-auto" />
            </div>
          </Row>
        </div>

        {/* ONE-LINER */}
        <div className="mb-8 sm:mb-10">
          <div className="border-l-2 border-mars pl-4 py-2">
            <p className="text-[18px] sm:text-[22px] font-mercure italic leading-[1.3] text-black">
              „Dajte mi svoju otázku.
            </p>
            <p className="text-[18px] sm:text-[22px] font-mercure italic leading-[1.3] text-mars">
              A zahráme ju."
            </p>
          </div>
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
