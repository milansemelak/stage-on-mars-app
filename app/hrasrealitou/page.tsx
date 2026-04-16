import Link from "next/link";

export const metadata = {
  title: "Hra s realitou — Stage on Mars",
  description: "Živá show, kde sa situácie odohrávajú naživo. S Milanom Šemelákom.",
  openGraph: {
    title: "Hra s realitou",
    description: "Živá show, kde sa situácie odohrávajú naživo.",
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
    description: "Živá show, kde sa situácie odohrávajú naživo.",
    images: ["/stage.jpg"],
  },
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Zaznie situácia",
    description: "Niečo, čo má napätie. Niečo, čo sa rieši.",
  },
  {
    step: "2",
    title: "Vzniknú role",
    lines: [
      "konkrétnymi osobami",
      "vnútornými hlasmi",
      "neviditeľnými silami",
    ],
  },
  {
    step: "3",
    title: "Situácia sa rozbehne",
    description: "Bez prípravy. Naživo.",
  },
  {
    step: "4",
    title: "Niečo sa ukáže",
    description: "Iný pohľad.\nIný smer.\nAlebo niečo, čo tam vždy bolo — len to nebolo vidieť.",
  },
];

const FORMAT_FLOW = [
  {
    phase: "01",
    title: "Otvorenie",
    description: "Rýchle nastavenie. Žiadne vysvetľovanie.",
  },
  {
    phase: "02",
    title: "Warm-up",
    description: "Absurdné alebo bulvárne situácie.",
  },
  {
    phase: "03",
    title: "Osobné situácie",
    description: "Otázky z publika.",
  },
  {
    phase: "04",
    title: "Hlbšia hra",
    description: "Viac napätia. Viac presnosti.",
  },
  {
    phase: "05",
    title: "Talk segment",
    description: "Hosť. Hľadanie otázky.",
    note: "voliteľné",
  },
  {
    phase: "06",
    title: "Finále",
    description: "Najsilnejší moment večera.",
  },
  {
    phase: "07",
    title: "Záver",
    description: "Krátke uzavretie.",
  },
];

const DRAMATURGY_LAYERS = [
  {
    num: "1",
    title: "Všeobecná realita",
    intro: "Začína sa situáciami zo sveta vonku.",
    detail: "Správy. Bulvár. Spoločnosť.\n\nAbsurdné, známe, vzdialené.",
    points: ["Bezpečný vstup.", "Smiech.", "Pochopenie princípu."],
  },
  {
    num: "2",
    title: "Osobná realita",
    intro: "Postupne prichádzajú konkrétne otázky ľudí v\u00a0miestnosti.",
    detail: "Reálne situácie.\nReálne napätia.",
    points: ["Hra ide bližšie.", "Presnejšie.", "Osobnejšie."],
  },
  {
    num: "3",
    title: "Priama realita",
    intro: "Niekedy sa do hry dostane aj Milan.",
    detail: "Použije vlastnú situáciu.\nAlebo vstúpi priamo do hry.",
    points: ["Hranica medzi vedením a\u00a0súčasťou sa zruší."],
  },
];

export default function HraSRealitouPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-black">
      {/* Header */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-5 sm:px-10 py-4 flex items-center justify-between">
          <Link href="/business">
            <img src="/logo.png" alt="Stage On Mars" className="h-6 sm:h-7 w-auto opacity-50 hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 sm:px-10 py-8 sm:py-12">

        {/* HERO — poster + headline */}
        <div className="mb-10 sm:mb-14">
          <div className="-mx-5 sm:mx-0 mb-6 sm:mb-8">
            <div className="sm:rounded-xl overflow-hidden">
              <img src="/poster.png" alt="Is your reality shit? Come and play! — Reality Play with Milan Semelak" className="w-full h-auto" />
            </div>
          </div>
          <h1 className="text-[32px] sm:text-[48px] font-bold tracking-[-0.04em] leading-[1.05] mb-2">
            Hra s <span className="font-mercure italic text-mars">realitou</span>
          </h1>
          <p className="text-neutral-500 text-[14px] sm:text-[15px] mb-6">
            S&nbsp;Milanom Šemelákom
          </p>
          <p className="text-[15px] sm:text-[17px] font-semibold text-black leading-[1.5]">
            👉 To, čo riešiš, sa odohrá pred tebou.
          </p>
        </div>

        {/* WHAT IS IT */}
        <div className="mb-10 sm:mb-14">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-4">What Is It</p>

          <div className="space-y-4 text-[14px] sm:text-[15px] leading-[1.7] text-neutral-800">
            <p className="font-semibold text-black">
              Hra s&nbsp;realitou je živá show, kde sa situácie odohrávajú naživo.
            </p>
            <p>
              Niečo zaznie.<br />
              O&nbsp;pár minút sa to deje.
            </p>
            <p>
              Ľudia z&nbsp;publika sa stávajú niekým iným.<br />
              Šéfom. Partnerom. Strachom. Budúcnosťou.
            </p>
            <p>
              Vzťahy, napätia a&nbsp;rozhodnutia sa začnú hýbať.
            </p>
            <p>
              Bez scenára.<br />
              Bez prípravy.
            </p>
            <div className="pt-2">
              <p className="font-semibold text-black">👉 Veci sa nepopisujú.</p>
              <p className="font-semibold text-black">👉 Veci sa dejú.</p>
            </div>
          </div>
        </div>

        {/* WHY IT EXISTS */}
        <div className="mb-10 sm:mb-14">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-4">Why It Exists</p>

          <div className="space-y-4 text-[14px] sm:text-[15px] leading-[1.7] text-neutral-800">
            <p className="font-semibold text-black">
              Nie všetko sa dá vyriešiť premýšľaním.
            </p>
            <p>
              Niektoré veci treba vidieť zvonka.<br />
              Niektoré veci treba zažiť.
            </p>
            <p>
              Až keď sa situácia pohne, ukáže sa, čo v&nbsp;nej naozaj je.
            </p>
          </div>
        </div>

        {/* THE START */}
        <div className="mb-10 sm:mb-14">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-4">The Start</p>

          <div className="space-y-4 text-[14px] sm:text-[15px] leading-[1.7] text-neutral-800">
            <p>Na začiatku sa nič nehlási.</p>
            <p className="font-semibold text-black">Ľudia kričia svoje otázky.</p>
            <p>Rýchlo. Bez prípravy.</p>
            <p>
              Milan počúva.<br />
              Vyberie jednu.
            </p>
            <p>Človek vstáva a&nbsp;ide do stredu.</p>
            <p className="font-semibold text-black">Na chvíľu sa všetko zastaví.</p>
            <p>
              Otázka sa spresní.<br />
              Niekedy sa rozpadne.<br />
              Niekedy sa trafí presnejšie, než bolo plánované.
            </p>
            <p className="font-semibold text-black">👉 Nie každá otázka prejde.</p>
            <p>Potom sa začne hra.</p>
            <p>
              Ľudia dostávajú role.<br />
              Situácia sa skladá.
            </p>
            <p>
              A&nbsp;to, čo bolo v&nbsp;hlave,<br />
              sa začne odohrávať pred všetkými.
            </p>
            <p>Na konci sa človek vracia späť.</p>
            <p>Nie s&nbsp;odpoveďou.</p>
            <p className="font-semibold text-black">👉 Ale s&nbsp;niečím, čo tam predtým nebolo.</p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mb-10 sm:mb-14">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-4">How It Works</p>

          <div className="space-y-0">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className={`grid grid-cols-[40px_1fr] gap-3 py-4 ${i < HOW_IT_WORKS.length - 1 ? "border-b border-neutral-100" : ""}`}>
                <span className="text-mars text-[14px] font-mono font-bold">{item.step}.</span>
                <div>
                  <h4 className="text-[15px] sm:text-[16px] font-bold tracking-[-0.02em] mb-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-[13px] sm:text-[14px] leading-[1.7] text-neutral-700 whitespace-pre-line">{item.description}</p>
                  )}
                  {item.lines && (
                    <div className="text-[13px] sm:text-[14px] leading-[1.7] text-neutral-700">
                      <p className="mb-0.5">Ľudia sa stávajú:</p>
                      {item.lines.map((line, j) => (
                        <p key={j} className="before:content-['·'] before:text-mars before:font-bold before:mr-1.5">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DRAMATURGIA */}
        <div className="mb-10 sm:mb-14">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-1">Dramaturgia</p>
          <p className="text-[12px] text-neutral-400 mb-6">Večer sa vždy posúva v&nbsp;troch vrstvách reality:</p>

          {DRAMATURGY_LAYERS.map((layer, i) => (
            <div key={i} className={`mb-8 ${i < DRAMATURGY_LAYERS.length - 1 ? "pb-8 border-b border-neutral-100" : ""}`}>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-mars text-[14px] font-mono font-bold">{layer.num}.</span>
                <h4 className="text-[16px] sm:text-[18px] font-bold tracking-[-0.02em]">{layer.title}</h4>
              </div>
              <div className="space-y-3 text-[14px] sm:text-[15px] leading-[1.7] text-neutral-800 pl-7">
                <p>{layer.intro}</p>
                <p className="whitespace-pre-line">{layer.detail}</p>
                <div className="pt-1">
                  {layer.points.map((point, j) => (
                    <p key={j} className="font-semibold text-black">👉 {point}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* STAGE SETUP */}
        <div className="mb-10 sm:mb-14">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-4">Stage Setup</p>

          <div className="space-y-4 text-[14px] sm:text-[15px] leading-[1.7] text-neutral-800">
            <p className="font-semibold text-black">Milan stojí v&nbsp;strede priestoru.</p>
            <p>Okolo neho sedia ľudia v&nbsp;kruhu.</p>
            <p>
              Nie je tu klasické pódium.<br />
              Nie je tu odstup.
            </p>
            <p className="font-semibold text-black">👉 Všetko sa deje medzi ľuďmi.</p>
            <p>
              Keď zaznie situácia, ľudia z&nbsp;publika sú vyberaní do rolí<br />
              a&nbsp;vstupujú do stredu.
            </p>
            <p>Z&nbsp;diváka sa stáva súčasť hry.</p>
            <p>Priestor sa neustále mení.</p>
            <div className="pt-1">
              <p className="font-semibold text-black">👉 Raz sa pozeráš.</p>
              <p className="font-semibold text-black">👉 O&nbsp;chvíľu si súčasťou.</p>
            </div>
            <p>Neexistuje hranica medzi javiskom a&nbsp;publikom.</p>
          </div>
        </div>

        {/* FORMAT FLOW */}
        <div className="mb-10 sm:mb-14">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-4">Format Flow</p>

          {FORMAT_FLOW.map((block, i) => (
            <div key={i} className={`grid grid-cols-[40px_1fr] gap-3 py-4 ${i < FORMAT_FLOW.length - 1 ? "border-b border-neutral-100" : ""}`}>
              <span className="text-mars text-[12px] font-mono font-bold">{block.phase}</span>
              <div>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-[15px] sm:text-[16px] font-bold tracking-[-0.02em] mb-0.5">{block.title}</h4>
                  {block.note && (
                    <span className="text-neutral-300 text-[11px]">({block.note})</span>
                  )}
                </div>
                <p className="text-[13px] sm:text-[14px] leading-[1.7] text-neutral-700 whitespace-pre-line">{block.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TONE */}
        <div className="mb-10 sm:mb-14">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-4">Tone</p>

          <div className="space-y-4 text-[14px] sm:text-[15px] leading-[1.7] text-neutral-800">
            <p>
              Je to rýchle.<br />
              Je to živé.<br />
              Je to často vtipné.
            </p>
            <p>
              Občas absurdné.<br />
              Občas presné až nepríjemne.
            </p>
            <p className="font-semibold text-black">
              👉 Niekedy to trafí presnejšie, než by bolo príjemné.
            </p>
            <p>
              Smiech prichádza skôr než pochopenie.
            </p>
          </div>
        </div>

        {/* ROLE OF THE HOST */}
        <div className="mb-10 sm:mb-14">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-4">Role of the Host</p>

          <div className="rounded-xl overflow-hidden mb-6">
            <img src="/reality play.png" alt="Milan Šemelák — Reality Play" className="w-full h-auto" />
          </div>

          <div className="space-y-4 text-[14px] sm:text-[15px] leading-[1.7] text-neutral-800">
            <p className="font-semibold text-black">
              Milan Šemelák vedie večer.
            </p>
            <p>
              Vyberá situácie.<br />
              Obsadzuje role.<br />
              Rozbieha hru.
            </p>
            <p>
              Drží tempo.<br />
              Drží napätie.
            </p>
            <p>
              A&nbsp;niekedy sa stáva súčasťou toho, čo sa deje.
            </p>
          </div>
        </div>

        {/* WHAT HAPPENS */}
        <div className="mb-10 sm:mb-14">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-4">What Happens</p>

          <div className="space-y-4 text-[14px] sm:text-[15px] leading-[1.7] text-neutral-800">
            <p>Situácie sa stanú viditeľnými.</p>
            <p className="font-semibold text-black">
              Veci, ktoré nebolo vidieť, zrazu stoja pred tebou.
            </p>
            <p>
              Vzťahy sa rozhýbu.<br />
              Napätie sa uvoľní.
            </p>
            <p className="font-semibold text-black">
              Objaví sa niečo nové.
            </p>
          </div>
        </div>

        {/* ONE-LINER */}
        <div className="mb-10 sm:mb-14">
          <div className="border-l-2 border-mars pl-4 py-2">
            <p className="text-[18px] sm:text-[22px] font-mercure italic leading-[1.3] text-black">
              Daj sem svoju realitu.
            </p>
            <p className="text-[18px] sm:text-[22px] font-mercure italic leading-[1.3] text-mars">
              Zahráme ju.
            </p>
          </div>
        </div>

        {/* TV VIDEO */}
        <div className="mb-10 sm:mb-14">
          <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-4">Seen on TV</p>
          <div className="-mx-5 sm:mx-0 mb-3">
            <div className="sm:rounded-xl overflow-hidden">
              <video
                src="/farma-web.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full h-auto"
              />
            </div>
          </div>
          <p className="text-[13px] sm:text-[14px] leading-[1.6] text-neutral-500">
            Ukážka systémickej hry Stage on Mars v&nbsp;reality show Farma na TV Markíza.
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
