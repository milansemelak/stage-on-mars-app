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
    if (history.length >= 3) {
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
      {/* Synthesis card */}
      {synthesis && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                {t.journalSynthesisLabel}
              </p>
              <button
                onClick={() => fetchSynthesis(true)}
                disabled={synthesisLoading}
                className="text-[10px] text-white/15 hover:text-white/30 transition-colors uppercase tracking-wider"
              >
                {synthesisLoading ? "..." : t.journalSynthesisRegenerate}
              </button>
            </div>

            <div className="space-y-3">
              {synthesis.theme && (
                <div className="flex gap-3 items-baseline">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/20 shrink-0 w-16 pt-0.5">{t.synthesisTheme}</span>
                  <p className="text-white/60 text-sm leading-relaxed">{synthesis.theme}</p>
                </div>
              )}
              {synthesis.blindSpot && (
                <div className="flex gap-3 items-baseline">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/20 shrink-0 w-16 pt-0.5">{t.synthesisBlindSpot}</span>
                  <p className="text-white/60 text-sm leading-relaxed">{synthesis.blindSpot}</p>
                </div>
              )}
              {synthesis.edge && (
                <div className="flex gap-3 items-baseline">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/20 shrink-0 w-16 pt-0.5">{t.synthesisEdge}</span>
                  <p className="text-white/60 text-sm leading-relaxed">{synthesis.edge}</p>
                </div>
              )}
            </div>
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
