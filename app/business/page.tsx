"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ── Fade-in on scroll ── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); obs.unobserve(el); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useFadeIn();
  return <div ref={ref} className={`fade-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* ── Cycling quotes ── */
const VOICES = [
  { text: "Absolutely genius. The fastest way to break through corporate thinking.", name: "Vik Maraj", co: "Unstoppable Conversations" },
  { text: "It either confirms what you believe, or shows you a different reality.", name: "Alexandra Lobkowicz", co: "House of Lobkowicz" },
  { text: "You drop the titles, the ego, the learned masks and go deep.", name: "Raul Rodriguez", co: "Dajana Rodriguez" },
  { text: "Brilliant and healing for the company and our people.", name: "Ondřej Novotný", co: "Oktagon MMA" },
];

const UI = {
  en: {
    tagline1: "Play with reality.",
    tagline2: "Create what\u2019s next.",
    placeholder: "What question do you want to play?",
    company: "Company name",
    buildLabel: "Design your trip to Mars",
    buildPlay: "Build your play",
    readyMade: "Or choose a ready-made experience",
    howTitle: "How it works",
    headline: "Play with reality.\nCreate what\u2019s next.",
    formulaTag: "Method of Systemic Play",
    formulaQ: "Question",
    formulaP: "Play",
    formulaR: "Perspective",
    colHead1: "Bring a question.",
    colHead2: "Play it out on stage.",
    colHead3: "See what matters.",
    formulaBody: "Your question becomes a real play on stage. People step into roles. Your perspective shifts.",
    realityPlays: "Reality plays",
    countries: "Countries",
    founded: "Founded",
    trustedBy: "Trusted by",
    cities: "Prague · London · Zurich",
    theStage: "The stage",
    venueDesc: "The flagship space. Where reality plays happen.",
    explore: "Explore →",
    playmakerTitle: "The Play Simulator",
    playmakerDesc1: "Type a question. Watch it become a play.",
    playmakerDesc2: "Characters, stage, perspectives — all simulated live.",
    playmakerQ1: "What does my company need",
    playmakerQ2: "the most right now?",
    playQuestion: "Simulate →",
    theCrew: "The crew",
    crewText1: "Created by Milan and Zuzana Semelak in 2020. Systemic constellations meets theatre meets improvisation.",
    crewText2: "In 2023, David Vais joined. Platform built. Stage opened. Brand born.",
    crewStats: "800+ reality plays. London, Zurich, Bucharest.",
    getOnStage: "Get on stage",
    contactQ: "What\u2019s your question?",
    contactReply: "We reply within 24 hours.",
    contactName: "Name",
    contactCompany: "Company",
    contactEmail: "Email",
    contactYourQ: "Your question",
    letsTalk: "Let\u2019s Talk",
    contactThanks: "Thank you. We\u2019ll be in touch.",
    play1Theme: "Strategy",
    play1Pitch: "Where is your company really heading — and what\u2019s pulling it off course?",
    play2Theme: "Vision",
    play2Pitch: "What does your company look like in 5 years? Your team builds that future on stage.",
    play3Theme: "Team",
    play3Pitch: "What\u2019s really going on in your team? What holds it together, what pulls it apart.",
    thePlay: "Play",
    from: "from",
    letsMakeIt: "Let\u2019s make it happen.",
    codexTag: "Codex of Mars",
    codexTitle: "What we believe.",
    codexBody: "A place where people play with reality to create what\u2019s next. At the core is Systemic Play, a method that turns questions into live plays using imagination, theatre, and systemic constellations.",
    codexBody2: "It\u2019s not therapy. It\u2019s creativity, imagination, and self-expression. Each experience is guided by a Playmaker and supported by a Producer.",
    codexValues: "Freedom · Responsibility · Humor · Humility · Truthfulness",
    codexCta: "Read the full Codex →",
  },
  cs: {
    tagline1: "Hrajte si s realitou.",
    tagline2: "Vytvořte, co přijde.",
    placeholder: "Jakou otázku chcete zahrát?",
    company: "Název firmy",
    buildLabel: "Navrhněte svůj výlet na Mars",
    buildPlay: "Sestavit hru",
    readyMade: "Nebo si vyberte hotový zážitek",
    howTitle: "Jak to funguje",
    headline: "Hrajte si s realitou.\nVytvořte, co přijde.",
    formulaTag: "Metoda Systémové Hry",
    formulaQ: "Otázka",
    formulaP: "Hra",
    formulaR: "Perspektiva",
    colHead1: "Přineste otázku.",
    colHead2: "Zahrajte si ji na jevišti.",
    colHead3: "Uvidíte, na čem záleží.",
    formulaBody: "Vaše otázka se promění ve skutečnou hru na jevišti. Skuteční lidé vstoupí do rolí. Vaše perspektiva se změní.",
    realityPlays: "Odehraných her",
    countries: "Země",
    founded: "Založeno",
    trustedBy: "Důvěřují nám",
    cities: "Praha · Londýn · Curych",
    theStage: "Scéna",
    venueDesc: "Vlajková loď. Místo, kde se hrají hry reality.",
    explore: "Prozkoumat →",
    playmakerTitle: "Simulátor Hry",
    playmakerDesc1: "Napište otázku. Sledujte, jak se změní ve hru.",
    playmakerDesc2: "Postavy, scéna, perspektivy — vše simulováno živě.",
    playmakerQ1: "Co moje firma potřebuje",
    playmakerQ2: "nejvíc právě teď?",
    playQuestion: "Simulovat →",
    theCrew: "Tým",
    crewText1: "Založili Milan a Zuzana Semelákovi v roce 2020. Systemické konstelace potkávají divadlo a improvizaci.",
    crewText2: "V roce 2023 se přidal David Vais. Platforma postavena. Scéna otevřena. Značka vznikla.",
    crewStats: "800+ her reality. Londýn, Curych, Bukurešť.",
    getOnStage: "Vstupte na scénu",
    contactQ: "Jaká je vaše otázka?",
    contactReply: "Odpovíme do 24 hodin.",
    contactName: "Jméno",
    contactCompany: "Firma",
    contactEmail: "E-mail",
    contactYourQ: "Vaše otázka",
    letsTalk: "Pojďme se bavit",
    contactThanks: "Děkujeme. Ozveme se vám.",
    play1Theme: "Strategie",
    play1Pitch: "Kam vaše firma opravdu míří — a co ji stahuje z kurzu?",
    play2Theme: "Vize",
    play2Pitch: "Jak vypadá vaše firma za 5 let? Váš tým tu budoucnost postaví na jevišti.",
    play3Theme: "Tým",
    play3Pitch: "Co se ve vašem týmu opravdu děje? Co ho drží pohromadě, co ho trhá.",
    thePlay: "Hra",
    from: "od",
    letsMakeIt: "Pojďme na to.",
    codexTag: "Codex of Mars",
    codexTitle: "Čemu věříme.",
    codexBody: "Místo, kde si lidé hrají s realitou, aby mohli tvořit to, co přijde dál. V jádru je Systemická hra, metoda, která mění otázky v živé hry pomocí imaginace, divadla a systemických konstelací.",
    codexBody2: "Není to terapie. Patří do světa kreativity, imaginace a sebevyjádření. Každou zkušeností provází Playmaker a podporuje ho Producer.",
    codexValues: "Svoboda · Odpovědnost · Humor · Pokora · Pravdivost",
    codexCta: "Přečtěte si celý Codex →",
  },
} as const;

type Lang = keyof typeof UI;

function Voices() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx((i) => (i + 1) % VOICES.length); setVisible(true); }, 800);
    }, 4500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-[120px] sm:h-[140px] flex flex-col items-center justify-center text-center">
      <p className={`font-mercure italic text-white/90 text-[14px] sm:text-[18px] md:text-[22px] leading-[1.4] max-w-xl transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        &ldquo;{VOICES[idx].text}&rdquo;
      </p>
      <p className={`text-mars text-[11px] mt-3 font-bold transition-all duration-700 delay-100 ${visible ? "opacity-100" : "opacity-0"}`}>
        {VOICES[idx].name} · {VOICES[idx].co}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════ */

/* BUSINESS_MAP, CREATIVE_EXTRACTIONS, deriveExperience, etc.
   moved to /app/business/play/page.tsx */

export default function BusinessPage() {
  const [entered, setEntered] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const t = UI[lang];

  // Contact form
  const [formData, setFormData] = useState({ name: "", email: "", company: "", question: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 500);
    return () => clearTimeout(t);
  }, []);

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Mars inquiry from ${formData.name} @ ${formData.company}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\n\nQuestion:\n${formData.question}`);
    window.open(`mailto:play@stageonmars.com?subject=${subject}&body=${body}`);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] overflow-x-hidden">

      <style jsx global>{`
        .fade-section { opacity: 0; transform: translateY(12px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-section.is-visible { opacity: 1; transform: translateY(0); }
        @keyframes glow-pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.15); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>



      {/* ── HERO: The question IS the experience ── */}
      <section className="sm:min-h-[90vh] sm:justify-center flex flex-col items-center px-4 pt-6 sm:pt-0 relative overflow-hidden transition-all duration-700">

        {/* Abstract stage light — dramatic cone from top */}
        <>
            {/* Main spotlight cone */}
            <div
              className={`absolute transition-all duration-[3000ms] ${entered ? "opacity-100" : "opacity-0"}`}
              style={{
                top: "-20%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "120%",
                height: "80%",
                background: "conic-gradient(from 180deg at 50% 0%, transparent 35%, rgba(255,85,0,0.06) 45%, rgba(255,85,0,0.12) 50%, rgba(255,85,0,0.06) 55%, transparent 65%)",
              }}
            />
            {/* Warm center glow */}
            <div
              className={`absolute w-[600px] h-[600px] rounded-full transition-all duration-[2500ms] delay-500 ${entered ? "opacity-100" : "opacity-0"}`}
              style={{ background: "radial-gradient(ellipse, rgba(255,85,0,0.14) 0%, rgba(255,85,0,0.04) 40%, transparent 70%)", top: "20%", left: "50%", transform: "translate(-50%, -50%)" }}
            />
            {/* Subtle side accent left */}
            <div
              className={`absolute w-[400px] h-[400px] rounded-full transition-all duration-[4000ms] delay-[1500ms] ${entered ? "opacity-100" : "opacity-0"}`}
              style={{ background: "radial-gradient(circle, rgba(255,85,0,0.05) 0%, transparent 70%)", top: "50%", left: "15%", transform: "translate(-50%, -50%)" }}
            />
            {/* Subtle side accent right */}
            <div
              className={`absolute w-[300px] h-[300px] rounded-full transition-all duration-[4000ms] delay-[2000ms] ${entered ? "opacity-100" : "opacity-0"}`}
              style={{ background: "radial-gradient(circle, rgba(255,85,0,0.04) 0%, transparent 70%)", top: "45%", left: "80%", transform: "translate(-50%, -50%)" }}
            />
            {/* Noise/grain texture overlay for depth */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "256px" }} />
          </>

        <div className={`relative z-10 w-full flex flex-col items-center transition-all duration-[1500ms] delay-[800ms] ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          <div className="flex justify-end w-full max-w-3xl mx-auto mb-2">
            <button
              onClick={() => setLang(lang === "en" ? "cs" : "en")}
              className="text-white/30 hover:text-white/60 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors"
            >
              {lang === "en" ? "CZ" : "EN"}
            </button>
          </div>

          <div className="text-center mb-6 sm:mb-10">
              {/* Logo */}
              <button onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }} className="mb-4 sm:mb-5 cursor-pointer" style={{ animation: "float 6s ease-in-out infinite" }}>
                <img src="/logo.png" alt="Stage On Mars" className="h-14 sm:h-14 md:h-18 w-auto invert mx-auto" />
              </button>
              {/* Tagline — same style as the screenshot */}
              <h1 className="text-[28px] sm:text-[44px] md:text-[56px] font-black tracking-[-0.04em] leading-[1.05]">
                <span className="text-white">{t.tagline1}</span>
                <br />
                <span className="text-mars font-mercure italic">{t.tagline2}</span>
              </h1>
          </div>


          {/* ── FORMULA — first thing after headline ── */}
          <div className="relative w-full max-w-3xl mx-auto mb-6 sm:mb-10">
              {/* Orange glow beneath box */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-[80px] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,85,0,0.1) 0%, transparent 80%)" }} />
              <div className="relative rounded-2xl border border-white/[0.12] overflow-hidden">
                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" src="/formula-bg.mp4" />
                <div className="absolute inset-0 bg-black/[0.82] sm:bg-black/[0.78]" />
                <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent relative z-10" />
                <div className="absolute inset-0 pointer-events-none z-10" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,85,0,0.06) 0%, transparent 60%)" }} />
                <div className="relative z-10 px-6 sm:px-10 pt-10 sm:pt-14 pb-10 sm:pb-14 flex flex-col items-center">
                  <p className="text-center mb-4 sm:mb-5">
                    <span className="text-white/90 text-[20px] sm:text-[34px] md:text-[42px] font-black tracking-[-0.03em]">{t.formulaQ}</span>
                    <span className="text-white/12 text-[16px] sm:text-[28px] md:text-[34px] mx-2 sm:mx-4 font-light">×</span>
                    <span className="text-white/90 text-[20px] sm:text-[34px] md:text-[42px] font-black tracking-[-0.03em]">{t.formulaP}</span>
                    <span className="text-white/12 text-[16px] sm:text-[28px] md:text-[34px] mx-2 sm:mx-4 font-light">=</span>
                    <span className="text-mars text-[20px] sm:text-[34px] md:text-[42px] font-mercure italic tracking-[-0.02em]">{t.formulaR}</span>
                  </p>
                  <p className="font-mercure italic text-white/45 text-[13px] sm:text-[15px] leading-[1.7] text-center max-w-md">{t.formulaBody}</p>
                </div>
              </div>
            </div>


          {/* ── SOCIAL PROOF ── */}
          <div className="w-full max-w-3xl mx-auto mb-8 sm:mb-12">
              <div className="relative rounded-2xl overflow-hidden">
                <img src="/luxury5.jpg" alt="" className="absolute inset-0 w-full h-full object-cover grayscale opacity-[0.25]" style={{ objectPosition: "50% 35%" }} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/40 to-[#0a0a0a]/70" />
                <div className="absolute inset-0 border border-white/[0.15] rounded-2xl pointer-events-none" />

                <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-12">
                  <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-8 sm:mb-10">
                    <div className="text-center">
                      <p className="text-[26px] sm:text-[36px] font-bold tracking-[-0.03em] text-white/90">800+</p>
                      <p className="text-white/50 text-[9px] sm:text-[12px] uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1">{t.realityPlays}</p>
                    </div>
                    <div className="text-center border-x border-white/[0.08]">
                      <p className="text-[26px] sm:text-[36px] font-bold tracking-[-0.03em] text-white/90">5</p>
                      <p className="text-white/50 text-[9px] sm:text-[12px] uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1">{t.countries}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[26px] sm:text-[36px] font-bold tracking-[-0.03em] text-white/90">2020</p>
                      <p className="text-white/50 text-[9px] sm:text-[12px] uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1">{t.founded}</p>
                    </div>
                  </div>

                  <div className="mb-8 sm:mb-10">
                    <Voices />
                  </div>

                  <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent mb-6 sm:mb-8" />

                  <p className="text-white/50 text-[10px] uppercase tracking-[0.3em] text-center mb-4 font-bold">{t.trustedBy}</p>
                  <p className="text-white/70 text-[13px] sm:text-[14px] leading-[2.2] tracking-wide text-center max-w-xl mx-auto">
                    Forbes{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    Škoda{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    YPO{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    PwC{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    O₂{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    UniCredit{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    Oktagon MMA{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    House of Lobkowicz{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    London Business School{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    Česká spořitelna{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    Lasvit{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    Ipsen{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    MSD{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    Direct Group{" "}<span className="text-white/25 mx-1">·</span>{" "}
                    Raiffeisenbank
                  </p>
                  <p className="text-white/40 text-[10px] text-center mt-4 font-mercure italic">
                    {t.cities}
                  </p>
                </div>
              </div>
            </div>

          {/* ── CREDIBILITY / STATS ── */}
          <div className="w-full max-w-3xl mx-auto mb-6 sm:mb-10">
            <div className="relative rounded-2xl border border-white/[0.12] overflow-hidden bg-white/[0.03]">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/40 to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,85,0,0.08) 0%, transparent 70%)" }} />
              <div className="relative z-10 px-4 sm:px-8 pt-8 sm:pt-12 pb-5 sm:pb-8">
                <p className="font-mercure italic text-[16px] sm:text-[28px] leading-[1.2] text-center mx-auto mb-8 sm:mb-10">
                  <span className="text-white/90">The strategy is there.</span>
                  <br className="sm:hidden" />
                  <span className="text-white/20 sm:ml-2">But nothing turns into action.</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-5 sm:py-7 text-center sm:text-center flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0">
                    <div className="shrink-0">
                      <p className="text-mars text-[32px] sm:text-[44px] font-black tracking-[-0.04em] leading-none drop-shadow-[0_0_30px_rgba(255,85,0,0.2)]">80%</p>
                      <p className="text-white/30 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.12em] mt-1">of teams</p>
                    </div>
                    <div className="hidden sm:block h-[1px] bg-white/[0.06] my-3 sm:my-4 mx-auto w-3/4" />
                    <p className="text-white/50 text-[13px] leading-[1.5]">left with a clear direction</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-5 sm:py-7 text-center sm:text-center flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0">
                    <div className="shrink-0">
                      <p className="font-black tracking-[-0.03em] leading-none">
                        <span className="text-white/90 text-[22px] sm:text-[30px]">Weeks</span>
                        <span className="text-mars/40 mx-1 text-[14px] sm:text-[18px]">&rarr;</span>
                        <span className="text-mars text-[22px] sm:text-[30px] drop-shadow-[0_0_30px_rgba(255,85,0,0.2)]">Hours</span>
                      </p>
                      <p className="text-white/30 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.12em] mt-1">time to clarity</p>
                    </div>
                    <div className="hidden sm:block h-[1px] bg-white/[0.06] my-3 sm:my-4 mx-auto w-3/4" />
                    <p className="text-white/50 text-[13px] leading-[1.5]">what took weeks of talking was played out in hours</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-5 sm:py-7 text-center sm:text-center flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0">
                    <div className="shrink-0">
                      <p className="text-mars text-[32px] sm:text-[44px] font-black tracking-[-0.04em] leading-none drop-shadow-[0_0_30px_rgba(255,85,0,0.2)]">
                        9<span className="text-white/15 text-[24px] sm:text-[32px] mx-0.5">/</span>10
                      </p>
                      <p className="text-white/30 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.12em] mt-1">teams</p>
                    </div>
                    <div className="hidden sm:block h-[1px] bg-white/[0.06] my-3 sm:my-4 mx-auto w-3/4" />
                    <p className="text-white/50 text-[13px] leading-[1.5]">unblocked a stuck decision</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── BUILD YOUR PLAY — CTA ── */}
          <FadeIn className="px-4 py-10 sm:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-mars/60 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-4">{t.letsMakeIt}</p>
              <h2 className="text-[22px] sm:text-[32px] font-bold tracking-[-0.03em] mb-3">
                {t.contactQ}
              </h2>
              <p className="font-mercure italic text-white/35 text-[12px] sm:text-[14px] mb-8 max-w-sm mx-auto">
                {t.formulaBody}
              </p>
              <Link
                href="/business/play"
                className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-[13px] sm:text-[15px] uppercase tracking-[0.12em] text-white transition-all hover:scale-[1.03] hover:shadow-[0_12px_50px_-10px_rgba(255,85,0,0.6)]"
                style={{ background: "linear-gradient(135deg, #FF5500 0%, #e04800 100%)", boxShadow: "0 4px 24px -4px rgba(255,85,0,0.4)" }}
              >
                {t.buildPlay}
                <span className="text-white/60">&rarr;</span>
              </Link>
            </div>
          </FadeIn>



        </div>
      </section>



      {/* ── THE SPACE — Stage box ── */}
      <FadeIn className="px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
            {/* Photo */}
            <div className="relative h-[35vh] sm:h-[50vh]">
              <img src="/space1.png" alt="Stage on Mars — flagship space" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/20" />
            </div>
            {/* Info bar below photo */}
            <div className="px-6 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-mars/60 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold mb-1.5">{t.theStage}</p>
                <p className="text-white/90 text-[16px] sm:text-[20px] font-bold tracking-[-0.02em]">Národní 138/10, Praha</p>
                <p className="text-white/65 text-[13px] sm:text-[14px] mt-0.5">{t.venueDesc}</p>
              </div>
              <a href="/space" className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-mars/30 text-mars/70 text-[11px] font-bold uppercase tracking-[0.15em] hover:border-mars/50 hover:text-mars transition-all">
                {t.explore}
              </a>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── SIMULATOR TEASER ── */}
      <FadeIn className="px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto text-center">
          <Link
            href="/play"
            className="inline-flex items-center gap-2 text-mars/60 hover:text-mars text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.15em] transition-colors"
          >
            {t.playmakerTitle}: {t.playQuestion}
          </Link>
        </div>
      </FadeIn>

      {/* ── TEAM — Stage box ── */}
      <FadeIn className="px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="grid sm:grid-cols-2">
              {/* Team photo inside stage */}
              <div className="relative aspect-[4/3] sm:aspect-auto">
                <img src="/team.jpg" alt="Stage on Mars team" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/30 hidden sm:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent sm:hidden" />
              </div>
              {/* Team info */}
              <div className="p-6 sm:p-8 flex flex-col justify-center space-y-4">
                <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold">{t.theCrew}</p>
                <p className="font-mercure text-white/55 text-[13px] sm:text-[14px] leading-[1.7]">
                  {t.crewText1}
                </p>
                <p className="font-mercure text-white/55 text-[13px] sm:text-[14px] leading-[1.7]">
                  {t.crewText2}
                </p>
                <div className="pt-2">
                  <p className="text-white/70 text-[13px] sm:text-[14px] font-bold">
                    {t.crewStats}
                  </p>
                  <p className="text-white/70 text-[10px] mt-2">
                    Milan Semelak · David Vais · Tomas Pavlik · Jan Piskor · Andrea Sturalova
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── INSTAGRAM FEED ── */}
      <FadeIn className="px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-white/20 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold">@stage_on_mars</p>
          </div>
          <div
            className="[&_behold-widget]:block"
            ref={(el) => {
              if (el && !document.querySelector('script[src*="behold.so"]')) {
                const s = document.createElement("script");
                s.type = "module";
                s.src = "https://w.behold.so/widget.js";
                document.head.append(s);
              }
            }}
            dangerouslySetInnerHTML={{ __html: '<behold-widget feed-id="dIhZfoeR63aCCPOqfshk"></behold-widget>' }}
          />
        </div>
      </FadeIn>

      {/* ── CODEX OF MARS ── */}
      <FadeIn className="px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent" />
            <div className="p-6 sm:p-10 text-center">
              <p className="text-mars/60 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-4">
                {t.codexTag}
              </p>
              <h2 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em] mb-6">
                {t.codexTitle}
              </h2>
              <p className="font-mercure text-white/60 text-[13px] sm:text-[14px] leading-relaxed max-w-xl mx-auto mb-4">
                {t.codexBody}
              </p>
              <p className="font-mercure text-white/60 text-[13px] sm:text-[14px] leading-relaxed max-w-xl mx-auto mb-8">
                {t.codexBody2}
              </p>
              <p className="text-mars/50 text-[11px] sm:text-[12px] tracking-[0.15em] font-bold mb-8">
                {t.codexValues}
              </p>
              <Link
                href="/business/codex"
                className="inline-flex items-center gap-2 text-mars hover:text-mars-light text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.1em] transition-colors"
              >
                {t.codexCta}
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── CONTACT — Stage box ── */}
      <FadeIn className="px-4 pt-3 sm:pt-4 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto">
          <div id="contact" className="relative rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent" />

            <div className="p-6 sm:p-10">
              <div className="max-w-md mx-auto space-y-8">
                <div className="text-center">
                  <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold mb-4">{t.getOnStage}</p>
                  <h2 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">
                    {t.contactQ}
                  </h2>
                  <p className="font-mercure text-white/60 text-[13px] sm:text-[14px] mt-2">{t.contactReply}</p>
                </div>

                {sent ? (
                  <div className="text-center py-8">
                    <p className="font-mercure text-white/60 text-[14px]">{t.contactThanks}</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-2.5">
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <input name="name" value={formData.name} onChange={handleContactChange} placeholder={t.contactName} required className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/[0.12] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/70 focus:outline-none transition-colors" />
                      <input name="company" value={formData.company} onChange={handleContactChange} placeholder={t.contactCompany} className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/[0.12] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/70 focus:outline-none transition-colors" />
                    </div>
                    <input name="email" type="email" value={formData.email} onChange={handleContactChange} placeholder={t.contactEmail} required className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/[0.12] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/70 focus:outline-none transition-colors" />
                    <textarea name="question" value={formData.question} onChange={handleContactChange} placeholder={t.contactYourQ} rows={3} className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/[0.12] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/70 focus:outline-none transition-colors resize-none" />
                    <button type="submit" className="w-full py-3.5 rounded-xl bg-mars hover:bg-mars-light text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all shadow-[0_4px_20px_-4px_rgba(255,85,0,0.3)]">
                      {t.letsTalk}
                    </button>
                  </form>
                )}

                <p className="text-center font-mercure text-white/25 text-[11px]">
                  <a href="mailto:play@stageonmars.com" className="hover:text-mars transition-colors">play@stageonmars.com</a>
                  {" · "}
                  <a href="tel:+420602336338" className="hover:text-mars transition-colors">+420 602 336 338</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* FOOTER */}
      <footer className="py-6 px-6 border-t border-white/[0.03]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-white/25 text-[10px]">
          <span>&copy; {new Date().getFullYear()} Stage on Mars</span>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/stage_on_mars" target="_blank" rel="noopener noreferrer" className="hover:text-white/65 transition-colors">Instagram</a>
            <a href="https://www.linkedin.com/company/stageonmars" target="_blank" rel="noopener noreferrer" className="hover:text-white/65 transition-colors">LinkedIn</a>
            <a href="https://playbook.stageonmars.com" className="hover:text-white/65 transition-colors">Playbook</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
