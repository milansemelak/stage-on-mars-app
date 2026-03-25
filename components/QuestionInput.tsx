"use client";

import { useI18n } from "@/lib/i18n";

type Props = {
  question: string;
  onChange: (q: string) => void;
  onSubmit: () => void;
  loading: boolean;
  context: "personal" | "business";
  onContextChange: (c: "personal" | "business") => void;
};

export default function QuestionInput({
  question,
  onChange,
  onSubmit,
  loading,
  context,
  onContextChange,
}: Props) {
  const { t } = useI18n();
  const hasQuestion = question.trim().length > 0;

  return (
    <div className="space-y-0">
      {/* Input container with glow effect */}
      <div className="relative group">
        {/* Ambient glow behind the input */}
        <div
          className={`absolute -inset-1 rounded-2xl transition-all duration-500 blur-xl ${
            hasQuestion
              ? "bg-mars/25 opacity-100"
              : "bg-mars/10 opacity-100"
          }`}
        />

        <div className="relative rounded-2xl overflow-hidden border border-mars/20 bg-white/[0.03] backdrop-blur-sm">
          <textarea
            value={question}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t.placeholder}
            rows={3}
            className="w-full bg-transparent px-5 sm:px-6 pt-5 pb-3 text-white placeholder:text-white/25 focus:outline-none resize-none text-base sm:text-lg leading-relaxed min-h-[7rem] sm:min-h-[8rem]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />

          {/* Context toggle — inside the input box */}
          <div className="flex items-center justify-between px-4 sm:px-5 pb-3">
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-0.5">
              <button
                onClick={() => onContextChange("personal")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  context === "personal"
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/25 hover:text-white/50"
                }`}
              >
                {t.personal}
              </button>
              <button
                onClick={() => onContextChange("business")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  context === "business"
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/25 hover:text-white/50"
                }`}
              >
                {t.business}
              </button>
            </div>

            {/* Inline submit hint */}
            <span className="text-[10px] text-white/20 hidden sm:block">
              Enter ↵
            </span>
          </div>
        </div>
      </div>

      {/* PLAY button */}
      <button
        onClick={onSubmit}
        disabled={loading || !hasQuestion}
        className={`w-full mt-3 py-5 sm:py-6 rounded-2xl font-black text-2xl sm:text-3xl tracking-widest uppercase transition-all duration-300 ${
          hasQuestion
            ? "bg-mars hover:bg-mars-light text-white shadow-[0_8px_40px_-4px_rgba(255,85,0,0.4)] hover:shadow-[0_8px_50px_-4px_rgba(255,85,0,0.6)] hover:scale-[1.01] active:scale-[0.99]"
            : "bg-mars/10 text-mars/30 cursor-not-allowed border border-mars/15"
        }`}
      >
        {t.generatePlay}
      </button>
    </div>
  );
}
