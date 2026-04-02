"use client";

import { useState, useEffect, useRef } from "react";
import type { Play, Perspective } from "@/lib/types";
import StageSimulation from "@/components/StageSimulation";

/* ── Fade-in on scroll ── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); obs.unobserve(el); } },
      { threshold: 0.15 }
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
      <p className={`font-mercure italic text-white/50 text-[14px] sm:text-[18px] md:text-[22px] leading-[1.4] max-w-xl transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        &ldquo;{VOICES[idx].text}&rdquo;
      </p>
      <p className={`text-mars/25 text-[10px] mt-3 transition-all duration-700 delay-100 ${visible ? "opacity-100" : "opacity-0"}`}>
        {VOICES[idx].name} · {VOICES[idx].co}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PLAY 1: BUSINESS CONTEXT — What business domain is the question about?
   Maps to formal business categories: Strategy, Growth, Culture, etc.
   ══════════════════════════════════════════════════════════════════ */

const BUSINESS_MAP: [RegExp, string, string][] = [
  // [pattern, theme, pitch fragment]
  // Strategy & Direction
  [/strateg|direction|priorit|roadmap|plan ahead|where.*(go|head)|what.*(focus|next)/i, "Strategy", "strategic direction"],
  [/decision|choose|dilemma|trade.?off|which way|crossroad/i, "Decisions", "decision-making"],
  [/vision|future|long.?term|5 year|ten year|horizon|where.*heading/i, "Vision", "vision and future"],

  // Growth & Scale
  [/grow|growth|scale|expand|10x|100x|double|triple|bigger|accelerat/i, "Growth", "growth dynamics"],
  [/market|position|competit|differenti|niche|segment|share/i, "Market", "market positioning"],
  [/revenue|profit|margin|monetiz|pricing|cost|budget|financ|money|cash/i, "Value", "value creation"],
  [/product|launch|ship|release|mvp|feature|build.*product/i, "Product", "product development"],
  [/customer|client|user|retention|churn|loyalt|acquisition/i, "Customers", "customer relationships"],
  [/brand|reputation|perception|image|story|narrative|position/i, "Brand", "brand identity"],
  [/sales|selling|pipeline|conversion|deal|close|prospect/i, "Sales", "sales performance"],

  // People & Organization
  [/team|collaborat|together|silos|align|department|cross.?function/i, "Team", "team dynamics"],
  [/cultur|value|who are we|belong|dna|way we work|spirit/i, "Culture", "company culture"],
  [/talent|hire|recruit|retain|people leav|turnover|employer brand/i, "Talent", "talent and people"],
  [/lead|leader|manage|ceo|founder|boss|authority|c.?suite|executive/i, "Leadership", "leadership"],
  [/trust|psycholog|safe|conflict|tension|friction|dysfunct/i, "Trust", "trust and safety"],
  [/communi|speak|listen|silent|voice|heard|feedback|transparen/i, "Voice", "communication"],
  [/power|control|dominan|hierarchy|ego|politic|influenc/i, "Power", "power dynamics"],
  [/diversity|inclusion|equity|belonging|bias|represent/i, "Belonging", "diversity and belonging"],

  // Change & Transformation
  [/chang|transform|transition|restructur|pivot|reinvent|disrupt/i, "Transformation", "transformation"],
  [/innovat|creat|new idea|experiment|lab|prototype|disrupt/i, "Innovation", "innovation"],
  [/digit|tech|ai|automat|machine|software|platform/i, "Digital", "digital transformation"],
  [/merger|acqui|integrat|consolidat|m&a|takeover/i, "Integration", "integration"],
  [/agil|speed|fast|slow|bureaucra|process|efficienc/i, "Agility", "organizational agility"],

  // Performance & Results
  [/perform|result|kpi|metric|target|goal|okr|objective/i, "Performance", "performance"],
  [/success|failure|win|lose|best|worst|peak|bottom/i, "Performance", "success and failure"],
  [/stuck|block|stagnant|plateau|comfort zone|rut/i, "Breakthrough", "breaking through"],
  [/burnout|exhaust|energy|balanc|wellbeing|mental health|stress/i, "Balance", "balance and energy"],

  // Purpose & Meaning
  [/purpose|meaning|why|impact|legacy|matter|contribut/i, "Purpose", "purpose"],
  [/sustainab|esg|responsib|planet|climate|green|impact/i, "Impact", "impact and responsibility"],
  [/ethic|moral|right thing|integrity|principle/i, "Integrity", "integrity"],

  // Fear & Risk
  [/fear|afraid|risk|uncertain|anxiety|worry|danger|threat/i, "Courage", "courage under uncertainty"],
  [/crisis|emergency|survival|existential|collapse|fail/i, "Survival", "survival and crisis"],
  [/impossible|crazy|never|can.t|no way|dream|moonshot/i, "Impossible", "the impossible"],
];

/* ══════════════════════════════════════════════════════════════════
   PLAY 2: CREATIVE CONTEXT — What's the dramatic essence of the question?
   Extracts the evocative word, metaphor, or action from the question.
   "How do we 10x?" → "10x on Mars"
   "How do we conquer Europe?" → "Conquerors on Mars"
   ══════════════════════════════════════════════════════════════════ */

const CREATIVE_EXTRACTIONS: [RegExp, string][] = [
  // Numbers and multipliers
  [/\b(10x|100x|2x|3x|5x)\b/i, "$1"],
  [/\b(million|billion|trillion)\b/i, "$1"],

  // Power verbs → noun forms
  [/\bconquer\w*/i, "Conquerors"],
  [/\bdominat\w*/i, "Dominators"],
  [/\bdisrupt\w*/i, "Disruptors"],
  [/\brevolut\w*/i, "Revolutionaries"],
  [/\btransform\w*/i, "Shapeshifters"],
  [/\breinvent\w*/i, "Reinventors"],
  [/\bdestroy\w*/i, "Destroyers"],
  [/\bbuild\w*/i, "Builders"],
  [/\bcreate|creat\w*/i, "Creators"],
  [/\binvent\w*/i, "Inventors"],
  [/\bpioneer\w*/i, "Pioneers"],
  [/\bexplor\w*/i, "Explorers"],
  [/\bsurvi\w*/i, "Survivors"],
  [/\bfight\w*/i, "Fighters"],
  [/\bwin\b/i, "Winners"],
  [/\blos[ei]\w*/i, "Losers"],
  [/\bescap\w*/i, "Escapists"],
  [/\bchase|chas\w*/i, "Chasers"],
  [/\bhunt\w*/i, "Hunters"],
  [/\bbreak\w*/i, "Breakers"],
  [/\bcrush\w*/i, "Crushers"],
  [/\blaunch\w*/i, "Launchers"],
  [/\blead\w*/i, "Leaders"],
  [/\brunning|run\b/i, "Runners"],
  [/\bsell\w*/i, "Sellers"],
  [/\bsteal\w*/i, "Stealers"],
  [/\bawaken\w*|wake/i, "Awakeners"],
  [/\bheal\w*/i, "Healers"],
  [/\bunlock\w*/i, "Unlockers"],
  [/\bscale\b/i, "Scalers"],

  // Geography / Markets
  [/\b(europe|asia|america|africa|global|world|international)\b/i, "$1"],
  [/\b(china|india|usa|uk|germany|japan|brazil|middle east)\b/i, "$1"],
  [/\b(czech|slovak|poland|hungary|balkan|nordic|baltic)\b/i, "$1"],

  // Metaphors and concepts
  [/\bnumber one|#1|first\b/i, "#1"],
  [/\bunicorn\b/i, "Unicorn"],
  [/\brocket\b/i, "Rocket"],
  [/\bempire\b/i, "Empire"],
  [/\bkingdom\b/i, "Kingdom"],
  [/\bwar\b/i, "War"],
  [/\bpeace\b/i, "Peace"],
  [/\bfire\b/i, "Fire"],
  [/\bstorm\b/i, "Storm"],
  [/\bwave\b/i, "Wave"],
  [/\bdark\w*\b/i, "Darkness"],
  [/\blight\b/i, "Light"],
  [/\bsilent|silence\b/i, "Silence"],
  [/\bloud\b/i, "Noise"],
  [/\bchaos\b/i, "Chaos"],
  [/\border\b/i, "Order"],
  [/\bfreedom\b/i, "Freedom"],
  [/\brebel\w*/i, "Rebels"],
  [/\boutcast\w*/i, "Outcasts"],
  [/\bunderdog\w*/i, "Underdogs"],
  [/\bgiant\w*/i, "Giants"],
  [/\bmonster\w*/i, "Monsters"],
  [/\bghost\w*/i, "Ghosts"],
  [/\bshadow\w*/i, "Shadows"],
  [/\bmirror\w*/i, "Mirrors"],
  [/\bmask\w*/i, "Masks"],
  [/\bwall\w*/i, "Walls"],
  [/\bbridge\w*/i, "Bridges"],
  [/\bdoor\w*/i, "Doors"],
  [/\bkey\b/i, "Keys"],
  [/\bbox\b/i, "Box"],
  [/\bcage\b/i, "Cage"],
  [/\broot\w*/i, "Roots"],
  [/\bseed\w*/i, "Seeds"],
  [/\bflam\w*|burn\w*/i, "Flames"],
  [/\bice|frozen|cold\b/i, "Ice"],
  [/\bstars?\b/i, "Stars"],
  [/\bmoon\b/i, "Moon"],
  [/\bsun\b/i, "Sun"],
  [/\bocean|sea\b/i, "Ocean"],
  [/\bmountain\b/i, "Mountain"],
  [/\bjungle\b/i, "Jungle"],
  [/\bdesert\b/i, "Desert"],
];

/* ── Derive business theme (Play 1) ── */
function deriveBusinessTheme(question: string): string {
  for (const [pattern, theme] of BUSINESS_MAP) {
    if (pattern.test(question)) return theme;
  }
  // Fallback: extract a meaningful noun
  const nouns = question.replace(/[?.,!'"]/g, "").split(/\s+/).filter(w => w.length > 4 && !/^(about|could|would|should|where|there|their|these|those|which|while|after|before|being|doing|going|having|making|taking|using|what|when|with|from|into|than|then|them|they|this|that|have|will|been|were|does|didn|don|isn|aren|wasn|weren|can|how|who|why|our|your)$/i.test(w));
  if (nouns.length > 0) {
    const w = nouns[0];
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }
  return "Reality";
}

/* ── Derive creative theme (Play 2) ── */
function deriveCreativeTheme(question: string): string {
  // Try creative extractions first
  for (const [pattern, replacement] of CREATIVE_EXTRACTIONS) {
    const match = question.match(pattern);
    if (match) {
      // Handle backreferences
      if (replacement.includes("$1") && match[1]) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1);
      }
      return replacement;
    }
  }

  // Fallback: find the most dramatic/interesting word in the question
  const q = question.replace(/[?.,!'"]/g, "").toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 3);
  // Skip common words, find the juicy one
  const boring = new Set(["about","could","would","should","where","there","their","these","those","which","while","after","before","being","doing","going","having","making","taking","using","what","when","with","from","into","than","then","them","they","this","that","have","will","been","were","does","your","need","want","know","think","feel","like","just","more","most","very","really","still","also","even","each","much","many","some","such","only","back","over","down","come","made","find","here","thing","give","every","good","well","work","make","help","keep","turn","start","might","could","first","never","under","other","again","next","last","long","great","little","right","look","tell","mean","must","call","hand","high","because","between","same","different","through","another","people","company","question","play"]);
  const interesting = words.filter(w => !boring.has(w));

  if (interesting.length > 0) {
    // Take the most "active" word (prefer later words as they tend to be more specific)
    const w = interesting[interesting.length - 1];
    return w.charAt(0).toUpperCase() + w.slice(1);
  }

  return "Unknown";
}

/* ── Business-themed pitch descriptions ── */
const BUSINESS_PITCHES: Record<string, string> = {
  Strategy: "Where is {co} really heading — and what's pulling it off course? Your team maps the forces on stage. The real strategy emerges.",
  Decisions: "The choices {co} is avoiding get played out live. Characters embody the trade-offs. You see the cost of indecision.",
  Vision: "What does {co} look like in 5 years? Your team builds that future on stage — then watches what tries to destroy it.",
  Growth: "What's actually blocking {co} from growing? Your team plays out the growth dynamics. The bottleneck reveals itself.",
  Market: "Where does {co} really stand? Competitors, customers, blind spots — all on stage. The market tells you what you're missing.",
  Value: "Follow the money at {co}. Where value is created, where it leaks, who controls it. The financial dynamics play out live.",
  Product: "Your product vision meets reality on stage. Users, builders, and blockers step into the play. You see what ships and what stalls.",
  Customers: "Your customers step on stage at {co}. What they really think. What they don't say. The relationship plays out in real time.",
  Brand: "What does {co} really stand for? Not the deck — the truth. Characters play your brand from the inside and outside.",
  Sales: "The sale that won't close. The pipeline that's stuck. Your team plays out the real dynamics between {co} and the market.",
  Team: "What's the real dynamic inside {co}? Who leads, who follows, who's silent? The team shows itself on stage.",
  Culture: "The culture of {co} — not the values on the wall, but the ones in the hallway. Your team plays it out. You see the gap.",
  Talent: "Why do people join {co}? Why do they leave? The talent forces play out on stage. You see what you're really offering.",
  Leadership: "What kind of leader does {co} need right now? Not the job description — the real force. Your team plays it out.",
  Trust: "The trust that's missing at {co}. Where it broke, who broke it, what would rebuild it. All on stage.",
  Voice: "Who speaks at {co}? Who stays silent? The communication dynamics play out live. You hear what's been unsaid.",
  Power: "Who really holds power at {co}? Not the org chart — the invisible lines. Your team plays the power dynamics live.",
  Belonging: "Who belongs at {co} and who doesn't feel it? The inclusion dynamics play out on stage. You see the invisible walls.",
  Transformation: "What is {co} becoming? The old and the new collide on stage. Your team plays the forces of change.",
  Innovation: "Where does innovation live at {co} — and what kills it? The creative forces and the blockers meet on stage.",
  Digital: "The digital future of {co} meets the human reality. Technology, people, resistance — all played out live.",
  Integration: "Two worlds becoming one at {co}. The cultures, the fears, the opportunities. Integration plays out on stage.",
  Agility: "What slows {co} down? Bureaucracy, fear, habit? The forces of speed and friction meet on stage.",
  Performance: "What drives results at {co} — and what sabotages them? Performance dynamics play out live.",
  Breakthrough: "What's keeping {co} stuck? The invisible walls, the comfort zones. Your team breaks through them on stage.",
  Balance: "The energy at {co} — where it flows and where it burns out. Your team plays the balance between drive and destruction.",
  Purpose: "Why does {co} exist? Not the mission statement — the real reason. Purpose meets reality on stage.",
  Impact: "What mark is {co} leaving on the world? The impact you intend vs. the impact you create. Played out live.",
  Integrity: "The gap between what {co} says and what it does. Characters play both sides. You see the truth.",
  Courage: "What is {co} afraid of? The fears that shape decisions, the risks nobody takes. Courage meets reality on stage.",
  Survival: "Is {co} in danger? The survival forces play out live — threats, allies, blind spots. You see what's really at stake.",
  Impossible: "The thing {co} thinks it can't do. Characters embody the impossibility — then your team plays through it.",
};

const DEFAULT_BUSINESS_PITCH = "Your team steps on stage and plays out the real {theme} dynamics at {co}. No slides. No theory. You see what you couldn't see before.";

/* ── Creative-themed pitch descriptions ── */
function getCreativePitch(theme: string, co: string): string {
  return `"${theme}" becomes a character on stage. Your team at ${co} steps into a play where ${theme.toLowerCase()} drives the story. Different game. Different rules. New perspective.`;
}

type ProductCard = {
  theme: string;
  name: string;
  tag: string;
  pitch: string;
  duration: string;
  people: string;
  price: string;
};

function deriveProducts(question: string, company: string): ProductCard[] {
  const bizTheme = deriveBusinessTheme(question);
  const creativeTheme = deriveCreativeTheme(question);
  const co = company || "your company";

  // Business pitch with company name
  let bizPitch = BUSINESS_PITCHES[bizTheme] || DEFAULT_BUSINESS_PITCH;
  bizPitch = bizPitch.replace(/\{co\}/g, co).replace(/\{theme\}/g, bizTheme.toLowerCase());

  return [
    {
      theme: bizTheme,
      name: `${bizTheme} on Mars`,
      tag: `${company || "Your team"} × Business`,
      pitch: bizPitch,
      duration: "3–4 h",
      people: "up to 20",
      price: "from €2 200",
    },
    {
      theme: creativeTheme,
      name: `${creativeTheme} on Mars`,
      tag: `${company || "Your team"} × Creative`,
      pitch: getCreativePitch(creativeTheme, co),
      duration: "3–4 h",
      people: "up to 20",
      price: "from €2 200",
    },
    {
      theme: "Leaders",
      name: "Leaders on Mars",
      tag: "Personal leadership",
      pitch: `This one is for you. Not the team. You step on stage alone and confront the forces shaping ${co} from the inside. Your blind spots. Your patterns. What you already know but won't say out loud.`,
      duration: "2–3 h",
      people: "you + guide",
      price: "from €1 400",
    },
  ];
}


/* ══════════════════════════════════════════════════════════════════
    PAGE
   ══════════════════════════════════════════════════════════════════ */

export default function BusinessPage() {
  const [entered, setEntered] = useState(false);
  const [question, setQuestion] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [context, setContext] = useState<"personal" | "business">("business");
  const [submitted, setSubmitted] = useState(false);
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [play, setPlay] = useState<Play | null>(null);
  const [playLoading, setPlayLoading] = useState(false);
  const [askedQuestion, setAskedQuestion] = useState("");
  const [error, setError] = useState("");
  const [showDigital, setShowDigital] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simReady, setSimReady] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Contact form
  const [formData, setFormData] = useState({ name: "", email: "", company: companyName, question: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 500);
    return () => clearTimeout(t);
  }, []);

  function generate() {
    if (!question.trim()) return;
    setSubmitted(true);
    setAskedQuestion(question);
    setProducts(deriveProducts(question, companyName));
    setSelectedIdx(null);
    setPlay(null);
    setError("");
    setShowDigital(false);

    // Scroll to results
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function selectProduct(idx: number) {
    setSelectedIdx(idx);
    setPlay(null);
    setShowDigital(false);
    setSimLoading(false);
    setSimReady(false);
  }

  async function fetchSimulation(currentPlay: Play) {
    setSimLoading(true);
    setSimReady(false);
    try {
      const res = await fetch("/api/generate-mars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ play: currentPlay, question: askedQuestion || question, lang: "en" }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const updated = {
        ...currentPlay,
        simulation: data.simulation,
        simulationSteps: data.simulationSteps,
        perspectives: data.perspectives,
        followUpQuestion: data.followUpQuestion || undefined,
      };
      setPlay(updated);
      setSimReady(true);
    } catch {
      setError("Simulation failed. Try again.");
    } finally {
      setSimLoading(false);
    }
  }

  async function openDigital() {
    setShowDigital(true);
    setPlayLoading(true);
    setError("");

    try {
      // Step 1: Generate the real play via API
      const res = await fetch("/api/generate-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: askedQuestion, context, lang: "en", clientName: companyName || undefined }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.plays?.[0]) {
        const generatedPlay = data.plays[0];
        setPlay(generatedPlay);
        setPlayLoading(false);
        // Step 2: Auto-generate simulation
        fetchSimulation(generatedPlay);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setPlayLoading(false);
    }
  }

  function reset() {
    setQuestion("");
    setSubmitted(false);
    setProducts([]);
    setPlay(null);
    setPlayLoading(false);
    setSelectedIdx(null);
    setAskedQuestion("");
    setError("");
    setShowDigital(false);
    setSimLoading(false);
    setSimReady(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Mars inquiry from ${formData.name} @ ${formData.company}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\n\nQuestion:\n${formData.question || askedQuestion}`);
    window.open(`mailto:play@stageonmars.com?subject=${subject}&body=${body}`);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] overflow-x-hidden">

      <style jsx global>{`
        .fade-section { opacity: 0; transform: translateY(24px); transition: opacity 0.9s ease, transform 0.9s ease; }
        .fade-section.is-visible { opacity: 1; transform: translateY(0); }
        @keyframes glow-pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.15); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
      `}</style>



      {/* ── HERO: The question IS the experience ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">

        {/* Layered ambient glows */}
        <div
          className={`absolute w-[600px] h-[600px] rounded-full transition-all duration-[3000ms] ${entered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "radial-gradient(circle, rgba(255,85,0,0.07) 0%, transparent 60%)", top: "25%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
        <div
          className={`absolute w-[300px] h-[300px] rounded-full transition-all duration-[4000ms] delay-[1000ms] ${entered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "radial-gradient(circle, rgba(255,85,0,0.04) 0%, transparent 70%)", top: "60%", left: "30%", transform: "translate(-50%, -50%)" }}
        />
        <div
          className={`absolute w-[200px] h-[200px] rounded-full transition-all duration-[4000ms] delay-[1500ms] ${entered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "radial-gradient(circle, rgba(255,85,0,0.03) 0%, transparent 70%)", top: "40%", left: "75%", transform: "translate(-50%, -50%)" }}
        />

        <div className={`relative z-10 w-full flex flex-col items-center transition-all duration-[1500ms] delay-[800ms] ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          <div className="text-center mb-10 sm:mb-14">
            {/* Logo with subtle float */}
            <div className="mb-6 sm:mb-8" style={{ animation: "float 6s ease-in-out infinite" }}>
              <img src="/logo.png" alt="Stage On Mars" className="h-10 sm:h-14 md:h-18 w-auto invert mx-auto" />
            </div>
            <p className="text-mars/40 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] mb-5 sm:mb-6">Reality Play Platform</p>
            <h1 className="text-[clamp(22px,5.5vw,72px)] font-bold leading-[1] tracking-[-0.04em] text-center whitespace-nowrap">
              Play with reality.
              <br />
              <span className="text-mars">See what&apos;s possible.</span>
            </h1>
          </div>

          <div className="w-full max-w-lg">

          {/* THE INPUT — mars-atmospheric container */}
          <div className="relative group/input">
            {/* Outer glow ring — reacts to focus */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-mars/30 via-white/[0.08] to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700 blur-[1px]" />
            {/* Subtle ambient glow behind the box */}
            <div className="absolute -inset-6 rounded-3xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000" style={{ background: "radial-gradient(ellipse at center, rgba(255,85,0,0.06) 0%, transparent 70%)" }} />

            <div className="relative rounded-2xl border border-white/[0.12] group-focus-within/input:border-mars/25 bg-white/[0.025] backdrop-blur-sm px-5 sm:px-6 pt-5 pb-4 transition-all duration-500">
              {/* Tiny label */}
              <p className="text-mars/50 text-[9px] uppercase tracking-[0.25em] mb-3">Your question</p>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What's the one question that could change your reality?"
                rows={2}
                className="w-full bg-transparent border-0 px-0 pt-0 pb-2 text-white text-[17px] sm:text-[20px] placeholder:text-white/35 focus:outline-none resize-none leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); }
                }}
              />

              {/* Divider line */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent my-2" />

              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name (optional)"
                className="w-full bg-transparent border-0 px-0 py-2 text-white/60 placeholder:text-white/25 focus:outline-none text-[13px] sm:text-[14px] tracking-wide"
              />
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!question.trim()}
            className={`w-full mt-8 py-4 sm:py-5 rounded-full font-black text-base sm:text-lg tracking-[0.25em] uppercase transition-all duration-500 ${
              question.trim()
                ? "bg-mars hover:bg-mars-light text-white shadow-[0_0_60px_-8px_rgba(255,85,0,0.5)]"
                : "text-white/20 border border-white/[0.12] cursor-not-allowed"
            }`}
          >
            Play
          </button>


          </div>{/* end max-w-lg */}

          {/* ── DIGITAL PLAYMAKER — full stage box below hero ── */}
          {!submitted && (
            <div className="w-full max-w-3xl mt-16 sm:mt-24">
              <button
                onClick={() => {
                  if (!question.trim()) return;
                  setSubmitted(true);
                  setAskedQuestion(question);
                  setProducts(deriveProducts(question, companyName));
                  setSelectedIdx(0);
                  openDigital();
                  setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
                }}
                disabled={!question.trim()}
                className={`w-full group transition-all duration-500 ${!question.trim() ? "opacity-30 cursor-not-allowed" : "opacity-100 hover:scale-[1.01]"}`}
              >
                <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/15 to-transparent" />

                  <div className="grid sm:grid-cols-2 items-center">
                    {/* Left — phone mockup */}
                    <div className="flex items-center justify-center py-10 sm:py-14">
                      <div className="group-hover:scale-105 transition-transform duration-700">
                        <svg width="90" height="170" viewBox="0 0 90 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[110px] sm:h-[208px] drop-shadow-[0_0_30px_rgba(255,85,0,0.08)] group-hover:drop-shadow-[0_0_40px_rgba(255,85,0,0.15)] transition-all duration-700">
                          <rect x="1" y="1" width="88" height="168" rx="18" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="#111" />
                          <rect x="1" y="1" width="88" height="168" rx="18" stroke="url(#phoneGlow2)" strokeWidth="1" className="opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          <rect x="30" y="6" width="30" height="8" rx="4" fill="#0a0a0a" />
                          <rect x="5" y="5" width="80" height="160" rx="15" fill="#0a0a0a" />
                          <rect x="12" y="22" width="38" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
                          <rect x="12" y="28" width="22" height="2" rx="1" fill="rgba(255,85,0,0.3)" />
                          <circle cx="45" cy="68" r="24" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />
                          <circle cx="45" cy="68" r="17" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 2" />
                          <circle cx="45" cy="68" r="24" fill="url(#stageGlow2)" />
                          <circle cx="45" cy="52" r="3.5" fill="rgba(255,85,0,0.8)"><animate attributeName="cy" values="52;50;52" dur="3s" repeatCount="indefinite" /></circle>
                          <circle cx="32" cy="72" r="2.5" fill="rgba(255,255,255,0.35)"><animate attributeName="cx" values="32;30;32" dur="4s" repeatCount="indefinite" /></circle>
                          <circle cx="58" cy="70" r="2.5" fill="rgba(255,255,255,0.35)"><animate attributeName="cx" values="58;60;58" dur="3.5s" repeatCount="indefinite" /></circle>
                          <circle cx="42" cy="82" r="2" fill="rgba(255,255,255,0.2)"><animate attributeName="cy" values="82;84;82" dur="4.5s" repeatCount="indefinite" /></circle>
                          <line x1="45" y1="55" x2="33" y2="70" stroke="rgba(255,85,0,0.1)" strokeWidth="0.5" />
                          <line x1="45" y1="55" x2="57" y2="68" stroke="rgba(255,85,0,0.1)" strokeWidth="0.5" />
                          <rect x="10" y="100" width="70" height="28" rx="5" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                          <rect x="15" y="107" width="52" height="2" rx="1" fill="rgba(255,255,255,0.1)" />
                          <rect x="15" y="112" width="40" height="2" rx="1" fill="rgba(255,255,255,0.06)" />
                          <rect x="15" y="117" width="30" height="2" rx="1" fill="rgba(255,255,255,0.04)" />
                          <circle cx="36" cy="140" r="2.5" fill="rgba(255,85,0,0.5)" />
                          <circle cx="45" cy="140" r="2" fill="rgba(255,255,255,0.1)" />
                          <circle cx="54" cy="140" r="2" fill="rgba(255,255,255,0.1)" />
                          <rect x="20" y="150" width="50" height="1.5" rx="0.75" fill="rgba(255,255,255,0.04)" />
                          <rect x="20" y="150" width="18" height="1.5" rx="0.75" fill="rgba(255,85,0,0.3)" />
                          <defs>
                            <radialGradient id="stageGlow2" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stopColor="rgba(255,85,0,0.06)" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                            <linearGradient id="phoneGlow2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,85,0,0.4)" /><stop offset="50%" stopColor="rgba(255,85,0,0.1)" /><stop offset="100%" stopColor="transparent" /></linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>

                    {/* Right — copy */}
                    <div className="px-6 sm:px-8 pb-10 sm:py-14 text-left">
                      <p className="text-mars/40 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-bold mb-3">Digital Playmaker</p>
                      <h3 className="text-[22px] sm:text-[28px] font-black tracking-[-0.03em] leading-[1] mb-3 group-hover:text-white transition-colors">
                        Try it right here.
                      </h3>
                      <p className="text-white/25 text-[13px] sm:text-[14px] leading-[1.6] mb-6 max-w-xs">
                        AI turns your question into a reality play with characters, a stage, and new perspectives. Takes 30 seconds.
                      </p>
                      <div className="inline-flex items-center gap-2 text-mars/50 text-[11px] font-bold uppercase tracking-[0.15em] group-hover:text-mars transition-colors">
                        <span>Open Playmaker</span>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )}

        </div>
      </section>


      {/* ── RESULTS ── */}
      {submitted && (
        <section ref={resultRef} className="relative px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">

            {/* The question echo */}
            <div className="text-center mb-12 sm:mb-16 pt-8 sm:pt-12">
              <p className="text-white/10 text-[10px] uppercase tracking-[0.3em] mb-3">Your question</p>
              <p className="font-mercure italic text-white/30 text-[16px] sm:text-[20px] leading-[1.4]">&ldquo;{askedQuestion}&rdquo;</p>
              <button onClick={reset} className="text-white/10 text-[10px] uppercase tracking-[0.15em] mt-4 hover:text-mars/40 transition-colors">
                Ask something else
              </button>
            </div>

            {/* ═══ 3 PRODUCT OPTIONS — commercial menu ═══ */}
            {products.length > 0 && selectedIdx === null && (
              <div>
                <p className="text-mars/40 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-center mb-8 sm:mb-10">Choose your play</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                  {products.map((p, i) => {
                    const isLeader = i === 2;
                    return (
                      <button
                        key={i}
                        onClick={() => selectProduct(i)}
                        className={`relative w-full text-left rounded-2xl border overflow-hidden transition-all duration-300 group hover:scale-[1.02] flex flex-col ${
                          isLeader
                            ? "border-mars/20 bg-gradient-to-b from-mars/[0.06] to-mars/[0.01] hover:border-mars/35 hover:shadow-[0_0_40px_-10px_rgba(255,85,0,0.2)]"
                            : "border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/[0.15] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]"
                        }`}
                      >
                        {/* Top accent line */}
                        <div className={`h-[2px] ${isLeader ? "bg-gradient-to-r from-mars/40 via-mars to-mars/40" : "bg-gradient-to-r from-transparent via-white/10 to-transparent"}`} />

                        <div className="p-5 sm:p-6 flex flex-col flex-1">
                          {/* Tag */}
                          <p className={`text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-bold mb-4 ${isLeader ? "text-mars/60" : "text-white/25"}`}>{p.tag}</p>

                          {/* Theme — big bold keyword */}
                          <h3 className={`text-[32px] sm:text-[38px] font-black tracking-[-0.04em] leading-[0.9] mb-1 ${isLeader ? "text-mars" : "text-white/90"}`}>
                            {p.theme}
                          </h3>
                          <p className="text-white/25 text-[12px] sm:text-[13px] font-medium tracking-[-0.01em] mb-4">on Mars</p>

                          {/* Pitch */}
                          <p className="text-white/30 text-[12px] sm:text-[13px] leading-[1.55] mb-6 flex-1">
                            {p.pitch}
                          </p>

                          {/* Bottom stats bar */}
                          <div className={`border-t pt-4 mt-auto ${isLeader ? "border-mars/10" : "border-white/[0.06]"}`}>
                            <div className="flex items-end justify-between">
                              <div className="space-y-1">
                                <p className="text-white/20 text-[10px]">{p.duration} · {p.people}</p>
                              </div>
                              <p className={`text-[14px] sm:text-[15px] font-bold tracking-tight ${isLeader ? "text-mars/70" : "text-white/40"}`}>{p.price}</p>
                            </div>
                          </div>
                        </div>

                        {/* Hover arrow */}
                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg viewBox="0 0 24 24" className={`w-4 h-4 fill-current ${isLeader ? "text-mars/50" : "text-white/20"}`}><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}


            {/* ═══ SELECTED PRODUCT — Live invitation ═══ */}
            {selectedIdx !== null && products[selectedIdx] && (
              <>
                {/* Back to options */}
                <div className="mb-6 sm:mb-8">
                  <button onClick={() => { setSelectedIdx(null); setPlay(null); setShowDigital(false); }} className="text-white/15 text-[10px] uppercase tracking-[0.15em] hover:text-white/30 transition-colors">
                    ← Back to all plays
                  </button>
                </div>

                {/* Live play card */}
                <div className="relative rounded-3xl overflow-hidden mb-6 sm:mb-8">
                  <div className="absolute inset-0">
                    <img src="/space1.png" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/90 via-[#0a0a0a]/75 to-[#0a0a0a]/85" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  </div>
                  <div className="absolute inset-0 border border-mars/[0.1] rounded-3xl" />
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-mars/25 to-transparent" />

                  <div className="relative z-10 p-8 sm:p-12 md:p-16 lg:p-20">
                    <div className="inline-flex items-center gap-2 mb-10 sm:mb-14">
                      <div className="w-1.5 h-1.5 rounded-full bg-mars" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                      <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold">
                        {products[selectedIdx].tag}
                      </p>
                    </div>

                    <h3 className="text-[40px] sm:text-[56px] md:text-[72px] lg:text-[86px] font-black tracking-[-0.04em] leading-[0.88] mb-6 sm:mb-8">
                      {products[selectedIdx].theme}
                      <br />
                      <span className="text-mars">on Mars</span>
                    </h3>

                    <p className="font-mercure text-white/35 text-[15px] sm:text-[18px] md:text-[20px] leading-[1.7] mb-10 sm:mb-14 max-w-xl">
                      {products[selectedIdx].pitch}
                    </p>

                    <div className="flex flex-wrap gap-6 sm:gap-10 mb-10 sm:mb-14">
                      {[
                        { label: "Duration", value: products[selectedIdx].duration },
                        { label: "Players", value: products[selectedIdx].people },
                        { label: "Stage", value: "Praha flagship" },
                        { label: "Guide", value: "Systemic facilitator" },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-white/12 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mb-1">{item.label}</p>
                          <p className="text-white/50 text-[13px] sm:text-[14px] font-bold">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-3 text-[12px] sm:text-[14px] font-black uppercase tracking-[0.15em] text-[#0a0a0a] bg-mars hover:bg-mars-light px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all shadow-[0_8px_40px_-4px_rgba(255,85,0,0.3)] hover:shadow-[0_12px_50px_-4px_rgba(255,85,0,0.45)]"
                      >
                        Book this play
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                      </a>
                      <p className="text-white/20 text-[12px] sm:text-[13px]">{products[selectedIdx].price}</p>
                    </div>
                  </div>
                </div>

                {/* ═══ DIGITAL SIMULATION ═══ */}
                <div className="relative mt-0">
                  {!showDigital ? (
                    <button
                      onClick={openDigital}
                      className="w-full relative rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:border-mars/[0.15] hover:bg-white/[0.03] transition-all duration-500 group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.03)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10 py-10 sm:py-14 px-8 sm:px-12 text-center">
                        <p className="text-white/15 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] mb-5">Or try it right here</p>

                        {/* Phone mockup — SVG with real stage UI */}
                        <div className="inline-block mb-6 group-hover:scale-[1.03] transition-transform duration-700">
                          <svg width="90" height="170" viewBox="0 0 90 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[110px] sm:h-[208px] drop-shadow-[0_0_30px_rgba(255,85,0,0.08)] group-hover:drop-shadow-[0_0_40px_rgba(255,85,0,0.15)] transition-all duration-700">
                            {/* Phone body */}
                            <rect x="1" y="1" width="88" height="168" rx="18" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="#111" />
                            <rect x="1" y="1" width="88" height="168" rx="18" stroke="url(#phoneGlow)" strokeWidth="1" className="opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            {/* Dynamic Island */}
                            <rect x="30" y="6" width="30" height="8" rx="4" fill="#0a0a0a" />
                            {/* Screen area */}
                            <rect x="5" y="5" width="80" height="160" rx="15" fill="#0a0a0a" />

                            {/* -- Screen content -- */}
                            {/* Play title */}
                            <rect x="12" y="22" width="38" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
                            <rect x="12" y="28" width="22" height="2" rx="1" fill="rgba(255,85,0,0.3)" />

                            {/* Stage circle */}
                            <circle cx="45" cy="68" r="24" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />
                            <circle cx="45" cy="68" r="17" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 2" />
                            {/* Stage glow */}
                            <circle cx="45" cy="68" r="24" fill="url(#stageGlow)" />

                            {/* Characters on stage */}
                            <circle cx="45" cy="52" r="3.5" fill="rgba(255,85,0,0.8)">
                              <animate attributeName="cy" values="52;50;52" dur="3s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="32" cy="72" r="2.5" fill="rgba(255,255,255,0.35)">
                              <animate attributeName="cx" values="32;30;32" dur="4s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="58" cy="70" r="2.5" fill="rgba(255,255,255,0.35)">
                              <animate attributeName="cx" values="58;60;58" dur="3.5s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="42" cy="82" r="2" fill="rgba(255,255,255,0.2)">
                              <animate attributeName="cy" values="82;84;82" dur="4.5s" repeatCount="indefinite" />
                            </circle>

                            {/* Connection lines between characters */}
                            <line x1="45" y1="55" x2="33" y2="70" stroke="rgba(255,85,0,0.1)" strokeWidth="0.5" />
                            <line x1="45" y1="55" x2="57" y2="68" stroke="rgba(255,85,0,0.1)" strokeWidth="0.5" />

                            {/* Narration box */}
                            <rect x="10" y="100" width="70" height="28" rx="5" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                            <rect x="15" y="107" width="52" height="2" rx="1" fill="rgba(255,255,255,0.1)" />
                            <rect x="15" y="112" width="40" height="2" rx="1" fill="rgba(255,255,255,0.06)" />
                            <rect x="15" y="117" width="30" height="2" rx="1" fill="rgba(255,255,255,0.04)" />

                            {/* Step indicators */}
                            <circle cx="36" cy="140" r="2.5" fill="rgba(255,85,0,0.5)" />
                            <circle cx="45" cy="140" r="2" fill="rgba(255,255,255,0.1)" />
                            <circle cx="54" cy="140" r="2" fill="rgba(255,255,255,0.1)" />

                            {/* Progress bar */}
                            <rect x="20" y="150" width="50" height="1.5" rx="0.75" fill="rgba(255,255,255,0.04)" />
                            <rect x="20" y="150" width="18" height="1.5" rx="0.75" fill="rgba(255,85,0,0.3)" />

                            {/* Gradients */}
                            <defs>
                              <radialGradient id="stageGlow" cx="0.5" cy="0.5" r="0.5">
                                <stop offset="0%" stopColor="rgba(255,85,0,0.06)" />
                                <stop offset="100%" stopColor="transparent" />
                              </radialGradient>
                              <linearGradient id="phoneGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(255,85,0,0.4)" />
                                <stop offset="50%" stopColor="rgba(255,85,0,0.1)" />
                                <stop offset="100%" stopColor="transparent" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>

                        <p className="text-white/50 text-[18px] sm:text-[22px] md:text-[26px] font-bold tracking-[-0.02em] group-hover:text-white/70 transition-colors">
                          Simulate this play digitally
                        </p>
                        <p className="font-mercure text-white/15 text-[12px] sm:text-[14px] mt-3 group-hover:text-white/25 transition-colors">
                          AI-generated reality play you can walk through now
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 text-mars/40 text-[11px] font-bold uppercase tracking-[0.15em] group-hover:text-mars/70 transition-colors">
                          <span>Open Playmaker</span>
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /></svg>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="relative">
                      <div className="absolute -inset-4 sm:-inset-8 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.04)_0%,_transparent_70%)] pointer-events-none" />

                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-mars" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                          <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold">Digital Playmaker</p>
                        </div>
                        <button onClick={() => setShowDigital(false)} className="text-white/15 text-[10px] uppercase tracking-[0.15em] hover:text-white/30 transition-colors">
                          Close
                        </button>
                      </div>

                      {play && (
                        <div className="mb-6 sm:mb-8">
                          <h3 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">{play.name}</h3>
                          <p className="text-white/20 text-[11px] mt-1 font-mercure italic">{play.mood} · {play.characters.length} characters</p>
                        </div>
                      )}

                      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                        {(playLoading || simLoading) && (
                          <div className="text-center py-20 sm:py-28">
                            <div className="inline-flex gap-2 mb-5">
                              {[0, 1, 2].map((i) => (
                                <div key={i} className="w-2.5 h-2.5 rounded-full bg-mars" style={{ animation: `glow-pulse 1.2s ease-in-out ${i * 0.25}s infinite` }} />
                              ))}
                            </div>
                            <p className="text-white/25 text-[13px] sm:text-[14px] font-mercure italic">
                              {playLoading ? "Creating your play..." : "Choreographing the stage..."}
                            </p>
                          </div>
                        )}

                        {simReady && play && play.simulation && play.simulationSteps && (
                          <div className="p-4 sm:p-6">
                            <StageSimulation
                              simulationSteps={play.simulationSteps}
                              characters={play.characters}
                              simulation={play.simulation}
                            />
                          </div>
                        )}

                        {simReady && play && play.perspectives && play.perspectives.length > 0 && (
                          <div className="p-6 sm:p-8 border-t border-white/[0.04]">
                            <p className="text-mars/30 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mb-5 font-bold">Perspectives</p>
                            <div className="space-y-3">
                              {play.perspectives.map((p, i) => {
                                const perspective = typeof p === "object" ? (p as Perspective) : null;
                                return (
                                  <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
                                    {perspective ? (
                                      <>
                                        <p className="text-mars/40 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">{perspective.character}</p>
                                        <p className="text-white/45 text-[13px] leading-[1.6] font-mercure italic">{perspective.insight}</p>
                                      </>
                                    ) : (
                                      <p className="text-white/45 text-[13px] leading-[1.6] font-mercure italic">{String(p)}</p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {simReady && play && play.followUpQuestion && (
                        <div className="text-center mt-10 sm:mt-14">
                          <p className="text-white/12 text-[10px] uppercase tracking-[0.25em] mb-3">What if you asked</p>
                          <p className="font-mercure italic text-white/35 text-[16px] sm:text-[20px] leading-[1.4] mb-5">&ldquo;{play.followUpQuestion}&rdquo;</p>
                          <button
                            onClick={() => {
                              const followUp = play.followUpQuestion!;
                              reset();
                              setTimeout(() => { setQuestion(followUp); }, 100);
                            }}
                            className="text-mars/50 text-[11px] font-bold uppercase tracking-[0.15em] hover:text-mars transition-colors"
                          >
                            Ask this question →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </section>
      )}


      {/* ── SOCIAL PROOF + VOICES — compact atmospheric block ── */}
      <FadeIn className="py-16 sm:py-24 px-4 mt-8 sm:mt-12">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
            {/* Top accent */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/15 to-transparent" />

            {/* Voices quote — top section */}
            <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8">
              <Voices />
            </div>

            {/* Divider */}
            <div className="mx-6 sm:mx-10 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Client logos — transparent blend */}
            <div className="px-6 sm:px-10 py-6 sm:py-8">
              <p className="text-white/15 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-center mb-5">Trusted by</p>
              <img src="/clients.png" alt="Clients" className="w-full max-w-xl mx-auto invert opacity-[0.25] hover:opacity-[0.4] transition-opacity duration-700 mix-blend-screen" />
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── THE SPACE — Stage box ── */}
      {!submitted && (
        <FadeIn className="px-4 sm:px-6 pb-6 sm:pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/15 to-transparent" />
              {/* Photo */}
              <div className="relative h-[35vh] sm:h-[50vh]">
                <img src="/space1.png" alt="Stage on Mars — flagship space" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/20" />
              </div>
              {/* Info bar below photo */}
              <div className="px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-mars/40 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-bold mb-1.5">The stage</p>
                  <p className="text-white/80 text-[16px] sm:text-[20px] font-bold tracking-[-0.02em]">Národní 138/10, Praha</p>
                  <p className="text-white/25 text-[12px] sm:text-[13px] mt-0.5">The flagship space. Where reality plays happen.</p>
                </div>
                <a href="/space" className="shrink-0 text-mars/50 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] hover:text-mars transition-colors">
                  Explore →
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── TEAM — Stage box ── */}
      <FadeIn className="px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
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
                <p className="text-mars/30 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-bold">The crew</p>
                <p className="font-mercure text-white/35 text-[13px] sm:text-[14px] leading-[1.7]">
                  Born during COVID. Systemic constellations meets theatre meets improvisation.
                </p>
                <p className="font-mercure text-white/35 text-[13px] sm:text-[14px] leading-[1.7]">
                  In 2023, David Vais joined. Platform built. Stage opened. Brand born.
                </p>
                <div className="pt-2">
                  <p className="text-white/50 text-[11px] sm:text-[12px] font-bold">
                    800+ reality plays. London, Zurich, Bucharest.
                  </p>
                  <p className="text-white/15 text-[10px] mt-2">
                    Milan Semelak · David Vais · Tomas Pavlik · Jan Piskor · Andrea Sturalova
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── CONTACT — Stage box ── */}
      <FadeIn className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto">
          <div id="contact" className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent" />

            <div className="p-6 sm:p-10">
              <div className="max-w-md mx-auto space-y-8">
                <div className="text-center">
                  <p className="text-mars/30 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-bold mb-4">Get on stage</p>
                  <h2 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">
                    {submitted ? "Let\u2019s make it happen." : "What\u2019s your question?"}
                  </h2>
                  <p className="font-mercure text-white/20 text-[12px] sm:text-[13px] mt-2">We reply within 24 hours.</p>
                </div>

                {sent ? (
                  <div className="text-center py-8">
                    <p className="font-mercure text-white/40 text-[14px]">Thank you. We&apos;ll be in touch.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-2.5">
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <input name="name" value={formData.name} onChange={handleContactChange} placeholder="Name" required className="font-mercure w-full rounded-xl bg-white/[0.03] border border-white/[0.06] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/15 focus:outline-none transition-colors" />
                      <input name="company" value={formData.company} onChange={handleContactChange} placeholder="Company" className="font-mercure w-full rounded-xl bg-white/[0.03] border border-white/[0.06] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/15 focus:outline-none transition-colors" />
                    </div>
                    <input name="email" type="email" value={formData.email} onChange={handleContactChange} placeholder="Email" required className="font-mercure w-full rounded-xl bg-white/[0.03] border border-white/[0.06] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/15 focus:outline-none transition-colors" />
                    <textarea name="question" value={formData.question || askedQuestion} onChange={handleContactChange} placeholder="Your question" rows={3} className="font-mercure w-full rounded-xl bg-white/[0.03] border border-white/[0.06] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/15 focus:outline-none transition-colors resize-none" />
                    <button type="submit" className="w-full py-3.5 rounded-xl bg-mars hover:bg-mars-light text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all shadow-[0_4px_20px_-4px_rgba(255,85,0,0.3)]">
                      Let&apos;s Talk
                    </button>
                  </form>
                )}

                <p className="text-center font-mercure text-white/10 text-[11px]">
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
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-white/10 text-[10px]">
          <span>&copy; {new Date().getFullYear()} Stage on Mars</span>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/stage_on_mars" target="_blank" rel="noopener noreferrer" className="hover:text-white/25 transition-colors">Instagram</a>
            <a href="https://www.linkedin.com/company/stageonmars" target="_blank" rel="noopener noreferrer" className="hover:text-white/25 transition-colors">LinkedIn</a>
            <a href="https://playbook.stageonmars.com" className="hover:text-white/25 transition-colors">Playbook</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
