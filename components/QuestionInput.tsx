"use client";

import { useI18n } from "@/lib/i18n";

type Props = {
  question: string;
  onChange: (q: string) => void;
  onSubmit: () => void;
  loading: boolean;
  context: "personal" | "business";
  onContextChange: (c: "personal" | "business") => void;
  clientName: string;
  onClientNameChange: (name: string) => void;
};

export default function QuestionInput({
  question,
  onChange,
  onSubmit,
  loading,
  context,
  onContextChange,
  clientName,
  onClientNameChange,
}: Props) {
  const { t } = useI18n();
  const hasQuestion = question.trim().length > 0;

  return (
    <div className="space-y-5">
      {/* Input box — mars-atmospheric container */}
      <div className="relative group/input isolate">
        {/* Outer glow ring — reacts to focus */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-mars/30 via-white/[0.08] to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700 blur-[1px] pointer-events-none" />
        {/* Subtle ambient glow behind — clipped via mix-blend to avoid overflow on narrow mobile */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000 pointer-events-none -z-10" style={{ background: "radial-gradient(ellipse at center, rgba(255,85,0,0.08) 0%, transparent 70%)", filter: "blur(18px)" }} />

        <div className="relative rounded-2xl border border-white/[0.12] group-focus-within/input:border-mars/25 bg-white/[0.025] backdrop-blur-sm transition-all duration-500 overflow-hidden">
          <textarea
            value={question}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t.placeholder}
            rows={3}
            className="w-full bg-transparent px-5 sm:px-6 lg:px-8 pt-5 lg:pt-7 pb-3 text-white/90 placeholder:text-white/35 focus:outline-none resize-none text-base sm:text-lg lg:text-xl leading-relaxed min-h-[7rem] sm:min-h-[8rem] lg:min-h-[10rem]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-3 sm:px-5 lg:px-6 pb-3 sm:pb-4 lg:pb-5 gap-2 sm:gap-3">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-white/[0.04] rounded-lg p-0.5 shrink-0">
              <button
                onClick={() => onContextChange("personal")}
                className={`px-2 sm:px-3 lg:px-4 py-1.5 lg:py-2 rounded-md text-[11px] sm:text-xs lg:text-sm font-semibold transition-all ${
                  context === "personal"
                    ? "bg-white/10 text-white"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                {t.personal}
              </button>
              <button
                onClick={() => onContextChange("business")}
                className={`px-2 sm:px-3 lg:px-4 py-1.5 lg:py-2 rounded-md text-[11px] sm:text-xs lg:text-sm font-semibold transition-all ${
                  context === "business"
                    ? "bg-white/10 text-white"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                {t.business}
              </button>
            </div>

            {/* Client name input — 16px font prevents iOS auto-zoom */}
            <input
              type="text"
              value={clientName}
              onChange={(e) => onClientNameChange(e.target.value)}
              placeholder={t.forWhomPlaceholder}
              className="min-w-0 flex-1 sm:flex-none sm:w-32 lg:w-44 bg-white/[0.04] rounded-lg px-2 sm:px-3 lg:px-4 py-1.5 lg:py-2 text-[16px] sm:text-xs lg:text-sm text-white/60 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-mars/30 border border-white/[0.06] focus:border-mars/20 transition-colors text-center"
            />
          </div>
        </div>
      </div>

      {/* PLAY button — rounded pill with mars glow */}
      <button
        onClick={onSubmit}
        disabled={loading || !hasQuestion}
        className={`w-full py-4 sm:py-5 lg:py-6 rounded-full font-black text-base sm:text-lg lg:text-xl tracking-[0.25em] lg:tracking-[0.3em] uppercase transition-all duration-500 ${
          hasQuestion
            ? "bg-mars hover:bg-mars-light text-white shadow-[0_0_60px_-8px_rgba(255,85,0,0.5)]"
            : "text-white/20 border border-white/[0.12] cursor-not-allowed"
        }`}
      >
        {t.generatePlay}
      </button>
    </div>
  );
}
