"use client";

import { useState, useEffect } from "react";

const TESTIMONIALS = [
  {
    name: "Vik Maraj",
    company: "Unstoppable Conversations",
    quote: "Absolutely genius. The fastest way to break through corporate thinking.",
  },
  {
    name: "Radka Dohnalová",
    company: "ATAIRU",
    quote: "The power of this format lies in its ability to shift perspectives. It lets people break free from ingrained patterns of thinking. The result is incredible.",
  },
  {
    name: "Raul Rodriguez",
    company: "Dajana Rodriguez",
    quote: "You drop the titles, the ego, the learned masks and go deep. For me it was a moment that gave me completely new thoughts and a view on things I hadn't seen before.",
  },
];


function PhoneAnimation() {
  const [step, setStep] = useState(0); // 0=question, 1=generating, 2=play card, 3=stage
  const [typedText, setTypedText] = useState("");
  const question = "Why does our team avoid hard conversations?";

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (step === 0) {
      // Typing animation
      let i = 0;
      const type = () => {
        if (i <= question.length) {
          setTypedText(question.slice(0, i));
          i++;
          timeout = setTimeout(type, 45);
        } else {
          timeout = setTimeout(() => setStep(1), 800);
        }
      };
      timeout = setTimeout(type, 1200);
    } else if (step === 1) {
      timeout = setTimeout(() => setStep(2), 2000);
    } else if (step === 2) {
      timeout = setTimeout(() => setStep(3), 3500);
    } else if (step === 3) {
      timeout = setTimeout(() => { setStep(0); setTypedText(""); }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <div className="absolute inset-[3px] rounded-[45px] overflow-hidden bg-[#0a0a0a]" style={{ scrollbarWidth: 'none' }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-7 pt-[14px] text-[9px] text-white/50 font-medium">
        <span>9:41</span>
        <svg viewBox="0 0 16 12" className="w-3.5 h-2.5 fill-white/50"><path d="M1 4h2v8H1zM5 2h2v10H5zM9 0h2v12H9zM13 3h2v9h-2z"/></svg>
      </div>
      <div className="px-5 pt-4 pb-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/25 text-center">The Playmaker</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 px-4 pb-4">
        {["Question", "Generate", "Play", "Stage"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-mars' : 'bg-white/10'}`} />
            <span className={`text-[6px] uppercase tracking-widest transition-all duration-500 ${i <= step ? 'text-mars/70' : 'text-white/15'}`}>{label}</span>
            {i < 3 && <div className={`w-4 h-[0.5px] transition-all duration-500 ${i < step ? 'bg-mars/30' : 'bg-white/5'}`} />}
          </div>
        ))}
      </div>

      <div className="px-4 relative overflow-hidden" style={{ height: 'calc(100% - 100px)' }}>
        {/* STEP 0: Question input */}
        <div className={`absolute inset-x-4 transition-all duration-700 ${step === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
          <div className="space-y-4 pt-4">
            <div>
              <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-mars/40 mb-2">Your question</p>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 min-h-[80px]">
                <p className="text-[10px] text-white/80 leading-[16px]">{typedText}<span className="animate-pulse text-mars">|</span></p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/20 mb-2">Context</p>
                <div className="flex gap-1.5">
                  <div className="px-3 py-1.5 rounded-lg bg-mars/10 border border-mars/20 text-[7px] font-bold text-mars/60">Business</div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-[7px] font-bold text-white/25">Personal</div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/20 mb-2">For whom</p>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <p className="text-[8px] text-white/50">My leadership team</p>
                </div>
              </div>
            </div>
            <div className={`bg-mars rounded-xl py-2.5 text-center transition-all duration-300 ${typedText.length > 20 ? 'opacity-100' : 'opacity-40'}`}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Generate Play</p>
            </div>
            <div className="pt-2">
              <p className="text-[6px] font-bold uppercase tracking-[0.2em] text-white/15 mb-2">Try asking</p>
              <div className="space-y-1.5">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <p className="text-[8px] text-white/30 leading-[12px]">&ldquo;Why do we keep losing our best people?&rdquo;</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <p className="text-[8px] text-white/30 leading-[12px]">&ldquo;What&apos;s blocking our growth?&rdquo;</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <p className="text-[8px] text-white/30 leading-[12px]">&ldquo;How do we rebuild trust after the restructuring?&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 1: Generating animation */}
        <div className={`absolute inset-x-4 inset-y-0 flex flex-col items-center justify-center transition-all duration-700 ${step === 1 ? 'opacity-100 translate-y-0' : step < 1 ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border border-mars/20 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-2 rounded-full border border-mars/30 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
              <div className="absolute inset-4 rounded-full bg-mars/20 animate-pulse" />
              <div className="absolute inset-[26px] rounded-full bg-mars/60" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-[11px] font-bold text-white/70">Creating your play...</p>
              <p className="text-[8px] text-white/30 font-mercure italic">Analyzing dynamics, casting characters</p>
            </div>
            <div className="w-40 h-[2px] bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-mars/50 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            <div className="pt-4 space-y-2 text-center">
              <p className="text-[7px] text-white/20 uppercase tracking-[0.15em]">Reading your question</p>
              <p className="text-[7px] text-white/15 uppercase tracking-[0.15em]">Designing the image</p>
              <p className="text-[7px] text-white/10 uppercase tracking-[0.15em]">Casting characters</p>
              <p className="text-[7px] text-white/5 uppercase tracking-[0.15em]">Setting the stage</p>
            </div>
          </div>
        </div>

        {/* STEP 2: Play Card reveal */}
        <div className={`absolute inset-x-4 transition-all duration-700 ${step === 2 ? 'opacity-100 translate-y-0' : step < 2 ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
          <div className="space-y-2.5 pt-1">
            <div>
              <h3 className="text-[14px] font-bold text-white leading-tight">The Elephant in the Room</h3>
              <div className="flex items-center gap-2 mt-1 text-[7px] text-white/30">
                <span className="font-mercure italic text-mars/50">tension &amp; truth</span>
                <span className="text-white/10">|</span>
                <span>30 min</span>
                <span className="text-white/10">|</span>
                <span>4–6 players</span>
              </div>
            </div>
            <div>
              <p className="text-[6.5px] font-bold uppercase tracking-[0.2em] text-mars/50 mb-1">The Image</p>
              <p className="text-[8.5px] text-white/45 leading-[13px] font-mercure">A boardroom. Everyone sees it — the massive shape in the center — but they navigate around it. The chairs are arranged to avoid it.</p>
            </div>
            <div>
              <p className="text-[6.5px] font-bold uppercase tracking-[0.2em] text-mars/50 mb-1.5">Characters</p>
              <div className="grid grid-cols-2 gap-1">
                <div className="rounded-lg border border-mars/20 bg-mars/[0.06] px-2 py-1.5">
                  <p className="text-[8px] font-bold text-[#ffb380]">The Peacekeeper</p>
                  <p className="text-[5px] uppercase tracking-widest text-mars/30 mt-0.5">concrete</p>
                </div>
                <div className="rounded-lg border border-mars/20 bg-mars/[0.06] px-2 py-1.5">
                  <p className="text-[8px] font-bold text-[#ffb380]">The Truth-Teller</p>
                  <p className="text-[5px] uppercase tracking-widest text-mars/30 mt-0.5">concrete</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1.5">
                  <p className="text-[8px] font-mercure italic text-white/55">Comfort</p>
                  <p className="text-[5px] uppercase tracking-widest text-white/20 mt-0.5">abstract</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1.5">
                  <p className="text-[8px] font-mercure italic text-white/55">The Unspoken</p>
                  <p className="text-[5px] uppercase tracking-widest text-white/20 mt-0.5">abstract</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[6.5px] font-bold uppercase tracking-[0.2em] text-green-400/50 mb-1">Your Role</p>
              <p className="text-[8.5px] text-white/45 leading-[13px]">You sit behind Peacekeeper. When Comfort starts to speak, you choose: silence or interruption.</p>
            </div>
            <div>
              <p className="text-[6.5px] font-bold uppercase tracking-[0.2em] text-purple-400/50 mb-1">Perspective</p>
              <p className="text-[8.5px] text-white/45 leading-[13px]">Avoidance isn&apos;t peace — it&apos;s a slower kind of conflict.</p>
            </div>
            {/* Mini stage preview */}
            <div className="rounded-lg border border-white/[0.06] bg-[#060606] overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: '5/3' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(255,85,0,0.04) 0%, transparent 70%)' }} />
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
                  <circle cx="50" cy="30" r="24" fill="none" stroke="rgba(255,85,0,0.1)" strokeWidth="0.4" />
                  <circle cx="30" cy="26" r="1.5" fill="rgba(255,85,0,0.7)" />
                  <text x="30" y="33" textAnchor="middle" fill="rgba(255,85,0,0.4)" fontSize="2.2">Peacekeeper</text>
                  <circle cx="70" cy="26" r="1.5" fill="rgba(255,85,0,0.7)" />
                  <text x="70" y="33" textAnchor="middle" fill="rgba(255,85,0,0.4)" fontSize="2.2">Truth-Teller</text>
                  <circle cx="50" cy="16" r="1" fill="rgba(220,220,220,0.4)" />
                  <text x="50" y="13" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="2.2" fontStyle="italic">Comfort</text>
                  <circle cx="50" cy="44" r="1" fill="rgba(220,220,220,0.4)" />
                  <text x="50" y="49" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="2" fontStyle="italic">The Unspoken</text>
                  <circle cx="50" cy="30" r="1.5" fill="rgba(255,220,50,0.7)" />
                  <text x="50" y="37" textAnchor="middle" fill="rgba(255,220,50,0.4)" fontSize="2.2" fontWeight="700">You</text>
                </svg>
              </div>
            </div>
            {/* Action buttons */}
            <div className="bg-mars rounded-xl py-2 text-center shadow-[0_4px_20px_-2px_rgba(255,85,0,0.3)]">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Enter Stage</p>
            </div>
            <div className="flex gap-1.5">
              <div className="flex-1 border border-white/[0.08] bg-white/[0.03] rounded-lg py-1.5 text-center">
                <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-white/40">Experience It Live</p>
              </div>
              <div className="flex-1 border border-white/[0.08] bg-white/[0.03] rounded-lg py-1.5 text-center">
                <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-white/40">Share</p>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3: Stage simulation — full screen */}
        <div className={`absolute inset-0 transition-all duration-700 ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-[#060606]">
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(255,85,0,0.05) 0%, transparent 70%)'
            }} />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="ip-glow-s" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="1.5" />
                </filter>
              </defs>
              <circle cx="50" cy="55" r="32" fill="none" stroke="rgba(255,85,0,0.10)" strokeWidth="0.3" />
              <circle cx="50" cy="55" r="22" fill="none" stroke="rgba(255,85,0,0.05)" strokeWidth="0.2" />
              <line x1="28" y1="47" x2="50" y2="37" stroke="rgba(255,200,100,0.08)" strokeWidth="0.3" strokeDasharray="1 0.8" />
              <line x1="72" y1="47" x2="50" y2="37" stroke="rgba(255,200,100,0.08)" strokeWidth="0.3" strokeDasharray="1 0.8" />
              <line x1="28" y1="47" x2="50" y2="55" stroke="rgba(255,200,100,0.06)" strokeWidth="0.3" strokeDasharray="1 0.8" />
              <line x1="72" y1="47" x2="50" y2="55" stroke="rgba(255,200,100,0.06)" strokeWidth="0.3" strokeDasharray="1 0.8" />
              <line x1="28" y1="47" x2="50" y2="73" stroke="rgba(255,200,100,0.05)" strokeWidth="0.3" strokeDasharray="1 0.8" />
              <line x1="72" y1="47" x2="50" y2="73" stroke="rgba(255,200,100,0.05)" strokeWidth="0.3" strokeDasharray="1 0.8" />
              {/* Peacekeeper */}
              <circle cx="28" cy="47" r="3" fill="rgba(255,85,0,0.06)" filter="url(#ip-glow-s)" />
              <circle cx="28" cy="47" r="2" fill="rgba(255,85,0,0.15)" stroke="rgba(255,85,0,0.2)" strokeWidth="0.3" />
              <circle cx="28" cy="47" r="1" fill="rgba(255,85,0,0.85)" />
              <text x="28" y="54" textAnchor="middle" fill="rgba(255,85,0,0.55)" fontSize="2.5" fontWeight="700">Peacekeeper</text>
              {/* Truth-Teller */}
              <circle cx="72" cy="47" r="3" fill="rgba(255,85,0,0.06)" filter="url(#ip-glow-s)" />
              <circle cx="72" cy="47" r="2" fill="rgba(255,85,0,0.15)" stroke="rgba(255,85,0,0.2)" strokeWidth="0.3" />
              <circle cx="72" cy="47" r="1" fill="rgba(255,85,0,0.85)" />
              <text x="72" y="54" textAnchor="middle" fill="rgba(255,85,0,0.55)" fontSize="2.5" fontWeight="700">Truth-Teller</text>
              {/* Comfort */}
              <circle cx="50" cy="37" r="2.5" fill="rgba(200,200,200,0.05)" stroke="rgba(200,200,200,0.1)" strokeWidth="0.3" />
              <circle cx="50" cy="37" r="1.2" fill="rgba(180,180,180,0.12)" />
              <circle cx="50" cy="37" r="0.6" fill="rgba(220,220,220,0.5)" />
              <text x="50" y="33" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="2.8" fontStyle="italic">Comfort</text>
              {/* The Unspoken */}
              <circle cx="50" cy="73" r="2.5" fill="rgba(200,200,200,0.05)" stroke="rgba(200,200,200,0.1)" strokeWidth="0.3" />
              <circle cx="50" cy="73" r="1.2" fill="rgba(180,180,180,0.12)" />
              <circle cx="50" cy="73" r="0.6" fill="rgba(220,220,220,0.5)" />
              <text x="50" y="79" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="2.3" fontStyle="italic">The Unspoken</text>
              {/* You */}
              <circle cx="50" cy="55" r="3" fill="rgba(255,220,50,0.06)" filter="url(#ip-glow-s)" />
              <circle cx="50" cy="55" r="2" fill="rgba(255,220,50,0.12)" stroke="rgba(255,220,50,0.15)" strokeWidth="0.3" />
              <circle cx="50" cy="55" r="1" fill="rgba(255,220,50,0.8)" />
              <text x="50" y="62" textAnchor="middle" fill="rgba(255,220,50,0.5)" fontSize="2.8" fontWeight="700">You</text>
            </svg>
            {/* Narration overlay at top */}
            <div className="absolute top-0 left-0 right-0 pt-[44px] px-5 pb-3 bg-gradient-to-b from-[#060606] via-[#060606]/80 to-transparent">
              <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-mars/40 mb-1.5 text-center">Stage Simulation</p>
              <p className="text-[8px] text-white/40 text-center font-mercure italic leading-[12px]">Peacekeeper shifts toward center. The Unspoken retreats.</p>
            </div>
            {/* Bottom controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-[28px] pt-6 bg-gradient-to-t from-[#060606] via-[#060606]/80 to-transparent">
              <div className="space-y-1.5">
                <div className="bg-mars rounded-xl py-2.5 text-center shadow-[0_4px_20px_-2px_rgba(255,85,0,0.3)]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Play Simulation</p>
                </div>
                <div className="flex gap-1.5">
                  <div className="flex-1 border border-white/[0.08] bg-white/[0.03] rounded-lg py-2 text-center">
                    <p className="text-[7.5px] font-bold uppercase tracking-[0.1em] text-white/40">Experience It Live</p>
                  </div>
                  <div className="flex-1 border border-white/[0.08] bg-white/[0.03] rounded-lg py-2 text-center">
                    <p className="text-[7.5px] font-bold uppercase tracking-[0.1em] text-white/40">Share</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BusinessPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", question: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Mars inquiry from ${formData.name} @ ${formData.company}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\n\nQuestion:\n${formData.question}`);
    window.open(`mailto:play@stageonmars.com?subject=${subject}&body=${body}`);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] overflow-x-hidden">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <img src="/logo.png" alt="Stage On Mars" className="h-7 sm:h-14 w-auto invert" />
          <a
            href="#contact"
            className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] text-[#0a0a0a] bg-mars hover:bg-mars-light px-5 sm:px-9 py-2 sm:py-2.5 rounded-full transition-all"
          >
            Book a Play
          </a>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          HERO — cinematic full-screen
      ═══════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 relative overflow-hidden">
        {/* Background image with cinematic treatment */}
        <img src="/space2.png" alt="" className="absolute inset-0 w-full h-full object-cover scale-105" style={{ filter: 'brightness(0.45) contrast(1.15) saturate(1.3)' }} />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_42%,_rgba(255,85,0,0.10)_0%,_transparent_70%)]" />
        {/* Strong vignette for text pop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_45%,_transparent_30%,_rgba(0,0,0,0.65)_100%)]" />

        <div className="relative z-10 max-w-5xl flex flex-col items-center">
          {/* Headline — massive, cinematic */}
          <p className="text-mars/60 text-[10px] sm:text-sm font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-4 sm:mb-6" style={{ textShadow: '0 1px 20px rgba(0,0,0,0.6)' }}>The Reality Play Platform</p>
          <h1 className="text-[38px] sm:text-[80px] md:text-[112px] lg:text-[128px] font-bold leading-[0.88] tracking-[-0.04em] sm:tracking-[-0.05em]" style={{ textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}>
            Play to see
            <br />
            <span className="text-mars" style={{ textShadow: '0 0 60px rgba(255,85,0,0.35), 0 0 120px rgba(255,85,0,0.15), 0 2px 40px rgba(0,0,0,0.5)' }}>beyond reality.</span>
          </h1>

          {/* Subline with breathing room */}
          <p className="font-mercure text-[#EDEDED]/50 text-[15px] sm:text-[22px] leading-[22px] sm:leading-[32px] max-w-[280px] sm:max-w-lg mx-auto mt-5 sm:mt-10" style={{ textShadow: '0 1px 20px rgba(0,0,0,0.6)' }}>
            Your leadership team plays out the real dynamics on stage. You see what no report can show you.
          </p>

          {/* Credibility line */}
          <div className="mt-6 sm:mt-10 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[13px] text-white/30 font-bold uppercase tracking-[0.15em]" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
            <span>800+ plays created</span>
            <span className="text-mars/40">&middot;</span>
            <span>London</span>
            <span className="text-mars/40">&middot;</span>
            <span>Zurich</span>
            <span className="text-mars/40">&middot;</span>
            <span>Bucharest</span>
          </div>

          {/* Minimal text links */}
          <div className="mt-6 sm:mt-12 flex items-center gap-2 sm:gap-4">
            <a href="#experience" className="whitespace-nowrap text-[9px] sm:text-[13px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.1em] text-white/70 hover:text-white border border-white/15 hover:border-white/30 px-3 sm:px-7 py-2 sm:py-2.5 rounded-full transition-all duration-300 hover:bg-white/[0.05]">
              Live Play
            </a>
            <a href="#playmaker" className="whitespace-nowrap text-[9px] sm:text-[13px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.1em] text-white border border-mars/40 hover:border-mars bg-mars/10 hover:bg-mars/20 px-3 sm:px-7 py-2 sm:py-2.5 rounded-full transition-all duration-300">
              Digital Play
            </a>
            <a href="#space" className="whitespace-nowrap text-[9px] sm:text-[13px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.1em] text-white/70 hover:text-white border border-white/15 hover:border-white/30 px-3 sm:px-7 py-2 sm:py-2.5 rounded-full transition-all duration-300 hover:bg-white/[0.05]">
              The Playspace
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          CHAPTER 1: THE EXPERIENCE — compact
      ═══════════════════════════════════════════════════════════════ */}

      {/* Chapter photo + steps overlay */}
      <section id="experience" className="relative overflow-hidden">
        <img src="/exp.jpg" alt="Stage on Mars — live experience" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/75 to-[#0a0a0a]/90" />
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-20 sm:pt-40 pb-12 sm:pb-24">
          <p className="text-mars text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-3 sm:mb-4">01 — Live Reality Play</p>
          <h2 className="text-[32px] sm:text-[72px] md:text-[96px] font-bold leading-[0.88] tracking-[-0.04em] mb-3 sm:mb-4">
            Play it. See it.
          </h2>
          <p className="font-mercure text-[#EDEDED]/50 text-[14px] sm:text-[22px] mb-10 sm:mb-20 max-w-[280px] sm:max-w-none">
            Your question becomes a reality play on stage. What&apos;s invisible becomes obvious.
          </p>

          {/* 3 steps — inside the photo */}
          <div className="grid grid-cols-3 gap-4 sm:gap-12 text-center max-w-4xl mx-auto">
            <div className="space-y-2 sm:space-y-3">
              <p className="text-mars/40 text-[28px] sm:text-[56px] font-bold leading-none">1</p>
              <h3 className="text-[13px] sm:text-[22px] font-bold tracking-[-0.02em]">Bring a real question</h3>
              <p className="font-mercure text-[#EDEDED]/40 text-[11px] sm:text-[14px] leading-[16px] sm:leading-[20px]">Something no meeting resolves. Something that shapes what happens next.</p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <p className="text-mars/40 text-[28px] sm:text-[56px] font-bold leading-none">2</p>
              <h3 className="text-[13px] sm:text-[22px] font-bold tracking-[-0.02em]">Play it into reality</h3>
              <p className="font-mercure text-[#EDEDED]/40 text-[11px] sm:text-[14px] leading-[16px] sm:leading-[20px]">Step into roles. Play the situation out on stage. What&apos;s hidden becomes visible.</p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <p className="text-mars/40 text-[28px] sm:text-[56px] font-bold leading-none">3</p>
              <h3 className="text-[13px] sm:text-[22px] font-bold tracking-[-0.02em]">See beyond</h3>
              <p className="font-mercure text-[#EDEDED]/40 text-[11px] sm:text-[14px] leading-[16px] sm:leading-[20px]">You see what&apos;s really driving it — beyond the current reality. And what needs to shift.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-14 sm:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-[26px] sm:text-[52px] font-bold text-center mb-3 sm:mb-6 tracking-[-0.03em] leading-[0.94]">Bestselling Plays</h3>
          <p className="font-mercure text-[#EDEDED]/40 text-center text-[13px] sm:text-[20px] mb-10 sm:mb-28">Each one starts with a question. Each one ends beyond where you started.</p>

          <div className="space-y-6 sm:space-y-8">
            {/* Strategy — the main one */}
            <div className="group relative rounded-2xl border border-white/[0.06] hover:border-mars/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,85,0,0.06)_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 grid md:grid-cols-2 gap-5 md:gap-16 p-5 sm:p-12 items-center">
                <div>
                  <div className="w-6 sm:w-8 h-[2px] bg-mars/50 mb-4 sm:mb-6" />
                  <h3 className="text-[28px] sm:text-[56px] font-bold leading-[0.92] tracking-[-0.04em]">Strategy<br />on Mars</h3>
                  <div className="mt-3 sm:mt-6 flex items-center gap-3 sm:gap-5 text-white/30 text-[11px] sm:text-sm">
                    <span>4 hours</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>up to 20 people</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>from 75 000 CZK</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/55 text-[14px] sm:text-[17px] leading-[22px] sm:leading-[28px]">
                    A reality play that cuts through the noise. Your leadership team plays out the real dynamics — not the ones in the report. You see what&apos;s actually driving decisions.
                  </p>
                  <a href="#contact" className="mt-5 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 text-mars hover:text-white text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] group/link transition-colors duration-300">
                    I&apos;ll take my team
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover/link:translate-x-1.5 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Creativity */}
            <div className="group relative rounded-2xl border border-white/[0.06] hover:border-mars/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,85,0,0.06)_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 grid md:grid-cols-2 gap-5 md:gap-16 p-5 sm:p-12 items-center">
                <div>
                  <div className="w-6 sm:w-8 h-[2px] bg-mars/50 mb-4 sm:mb-6" />
                  <h3 className="text-[28px] sm:text-[56px] font-bold leading-[0.92] tracking-[-0.04em]">Creativity<br />on Mars</h3>
                  <div className="mt-3 sm:mt-6 flex items-center gap-3 sm:gap-5 text-white/30 text-[11px] sm:text-sm">
                    <span>3 hours</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>up to 30 people</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>from 55 000 CZK</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/55 text-[14px] sm:text-[17px] leading-[22px] sm:leading-[28px]">
                    A reality play that unlocks your team&apos;s creative potential. Everyone plays, everyone creates — no hierarchy, no limits. What&apos;s stuck starts moving.
                  </p>
                  <a href="#contact" className="mt-5 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 text-mars hover:text-white text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] group/link transition-colors duration-300">
                    I&apos;ll take my team
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover/link:translate-x-1.5 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Leaders */}
            <div className="group relative rounded-2xl border border-white/[0.06] hover:border-mars/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,85,0,0.06)_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 grid md:grid-cols-2 gap-5 md:gap-16 p-5 sm:p-12 items-center">
                <div>
                  <div className="w-6 sm:w-8 h-[2px] bg-mars/50 mb-4 sm:mb-6" />
                  <h3 className="text-[28px] sm:text-[56px] font-bold leading-[0.92] tracking-[-0.04em]">Leaders<br />on Mars</h3>
                  <div className="mt-3 sm:mt-6 flex items-center gap-3 sm:gap-5 text-white/30 text-[11px] sm:text-sm">
                    <span>3 hours</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>up to 12 people</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>1 900 CZK / person</span>
                  </div>
                </div>
                <div>
                  <p className="font-mercure italic text-white/35 text-[13px] sm:text-[15px] mb-2 sm:mb-3">Not a team. Just you.</p>
                  <p className="text-white/55 text-[14px] sm:text-[17px] leading-[22px] sm:leading-[28px]">
                    Bring your own question. Play it out with people who lead people. A reality play for individuals ready to see beyond their current perspective.
                  </p>
                  <a href="#contact" className="mt-5 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 text-mars hover:text-white text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] group/link transition-colors duration-300">
                    I&apos;m coming
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover/link:translate-x-1.5 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                  </a>
                </div>
              </div>
            </div>
            {/* Tailor-Made — the premium option */}
            <div className="group relative rounded-2xl border border-mars/20 hover:border-mars/40 bg-gradient-to-br from-mars/[0.06] via-mars/[0.03] to-transparent hover:from-mars/[0.10] hover:via-mars/[0.05] transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.08)_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 grid md:grid-cols-2 gap-5 md:gap-16 p-5 sm:p-12 items-center">
                <div>
                  <div className="w-6 sm:w-8 h-[2px] bg-mars mb-4 sm:mb-6" />
                  <h3 className="text-[28px] sm:text-[56px] font-bold leading-[0.92] tracking-[-0.04em]">Tailor-Made<br />Experience</h3>
                  <div className="mt-3 sm:mt-6 flex items-center gap-3 sm:gap-5 text-white/30 text-[11px] sm:text-sm">
                    <span>Custom format</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>Your team, your rules</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>On request</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/55 text-[14px] sm:text-[17px] leading-[22px] sm:leading-[28px]">
                    Your question is unique. So is the play. We design a bespoke reality play for your organization — custom format, custom duration, anywhere in the world. For leadership teams that need more than an off-the-shelf experience.
                  </p>
                  <a href="#contact" className="mt-5 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 text-mars hover:text-white text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] group/link transition-colors duration-300">
                    Design your play
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover/link:translate-x-1.5 transition-transform duration-300"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="py-12 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[22px] sm:text-[48px] font-bold text-center mb-8 sm:mb-16 leading-[0.94] tracking-[-0.03em]">WHO&apos;S PLAYED THEIR REALITY?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
            {[
              { tag: "700 years of tradition", name: "House of Lobkowicz", quote: "The experience opens new perspectives. It either confirms what you believe, or shows you a different reality.", author: "Alexandra Lobkowicz" },
              { tag: "Expansion to 3 countries", name: "Direct Group", quote: "Partly thanks to dreaming on Mars, Direct Group is flying forward today.", author: "Pavel Řehák" },
              { tag: "Face Your Fear", name: "Oktagon MMA", quote: "Brilliant and healing for the company and our people.", author: "Ondřej Novotný" },
            ].map((cs) => (
              <div key={cs.name} className="space-y-4">
                <p className="text-mars/40 text-[10px] font-bold uppercase tracking-[0.2em]">{cs.tag}</p>
                <h4 className="text-[22px] sm:text-[26px] font-bold tracking-[-0.025em]">{cs.name}</h4>
                <p className="font-mercure italic text-[#EDEDED]/40 text-[16px] leading-[24px]">&ldquo;{cs.quote}&rdquo;</p>
                <p className="text-mars/50 text-[12px] font-bold">&mdash; {cs.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client logos */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 border-t border-b border-white/[0.06]">
        <p className="text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-white/20 mb-6 sm:mb-10">Trusted by leaders at</p>
        <div className="max-w-4xl mx-auto">
          <img src="/clients.png" alt="Clients" className="w-full invert opacity-50 mix-blend-screen" />
        </div>
      </section>

      {/* Testimonials — on fotka5 */}
      <section className="relative overflow-hidden py-14 sm:py-36 px-4 sm:px-6">
        <img src="/fotka5.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a0a0a]/70" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-mars/50 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-8 sm:mb-20 text-center">What they say about us</p>
          <div className="space-y-8 sm:space-y-16">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`${i % 2 === 0 ? 'sm:pr-24' : 'sm:pl-24'}`}>
                <p className="font-mercure italic text-white/85 text-[15px] sm:text-[22px] leading-[1.5] tracking-[-0.3px] mb-3 sm:mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-mars/50" />
                  <p className="text-white/90 font-bold text-sm">{t.name}</p>
                  <p className="font-mercure text-white/50 text-sm">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          CHAPTER 2: THE PLAYMAKER — digital product
      ═══════════════════════════════════════════════════════════════ */}

      <section id="playmaker" className="relative overflow-hidden border-t border-white/[0.06]">
        {/* Chapter header — compact */}
        <div className="pt-14 sm:pt-28 pb-8 sm:pb-14 px-4 sm:px-6 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.06)_0%,_transparent_50%)]" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <p className="text-mars text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-3 sm:mb-4">02 — Digital Reality Play</p>
            <h2 className="text-[32px] sm:text-[72px] md:text-[96px] font-bold leading-[0.88] tracking-[-0.04em] mb-4 sm:mb-6">
              The Playmaker.
            </h2>
            <p className="font-mercure text-[#EDEDED]/40 text-[13px] sm:text-[22px] max-w-[280px] sm:max-w-2xl mx-auto">
              Your question becomes a reality play — digitally. See beyond what you currently see.
            </p>
          </div>
        </div>

        {/* Single iPhone with Apple-style side descriptions */}
        <div className="pb-16 sm:pb-24 px-6 -mb-12 sm:-mb-16">
          <div className="max-w-5xl mx-auto" style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>

            {/* Layout: side labels + centered iPhone */}
            <div className="relative flex items-start justify-center">

              {/* LEFT side labels — hidden on mobile */}
              <div className="hidden lg:flex flex-col items-end gap-14 pt-[80px] pr-12 w-[260px] flex-shrink-0">
                {/* Label 1 */}
                <div className="text-right max-w-[220px]">
                  <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Question</p>
                  <p className="text-white/40 text-sm leading-relaxed">Ask any real question. Strategy, culture, leadership — the play starts with what matters to you.</p>
                </div>
                {/* Label 2 */}
                <div className="text-right max-w-[220px]">
                  <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Characters</p>
                  <p className="text-white/40 text-sm leading-relaxed">AI generates characters — concrete and abstract forces that shape your reality.</p>
                </div>
                {/* Label 3 */}
                <div className="text-right max-w-[220px]">
                  <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">The Stage</p>
                  <p className="text-white/40 text-sm leading-relaxed">A systemic constellation — characters positioned in space, revealing what&apos;s hidden in your reality.</p>
                </div>
              </div>

              {/* THE iPHONE */}
              <div className="relative flex-shrink-0 w-[300px] sm:w-[340px] lg:w-[360px]">
                <div className="relative rounded-[48px] border-[3px] border-white/[0.15] bg-black overflow-hidden shadow-[0_0_100px_rgba(255,85,0,0.06),0_20px_80px_rgba(0,0,0,0.7)]" style={{ aspectRatio: '393/852' }}>
                  {/* Dynamic Island */}
                  <div className="absolute top-0 left-0 right-0 flex justify-center pt-[10px] z-20">
                    <div className="w-[100px] h-[28px] bg-black rounded-full" />
                  </div>

                  {/* Animated screen content */}
                  <PhoneAnimation />

                  {/* Home indicator */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-[7px] z-20">
                    <div className="w-[110px] h-[4px] bg-white/20 rounded-full" />
                  </div>
                </div>
                {/* Glow */}
                <div className="absolute -inset-20 bg-mars/[0.04] rounded-full blur-[100px] -z-10" />
              </div>

              {/* RIGHT side labels — hidden on mobile */}
              <div className="hidden lg:flex flex-col items-start gap-14 pt-[80px] pl-12 w-[260px] flex-shrink-0">
                {/* Label 1 */}
                <div className="text-left max-w-[220px]">
                  <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Play Card</p>
                  <p className="text-white/40 text-sm leading-relaxed">Every question generates a unique reality play — complete with setting, characters, and your role.</p>
                </div>
                {/* Label 2 */}
                <div className="text-left max-w-[220px]">
                  <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Your Role</p>
                  <p className="text-white/40 text-sm leading-relaxed">You&apos;re not a spectator. You&apos;re the author — you decide what happens next on the stage.</p>
                </div>
                {/* Label 3 */}
                <div className="text-left max-w-[220px]">
                  <p className="text-mars text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Perspective</p>
                  <p className="text-white/40 text-sm leading-relaxed">The play doesn&apos;t give you answers. It lets you see beyond your current reality.</p>
                </div>
              </div>
            </div>

            {/* Mobile-only labels — shown below the phone on small screens */}
            <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-6 mt-10 px-2">
              <div>
                <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Question</p>
                <p className="text-white/35 text-xs leading-relaxed">Ask any real question — strategy, culture, leadership.</p>
              </div>
              <div>
                <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Characters</p>
                <p className="text-white/35 text-xs leading-relaxed">AI generates characters — forces that shape your reality.</p>
              </div>
              <div>
                <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">The Stage</p>
                <p className="text-white/35 text-xs leading-relaxed">A constellation revealing what&apos;s hidden in your reality.</p>
              </div>
              <div>
                <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Play Card</p>
                <p className="text-white/35 text-xs leading-relaxed">A unique reality play with setting, characters, and your role.</p>
              </div>
              <div>
                <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Your Role</p>
                <p className="text-white/35 text-xs leading-relaxed">You&apos;re the author — you decide what happens next.</p>
              </div>
              <div>
                <p className="text-mars text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Perspective</p>
                <p className="text-white/35 text-xs leading-relaxed">Not answers — a way to see beyond your current reality.</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 sm:mt-14 text-center space-y-3">
              <p className="text-white/30 text-sm sm:text-base">Turn your question into a reality play. See what you can&apos;t see yet.</p>
              <a
                href="https://playbook.stageonmars.com/play"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-white bg-mars hover:bg-mars-light text-sm font-bold uppercase tracking-[0.1em] px-8 py-4 rounded-xl transition-all group shadow-[0_8px_40px_-4px_rgba(255,85,0,0.35)] hover:shadow-[0_12px_50px_-4px_rgba(255,85,0,0.5)]"
              >
                Play Now
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current group-hover:translate-x-1 transition-transform"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          CHAPTER 3: THE SPACE — flagship venue
      ═══════════════════════════════════════════════════════════════ */}

      <section id="space" className="relative overflow-hidden border-t border-white/[0.06]">
        {/* Full-bleed hero photo */}
        <div className="relative h-[80vh] sm:h-[90vh]">
          <img
            src="/space1.png"
            alt="Stage on Mars — flagship space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-[#0a0a0a]/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
            <p className="text-mars text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-3 sm:mb-4">03 — The Stage</p>
            <h2 className="text-[32px] sm:text-[72px] md:text-[96px] font-bold leading-[0.88] tracking-[-0.04em] mb-4 sm:mb-8">
              The Flagship Studio.
            </h2>
            <p className="font-mercure text-[#EDEDED]/50 text-[14px] sm:text-[22px] max-w-[240px] sm:max-w-md mb-4 sm:mb-8">
              A stage built for reality play.
            </p>
            <div className="mt-2 sm:mt-4">
              <p className="text-[18px] sm:text-[32px] font-bold tracking-[-0.02em]">Národní 138/10, Praha</p>
              <p className="font-mercure text-[#EDEDED]/35 text-[12px] sm:text-[16px] mt-1 sm:mt-2">One of a kind in the world.</p>
            </div>
            <div className="mt-6 sm:mt-10">
              <a
                href="/space"
                className="inline-flex items-center gap-2 sm:gap-3 bg-mars hover:bg-mars-light text-white font-bold text-sm sm:text-lg px-6 sm:px-10 py-3 sm:py-4 rounded-xl transition-all shadow-[0_8px_40px_-4px_rgba(255,85,0,0.35)] hover:shadow-[0_12px_50px_-4px_rgba(255,85,0,0.5)]"
              >
                Experience the Stage
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
              </a>
            </div>
          </div>
        </div>

      </section>


      {/* ═══════════════════════════════════════════════════════════════
          SOCIAL PROOF
      ═══════════════════════════════════════════════════════════════ */}

      {/* The Team */}
      <section className="py-16 sm:py-40 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-20 items-center">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src="/team.jpg"
                alt="Stage on Mars team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
            </div>
            <div className="space-y-6">
              <p className="text-mars text-xs font-bold uppercase tracking-[0.3em]">The Team</p>
              <p className="font-mercure text-[#EDEDED]/50 text-[16px] sm:text-[18px] leading-[26px]">
                Originally created during the COVID pandemic by Milan Semelak and Zuzana Semelak, who laid the foundations of Reality Play through experimentation with systemic constellations, theatre, and improvisation.
              </p>
              <p className="font-mercure text-[#EDEDED]/50 text-[16px] sm:text-[18px] leading-[26px]">
                In 2023, joined by David Vais as partner and investor, they evolved Reality Play into a platform, opened the flagship stage, and turned Stage on Mars into a recognized brand.
              </p>
              <p className="text-white/70 text-[15px] leading-[24px] font-bold">
                800+ reality plays created. London, Zurich, Bucharest.
              </p>
              <p className="text-[#EDEDED]/40 text-[14px] leading-[22px]">
                <span className="font-bold text-[#EDEDED]/50">Current team:</span> Milan Semelak, David Vais, Tomas Pavlik, Jan Piskor, Andrea Sturalova
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-mars hover:text-mars-light text-sm font-bold uppercase tracking-[0.1em] transition-colors group"
              >
                Get in touch
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          CONTACT + FOOTER
      ═══════════════════════════════════════════════════════════════ */}

      <section id="contact" className="py-16 sm:py-40 px-4 sm:px-6 relative overflow-hidden border-t border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,85,0,0.06)_0%,_transparent_60%)]" />
        <div className="relative z-10 max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-[28px] sm:text-[60px] font-bold leading-[0.94] tracking-[-0.03em]">What&apos;s your question?</h2>
            <p className="font-mercure text-[#EDEDED]/30 text-[13px] sm:text-[20px]">We reply within 24 hours.</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4 py-8">
              <div className="text-mars text-5xl">&#10003;</div>
              <p className="font-mercure text-[#EDEDED]/50 text-lg">Thank you. We&apos;ll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/10 focus:border-mars/40 px-4 py-3.5 text-[#EDEDED] placeholder:text-[#EDEDED]/20 focus:outline-none transition-colors"
                />
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company"
                  className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/10 focus:border-mars/40 px-4 py-3.5 text-[#EDEDED] placeholder:text-[#EDEDED]/20 focus:outline-none transition-colors"
                />
              </div>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/10 focus:border-mars/40 px-4 py-3.5 text-[#EDEDED] placeholder:text-[#EDEDED]/20 focus:outline-none transition-colors"
              />
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="What's your question?"
                rows={3}
                className="font-mercure w-full rounded-xl bg-white/[0.06] border border-white/10 focus:border-mars/40 px-4 py-3.5 text-[#EDEDED] placeholder:text-[#EDEDED]/20 focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-mars hover:bg-mars-light text-white font-bold text-base uppercase tracking-[0.15em] transition-all shadow-[0_4px_30px_rgba(255,85,0,0.3)] hover:shadow-[0_4px_40px_rgba(255,85,0,0.5)]"
              >
                Let&apos;s Talk
              </button>
            </form>
          )}

          <div className="text-center space-y-2">
            <p className="font-mercure text-[#EDEDED]/35 text-sm">or reach us directly</p>
            <p className="font-mercure text-[#EDEDED]/50">
              <a href="mailto:play@stageonmars.com" className="hover:text-mars transition-colors font-bold">play@stageonmars.com</a>
              {" "}&middot;{" "}
              <a href="tel:+420602336338" className="hover:text-mars transition-colors">+420 602 336 338</a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mercure text-[#EDEDED]/15 text-xs">
            <span>&copy; {new Date().getFullYear()} Stage on Mars</span>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/stage_on_mars" target="_blank" rel="noopener noreferrer" className="hover:text-[#EDEDED]/30 transition-colors">Instagram</a>
              <a href="https://www.linkedin.com/company/stageonmars" target="_blank" rel="noopener noreferrer" className="hover:text-[#EDEDED]/30 transition-colors">LinkedIn</a>
              <a href="https://playbook.stageonmars.com" className="hover:text-[#EDEDED]/30 transition-colors">Playbook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
