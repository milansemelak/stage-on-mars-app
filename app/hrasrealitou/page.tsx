import Link from "next/link";

export const metadata = {
  title: "Hra s realitou — Stage on Mars",
  description: "Produkčný brief. Živý show formát, kde sa skutočné otázky menia na živé situácie. S Milanom Šemelákom.",
  openGraph: {
    title: "Hra s realitou",
    description: "Produkčný brief. Živá interaktívna show.",
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
    description: "Produkčný brief. Živá interaktívna show.",
    images: ["/stage.jpg"],
  },
};

const FORMAT_FLOW = [
  {
    phase: "01",
    title: "Otvorenie",
    time: "3 min",
    description: "Nastavenie pravidiel a energie. Rýchle, jasné, bez vysvetľovania.",
  },
  {
    phase: "02",
    title: "Warm-up",
    time: "10\u201315 min",
    description: "Absurdné situácie, humor. Publikum pochopí princíp a uvoľní sa.",
  },
  {
    phase: "03",
    title: "Prvá reálna hra",
    time: "15\u201320 min",
    description: "Prechod do reality. Krátka, živá situácia z publika.",
  },
  {
    phase: "04",
    title: "Hlbšia hra",
    time: "20\u201325 min",
    description: "Eskalácia: viac napätia, viac pravdy, viac dynamiky.",
  },
  {
    phase: "05",
    title: "Talk segment",
    time: "voliteľné",
    description: "Rozhovor s hosťom. Nie o jeho príbehu — o otázke, ktorú žije.",
  },
  {
    phase: "06",
    title: "Finále",
    time: "15\u201320 min",
    description: "Najsilnejšia hra večera. Bez vysvetlenia. Len skúsenosť.",
  },
  {
    phase: "07",
    title: "Záver",
    time: "3 min",
    description: "Krátke uzavretie. Priestor na vlastnú reflexiu.",
  },
];

const PRINCIPLES = [
  "Realita sa neanalyzuje. Hrá sa.",
  "Žiadne rady. Žiadne vysvetlenia.",
  "Rýchlosť je dôležitejšia než presnosť.",
  "Humor otvára dvere k pravde.",
  "Každý je súčasťou systému.",
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
          <span className="text-neutral-300 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold">Confidential</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 sm:px-10 py-8 sm:py-12">

        {/* TITLE */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-2">Stage on Mars Presents</p>
          <h1 className="text-[32px] sm:text-[48px] font-bold tracking-[-0.04em] leading-[1.05] mb-1">
            Hra s <span className="font-mercure italic text-mars">realitou</span>
          </h1>
          <p className="text-neutral-400 text-[12px] sm:text-[13px] uppercase tracking-[0.15em] font-semibold">Produkčný Brief</p>
        </div>

        {/* BRIEF INFO */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">O Formáte</p>

          <Row label="Formát">
            <p className="text-[13px] font-semibold">Živá interaktívna show</p>
          </Row>
          <Row label="Dĺžka">
            <p className="text-[13px] font-semibold">90–120 min (flexibilné)</p>
          </Row>
          <Row label="Publikum">
            <p className="text-[13px] font-semibold">30–300 ľudí</p>
          </Row>
          <Row label="Host">
            <p className="text-[15px] sm:text-[17px] font-bold tracking-[-0.02em]">
              Milan <span className="font-mercure italic text-mars">Šemelák</span>
            </p>
          </Row>
          <Row label="Čo sa deje">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Ľudia z&nbsp;publika prinesú otázku, problém alebo napätie zo svojho života.
              Milan z&nbsp;nich v&nbsp;reálnom čase vytvorí systém — obsadí ľudí do rolí a&nbsp;nechá situáciu odohrať.
              To, čo bolo neviditeľné, sa stáva viditeľným.
            </p>
          </Row>
          <Row label="Kľúčové">
            <p className="text-[13px] text-neutral-900 font-semibold italic">Nie je to vysvetlené. Je to zahrané.</p>
          </Row>
        </div>

        {/* THE SPACE */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Priestor</p>
          <Row label="Javisko">
            <div className="rounded-xl overflow-hidden">
              <img src="/stage.jpg" alt="Stage on Mars — the circular stage" className="w-full h-auto" />
            </div>
          </Row>
          <Row label="Setup">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Kruhové alebo otvorené javisko. Bez stola, bez bariér.
              Publikum okolo alebo v&nbsp;polkruhu. Intímny kontakt.
            </p>
          </Row>
          <Row label="Atmosféra">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Sústredená, ale uvoľnená. Striedanie humoru a&nbsp;ticha.
              Energia v&nbsp;miestnosti je súčasťou formátu.
            </p>
          </Row>
        </div>

        {/* DRAMATURGIA */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-1">Dramaturgia</p>
          <p className="text-[12px] text-neutral-400 mb-4">Štruktúra večera. Začína ľahko, končí silno.</p>

          {FORMAT_FLOW.map((block, i) => (
            <div key={i} className={`grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-3 sm:gap-4 py-4 ${i < FORMAT_FLOW.length - 1 ? "border-b border-neutral-100" : ""}`}>
              <div>
                <span className="text-mars text-[12px] font-mono font-bold">{block.phase}</span>
                <p className="text-neutral-300 text-[11px] mt-0.5">{block.time}</p>
              </div>
              <div>
                <h4 className="text-[15px] sm:text-[16px] font-bold tracking-[-0.02em] mb-0.5">{block.title}</h4>
                <p className="text-[13px] leading-[1.6] text-neutral-700">{block.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* PRINCÍPY */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Princípy Formátu</p>
          <Row label="Pravidlá">
            <div className="space-y-0.5">
              {PRINCIPLES.map((p, i) => (
                <p key={i} className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">{p}</p>
              ))}
            </div>
          </Row>
        </div>

        {/* ROLA HOSTITEĽA */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Rola Hostiteľa</p>

          <Row label="Nie je">
            <p className="text-[13px] leading-[1.6] text-neutral-700">facilitátor, kouč ani terapeut</p>
          </Row>
          <Row label="Je">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Režisér situácií. Vytvára podmienky, v&nbsp;ktorých sa veci ukážu samy.
              Pracuje s&nbsp;tým, čo je v&nbsp;miestnosti — s&nbsp;ľuďmi, energiou, napätím.
            </p>
          </Row>
        </div>

        {/* ČO PUBLIKUM ZAŽIJE */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Čo Publikum Zažije</p>
          <Row label="Zážitok">
            <div className="space-y-0.5">
              <p className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">vidia problémy zvonka, z&nbsp;iného uhla</p>
              <p className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">zažijú perspektívy, ktoré si sami nevedia vytvoriť</p>
              <p className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">uvoľnia napätie cez humor a&nbsp;hru</p>
              <p className="text-[13px] text-neutral-700 leading-[1.6] before:content-['·'] before:text-mars before:font-bold before:mr-1.5">odchádzajú s&nbsp;pocitom posunu — bez rád a&nbsp;vysvetlení</p>
            </div>
          </Row>
        </div>

        {/* TECHNICKÉ POŽIADAVKY */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Technické Požiadavky</p>

          <Row label="Priestor">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Otvorený priestor s&nbsp;možnosťou pohybu. Javisko alebo voľná plocha min. 4&times;4m.
            </p>
          </Row>
          <Row label="Zvuk">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              1&times; bezdrôtový mikrofón pre hostiteľa. PA systém pre publikum.
            </p>
          </Row>
          <Row label="Svetlo">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Základné javiskové osvetlenie. Možnosť stlmiť svetlá v&nbsp;hľadisku.
            </p>
          </Row>
          <Row label="Príprava">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Žiadna príprava od publika. Žiadne predošlé skúsenosti potrebné.
              Milan potrebuje 30 min na prípravu priestoru.
            </p>
          </Row>
        </div>

        {/* POUŽITIE */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Kde To Funguje</p>

          <Row label="Eventy">
            <p className="text-[13px] font-semibold">Konferencie, firemné eventy, festivaly</p>
          </Row>
          <Row label="Komunity">
            <p className="text-[13px] font-semibold">Coworkingy, meetupy, súkromné skupiny</p>
          </Row>
          <Row label="Médiá">
            <p className="text-[13px] font-semibold">Live show, podcast s publikom, TV formát</p>
          </Row>
          <Row label="Škálovanie">
            <p className="text-[13px] leading-[1.6] text-neutral-700">
              Funguje pre 30 ľudí v&nbsp;obývačke aj pre 300 na konferencii.
              Formát sa prispôsobí priestoru, nie naopak.
            </p>
          </Row>
        </div>

        {/* ONE-LINER */}
        <div className="mb-8 sm:mb-10">
          <div className="border-l-2 border-mars pl-4 py-2">
            <p className="text-[18px] sm:text-[22px] font-mercure italic leading-[1.3] text-black">
              {"\u201EDajte mi svoju otázku."}
            </p>
            <p className="text-[18px] sm:text-[22px] font-mercure italic leading-[1.3] text-mars">
              {"A zahráme ju.\u201C"}
            </p>
          </div>
        </div>

        {/* KONTAKT */}
        <div className="mb-8 sm:mb-10">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-3">Kontakt</p>
          <Row label="Booking">
            <a href="mailto:play@stageonmars.com" className="text-[13px] font-semibold text-black hover:text-mars transition-colors">play@stageonmars.com</a>
          </Row>
          <Row label="Web">
            <a href="https://stageonmars.com" target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-black hover:text-mars transition-colors">stageonmars.com</a>
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
