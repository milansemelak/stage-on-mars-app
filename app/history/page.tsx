"use client";

import { useState, useEffect } from "react";
import { Play } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import PlayCard from "@/components/PlayCard";
import Link from "next/link";

type HistoryEntry = {
  question: string;
  context: string;
  play: Play;
  timestamp: number;
};

export default function HistoryPage() {
  const { t } = useI18n();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("som-play-history") || "[]");
    setHistory(saved);
  }, []);

  function clearHistory() {
    localStorage.removeItem("som-play-history");
    setHistory([]);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t.savedPlays}</h1>
          <p className="text-white/40 text-sm">
            {history.length} {history.length === 1 ? "play" : "plays"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/play"
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors"
          >
            + New Play
          </Link>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 rounded-lg border border-white/10 text-white/30 hover:text-red-400 hover:border-red-500/30 text-sm transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-white/20 text-lg">No plays yet</p>
          <Link
            href="/play"
            className="inline-block px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-medium transition-colors"
          >
            Generate your first play
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {history.map((entry, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-white/30">
                <span>
                  {new Date(entry.timestamp).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="text-white/10">·</span>
                <span className="italic">&ldquo;{entry.question}&rdquo;</span>
              </div>
              <PlayCard play={entry.play} question={entry.question} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
