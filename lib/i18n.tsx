"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "sk" | "cs";

const translations = {
  en: {
    // Header
    humanFutureSimulator: "Go to Mars",
    // Play page
    headline: "The Playmaker",
    subheadline: "Turn the question into a play to see what you can't see alone",
    facilitatorMode: "3 Plays",
    facilitatorSub: "",
    selfService: "1 Simulation",
    selfServiceSub: "",
    simulationTitle: "Simulation Scenario",
    simulationSub: "How the play might unfold",
    perspectivesTitle: "Possible Perspectives",
    placeholder: "What question do you want to explore?",
    needHelp: "Need help?",
    hide: "Hide",
    questionTriangle: "Question Triangle",
    generatePlay: "Generate Play",
    generating: "Creating your play",
    errorMessage: "Failed to generate play. Make sure your API key is configured.",
    yourPlay: "Your Play",
    playOptions: "Play Options",
    forQuestion: "For",
    regenerate: "New play",
    option: "Option",
    // Play card sections
    theImage: "The Image",
    characters: "Characters",
    authorsRole: "Author's Role",
    endingPerspective: "Ending Perspective",
    players: "players",
    // Question Triangle
    it: "It",
    itDesc: "External — a situation, project, decision",
    us: "Us",
    usDesc: "Collective — a team, relationship, group",
    me: "Me",
    meDesc: "Personal — identity, purpose, inner conflict",
    // Character generator
    characterGeneratorTitle: "Role Generator",
    characterGeneratorSub: "Based on your question and group size, generate roles to bring into play.",
    generateCharacters: "Generate Roles",
    characterPlaceholder: "What question do you need roles for?",
    personal: "Personal",
    business: "Business",
    // Prescription
    prescribe: "Take it to Mars!",
    prescriptionTitle: "Your Play",
    prescribedFor: "Question",
    prescriptionDate: "Date",
    takeToStage: "Play it live on Mars!",
    prescribed: "Taken to Mars",
    savedPlays: "Your Plays",
    saveImage: "Save as Image",
    shareEmail: "Send to Email",
    // Landing page
    landingHeadline1: "Question",
    landingHeadline2: "Play",
    landingHeadline3: "Perspective",
    landingDesc: "Transform any question into a Systemic Play — an experiential method that expands perspective through collective creativity, movement, and connection.",
    generateAPlay: "Generate a Play",
    ask: "Ask",
    askDesc: "Bring your question — personal, collective, or about a situation. The question is the currency.",
    play: "Play",
    playDesc: "Get a unique Systemic Play with scene, characters, your role, and ending. Ready to perform.",
    see: "See",
    seeDesc: "Expand your perspective. Not answers — new ways of seeing through collective creativity.",
    // Loading messages
    loading1: "Looking at your question from angles you haven't tried...",
    loading2: "Finding the characters hiding in your question...",
    loading3: "Building a stage for what needs to be seen...",
    loading4: "Mapping the tension between what you know and what you feel...",
    loading5: "Designing a play that sees what you can't see alone...",
    // Daily questions
    dailyQ1: "What are you avoiding?",
    dailyQ2: "What would change if you stopped pretending?",
    dailyQ3: "What does your team need but won't ask for?",
    dailyQ4: "What would you do if nobody was watching?",
    dailyQ5: "What's the question you're afraid to ask?",
    dailyQ6: "What would your customers say if they were truly honest?",
    dailyQ7: "What are you holding onto that no longer serves you?",
    // Play counter
    playsGenerated: "plays generated",
    // Share
    sharePlay: "Share",
  },
  sk: {
    // Header
    humanFutureSimulator: "Poď na Mars",
    // Play page
    headline: "The Playmaker",
    subheadline: "Premeň otázku na Systemickú hru a uvidíš, čo sám nevidíš",
    facilitatorMode: "3 Hry",
    facilitatorSub: "",
    selfService: "1 Simulácia",
    selfServiceSub: "",
    simulationTitle: "Scenár simulácie",
    simulationSub: "Ako by sa hra mohla odohrať",
    perspectivesTitle: "Možné perspektívy",
    placeholder: "Akú otázku chceš preskúmať?",
    needHelp: "Potrebuješ pomoc?",
    hide: "Skryť",
    questionTriangle: "Trojuholník otázok",
    generatePlay: "Vygeneruj hru",
    generating: "Tvorím tvoju hru",
    errorMessage: "Nepodarilo sa vygenerovať hru. Skontroluj API kľúč.",
    yourPlay: "Tvoja hra",
    playOptions: "Možnosti hry",
    forQuestion: "Pre",
    regenerate: "Nová hra",
    option: "Možnosť",
    // Play card sections
    theImage: "Obraz",
    characters: "Postavy",
    authorsRole: "Rola klienta",
    endingPerspective: "Záver",
    players: "hráčov",
    // Question Triangle
    it: "To",
    itDesc: "Externé — situácia, projekt, rozhodnutie",
    us: "My",
    usDesc: "Kolektívne — tím, vzťah, skupina",
    me: "Ja",
    meDesc: "Osobné — identita, účel, vnútorný konflikt",
    // Landing page
    landingHeadline1: "Otázka",
    landingHeadline2: "Hra",
    landingHeadline3: "Perspektíva",
    landingDesc: "Premeň akúkoľvek otázku na Systemickú hru — zážitkovú metódu, ktorá rozširuje perspektívu cez kolektívnu kreativitu, pohyb a prepojenie.",
    generateAPlay: "Vygeneruj hru",
    ask: "Pýtaj sa",
    askDesc: "Prines svoju otázku — osobnú, kolektívnu alebo o situácii. Otázka je mena.",
    play: "Hraj",
    playDesc: "Získaj unikátnu Systemickú hru s obrazom, postavami, tvojou rolou a záverom. Pripravenú na odehranie.",
    see: "Pozri",
    seeDesc: "Rozšír svoju perspektívu. Nie odpovede — nové spôsoby videnia cez kolektívnu kreativitu.",
    // Character generator
    characterGeneratorTitle: "Role Generator",
    characterGeneratorSub: "Na základe otázky a počtu ľudí navrhne roly do hry",
    generateCharacters: "Vygeneruj roly",
    characterPlaceholder: "Na akú otázku potrebuješ roly?",
    personal: "Osobné",
    business: "Biznis",
    // Prescription
    prescribe: "Take it to Mars!",
    prescriptionTitle: "Tvoja hra",
    prescribedFor: "Otázka",
    prescriptionDate: "Dátum",
    takeToStage: "Odohraj naživo na Marse!",
    prescribed: "Taken to Mars",
    savedPlays: "Tvoje hry",
    saveImage: "Uložiť ako obrázok",
    shareEmail: "Poslať emailom",
    // Loading messages
    loading1: "Pozerám sa na tvoju otázku z uhlov, ktoré si neskúsil...",
    loading2: "Hľadám postavy ukryté v tvojej otázke...",
    loading3: "Staviam scénu pre to, čo potrebuje byť videné...",
    loading4: "Mapujem napätie medzi tým, čo vieš a čo cítiš...",
    loading5: "Navrhujem hru, ktorá vidí, čo sám nevidíš...",
    // Daily questions
    dailyQ1: "Čomu sa vyhýbaš?",
    dailyQ2: "Čo by sa zmenilo, keby si prestal predstierať?",
    dailyQ3: "Čo tvoj tím potrebuje, ale nepýta sa na to?",
    dailyQ4: "Čo by si robil, keby sa nikto nepozeral?",
    dailyQ5: "Aká je otázka, ktorej sa bojíš?",
    dailyQ6: "Čo by povedali tvoji zákazníci, keby boli úprimní?",
    dailyQ7: "Čoho sa držíš, čo ti už neslúži?",
    // Play counter
    playsGenerated: "hier vygenerovaných",
    // Share
    sharePlay: "Zdieľať",
  },
  cs: {
    // Header
    humanFutureSimulator: "Pojď na Mars",
    // Play page
    headline: "The Playmaker",
    subheadline: "Přeměň otázku na Systemickou hru a uvidíš, co sám nevidíš",
    facilitatorMode: "3 Hry",
    facilitatorSub: "",
    selfService: "1 Simulace",
    selfServiceSub: "",
    simulationTitle: "Scénář simulace",
    simulationSub: "Jak by se hra mohla odehrát",
    perspectivesTitle: "Možné perspektivy",
    placeholder: "Jakou otázku chceš prozkoumat?",
    needHelp: "Potřebuješ pomoc?",
    hide: "Skrýt",
    questionTriangle: "Trojúhelník otázek",
    generatePlay: "Vygeneruj hru",
    generating: "Tvořím tvoji hru",
    errorMessage: "Nepodařilo se vygenerovat hru. Zkontroluj API klíč.",
    yourPlay: "Tvoje hra",
    playOptions: "Možnosti hry",
    forQuestion: "Pro",
    regenerate: "Nová hra",
    option: "Možnost",
    // Play card sections
    theImage: "Obraz",
    characters: "Postavy",
    authorsRole: "Role klienta",
    endingPerspective: "Závěr",
    players: "hráčů",
    // Question Triangle
    it: "To",
    itDesc: "Externí — situace, projekt, rozhodnutí",
    us: "My",
    usDesc: "Kolektivní — tým, vztah, skupina",
    me: "Já",
    meDesc: "Osobní — identita, účel, vnitřní konflikt",
    // Landing page
    landingHeadline1: "Otázka",
    landingHeadline2: "Hra",
    landingHeadline3: "Perspektiva",
    landingDesc: "Přeměň jakoukoliv otázku na Systemickou hru — zážitkovou metodu, která rozšiřuje perspektivu skrze kolektivní kreativitu, pohyb a propojení.",
    generateAPlay: "Vygeneruj hru",
    ask: "Ptej se",
    askDesc: "Přines svou otázku — osobní, kolektivní nebo o situaci. Otázka je měna.",
    play: "Hraj",
    playDesc: "Získej unikátní Systemickou hru s obrazem, postavami, tvou rolí a závěrem. Připravenou k odehrání.",
    see: "Podívej",
    seeDesc: "Rozšiř svou perspektivu. Ne odpovědi — nové způsoby vidění skrze kolektivní kreativitu.",
    // Character generator
    characterGeneratorTitle: "Role Generator",
    characterGeneratorSub: "Na základě otázky a počtu lidí navrhne role do hry",
    generateCharacters: "Vygeneruj role",
    characterPlaceholder: "Na jakou otázku potřebuješ role?",
    personal: "Osobní",
    business: "Byznys",
    // Prescription
    prescribe: "Take it to Mars!",
    prescriptionTitle: "Tvoje hra",
    prescribedFor: "Otázka",
    prescriptionDate: "Datum",
    takeToStage: "Odehraj naživo na Marsu!",
    prescribed: "Taken to Mars",
    savedPlays: "Tvoje hry",
    saveImage: "Uložit jako obrázek",
    shareEmail: "Poslat emailem",
    // Loading messages
    loading1: "Dívám se na tvou otázku z úhlů, které jsi nezkusil...",
    loading2: "Hledám postavy ukryté v tvé otázce...",
    loading3: "Stavím scénu pro to, co potřebuje být viděno...",
    loading4: "Mapuji napětí mezi tím, co víš a co cítíš...",
    loading5: "Navrhuji hru, která vidí, co sám nevidíš...",
    // Daily questions
    dailyQ1: "Čemu se vyhýbáš?",
    dailyQ2: "Co by se změnilo, kdybys přestal předstírat?",
    dailyQ3: "Co tvůj tým potřebuje, ale neptá se na to?",
    dailyQ4: "Co bys dělal, kdyby se nikdo nedíval?",
    dailyQ5: "Jaká je otázka, které se bojíš?",
    dailyQ6: "Co by řekli tvoji zákazníci, kdyby byli upřímní?",
    dailyQ7: "Čeho se držíš, co ti už neslouží?",
    // Play counter
    playsGenerated: "her vygenerovaných",
    // Share
    sharePlay: "Sdílet",
  },
} as const;

type Translations = { [K in keyof typeof translations.en]: string };

type I18nContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
};

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("som-lang") as Lang | null;
    if (saved && (saved === "en" || saved === "sk" || saved === "cs")) {
      setLang(saved);
    }
  }, []);

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("som-lang", newLang);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
