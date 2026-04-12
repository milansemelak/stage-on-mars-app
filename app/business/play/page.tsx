"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Play, Perspective } from "@/lib/types";
import StageSimulation from "@/components/StageSimulation";

/* ══════════════════════════════════════════════════════════════════
   PLAY 1: BUSINESS CONTEXT — What business domain is the question about?
   ══════════════════════════════════════════════════════════════════ */

const BUSINESS_MAP: [RegExp, string, string][] = [
  // [pattern, theme, pitch fragment]

  // ── Strategy & Direction ──
  [/strateg|direction|priorit|roadmap|plan ahead|where.*(go|head)|what.*(focus|next)/i, "Strategy", "strategic direction"],
  [/decision|choose|dilemma|trade.?off|which way|crossroad|fork/i, "Decisions", "decision-making"],
  [/vision|future|long.?term|5 year|ten year|horizon|where.*heading|foresight/i, "Vision", "vision and future"],
  [/mission|north star|compass|guiding/i, "Mission", "mission"],
  [/goal|ambition|target|aspir|aim|objective/i, "Ambition", "ambition"],
  [/focus|distract|scatter|too many|overwhelm|simplif/i, "Focus", "focus"],
  [/alignment|misalign|same page|disconnect|fragment/i, "Alignment", "alignment"],
  [/execution|implement|deliver|ship|get.*done|follow.?through/i, "Execution", "execution"],

  // ── Growth & Scale ──
  [/grow|growth|scale|expand|10x|100x|double|triple|bigger|accelerat/i, "Growth", "growth dynamics"],
  [/market|position|competit|differenti|niche|segment|share|rival/i, "Market", "market positioning"],
  [/revenue|profit|margin|monetiz|pricing|cost|budget|financ|money|cash|roi/i, "Value", "value creation"],
  [/product|launch|ship|release|mvp|feature|build.*product|roadmap/i, "Product", "product development"],
  [/customer|client|user|retention|churn|loyalt|acquisition|nps/i, "Customers", "customer relationships"],
  [/brand|reputation|perception|image|story|narrative|awareness/i, "Brand", "brand identity"],
  [/sales|selling|pipeline|conversion|deal|close|prospect|funnel/i, "Sales", "sales performance"],
  [/partnership|alliance|joint venture|collaborat.*extern|ecosystem/i, "Partnerships", "partnerships"],
  [/invest|funding|raise|capital|vc|series|valuat|exit|ipo/i, "Capital", "capital and investment"],
  [/international|global|abroad|foreign|export|enter.*market|expansion/i, "Expansion", "international expansion"],
  [/startup|early.?stage|bootstrap|lean|garage|hustle/i, "Startup", "startup dynamics"],
  [/enterprise|corporate|large.?scale|fortune|establishment/i, "Enterprise", "enterprise dynamics"],
  [/subscription|saas|recurring|arr|mrr|ltv|cac/i, "Recurring", "recurring business"],
  [/supply.?chain|logistics|operation|manufactur|production|inventory/i, "Operations", "operations"],
  [/quality|standard|excellen|premium|craft|detail/i, "Excellence", "excellence"],

  // ── People & Organization ──
  [/team|collaborat|together|silos|align|department|cross.?function/i, "Team", "team dynamics"],
  [/cultur|value|who are we|belong|dna|way we work|spirit|vibe/i, "Culture", "company culture"],
  [/talent|hire|recruit|retain|people leav|turnover|employer brand/i, "Talent", "talent and people"],
  [/lead|leader|manage|ceo|founder|boss|authority|c.?suite|executive/i, "Leadership", "leadership"],
  [/trust|psycholog|safe|conflict|tension|friction|dysfunct/i, "Trust", "trust and safety"],
  [/communi|speak|listen|silent|voice|heard|feedback|transparen/i, "Voice", "communication"],
  [/power|control|dominan|hierarchy|ego|politic|influenc/i, "Power", "power dynamics"],
  [/diversity|inclusion|equity|belonging|bias|represent/i, "Belonging", "diversity and belonging"],
  [/onboard|new hire|first 90|probation|welcome|induction/i, "Onboarding", "onboarding"],
  [/remote|hybrid|office|work from|distributed|async/i, "Hybrid", "hybrid work"],
  [/succession|next gen|hand.?over|transition.*leader|passing.*torch/i, "Succession", "succession"],
  [/board|govern|oversight|shareholder|stakeholder|advisory/i, "Governance", "governance"],
  [/founder|co.?founder|partner.*business|ownership|equity.*split/i, "Founders", "founder dynamics"],
  [/middle.?manage|sandwich|between|caught.*middle/i, "Middle", "middle management"],
  [/gen.?z|millennial|generation|young|old|age.*gap|boomer/i, "Generations", "generational dynamics"],
  [/motivation|engage|disengag|apathy|passion|fire.*belly/i, "Motivation", "motivation"],
  [/accountability|responsib|ownership|blame|finger.*point/i, "Accountability", "accountability"],
  [/toxic|bully|harassment|hostile|abusive|fear.*culture/i, "Toxicity", "toxic dynamics"],
  [/loyalty|devotion|commit|dedic|allegianc/i, "Loyalty", "loyalty"],
  [/ego|narciss|self.*import|arrog|humble|humil/i, "Ego", "ego"],

  // ── Change & Transformation ──
  [/chang|transform|transition|restructur|pivot|reinvent/i, "Transformation", "transformation"],
  [/innovat|new idea|experiment|lab|prototype/i, "Innovation", "innovation"],
  [/creat|design|craft|artis|aesthetic|beautiful/i, "Creativity", "creativity"],
  [/digit|tech|ai|automat|machine|software|platform|algorithm/i, "Digital", "digital transformation"],
  [/merger|acqui|integrat|consolidat|m&a|takeover/i, "Integration", "integration"],
  [/agil|speed|fast|slow|bureaucra|process|efficienc/i, "Agility", "organizational agility"],
  [/disrupt|obsole|replace|leapfrog|paradigm/i, "Disruption", "disruption"],
  [/legacy|old.*system|technical.*debt|moderniz|updat|upgrade/i, "Legacy", "legacy systems"],
  [/adapt|flexib|resilien|anti.?fragil|bounce.*back/i, "Resilience", "resilience"],
  [/learn|develop|training|upskill|reskill|academy|knowledge/i, "Learning", "learning"],
  [/data|analytics|insight|measure|dashboard|intelligence/i, "Data", "data and intelligence"],

  // ── Performance & Results ──
  [/perform|result|kpi|metric|target|goal|okr|objective/i, "Performance", "performance"],
  [/success|win|best|peak|champion|top|excell/i, "Success", "success"],
  [/fail|mistake|error|wrong|flop|disaster|catastroph/i, "Failure", "failure"],
  [/stuck|block|stagnant|plateau|comfort zone|rut|inertia/i, "Breakthrough", "breaking through"],
  [/burnout|exhaust|energy|balanc|wellbeing|mental health|stress|overwork/i, "Balance", "balance and energy"],
  [/speed|velocity|momentum|accelerat|fast.*enough|too.*slow/i, "Momentum", "momentum"],
  [/waste|inefficien|bloat|lean|cut|streamlin|optimi/i, "Efficiency", "efficiency"],
  [/complex|complicat|simple|simplif|messy|tangl|chaos/i, "Complexity", "complexity"],

  // ── Purpose, Meaning & Values ──
  [/purpose|meaning|why.*exist|raison|calling|vocation/i, "Purpose", "purpose"],
  [/sustainab|esg|responsib|planet|climate|green|carbon/i, "Impact", "impact and responsibility"],
  [/ethic|moral|right thing|integrity|principle|corruption/i, "Integrity", "integrity"],
  [/legacy|heritage|tradition|history|roots|origin/i, "Heritage", "heritage"],
  [/identity|who.*are.*we|stand.*for|authentic|genuine/i, "Identity", "identity"],
  [/freedom|autonomy|independen|liber|emancipat/i, "Freedom", "freedom"],
  [/justice|fair|unfair|equal|inequal|gap/i, "Justice", "justice"],

  // ── Emotions & Human Forces ──
  [/fear|afraid|risk|uncertain|anxiety|worry|danger|threat/i, "Courage", "courage under uncertainty"],
  [/crisis|emergency|survival|existential|collapse/i, "Survival", "survival and crisis"],
  [/impossible|crazy|never|can.t|no way|dream|moonshot/i, "Impossible", "the impossible"],
  [/anger|frustrat|rage|fury|resent|bitter/i, "Anger", "anger"],
  [/grief|loss|mourning|death|end|goodbye|letting.*go/i, "Loss", "loss"],
  [/hope|optimis|bright|light.*tunnel|possib/i, "Hope", "hope"],
  [/love|passion|heart|soul|care|compassion/i, "Heart", "heart"],
  [/jealous|envy|compari|inferior|superior/i, "Envy", "envy"],
  [/shame|guilt|embarrass|regret|sorry/i, "Shame", "shame"],
  [/pride|proud|dignit|honor|glory/i, "Pride", "pride"],
  [/loneli|isolat|alone|disconnect|alienat/i, "Isolation", "isolation"],
  [/belong|home|tribe|communit|family|together/i, "Belonging", "belonging"],
  [/secret|hidden|unspoken|taboo|elephant|undiscuss/i, "Secrets", "secrets"],
  [/truth|honest|lie|deceit|pretend|facade|fake/i, "Truth", "truth"],
  [/forgiv|reconcil|repair|restore|second chance/i, "Forgiveness", "forgiveness"],
  [/gratitude|thankful|appreciat|recogni/i, "Gratitude", "gratitude"],
  [/respect|disrespect|dignit|treat|regard/i, "Respect", "respect"],
  [/patient|impatient|wait|timing|rush|hurry/i, "Patience", "patience"],
  [/obsess|addict|compuls|fixat|driven/i, "Obsession", "obsession"],
  [/bore|boring|routine|monoton|repetit|stale/i, "Boredom", "boredom"],
  [/curious|wonder|explor|question|ask|inquir/i, "Curiosity", "curiosity"],
  [/confiden|self.?doubt|imposter|believ.*self|insecur/i, "Confidence", "confidence"],
  [/control|letting.*go|surrender|accept|resist/i, "Control", "control"],

  // ── Relationships & Dynamics ──
  [/family|parent|child|son|daughter|sibling|generation.*business/i, "Family", "family"],
  [/partner|marriage|spouse|relationship|love.*life/i, "Partnership", "partnership"],
  [/friend|friendship|loyal|betray|back.*stab/i, "Friendship", "friendship"],
  [/mentor|coach|guide|teach|learn.*from|apprentic/i, "Mentorship", "mentorship"],
  [/rival|enemy|nemesis|opponent|adversar/i, "Rivals", "rivalry"],
  [/negotiat|deal|bargain|compromise|mediat/i, "Negotiation", "negotiation"],

  // ── Industry-specific ──
  [/hospital|patient|doctor|healthcare|pharma|medic|clinic/i, "Healthcare", "healthcare"],
  [/school|universit|education|student|teach|academ/i, "Education", "education"],
  [/media|content|publish|journal|news|broadcast/i, "Media", "media"],
  [/sport|athlete|coach|compet|champion|olymp/i, "Sport", "sport"],
  [/art|music|film|theatre|perform|creativ.*industr/i, "Art", "art"],
  [/food|restaurant|chef|hospitality|hotel|tourism/i, "Hospitality", "hospitality"],
  [/real.?estate|property|construction|architect|develop.*land/i, "Property", "property"],
  [/legal|law|regulat|complian|govern|polic/i, "Regulation", "regulation"],
  [/bank|insurance|fintech|payment|lending|credit/i, "Finance", "finance"],
  [/retail|shop|store|e.?commerce|consumer|fashion/i, "Retail", "retail"],
  [/energy|oil|gas|renew|solar|wind|nuclear|mining/i, "Energy", "energy"],
  [/transport|mobil|fleet|deliver|freight|shipping/i, "Mobility", "mobility"],
  [/ngo|nonprofit|charity|social.*enterprise|foundation/i, "Social", "social enterprise"],
  [/government|public.*sector|civil|municipal|state|ministry/i, "Public", "public sector"],
  [/church|faith|spirit|religion|congregation|parish/i, "Faith", "faith"],
];

/* ── Business-themed pitch descriptions ── */
const BUSINESS_PITCHES: Record<string, string> = {
  Strategy: "Where is {co} really heading — and what's pulling it off course? Your team maps the forces on stage. The real strategy emerges.",
  Decisions: "The choices {co} is avoiding get played out live. Characters embody the trade-offs. You see the cost of indecision.",
  Vision: "What does {co} look like in 5 years? Your team builds that future on stage — then watches what tries to destroy it.",
  Mission: "What is {co} really here to do? Not the poster — the fire. Your team plays the mission until it becomes real.",
  Ambition: "How far does {co} really want to go? The ambition plays out on stage. You see who's driving and who's braking.",
  Focus: "What deserves the attention of {co} — and what's stealing it? Your team plays focus vs. distraction live.",
  Alignment: "Is {co} actually aligned or just pretending? The disconnects surface on stage. You see where the team fractures.",
  Execution: "The plan is clear. The execution isn't. Your team at {co} plays the gap between intention and delivery.",
  Growth: "What's actually blocking {co} from growing? Your team plays out the growth dynamics. The bottleneck reveals itself.",
  Market: "Where does {co} really stand? Competitors, customers, blind spots — all on stage. The market tells you what you're missing.",
  Value: "Follow the money at {co}. Where value is created, where it leaks, who controls it. The financial dynamics play out live.",
  Product: "Your product vision meets reality on stage. Users, builders, and blockers step into the play. You see what ships and what stalls.",
  Customers: "Your customers step on stage at {co}. What they really think. What they don't say. The relationship plays out in real time.",
  Brand: "What does {co} really stand for? Not the deck — the truth. Characters play your brand from the inside and outside.",
  Sales: "The sale that won't close. The pipeline that's stuck. Your team plays out the real dynamics between {co} and the market.",
  Partnerships: "The partnerships {co} needs — and the ones dragging it down. Allies and parasites meet on stage.",
  Capital: "The money conversation at {co}. Investors, founders, burn rate — the capital dynamics play out live.",
  Expansion: "New markets, new cultures, new rules. {co} steps onto foreign ground — on stage. You see what translates and what breaks.",
  Startup: "The startup energy of {co} — raw, fast, fragile. Your team plays the forces of creation and survival.",
  Enterprise: "The weight of {co}. Scale, process, politics. Your team plays what the enterprise has become — and what it's lost.",
  Recurring: "The engine that keeps {co} alive. Retention, churn, lifetime value — the recurring dynamics play out on stage.",
  Operations: "The machine behind {co}. Supply chain, production, logistics — the invisible gears play out live.",
  Excellence: "What does excellence look like at {co}? Not good enough. Not average. The standard plays out on stage.",
  Team: "What's the real dynamic inside {co}? Who leads, who follows, who's silent? The team shows itself on stage.",
  Culture: "The culture of {co} — not the values on the wall, but the ones in the hallway. Your team plays it out. You see the gap.",
  Talent: "Why do people join {co}? Why do they leave? The talent forces play out on stage. You see what you're really offering.",
  Leadership: "What kind of leader does {co} need right now? Not the job description — the real force. Your team plays it out.",
  Trust: "The trust that's missing at {co}. Where it broke, who broke it, what would rebuild it. All on stage.",
  Voice: "Who speaks at {co}? Who stays silent? The communication dynamics play out live. You hear what's been unsaid.",
  Power: "Who really holds power at {co}? Not the org chart — the invisible lines. Your team plays the power dynamics live.",
  Belonging: "Who belongs at {co} and who doesn't feel it? The inclusion dynamics play out on stage. You see the invisible walls.",
  Onboarding: "The first 90 days at {co}. What new people see, feel, and learn — before anyone tells them. Played out live.",
  Hybrid: "Remote vs. office vs. something else at {co}. The hybrid forces collide on stage. You see what's really working.",
  Succession: "Who takes over at {co}? The old guard and the new blood meet on stage. Power, trust, and letting go.",
  Governance: "The board, the shareholders, the oversight at {co}. Governance dynamics play out live. You see who really steers.",
  Founders: "The founder dynamic at {co}. Vision, ego, partnership, sacrifice. The founding forces play out on stage.",
  Middle: "Caught in the middle at {co}. The pressure from above, the resistance from below. Middle management plays out live.",
  Generations: "Old school meets new school at {co}. The generational clash plays out on stage. You see the gap — and the bridge.",
  Motivation: "What lights people up at {co} — and what kills their fire? Motivation and apathy meet on stage.",
  Accountability: "Who owns what at {co}? The blame game, the finger-pointing, the real ownership. Played out live.",
  Toxicity: "The toxic patterns at {co}. The bullying, the fear, the silence. Your team confronts it on stage.",
  Loyalty: "What keeps people at {co}? Loyalty, fear, or golden handcuffs? The truth plays out on stage.",
  Ego: "The egos shaping {co}. Who needs to be right, who needs to be seen. The ego dynamics play out live.",
  Transformation: "What is {co} becoming? The old and the new collide on stage. Your team plays the forces of change.",
  Innovation: "Where does innovation live at {co} — and what kills it? The creative forces and the blockers meet on stage.",
  Creativity: "The creative soul of {co}. What feeds it, what starves it. Your team plays creativity vs. control.",
  Digital: "The digital future of {co} meets the human reality. Technology, people, resistance — all played out live.",
  Integration: "Two worlds becoming one at {co}. The cultures, the fears, the opportunities. Integration plays out on stage.",
  Agility: "What slows {co} down? Bureaucracy, fear, habit? The forces of speed and friction meet on stage.",
  Disruption: "The disruption heading for {co}. Ignore it or ride it? Your team plays both futures on stage.",
  Legacy: "The old system at {co}. What to keep, what to kill, what to transform. Legacy meets progress on stage.",
  Resilience: "How much can {co} take? The resilience of your team plays out under pressure on stage.",
  Learning: "What does {co} know — and what it refuses to learn? The learning dynamics play out live.",
  Data: "The data tells one story. The people tell another. At {co}, both versions meet on stage.",
  Performance: "What drives results at {co} — and what sabotages them? Performance dynamics play out live.",
  Success: "What does winning look like at {co}? Your team plays the forces of success — and what it costs.",
  Failure: "The failure {co} won't talk about. Characters play the mistakes, the blame, the lessons. All on stage.",
  Breakthrough: "What's keeping {co} stuck? The invisible walls, the comfort zones. Your team breaks through them on stage.",
  Balance: "The energy at {co} — where it flows and where it burns out. Your team plays the balance between drive and destruction.",
  Momentum: "The speed of {co}. What accelerates, what drags. Your team plays the momentum dynamics on stage.",
  Efficiency: "The waste hiding inside {co}. Bloat, politics, busy work. Your team plays lean vs. fat on stage.",
  Complexity: "The complexity choking {co}. Too many layers, too many processes. Simplicity and chaos meet on stage.",
  Purpose: "Why does {co} exist? Not the mission statement — the real reason. Purpose meets reality on stage.",
  Impact: "What mark is {co} leaving on the world? The impact you intend vs. the impact you create. Played out live.",
  Integrity: "The gap between what {co} says and what it does. Characters play both sides. You see the truth.",
  Heritage: "Where {co} comes from. The roots, the origin story, what's been forgotten. Heritage plays out on stage.",
  Identity: "Who is {co} — really? Not the brand book. The truth. Your team plays identity live.",
  Freedom: "The freedom inside {co}. Who has it, who doesn't. Autonomy and control meet on stage.",
  Justice: "What's fair at {co} — and what isn't? The equity dynamics play out live.",
  Courage: "What is {co} afraid of? The fears that shape decisions, the risks nobody takes. Courage meets reality on stage.",
  Survival: "Is {co} in danger? The survival forces play out live — threats, allies, blind spots. You see what's really at stake.",
  Impossible: "The thing {co} thinks it can't do. Characters embody the impossibility — then your team plays through it.",
  Anger: "The anger inside {co}. What's building, what's about to break. The frustration plays out live on stage.",
  Loss: "What has {co} lost — and what it refuses to let go of? Grief and renewal meet on stage.",
  Hope: "The hope driving {co}. What keeps your team going when everything says stop. Hope plays out live.",
  Heart: "The heart of {co}. Not the KPIs — the love, the passion, the care. Your team plays what really matters.",
  Envy: "Who's watching whom at {co}? The jealousy, the competition, the comparison. Envy plays out on stage.",
  Shame: "The shame hiding at {co}. The mistakes buried, the guilt carried. Your team plays the unspoken.",
  Pride: "The pride of {co}. What you've built, what you stand for. Your team plays the dignity on stage.",
  Isolation: "The loneliness inside {co}. Who's disconnected, who's invisible. Isolation plays out live.",
  Secrets: "The things nobody says at {co}. The elephant in the room. Your team plays the unspoken truth.",
  Truth: "The truth about {co}. The lies, the pretending, the facade. Your team plays what's real — on stage.",
  Forgiveness: "What needs to be forgiven at {co}? The old wounds, the grudges. Forgiveness plays out on stage.",
  Gratitude: "What {co} takes for granted. The people, the wins, the foundations. Gratitude meets reality on stage.",
  Respect: "Who gets respect at {co} — and who doesn't? The dynamics of dignity play out live.",
  Patience: "The rush vs. the wait at {co}. Timing, urgency, and wisdom. Patience plays out on stage.",
  Obsession: "The obsession driving {co}. Is it fuel or destruction? Your team plays the fine line live.",
  Boredom: "The boredom killing {co}. Routine, stagnation, the death of curiosity. Your team wakes up on stage.",
  Curiosity: "What is {co} curious about — and what has it stopped asking? Curiosity plays out live.",
  Confidence: "The confidence gap at {co}. Self-doubt, imposter syndrome, false bravado. All on stage.",
  Control: "The need to control at {co}. Micromanagement, trust, letting go. Control plays out live.",
  Family: "The family behind {co}. Blood, loyalty, succession, sacrifice. Family business dynamics play out on stage.",
  Partnership: "The partnership powering {co}. Trust, tension, equity, ego. Partners meet on stage.",
  Friendship: "The friendships inside {co}. Loyalty, betrayal, boundaries. Your team plays the personal dynamics.",
  Mentorship: "The mentor {co} needs. Wisdom, challenge, tough love. The mentoring dynamic plays out on stage.",
  Rivals: "The rival {co} fears. Competition, respect, obsession. Your nemesis steps onto the stage.",
  Negotiation: "The deal that defines {co}. Power, compromise, walkaway. The negotiation plays out live.",
  Healthcare: "The healthcare forces around {co}. Patients, systems, ethics, bureaucracy. Medicine meets humanity on stage.",
  Education: "The education dynamics at {co}. Teaching, learning, systems, souls. Your team plays what education really is.",
  Media: "The media forces shaping {co}. Content, truth, attention, algorithms. Media plays out on stage.",
  Sport: "The sporting dynamics at {co}. Competition, training, mentality, peak. Your team plays the athlete's world.",
  Art: "The artistic forces at {co}. Creation, commerce, compromise, soul. Art meets business on stage.",
  Hospitality: "The hospitality soul of {co}. Service, warmth, exhaustion, beauty. Your team plays what hosting really means.",
  Property: "The property dynamics around {co}. Space, value, vision, community. Real estate plays out on stage.",
  Regulation: "The rules governing {co}. Compliance, freedom, risk, innovation under constraint. Regulation plays out live.",
  Finance: "The financial world of {co}. Risk, trust, numbers, people. Banking meets humanity on stage.",
  Retail: "The retail reality of {co}. Customers, shelves, digital, experience. Your team plays what shopping really is.",
  Energy: "The energy dynamics at {co}. Resources, transition, power, sustainability. Energy plays out on stage.",
  Mobility: "The mobility forces around {co}. Movement, logistics, speed, connection. Transport plays out live.",
  Social: "The social mission of {co}. Impact, funding, sustainability, heart. Purpose meets reality on stage.",
  Public: "The public sector dynamics at {co}. Citizens, bureaucracy, service, leadership. Government plays out on stage.",
  Faith: "The faith driving {co}. Community, belief, doubt, purpose. Spiritual dynamics play out on stage.",
};

const DEFAULT_BUSINESS_PITCH = "Your team steps on stage and plays out the real {theme} dynamics at {co}. No slides. No theory. You see what you couldn't see before.";

/* ── Derive business theme (Play 1) ── */
function deriveBusinessTheme(question: string): string {
  for (const [pattern, theme] of BUSINESS_MAP) {
    if (pattern.test(question)) return theme;
  }
  const nouns = question.replace(/[?.,!'"]/g, "").split(/\s+/).filter(w => w.length > 4 && !/^(about|could|would|should|where|there|their|these|those|which|while|after|before|being|doing|going|having|making|taking|using|what|when|with|from|into|than|then|them|they|this|that|have|will|been|were|does|didn|don|isn|aren|wasn|weren|can|how|who|why|our|your)$/i.test(w));
  if (nouns.length > 0) {
    const w = nouns[0];
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }
  return "Reality";
}

type Experience = {
  name: string;
  theme: string;
  pitch: string;
};

const PEOPLE_OPTIONS = [
  { label: "8\u201315", description: "Intimate" },
  { label: "15\u201325", description: "Team" },
  { label: "25\u201350", description: "Large group" },
];

const VENUE_OPTIONS = [
  { label: "Flagship stage", sub: "Stage on Mars, Praha" },
  { label: "Your office", sub: "We come to you" },
  { label: "Special location", sub: "A place that fits" },
];

function deriveExperience(question: string, company: string): Experience {
  const bizTheme = deriveBusinessTheme(question);
  const co = company || "your company";

  let bizPitch = BUSINESS_PITCHES[bizTheme] || DEFAULT_BUSINESS_PITCH;
  bizPitch = bizPitch.replace(/\{co\}/g, co).replace(/\{theme\}/g, bizTheme.toLowerCase());

  return {
    name: company ? `${company} on Mars` : `${bizTheme} on Mars`,
    theme: bizTheme,
    pitch: bizPitch,
  };
}


/* ══════════════════════════════════════════════════════════════════
   PLAY PAGE INNER (uses useSearchParams)
   ══════════════════════════════════════════════════════════════════ */

function PlayPageInner() {
  const searchParams = useSearchParams();
  const questionParam = searchParams.get("q") || "";
  const companyParam = searchParams.get("company") || "";
  const simulateOnly = searchParams.get("simulate") === "1";

  const [building, setBuilding] = useState(true);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [selectedVenue, setSelectedVenue] = useState(0);
  const [play, setPlay] = useState<Play | null>(null);
  const [playLoading, setPlayLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDigital, setShowDigital] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simReady, setSimReady] = useState(false);
  const [simPhase, setSimPhase] = useState<"cast" | "stage" | "perspectives">("cast");
  const [simEnded, setSimEnded] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardEmail, setCardEmail] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [cardSent, setCardSent] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-trigger building animation on load
  useEffect(() => {
    if (!questionParam) return;
    // Simulate-only flow: skip building animation, derive experience silently,
    // and open the inline simulator immediately.
    if (simulateOnly) {
      setExperience(deriveExperience(questionParam, companyParam));
      setBuilding(false);
      openDigital(questionParam);
      return;
    }
    setBuilding(true);
    const timer = setTimeout(() => {
      setExperience(deriveExperience(questionParam, companyParam));
      setBuilding(false);
    }, 2200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionParam, companyParam, simulateOnly]);

  async function fetchSimulation(currentPlay: Play, overrideQuestion?: string) {
    setSimLoading(true);
    setSimReady(false);
    try {
      const q = overrideQuestion || questionParam;
      const res = await fetch("/api/generate-mars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ play: currentPlay, question: q, lang: "en" }),
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

  async function openDigital(overrideQuestion?: string) {
    setShowDigital(true);
    setPlayLoading(true);
    setError("");
    setSimPhase("cast");
    setSimEnded(false);

    const q = overrideQuestion || questionParam;
    try {
      const res = await fetch("/api/generate-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context: "business", lang: "en", clientName: companyParam || undefined }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.plays?.[0]) {
        const generatedPlay = data.plays[0];
        setPlay(generatedPlay);
        setPlayLoading(false);
        fetchSimulation(generatedPlay, q);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setPlayLoading(false);
    }
  }

  /* ── Builder landing (no question yet) ── */
  const [realQ, setRealQ] = useState("");
  const [realCo, setRealCo] = useState("");
  const [simQ, setSimQ] = useState("");

  function submitReal(overrideQ?: string) {
    const q = overrideQ || realQ;
    if (!q.trim()) return;
    const params = new URLSearchParams({ q });
    if (realCo.trim()) params.set("company", realCo);
    window.location.href = `/business/play?${params.toString()}`;
  }

  function submitSimulator(overrideQ?: string) {
    const q = overrideQ || simQ;
    if (!q.trim()) return;
    const params = new URLSearchParams({ q, simulate: "1" });
    window.location.href = `/business/play?${params.toString()}`;
  }

  if (!questionParam) {
    const readyMade = [
      { theme: "Strategy", q: "Where is your company really heading \u2014 and what\u2019s pulling it off course?" },
      { theme: "Vision", q: "What does your company look like in 5 years? Your team builds that future on stage." },
      { theme: "Team", q: "What\u2019s really going on in your team? What holds it together, what pulls it apart." },
    ];

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] overflow-x-hidden">
        {/* Top bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.04]">
          <Link href="/business">
            <img src="/logo.png" alt="Stage On Mars" className="h-7 sm:h-8 w-auto invert opacity-70 hover:opacity-100 transition-opacity" />
          </Link>
        </nav>

        <div className="pt-24 sm:pt-32 pb-16 px-4 flex flex-col items-center">
          {/* Hero */}
          <div className="text-center mb-10 sm:mb-14 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.03] mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-mars animate-pulse" />
              <p className="text-white/60 text-[10px] uppercase tracking-[0.25em] font-bold">Stage on Mars for business</p>
            </div>
            <h1 className="text-[30px] sm:text-[52px] font-black tracking-[-0.04em] leading-[1.05] mb-5 text-white">
              Turn your biggest question<br /><span className="text-mars">into decisions in 4 hours.</span>
            </h1>
            <p className="font-mercure italic text-white/50 text-[14px] sm:text-[17px] leading-[1.55] max-w-xl mx-auto">
              A live experience with your team on the Stage on Mars in Prague.
            </p>
            <div className="flex items-center justify-center gap-5 sm:gap-8 mt-6 text-[11px] sm:text-[12px] text-white/40">
              <span className="flex items-center gap-1.5"><span className="text-mars">50+</span> teams</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5"><span className="text-mars">9/10</span> leaders</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5"><span className="text-mars">4h</span> to clarity</span>
            </div>
          </div>

          <div className="w-full max-w-3xl space-y-6 sm:space-y-8">

            {/* ════════════════════════════════════════════════════════
                CARD 1 — DESIGN YOUR REAL EXPERIENCE (structured product card)
                ════════════════════════════════════════════════════════ */}
            <div className="relative rounded-2xl border border-white/[0.12] bg-[#0a0a0a] overflow-hidden" style={{ boxShadow: "0 20px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset" }}>
              {/* Top bar — product-header style */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-mars" />
                    <div className="w-1.5 h-1.5 rounded-full bg-mars/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-mars/20" />
                  </div>
                  <p className="text-white/50 text-[10px] uppercase tracking-[0.25em] font-bold">Live on Stage &middot; Prague</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mars/10 border border-mars/20">
                  <div className="w-1 h-1 rounded-full bg-mars animate-pulse" />
                  <p className="text-mars text-[9px] font-black uppercase tracking-[0.2em]">Reply in 24h</p>
                </div>
              </div>

              {/* Headline + price anchor */}
              <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-6">
                <div className="mb-5">
                  <h2 className="text-white text-[24px] sm:text-[32px] font-black tracking-[-0.03em] leading-[1.05] mb-2">
                    Your team. Your question.<br />Played live on Mars.
                  </h2>
                  <p className="text-white/45 text-[13px] sm:text-[14px] leading-[1.5] max-w-lg">
                    We design a custom 4-hour play around the question that matters most — and run it with your team on our stage in Prague.
                  </p>
                </div>

                {/* What's included — structured grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5 mb-6">
                  {[
                    "Custom play built around your question",
                    "4 hours: intro → play → break → outro",
                    "Live on the Stage on Mars in Prague",
                    "Guided by a Play Pilot and a full cast",
                    "Designed for teams up to 12 people",
                    "New perspectives to take back home",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-mars shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      <p className="text-white/65 text-[12px] sm:text-[12.5px] leading-[1.4]">{item}</p>
                    </div>
                  ))}
                </div>

                {/* Input block */}
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden mb-4">
                  <div className="px-4 sm:px-5 pt-4 pb-2">
                    <p className="text-white/30 text-[9px] uppercase tracking-[0.25em] font-bold mb-2">Step 1 &middot; Your question</p>
                    <textarea
                      value={realQ}
                      onChange={(e) => setRealQ(e.target.value)}
                      placeholder="e.g. What does our company need most right now?"
                      rows={2}
                      className="w-full min-h-[56px] bg-transparent border-0 px-0 py-0 text-white text-[15px] sm:text-[17px] placeholder:text-white/25 focus:outline-none resize-none leading-[1.35] tracking-[-0.01em] font-medium"
                      style={{ caretColor: "#FF5500" }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitReal(); }
                      }}
                    />
                  </div>
                  <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-white/[0.05]">
                    <p className="text-white/30 text-[9px] uppercase tracking-[0.25em] font-bold mb-1.5">Step 2 &middot; Company</p>
                    <input
                      value={realCo}
                      onChange={(e) => setRealCo(e.target.value)}
                      placeholder="Company name"
                      className="w-full bg-transparent border-0 px-0 py-0 text-white/80 placeholder:text-white/25 focus:outline-none text-[14px] font-medium"
                    />
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => submitReal()}
                    disabled={!realQ.trim()}
                    className="relative flex-1 py-4 rounded-xl font-black text-[13px] sm:text-[14px] uppercase tracking-[0.12em] transition-all text-white disabled:opacity-25 disabled:shadow-none overflow-hidden group/btn"
                    style={{ background: "linear-gradient(135deg, #FF5500 0%, #e04800 50%, #FF5500 100%)", boxShadow: "0 8px 30px -8px rgba(255,85,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)" }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, #ff6a1a 0%, #FF5500 50%, #ff6a1a 100%)" }} />
                    <span className="relative z-10">Request your play &rarr;</span>
                  </button>
                  <a
                    href="mailto:play@stageonmars.com?subject=Book a call"
                    className="sm:w-auto py-4 px-6 rounded-xl border border-white/[0.12] text-white/70 font-bold text-[13px] sm:text-[14px] uppercase tracking-[0.12em] hover:border-white/30 hover:text-white transition-all text-center"
                  >
                    Book a call
                  </a>
                </div>
                <p className="text-white/25 text-[10px] text-center mt-3">Free to inquire &middot; no credit card &middot; reply within 24h</p>
              </div>

              {/* Templates row */}
              <div className="border-t border-white/[0.06] bg-white/[0.015] px-6 sm:px-8 py-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.25em] font-black">Ready-made templates</p>
                  <p className="text-white/20 text-[10px]">Click to pre-fill</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {readyMade.map((play, i) => (
                    <button key={i} onClick={() => submitReal(play.q)} className="group text-left rounded-lg border border-white/[0.08] bg-white/[0.02] hover:border-mars/30 hover:bg-mars/[0.04] transition-all duration-300 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white/85 text-[13px] font-black tracking-[-0.01em]">{play.theme} Play</p>
                        <span className="text-mars/40 group-hover:text-mars text-[14px]">&rarr;</span>
                      </div>
                      <p className="text-white/35 text-[10.5px] leading-[1.35] line-clamp-2">{play.q.split(".")[0]}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── OR divider ── */}
            <div className="flex items-center gap-4 max-w-md mx-auto">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white/[0.12]" />
              <p className="text-white/30 text-[10px] uppercase tracking-[0.35em] font-black shrink-0">Or try it now</p>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white/[0.12]" />
            </div>

            {/* ════════════════════════════════════════════════════════
                CARD 2 — TRY THE AI SIMULATOR (orange)
                ════════════════════════════════════════════════════════ */}
            <div className="relative rounded-2xl overflow-hidden bg-mars" style={{ boxShadow: "0 20px 80px -20px rgba(255,85,0,0.5), 0 8px 40px -12px rgba(255,85,0,0.3)" }}>
              <div className="h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              {/* Header */}
              <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-pulse" />
                  <p className="text-[#0a0a0a]/80 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-black">Option 2 &middot; AI simulator</p>
                </div>
                <h2 className="text-[#0a0a0a] text-[22px] sm:text-[28px] font-black tracking-[-0.025em] leading-[1.1] mb-2">
                  Try a play right now
                </h2>
                <p className="font-mercure italic text-[#0a0a0a]/70 text-[13px] sm:text-[14px] leading-[1.5] max-w-lg">
                  Type a question. Watch a play unfold in your browser — characters, stage, perspectives — all simulated live. Free, instant, no signup.
                </p>
              </div>

              {/* Question input */}
              <div className="px-6 sm:px-8 pt-6 pb-4">
                <p className="text-[#0a0a0a]/40 text-[9px] uppercase tracking-[0.25em] font-bold mb-3">Your question</p>
                <textarea
                  value={simQ}
                  onChange={(e) => setSimQ(e.target.value)}
                  placeholder="What does my company need the most right now?"
                  rows={2}
                  className="w-full min-h-[64px] bg-transparent border-0 px-0 py-0 text-[#0a0a0a] text-[18px] sm:text-[22px] placeholder:text-[#0a0a0a]/30 focus:outline-none resize-none leading-[1.35] tracking-[-0.01em] font-medium"
                  style={{ caretColor: "#0a0a0a" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitSimulator(); }
                  }}
                />
              </div>
              <div className="px-6 sm:px-8 pb-8 space-y-3 border-t border-[#0a0a0a]/10 pt-5">
                <button
                  onClick={() => submitSimulator()}
                  disabled={!simQ.trim()}
                  className="relative w-full py-4 sm:py-5 rounded-2xl font-black text-[14px] sm:text-[16px] uppercase tracking-[0.12em] transition-all bg-[#0a0a0a] text-white hover:bg-black disabled:opacity-30 hover:scale-[1.01]"
                >
                  Run the simulator &rarr;
                </button>
                <p className="text-[#0a0a0a]/40 text-[10px] text-center">Plays in your browser &middot; ~30 seconds</p>
              </div>
            </div>

          </div>

          {/* Old static demo card hidden — kept for reference, not rendered */}
          {false && (
            <button className="w-full group block">
              <div className="relative rounded-2xl overflow-hidden bg-mars">
                <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-0">
                  <p className="text-[#0a0a0a] text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-black mb-2 text-center">The Play Simulator</p>
                  <p className="text-[#0a0a0a]/60 text-[11px] sm:text-[12px] text-center mb-5 max-w-xs mx-auto leading-[1.3]">Type a question. Watch it become a play.<br />Characters, stage, perspectives — all simulated live.</p>
                  <div className="max-w-[380px] mx-auto">
                    <div className="relative rounded-[12px] bg-[#1a1a1c] p-[3px] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                      <div className="rounded-[10px] overflow-hidden bg-[#0a0a0c]">
                        <div className="flex items-center justify-between px-3 pt-2 pb-1">
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-[3px]">
                              <div className="w-[5px] h-[5px] rounded-full bg-[#ff5f57]" />
                              <div className="w-[5px] h-[5px] rounded-full bg-[#febc2e]" />
                              <div className="w-[5px] h-[5px] rounded-full bg-[#28c840]" />
                            </div>
                            <span className="text-[6px] text-white/30 font-bold tracking-wider ml-1">SIMULATOR</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-[4px] h-[4px] rounded-full bg-emerald-400/80 animate-pulse" />
                            <span className="text-[5px] text-emerald-400/50 font-bold">LIVE</span>
                          </div>
                        </div>
                        <div className="relative h-[220px] sm:h-[280px] bg-[#0c0a08]">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 170" preserveAspectRatio="xMidYMid meet">
                            <defs>
                              <filter id="bp-glow" x="-200%" y="-200%" width="500%" height="500%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                              </filter>
                              <filter id="bp-glow-big" x="-200%" y="-200%" width="500%" height="500%">
                                <feGaussianBlur stdDeviation="6" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                              </filter>
                              <radialGradient id="bp-stage-glow" cx="50%" cy="48%" r="35%">
                                <stop offset="0%" stopColor="rgba(255,85,0,0.12)" />
                                <stop offset="50%" stopColor="rgba(255,85,0,0.04)" />
                                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                              </radialGradient>
                              <radialGradient id="bp-ring-glow" cx="50%" cy="48%" r="42%">
                                <stop offset="70%" stopColor="rgba(0,0,0,0)" />
                                <stop offset="85%" stopColor="rgba(255,85,0,0.06)" />
                                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                              </radialGradient>
                            </defs>
                            <rect x="0" y="0" width="200" height="170" fill="url(#bp-stage-glow)" />
                            <rect x="0" y="0" width="200" height="170" fill="url(#bp-ring-glow)" />
                            <circle cx="100" cy="80" r="62" fill="none" stroke="rgba(255,85,0,0.7)" strokeWidth="1.8" />
                            <circle cx="100" cy="80" r="62" fill="none" stroke="rgba(255,85,0,0.15)" strokeWidth="6" filter="url(#bp-glow-big)" />
                            <g>
                              <animateTransform attributeName="transform" type="translate" values="0,0; 2,-1.5; -1.5,2; 0,0" dur="12s" repeatCount="indefinite" />
                              <circle cx="118" cy="52" r="5" fill="rgba(255,215,0,0.9)" filter="url(#bp-glow)" />
                              <text x="118" y="61" textAnchor="middle" fill="rgba(255,215,0,0.5)" fontSize="4" fontStyle="italic">You</text>
                            </g>
                            <g>
                              <animateTransform attributeName="transform" type="translate" values="0,0; -2,3; 3,-2; 0,0" dur="14s" repeatCount="indefinite" />
                              <circle cx="78" cy="56" r="7" fill="rgba(255,85,0,0.9)" filter="url(#bp-glow)" />
                              <text x="78" y="67" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="4" fontWeight="700">Need</text>
                            </g>
                            <g>
                              <animateTransform attributeName="transform" type="translate" values="0,0; 2,-2; -3,2; 0,0" dur="10s" repeatCount="indefinite" />
                              <circle cx="72" cy="82" r="6.5" fill="rgba(255,85,0,0.85)" filter="url(#bp-glow)" />
                              <text x="72" y="93" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="4" fontWeight="700">Growth</text>
                            </g>
                            <g>
                              <animateTransform attributeName="transform" type="translate" values="0,0; -2,2; 2,-3; 0,0" dur="16s" repeatCount="indefinite" />
                              <circle cx="125" cy="72" r="6" fill="rgba(190,190,190,0.7)" filter="url(#bp-glow)" />
                              <text x="125" y="83" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="4" fontWeight="700">Fear</text>
                            </g>
                            <g>
                              <animateTransform attributeName="transform" type="translate" values="0,0; 2,1.5; -2,-2; 0,0" dur="13s" repeatCount="indefinite" />
                              <circle cx="118" cy="98" r="5.5" fill="rgba(180,180,180,0.6)" />
                              <text x="118" y="109" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4" fontWeight="700">Risk</text>
                            </g>
                            <g>
                              <animateTransform attributeName="transform" type="translate" values="0,0; -2,-1.5; 1.5,2; 0,0" dur="15s" repeatCount="indefinite" />
                              <circle cx="78" cy="100" r="5" fill="rgba(170,170,170,0.55)" />
                              <text x="78" y="111" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="4" fontWeight="700">Time</text>
                            </g>
                            <g>
                              <animateTransform attributeName="transform" type="translate" values="0,0; 1.5,1.5; -2,-1; 0,0" dur="18s" repeatCount="indefinite" />
                              <circle cx="100" cy="115" r="5" fill="rgba(160,160,160,0.5)" />
                              <text x="100" y="126" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="4" fontWeight="700">Truth</text>
                            </g>
                          </svg>
                        </div>
                        <div className="px-3 sm:px-5 pb-3 sm:pb-5">
                          <div className="rounded-xl bg-white/[0.05] border border-white/[0.10] px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3">
                            <p className="text-white/70 font-mercure italic text-[11px] sm:text-[14px] leading-[1.3] flex-1">&ldquo;What does my company need<br />the most right now?&rdquo;</p>
                            <div className="w-[28px] h-[28px] sm:w-[34px] sm:h-[34px] rounded-lg bg-mars flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,85,0,0.4)] animate-pulse">
                              <span className="text-white text-[10px] sm:text-[13px]">&#9654;</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-5 sm:px-8 py-5 sm:py-6 text-center">
                  <span className="inline-flex items-center px-8 py-3 rounded-xl border border-[#0a0a0a]/40 text-[#0a0a0a] text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.15em] group-hover:bg-[#0a0a0a] group-hover:text-white transition-all">
                    Simulate &rarr;
                  </span>
                </div>
              </div>
            </button>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] overflow-x-hidden">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.04]">
        <Link href="/business">
          <img src="/logo.png" alt="Stage On Mars" className="h-7 sm:h-8 w-auto invert opacity-70 hover:opacity-100 transition-opacity" />
        </Link>
      </nav>

      <style jsx global>{`
        @keyframes glow-pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.15); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>

      <div className="pt-16" />

      {/* Results */}
      <section ref={resultRef} className="relative px-4">
        <div className="max-w-3xl mx-auto">

          {/* Building state */}
          {building && (
            <div className="text-center py-20 sm:py-32">
              <div className="inline-flex gap-2 mb-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-mars" style={{ animation: `glow-pulse 1.2s ease-in-out ${i * 0.3}s infinite` }} />
                ))}
              </div>
              <p className="text-white/60 text-[16px] sm:text-[20px] font-bold tracking-[-0.02em]">Designing your experience...</p>
              <p className="text-white/25 text-[12px] sm:text-[13px] mt-3 font-mercure italic max-w-sm mx-auto">&ldquo;{questionParam}&rdquo;</p>
            </div>
          )}

          {/* Experience Designer */}
          {experience && !building && (
            <div className="pt-6 sm:pt-10" style={{ animation: "fadeIn 0.8s ease both" }}>

              {/* Question as hero */}
              {!simulateOnly && (
              <div className="text-center mb-10 sm:mb-14">
                <div className="relative inline-block mb-6">
                  <div className="absolute -inset-6 sm:-inset-10 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.06)_0%,_transparent_70%)] pointer-events-none" />
                  <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.4em] mb-5">Your question</p>
                  <h1 className="font-mercure italic text-white/80 text-[26px] sm:text-[38px] leading-[1.25] max-w-xl mx-auto">
                    &ldquo;{questionParam}&rdquo;
                  </h1>
                </div>
                <div className="flex items-center gap-3 justify-center mt-2">
                  <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-mars/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-mars/40" />
                  <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-mars/30" />
                </div>
                <p className="text-white/25 text-[11px] sm:text-[12px] uppercase tracking-[0.2em] mt-5">Here&#39;s what we designed for you</p>
              </div>
              )}

              {/* Simulator-only header */}
              {simulateOnly && (
                <div className="text-center mb-8 sm:mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mars/[0.08] border border-mars/20 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-mars animate-pulse" />
                    <p className="text-mars text-[10px] uppercase tracking-[0.25em] font-black">AI Simulator &middot; Live</p>
                  </div>
                  <h1 className="font-mercure italic text-white/85 text-[22px] sm:text-[32px] leading-[1.25] max-w-xl mx-auto px-4">
                    &ldquo;{questionParam}&rdquo;
                  </h1>
                </div>
              )}

              {/* Unified experience card */}
              {!simulateOnly && (
              <div className="rounded-2xl border border-mars/20 bg-mars/[0.04] overflow-hidden">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />

                {!cardSent ? (
                  <div className="px-6 sm:px-8 py-8 sm:py-10">

                    {/* Experience header */}
                    <div className="text-center mb-8">
                      <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] mb-5">The Stage on Mars Experience</p>
                      <h2 className="text-[32px] sm:text-[44px] font-black tracking-[-0.04em] leading-[0.95] mb-3">
                        <span className="text-white/90">{companyParam || experience.theme}</span>{" "}
                        <span className="text-mars font-mercure italic">on Mars</span>
                      </h2>
                      <p className="text-white/30 text-[11px] sm:text-[12px] mb-4">A live experience for your team</p>
                      <p className="text-white/45 text-[13px] sm:text-[15px] leading-[1.6] max-w-md mx-auto">
                        {experience.pitch}
                      </p>
                    </div>

                    {/* How it works */}
                    <div className="mb-8">
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-6" />
                      <div className="grid grid-cols-3 gap-4 sm:gap-6">
                        <div className="text-center">
                          <span className="inline-flex w-6 h-6 rounded-full bg-mars/15 border border-mars/20 items-center justify-center text-mars text-[11px] font-bold mb-2">1</span>
                          <p className="text-white/40 text-[11px] sm:text-[12px] leading-[1.5]">Bring a real question</p>
                        </div>
                        <div className="text-center">
                          <span className="inline-flex w-6 h-6 rounded-full bg-mars/15 border border-mars/20 items-center justify-center text-mars text-[11px] font-bold mb-2">2</span>
                          <p className="text-white/40 text-[11px] sm:text-[12px] leading-[1.5]">Play it out live on stage</p>
                        </div>
                        <div className="text-center">
                          <span className="inline-flex w-6 h-6 rounded-full bg-mars/15 border border-mars/20 items-center justify-center text-mars text-[11px] font-bold mb-2">3</span>
                          <p className="text-white/40 text-[11px] sm:text-[12px] leading-[1.5]">Leave with new perspectives</p>
                        </div>
                      </div>
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mt-6" />
                    </div>

                    {/* Configure */}
                    <div className="space-y-5 mb-8">
                      <div>
                        <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] mb-2.5">Group size</p>
                        <div className="grid grid-cols-3 gap-2">
                          {PEOPLE_OPTIONS.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedPeople(i)}
                              className={`rounded-xl border py-3 px-3 text-center transition-all duration-300 ${
                                selectedPeople === i
                                  ? "border-mars/30 bg-mars/[0.06]"
                                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                              }`}
                            >
                              <p className={`text-[16px] sm:text-[20px] font-bold tracking-tight ${selectedPeople === i ? "text-white/90" : "text-white/40"}`}>{opt.label}</p>
                              <p className={`text-[9px] uppercase tracking-[0.15em] mt-0.5 ${selectedPeople === i ? "text-mars/50" : "text-white/20"}`}>{opt.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] mb-2.5">Location</p>
                        <div className="grid grid-cols-3 gap-2">
                          {VENUE_OPTIONS.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedVenue(i)}
                              className={`rounded-xl border py-3 px-3 text-center transition-all duration-300 ${
                                selectedVenue === i
                                  ? "border-mars/30 bg-mars/[0.06]"
                                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                              }`}
                            >
                              <p className={`text-[12px] sm:text-[14px] font-bold ${selectedVenue === i ? "text-white/90" : "text-white/40"}`}>{opt.label}</p>
                              <p className={`text-[9px] mt-1 leading-[1.3] ${selectedVenue === i ? "text-mars/50" : "text-white/20"}`}>{opt.sub}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-6" />
                    <p className="text-white/35 text-[12px] mb-4">Leave your details and we&#39;ll get back to you with a tailored offer.</p>
                    <div className="flex flex-col sm:flex-row gap-3 mb-3">
                      <input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Your name"
                        className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-mars/30 px-4 py-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none transition-colors"
                      />
                      <input
                        value={cardEmail}
                        onChange={(e) => setCardEmail(e.target.value)}
                        type="email"
                        placeholder="Your email"
                        className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-mars/30 px-4 py-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none transition-colors"
                      />
                    </div>
                    <input
                      value={cardDate}
                      onChange={(e) => setCardDate(e.target.value)}
                      placeholder="Ideal date (e.g. March 2026, Q2, flexible...)"
                      className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-mars/30 px-4 py-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none transition-colors mb-4"
                    />
                    <button
                      onClick={() => {
                        if (!cardEmail.trim() || !cardName.trim()) return;
                        const subject = encodeURIComponent(`Play Card: ${companyParam || experience.theme} on Mars`);
                        const body = encodeURIComponent(
                          `Name: ${cardName}\nEmail: ${cardEmail}\nCompany: ${companyParam || "\u2014"}\n\nQuestion: ${questionParam}\n\nExperience: ${companyParam || experience.theme} on Mars\n${experience.pitch}\n\nGroup: ${PEOPLE_OPTIONS[selectedPeople].label} people\nLocation: ${VENUE_OPTIONS[selectedVenue].label}\nIdeal date: ${cardDate || "\u2014"}`
                        );
                        window.location.href = `mailto:play@stageonmars.com?subject=${subject}&body=${body}`;
                        setCardSent(true);
                      }}
                      disabled={!cardEmail.trim() || !cardName.trim()}
                      className={`w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-[0.15em] transition-all ${
                        cardEmail.trim() && cardName.trim()
                          ? "bg-mars hover:bg-mars-light text-white shadow-[0_4px_20px_-4px_rgba(255,85,0,0.3)]"
                          : "bg-mars/30 text-white/40 cursor-not-allowed"
                      }`}
                    >
                      Send to Mars
                    </button>

                    <p className="text-white/15 text-[11px] text-center mt-4">Trusted by 50+ teams across Europe</p>
                  </div>
                ) : (
                  <div className="px-6 sm:px-8 py-8 sm:py-10 text-center">
                    <div className="w-10 h-10 rounded-full bg-mars/20 border border-mars/30 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-5 h-5 text-mars" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <p className="text-white/80 text-[16px] sm:text-[18px] font-bold mb-2">Sent to Mars</p>
                    <p className="text-white/30 text-[12px] sm:text-[13px]">We&#39;ll get back to you with a tailored offer, {cardName.split(" ")[0]}.</p>
                  </div>
                )}
              </div>
              )}

              {/* Inline Digital Playmaker */}
              {showDigital && (
                <div className="mt-8 sm:mt-10">
                  <div className="relative">
                    <div className="absolute -inset-4 sm:-inset-8 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.04)_0%,_transparent_70%)] pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-mars" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                        <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold">Play Simulator</p>
                      </div>
                      <button onClick={() => { setShowDigital(false); setPlay(null); setPlayLoading(false); setSimLoading(false); setSimReady(false); setSimPhase("cast"); setSimEnded(false); }} className="text-white/70 text-[10px] uppercase tracking-[0.15em] hover:text-white/70 transition-colors">
                        Close
                      </button>
                    </div>

                    {/* Loading state */}
                    {playLoading && (
                      <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
                        <div className="text-center py-20 sm:py-28">
                          <div className="inline-flex gap-2 mb-5">
                            {[0, 1, 2].map((i) => (
                              <div key={i} className="w-2.5 h-2.5 rounded-full bg-mars" style={{ animation: `glow-pulse 1.2s ease-in-out ${i * 0.25}s infinite` }} />
                            ))}
                          </div>
                          <p className="text-white/65 text-[13px] sm:text-[14px] font-mercure italic">Creating your play...</p>
                        </div>
                      </div>
                    )}

                    {/* Gaming interface */}
                    {play && !playLoading && (
                      <div className="space-y-4">

                        {/* Phase nav tabs */}
                        <div className="flex items-center gap-1 rounded-xl bg-white/[0.05] border border-white/[0.12] p-1">
                          {[
                            { id: "cast" as const, label: "Cast", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" },
                            { id: "stage" as const, label: "Stage", icon: "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15l3.5-4.5 2.5 3.01L14.5 9l4.5 6H5z" },
                            { id: "perspectives" as const, label: "Perspectives", icon: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" },
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => {
                                if (tab.id === "stage" && !simReady) return;
                                if (tab.id === "perspectives" && !simEnded) return;
                                setSimPhase(tab.id);
                              }}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] sm:text-[14px] uppercase tracking-[0.15em] font-bold transition-all ${
                                simPhase === tab.id
                                  ? "bg-white/[0.06] text-white/80"
                                  : (tab.id === "stage" && !simReady) || (tab.id === "perspectives" && !simEnded)
                                  ? "text-white/25 cursor-not-allowed"
                                  : "text-white/65 hover:text-white/60"
                              }`}
                            >
                              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d={tab.icon} /></svg>
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Cast phase */}
                        {simPhase === "cast" && (
                          <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
                            <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
                              <h3 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">{play.name}</h3>
                              <p className="text-white/60 text-[11px] mt-1 font-mercure italic">{play.mood} &middot; {play.characters.length} characters</p>
                            </div>
                            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                              <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.25em] mb-4 font-bold">Characters on stage</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {play.characters.map((char, i) => (
                                  <div key={i} className="rounded-xl bg-white/[0.05] border border-white/[0.10] p-4 hover:border-white/[0.15] transition-all" style={{ animation: `fadeIn 0.5s ease ${i * 0.1}s both` }}>
                                    <div className="flex items-center gap-2.5 mb-2.5">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mars/20 to-mars/5 flex items-center justify-center text-[11px] font-bold text-mars/60">{char.name.charAt(0)}</div>
                                      <p className="text-white/70 text-[13px] font-bold tracking-[-0.01em]">{char.name}</p>
                                    </div>
                                    <p className="text-white/65 text-[11px] leading-[1.5] font-mercure">{char.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {play.image && (
                              <div className="mx-6 sm:mx-8 mb-6 sm:mb-8 rounded-xl bg-mars/[0.03] border border-mars/[0.06] p-4">
                                <p className="text-mars/70 text-[9px] uppercase tracking-[0.25em] mb-2 font-bold">Opening image</p>
                                <p className="text-white/55 text-[13px] leading-[1.6] font-mercure italic">{play.image}</p>
                              </div>
                            )}
                            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                              <button
                                onClick={() => { if (simReady) setSimPhase("stage"); }}
                                disabled={!simReady}
                                className={`w-full py-4 rounded-xl text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.15em] transition-all ${
                                  simReady ? "bg-mars/10 border border-mars/20 text-mars/80 hover:bg-mars/15 hover:border-mars/30 cursor-pointer" : "bg-white/[0.05] border border-white/[0.10] text-white/70 cursor-wait"
                                }`}
                              >
                                {simReady ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8 5v14l11-7z" /></svg>
                                    Enter the Stage
                                  </span>
                                ) : (
                                  <span className="flex items-center justify-center gap-2">
                                    <div className="inline-flex gap-1.5">
                                      {[0, 1, 2].map((i) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" style={{ animation: `glow-pulse 1.2s ease-in-out ${i * 0.25}s infinite` }} />
                                      ))}
                                    </div>
                                    Choreographing the stage...
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Stage phase */}
                        {simPhase === "stage" && simReady && play.simulationSteps && (
                          <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
                            <div className="p-4 sm:p-6">
                              <StageSimulation simulationSteps={play.simulationSteps} characters={play.characters} simulation={play.simulation} onEnd={() => { setSimEnded(true); setSimPhase("perspectives"); }} />
                            </div>
                          </div>
                        )}

                        {/* Perspectives phase */}
                        {simPhase === "perspectives" && simEnded && (
                          <div className="space-y-4">
                            {play.perspectives && play.perspectives.length > 0 && (
                              <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                                <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
                                <div className="p-6 sm:p-8">
                                  <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.25em] mb-5 font-bold">Perspectives revealed</p>
                                  <div className="space-y-3">
                                    {play.perspectives.map((p, i) => {
                                      const perspective = typeof p === "object" ? (p as Perspective) : null;
                                      return (
                                        <div key={i} className="rounded-xl bg-white/[0.05] border border-white/[0.10] p-4 hover:border-white/[0.15] transition-all" style={{ animation: `fadeIn 0.6s ease ${i * 0.15}s both` }}>
                                          {perspective ? (
                                            <div className="flex gap-3">
                                              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-mars/20 to-mars/5 flex items-center justify-center text-[11px] font-bold text-mars/60 mt-0.5">{perspective.character.charAt(0)}</div>
                                              <div>
                                                <p className="text-mars/60 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">{perspective.character}</p>
                                                <p className="text-white/65 text-[13px] leading-[1.6] font-mercure italic">{perspective.insight}</p>
                                              </div>
                                            </div>
                                          ) : (
                                            <p className="text-white/65 text-[13px] leading-[1.6] font-mercure italic">{String(p)}</p>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                            {play.followUpQuestion && (
                              <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                                <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
                                <div className="text-center py-8 sm:py-10 px-6">
                                  <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] mb-3">What if you asked</p>
                                  <p className="font-mercure italic text-white/55 text-[16px] sm:text-[20px] leading-[1.4] mb-5">&ldquo;{play.followUpQuestion}&rdquo;</p>
                                  <a
                                    href={`/business/play?q=${encodeURIComponent(play.followUpQuestion)}${companyParam ? `&company=${encodeURIComponent(companyParam)}` : ""}`}
                                    className="text-mars/70 text-[11px] font-bold uppercase tracking-[0.15em] hover:text-mars transition-colors"
                                  >
                                    Ask this question &rarr;
                                  </a>
                                </div>
                              </div>
                            )}
                            {/* Big CTA — account creation (simulator-only) or book live */}
                            {simulateOnly ? (
                              <div className="rounded-2xl overflow-hidden bg-mars mt-2">
                                <div className="px-6 sm:px-10 py-10 sm:py-14 text-center">
                                  <p className="text-white/60 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-3">You just simulated a play</p>
                                  <h3 className="text-white text-[22px] sm:text-[30px] font-bold tracking-[-0.03em] leading-[1.15] mb-3">
                                    Want to play more?<br />Create your free account.
                                  </h3>
                                  <p className="font-mercure italic text-white/75 text-[13px] sm:text-[15px] leading-[1.5] max-w-md mx-auto mb-6">
                                    Save your plays, ask new questions, and bring your team into the simulator.
                                  </p>
                                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <a
                                      href={`/auth/signup?redirect=${encodeURIComponent(`/play?q=${encodeURIComponent(questionParam || "")}`)}`}
                                      className="inline-flex items-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-[#0a0a0a] text-white text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-[#1a1a1a] transition-all shadow-lg"
                                    >
                                      Create free account &rarr;
                                    </a>
                                    <a
                                      href="/business/play"
                                      className="inline-flex items-center px-6 py-3.5 sm:py-4 rounded-xl border border-white/30 text-white/90 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em] hover:border-white/60 hover:text-white transition-all"
                                    >
                                      Or book a real play
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-2xl overflow-hidden bg-mars mt-2">
                                <div className="px-6 sm:px-10 py-10 sm:py-14 text-center">
                                  <p className="text-white/60 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-3">This was a simulation</p>
                                  <h3 className="text-white text-[22px] sm:text-[30px] font-bold tracking-[-0.03em] leading-[1.15] mb-3">
                                    Imagine this with real people.<br />On a real stage.
                                  </h3>
                                  <p className="font-mercure italic text-white/70 text-[13px] sm:text-[15px] leading-[1.5] max-w-md mx-auto mb-6">
                                    Your team, your questions, and perspectives no algorithm can generate.
                                  </p>
                                  <a
                                    href="/business#contact"
                                    className="inline-flex items-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-[#0a0a0a] text-white text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-[#1a1a1a] transition-all shadow-lg"
                                  >
                                    Book your play on Mars &rarr;
                                  </a>
                                </div>
                              </div>
                            )}

                            <button onClick={() => { setSimEnded(false); setSimPhase("cast"); }} className="w-full py-3 rounded-xl border border-white/[0.10] text-white/60 text-[10px] uppercase tracking-[0.15em] font-bold hover:text-white/55 hover:border-white/[0.15] transition-all">
                              &larr; Back to cast
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {error && <p className="text-red-400/60 text-[12px] mt-4 text-center">{error}</p>}
                  </div>
                </div>
              )}

              {/* Play Simulator teaser */}
              {!showDigital && !simulateOnly && (
                <div className="mt-8 sm:mt-10">
                  <div className="text-center">
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] mb-3">Not sure yet? Try it first</p>
                    <button
                      onClick={() => openDigital(questionParam)}
                      className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 rounded-xl border border-mars/30 bg-mars/[0.06] hover:border-mars/50 hover:bg-mars/[0.12] transition-all duration-300 group/digi"
                    >
                      <div className="w-2 h-2 rounded-full bg-mars animate-pulse" />
                      <span className="text-mars text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.15em]">Play Simulator</span>
                      <span className="text-white/25 text-[11px]">— preview your play digitally</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Back */}
              <div className="text-center mt-8 mb-16">
                <a href="/business" className="inline-flex items-center gap-2 text-white/15 text-[11px] hover:text-white/30 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                  <span>New question</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════
   PAGE EXPORT (with Suspense boundary for useSearchParams)
   ══════════════════════════════════════════════════════════════════ */

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] flex items-center justify-center">
        <div className="inline-flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-[#FF5500]" style={{ animation: `glow-pulse 1.2s ease-in-out ${i * 0.3}s infinite` }} />
          ))}
        </div>
      </div>
    }>
      <PlayPageInner />
    </Suspense>
  );
}
