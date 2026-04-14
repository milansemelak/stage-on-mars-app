"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

type Props = {
  onUseQuestion: (question: string) => void;
};

export default function DailyQuestionCard({ onUseQuestion }: Props) {
  const { t } = useI18n();
  const [question, setQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/daily-question");
        if (res.ok) {
          const data = await res.json();
          setQuestion(data.question);
        }
      } catch {
        // silently fail — curated questions remain as fallback in parent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (dismissed || (!loading && !question)) return null;

  return (
    <div className="relative rounded-2xl border border-amber-500/15 bg-amber-500/[0.03] overflow-hidden">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
      <div className="px-5 py-4">
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-amber-400/20 border-t-amber-400/60 rounded-full animate-spin shrink-0" />
            <div className="skeleton h-4 w-48" />
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-1">
              <p className="text-amber-400/50 text-[10px] font-bold uppercase tracking-[0.2em]">
                {t.dailyQuestionLabel}
              </p>
              <button
                onClick={() => {
                  if (question) onUseQuestion(question);
                }}
                className="text-left group"
              >
                <p className="font-mercure text-amber-200/80 text-sm sm:text-base italic leading-relaxed group-hover:text-amber-200 transition-colors">
                  &ldquo;{question}&rdquo;
                </p>
              </button>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-white/15 hover:text-white/30 transition-colors mt-1 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
