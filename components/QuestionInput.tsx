"use client";

import { useState } from "react";
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
  const [showAngles, setShowAngles] = useState(false);
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
        <button
          type="button"
          onClick={() => setShowAngles(!showAngles)}
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          {showAngles ? t.hide : t.needHelp} {t.questionTriangle}
        </button>

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

      {showAngles && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          <button
            onClick={() =>
              onChange(question ? question : "What about this situation...")
            }
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors text-left"
          >
            <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">
              {t.it}
            </span>
            <p className="text-white/50 text-xs mt-1">{t.itDesc}</p>
          </button>
          <button
            onClick={() =>
              onChange(question ? question : "What about us...")
            }
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors text-left"
          >
            <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">
              {t.us}
            </span>
            <p className="text-white/50 text-xs mt-1">{t.usDesc}</p>
          </button>
          <button
            onClick={() =>
              onChange(question ? question : "What about me...")
            }
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors text-left"
          >
            <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">
              {t.me}
            </span>
            <p className="text-white/50 text-xs mt-1">{t.meDesc}</p>
          </button>
        </div>
      )}
    </div>
  );
}
