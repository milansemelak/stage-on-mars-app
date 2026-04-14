"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { HistoryEntry, PlayRecord, Play } from "@/lib/types";
import { MAX_HISTORY, STORAGE_KEYS, userKey } from "@/lib/constants";

function recordToEntry(r: PlayRecord): HistoryEntry {
  return {
    id: r.id,
    question: r.question,
    context: r.context,
    play: r.play_data,
    timestamp: r.timestamp,
    favorite: r.favorite,
    rxNumber: r.rx_number || undefined,
    clientName: r.client_name || undefined,
    threadId: r.thread_id || undefined,
  };
}

export function usePlayHistory(userId: string | undefined) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const migratingRef = useRef(false);
  const fetchedRef = useRef(false);

  const localKey = userKey(STORAGE_KEYS.playHistory, userId);
  const migrationKey = userId ? `${STORAGE_KEYS.migrationDone}:${userId}` : "";

  // Read from localStorage
  const readLocal = useCallback((): HistoryEntry[] => {
    try {
      return JSON.parse(localStorage.getItem(localKey) || "[]");
    } catch {
      return [];
    }
  }, [localKey]);

  // Write to localStorage (cache)
  const writeLocal = useCallback((entries: HistoryEntry[]) => {
    try {
      localStorage.setItem(localKey, JSON.stringify(entries.slice(0, MAX_HISTORY)));
    } catch { /* quota exceeded — ignore */ }
  }, [localKey]);

  // Fetch from server
  const fetchFromServer = useCallback(async (): Promise<HistoryEntry[] | null> => {
    try {
      const res = await fetch("/api/plays/history");
      if (!res.ok) return null;
      const data = await res.json();
      return (data.plays || []).map(recordToEntry);
    } catch {
      return null;
    }
  }, []);

  // One-time migration from localStorage to server
  const migrate = useCallback(async () => {
    if (!userId || migratingRef.current) return;
    if (localStorage.getItem(migrationKey)) return;
    migratingRef.current = true;

    const local = readLocal();
    if (local.length === 0) {
      localStorage.setItem(migrationKey, "true");
      migratingRef.current = false;
      return;
    }

    try {
      const res = await fetch("/api/plays/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: local }),
      });
      if (res.ok) {
        localStorage.setItem(migrationKey, "true");
      }
    } catch { /* retry next load */ }
    migratingRef.current = false;
  }, [userId, migrationKey, readLocal]);

  // Load history on mount
  useEffect(() => {
    if (!userId || fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      setLoading(true);

      // Try migration first
      await migrate();

      // Fetch from server
      const serverData = await fetchFromServer();
      if (serverData) {
        setHistory(serverData);
        writeLocal(serverData);
      } else {
        // Offline fallback
        setHistory(readLocal());
      }
      setLoading(false);
    })();
  }, [userId, migrate, fetchFromServer, readLocal, writeLocal]);

  // Save a new play
  const savePlay = useCallback(async (entry: HistoryEntry) => {
    // Optimistic local update
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      writeLocal(updated);
      return updated;
    });

    // Fire-and-forget server save
    try {
      const res = await fetch("/api/plays/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: entry.question,
          context: entry.context,
          play_data: entry.play,
          timestamp: entry.timestamp,
          rx_number: entry.rxNumber,
          client_name: entry.clientName,
          thread_id: entry.threadId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Update the entry with server-assigned ID
        setHistory((prev) => {
          const updated = prev.map((e) =>
            e.timestamp === entry.timestamp ? { ...e, id: data.id } : e
          );
          writeLocal(updated);
          return updated;
        });
      }
    } catch { /* localStorage has it, retry later */ }
  }, [writeLocal]);

  // Update a play (play_data change after simulation/perspectives)
  const updatePlay = useCallback(async (timestamp: number, play: Play) => {
    let entryId: string | undefined;

    setHistory((prev) => {
      const updated = prev.map((e) => {
        if (e.timestamp === timestamp) {
          entryId = e.id;
          return { ...e, play };
        }
        return e;
      });
      writeLocal(updated);
      return updated;
    });

    // Server update
    try {
      await fetch("/api/plays/history", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: entryId,
          timestamp,
          play_data: play,
        }),
      });
    } catch { /* localStorage has it */ }
  }, [writeLocal]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (timestamp: number) => {
    let newFav = false;
    let entryId: string | undefined;

    setHistory((prev) => {
      const updated = prev.map((e) => {
        if (e.timestamp === timestamp) {
          newFav = !e.favorite;
          entryId = e.id;
          return { ...e, favorite: newFav };
        }
        return e;
      });
      writeLocal(updated);
      return updated;
    });

    try {
      await fetch("/api/plays/history", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entryId, timestamp, favorite: newFav }),
      });
    } catch { /* localStorage has it */ }
  }, [writeLocal]);

  // Clear all history
  const clearHistory = useCallback(async () => {
    setHistory([]);
    writeLocal([]);
    // Server-side: we don't bulk delete for safety — user can do that from Supabase dashboard if needed
  }, [writeLocal]);

  return { history, loading, savePlay, updatePlay, toggleFavorite, clearHistory };
}
