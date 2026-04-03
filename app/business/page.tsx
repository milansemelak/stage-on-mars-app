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
      <p className={`font-mercure italic text-white/70 text-[14px] sm:text-[18px] md:text-[22px] leading-[1.4] max-w-xl transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
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
  [/stupid|dumb|idiot|incompeten|mediocr|averag|lazy|useless|clueless|hopeless/i, "Performance", "performance"],
  [/broken|dysfunct|mess|chaos|disaster|falling apart|not working/i, "Breakthrough", "breaking through"],
  [/hate|loathe|despise|detest|can.t stand/i, "Truth", "truth"],
  [/love|adore|passion|heart|soul/i, "Heart", "heart"],
  [/money|rich|wealth|expensive|cheap|afford/i, "Value", "value creation"],
  [/sex|affair|romantic|dating|relationship/i, "Truth", "truth"],
  [/death|dying|dead|kill|end|terminal/i, "Survival", "survival and crisis"],
  [/god|pray|faith|believe|spirit/i, "Purpose", "purpose"],

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

/* ══════════════════════════════════════════════════════════════════
   PLAY 2: CREATIVE CONTEXT — What's the dramatic essence of the question?
   Extracts the evocative word, metaphor, or action from the question.
   "How do we 10x?" → "10x on Mars"
   "How do we conquer Europe?" → "Conquerors on Mars"
   ══════════════════════════════════════════════════════════════════ */

const CREATIVE_EXTRACTIONS: [RegExp, string][] = [
  // ── Numbers & Multipliers ──
  [/\b(10x|100x|2x|3x|5x|20x|50x|1000x)\b/i, "$1"],
  [/\b(million|billion|trillion|zero|infinity)\b/i, "$1"],
  [/\b(first|second|third|last|final|ultimate)\b/i, "$1"],

  // ── Power Verbs → Character Names ──
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
  [/\bprotect\w*/i, "Protectors"],
  [/\bdefend\w*/i, "Defenders"],
  [/\battack\w*/i, "Attackers"],
  [/\binvad\w*/i, "Invaders"],
  [/\bcoloni\w*/i, "Colonizers"],
  [/\bliberat\w*/i, "Liberators"],
  [/\bsav[ei]\w*/i, "Saviors"],
  [/\brescue\w*/i, "Rescuers"],
  [/\bserv[ei]\w*/i, "Servants"],
  [/\brule\w*/i, "Rulers"],
  [/\bgovern\w*/i, "Governors"],
  [/\bcommand\w*/i, "Commanders"],
  [/\bnavig\w*/i, "Navigators"],
  [/\barchitect\w*/i, "Architects"],
  [/\bengineer\w*/i, "Engineers"],
  [/\bhack\w*/i, "Hackers"],
  [/\bcrack\w*/i, "Crackers"],
  [/\bsolv\w*/i, "Solvers"],
  [/\bfix\w*/i, "Fixers"],
  [/\bclean\w*/i, "Cleaners"],
  [/\bcut\b|cutting/i, "Cutters"],
  [/\bconnect\w*/i, "Connectors"],
  [/\bunite\w*|unif\w*/i, "Uniters"],
  [/\bdivid\w*|split\w*/i, "Dividers"],
  [/\bmerge\w*/i, "Mergers"],
  [/\bawait\w*|wait\w*/i, "Waiters"],
  [/\bjump\w*/i, "Jumpers"],
  [/\bfly\b|flying/i, "Flyers"],
  [/\bswim\w*/i, "Swimmers"],
  [/\bclimb\w*/i, "Climbers"],
  [/\bdig\b|digging/i, "Diggers"],
  [/\bplant\w*/i, "Planters"],
  [/\bharvest\w*/i, "Harvesters"],
  [/\bfeed\w*/i, "Feeders"],
  [/\bteach\w*/i, "Teachers"],
  [/\bpreach\w*/i, "Preachers"],
  [/\bwitch\w*|wizard\w*/i, "Wizards"],
  [/\bdream\w*/i, "Dreamers"],
  [/\bbeliev\w*/i, "Believers"],
  [/\bdoubt\w*/i, "Doubters"],
  [/\bwander\w*/i, "Wanderers"],
  [/\bwatch\w*/i, "Watchers"],
  [/\bguard\w*/i, "Guardians"],
  [/\bwait\w*/i, "Waiters"],
  [/\bwake\w*/i, "Awakeners"],
  [/\bsleep\w*/i, "Sleepers"],
  [/\bshout\w*|scream\w*/i, "Screamers"],
  [/\bwhisper\w*/i, "Whisperers"],
  [/\bsing\w*/i, "Singers"],
  [/\bdanc\w*/i, "Dancers"],
  [/\bplay\w*/i, "Players"],
  [/\bgambl\w*/i, "Gamblers"],
  [/\bbet\b|betting/i, "Betters"],
  [/\bstop\w*/i, "Stoppers"],
  [/\bstart\w*/i, "Starters"],
  [/\breset\w*/i, "Resetters"],
  [/\breboot\w*/i, "Rebooters"],
  [/\brebuild\w*/i, "Rebuilders"],
  [/\breborn|rebirth/i, "Reborn"],
  [/\brise\w*|rising/i, "Rising"],
  [/\bfall\w*|falling/i, "Falling"],
  [/\bsink\w*/i, "Sinking"],
  [/\bfloat\w*/i, "Floating"],
  [/\bevolv\w*/i, "Evolution"],
  [/\bmorphi\w*|metamorpho\w*/i, "Metamorphosis"],

  // ── Geography / Markets ──
  [/\b(europe|european)\b/i, "Europe"],
  [/\b(asia|asian)\b/i, "Asia"],
  [/\b(america|american|americas)\b/i, "America"],
  [/\b(africa|african)\b/i, "Africa"],
  [/\b(global|worldwide|world)\b/i, "Global"],
  [/\b(china|chinese)\b/i, "China"],
  [/\b(india|indian)\b/i, "India"],
  [/\b(usa|united states|american)\b/i, "America"],
  [/\b(uk|britain|british|london)\b/i, "Britain"],
  [/\b(germany|german|berlin|munich)\b/i, "Germany"],
  [/\b(japan|japanese|tokyo)\b/i, "Japan"],
  [/\b(brazil|brazilian)\b/i, "Brazil"],
  [/\b(middle east|arab|dubai|saudi)\b/i, "Middle East"],
  [/\b(czech|prague|praha|bohemia|moravia)\b/i, "Bohemia"],
  [/\b(slovak|bratislava)\b/i, "Slovakia"],
  [/\b(poland|polish|warsaw)\b/i, "Poland"],
  [/\b(hungary|budapest)\b/i, "Hungary"],
  [/\b(balkan|serbia|croatia|romania|bucharest)\b/i, "Balkans"],
  [/\b(nordic|scandinav|sweden|norway|denmark|finland)\b/i, "Nordic"],
  [/\b(baltic|estonia|latvia|lithuania)\b/i, "Baltic"],
  [/\b(spain|spanish|madrid|barcelona)\b/i, "Spain"],
  [/\b(france|french|paris)\b/i, "France"],
  [/\b(italy|italian|milan|rome)\b/i, "Italy"],
  [/\b(switzerland|swiss|zurich|geneva)\b/i, "Switzerland"],
  [/\b(austria|vienna)\b/i, "Austria"],
  [/\b(australia|sydney|melbourne)\b/i, "Australia"],
  [/\b(canada|toronto|vancouver)\b/i, "Canada"],
  [/\b(mexico|mexican)\b/i, "Mexico"],
  [/\b(korea|korean|seoul)\b/i, "Korea"],
  [/\b(singapore)\b/i, "Singapore"],
  [/\b(israel|tel aviv)\b/i, "Israel"],
  [/\b(turkey|istanbul)\b/i, "Turkey"],
  [/\b(russia|moscow)\b/i, "Russia"],
  [/\b(ukraine|kyiv)\b/i, "Ukraine"],

  // ── Metaphors, Archetypes & Concepts ──
  [/\bnumber one|#1\b/i, "#1"],
  [/\bunicorn\b/i, "Unicorn"],
  [/\brocket\b/i, "Rocket"],
  [/\bempire\b/i, "Empire"],
  [/\bkingdom\b/i, "Kingdom"],
  [/\bcastle\b/i, "Castle"],
  [/\bfortress\b/i, "Fortress"],
  [/\btower\b/i, "Tower"],
  [/\bthrone\b/i, "Throne"],
  [/\bcrown\b/i, "Crown"],
  [/\bsword\b/i, "Sword"],
  [/\bshield\b/i, "Shield"],
  [/\barmy\b/i, "Army"],
  [/\bwar\b/i, "War"],
  [/\bpeace\b/i, "Peace"],
  [/\bbattle\b/i, "Battle"],
  [/\bsieg\w*/i, "Siege"],
  [/\bvictory\b/i, "Victory"],
  [/\bdefeat\b/i, "Defeat"],
  [/\bfire\b/i, "Fire"],
  [/\bstorm\b/i, "Storm"],
  [/\bwave\b/i, "Wave"],
  [/\bflood\b/i, "Flood"],
  [/\btsunami\b/i, "Tsunami"],
  [/\bearthquake\b/i, "Earthquake"],
  [/\bvolcano\b/i, "Volcano"],
  [/\bexplosion|explod\w*/i, "Explosion"],
  [/\bdark\w*\b/i, "Darkness"],
  [/\blight\b/i, "Light"],
  [/\bsilent|silence\b/i, "Silence"],
  [/\bloud|noise\b/i, "Noise"],
  [/\bchaos\b/i, "Chaos"],
  [/\border\b/i, "Order"],
  [/\bfreedom\b/i, "Freedom"],
  [/\bprison\b/i, "Prison"],
  [/\bcage\b/i, "Cage"],
  [/\bchain\w*/i, "Chains"],
  [/\brebel\w*/i, "Rebels"],
  [/\boutlaw\w*/i, "Outlaws"],
  [/\boutcast\w*/i, "Outcasts"],
  [/\bunderdog\w*/i, "Underdogs"],
  [/\bgiant\w*/i, "Giants"],
  [/\bgoliath\b/i, "Goliath"],
  [/\bdavid\b/i, "David"],
  [/\bmonster\w*/i, "Monsters"],
  [/\bdemon\w*/i, "Demons"],
  [/\bangel\w*/i, "Angels"],
  [/\bghost\w*/i, "Ghosts"],
  [/\bphantom\w*/i, "Phantoms"],
  [/\bshadow\w*/i, "Shadows"],
  [/\bmirror\w*/i, "Mirrors"],
  [/\bmask\w*/i, "Masks"],
  [/\bwall\w*/i, "Walls"],
  [/\bbridge\w*/i, "Bridges"],
  [/\bdoor\w*/i, "Doors"],
  [/\bgate\w*/i, "Gates"],
  [/\bwindow\w*/i, "Windows"],
  [/\bkey\b/i, "Keys"],
  [/\block\w*/i, "Locks"],
  [/\bbox\b/i, "Box"],
  [/\bpandora\b/i, "Pandora"],
  [/\blabyrinth|maze\b/i, "Labyrinth"],
  [/\bvoid\b/i, "Void"],
  [/\babyss\b/i, "Abyss"],
  [/\broot\w*/i, "Roots"],
  [/\bseed\w*/i, "Seeds"],
  [/\btree\b/i, "Tree"],
  [/\bforest\b/i, "Forest"],
  [/\bflam\w*|burn\w*/i, "Flames"],
  [/\bice|frozen|cold\b/i, "Ice"],
  [/\bstars?\b/i, "Stars"],
  [/\bmoon\b/i, "Moon"],
  [/\bsun\b/i, "Sun"],
  [/\bocean|sea\b/i, "Ocean"],
  [/\briver\b/i, "River"],
  [/\bmountain\b/i, "Mountain"],
  [/\bjungle\b/i, "Jungle"],
  [/\bdesert\b/i, "Desert"],
  [/\bisland\b/i, "Island"],
  [/\bvolcano\b/i, "Volcano"],
  [/\bhorizon\b/i, "Horizon"],
  [/\bedge\b/i, "Edge"],
  [/\bcliff\b/i, "Cliff"],
  [/\bpit\b/i, "Pit"],
  [/\bcross.*road|intersection/i, "Crossroads"],
  [/\bpath\b/i, "Path"],
  [/\bjourney\b/i, "Journey"],
  [/\bquest\b/i, "Quest"],
  [/\bodyssey\b/i, "Odyssey"],
  [/\bsaga\b/i, "Saga"],
  [/\bgenesis\b/i, "Genesis"],
  [/\bexodus\b/i, "Exodus"],
  [/\bapocalyps\w*/i, "Apocalypse"],
  [/\bresurrect\w*/i, "Resurrection"],
  [/\bphoenix\b/i, "Phoenix"],
  [/\bdragon\b/i, "Dragon"],
  [/\bwolf|wolves\b/i, "Wolves"],
  [/\blion\b/i, "Lion"],
  [/\beagle\b/i, "Eagle"],
  [/\bsnake|serpent\b/i, "Serpent"],
  [/\bspider\b/i, "Spider"],
  [/\bweb\b/i, "Web"],
  [/\bnet\b|network\b/i, "Network"],
  [/\btrap\b/i, "Trap"],
  [/\bgold\b/i, "Gold"],
  [/\bsilver\b/i, "Silver"],
  [/\bdiamond\w*/i, "Diamond"],
  [/\btreasure\w*/i, "Treasure"],
  [/\bblood\b/i, "Blood"],
  [/\bbone\w*/i, "Bones"],
  [/\bheart\b/i, "Heart"],
  [/\bbrain\b/i, "Brain"],
  [/\beye\w*/i, "Eyes"],
  [/\bhand\w*/i, "Hands"],
  [/\bvoice\b/i, "Voice"],
  [/\bbreath\b/i, "Breath"],
  [/\bpulse\b/i, "Pulse"],
  [/\bdna\b/i, "DNA"],
  [/\bcode\b/i, "Code"],
  [/\bsignal\w*/i, "Signal"],
  [/\bfrequen\w*/i, "Frequency"],
  [/\bresonan\w*/i, "Resonance"],
  [/\bgravity\b/i, "Gravity"],
  [/\borbit\b/i, "Orbit"],
  [/\bblack.?hole\b/i, "Black Hole"],
  [/\bsupernova\b/i, "Supernova"],
  [/\bnebula\b/i, "Nebula"],
  [/\bgalaxy\b/i, "Galaxy"],
  [/\buniverse\b/i, "Universe"],
  [/\bcosmos\b/i, "Cosmos"],
  [/\bmatrix\b/i, "Matrix"],
  [/\bglitch\b/i, "Glitch"],
  [/\bbug\b/i, "Bug"],
  [/\bvirus\b/i, "Virus"],
  [/\bparasit\w*/i, "Parasite"],
  [/\bsymbiosis\b/i, "Symbiosis"],
  [/\bmutation\w*/i, "Mutation"],
  [/\balchemist|alchemy\b/i, "Alchemy"],
  [/\bmagic\w*/i, "Magic"],
  [/\bspell\b/i, "Spell"],
  [/\bcurse\b/i, "Curse"],
  [/\bblessing\b/i, "Blessing"],
  [/\bmiracle\b/i, "Miracle"],
  [/\bfate\b/i, "Fate"],
  [/\bdestiny\b/i, "Destiny"],
  [/\bkarma\b/i, "Karma"],
  [/\bzen\b/i, "Zen"],
  [/\bnirvana\b/i, "Nirvana"],
  [/\bparadise\b/i, "Paradise"],
  [/\bhell\b/i, "Hell"],
  [/\bpurgator\w*/i, "Purgatory"],
  [/\blimbo\b/i, "Limbo"],
  [/\butopia\b/i, "Utopia"],
  [/\bdystopia\b/i, "Dystopia"],
  [/\bwild\b/i, "Wild"],
  [/\braw\b/i, "Raw"],
  [/\bnaked\b/i, "Naked"],
  [/\bpure\b/i, "Pure"],
  [/\btoxic\b/i, "Toxic"],
  [/\belectric\w*/i, "Electric"],
  [/\bmagnetic\w*/i, "Magnetic"],
  [/\batomic\w*/i, "Atomic"],
  [/\bnuclear\b/i, "Nuclear"],
  [/\bquantum\b/i, "Quantum"],
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
function deriveCreativeTheme(question: string, businessTheme?: string): string {
  // Try creative extractions first
  for (const [pattern, replacement] of CREATIVE_EXTRACTIONS) {
    const match = question.match(pattern);
    if (match) {
      // Handle backreferences
      if (replacement.includes("$1") && match[1]) {
        const result = match[1].charAt(0).toUpperCase() + match[1].slice(1);
        // Avoid duplicating the business theme
        if (businessTheme && result.toLowerCase() === businessTheme.toLowerCase()) continue;
        return result;
      }
      // Avoid duplicating the business theme
      if (businessTheme && replacement.toLowerCase() === businessTheme.toLowerCase()) continue;
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
    // Avoid duplicating business theme — try different words
    for (let i = interesting.length - 1; i >= 0; i--) {
      const w = interesting[i];
      const capitalized = w.charAt(0).toUpperCase() + w.slice(1);
      if (businessTheme && capitalized.toLowerCase() === businessTheme.toLowerCase()) continue;
      return capitalized;
    }
    // All words match business theme — use the last one anyway
    const w = interesting[interesting.length - 1];
    return w.charAt(0).toUpperCase() + w.slice(1);
  }

  return "Unknown";
}

/* ── Business-themed pitch descriptions ── */
const BUSINESS_PITCHES: Record<string, string> = {
  // Strategy & Direction
  Strategy: "Where is {co} really heading — and what's pulling it off course? Your team maps the forces on stage. The real strategy emerges.",
  Decisions: "The choices {co} is avoiding get played out live. Characters embody the trade-offs. You see the cost of indecision.",
  Vision: "What does {co} look like in 5 years? Your team builds that future on stage — then watches what tries to destroy it.",
  Mission: "What is {co} really here to do? Not the poster — the fire. Your team plays the mission until it becomes real.",
  Ambition: "How far does {co} really want to go? The ambition plays out on stage. You see who's driving and who's braking.",
  Focus: "What deserves the attention of {co} — and what's stealing it? Your team plays focus vs. distraction live.",
  Alignment: "Is {co} actually aligned or just pretending? The disconnects surface on stage. You see where the team fractures.",
  Execution: "The plan is clear. The execution isn't. Your team at {co} plays the gap between intention and delivery.",

  // Growth & Scale
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

  // People & Organization
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

  // Change & Transformation
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

  // Performance & Results
  Performance: "What drives results at {co} — and what sabotages them? Performance dynamics play out live.",
  Success: "What does winning look like at {co}? Your team plays the forces of success — and what it costs.",
  Failure: "The failure {co} won't talk about. Characters play the mistakes, the blame, the lessons. All on stage.",
  Breakthrough: "What's keeping {co} stuck? The invisible walls, the comfort zones. Your team breaks through them on stage.",
  Balance: "The energy at {co} — where it flows and where it burns out. Your team plays the balance between drive and destruction.",
  Momentum: "The speed of {co}. What accelerates, what drags. Your team plays the momentum dynamics on stage.",
  Efficiency: "The waste hiding inside {co}. Bloat, politics, busy work. Your team plays lean vs. fat on stage.",
  Complexity: "The complexity choking {co}. Too many layers, too many processes. Simplicity and chaos meet on stage.",

  // Purpose, Meaning & Values
  Purpose: "Why does {co} exist? Not the mission statement — the real reason. Purpose meets reality on stage.",
  Impact: "What mark is {co} leaving on the world? The impact you intend vs. the impact you create. Played out live.",
  Integrity: "The gap between what {co} says and what it does. Characters play both sides. You see the truth.",
  Heritage: "Where {co} comes from. The roots, the origin story, what's been forgotten. Heritage plays out on stage.",
  Identity: "Who is {co} — really? Not the brand book. The truth. Your team plays identity live.",
  Freedom: "The freedom inside {co}. Who has it, who doesn't. Autonomy and control meet on stage.",
  Justice: "What's fair at {co} — and what isn't? The equity dynamics play out live.",

  // Emotions & Human Forces
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

  // Relationships
  Family: "The family behind {co}. Blood, loyalty, succession, sacrifice. Family business dynamics play out on stage.",
  Partnership: "The partnership powering {co}. Trust, tension, equity, ego. Partners meet on stage.",
  Friendship: "The friendships inside {co}. Loyalty, betrayal, boundaries. Your team plays the personal dynamics.",
  Mentorship: "The mentor {co} needs. Wisdom, challenge, tough love. The mentoring dynamic plays out on stage.",
  Rivals: "The rival {co} fears. Competition, respect, obsession. Your nemesis steps onto the stage.",
  Negotiation: "The deal that defines {co}. Power, compromise, walkaway. The negotiation plays out live.",

  // Industry-specific
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
  const creativeTheme = deriveCreativeTheme(question, bizTheme);
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
  const [simPhase, setSimPhase] = useState<"cast" | "stage" | "perspectives">("cast");
  const [simEnded, setSimEnded] = useState(false);
  const [inlineDigital, setInlineDigital] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLDivElement>(null);

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

  async function fetchSimulation(currentPlay: Play, overrideQuestion?: string) {
    setSimLoading(true);
    setSimReady(false);
    try {
      const q = overrideQuestion || askedQuestion || question;
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

    const q = overrideQuestion || askedQuestion;
    try {
      // Step 1: Generate the play
      const res = await fetch("/api/generate-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context, lang: "en", clientName: companyName || undefined }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.plays?.[0]) {
        const generatedPlay = data.plays[0];
        setPlay(generatedPlay);
        setPlayLoading(false);
        // Step 2: Generate choreography in background — user will start when ready
        fetchSimulation(generatedPlay, q);
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
    setSimPhase("cast");
    setSimEnded(false);
    setInlineDigital(false);
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
        .fade-section { opacity: 0; transform: translateY(12px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-section.is-visible { opacity: 1; transform: translateY(0); }
        @keyframes glow-pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.15); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes curtain-left { from { transform: translateX(0); } to { transform: translateX(-100%); } }
        @keyframes curtain-right { from { transform: translateX(0); } to { transform: translateX(100%); } }
        @keyframes breathe { 0%, 100% { box-shadow: 0 0 30px rgba(255,85,0,0.3), 0 0 60px rgba(255,85,0,0.15); } 50% { box-shadow: 0 0 50px rgba(255,85,0,0.5), 0 0 100px rgba(255,85,0,0.25); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
      `}</style>


      {/* ── HERO: The curtain opens ── */}
      <section className={`${submitted ? "pt-16 sm:pt-24" : "min-h-[100vh] flex"} flex flex-col items-center justify-center px-4 relative overflow-hidden transition-all duration-700`}>

        {/* Stage curtain + lighting */}
        {!submitted && (
          <>
            {/* Curtain panels that part */}
            <div
              className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#0a0a0a] via-[#110800] to-[#1a0a00] transition-all duration-[2500ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-[1] ${entered ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
            />
            <div
              className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#0a0a0a] via-[#110800] to-[#1a0a00] transition-all duration-[2500ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-[1] ${entered ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
            />

            {/* Stage photo — subtle background */}
            <img
              src="/lux6.jpg"
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[4000ms] delay-[1500ms] ${entered ? "opacity-[0.35] scale-100" : "opacity-0 scale-[1.03]"}`}
              style={{ objectPosition: "50% 30%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-[#0a0a0a]/20 via-40% to-[#0a0a0a]/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/40" />

            {/* Main spotlight — dramatic overhead cone */}
            <div
              className={`absolute transition-all duration-[3000ms] delay-[800ms] ${entered ? "opacity-100" : "opacity-0"}`}
              style={{
                top: "-30%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "140%",
                height: "90%",
                background: "conic-gradient(from 180deg at 50% 0%, transparent 32%, rgba(255,85,0,0.05) 42%, rgba(255,85,0,0.15) 50%, rgba(255,85,0,0.05) 58%, transparent 68%)",
              }}
            />
            {/* Warm pool of light at center stage */}
            <div
              className={`absolute w-[800px] h-[800px] rounded-full transition-all duration-[3000ms] delay-[1200ms] ${entered ? "opacity-100" : "opacity-0"}`}
              style={{ background: "radial-gradient(ellipse, rgba(255,85,0,0.12) 0%, rgba(255,85,0,0.03) 40%, transparent 65%)", top: "35%", left: "50%", transform: "translate(-50%, -50%)" }}
            />
            {/* Stage floor glow */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-[1px] transition-all duration-[2000ms] delay-[2000ms] ${entered ? "opacity-100" : "opacity-0"}`}
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,85,0,0.15) 30%, rgba(255,85,0,0.25) 50%, rgba(255,85,0,0.15) 70%, transparent)" }}
            />
            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "256px" }} />
          </>
        )}

        <div className={`relative z-10 w-full flex flex-col items-center transition-all duration-[2000ms] delay-[1500ms] ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>

          {!submitted && (
            <div className="text-center mb-12 sm:mb-16">
              {/* Logo */}
              <div className="mb-8 sm:mb-10" style={{ animation: "float 6s ease-in-out infinite" }}>
                <img src="/logo.png" alt="Stage On Mars" className="h-8 sm:h-12 md:h-14 w-auto invert mx-auto opacity-60" />
              </div>
              <h1 className="text-[clamp(28px,7vw,90px)] font-black leading-[0.9] tracking-[-0.05em] text-center">
                <span className="block text-white/90">The question you won&apos;t</span>
                <span className="block font-mercure italic text-mars">ask in a boardroom.</span>
              </h1>
              <p className="text-white/35 text-[13px] sm:text-[15px] mt-6 sm:mt-8 max-w-md mx-auto leading-[1.6] tracking-wide">
                Put it on stage. Watch it play out. See what you couldn&apos;t see before.
              </p>
            </div>
          )}

          <div className="w-full max-w-3xl">

            {/* THE INPUT — stepping onto a stage */}
            <div className="relative group/input">
              <div className="absolute -inset-10 sm:-inset-20 rounded-3xl opacity-30 group-focus-within/input:opacity-100 transition-opacity duration-[2000ms]" style={{ background: "radial-gradient(ellipse at center, rgba(255,85,0,0.1) 0%, transparent 60%)" }} />

              <div className="relative rounded-2xl border border-white/[0.08] group-focus-within/input:border-mars/30 bg-white/[0.02] backdrop-blur-sm transition-all duration-700 overflow-hidden shadow-[0_0_60px_rgba(255,85,0,0.02)] group-focus-within/input:shadow-[0_0_100px_rgba(255,85,0,0.1)]">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-mars/40 to-transparent" />
                <div className="px-6 sm:px-8 pt-6 sm:pt-7 pb-5 sm:pb-6">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What question would you put on stage?"
                    rows={2}
                    className="w-full bg-transparent border-0 px-0 py-0 text-white text-[20px] sm:text-[24px] placeholder:text-white/20 focus:outline-none resize-none leading-[1.4] tracking-[-0.02em] font-bold"
                    style={{ caretColor: "#FF5500" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); }
                    }}
                  />
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.06]">
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company name (optional)"
                      className="flex-1 bg-transparent border-0 px-0 text-white/50 placeholder:text-white/15 focus:outline-none text-[14px]"
                    />
                    {/* THE PLAY BUTTON — magnetic, alive */}
                    <button
                      onClick={generate}
                      disabled={!question.trim()}
                      className="shrink-0 relative"
                    >
                      {question.trim() && (
                        <>
                          <div className="absolute inset-0 rounded-xl" style={{ animation: "breathe 2s ease-in-out infinite" }} />
                          <div className="absolute -inset-1 rounded-xl bg-mars/20" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
                        </>
                      )}
                      <div className={`relative px-8 sm:px-10 py-3 sm:py-3.5 rounded-xl font-black text-[14px] sm:text-[15px] uppercase tracking-[0.2em] transition-all duration-500 ${
                        question.trim()
                          ? "bg-mars text-white hover:bg-[#ff6a1a] scale-100 hover:scale-105"
                          : "bg-white/[0.04] text-white/20 cursor-not-allowed"
                      }`}>
                        Play
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>{/* end max-w-3xl */}

          {/* ── DIGITAL PLAYMAKER — provocative invitation, no phone SVG ── */}
          {!submitted && !inlineDigital && (
            <div className="w-full max-w-3xl mx-auto mt-10 sm:mt-14">
              <button
                onClick={() => {
                  const q = question.trim() || "What does my company need right now?";
                  setAskedQuestion(q);
                  if (!question.trim()) setQuestion(q);
                  setInlineDigital(true);
                  openDigital(q);
                  setTimeout(() => inlineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
                }}
                className="w-full group transition-all duration-500 hover:scale-[1.01]"
              >
                <div className="relative rounded-2xl border border-mars/[0.12] hover:border-mars/25 bg-gradient-to-r from-mars/[0.04] via-mars/[0.08] to-mars/[0.04] overflow-hidden transition-all duration-500">
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-mars/50 to-transparent" />
                  <div className="px-8 sm:px-12 py-10 sm:py-14 text-center">
                    <p className="text-mars text-[11px] sm:text-[12px] uppercase tracking-[0.4em] font-bold mb-4 opacity-70">Digital Playmaker</p>
                    <h3 className="text-[24px] sm:text-[32px] md:text-[38px] font-black tracking-[-0.04em] leading-[1] mb-4 group-hover:text-white transition-colors">
                      Don&apos;t wait for the stage.<br />
                      <span className="font-mercure italic text-mars/80">The stage is here.</span>
                    </h3>
                    <p className="text-white/40 text-[13px] sm:text-[15px] max-w-md mx-auto mb-8">
                      AI creates your reality play in 30 seconds. Characters, dynamics, perspectives. Right now.
                    </p>
                    <div className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-mars/10 border border-mars/20 text-mars text-[12px] font-bold uppercase tracking-[0.2em] group-hover:bg-mars/15 group-hover:border-mars/30 transition-all">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8 5v14l11-7z" /></svg>
                      Enter the Playmaker
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* ── INLINE DIGITAL PLAYMAKER ── */}
          {inlineDigital && !submitted && (
            <div ref={inlineRef} className="w-full max-w-3xl mx-auto mt-6 sm:mt-8">
              <div className="relative">
                <div className="absolute -inset-4 sm:-inset-8 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.04)_0%,_transparent_70%)] pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-mars" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                    <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold">Digital Playmaker</p>
                  </div>
                  <button onClick={() => { setInlineDigital(false); setPlay(null); setPlayLoading(false); setSimLoading(false); setSimReady(false); setSimPhase("cast"); setSimEnded(false); }} className="text-white/40 text-[10px] uppercase tracking-[0.15em] hover:text-white/60 transition-colors">
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
                          <p className="text-white/60 text-[11px] mt-1 font-mercure italic">{play.mood} · {play.characters.length} characters</p>
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
                              <button onClick={() => { const followUp = play.followUpQuestion!; reset(); setTimeout(() => { setQuestion(followUp); }, 100); }} className="text-mars/70 text-[11px] font-bold uppercase tracking-[0.15em] hover:text-mars transition-colors">
                                Ask this question
                              </button>
                            </div>
                          </div>
                        )}
                        <button onClick={() => { setSimEnded(false); setSimPhase("cast"); }} className="w-full py-3 rounded-xl border border-white/[0.10] text-white/60 text-[10px] uppercase tracking-[0.15em] font-bold hover:text-white/55 hover:border-white/[0.15] transition-all">
                          Back to cast
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {error && <p className="text-red-400/60 text-[12px] mt-4 text-center">{error}</p>}
              </div>
            </div>
          )}

          {/* ── BESTSELLING PLAYS — luxury product cards, taller photos, commanding CTAs ── */}
          {!submitted && (
            <div className="w-full max-w-4xl mx-auto mt-14 sm:mt-20 space-y-6">
              <div className="px-1 mb-2">
                <p className="text-mars/50 text-[10px] uppercase tracking-[0.4em]">Bestselling plays</p>
              </div>
              {[
                { theme: "Strategy", photo: "/luxury2.jpg", photoPos: "50% 30%", duration: "Half-day", people: "8-30", price: "from \u20ac2 900", pitch: "Where is your company really heading \u2014 and what\u2019s pulling it off course? Your team maps the forces on stage." },
                { theme: "Vision", photo: "/luxury4.jpg", photoPos: "50% 50%", duration: "Half-day", people: "8-30", price: "from \u20ac2 900", pitch: "What does your company look like in 5 years? Your team builds that future on stage \u2014 then watches what tries to destroy it." },
                { theme: "Creativity", photo: "/luxury1.jpg", photoPos: "50% 40%", duration: "Half-day", people: "8-25", price: "from \u20ac2 200", pitch: "The creative soul of your company. What feeds it, what starves it. Your team plays creativity vs. control." },
              ].map((playItem, i) => (
                <div key={i} className="group rounded-2xl border border-white/[0.06] hover:border-mars/20 overflow-hidden bg-white/[0.02] transition-all duration-700 hover:shadow-[0_0_60px_-20px_rgba(255,85,0,0.15)]">
                  {/* Photo — taller, cinematic */}
                  <div className="relative h-[260px] sm:h-[340px] overflow-hidden">
                    <img src={playItem.photo} alt="" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.03] group-hover:scale-100" style={{ objectPosition: playItem.photoPos }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
                    {/* Theme name overlaid on photo */}
                    <div className="absolute bottom-6 left-6 sm:left-8">
                      <h4 className="text-[28px] sm:text-[36px] font-black tracking-[-0.04em] leading-[1]">
                        <span className="text-white">{playItem.theme}</span>{" "}
                        <span className="text-mars/70">on Mars</span>
                      </h4>
                    </div>
                  </div>
                  {/* Product details */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-4 text-white/30 text-[10px] uppercase tracking-[0.15em] mb-4">
                      <span>{playItem.duration}</span>
                      <span className="text-white/10">|</span>
                      <span>{playItem.people} people</span>
                      <span className="text-white/10">|</span>
                      <span>On stage or at your venue</span>
                      <span className="ml-auto text-white/50 text-[14px] font-bold tracking-tight normal-case">{playItem.price}</span>
                    </div>
                    <p className="text-white/50 text-[14px] leading-[1.6] mb-6 max-w-lg">{playItem.pitch}</p>
                    <a href="#contact" className="inline-block px-8 py-3 rounded-xl bg-mars/10 border border-mars/20 text-mars text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-mars hover:text-white hover:border-mars transition-all duration-300">
                      Book this play
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>


      {/* ── RESULTS ── */}
      {submitted && (
        <section ref={resultRef} className="relative px-4">
          <div className="max-w-3xl mx-auto">

            {/* The question echo */}
            <div className="text-center mb-10 sm:mb-12 pt-4 sm:pt-6">
              <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] mb-4">Your question</p>
              <p className="font-mercure italic text-white/60 text-[18px] sm:text-[24px] leading-[1.3] max-w-xl mx-auto">&ldquo;{askedQuestion}&rdquo;</p>
              <button onClick={reset} className="text-white/20 text-[10px] uppercase tracking-[0.15em] mt-5 hover:text-mars/60 transition-colors">
                Ask something else
              </button>
            </div>

            {/* 3 PRODUCT OPTIONS */}
            {products.length > 0 && selectedIdx === null && (
              <div>
                <p className="text-mars/50 text-[12px] sm:text-[13px] uppercase tracking-[0.4em] text-center mb-10 sm:mb-12 font-bold">Choose your play</p>

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
                            : "border-white/[0.10] bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/[0.15] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]"
                        }`}
                      >
                        <div className={`h-[2px] ${isLeader ? "bg-gradient-to-r from-mars/40 via-mars to-mars/40" : "bg-gradient-to-r from-transparent via-white/10 to-transparent"}`} />

                        <div className="p-5 sm:p-6 flex flex-col flex-1">
                          <p className={`text-[12px] uppercase tracking-[0.3em] font-bold mb-4 ${isLeader ? "text-mars/60" : "text-white/50"}`}>{p.tag}</p>

                          <h3 className="text-[28px] sm:text-[34px] font-black tracking-[-0.04em] leading-[0.95] mb-4">
                            <span className={isLeader ? "text-mars" : "text-white/90"}>{p.theme}</span>
                            {" "}
                            <span className={isLeader ? "text-mars/70" : "text-white/40"}>on Mars</span>
                          </h3>

                          <p className="text-white/55 text-[13px] sm:text-[14px] leading-[1.55] mb-6 flex-1">
                            {p.pitch}
                          </p>

                          <div className={`border-t pt-4 mt-auto ${isLeader ? "border-mars/10" : "border-white/[0.08]"}`}>
                            <div className="flex items-end justify-between">
                              <p className="text-white/40 text-[10px]">{p.duration} · {p.people}</p>
                              <p className={`text-[14px] sm:text-[15px] font-bold tracking-tight ${isLeader ? "text-mars/70" : "text-white/50"}`}>{p.price}</p>
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg viewBox="0 0 24 24" className={`w-4 h-4 fill-current ${isLeader ? "text-mars/70" : "text-white/40"}`}><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Digital Playmaker — below product cards, no phone SVG */}
                <div className="mt-10 sm:mt-12">
                  <button
                    onClick={() => {
                      setSelectedIdx(0);
                      openDigital();
                    }}
                    className="w-full group transition-all duration-500 hover:scale-[1.005]"
                  >
                    <div className="relative rounded-2xl border border-mars/[0.12] hover:border-mars/25 bg-gradient-to-r from-mars/[0.03] via-mars/[0.06] to-mars/[0.03] overflow-hidden transition-all duration-500">
                      <div className="h-[2px] bg-gradient-to-r from-transparent via-mars/40 to-transparent" />
                      <div className="px-8 sm:px-12 py-10 sm:py-14 text-center">
                        <p className="text-mars/60 text-[11px] uppercase tracking-[0.4em] font-bold mb-3">Digital Playmaker</p>
                        <h3 className="text-[22px] sm:text-[28px] font-black tracking-[-0.03em] leading-[1.1] mb-3 group-hover:text-white transition-colors">
                          Or step on stage right now.
                        </h3>
                        <p className="text-white/40 text-[13px] sm:text-[14px] max-w-sm mx-auto mb-6">
                          AI creates your reality play in 30 seconds. Characters, dynamics, perspectives.
                        </p>
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-mars/10 border border-mars/20 text-mars text-[11px] font-bold uppercase tracking-[0.2em] group-hover:bg-mars/15 group-hover:border-mars/30 transition-all">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8 5v14l11-7z" /></svg>
                          Enter the Playmaker
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}


            {/* SELECTED PRODUCT */}
            {selectedIdx !== null && products[selectedIdx] && (
              <>
                <div className="mb-4 sm:mb-6">
                  <button onClick={() => { setSelectedIdx(null); setPlay(null); setShowDigital(false); }} className="text-white/40 text-[12px] uppercase tracking-[0.15em] hover:text-white/60 transition-colors">
                    Back to all plays
                  </button>
                </div>

                <div className="mb-6 sm:mb-8">
                  <div className="rounded-2xl border border-mars/[0.15] bg-mars/[0.03] overflow-hidden">
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-mars/40 to-transparent" />
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-mars" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                        <p className="text-mars/70 text-[11px] sm:text-[12px] uppercase tracking-[0.3em] font-bold">{products[selectedIdx].tag}</p>
                      </div>

                      <h3 className="text-[26px] sm:text-[36px] font-black tracking-[-0.03em] leading-[1] mb-3">
                        {products[selectedIdx].theme}{" "}
                        <span className="text-mars">on Mars</span>
                      </h3>

                      <p className="text-white/60 text-[14px] sm:text-[15px] leading-[1.6] mb-6 max-w-lg">{products[selectedIdx].pitch}</p>

                      <div className="flex flex-wrap gap-6 mb-6 text-[13px]">
                        <span className="text-white/40">{products[selectedIdx].duration}</span>
                        <span className="text-white/40">{products[selectedIdx].people}</span>
                        <span className="text-white/40">{products[selectedIdx].price}</span>
                      </div>

                      <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-mars text-white text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-[#ff6a1a] transition-colors">
                        Book this play
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* DIGITAL SIMULATION */}
                <div className="relative mt-0">
                  {!showDigital ? (
                    <button
                      onClick={() => openDigital()}
                      className="w-full group transition-all duration-500"
                    >
                      <div className="relative rounded-2xl border border-mars/[0.12] hover:border-mars/25 bg-gradient-to-r from-mars/[0.03] via-mars/[0.06] to-mars/[0.03] overflow-hidden transition-all duration-500">
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-mars/40 to-transparent" />
                        <div className="relative z-10 py-12 sm:py-16 px-8 sm:px-12 text-center">
                          <p className="text-mars/60 text-[11px] uppercase tracking-[0.4em] font-bold mb-4">Digital Playmaker</p>
                          <p className="text-white/80 text-[20px] sm:text-[26px] font-black tracking-[-0.02em] mb-3 group-hover:text-white transition-colors">
                            Watch this play unfold. Now.
                          </p>
                          <p className="font-mercure text-white/40 text-[13px] sm:text-[14px] mb-8">
                            AI-generated reality play you can walk through right here
                          </p>
                          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-mars/10 border border-mars/20 text-mars text-[11px] font-bold uppercase tracking-[0.2em] group-hover:bg-mars/15 group-hover:border-mars/30 transition-all">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8 5v14l11-7z" /></svg>
                            Enter the Playmaker
                          </div>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="relative">
                      <div className="absolute -inset-4 sm:-inset-8 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.04)_0%,_transparent_70%)] pointer-events-none" />

                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-mars" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                          <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold">Digital Playmaker</p>
                        </div>
                        <button onClick={() => setShowDigital(false)} className="text-white/40 text-[10px] uppercase tracking-[0.15em] hover:text-white/60 transition-colors">
                          Close
                        </button>
                      </div>

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

                      {play && !playLoading && (
                        <div className="space-y-4">

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

                          {simPhase === "cast" && (
                            <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                              <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
                              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
                                <h3 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">{play.name}</h3>
                                <p className="text-white/60 text-[11px] mt-1 font-mercure italic">{play.mood} · {play.characters.length} characters</p>
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

                          {simPhase === "stage" && simReady && play.simulationSteps && (
                            <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                              <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
                              <div className="p-4 sm:p-6">
                                <StageSimulation
                                  simulationSteps={play.simulationSteps}
                                  characters={play.characters}
                                  simulation={play.simulation}
                                  onEnd={() => {
                                    setSimEnded(true);
                                    setSimPhase("perspectives");
                                  }}
                                />
                              </div>
                            </div>
                          )}

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
                                    <button
                                      onClick={() => {
                                        const followUp = play.followUpQuestion!;
                                        reset();
                                        setTimeout(() => { setQuestion(followUp); }, 100);
                                      }}
                                      className="text-mars/70 text-[11px] font-bold uppercase tracking-[0.15em] hover:text-mars transition-colors"
                                    >
                                      Ask this question
                                    </button>
                                  </div>
                                </div>
                              )}

                              <button
                                onClick={() => { setSimEnded(false); setSimPhase("cast"); }}
                                className="w-full py-3 rounded-xl border border-white/[0.10] text-white/60 text-[10px] uppercase tracking-[0.15em] font-bold hover:text-white/55 hover:border-white/[0.15] transition-all"
                              >
                                Back to cast
                              </button>
                            </div>
                          )}
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


      {/* ── SOCIAL PROOF — full-width cinematic applause moment ── */}
      <FadeIn className="py-16 sm:py-24">
        <div className="relative w-full overflow-hidden">
          {/* Full-bleed background */}
          <div className="absolute inset-0">
            <img src="/luxury5.jpg" alt="" className="w-full h-full object-cover grayscale opacity-[0.12]" style={{ objectPosition: "50% 35%" }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">
            {/* Voices — the star, massive */}
            <div className="text-center mb-14 sm:mb-20">
              <div className="h-[160px] sm:h-[200px] flex flex-col items-center justify-center">
                <Voices />
              </div>
            </div>

            {/* Stats — monumental */}
            <div className="flex items-center justify-center gap-12 sm:gap-20 mb-14 sm:mb-16">
              {[
                { val: "800+", label: "Reality plays delivered" },
                { val: "4", label: "Countries" },
                { val: "2020", label: "Founded" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-[36px] sm:text-[56px] font-black tracking-[-0.04em] text-white/90 leading-none">{stat.val}</p>
                  <p className="text-white/25 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mt-2">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-10 sm:mb-12 max-w-2xl mx-auto" />

            {/* Trusted by */}
            <p className="text-white/20 text-[9px] uppercase tracking-[0.4em] text-center mb-5">Trusted by</p>
            <p className="text-white/35 text-[13px] sm:text-[14px] leading-[2.4] tracking-wide text-center max-w-2xl mx-auto">
              Forbes{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              Škoda{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              YPO{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              PwC{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              O₂{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              UniCredit{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              Oktagon MMA{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              House of Lobkowicz{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              London Business School{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              Česká spořitelna{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              Lasvit{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              Ipsen{" "}<span className="text-white/8 mx-1.5">|</span>{" "}
              MSD
            </p>
            <p className="text-white/12 text-[10px] text-center mt-5 font-mercure italic tracking-wider">
              London · Zurich · Bucharest · Prague
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ── THE STAGE — full-bleed McQueen runway shot ── */}
      <FadeIn>
        <div className="relative w-full">
          {/* Full-bleed photo */}
          <div className="relative h-[50vh] sm:h-[70vh] overflow-hidden">
            <img src="/space1.png" alt="Stage on Mars — flagship space" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/30 via-transparent to-[#0a0a0a]/30" />

            {/* Text overlaid at bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-8 sm:pb-12">
              <div className="max-w-6xl mx-auto flex items-end justify-between gap-6">
                <div>
                  <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-bold mb-2 opacity-80">The Stage</p>
                  <p className="text-white text-[24px] sm:text-[36px] font-black tracking-[-0.03em] leading-[1]">Národní 138/10, Praha</p>
                  <p className="text-white/50 text-[13px] sm:text-[15px] mt-2">Where reality plays happen.</p>
                </div>
                <a href="/space" className="shrink-0 px-6 py-2.5 rounded-xl border border-white/20 text-white/70 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/10 hover:text-white transition-all hidden sm:block">
                  Explore the space
                </a>
              </div>
            </div>
          </div>
          {/* Mobile CTA */}
          <div className="sm:hidden px-6 py-4">
            <a href="/space" className="block text-center py-3 rounded-xl border border-white/10 text-white/50 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/5 transition-all">
              Explore the space
            </a>
          </div>
        </div>
      </FadeIn>

      {/* ── THE CREW — manifesto, not backstory ── */}
      <FadeIn className="px-4 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-0 rounded-2xl border border-white/[0.08] overflow-hidden bg-white/[0.02]">
            {/* Team photo */}
            <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[400px]">
              <img src="/team.jpg" alt="Stage on Mars team" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/40 hidden sm:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent sm:hidden" />
            </div>
            {/* Manifesto */}
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <p className="text-mars/60 text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-bold mb-6">The Crew</p>
              <p className="text-white/70 text-[16px] sm:text-[18px] font-bold leading-[1.5] tracking-[-0.01em] mb-4">
                Theatre meets business. Improvisation meets strategy. We built a stage and invited corporations to play.
              </p>
              <p className="text-white/40 text-[13px] sm:text-[14px] leading-[1.7] mb-6">
                Systemic constellations fused with theatrical improvisation. A method that bypasses PowerPoint and speaks directly to what teams actually feel, fear, and want. 800+ plays. Boardrooms from London to Bucharest.
              </p>
              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-white/50 text-[12px] font-bold tracking-wide">
                  Milan Semelak · David Vais · Tomas Pavlik · Jan Piskor · Andrea Sturalova
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* ── CONTACT — the final act ── */}
      <FadeIn className="px-4 pt-6 sm:pt-10 pb-20 sm:pb-32">
        <div className="max-w-2xl mx-auto">
          <div id="contact" className="relative">
            {/* Dramatic top glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.08)_0%,_transparent_70%)] pointer-events-none" />

            <div className="relative rounded-2xl border border-mars/[0.12] bg-mars/[0.02] overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-mars/40 to-transparent" />

              <div className="p-8 sm:p-12">
                <div className="max-w-md mx-auto space-y-8">
                  <div className="text-center">
                    <h2 className="text-[28px] sm:text-[38px] font-black tracking-[-0.04em] leading-[1] mb-3">
                      {submitted ? "Let\u2019s make it happen." : "Your move."}
                    </h2>
                    <p className="font-mercure italic text-white/40 text-[14px] sm:text-[16px]">
                      {submitted ? "The stage is waiting." : "Step on stage."}
                    </p>
                  </div>

                  {sent ? (
                    <div className="text-center py-10">
                      <p className="text-white/60 text-[16px] font-bold mb-2">The curtain rises soon.</p>
                      <p className="font-mercure text-white/40 text-[13px]">We&apos;ll be in touch.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input name="name" value={formData.name} onChange={handleContactChange} placeholder="Name" required className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/30 px-5 py-3.5 text-[14px] text-[#EDEDED] placeholder:text-white/20 focus:outline-none transition-colors" />
                        <input name="company" value={formData.company} onChange={handleContactChange} placeholder="Company" className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/30 px-5 py-3.5 text-[14px] text-[#EDEDED] placeholder:text-white/20 focus:outline-none transition-colors" />
                      </div>
                      <input name="email" type="email" value={formData.email} onChange={handleContactChange} placeholder="Email" required className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/30 px-5 py-3.5 text-[14px] text-[#EDEDED] placeholder:text-white/20 focus:outline-none transition-colors" />
                      <textarea name="question" value={formData.question || askedQuestion} onChange={handleContactChange} placeholder="Your question for the stage" rows={3} className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-mars/30 px-5 py-3.5 text-[14px] text-[#EDEDED] placeholder:text-white/20 focus:outline-none transition-colors resize-none" />
                      <button type="submit" className="w-full py-4 rounded-xl bg-mars hover:bg-[#ff6a1a] text-white text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_30px_-4px_rgba(255,85,0,0.4)] hover:shadow-[0_4px_40px_-4px_rgba(255,85,0,0.5)]">
                        Step On Stage
                      </button>
                    </form>
                  )}

                  <p className="text-center text-white/20 text-[11px] tracking-wide">
                    <a href="mailto:play@stageonmars.com" className="hover:text-mars/60 transition-colors">play@stageonmars.com</a>
                    {" · "}
                    <a href="tel:+420602336338" className="hover:text-mars/60 transition-colors">+420 602 336 338</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>


      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/20 text-[10px] tracking-wider">
          <span className="font-mercure italic">&copy; {new Date().getFullYear()} Stage on Mars</span>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/stage_on_mars" target="_blank" rel="noopener noreferrer" className="hover:text-mars/50 transition-colors uppercase tracking-[0.15em]">Instagram</a>
            <a href="https://www.linkedin.com/company/stageonmars" target="_blank" rel="noopener noreferrer" className="hover:text-mars/50 transition-colors uppercase tracking-[0.15em]">LinkedIn</a>
            <a href="https://playbook.stageonmars.com" className="hover:text-mars/50 transition-colors uppercase tracking-[0.15em]">Playbook</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
