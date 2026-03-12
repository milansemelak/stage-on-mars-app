"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "sk" | "cs";

const translations = {
  en: {
    // Header
    humanFutureSimulator: "Go to Mars",
    // Play page
    headline: "The Systemic Playbook",
    subheadline: "Turn the question into a play to see what you can't see alone",
    facilitatorMode: "Facilitator Mode",
    facilitatorSub: "3 play options",
    selfService: "Self-service",
    selfServiceSub: "1 detailed play",
    placeholder: "What question do you want to explore?",
    needHelp: "Need help?",
    hide: "Hide",
    questionTriangle: "Question Triangle",
    generatePlay: "Generate Play",
    generating: "Generating...",
    errorMessage: "Failed to generate play. Make sure your API key is configured.",
    yourPlay: "Your Play",
    playOptions: "Play Options",
    forQuestion: "For",
    regenerate: "Regenerate",
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
  },
  sk: {
    // Header
    humanFutureSimulator: "Poď na Mars",
    // Play page
    headline: "Systemický Playbook",
    subheadline: "Premeň otázku na hru a uvidíš, čo sám nevidíš",
    facilitatorMode: "Režim sprievodcu",
    facilitatorSub: "3 možnosti hry",
    selfService: "Samoobsluha",
    selfServiceSub: "1 detailná hra",
    placeholder: "Akú otázku chceš preskúmať?",
    needHelp: "Potrebuješ pomoc?",
    hide: "Skryť",
    questionTriangle: "Trojuholník otázok",
    generatePlay: "Vygeneruj hru",
    generating: "Generujem...",
    errorMessage: "Nepodarilo sa vygenerovať hru. Skontroluj API kľúč.",
    yourPlay: "Tvoja hra",
    playOptions: "Možnosti hry",
    forQuestion: "Pre",
    regenerate: "Znova",
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
    landingDesc: "Premeň akúkoľvek otázku na Systémovú hru — zážitkovú metódu, ktorá rozširuje perspektívu cez kolektívnu kreativitu, pohyb a prepojenie.",
    generateAPlay: "Vygeneruj hru",
    ask: "Pýtaj sa",
    askDesc: "Prines svoju otázku — osobnú, kolektívnu alebo o situácii. Otázka je mena.",
    play: "Hraj",
    playDesc: "Získaj unikátnu Systémovú hru s obrazom, postavami, tvojou rolou a záverom. Pripravenú na odehranie.",
    see: "Pozri",
    seeDesc: "Rozšír svoju perspektívu. Nie odpovede — nové spôsoby videnia cez kolektívnu kreativitu.",
  },
  cs: {
    // Header
    humanFutureSimulator: "Pojď na Mars",
    // Play page
    headline: "Systemický Playbook",
    subheadline: "Přeměň otázku na hru a uvidíš, co sám nevidíš",
    facilitatorMode: "Režim průvodce",
    facilitatorSub: "3 možnosti hry",
    selfService: "Samoobsluha",
    selfServiceSub: "1 detailní hra",
    placeholder: "Jakou otázku chceš prozkoumat?",
    needHelp: "Potřebuješ pomoc?",
    hide: "Skrýt",
    questionTriangle: "Trojúhelník otázek",
    generatePlay: "Vygeneruj hru",
    generating: "Generuji...",
    errorMessage: "Nepodařilo se vygenerovat hru. Zkontroluj API klíč.",
    yourPlay: "Tvoje hra",
    playOptions: "Možnosti hry",
    forQuestion: "Pro",
    regenerate: "Znovu",
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
    landingDesc: "Přeměň jakoukoliv otázku na Systémovou hru — zážitkovou metodu, která rozšiřuje perspektivu skrze kolektivní kreativitu, pohyb a propojení.",
    generateAPlay: "Vygeneruj hru",
    ask: "Ptej se",
    askDesc: "Přines svou otázku — osobní, kolektivní nebo o situaci. Otázka je měna.",
    play: "Hraj",
    playDesc: "Získej unikátní Systémovou hru s obrazem, postavami, tvou rolí a závěrem. Připravenou k odehrání.",
    see: "Podívej",
    seeDesc: "Rozšiř svou perspektivu. Ne odpovědi — nové způsoby vidění skrze kolektivní kreativitu.",
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
