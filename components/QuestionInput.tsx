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
        className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-mars/30 focus:border-mars/40 resize-none text-base sm:text-lg leading-relaxed transition-all"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          <button
            onClick={() => onContextChange("personal")}
            className={`px-4 sm:px-5 py-2.5 text-sm font-medium transition-all ${
              context === "personal"
                ? "bg-white/20 text-white"
                : "bg-white/[0.03] text-white/30 hover:text-white/50"
            }`}
          >
            {t.personal}
          </button>
          <button
            onClick={() => onContextChange("business")}
            className={`px-4 sm:px-5 py-2.5 text-sm font-medium transition-all ${
              context === "business"
                ? "bg-white/20 text-white"
                : "bg-white/[0.03] text-white/30 hover:text-white/50"
            }`}
          >
            {t.business}
          </button>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !question.trim()}
        className="w-full py-5 rounded-2xl bg-mars hover:bg-mars-light disabled:opacity-20 disabled:cursor-not-allowed text-white font-bold text-2xl sm:text-3xl tracking-widest uppercase transition-all shadow-lg shadow-mars/20 hover:shadow-mars/40"
      >
        {t.generatePlay}
      </button>
    </div>
  );
}
