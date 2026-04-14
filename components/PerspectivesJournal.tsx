"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { HistoryEntry, Perspective } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type ExtractedPerspective = {
  character: string;
  insight: string;
  playName: string;
  question: string;
  timestamp: number;
  isAuthor: boolean;
};

type GroupedCharacter = {
  name: string;
  perspectives: ExtractedPerspective[];
  playCount: number;
  isAuthor: boolean;
};

type Props = {
  history: HistoryEntry[];
};

type SynthesisData = {
  theme: string;
  blindSpot: string;
  edge: string;
};

export default function PerspectivesJournal({ history }: Props) {
  const { lang, t } = useI18n();
  const [threadFilter, setThreadFilter] = useState<string | null>(null);
  const [synthesis, setSynthesis] = useState<SynthesisData | null>(null);
  const [synthesisPlayCount, setSynthesisPlayCount] = useState(0);
  const [synthesisLoading, setSynthesisLoading] = useState(false);

  const fetchSynthesis = useCallback(async (bustCache = false) => {
    setSynthesisLoading(true);
    try {
      const base = bustCache ? "/api/journal-synthesis?bust=1" : "/api/journal-synthesis";
      const url = `${base}${bustCache ? "&" : "?"}lang=${lang}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.synthesis && typeof data.synthesis === "object" && data.synthesis.theme) {
          setSynthesis(data.synthesis);
        } else if (data.synthesis && typeof data.synthesis === "string") {
          // Legacy string format
          setSynthesis({ theme: data.synthesis, blindSpot: "", edge: "" });
        }
        setSynthesisPlayCount(data.playCount || 0);
      }
    } catch {
      // silently fail
    } finally {
      setSynthesisLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    if (history.length >= 5) {
      fetchSynthesis();
    }
  }, [history.length, fetchSynthesis]);

  // Get unique threads for filter dropdown
  const threads = useMemo(() => {
    const map = new Map<string, { id: string; question: string }>();
    for (const entry of history) {
      if (entry.threadId && !map.has(entry.threadId)) {
        map.set(entry.threadId, { id: entry.threadId, question: entry.question });
      }
    }
    return Array.from(map.values());
  }, [history]);

  // Filter history by thread if selected
  const filteredHistory = useMemo(() => {
    if (!threadFilter) return history;
    return history.filter((e) => e.threadId === threadFilter);
  }, [history, threadFilter]);

  // Extract all perspectives from all plays
  const allPerspectives = useMemo(() => {
    const extracted: ExtractedPerspective[] = [];

    for (const entry of filteredHistory) {
      const play = entry.play;
      if (!play.perspectives || play.perspectives.length === 0) continue;

      const characterNames = play.characters.map((c) => c.name.toLowerCase());

      for (const p of play.perspectives) {
        let character: string;
        let insight: string;

        if (typeof p === "string") {
          // Legacy string format — treat as author perspective
          character = t.author;
          insight = p;
        } else {
          character = (p as Perspective).character;
          insight = (p as Perspective).insight;
        }

        const isAuthor = !characterNames.includes(character.toLowerCase());

        extracted.push({
          character,
          insight,
          playName: play.name,
          question: entry.question,
          timestamp: entry.timestamp,
          isAuthor,
        });
      }
    }

    return extracted;
  }, [filteredHistory, t.author]);

  // Group by character name
  const grouped = useMemo(() => {
    const map = new Map<string, GroupedCharacter>();

    for (const p of allPerspectives) {
      const key = p.isAuthor ? "__author__" : p.character.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: p.isAuthor ? t.author : p.character,
          perspectives: [],
          playCount: 0,
          isAuthor: p.isAuthor,
        });
      }
      const group = map.get(key)!;
      group.perspectives.push(p);
    }

    // Count unique plays per group
    for (const group of map.values()) {
      const uniquePlays = new Set(group.perspectives.map((p) => p.playName));
      group.playCount = uniquePlays.size;
      // Sort perspectives: most recent first
      group.perspectives.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Convert to array: author first, then by number of perspectives
    const arr = Array.from(map.values());
    arr.sort((a, b) => {
      if (a.isAuthor && !b.isAuthor) return -1;
      if (!a.isAuthor && b.isAuthor) return 1;
      return b.perspectives.length - a.perspectives.length;
    });

    return arr;
  }, [allPerspectives, t.author]);

  const playsWithPerspectives = useMemo(() => {
    const set = new Set<string>();
    for (const p of allPerspectives) {
      set.add(p.playName);
    }
    return set.size;
  }, [allPerspectives]);

  // Empty state
  if (allPerspectives.length === 0) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-white/20 text-lg">{t.journalEmpty}</p>
        <p className="text-white/10 text-sm">{t.journalEmptySub}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Synthesis card — structured diagnostic */}
      {synthesis && (
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden">
          {/* Header bar */}
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
                {t.journalSynthesisLabel}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/15 font-mono">
                {synthesisPlayCount} {t.synthesisPlaysAnalyzed}
              </span>
              <button
                onClick={() => fetchSynthesis(true)}
                disabled={synthesisLoading}
                className="text-white/15 hover:text-white/40 transition-colors disabled:opacity-30"
                title={t.journalSynthesisRegenerate}
              >
                <svg
                  className={`w-3.5 h-3.5 ${synthesisLoading ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Three diagnostic sections */}
          <div className="divide-y divide-white/[0.04]">
            {/* Recurring theme */}
            {synthesis.theme && (
              <div className="px-6 py-5 flex gap-4">
                <div className="shrink-0 w-20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg className="w-3 h-3 text-mars/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-mars/50">
                      {t.synthesisTheme}
                    </span>
                  </div>
                </div>
                <p className="text-white/75 text-sm leading-relaxed flex-1">
                  {synthesis.theme}
                </p>
              </div>
            )}

            {/* Blind spot */}
            {synthesis.blindSpot && (
              <div className="px-6 py-5 flex gap-4">
                <div className="shrink-0 w-20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg className="w-3 h-3 text-amber-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-400/50">
                      {t.synthesisBlindSpot}
                    </span>
                  </div>
                </div>
                <p className="text-white/75 text-sm leading-relaxed flex-1">
                  {synthesis.blindSpot}
                </p>
              </div>
            )}

            {/* Growth edge */}
            {synthesis.edge && (
              <div className="px-6 py-5 flex gap-4">
                <div className="shrink-0 w-20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg className="w-3 h-3 text-green-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-green-400/50">
                      {t.synthesisEdge}
                    </span>
                  </div>
                </div>
                <p className="text-white/75 text-sm leading-relaxed flex-1">
                  {synthesis.edge}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats + thread filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-white/30 text-sm">
          {allPerspectives.length} {t.journalPerspectives} {t.journalFromPlays} {playsWithPerspectives} {playsWithPerspectives === 1 ? t.historyPlay : t.historyPlays}
        </div>
        {threads.length >= 2 && (
          <select
            value={threadFilter || ""}
            onChange={(e) => setThreadFilter(e.target.value || null)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white/50 outline-none focus:border-mars/30 transition-colors"
          >
            <option value="">{t.journalAllThreads}</option>
            {threads.map((th) => (
              <option key={th.id} value={th.id}>
                &ldquo;{th.question.slice(0, 40)}{th.question.length > 40 ? "…" : ""}&rdquo;
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Grouped perspectives */}
      <div className="space-y-6">
        {grouped.map((group) => (
          <div
            key={group.isAuthor ? "__author__" : group.name}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
          >
            {/* Group header */}
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold ${
                    group.isAuthor ? "text-amber-400" : "text-mars-light"
                  }`}
                >
                  {group.name}
                </span>
                {group.playCount > 1 && (
                  <span className="text-white/20 text-xs">
                    {t.journalAppearedIn} {group.playCount} {t.journalPlaysCount}
                  </span>
                )}
              </div>
              <span className="text-white/15 text-xs">
                {group.perspectives.length} {t.journalPerspectives}
              </span>
            </div>

            {/* Perspectives list */}
            <div className="divide-y divide-white/[0.04]">
              {group.perspectives.map((p, idx) => (
                <div key={idx} className="px-5 py-4 space-y-2">
                  <p
                    className={`text-sm leading-relaxed ${
                      group.isAuthor ? "text-amber-200/80" : "text-white/70"
                    }`}
                  >
                    {p.insight}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/20">
                    <span className="truncate max-w-[200px]">
                      {t.journalFrom} <span className="italic">{p.playName}</span>
                    </span>
                    <span className="text-white/10">·</span>
                    <span className="truncate max-w-[250px] italic">
                      &ldquo;{p.question}&rdquo;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
