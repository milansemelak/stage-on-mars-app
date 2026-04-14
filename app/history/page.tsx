"use client";

import { useState, useMemo } from "react";
import { Play } from "@/lib/types";
import { PlayThread } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { usePlayHistory } from "@/hooks/usePlayHistory";
import PlayCard from "@/components/PlayCard";
import Link from "next/link";

export default function HistoryPage() {
  const { lang, t } = useI18n();
  const { user } = useAuth();
  const { history, loading, updatePlay, toggleFavorite, clearHistory: clearAll } = usePlayHistory(user?.id);
  const [showConfirm, setShowConfirm] = useState(false);
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [view, setView] = useState<"all" | "threads">("all");
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  function handleClear() {
    clearAll();
    setShowConfirm(false);
  }

  function handlePlayUpdate(updatedPlay: Play, timestamp: number) {
    updatePlay(timestamp, updatedPlay);
  }

  function handleToggleFavorite(timestamp: number) {
    toggleFavorite(timestamp);
  }

  function toggleThread(threadId: string) {
    setExpandedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(threadId)) {
        next.delete(threadId);
      } else {
        next.add(threadId);
      }
      return next;
    });
  }

  // Group entries into threads
  const threads = useMemo((): PlayThread[] => {
    const map = new Map<string, PlayThread>();

    for (const entry of history) {
      const tid = entry.threadId || `__solo_${entry.timestamp}`;
      if (!map.has(tid)) {
        map.set(tid, {
          threadId: tid,
          entries: [],
          firstQuestion: entry.question,
          lastTimestamp: entry.timestamp,
        });
      }
      const thread = map.get(tid)!;
      thread.entries.push(entry);
      if (entry.timestamp > thread.lastTimestamp) {
        thread.lastTimestamp = entry.timestamp;
      }
    }

    // Sort entries within each thread by timestamp (oldest first for reading order)
    for (const thread of map.values()) {
      thread.entries.sort((a, b) => a.timestamp - b.timestamp);
      thread.firstQuestion = thread.entries[0].question;
    }

    // Sort threads by most recent activity
    return Array.from(map.values()).sort((a, b) => b.lastTimestamp - a.lastTimestamp);
  }, [history]);

  const locale = lang === "sk" ? "sk-SK" : lang === "cs" ? "cs-CZ" : "en-GB";
  const displayed = filter === "favorites" ? history.filter((e) => e.favorite) : history;

  const hasThreads = threads.some((t) => t.entries.length > 1);

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

      {/* Filter + view tabs */}
      {history.length > 0 && (
        <div className="flex items-center gap-4">
          {/* View toggle (only show if threads exist) */}
          {hasThreads && (
            <div className="flex gap-1 bg-white/[0.04] rounded-lg p-0.5 w-fit">
              <button
                onClick={() => setView("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  view === "all" ? "bg-white/12 text-white" : "text-white/35 hover:text-white/60"
                }`}
              >
                {t.historyAllPlays}
              </button>
              <button
                onClick={() => setView("threads")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  view === "threads" ? "bg-white/12 text-white" : "text-white/35 hover:text-white/60"
                }`}
              >
                {t.historyThreads}
              </button>
            </div>
          )}

          {/* Favorites filter */}
          {view === "all" && history.some((e) => e.favorite) && (
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
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between gap-4">
          <p className="text-red-400/80 text-sm">{t.clearConfirm}</p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleClear}
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

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-mars/30 border-t-mars rounded-full animate-spin mx-auto" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-white/20 text-lg">{t.noPlaysYet}</p>
          <Link
            href="/play"
            className="inline-block px-6 py-3 rounded-lg bg-mars hover:bg-mars-light text-white font-medium transition-colors"
          >
            {t.generateFirst}
          </Link>
        </div>
      ) : view === "threads" ? (
        /* Threaded view */
        <div className="space-y-4">
          {threads.map((thread) => {
            const isSingleton = thread.entries.length === 1;
            const isExpanded = expandedThreads.has(thread.threadId);
            const latestEntry = thread.entries[thread.entries.length - 1];

            if (isSingleton) {
              // Render flat — no expand UI
              const entry = thread.entries[0];
              return (
                <div key={thread.threadId} className="space-y-3">
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
                    onPlayUpdate={(p) => handlePlayUpdate(p, entry.timestamp)}
                    favorite={entry.favorite}
                    onToggleFavorite={() => handleToggleFavorite(entry.timestamp)}
                    rxNumber={entry.rxNumber}
                    clientName={entry.clientName}
                  />
                </div>
              );
            }

            // Multi-entry thread
            return (
              <div
                key={thread.threadId}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
              >
                {/* Thread header — clickable to expand */}
                <button
                  onClick={() => toggleThread(thread.threadId)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate">
                      &ldquo;{thread.firstQuestion}&rdquo;
                    </p>
                    <p className="text-xs text-white/25">
                      {thread.entries.length} {t.threadQuestions} · {new Date(latestEntry.timestamp).toLocaleDateString(locale, { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-white/20 shrink-0 ml-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded thread content */}
                {isExpanded && (
                  <div className="border-t border-white/[0.06]">
                    {thread.entries.map((entry, idx) => (
                      <div key={entry.timestamp} className="relative">
                        {/* Vertical connector line */}
                        {idx < thread.entries.length - 1 && (
                          <div className="absolute left-7 top-14 bottom-0 w-px bg-white/[0.06]" />
                        )}
                        <div className="px-5 py-4 space-y-3">
                          <div className="flex items-center gap-3 text-xs text-white/30">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${idx === 0 ? "bg-mars/60" : "bg-white/20"}`} />
                            <span>
                              {new Date(entry.timestamp).toLocaleDateString(locale, {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="text-white/10">·</span>
                            <span className="italic truncate">&ldquo;{entry.question}&rdquo;</span>
                            {idx > 0 && (
                              <span className="text-mars/40 text-[10px] uppercase tracking-wider shrink-0">
                                {t.threadFollowUp}
                              </span>
                            )}
                            {entry.favorite && <span className="text-mars">★</span>}
                          </div>
                          <PlayCard
                            play={entry.play}
                            question={entry.question}
                            onPlayUpdate={(p) => handlePlayUpdate(p, entry.timestamp)}
                            favorite={entry.favorite}
                            onToggleFavorite={() => handleToggleFavorite(entry.timestamp)}
                            rxNumber={entry.rxNumber}
                            clientName={entry.clientName}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/20 text-lg">{t.historyNoFavorites}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayed.map((entry) => (
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
                onPlayUpdate={(p) => handlePlayUpdate(p, entry.timestamp)}
                favorite={entry.favorite}
                onToggleFavorite={() => handleToggleFavorite(entry.timestamp)}
                rxNumber={entry.rxNumber}
                clientName={entry.clientName}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
