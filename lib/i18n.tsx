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
    simulationTitle: "What Happens on Stage",
    simulationSub: "a possible unfolding",
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
    concrete: "concrete",
    abstract: "abstract",
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
    prescriptionHeader: "The Stage on Mars Experience",
    prescribedFor: "Question",
    prescriptionDate: "Date",
    takeToStage: "Play it live on Mars!",
    prescribed: "Taken to Mars",
    savedPlays: "Your Plays",
    saveImage: "Save as Image",
    shareEmail: "Send to Email",
    saving: "Saving...",
    preparing: "Preparing...",
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
    loading1: "What if your question is the wrong question?",
    loading2: "The answer you want isn't the answer you need...",
    loading3: "Setting up the stage. Bodies are entering the space...",
    loading4: "Finding who's already standing in your question...",
    loading5: "It might hurt a little...",
    // Daily questions
    dailyQ1: "What are you avoiding?",
    dailyQ2: "What would change if you stopped pretending?",
    dailyQ3: "What does your team need but won't ask for?",
    dailyQ4: "What value do you actually create?",
    dailyQ5: "What's the question you're afraid to ask?",
    dailyQ6: "What would your customers say if they were brutally honest?",
    dailyQ7: "Who are you when nobody is watching?",
    // Play counter
    playsGenerated: "plays generated",
    // From Mars (step 2)
    fromMars: "Play Simulation",
    loadingMars: "Mars is watching...",
    marsError: "Mars couldn't see this one. Try again.",
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
    simulationTitle: "Čo sa deje na scéne",
    simulationSub: "možný priebeh",
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
    concrete: "konkrétna",
    abstract: "abstraktná",
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
    characterGeneratorTitle: "Generátor rolí",
    characterGeneratorSub: "Na základe otázky a počtu ľudí navrhne roly do hry",
    generateCharacters: "Vygeneruj roly",
    characterPlaceholder: "Na akú otázku potrebuješ roly?",
    personal: "Osobné",
    business: "Biznis",
    // Prescription
    prescribe: "Vezmi to na Mars!",
    prescriptionTitle: "Tvoja hra",
    prescriptionHeader: "Stage on Mars — Zážitok",
    prescribedFor: "Otázka",
    prescriptionDate: "Dátum",
    takeToStage: "Odohraj naživo na Marse!",
    prescribed: "Na Marse",
    savedPlays: "Tvoje hry",
    saveImage: "Uložiť ako obrázok",
    shareEmail: "Poslať emailom",
    saving: "Ukladám...",
    preparing: "Pripravujem...",
    // Loading messages
    loading1: "Čo ak je tvoja otázka zlá otázka?",
    loading2: "Odpoveď, ktorú chceš, nie je odpoveď, ktorú potrebuješ...",
    loading3: "Staviam scénu. Telá vstupujú do priestoru...",
    loading4: "Hľadám, kto už stojí v tvojej otázke...",
    loading5: "Možno to bude trochu bolieť...",
    // Daily questions
    dailyQ1: "Čomu sa vyhýbaš?",
    dailyQ2: "Čo by sa zmenilo, keby si prestal predstierať?",
    dailyQ3: "Čo tvoj tím potrebuje, ale nepýta sa na to?",
    dailyQ4: "Akú hodnotu vlastne vytváraš?",
    dailyQ5: "Aká je otázka, ktorej sa bojíš?",
    dailyQ6: "Čo by povedali tvoji zákazníci, keby boli brutálne úprimní?",
    dailyQ7: "Kto si, keď sa nikto nepozerá?",
    // Play counter
    playsGenerated: "hier vygenerovaných",
    // From Mars (step 2)
    fromMars: "Simulácia Hry",
    loadingMars: "Mars sleduje...",
    marsError: "Mars to nevidel. Skús znova.",
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
    simulationTitle: "Co se děje na scéně",
    simulationSub: "možný průběh",
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
    concrete: "konkrétní",
    abstract: "abstraktní",
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
    characterGeneratorTitle: "Generátor rolí",
    characterGeneratorSub: "Na základě otázky a počtu lidí navrhne role do hry",
    generateCharacters: "Vygeneruj role",
    characterPlaceholder: "Na jakou otázku potřebuješ role?",
    personal: "Osobní",
    business: "Byznys",
    // Prescription
    prescribe: "Vezmi to na Mars!",
    prescriptionTitle: "Tvoje hra",
    prescriptionHeader: "Stage on Mars — Zážitek",
    prescribedFor: "Otázka",
    prescriptionDate: "Datum",
    takeToStage: "Odehraj naživo na Marsu!",
    prescribed: "Na Marsu",
    savedPlays: "Tvoje hry",
    saveImage: "Uložit jako obrázek",
    shareEmail: "Poslat emailem",
    saving: "Ukládám...",
    preparing: "Připravuji...",
    // Loading messages
    loading1: "Co když je tvoje otázka špatná otázka?",
    loading2: "Odpověď, kterou chceš, není odpověď, kterou potřebuješ...",
    loading3: "Stavím scénu. Těla vstupují do prostoru...",
    loading4: "Hledám, kdo už stojí v tvé otázce...",
    loading5: "Možná to bude trochu bolet...",
    // Daily questions
    dailyQ1: "Čemu se vyhýbáš?",
    dailyQ2: "Co by se změnilo, kdybys přestal předstírat?",
    dailyQ3: "Co tvůj tým potřebuje, ale neptá se na to?",
    dailyQ4: "Jakou hodnotu vlastně vytváříš?",
    dailyQ5: "Jaká je otázka, které se bojíš?",
    dailyQ6: "Co by řekli tvoji zákazníci, kdyby byli brutálně upřímní?",
    dailyQ7: "Kdo jsi, když se nikdo nedívá?",
    // Play counter
    playsGenerated: "her vygenerovaných",
    // From Mars (step 2)
    fromMars: "Simulace Hry",
    loadingMars: "Mars sleduje...",
    marsError: "Mars to neviděl. Zkus znovu.",
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
