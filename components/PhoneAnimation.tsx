"use client";

import { useState, useEffect } from "react";

export default function PhoneAnimation() {
  const [step, setStep] = useState(0); // 0=question, 1=generating, 2=play card, 3=stage
  const [typedText, setTypedText] = useState("");
  const question = "Why does our team avoid hard conversations?";

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (step === 0) {
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
