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
      <div className="relative group/input">
        {/* Outer glow ring — reacts to focus */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-mars/30 via-white/[0.08] to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700 blur-[1px]" />
        {/* Subtle ambient glow behind */}
        <div className="absolute -inset-6 rounded-3xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000" style={{ background: "radial-gradient(ellipse at center, rgba(255,85,0,0.06) 0%, transparent 70%)" }} />

        <div className="relative rounded-2xl border border-white/[0.12] group-focus-within/input:border-mars/25 bg-white/[0.025] backdrop-blur-sm transition-all duration-500 overflow-hidden">
          <textarea
            value={question}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t.placeholder}
            rows={3}
            className="w-full bg-transparent px-5 sm:px-6 pt-5 pb-3 text-white/90 placeholder:text-white/35 focus:outline-none resize-none text-base sm:text-lg leading-relaxed min-h-[7rem] sm:min-h-[8rem]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 pb-4 gap-3">
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-0.5">
              <button
                onClick={() => onContextChange("personal")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  context === "personal"
                    ? "bg-white/10 text-white"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                {t.personal}
              </button>
              <button
                onClick={() => onContextChange("business")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
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
              className="w-24 sm:w-32 bg-white/[0.04] rounded-lg px-3 py-1.5 text-[16px] sm:text-xs text-white/60 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-mars/30 border border-white/[0.06] focus:border-mars/20 transition-colors text-center"
            />
          </div>
        </div>
      </div>

      {/* PLAY button — rounded pill with mars glow */}
      <button
        onClick={onSubmit}
        disabled={loading || !hasQuestion}
        className={`w-full py-4 sm:py-5 rounded-full font-black text-base sm:text-lg tracking-[0.25em] uppercase transition-all duration-500 ${
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
