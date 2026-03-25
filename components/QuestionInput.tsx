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

  return (
    <div className="space-y-3">
      <textarea
        value={question}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.placeholder}
        rows={4}
        className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-mars/30 focus:border-mars/40 resize-none text-base sm:text-lg leading-relaxed transition-all min-h-[14.4rem] sm:min-h-0"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />

      <div className="w-full rounded-2xl overflow-hidden shadow-[0_8px_40px_-4px_rgba(194,87,27,0.5)] hover:shadow-[0_8px_50px_-4px_rgba(194,87,27,0.7)] transition-shadow">
        <div className="flex w-full">
          <button
            onClick={() => onContextChange("personal")}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${
              context === "personal"
                ? "bg-white/12 text-white"
                : "bg-white/[0.03] text-white/25 hover:text-white/50"
            }`}
          >
            {t.personal}
          </button>
          <button
            onClick={() => onContextChange("business")}
            className={`flex-1 py-3 text-sm font-semibold transition-all border-l border-white/[0.06] ${
              context === "business"
                ? "bg-white/12 text-white"
                : "bg-white/[0.03] text-white/25 hover:text-white/50"
            }`}
          >
            {t.business}
          </button>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading || !question.trim()}
          className="w-full py-6 bg-mars hover:bg-mars-light disabled:bg-mars/50 disabled:cursor-not-allowed text-white disabled:text-white/30 font-black text-2xl sm:text-3xl tracking-widest uppercase transition-all"
        >
          {t.generatePlay}
        </button>
      </div>
    </div>
  );
}
