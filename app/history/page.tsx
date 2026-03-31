"use client";

import { useState, useEffect } from "react";
import { Play, HistoryEntry } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { STORAGE_KEYS, userKey } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import PlayCard from "@/components/PlayCard";
import Link from "next/link";

export default function HistoryPage() {
  const { lang, t } = useI18n();
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const historyKey = userKey(STORAGE_KEYS.playHistory, user?.id);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(historyKey) || "[]");
    setHistory(saved);
  }, [historyKey]);

  function clearHistory() {
    localStorage.removeItem(historyKey);
    setHistory([]);
    setShowConfirm(false);
  }

  function handlePlayUpdate(updatedPlay: Play, index: number) {
    const updated = [...history];
    updated[index] = { ...updated[index], play: updatedPlay };
    setHistory(updated);
    localStorage.setItem(historyKey, JSON.stringify(updated));
  }

  function toggleFavorite(index: number) {
    const updated = [...history];
    updated[index] = { ...updated[index], favorite: !updated[index].favorite };
    setHistory(updated);
    localStorage.setItem(historyKey, JSON.stringify(updated));
  }

  const locale = lang === "sk" ? "sk-SK" : lang === "cs" ? "cs-CZ" : "en-GB";
  const displayed = filter === "favorites" ? history.filter((e) => e.favorite) : history;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t.savedPlays}</h1>
          <p className="text-white/40 text-sm">
            {history.length} {history.length === 1 ? t.historyPlay : t.historyPlays}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/play"
            className="px-4 py-2 rounded-lg bg-mars hover:bg-mars-light text-white text-sm font-medium transition-colors"
          >
            {t.newPlay}
          </Link>
          {history.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 rounded-lg border border-white/10 text-white/30 hover:text-red-400 hover:border-red-500/30 text-sm transition-colors"
            >
              {t.clear}
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      {history.length > 0 && history.some((e) => e.favorite) && (
        <div className="flex gap-1 bg-white/[0.04] rounded-lg p-0.5 w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filter === "all" ? "bg-white/12 text-white" : "text-white/35 hover:text-white/60"
            }`}
          >
            {t.historyAll}
          </button>
          <button
            onClick={() => setFilter("favorites")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filter === "favorites" ? "bg-white/12 text-white" : "text-white/35 hover:text-white/60"
            }`}
          >
            ★ {t.favorite}
          </button>
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between gap-4">
          <p className="text-red-400/80 text-sm">{t.clearConfirm}</p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={clearHistory}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
            >
              {t.clearYes}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 rounded-lg border border-white/10 text-white/40 text-sm hover:text-white/60 transition-colors"
            >
              {t.clearNo}
            </button>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-white/20 text-lg">{t.noPlaysYet}</p>
          <Link
            href="/play"
            className="inline-block px-6 py-3 rounded-lg bg-mars hover:bg-mars-light text-white font-medium transition-colors"
          >
            {t.generateFirst}
          </Link>
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/20 text-lg">{t.historyNoFavorites}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayed.map((entry, displayIdx) => {
            const realIdx = filter === "favorites" ? history.indexOf(entry) : displayIdx;
            return (
              <div key={entry.timestamp} className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span>
                    {new Date(entry.timestamp).toLocaleDateString(locale, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-white/10">·</span>
                  <span className="italic">&ldquo;{entry.question}&rdquo;</span>
                  {entry.favorite && <span className="text-mars">★</span>}
                </div>
                <PlayCard
                  play={entry.play}
                  question={entry.question}
                  onPlayUpdate={(p) => handlePlayUpdate(p, realIdx)}
                  favorite={entry.favorite}
                  onToggleFavorite={() => toggleFavorite(realIdx)}
                  rxNumber={entry.rxNumber}
                  clientName={entry.clientName}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
