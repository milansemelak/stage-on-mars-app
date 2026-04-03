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
  [/money|rich|wealth|expensive|cheap|afford/i, "Value", "value creation"],
  [/death|dying|dead|kill|end|terminal/i, "Survival", "survival and crisis"],

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
      if (replacement.includes("$1") && match[1]) {
        const result = match[1].charAt(0).toUpperCase() + match[1].slice(1);
        if (businessTheme && result.toLowerCase() === businessTheme.toLowerCase()) continue;
        return result;
      }
      if (businessTheme && replacement.toLowerCase() === businessTheme.toLowerCase()) continue;
      return replacement;
    }
  }

  // Fallback: find the most dramatic/interesting word in the question
  const q = question.replace(/[?.,!'"]/g, "").toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 3);
  const boring = new Set(["about","could","would","should","where","there","their","these","those","which","while","after","before","being","doing","going","having","making","taking","using","what","when","with","from","into","than","then","them","they","this","that","have","will","been","were","does","your","need","want","know","think","feel","like","just","more","most","very","really","still","also","even","each","much","many","some","such","only","back","over","down","come","made","find","here","thing","give","every","good","well","work","make","help","keep","turn","start","might","could","first","never","under","other","again","next","last","long","great","little","right","look","tell","mean","must","call","hand","high","because","between","same","different","through","another","people","company","question","play"]);
  const interesting = words.filter(w => !boring.has(w));

  if (interesting.length > 0) {
    for (let i = interesting.length - 1; i >= 0; i--) {
      const w = interesting[i];
      const capitalized = w.charAt(0).toUpperCase() + w.slice(1);
      if (businessTheme && capitalized.toLowerCase() === businessTheme.toLowerCase()) continue;
      return capitalized;
    }
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
      `}</style>



      {/* ── HERO: You are stepping on stage ── */}
      <section className={`${submitted ? "pt-16 sm:pt-24" : "min-h-[100svh] flex"} flex-col items-center justify-center px-4 pt-12 sm:pt-0 pb-8 sm:pb-0 relative overflow-hidden transition-all duration-700`}>

        {/* Stage photo background — space5.png, the circular stage with red LED ring */}
        {!submitted && (
          <>
            {/* Photo container — locked to viewport height, doesn't bleed into playmaker/cards */}
            <div className={`absolute top-0 left-0 right-0 h-screen transition-opacity duration-[3000ms] ${entered ? "opacity-100" : "opacity-0"}`}>
              <img
                src="/space5.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "50% 70%", filter: "grayscale(0.7) contrast(1.15) brightness(0.9)" }}
              />
              {/* Warm mars tint — brings back the red stage lighting */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(255,85,0,0.04) 0%, rgba(255,85,0,0.08) 50%, rgba(255,85,0,0.04) 100%)", mixBlendMode: "color" }} />
              {/* Grain texture — Helmut Newton film look */}
              <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "200px" }} />
              {/* Soft vignette — gentle edge darkening */}
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 80% at 50% 55%, transparent 30%, rgba(10,10,10,0.25) 55%, rgba(10,10,10,0.75) 90%)" }} />
              {/* Bottom fade — dissolve into page bg, starts late so input stays on stage */}
              <div className="absolute bottom-0 left-0 right-0 h-[25%]" style={{ background: "linear-gradient(to top, #0a0a0a 0%, #0a0a0a 15%, transparent 100%)" }} />
              {/* Top fade — hides the ceiling */}
              <div className="absolute top-0 left-0 right-0 h-[30%]" style={{ background: "linear-gradient(to bottom, #0a0a0a 0%, #0a0a0a 25%, transparent 100%)" }} />
            </div>
          </>
        )}

        <div className={`relative z-10 w-full flex flex-col items-center transition-all duration-[1500ms] delay-[800ms] ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          {!submitted && (
            <div className="text-center mb-6 sm:mb-10">
              {/* Logo with subtitle */}
              <div className="mb-6 sm:mb-8" style={{ animation: "float 6s ease-in-out infinite" }}>
                <img src="/logo.png" alt="Stage On Mars" className="h-10 sm:h-14 md:h-18 w-auto invert mx-auto drop-shadow-[0_0_30px_rgba(255,85,0,0.15)]" />
                <p className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] mt-3">Reality Play Platform</p>
              </div>
              <h1 className="text-[clamp(28px,6.5vw,80px)] font-black leading-[0.95] tracking-[-0.04em] text-center text-white" style={{ textShadow: "0 2px 20px rgba(0,0,0,1), 0 4px 60px rgba(0,0,0,0.8), 0 0 120px rgba(0,0,0,0.6)" }}>
                Put your company
                <br />
                <span className="text-mars" style={{ textShadow: "0 0 30px rgba(255,85,0,0.6), 0 0 80px rgba(255,85,0,0.3), 0 2px 20px rgba(0,0,0,1)" }}>on stage.</span>
              </h1>
            </div>
          )}

          <div className="w-full max-w-2xl">

            {/* THE INPUT — no box, just the stage floor */}
            <div className="relative group/input">

              {/* The question — written on the stage */}
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What question would you put on stage?"
                rows={2}
                className="w-full bg-transparent border-0 px-0 py-0 text-white text-[20px] sm:text-[26px] md:text-[30px] placeholder:text-white/25 focus:outline-none resize-none leading-[1.4] tracking-[-0.01em] text-center"
                style={{ caretColor: "#FF5500" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); }
                }}
              />

              {/* Stage floor line — like the LED ring edge */}
              <div className="mt-3 sm:mt-5 h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent group-focus-within/input:via-mars/60 transition-all duration-700" />

              {/* Company + Play — on the stage */}
              <div className="flex items-center justify-center gap-4 sm:gap-5 mt-4 sm:mt-5">
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company name (optional)"
                  className="bg-transparent border-0 px-0 text-white/50 placeholder:text-white/25 focus:outline-none text-[13px] sm:text-[14px] text-center w-[200px]"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
                />
                <button
                  onClick={generate}
                  disabled={!question.trim()}
                  className={`shrink-0 px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-bold text-[13px] sm:text-[14px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    question.trim()
                      ? "bg-mars hover:bg-mars-light text-white shadow-[0_0_30px_rgba(255,85,0,0.3)] hover:shadow-[0_0_50px_rgba(255,85,0,0.4)]"
                      : "border border-white/[0.15] text-white/35 cursor-not-allowed backdrop-blur-sm"
                  }`}
                >
                  Play
                </button>
              </div>

              {/* Digital playmaker — subtle link, on the stage */}
              {!inlineDigital && (
                <div className="mt-4 sm:mt-6 text-center">
                  <button
                    onClick={() => {
                      const q = question.trim() || "What does my company need right now?";
                      setAskedQuestion(q);
                      if (!question.trim()) setQuestion(q);
                      setInlineDigital(true);
                      openDigital(q);
                      setTimeout(() => inlineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
                    }}
                    className="text-white/30 text-[11px] sm:text-[12px] hover:text-mars/60 transition-colors duration-300 inline-flex items-center gap-1.5"
                    style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
                  >
                    <span>or try the digital playmaker</span>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                  </button>
                </div>
              )}

            </div>
          </div>{/* end max-w-2xl */}

          {/* Playmaker card removed — integrated into the input box above */}

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
                  <button onClick={() => { setInlineDigital(false); setPlay(null); setPlayLoading(false); setSimLoading(false); setSimReady(false); setSimPhase("cast"); setSimEnded(false); }} className="text-white/70 text-[10px] uppercase tracking-[0.15em] hover:text-white/70 transition-colors">
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
                                Ask this question →
                              </button>
                            </div>
                          </div>
                        )}
                        <button onClick={() => { setSimEnded(false); setSimPhase("cast"); }} className="w-full py-3 rounded-xl border border-white/[0.10] text-white/60 text-[10px] uppercase tracking-[0.15em] font-bold hover:text-white/55 hover:border-white/[0.15] transition-all">
                          ← Back to cast
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {error && <p className="text-red-400/60 text-[12px] mt-4 text-center">{error}</p>}
              </div>
            </div>
          )}

          {/* ── BESTSELLING PLAYS — stage-inspired product cards ── */}
          {!submitted && (
            <div className="w-full max-w-3xl mx-auto mt-6 sm:mt-8 space-y-5">
              <div className="px-1 mb-1">
                <p className="text-mars/50 text-[10px] uppercase tracking-[0.4em]">Bestselling plays</p>
              </div>
              {[
                { theme: "Strategy", photo: "/luxury2.jpg", photoPos: "50% 30%", duration: "Half-day", people: "8–30", price: "from €2 900", pitch: "Where is your company really heading — and what's pulling it off course? Your team maps the forces on stage." },
                { theme: "Vision", photo: "/luxury4.jpg", photoPos: "50% 50%", duration: "Half-day", people: "8–30", price: "from €2 900", pitch: "What does your company look like in 5 years? Your team builds that future on stage — then watches what tries to destroy it." },
                { theme: "Creativity", photo: "/luxury1.jpg", photoPos: "50% 40%", duration: "Half-day", people: "8–25", price: "from €2 200", pitch: "The creative soul of your company. What feeds it, what starves it. Your team plays creativity vs. control." },
              ].map((play, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden bg-[#0d0d0d] transition-all duration-500" style={{
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 4px 30px rgba(0,0,0,0.3)",
                }}>
                  {/* Hover: red LED edge ring — like the circular stage in space5 */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" style={{
                    boxShadow: "0 0 0 1px rgba(255,85,0,0.2), 0 0 20px rgba(255,85,0,0.06), 0 0 50px rgba(255,85,0,0.03)",
                  }} />

                  {/* Photo — with stage lighting overlay */}
                  <div className="relative h-[180px] sm:h-[220px] overflow-hidden">
                    <img src={play.photo} alt="" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.02] group-hover:scale-100" style={{ objectPosition: play.photoPos }} />
                    {/* Dark gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-[#0d0d0d]/30" />
                    {/* Spotlight on hover — dramatic cone from top center */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 70% at 50% 0%, rgba(255,85,0,0.12) 0%, transparent 60%)" }} />
                    {/* Stage floor edge glow at bottom of photo */}
                    <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* Product details — the stage floor area */}
                  <div className="relative p-5 sm:p-6">
                    {/* Subtle stage floor radial glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,85,0,0.03) 0%, transparent 50%)" }} />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] leading-[1]">
                          <span className="text-white/90 group-hover:text-white transition-colors duration-500">{play.theme}</span>
                        </h4>
                        <p className="text-white/40 text-[13px] sm:text-[14px] font-bold tracking-tight shrink-0 pt-1">{play.price}</p>
                      </div>
                      {/* Specs row */}
                      <div className="flex items-center gap-3 text-white/30 text-[10px] uppercase tracking-[0.15em] mb-4">
                        <span>{play.duration}</span>
                        <span className="text-white/10">·</span>
                        <span>{play.people} people</span>
                        <span className="text-white/10">·</span>
                        <span>On stage or at your venue</span>
                      </div>
                      <p className="text-white/45 text-[13px] leading-[1.6] mb-5">{play.pitch}</p>
                      <a href="#contact" className="inline-block px-6 py-2.5 rounded-lg border border-mars/15 text-mars/60 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-mars/10 hover:text-mars hover:border-mars/30 hover:shadow-[0_0_15px_rgba(255,85,0,0.1)] transition-all duration-300">
                        Book this play
                      </a>
                    </div>
                  </div>

                  {/* Bottom edge glow — stage lip */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-mars/10 to-transparent group-hover:via-mars/25 transition-all duration-700" />
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
            <div className="text-center mb-8 sm:mb-10 pt-4 sm:pt-6">
              <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] mb-3">Your question</p>
              <p className="font-mercure italic text-white/70 text-[16px] sm:text-[20px] leading-[1.4]">&ldquo;{askedQuestion}&rdquo;</p>
              <button onClick={reset} className="text-white/25 text-[10px] uppercase tracking-[0.15em] mt-4 hover:text-mars/60 transition-colors">
                Ask something else
              </button>
            </div>

            {/* ═══ 3 PRODUCT OPTIONS — commercial menu ═══ */}
            {products.length > 0 && selectedIdx === null && (
              <div>
                <p className="text-mars/60 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] text-center mb-8 sm:mb-10">Choose your play</p>

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
                            : "border-white/[0.15] bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/[0.15] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]"
                        }`}
                      >
                        {/* Top accent line */}
                        <div className={`h-[2px] ${isLeader ? "bg-gradient-to-r from-mars/40 via-mars to-mars/40" : "bg-gradient-to-r from-transparent via-white/10 to-transparent"}`} />

                        <div className="p-5 sm:p-6 flex flex-col flex-1">
                          {/* Tag */}
                          <p className={`text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold mb-4 ${isLeader ? "text-mars/60" : "text-white/65"}`}>{p.tag}</p>

                          {/* Theme — full play name */}
                          <h3 className={`text-[28px] sm:text-[34px] font-black tracking-[-0.04em] leading-[0.95] mb-4 ${isLeader ? "" : ""}`}>
                            <span className={isLeader ? "text-mars" : "text-white/90"}>{p.theme}</span>
                            {" "}
                            <span className={isLeader ? "text-mars/70" : "text-white/55"}>on Mars</span>
                          </h3>

                          {/* Pitch */}
                          <p className="text-white/70 text-[13px] sm:text-[14px] leading-[1.55] mb-6 flex-1">
                            {p.pitch}
                          </p>

                          {/* Bottom stats bar */}
                          <div className={`border-t pt-4 mt-auto ${isLeader ? "border-mars/10" : "border-white/[0.12]"}`}>
                            <div className="flex items-end justify-between">
                              <div className="space-y-1">
                                <p className="text-white/60 text-[10px]">{p.duration} · {p.people}</p>
                              </div>
                              <p className={`text-[14px] sm:text-[15px] font-bold tracking-tight ${isLeader ? "text-mars/70" : "text-white/60"}`}>{p.price}</p>
                            </div>
                          </div>
                        </div>

                        {/* Hover arrow */}
                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg viewBox="0 0 24 24" className={`w-4 h-4 fill-current ${isLeader ? "text-mars/70" : "text-white/60"}`}><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ── DIGITAL PLAYMAKER — below product cards ── */}
                <div className="mt-8 sm:mt-10">
                  <button
                    onClick={() => {
                      setSelectedIdx(0);
                      openDigital();
                    }}
                    className="w-full group transition-all duration-500 hover:scale-[1.005]"
                  >
                    <div className="relative rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />

                      <div className="grid sm:grid-cols-2 items-center">
                        {/* Left — phone mockup */}
                        <div className="flex items-center justify-center py-8 sm:py-12">
                          <div className="group-hover:scale-105 transition-transform duration-700">
                            <svg width="80" height="150" viewBox="0 0 90 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[100px] sm:h-[188px] drop-shadow-[0_0_30px_rgba(255,85,0,0.08)] group-hover:drop-shadow-[0_0_40px_rgba(255,85,0,0.15)] transition-all duration-700">
                              <rect x="1" y="1" width="88" height="168" rx="18" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="#111" />
                              <rect x="1" y="1" width="88" height="168" rx="18" stroke="url(#phoneGlow3)" strokeWidth="1" className="opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                              <rect x="30" y="6" width="30" height="8" rx="4" fill="#0a0a0a" />
                              <rect x="5" y="5" width="80" height="160" rx="15" fill="#0a0a0a" />
                              <rect x="12" y="22" width="38" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
                              <rect x="12" y="28" width="22" height="2" rx="1" fill="rgba(255,85,0,0.3)" />
                              <circle cx="45" cy="68" r="24" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />
                              <circle cx="45" cy="68" r="17" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 2" />
                              <circle cx="45" cy="68" r="24" fill="url(#stageGlow3)" />
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
                                <radialGradient id="stageGlow3" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stopColor="rgba(255,85,0,0.06)" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                                <linearGradient id="phoneGlow3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,85,0,0.4)" /><stop offset="50%" stopColor="rgba(255,85,0,0.1)" /><stop offset="100%" stopColor="transparent" /></linearGradient>
                              </defs>
                            </svg>
                          </div>
                        </div>

                        {/* Right — copy */}
                        <div className="px-6 sm:px-8 pb-8 sm:py-12 text-left">
                          <p className="text-mars/60 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold mb-3">Digital Playmaker</p>
                          <h3 className="text-[20px] sm:text-[24px] font-black tracking-[-0.03em] leading-[1] mb-3 group-hover:text-white transition-colors">
                            Or try it right here.
                          </h3>
                          <p className="text-white/65 text-[13px] sm:text-[14px] leading-[1.6] mb-5 max-w-xs">
                            AI turns your question into a reality play with characters, a stage, and new perspectives. Takes 30 seconds.
                          </p>
                          <div className="inline-flex items-center gap-2 text-mars/70 text-[11px] font-bold uppercase tracking-[0.15em] group-hover:text-mars transition-colors">
                            <span>Open Playmaker</span>
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}


            {/* ═══ SELECTED PRODUCT — compact stage box ═══ */}
            {selectedIdx !== null && products[selectedIdx] && (
              <>
                {/* Back to options */}
                <div className="mb-4 sm:mb-6">
                  <button onClick={() => { setSelectedIdx(null); setPlay(null); setShowDigital(false); }} className="text-white/50 text-[13px] uppercase tracking-[0.15em] hover:text-white/70 transition-colors">
                    ← Back to all plays
                  </button>
                </div>

                {/* Play detail — stage box */}
                <div className="mb-6 sm:mb-8">
                  <div className="rounded-2xl border border-mars/[0.15] bg-mars/[0.03] overflow-hidden">
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-mars" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                        <p className="text-mars/70 text-[11px] sm:text-[12px] uppercase tracking-[0.3em] font-bold">{products[selectedIdx].tag}</p>
                      </div>

                      <h3 className="text-[24px] sm:text-[32px] font-black tracking-[-0.03em] leading-[1] mb-3">
                        {products[selectedIdx].theme}{" "}
                        <span className="text-mars">on Mars</span>
                      </h3>

                      <p className="text-white/65 text-[14px] sm:text-[15px] leading-[1.6] mb-6 max-w-lg">{products[selectedIdx].pitch}</p>

                      <div className="flex flex-wrap gap-6 mb-6 text-[13px]">
                        <div><span className="text-white/40">{products[selectedIdx].duration}</span></div>
                        <div><span className="text-white/40">{products[selectedIdx].people}</span></div>
                        <div><span className="text-white/40">{products[selectedIdx].price}</span></div>
                      </div>

                      <a href="#contact" className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-mars hover:text-mars-light transition-colors">
                        Book this play
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* ═══ DIGITAL SIMULATION ═══ */}
                <div className="relative mt-0">
                  {!showDigital ? (
                    <button
                      onClick={() => openDigital()}
                      className="w-full relative rounded-3xl border border-white/[0.12] bg-white/[0.05] hover:border-mars/[0.15] hover:bg-white/[0.06] transition-all duration-500 group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.03)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10 py-10 sm:py-14 px-8 sm:px-12 text-center">
                        <p className="text-white/70 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] mb-5">Or try it right here</p>

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

                        <p className="text-white/70 text-[18px] sm:text-[22px] md:text-[26px] font-bold tracking-[-0.02em] group-hover:text-white/70 transition-colors">
                          Simulate this play digitally
                        </p>
                        <p className="font-mercure text-white/70 text-[12px] sm:text-[14px] mt-3 group-hover:text-white/65 transition-colors">
                          AI-generated reality play you can walk through now
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 text-mars/60 text-[11px] font-bold uppercase tracking-[0.15em] group-hover:text-mars/70 transition-colors">
                          <span>Open Playmaker</span>
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /></svg>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="relative">
                      <div className="absolute -inset-4 sm:-inset-8 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.04)_0%,_transparent_70%)] pointer-events-none" />

                      {/* Header */}
                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-mars" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                          <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold">Digital Playmaker</p>
                        </div>
                        <button onClick={() => setShowDigital(false)} className="text-white/70 text-[10px] uppercase tracking-[0.15em] hover:text-white/70 transition-colors">
                          Close
                        </button>
                      </div>

                      {/* Loading state */}
                      {playLoading && (
                        <div className="rounded-3xl border border-white/[0.12] bg-white/[0.05] overflow-hidden">
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

                      {/* ── GAMING INTERFACE ── */}
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

                          {/* ── CAST PHASE ── */}
                          {simPhase === "cast" && (
                            <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                              <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />

                              {/* Play header */}
                              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
                                <h3 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">{play.name}</h3>
                                <p className="text-white/60 text-[11px] mt-1 font-mercure italic">{play.mood} · {play.characters.length} characters</p>
                              </div>

                              {/* Character cards */}
                              <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                                <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.25em] mb-4 font-bold">Characters on stage</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  {play.characters.map((char, i) => (
                                    <div
                                      key={i}
                                      className="rounded-xl bg-white/[0.05] border border-white/[0.10] p-4 hover:border-white/[0.15] transition-all"
                                      style={{ animation: `fadeIn 0.5s ease ${i * 0.1}s both` }}
                                    >
                                      <div className="flex items-center gap-2.5 mb-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mars/20 to-mars/5 flex items-center justify-center text-[11px] font-bold text-mars/60">
                                          {char.name.charAt(0)}
                                        </div>
                                        <p className="text-white/70 text-[13px] font-bold tracking-[-0.01em]">{char.name}</p>
                                      </div>
                                      <p className="text-white/65 text-[11px] leading-[1.5] font-mercure">{char.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Play suggestion / narrative setup */}
                              {play.image && (
                                <div className="mx-6 sm:mx-8 mb-6 sm:mb-8 rounded-xl bg-mars/[0.03] border border-mars/[0.06] p-4">
                                  <p className="text-mars/70 text-[9px] uppercase tracking-[0.25em] mb-2 font-bold">Opening image</p>
                                  <p className="text-white/55 text-[13px] leading-[1.6] font-mercure italic">{play.image}</p>
                                </div>
                              )}

                              {/* Start button */}
                              <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                                <button
                                  onClick={() => {
                                    if (simReady) {
                                      setSimPhase("stage");
                                    }
                                  }}
                                  disabled={!simReady}
                                  className={`w-full py-4 rounded-xl text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.15em] transition-all ${
                                    simReady
                                      ? "bg-mars/10 border border-mars/20 text-mars/80 hover:bg-mars/15 hover:border-mars/30 cursor-pointer"
                                      : "bg-white/[0.05] border border-white/[0.10] text-white/70 cursor-wait"
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

                          {/* ── STAGE PHASE ── */}
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

                          {/* ── PERSPECTIVES PHASE ── */}
                          {simPhase === "perspectives" && simEnded && (
                            <div className="space-y-4">
                              {/* Perspectives cards */}
                              {play.perspectives && play.perspectives.length > 0 && (
                                <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
                                  <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
                                  <div className="p-6 sm:p-8">
                                    <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.25em] mb-5 font-bold">Perspectives revealed</p>
                                    <div className="space-y-3">
                                      {play.perspectives.map((p, i) => {
                                        const perspective = typeof p === "object" ? (p as Perspective) : null;
                                        return (
                                          <div
                                            key={i}
                                            className="rounded-xl bg-white/[0.05] border border-white/[0.10] p-4 hover:border-white/[0.15] transition-all"
                                            style={{ animation: `fadeIn 0.6s ease ${i * 0.15}s both` }}
                                          >
                                            {perspective ? (
                                              <div className="flex gap-3">
                                                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-mars/20 to-mars/5 flex items-center justify-center text-[11px] font-bold text-mars/60 mt-0.5">
                                                  {perspective.character.charAt(0)}
                                                </div>
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

                              {/* Follow-up question */}
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
                                      Ask this question →
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Replay button */}
                              <button
                                onClick={() => { setSimEnded(false); setSimPhase("cast"); }}
                                className="w-full py-3 rounded-xl border border-white/[0.10] text-white/60 text-[10px] uppercase tracking-[0.15em] font-bold hover:text-white/55 hover:border-white/[0.15] transition-all"
                              >
                                ← Back to cast
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


      {/* ── SOCIAL PROOF — cinematic success block ── */}
      <FadeIn className="px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Background photo */}
            <img src="/luxury5.jpg" alt="" className="absolute inset-0 w-full h-full object-cover grayscale opacity-[0.15]" style={{ objectPosition: "50% 35%" }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a]/90" />
            <div className="absolute inset-0 border border-white/[0.08] rounded-2xl pointer-events-none" />

            <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-12">
              {/* Stats row */}
              <div className="flex items-center justify-center gap-8 sm:gap-14 mb-8 sm:mb-10">
                <div className="text-center">
                  <p className="text-[28px] sm:text-[36px] font-bold tracking-[-0.03em] text-white/90">800+</p>
                  <p className="text-white/30 text-[9px] uppercase tracking-[0.2em] mt-1">Reality plays</p>
                </div>
                <div className="w-px h-10 bg-white/[0.08]" />
                <div className="text-center">
                  <p className="text-[28px] sm:text-[36px] font-bold tracking-[-0.03em] text-white/90">4</p>
                  <p className="text-white/30 text-[9px] uppercase tracking-[0.2em] mt-1">Countries</p>
                </div>
                <div className="w-px h-10 bg-white/[0.08]" />
                <div className="text-center">
                  <p className="text-[28px] sm:text-[36px] font-bold tracking-[-0.03em] text-white/90">2020</p>
                  <p className="text-white/30 text-[9px] uppercase tracking-[0.2em] mt-1">Founded</p>
                </div>
              </div>

              {/* Voices quote */}
              <div className="mb-8 sm:mb-10">
                <Voices />
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent mb-6 sm:mb-8" />

              {/* Trusted by — refined text list */}
              <p className="text-white/25 text-[9px] uppercase tracking-[0.3em] text-center mb-4">Trusted by</p>
              <p className="text-white/40 text-[13px] sm:text-[14px] leading-[2.2] tracking-wide text-center max-w-xl mx-auto">
                Forbes{" "}<span className="text-white/10 mx-1">·</span>{" "}
                Škoda{" "}<span className="text-white/10 mx-1">·</span>{" "}
                YPO{" "}<span className="text-white/10 mx-1">·</span>{" "}
                PwC{" "}<span className="text-white/10 mx-1">·</span>{" "}
                O₂{" "}<span className="text-white/10 mx-1">·</span>{" "}
                UniCredit{" "}<span className="text-white/10 mx-1">·</span>{" "}
                Oktagon MMA{" "}<span className="text-white/10 mx-1">·</span>{" "}
                House of Lobkowicz{" "}<span className="text-white/10 mx-1">·</span>{" "}
                London Business School{" "}<span className="text-white/10 mx-1">·</span>{" "}
                Česká spořitelna{" "}<span className="text-white/10 mx-1">·</span>{" "}
                Lasvit{" "}<span className="text-white/10 mx-1">·</span>{" "}
                Ipsen{" "}<span className="text-white/10 mx-1">·</span>{" "}
                MSD
              </p>
              <p className="text-white/15 text-[10px] text-center mt-4 font-mercure italic">
                London · Zurich · Bucharest · Prague
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

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
            <div className="px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-mars/60 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold mb-1.5">The stage</p>
                <p className="text-white/90 text-[16px] sm:text-[20px] font-bold tracking-[-0.02em]">Národní 138/10, Praha</p>
                <p className="text-white/65 text-[13px] sm:text-[14px] mt-0.5">The flagship space. Where reality plays happen.</p>
              </div>
              <a href="/space" className="shrink-0 text-mars/70 text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.15em] hover:text-mars transition-colors">
                Explore →
              </a>
            </div>
          </div>
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
                <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold">The crew</p>
                <p className="font-mercure text-white/55 text-[13px] sm:text-[14px] leading-[1.7]">
                  Born during COVID. Systemic constellations meets theatre meets improvisation.
                </p>
                <p className="font-mercure text-white/55 text-[13px] sm:text-[14px] leading-[1.7]">
                  In 2023, David Vais joined. Platform built. Stage opened. Brand born.
                </p>
                <div className="pt-2">
                  <p className="text-white/70 text-[13px] sm:text-[14px] font-bold">
                    800+ reality plays. London, Zurich, Bucharest.
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


      {/* ── CONTACT — Stage box ── */}
      <FadeIn className="px-4 pt-3 sm:pt-4 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto">
          <div id="contact" className="relative rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/20 to-transparent" />

            <div className="p-6 sm:p-10">
              <div className="max-w-md mx-auto space-y-8">
                <div className="text-center">
                  <p className="text-mars/70 text-[13px] sm:text-[14px] uppercase tracking-[0.3em] font-bold mb-4">Get on stage</p>
                  <h2 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.03em]">
                    {submitted ? "Let\u2019s make it happen." : "What\u2019s your question?"}
                  </h2>
                  <p className="font-mercure text-white/60 text-[13px] sm:text-[14px] mt-2">We reply within 24 hours.</p>
                </div>

                {sent ? (
                  <div className="text-center py-8">
                    <p className="font-mercure text-white/60 text-[14px]">Thank you. We&apos;ll be in touch.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-2.5">
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <input name="name" value={formData.name} onChange={handleContactChange} placeholder="Name" required className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/[0.12] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/70 focus:outline-none transition-colors" />
                      <input name="company" value={formData.company} onChange={handleContactChange} placeholder="Company" className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/[0.12] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/70 focus:outline-none transition-colors" />
                    </div>
                    <input name="email" type="email" value={formData.email} onChange={handleContactChange} placeholder="Email" required className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/[0.12] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/70 focus:outline-none transition-colors" />
                    <textarea name="question" value={formData.question || askedQuestion} onChange={handleContactChange} placeholder="Your question" rows={3} className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/[0.12] focus:border-mars/25 px-4 py-3 text-[13px] text-[#EDEDED] placeholder:text-white/70 focus:outline-none transition-colors resize-none" />
                    <button type="submit" className="w-full py-3.5 rounded-xl bg-mars hover:bg-mars-light text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all shadow-[0_4px_20px_-4px_rgba(255,85,0,0.3)]">
                      Let&apos;s Talk
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
