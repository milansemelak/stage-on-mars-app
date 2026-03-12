"use client";

import { useI18n } from "@/lib/i18n";

type Props = {
  question: string;
  onChange: (q: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function QuestionInput({
  question,
  onChange,
  onSubmit,
  loading,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={question}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.placeholder}
          rows={3}
          className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 resize-none text-lg"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <a
          href="https://www.stageonmars.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/40 hover:text-orange-400 transition-colors"
        >
          {t.humanFutureSimulator} &rarr;
        </a>

        <button
          onClick={onSubmit}
          disabled={loading || !question.trim()}
          className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
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
