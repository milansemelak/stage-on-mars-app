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
    <div className="space-y-4">
      <textarea
        value={question}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.placeholder}
        rows={5}
        className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-5 py-4 sm:px-6 sm:py-5 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 resize-none text-lg sm:text-xl leading-relaxed"
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
            className={`px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-medium transition-all ${
              context === "personal"
                ? "bg-orange-500 text-white"
                : "bg-white/[0.03] text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
            }`}
          >
            {t.personal}
          </button>
          <button
            onClick={() => onContextChange("business")}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-medium transition-all ${
              context === "business"
                ? "bg-orange-500 text-white"
                : "bg-white/[0.03] text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
            }`}
          >
            {t.business}
          </button>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading || !question.trim()}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t.generating}
            </span>
          ) : (
            t.generatePlay
          )}
        </button>
      </div>
    </div>
  );
}
