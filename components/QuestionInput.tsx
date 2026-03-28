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
    <div className="space-y-3">
      {/* Input box */}
      <div className="rounded-2xl border border-white/15 bg-white/[0.06] overflow-hidden focus-within:border-mars/40 transition-colors">
        <textarea
          value={question}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.placeholder}
          rows={3}
          className="w-full bg-transparent px-5 sm:px-6 pt-5 pb-3 text-white/90 placeholder:text-white/30 focus:outline-none resize-none text-base sm:text-lg leading-relaxed min-h-[7rem] sm:min-h-[8rem]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 pb-3 gap-3">
          <div className="flex items-center gap-1 bg-white/[0.06] rounded-lg p-0.5">
            <button
              onClick={() => onContextChange("personal")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                context === "personal"
                  ? "bg-white/12 text-white"
                  : "text-white/35 hover:text-white/60"
              }`}
            >
              {t.personal}
            </button>
            <button
              onClick={() => onContextChange("business")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                context === "business"
                  ? "bg-white/12 text-white"
                  : "text-white/35 hover:text-white/60"
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
            className="w-24 sm:w-32 bg-white/[0.06] rounded-lg px-3 py-1.5 text-[16px] sm:text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-mars/30 border border-transparent focus:border-mars/20 transition-colors text-center"
          />
        </div>
      </div>

      {/* PLAY button */}
      <button
        onClick={onSubmit}
        disabled={loading || !hasQuestion}
        className={`w-full py-5 sm:py-6 rounded-2xl font-black text-2xl sm:text-3xl tracking-widest uppercase transition-all duration-300 ${
          hasQuestion
            ? "bg-mars hover:bg-mars-light text-white shadow-[0_8px_40px_-4px_rgba(255,85,0,0.4)] hover:shadow-[0_12px_50px_-4px_rgba(255,85,0,0.5)] active:scale-[0.99]"
            : "bg-mars text-white/50 cursor-not-allowed opacity-60"
        }`}
      >
        {t.generatePlay}
      </button>
    </div>
  );
}
