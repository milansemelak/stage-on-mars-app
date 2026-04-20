"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CALENDLY_URL_BOOK = "https://calendly.com/play-stageonmars/decisions-on-mars";
const CALENDLY_URL_INTRO = "https://calendly.com/play-stageonmars/30min";

// Calendly widget global (provided by the external script)
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

/* ──────────────────────────────────────────────────────────────
   Content, keyed by locale. Brand terms stay in English in all
   three languages: Stage on Mars, Stage, Systemic Play, Reality
   Play, Playmaker, Producer, The Question Club, Mars. The product
   name itself is translated.
   ────────────────────────────────────────────────────────────── */

type Locale = "en" | "cs" | "sk";

const LOCALES: Locale[] = ["en", "cs", "sk"];

const CLIENTS = [
  "Forbes",
  "Škoda",
  "YPO",
  "PwC",
  "O2",
  "UniCredit",
  "Oktagon MMA",
  "House of Lobkowicz",
  "London Business School",
  "Česká spořitelna",
  "Lasvit",
  "Ipsen",
  "MSD",
  "Direct Group",
  "Raiffeisenbank",
];

// Testimonials stay in English across all three locales.
const FEATURED_QUOTE = {
  quote:
    "Absolutely genius. The fastest way to break through corporate thinking.",
  name: "Vik Maraj",
  org: "Unstoppable Conversations",
};

const QUOTES = [
  {
    quote:
      "It either confirms what you believe, or shows you a different reality.",
    name: "Alexandra Lobkowicz",
    org: "House of Lobkowicz",
  },
  {
    quote: "You drop the titles, the ego, the learned masks and go deep.",
    name: "Raul Rodriguez",
    org: "Dajana Rodriguez",
  },
  {
    quote: "Brilliant and healing for the company and our people.",
    name: "Ondřej Novotný",
    org: "Oktagon MMA",
  },
  {
    quote: "Also thanks to dreaming on Mars, Direct Group is now flying forward.",
    name: "Pavel Řehák",
    org: "Direct Group",
  },
];

type PageCopy = {
  crumb: string;
  productName: string;
  heroEyebrow: string;
  heroHeadlineL1: string;
  heroHeadlineL2: string;
  heroSub: string;
  specLabels: { duration: string; team: string; price: string; next: string };
  specValues: { duration: string; team: string; price: string; next: string };
  bridgeLabel: string;
  bridgeCaption: string;
  whatItIsHeadline: string;
  whatItIsDeck: string;
  bridgeParagraph: string;
  formulaLabel: string;
  fiveStat: string;
  fiveSource: string;
  fiveBody: string;
  bookWhenLabel: string;
  bookWhen: string[];
  fourHoursLabel: string;
  fourHours: Array<{ num: string; time: string; title: string; body: string }>;
  outcomesLabel: string;
  outcomes: Array<{ name: string; body: string }>;
  includedLabel: string;
  included: string[];
  notLabel: string;
  not: string[];
  casesLabel: string;
  cases: Array<{ client: string; body: string }>;
  rosterLabel: string;
  testimonialLabel: string;
  ctaHeadline: string;
  ctaSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  milanLabel: string;
  milanName: string;
  milanRole: string;
  milanLine: string;
  faqLabel: string;
  faq: Array<{ q: string; a: string }>;
  nextSlotFallback: string;
  nextSlotPrefix: string;
  deckLabel: string;
  deckTitle: string;
  deckSub: string;
  deckCta: string;
};

const CONTENT: Record<Locale, PageCopy> = {
  en: {
    crumb: "Stage",
    productName: "Decisions on Mars",
    heroEyebrow: "Decisions on Mars · Four hours · Národní 10, Prague",
    heroHeadlineL1: "Play the decision.",
    heroHeadlineL2: "Then make it.",
    heroSub:
      "A four-hour live play of the one decision your team can't make in a meeting. On a circular stage in Prague.",
    specLabels: {
      duration: "Duration",
      team: "Team size",
      price: "Price",
      next: "Next slot",
    },
    specValues: {
      duration: "4 hours",
      team: "Up to 20",
      price: "95 000 Kč",
      next: "3 weeks",
    },
    bridgeLabel: "What actually happens",
    bridgeCaption: "The stage. Národní 10, Prague.",
    whatItIsHeadline: "Live the decision first.",
    whatItIsDeck:
      "Stage on Mars is a 4-hour decision environment that turns weeks of thinking into one lived experience.",
    bridgeParagraph:
      "Before the play starts, you cast the system. Your CFO stands in for The Board. Your Head of Sales stands in for The Market. A Playmaker holds the structure, a Producer holds the room. Over four hours, on a circular stage, the thing nobody says in meetings becomes something you can see, move, and decide on.",
    formulaLabel: "The method",
    fiveStat: "Only 5% of people see what you see.",
    fiveSource: "Harvard Business Review · Amy Gallo",
    fiveBody:
      "People don't build what they don't believe. Believe → Understand → Build. On Mars, they play it, feel it, and start believing in the same thing.",
    bookWhenLabel: "Book this when",
    bookWhen: [
      "Your strategy is clear but people don't believe in it.",
      "A decision has been on the table for six months and nobody is making it.",
      "Two teams just merged and the new one hasn't formed yet.",
      "You sense something is off but nobody can name it.",
    ],
    fourHoursLabel: "How the four hours go",
    fourHours: [
      {
        num: "01",
        time: "30 min",
        title: "Ask.",
        body: "Define the core intent. The team brings the questions around it.",
      },
      {
        num: "02",
        time: "45 min",
        title: "Play.",
        body: "People take roles in the situation. You play the decision out together.",
      },
      {
        num: "03",
        time: "2 h",
        title: "See.",
        body: "You see how it actually unfolds. What works. What doesn't.",
      },
      {
        num: "04",
        time: "45 min",
        title: "Decide.",
        body: "You leave aligned. Clear on what happens next.",
      },
    ],
    outcomesLabel: "What you leave with",
    outcomes: [
      {
        name: "Sight",
        body: "You step outside your role and see what's been invisible. Not a report. Not a framework. The thing that was right in front of you the whole time.",
      },
      {
        name: "Trust",
        body: "Not agreement. Not compromise. The kind of trust that comes from standing in the same room, playing the same future, and realizing you believe in the same thing.",
      },
      {
        name: "Momentum",
        body: "People leave Mars not with a plan but with a direction they feel in their bones. That's when things start moving.",
      },
    ],
    includedLabel: "What is included",
    included: [
      "Pre session call to shape the question",
      "The flagship stage on Národní 10 in Prague",
      "Playmaker and Producer on stage",
      "Written reflection delivered 48 hours after",
      "One follow up call within 30 days",
    ],
    notLabel: "What it is not",
    not: [
      "A workshop with exercises and flip charts",
      "Team building or personality profiling",
      "Coaching, therapy, or mediation",
      "A presentation you will watch",
      "Something you will forget by next quarter",
    ],
    casesLabel: "Played on Mars",
    cases: [
      {
        client: "Direct Group",
        body: "Unleashed a collective vision that unified the entire group, built a world-class management team, and expanded into the Polish and Austrian markets.",
      },
      {
        client: "Forbes",
        body: "Imagined what it would take to 10x its revenue and realised it must evolve from a media company to a platform that fuels national confidence.",
      },
      {
        client: "House of Lobkowicz",
        body: "Explored what a modern noble family could stand for over the next 700 years, and how to navigate the role of an essential cultural guardian.",
      },
      {
        client: "Oktagon MMA",
        body: "Played out its European expansion and brought to life a new vision — Face Your Fear — now used across all its markets.",
      },
    ],
    rosterLabel: "Also played on Mars",
    testimonialLabel: "What they said",
    ctaHeadline: "Ready to bring your decision to Mars?",
    ctaSub:
      "Start with a 30-minute intro call. We'll see if Mars is the right room for your decision.",
    ctaPrimary: "Book a 30-min intro call",
    ctaSecondary: "Talk to our team",
    milanLabel: "The person in the room with you",
    milanName: "Milan Semelak",
    milanRole: "Creator of Stage on Mars",
    milanLine:
      "Has guided boards of banks, founders of empires, and families guarding centuries of legacy. Will provoke you. Relentlessly.",
    faqLabel: "Questions we hear a lot",
    faq: [
      {
        q: "Can we do it at our office?",
        a: "We mostly do it at Národní 10, the space is part of why it works. But we can come to you. Write, tell us where and when, we'll figure it out.",
      },
      {
        q: "What if the decision turns out to be bigger than four hours?",
        a: "It often does. We'll tell you at the end whether a second session would help. About 40 percent of teams come back.",
      },
      {
        q: "Is the price fixed?",
        a: "Yes. 95 000 Kč, everything included. No hidden scope, no negotiations.",
      },
      {
        q: "Who should be in the room?",
        a: "The people who will have to live with the decision. Usually the CEO and three to eight people from the leadership or board. Twenty is the hard ceiling.",
      },
    ],
    nextSlotFallback: "3 weeks",
    nextSlotPrefix: "",
    deckLabel: "Intro Deck to Mars",
    deckTitle: "Take Mars with you.",
    deckSub: "The full Stage on Mars deck — method, cases, and what it looks like on stage. 7 MB PDF.",
    deckCta: "Download the deck",
  },
  cs: {
    crumb: "Stage",
    productName: "Rozhodnutí na Marsu",
    heroEyebrow: "Decisions on Mars · Čtyři hodiny · Národní 10, Praha",
    heroHeadlineL1: "Zahrajte si rozhodnutí.",
    heroHeadlineL2: "Pak ho udělejte.",
    heroSub:
      "Čtyřhodinová živá hra jednoho rozhodnutí, které váš tým v meetingu neudělá. Na kulaté scéně v Praze.",
    specLabels: {
      duration: "Délka",
      team: "Velikost týmu",
      price: "Cena",
      next: "Nejbližší termín",
    },
    specValues: {
      duration: "4 hodiny",
      team: "Do 20 lidí",
      price: "95 000 Kč",
      next: "3 týdny",
    },
    bridgeLabel: "Jak to reálně vypadá",
    bridgeCaption: "Stage. Národní 10, Praha.",
    whatItIsHeadline: "Prožijte rozhodnutí dřív.",
    whatItIsDeck:
      "Stage on Mars je 4hodinové prostředí pro rozhodování, které promění týdny přemýšlení v jeden prožitý okamžik.",
    bridgeParagraph:
      "Před hrou si rozdáte systém. Váš CFO stojí za The Board. Vaše šéfka prodeje za The Market. Playmaker drží strukturu, Producer drží sál. Během čtyř hodin se na kulaté scéně to, co se v meetingu nikdy neřekne, stane něčím, co vidíte, můžete s tím pohnout a rozhodnout se.",
    formulaLabel: "Metoda",
    fiveStat: "Jen 5 % lidí vidí to, co vy.",
    fiveSource: "Harvard Business Review · Amy Gallo",
    fiveBody:
      "Lidé nestaví to, čemu nevěří. Believe → Understand → Build. Na Marsu si to zahrají, ucítí to a začnou věřit tomu samému.",
    bookWhenLabel: "Přijďte, když",
    bookWhen: [
      "Strategie je jasná, ale lidé jí nevěří.",
      "Rozhodnutí leží na stole šest měsíců a nikdo ho nedělá.",
      "Dva týmy se spojily a nový ještě nevznikl.",
      "Cítíte, že něco není v pořádku, ale nikdo to neumí pojmenovat.",
    ],
    fourHoursLabel: "Jak probíhají čtyři hodiny",
    fourHours: [
      {
        num: "01",
        time: "30 min",
        title: "Ask.",
        body: "Definujeme záměr. Tým přinese otázky, které se kolem něj točí.",
      },
      {
        num: "02",
        time: "45 min",
        title: "Play.",
        body: "Lidé vstoupí do rolí v situaci. Rozhodnutí si zahrajete společně.",
      },
      {
        num: "03",
        time: "2 h",
        title: "See.",
        body: "Uvidíte, jak se to reálně odehraje. Co funguje. Co ne.",
      },
      {
        num: "04",
        time: "45 min",
        title: "Decide.",
        body: "Odcházíte sjednocení. Jasno v tom, co bude dál.",
      },
    ],
    outcomesLabel: "S čím odcházíte",
    outcomes: [
      {
        name: "Sight",
        body: "Vystoupíte ze své role a uvidíte, co bylo neviditelné. Není to report. Není to framework. Je to to, co jste měli celou dobu před očima.",
      },
      {
        name: "Trust",
        body: "Ne souhlas. Ne kompromis. Takový druh důvěry, který vzniká, když stojíte ve stejné místnosti, hrajete stejnou budoucnost a uvědomíte si, že věříte tomu samému.",
      },
      {
        name: "Momentum",
        body: "Lidé odcházejí z Marsu ne s plánem, ale se směrem, který cítí v kostech. Tehdy se věci začnou hýbat.",
      },
    ],
    includedLabel: "Co je zahrnuto",
    included: [
      "Pre session hovor, kde ladíme otázku",
      "Naše vlajková stage na Národní 10 v Praze",
      "Playmaker a Producer na stage",
      "Písemná reflexe do 48 hodin",
      "Jeden follow up hovor do 30 dnů",
    ],
    notLabel: "Co to není",
    not: [
      "Workshop s cvičeními a flipcharty",
      "Teambuilding nebo personality profiling",
      "Koučink, terapie nebo mediace",
      "Prezentace, kterou budete sledovat",
      "Něco, co zapomenete do dalšího kvartálu",
    ],
    casesLabel: "Hráno na Marsu",
    cases: [
      {
        client: "Direct Group",
        body: "Uvolnili kolektivní vizi, která sjednotila celou skupinu, vybudovali špičkový management a expandovali na polský a rakouský trh.",
      },
      {
        client: "Forbes",
        body: "Představili si, co by znamenalo 10× zvýšit výnosy, a pochopili, že se musí z mediálního domu stát platforma, která živí národní sebevědomí.",
      },
      {
        client: "House of Lobkowicz",
        body: "Zkoumali, co může moderní šlechtická rodina představovat v horizontu následujících 700 let a jak navigovat roli klíčového kulturního strážce.",
      },
      {
        client: "Oktagon MMA",
        body: "Odehráli svou evropskou expanzi a přivedli k životu novou vizi — Face Your Fear — dnes používanou napříč všemi trhy.",
      },
    ],
    rosterLabel: "Také hráli na Marsu",
    testimonialLabel: "Co o tom říkají",
    ctaHeadline: "Připraveni přivést své rozhodnutí na Mars?",
    ctaSub: "Začněte 30minutovým úvodním hovorem. Uvidíme, jestli je Mars pro vaše rozhodnutí ten pravý prostor.",
    ctaPrimary: "Rezervovat 30min úvodní hovor",
    ctaSecondary: "Mluvit s naším týmem",
    milanLabel: "Člověk, se kterým budete v sále",
    milanName: "Milan Šemelák",
    milanRole: "Tvůrce Stage on Mars",
    milanLine:
      "Provedl bankovní boardy, zakladatele impérií a rodiny, které střeží staletí dědictví. Bude vás provokovat. Neúprosně.",
    faqLabel: "Časté otázky",
    faq: [
      {
        q: "Můžeme to udělat u nás v kanceláři?",
        a: "Většinou to děláme u nás na Národní 10, prostor je součást toho, proč to funguje. Ale umíme přijít i za vámi. Napište, řekněte kde a kdy, domluvíme se.",
      },
      {
        q: "Co když se ukáže, že rozhodnutí je větší než čtyři hodiny?",
        a: "Často se to stane. Na konci vám řekneme, jestli by pomohla druhá session. Asi 40 procent týmů se vrací.",
      },
      {
        q: "Je cena fixní?",
        a: "Ano. 95 000 Kč, vše zahrnuto. Žádný skrytý rozsah, žádné vyjednávání.",
      },
      {
        q: "Kdo má být v sále?",
        a: "Lidé, kteří s rozhodnutím budou muset žít. Obvykle CEO a tři až osm lidí z leadershipu nebo boardu. Dvacet je horní hranice.",
      },
    ],
    nextSlotFallback: "3 týdny",
    nextSlotPrefix: "",
    deckLabel: "Intro Deck to Mars",
    deckTitle: "Vezměte si Mars s sebou.",
    deckSub: "Kompletní Stage on Mars deck — metoda, případy a jak to vypadá na stage. 7 MB PDF.",
    deckCta: "Stáhnout deck",
  },
  sk: {
    crumb: "Stage",
    productName: "Rozhodnutia na Marse",
    heroEyebrow: "Decisions on Mars · Štyri hodiny · Národní 10, Praha",
    heroHeadlineL1: "Zahrajte si rozhodnutie.",
    heroHeadlineL2: "Potom ho urobte.",
    heroSub:
      "Štvorhodinová živá hra jedného rozhodnutia, ktoré váš tím v meetingu neurobí. Na kruhovom javisku v Prahe.",
    specLabels: {
      duration: "Dĺžka",
      team: "Veľkosť tímu",
      price: "Cena",
      next: "Najbližší termín",
    },
    specValues: {
      duration: "4 hodiny",
      team: "Do 20 ľudí",
      price: "95 000 Kč",
      next: "3 týždne",
    },
    bridgeLabel: "Ako to reálne vyzerá",
    bridgeCaption: "Stage. Národní 10, Praha.",
    whatItIsHeadline: "Prežite rozhodnutie skôr.",
    whatItIsDeck:
      "Stage on Mars je 4-hodinové prostredie pre rozhodovanie, ktoré premení týždne premýšľania v jeden prežitý moment.",
    bridgeParagraph:
      "Pred hrou si rozdáte systém. Váš CFO stojí za The Board. Vaša šéfka predaja za The Market. Playmaker drží štruktúru, Producer drží sálu. Počas štyroch hodín sa na kruhovom javisku to, čo sa v meetingu nikdy nepovie, stane niečím, čo vidíte, môžete s tým pohnúť a rozhodnúť sa.",
    formulaLabel: "Metóda",
    fiveStat: "Iba 5 % ľudí vidí to, čo vy.",
    fiveSource: "Harvard Business Review · Amy Gallo",
    fiveBody:
      "Ľudia nestavajú to, čomu neveria. Believe → Understand → Build. Na Marse si to zahrajú, ucítia to a začnú veriť tomu istému.",
    bookWhenLabel: "Príďte, keď",
    bookWhen: [
      "Stratégia je jasná, ale ľudia jej neveria.",
      "Rozhodnutie leží na stole šesť mesiacov a nikto ho nerobí.",
      "Dva tímy sa spojili a nový ešte nevznikol.",
      "Cítite, že niečo nie je v poriadku, ale nikto to nevie pomenovať.",
    ],
    fourHoursLabel: "Ako prebiehajú štyri hodiny",
    fourHours: [
      {
        num: "01",
        time: "30 min",
        title: "Ask.",
        body: "Definujeme zámer. Tím prinesie otázky, ktoré sa okolo neho točia.",
      },
      {
        num: "02",
        time: "45 min",
        title: "Play.",
        body: "Ľudia vstúpia do rolí v situácii. Rozhodnutie si zahráte spoločne.",
      },
      {
        num: "03",
        time: "2 h",
        title: "See.",
        body: "Uvidíte, ako sa to reálne odohrá. Čo funguje. Čo nie.",
      },
      {
        num: "04",
        time: "45 min",
        title: "Decide.",
        body: "Odchádzate zjednotení. Jasno v tom, čo bude ďalej.",
      },
    ],
    outcomesLabel: "S čím odchádzate",
    outcomes: [
      {
        name: "Sight",
        body: "Vystúpite zo svojej roly a uvidíte, čo bolo neviditeľné. Nie je to report. Nie je to framework. Je to to, čo ste mali celý čas pred očami.",
      },
      {
        name: "Trust",
        body: "Nie súhlas. Nie kompromis. Druh dôvery, ktorý vzniká, keď stojíte v rovnakej miestnosti, hráte rovnakú budúcnosť a uvedomíte si, že veríte tomu istému.",
      },
      {
        name: "Momentum",
        body: "Ľudia odchádzajú z Marsu nie s plánom, ale so smerom, ktorý cítia v kostiach. Vtedy sa veci začnú hýbať.",
      },
    ],
    includedLabel: "Čo je zahrnuté",
    included: [
      "Pre session hovor, kde ladíme otázku",
      "Naša vlajková stage na Národní 10 v Prahe",
      "Playmaker a Producer na stage",
      "Písomná reflexia do 48 hodín",
      "Jeden follow up hovor do 30 dní",
    ],
    notLabel: "Čo to nie je",
    not: [
      "Workshop s cvičeniami a flipchartmi",
      "Teambuilding alebo personality profiling",
      "Koučing, terapia alebo mediácia",
      "Prezentácia, ktorú budete sledovať",
      "Niečo, čo zabudnete do ďalšieho kvartálu",
    ],
    casesLabel: "Hrané na Marse",
    cases: [
      {
        client: "Direct Group",
        body: "Uvoľnili kolektívnu víziu, ktorá zjednotila celú skupinu, vybudovali špičkový manažment a expandovali na poľský a rakúsky trh.",
      },
      {
        client: "Forbes",
        body: "Predstavili si, čo by znamenalo 10× zvýšiť výnosy, a pochopili, že sa musia z mediálneho domu stať platformou, ktorá živí národné sebavedomie.",
      },
      {
        client: "House of Lobkowicz",
        body: "Skúmali, čo môže moderná šľachtická rodina predstavovať v horizonte ďalších 700 rokov a ako navigovať úlohu kľúčového kultúrneho strážcu.",
      },
      {
        client: "Oktagon MMA",
        body: "Odohrali svoju európsku expanziu a priviedli k životu novú víziu — Face Your Fear — dnes používanú naprieč všetkými trhmi.",
      },
    ],
    rosterLabel: "Tiež hrali na Marse",
    testimonialLabel: "Čo o tom hovoria",
    ctaHeadline: "Pripravení priviesť svoje rozhodnutie na Mars?",
    ctaSub: "Začnite 30-minútovým úvodným hovorom. Uvidíme, či je Mars pre vaše rozhodnutie ten správny priestor.",
    ctaPrimary: "Rezervovať 30min úvodný hovor",
    ctaSecondary: "Hovoriť s naším tímom",
    milanLabel: "Človek, s ktorým budete v sále",
    milanName: "Milan Šemelák",
    milanRole: "Tvorca Stage on Mars",
    milanLine:
      "Previedol bankové boardy, zakladateľov impérií a rodiny, ktoré strážia stáročia dedičstva. Bude vás provokovať. Neúprosne.",
    faqLabel: "Časté otázky",
    faq: [
      {
        q: "Môžeme to urobiť u nás v kancelárii?",
        a: "Väčšinou to robíme u nás na Národnej 10, priestor je súčasťou toho, prečo to funguje. Ale vieme prísť aj za vami. Napíšte, povedzte kde a kedy, dohodneme sa.",
      },
      {
        q: "Čo ak sa ukáže, že rozhodnutie je väčšie než štyri hodiny?",
        a: "Často sa to stane. Na konci vám povieme, či by pomohla druhá session. Asi 40 percent tímov sa vracia.",
      },
      {
        q: "Je cena fixná?",
        a: "Áno. 95 000 Kč, všetko zahrnuté. Žiadny skrytý rozsah, žiadne vyjednávanie.",
      },
      {
        q: "Kto má byť v sále?",
        a: "Ľudia, ktorí s rozhodnutím budú musieť žiť. Zvyčajne CEO a tri až osem ľudí z leadershipu alebo boardu. Dvadsať je horná hranica.",
      },
    ],
    nextSlotFallback: "3 týždne",
    nextSlotPrefix: "",
    deckLabel: "Intro Deck to Mars",
    deckTitle: "Vezmite si Mars so sebou.",
    deckSub: "Kompletný Stage on Mars deck — metóda, prípady a ako to vyzerá na stage. 7 MB PDF.",
    deckCta: "Stiahnuť deck",
  },
};

const LOCALE_TO_INTL: Record<Locale, string> = {
  en: "en-GB",
  cs: "cs-CZ",
  sk: "sk-SK",
};

function formatSlot(iso: string, locale: Locale): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(LOCALE_TO_INTL[locale], {
      day: "numeric",
      month: "long",
    }).format(d);
  } catch {
    return "";
  }
}

function CyclingQuote() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const all = [FEATURED_QUOTE, ...QUOTES];
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % all.length);
        setVisible(true);
      }, 700);
    }, 4500);
    return () => clearInterval(interval);
  }, [all.length]);
  const q = all[idx];
  return (
    <div className="min-h-[180px] sm:min-h-[200px] flex flex-col items-center justify-center text-center">
      <blockquote
        className={`font-mercure italic text-white text-[24px] sm:text-[36px] leading-[1.2] tracking-[-0.015em] max-w-[32ch] mx-auto transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        &ldquo;{q.quote}&rdquo;
      </blockquote>
      <p
        className={`mt-5 text-[11px] sm:text-[12px] font-semibold text-mars tracking-wide uppercase transition-all duration-700 delay-100 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {q.name}
        <span className="text-white/30 mx-2">·</span>
        <span className="text-white/60">{q.org}</span>
      </p>
    </div>
  );
}

export default function DecisionsOnMarsPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [hydrated, setHydrated] = useState(false);
  const [slotIso, setSlotIso] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      window.localStorage.getItem("som_locale")) as Locale | null;
    if (stored && LOCALES.includes(stored)) {
      setLocale(stored);
    }
    setHydrated(true);
  }, []);

  // Persist locale changes
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("som_locale", locale);
  }, [locale, hydrated]);

  // Fetch next slot from Calendly (via our API route). Graceful fallback
  // if the endpoint returns null or fails.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/next-slot")
      .then((r) => (r.ok ? r.json() : { slot: null }))
      .then((data: { slot: string | null }) => {
        if (!cancelled && data?.slot) setSlotIso(data.slot);
      })
      .catch(() => {
        /* fall back to static label */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Update <title> to reflect the active locale
  useEffect(() => {
    if (!hydrated) return;
    document.title = `${CONTENT[locale].productName} · Stage on Mars`;
  }, [locale, hydrated]);

  // Load Calendly widget assets once on mount
  useEffect(() => {
    const href = "https://assets.calendly.com/assets/external/widget.css";
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }

    const src = "https://assets.calendly.com/assets/external/widget.js";
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openCalendly = (url: string) => {
    if (typeof window === "undefined") return;
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url });
    } else {
      // Fallback: open the booking page in a new tab if the widget hasn't loaded
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const t = CONTENT[locale];
  const nextSlotValue = slotIso ? formatSlot(slotIso, locale) : t.nextSlotFallback;

  return (
    <div className="min-h-screen bg-neutral-50 text-black">
      {/* ─── Top navigation ─────────────────────────────────── */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-4 flex items-center justify-between gap-4">
          <Link href="/business" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.png"
              alt="Stage on Mars"
              className="h-7 sm:h-8 w-auto"
            />
            <span className="hidden sm:inline-block w-px h-5 bg-neutral-200" />
            <span className="hidden sm:inline text-[11px] uppercase tracking-[0.22em] font-semibold text-neutral-500 group-hover:text-black transition-colors truncate">
              {t.productName}
            </span>
          </Link>

          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold">
            {LOCALES.map((code, i) => (
              <span key={code} className="flex items-center">
                <button
                  onClick={() => setLocale(code)}
                  className={`px-1.5 py-0.5 transition-colors ${
                    locale === code
                      ? "text-mars"
                      : "text-neutral-400 hover:text-black"
                  }`}
                  aria-pressed={locale === code}
                >
                  {code.toUpperCase()}
                </button>
                {i < LOCALES.length - 1 && (
                  <span className="text-neutral-300">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── Hero: cinematic + primary CTA ────────────────── */}
      <section className="relative bg-black text-white overflow-hidden min-h-[90vh] flex items-end">
        <img
          src="/stage.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-10 pb-16 sm:pb-24 pt-32 sm:pt-44 w-full">
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 border border-white/20 rounded-full text-[11px] sm:text-[12px] font-medium tracking-wide text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-mars" />
            Decisions on Mars
          </div>
          <h1 className="font-black text-[56px] sm:text-[112px] leading-[0.92] tracking-[-0.045em] mb-6">
            <span className="block">{t.heroHeadlineL1}</span>
            <span className="block text-white/70">{t.heroHeadlineL2}</span>
          </h1>
          <p className="text-[17px] sm:text-[22px] text-white/80 leading-[1.45] max-w-[34rem] mb-10">
            {t.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => openCalendly(CALENDLY_URL_INTRO)}
              className="inline-flex items-center justify-center gap-2 bg-mars text-white text-[14px] sm:text-[15px] font-semibold tracking-[-0.01em] px-6 py-4 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              {t.ctaPrimary}
              <span aria-hidden>→</span>
            </button>
            <p className="text-[13px] sm:text-[14px] text-white/60">
              or visit our{" "}
              <a
                href="https://maps.app.goo.gl/D7oSvpGWYkhuLaFh9"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/30 hover:decoration-white hover:text-white transition-colors"
              >
                Flagship Stage in Prague
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ─── Product card: the purchase focal point ─────────── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-10 -mt-10 sm:-mt-16 relative z-10">
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {[
              { label: t.specLabels.duration, value: t.specValues.duration },
              { label: t.specLabels.team, value: t.specValues.team },
              { label: t.specLabels.price, value: t.specValues.price },
              { label: t.specLabels.next, value: nextSlotValue },
            ].map((cell, i) => (
              <div
                key={i}
                className={`p-5 sm:p-6 ${
                  i > 0 ? "sm:border-l border-neutral-200" : ""
                } ${i === 2 ? "border-l border-neutral-200 sm:border-l" : ""} ${
                  i === 1 ? "border-l border-neutral-200 sm:border-l" : ""
                } ${i === 3 ? "border-l border-neutral-200 sm:border-l" : ""} ${
                  i < 2 ? "border-b border-neutral-200 sm:border-b-0" : ""
                }`}
              >
                <p className="text-[11px] sm:text-[12px] text-neutral-500 font-medium mb-2">
                  {cell.label}
                </p>
                <p className="text-[16px] sm:text-[18px] font-semibold tracking-[-0.01em] text-black">
                  {cell.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-5 sm:px-10 py-14 sm:py-20">
        {/* ─── What it is + method formula ──────────────────── */}
        <section className="mb-14 sm:mb-20 max-w-3xl">
          <p className="font-mercure text-[32px] sm:text-[48px] leading-[1.1] tracking-[-0.02em] text-black max-w-[22ch]">
            {t.whatItIsDeck}
          </p>
        </section>

        {/* ─── The 5% hook: evidence anchor ─────────────────── */}
        <section className="mb-14 sm:mb-20">
          <div className="bg-black text-white rounded-2xl p-8 sm:p-12 grid sm:grid-cols-[auto_1fr] gap-8 sm:gap-12 items-center">
            <div className="font-mercure text-[72px] sm:text-[128px] leading-[0.9] tracking-[-0.04em] text-mars">
              5%
            </div>
            <div>
              <p className="font-mercure text-[22px] sm:text-[32px] leading-[1.15] tracking-[-0.015em] text-white mb-4 max-w-[26ch]">
                {t.fiveStat}
              </p>
              <p className="text-[11px] sm:text-[12px] font-semibold text-white/50 tracking-wide uppercase mb-6">
                {t.fiveSource}
              </p>
              <p className="text-[15px] sm:text-[17px] leading-[1.55] text-white/80 max-w-[38rem] mb-6">
                {t.fiveBody}
              </p>
              <p className="text-[11px] sm:text-[12px] font-semibold text-mars tracking-[0.22em] uppercase">
                In hours, not months.
              </p>
            </div>
          </div>
        </section>

        {/* ─── How it runs (timeline) ───────────────────────── */}
        <section className="mb-14 sm:mb-20">
          <h2 className="font-mercure text-[28px] sm:text-[40px] leading-[1.1] tracking-[-0.02em] mb-8 text-black max-w-[20ch]">
            {t.fourHoursLabel}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {t.fourHours.map((step, i) => (
              <div
                key={i}
                className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-7 hover:border-neutral-300 transition-colors"
              >
                <div className="mb-4">
                  <span className="text-[14px] font-semibold text-mars">
                    {step.num}
                  </span>
                </div>
                <p className="text-[17px] sm:text-[18px] font-semibold mb-2 tracking-[-0.01em]">
                  {step.title}
                </p>
                <p className="text-[14px] sm:text-[15px] leading-[1.55] text-neutral-600">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Book this when / Not for ─────────────────────── */}
        <section className="mb-14 sm:mb-20 grid sm:grid-cols-2 gap-10 sm:gap-14">
          <div>
            <p className="text-[11px] sm:text-[12px] font-semibold text-mars tracking-wide uppercase mb-4">
              {t.bookWhenLabel}
            </p>
            <ul className="space-y-4">
              {t.bookWhen.map((line, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[15px] sm:text-[16px] leading-[1.5] text-neutral-800"
                >
                  <span className="text-mars shrink-0 mt-0.5">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] sm:text-[12px] font-semibold text-neutral-500 tracking-wide uppercase mb-4">
              {t.notLabel}
            </p>
            <ul className="space-y-4">
              {t.not.map((line, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[15px] sm:text-[16px] leading-[1.5] text-neutral-500"
                >
                  <span className="text-neutral-300 shrink-0 mt-0.5">✕</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── Editorial pull quote (visual break) ──────────── */}
        <section className="mb-14 sm:mb-20">
          <figure className="max-w-3xl mx-auto text-center">
            <blockquote className="font-mercure italic text-black text-[32px] sm:text-[56px] leading-[1.05] tracking-[-0.025em]">
              &ldquo;It either confirms what you believe, or shows you a different reality.&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-[11px] sm:text-[12px] font-semibold text-mars tracking-[0.18em] uppercase">
              Alexandra Lobkowicz
              <span className="text-neutral-300 mx-2">·</span>
              <span className="text-neutral-500">House of Lobkowicz</span>
            </figcaption>
          </figure>
        </section>

        {/* ─── Outcomes: Sight / Trust / Momentum (dark, editorial) ── */}
        <section className="mb-14 sm:mb-20 bg-neutral-950 text-white rounded-2xl p-8 sm:p-12">
          <h2 className="font-mercure text-[28px] sm:text-[40px] leading-[1.1] tracking-[-0.02em] text-white mb-8 sm:mb-10">
            {t.outcomesLabel}
          </h2>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {t.outcomes.map((o, i) => (
              <div
                key={i}
                className="grid sm:grid-cols-[100px_1fr] gap-4 sm:gap-10 py-6 sm:py-8 items-start"
              >
                <div className="flex items-baseline gap-4 sm:block">
                  <span className="font-mercure text-[40px] sm:text-[56px] leading-[0.9] text-mars">
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <p className="font-mercure text-[24px] sm:text-[32px] leading-[1.1] tracking-[-0.015em] mb-3 text-white">
                    {o.name}.
                  </p>
                  <p className="text-[15px] sm:text-[17px] leading-[1.55] text-white/75 max-w-[48ch]">
                    {o.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* What's included (quiet footer) */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[11px] sm:text-[12px] font-semibold text-white/60 tracking-wide uppercase mb-4">
              {t.includedLabel}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3 max-w-3xl">
              {t.included.map((line, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[14px] sm:text-[15px] leading-[1.5] text-white/70"
                >
                  <span className="text-white/30 shrink-0 mt-0.5">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── Proof: cycling quote → logos → case studies ──── */}
        <section className="mb-14 sm:mb-20 bg-black text-white rounded-2xl p-8 sm:p-12">
          <CyclingQuote />

          <div className="mt-10 pt-8 border-t border-white/10 flex justify-center">
            <img
              src="/clients.png"
              alt="Forbes · Škoda · YPO · PwC · O₂ · UniCredit · Oktagon MMA · House of Lobkowicz · London Business School · Česká spořitelna · Lasvit · Ipsen · MSD · Direct Group · Raiffeisenbank"
              className="w-full max-w-3xl opacity-70 invert"
            />
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 grid sm:grid-cols-2 gap-5 sm:gap-6">
            {t.cases.map((c, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6"
              >
                <p className="text-[13px] sm:text-[14px] font-semibold text-white mb-2">
                  {c.client}
                </p>
                <p className="text-[14px] sm:text-[15px] leading-[1.55] text-white/75">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Final CTA: product purchase moment ───────────── */}
        <section className="mb-20 sm:mb-28 bg-neutral-50 border border-neutral-200 rounded-2xl p-8 sm:p-14">
          <div className="max-w-2xl">
            <h2 className="font-mercure text-[32px] sm:text-[48px] leading-[1.05] tracking-[-0.02em] mb-5 text-black">
              {t.ctaHeadline}
            </h2>
            <p className="text-[16px] sm:text-[18px] text-neutral-600 leading-[1.55] mb-8">
              {t.ctaSub}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
              <button
                type="button"
                onClick={() => openCalendly(CALENDLY_URL_INTRO)}
                className="inline-flex items-center justify-center gap-2 bg-black text-white text-[14px] sm:text-[15px] font-semibold px-6 py-4 rounded-full hover:bg-mars transition-colors"
              >
                {t.ctaPrimary}
                <span aria-hidden>→</span>
              </button>
              <p className="text-[13px] sm:text-[14px] text-neutral-500">
                Free · 30 minutes · online or in person
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-200 flex items-start gap-5 sm:gap-6">
              <img
                src="/milan3.jpg"
                alt={t.milanName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[15px] sm:text-[17px] font-semibold tracking-[-0.01em] text-black">
                  {t.milanName}
                </p>
                <p className="text-[12px] sm:text-[13px] text-mars font-semibold tracking-wide uppercase mb-3">
                  {t.milanRole}
                </p>
                <p className="text-[14px] sm:text-[15px] leading-[1.45] text-neutral-600 mb-3">
                  {t.milanLine}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => openCalendly(CALENDLY_URL_INTRO)}
                    className="text-[13px] sm:text-[14px] font-semibold text-black hover:text-mars transition-colors text-left"
                  >
                    {t.ctaSecondary} →
                  </button>
                  <span className="hidden sm:inline text-neutral-300">·</span>
                  <a
                    href="https://www.linkedin.com/in/milansemelak/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] sm:text-[14px] font-semibold text-neutral-500 hover:text-black transition-colors text-left"
                  >
                    LinkedIn →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────── */}
        <section>
          <p className="text-[11px] sm:text-[12px] font-semibold text-mars tracking-wide uppercase mb-4">
            {t.faqLabel}
          </p>
          <div>
            {t.faq.map((item, i) => (
              <details
                key={i}
                className="py-5 border-t border-neutral-200 last:border-b group"
              >
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                  <span className="text-[15px] sm:text-[17px] font-semibold tracking-[-0.01em]">
                    {item.q}
                  </span>
                  <span className="text-neutral-400 text-[20px] leading-none shrink-0 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[14px] sm:text-[15px] leading-[1.6] text-neutral-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── Deck download ────────────────────────────────── */}
        <section className="mt-20 sm:mt-28">
          <div className="bg-black text-white rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-[11px] sm:text-[12px] font-semibold text-mars tracking-[0.22em] uppercase mb-4">
                {t.deckLabel}
              </p>
              <h2 className="font-mercure text-[28px] sm:text-[40px] leading-[1.05] tracking-[-0.02em] mb-3">
                {t.deckTitle}
              </h2>
              <p className="text-[14px] sm:text-[16px] leading-[1.55] text-white/70">
                {t.deckSub}
              </p>
            </div>
            <a
              href="/stage-on-mars-deck.pdf"
              download
              className="inline-flex items-center justify-center gap-2 bg-mars text-white text-[14px] sm:text-[15px] font-semibold tracking-[-0.01em] px-6 py-4 rounded-full hover:bg-white hover:text-black transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              {t.deckCta}
              <span aria-hidden>↓</span>
            </a>
          </div>
        </section>

        {/* ─── Footer spacer ────────────────────────────────── */}
        <div className="h-20" />
      </main>
    </div>
  );
}
