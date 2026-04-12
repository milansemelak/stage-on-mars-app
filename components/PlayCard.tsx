"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Play, Perspective } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { STORAGE_KEYS, MAX_HISTORY, userKey } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import Prescription from "./Prescription";
import StageSimulation from "./StageSimulation";

type Props = {
  play: Play;
  question?: string;
  onPlayUpdate?: (play: Play) => void;
  onPlayCompleted?: () => void;
  onAskQuestion?: (question: string) => void;
  favorite?: boolean;
  onToggleFavorite?: () => void;
  rxNumber?: string;
  clientName?: string;
};

export default function PlayCard({ play, question, onPlayUpdate, onPlayCompleted, onAskQuestion, favorite, onToggleFavorite, rxNumber, clientName }: Props) {
  const { lang, t } = useI18n();
  const { user } = useAuth();
  const [currentPlay, setCurrentPlay] = useState(play);
  const playRef = useRef(currentPlay);
  playRef.current = currentPlay;

  // Sync when parent passes a new play (e.g. regeneration)
  useEffect(() => {
    setCurrentPlay(play);
  }, [play]);

  const [showPrescription, setShowPrescription] = useState(false);
  const [prescribed, setPrescribed] = useState(false);
  const [marsLoading, setMarsLoading] = useState(false);
  const [perspectivesLoading, setPerspectivesLoading] = useState(false);
  const [marsError, setMarsError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: play.name,
    image: play.image,
    authorRole: play.authorRole,
    endingPerspective: play.endingPerspective,
  });
  const [copied, setCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  // Perspectives are hidden until the user explicitly ends the play.
  // Exception: history reload (play already has perspectives AND simulationSteps) → show immediately.
  const [perspectivesRevealed, setPerspectivesRevealed] = useState(
    !!(play.perspectives && play.perspectives.length > 0 && play.simulationSteps && play.simulationSteps.length > 0)
  );
  // Layered perspective reveal — each one appears one at a time
  const [visiblePerspectives, setVisiblePerspectives] = useState(
    play.perspectives?.length || 0
  );
  // Typewriter for follow-up question
  const [typedChars, setTypedChars] = useState(0);
  const [typingDone, setTypingDone] = useState(!!(play.followUpQuestion));
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Cascade perspectives one by one after reveal
  useEffect(() => {
    if (!perspectivesRevealed || !currentPlay.perspectives?.length) return;
    if (!currentPlay.simulation) {
      // No simulation — show all immediately (history view)
      setVisiblePerspectives(currentPlay.perspectives.length);
      setTypingDone(true);
      return;
    }

    const total = currentPlay.perspectives.length;
    if (visiblePerspectives >= total) {
      // All perspectives shown — start typing follow-up
      if (currentPlay.followUpQuestion && !typingDone) {
        const text = currentPlay.followUpQuestion;
        let charIdx = 0;
        typingRef.current = setInterval(() => {
          charIdx++;
          setTypedChars(charIdx);
          if (charIdx >= text.length) {
            if (typingRef.current) clearInterval(typingRef.current);
            setTypingDone(true);
          }
        }, 35);
        return () => {
          if (typingRef.current) clearInterval(typingRef.current);
        };
      }
      return;
    }

    // Reveal next perspective after delay
    const delay = visiblePerspectives === 0 ? 800 : 2500; // first one faster, rest give time to read
    const timer = setTimeout(() => {
      setVisiblePerspectives((p) => p + 1);
    }, delay);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perspectivesRevealed, visiblePerspectives, currentPlay.perspectives?.length, currentPlay.simulation]);

  async function fetchFromMars() {
    setMarsLoading(true);
    setMarsError(null);
    setPerspectivesRevealed(false);
    try {
      const response = await fetch("/api/generate-mars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ play: currentPlay, question, lang, clientName, phase: "sim" }),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      const updated = {
        ...currentPlay,
        simulation: data.simulation,
        simulationSteps: data.simulationSteps,
        // Clear any stale perspectives — they will be fetched after END
        perspectives: undefined,
        followUpQuestion: undefined,
      };
      setCurrentPlay(updated);
      onPlayUpdate?.(updated);
    } catch {
      setMarsError(t.marsError);
    } finally {
      setMarsLoading(false);
    }
  }

  async function fetchPerspectives() {
    const cp = playRef.current;
    if (!cp.simulationSteps) return;
    setPerspectivesLoading(true);
    setMarsError(null);
    try {
      const response = await fetch("/api/generate-mars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ play: cp, question, lang, clientName, phase: "perspectives" }),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      const updated = {
        ...cp,
        perspectives: data.perspectives,
        followUpQuestion: data.followUpQuestion || undefined,
      };
      setCurrentPlay(updated);
      onPlayUpdate?.(updated);
      onPlayCompleted?.();
    } catch {
      setMarsError(t.marsError);
    } finally {
      setPerspectivesLoading(false);
    }
  }

  function handlePrescribe() {
    const rxKey = userKey(STORAGE_KEYS.prescriptions, user?.id);
    const prescriptions = JSON.parse(
      localStorage.getItem(rxKey) || "[]"
    );
    prescriptions.unshift({
      play: currentPlay,
      question: question || "",
      timestamp: Date.now(),
      rxNumber: rxNumber || `SOM-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    });
    localStorage.setItem(
      rxKey,
      JSON.stringify(prescriptions.slice(0, MAX_HISTORY))
    );

    setPrescribed(true);
    setShowPrescription(true);
  }

  async function handleShareLink() {
    if (shareLoading) return;
    setShareLoading(true);
    try {
      const res = await fetch("/api/plays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          play_data: currentPlay,
          question: question || "",
          lang,
          client_name: clientName || "",
        }),
      });
      if (!res.ok) throw new Error("Failed to share");
      const data = await res.json();
      const url = `https://playbook.stageonmars.com/p/${data.code}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Share link error:", err);
    } finally {
      setShareLoading(false);
    }
  }

  function startEditing() {
    setEditData({
      name: currentPlay.name,
      image: currentPlay.image,
      authorRole: currentPlay.authorRole,
      endingPerspective: currentPlay.endingPerspective,
    });
    setEditing(true);
  }

  function saveEdits() {
    const updated = {
      ...currentPlay,
      name: editData.name,
      image: editData.image,
      authorRole: editData.authorRole,
      endingPerspective: editData.endingPerspective,
      // Clear old simulation so it re-generates with edited play
      simulation: undefined,
      simulationSteps: undefined,
      perspectives: undefined,
      followUpQuestion: undefined,
    };
    setCurrentPlay(updated);
    setPerspectivesRevealed(false);
    onPlayUpdate?.(updated);
    setEditing(false);
  }

  function cancelEdits() {
    setEditing(false);
  }

  const copyAsText = useCallback(async () => {
    const lines = [
      currentPlay.name,
      `${currentPlay.mood} · ${currentPlay.duration} · ${currentPlay.playerCount.min}-${currentPlay.playerCount.max} ${t.players}`,
      "",
      `${t.theImage}:`,
      currentPlay.image,
      "",
      `${t.characters}:`,
      ...currentPlay.characters.map((c) => `- ${c.name} (${c.description})`),
      "",
      `${t.authorsRole}:`,
      currentPlay.authorRole,
      "",
      `${t.endingPerspective}:`,
      currentPlay.endingPerspective,
    ];

    if (currentPlay.simulation) {
      lines.push("", `${t.simulationTitle}:`, currentPlay.simulation);
    }
    if (currentPlay.perspectives?.length) {
      lines.push("", `${t.perspectivesTitle}:`);
      currentPlay.perspectives.forEach((p, i) => {
        if (typeof p === "object" && p !== null) {
          const sp = p as Perspective;
          lines.push(`${i + 1}. [${sp.character}] ${sp.insight}`);
        } else {
          lines.push(`${i + 1}. ${p}`);
        }
      });
    }

    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentPlay, t]);

  // Clear simulation when play content changes so it re-generates
  function clearSimulation(updated: Play): Play {
    return {
      ...updated,
      simulation: undefined,
      simulationSteps: undefined,
      perspectives: undefined,
      followUpQuestion: undefined,
    };
  }

  function updateCharacterName(index: number, newName: string) {
    const updated = { ...currentPlay };
    updated.characters = [...updated.characters];
    updated.characters[index] = { ...updated.characters[index], name: newName };
    const cleared = clearSimulation(updated);
    setCurrentPlay(cleared);
    setPerspectivesRevealed(false);
    onPlayUpdate?.(cleared);
  }

  function toggleCharacterType(index: number) {
    const updated = { ...currentPlay };
    updated.characters = [...updated.characters];
    const current = updated.characters[index].description?.toLowerCase();
    updated.characters[index] = {
      ...updated.characters[index],
      description: current === "abstract" ? "concrete" : "abstract",
    };
    const cleared = clearSimulation(updated);
    setCurrentPlay(cleared);
    setPerspectivesRevealed(false);
    onPlayUpdate?.(cleared);
  }

  function removeCharacter(index: number) {
    if (currentPlay.characters.length <= 2) return;
    const updated = { ...currentPlay };
    updated.characters = updated.characters.filter((_, i) => i !== index);
    const cleared = clearSimulation(updated);
    setCurrentPlay(cleared);
    setPerspectivesRevealed(false);
    onPlayUpdate?.(cleared);
  }

  function addCharacter() {
    const updated = { ...currentPlay };
    updated.characters = [...updated.characters, { name: "", description: "concrete" }];
    const cleared = clearSimulation(updated);
    setCurrentPlay(cleared);
    setPerspectivesRevealed(false);
    onPlayUpdate?.(cleared);
  }

  return (
    <>
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
          {/* Play name — hero element */}
          <div className="animate-fade-slide-up stagger-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {editing ? (
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="text-2xl sm:text-3xl font-bold text-white leading-tight bg-transparent border-b border-mars/40 focus:outline-none focus:border-mars w-full"
                  />
                ) : (
                  <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {currentPlay.name}
                  </h3>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                  <span className="font-mercure italic text-mars/50">{currentPlay.mood}</span>
                  <span className="text-white/10">|</span>
                  <span>{currentPlay.duration}</span>
                  <span className="text-white/10">|</span>
                  <span>
                    {currentPlay.playerCount.min}-{currentPlay.playerCount.max} {t.players}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onToggleFavorite && (
                  <button
                    onClick={onToggleFavorite}
                    className={`text-lg transition-all ${favorite ? "text-mars scale-110" : "text-white/20 hover:text-white/40"}`}
                    title={favorite ? t.unfavorite : t.favorite}
                  >
                    {favorite ? "★" : "☆"}
                  </button>
                )}
                {!editing ? (
                  <button
                    onClick={startEditing}
                    className="text-white/20 hover:text-white/50 text-xs border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={saveEdits}
                      className="text-green-400/70 hover:text-green-400 text-xs border border-green-500/20 hover:border-green-500/40 rounded-lg px-2 py-1 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdits}
                      className="text-white/30 hover:text-white/50 text-xs border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* The Image / Stage Directions */}
          <div className="animate-fade-slide-up stagger-2">
            <SectionLabel color="mars">{t.theImage}</SectionLabel>
            {editing ? (
              <textarea
                value={editData.image}
                onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                rows={3}
                className="w-full text-white/70 text-sm sm:text-base leading-relaxed mt-2 bg-transparent border border-white/10 rounded-lg p-3 focus:outline-none focus:border-mars/40 resize-none"
              />
            ) : (
              <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-2">
                {currentPlay.image}
              </p>
            )}
          </div>

          {/* Characters — concrete vs abstract */}
          <div className="animate-fade-slide-up stagger-3">
            <SectionLabel color="mars">{t.characters}</SectionLabel>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentPlay.characters.map((char, i) => {
                const isAbstract =
                  char.description?.toLowerCase() === "abstract";
                return (
                  <div
                    key={i}
                    className={`char-reveal char-delay-${Math.min(i, 5)} rounded-2xl border px-5 py-4 transition-all hover:scale-[1.01] relative ${
                      isAbstract
                        ? "bg-white/[0.02] border-white/10 hover:border-white/20"
                        : "bg-mars/8 border-mars/20 hover:border-mars/35"
                    }`}
                  >
                    {editing ? (
                      <>
                        <div className="flex items-center gap-2">
                          <input
                            value={char.name}
                            onChange={(e) => updateCharacterName(i, e.target.value)}
                            className={`font-bold text-sm sm:text-base bg-transparent border-b focus:outline-none flex-1 ${
                              isAbstract ? "text-white/70 font-mercure italic border-white/20 focus:border-white/40" : "text-[#ffb380] border-mars/30 focus:border-mars/60"
                            }`}
                          />
                          {currentPlay.characters.length > 2 && (
                            <button
                              onClick={() => removeCharacter(i)}
                              className="text-white/20 hover:text-red-400/70 transition-colors text-lg leading-none"
                              title="Remove"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => toggleCharacterType(i)}
                          className={`text-[10px] uppercase tracking-widest mt-1 cursor-pointer hover:opacity-70 transition-opacity ${
                            isAbstract ? "text-white/20" : "text-mars/30"
                          }`}
                        >
                          {isAbstract ? t.abstract : t.concrete} ↔
                        </button>
                      </>
                    ) : (
                      <>
                        <div
                          className={`font-bold text-sm sm:text-base ${
                            isAbstract ? "text-white/70 font-mercure italic" : "text-[#ffb380]"
                          }`}
                        >
                          {char.name}
                        </div>
                        <div
                          className={`text-[10px] uppercase tracking-widest mt-1 ${
                            isAbstract ? "text-white/20" : "text-mars/30"
                          }`}
                        >
                          {isAbstract ? t.abstract : t.concrete}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            {editing && (
              <button
                onClick={addCharacter}
                className="mt-3 w-full py-3 rounded-2xl border border-dashed border-white/10 hover:border-white/25 text-white/25 hover:text-white/50 text-sm transition-all"
              >
                + {t.addCharacter || "Add character"}
              </button>
            )}
          </div>

          {/* Author's Role */}
          <div className="animate-fade-slide-up stagger-4">
            <SectionLabel color="green">{t.authorsRole}</SectionLabel>
            {editing ? (
              <textarea
                value={editData.authorRole}
                onChange={(e) => setEditData({ ...editData, authorRole: e.target.value })}
                rows={2}
                className="w-full text-white/70 text-sm sm:text-base leading-relaxed mt-2 bg-transparent border border-white/10 rounded-lg p-3 focus:outline-none focus:border-mars/40 resize-none"
              />
            ) : (
              <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-2">
                {currentPlay.authorRole}
              </p>
            )}
          </div>

          {/* Ending Perspective — always visible, it's an instruction for live play */}
          <div className="animate-fade-slide-up stagger-5">
            <SectionLabel color="purple">{t.endingPerspective}</SectionLabel>
            {editing ? (
              <textarea
                value={editData.endingPerspective}
                onChange={(e) => setEditData({ ...editData, endingPerspective: e.target.value })}
                rows={2}
                className="w-full text-white/70 text-sm sm:text-base leading-relaxed mt-2 bg-transparent border border-white/10 rounded-lg p-3 focus:outline-none focus:border-mars/40 resize-none"
              />
            ) : (
              <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-2">
                {currentPlay.endingPerspective}
              </p>
            )}
          </div>

          {/* ── Step 2: See what happens ── */}
          {!currentPlay.simulation && !marsLoading && (
            <div className="animate-fade-slide-up stagger-6">
              {marsError && (
                <p className="text-red-400/70 text-xs mb-3 text-center">{marsError}</p>
              )}
              <button
                onClick={fetchFromMars}
                className="w-full py-5 rounded-2xl bg-mars hover:bg-mars-light text-white font-black text-lg sm:text-xl tracking-widest uppercase transition-all shadow-lg shadow-mars/20 hover:shadow-mars/40"
              >
                {t.fromMars}
              </button>
            </div>
          )}

          {marsLoading && (
            <div className="animate-fade-slide-up stagger-6 mt-4">
              <StageSimulation
                characters={currentPlay.characters}
                loading={true}
                clientName={clientName}
              />
            </div>
          )}

          {/* ── What Happens on Stage — Visual Simulation ── */}
          {currentPlay.simulation && (
            <div className="animate-fade-slide-up stagger-6 mt-4">
              <StageSimulation
                characters={currentPlay.characters}
                simulation={currentPlay.simulation}
                simulationSteps={currentPlay.simulationSteps}
                clientName={clientName}
                onEnd={() => {
                  setPerspectivesRevealed(true);
                  setVisiblePerspectives(0);
                  setTypedChars(0);
                  setTypingDone(false);
                  if (!currentPlay.perspectives || currentPlay.perspectives.length === 0) {
                    fetchPerspectives();
                  }
                }}
              />
            </div>
          )}

          {/* ── Perspectives loading — skeleton cards ── */}
          {perspectivesLoading && perspectivesRevealed && !(currentPlay.perspectives?.length) && (
            <div className="rounded-2xl border border-mars/[0.12] bg-gradient-to-b from-mars/[0.04] to-transparent px-4 py-7 sm:p-10 animate-fade-in">
              <div className="text-center mb-6 sm:mb-8">
                <p className="text-mars/60 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold mb-2 animate-pulse">{t.whatTheStageRevealed}</p>
                <h3 className="font-mercure italic text-white/40 text-[18px] sm:text-[26px] leading-[1.25] animate-pulse">{t.landingStageShowedYou}</h3>
              </div>
              {/* Author skeleton */}
              <div className="rounded-2xl border-2 border-[rgba(255,215,0,0.15)] bg-[rgba(255,215,0,0.02)] px-5 py-8 sm:p-10 mb-6 sm:mb-8 mt-3 animate-pulse">
                <div className="mx-auto w-28 h-3 rounded-full bg-[rgba(255,215,0,0.15)] mb-5" />
                <div className="space-y-2.5 max-w-xs mx-auto">
                  <div className="h-3 rounded-full bg-white/[0.06]" />
                  <div className="h-3 rounded-full bg-white/[0.04] w-4/5 mx-auto" />
                </div>
              </div>
              {/* Character skeletons */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-white/[0.06]" />
                <div className="w-16 h-2 rounded-full bg-white/[0.08] animate-pulse" />
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="rounded-xl border border-mars/10 bg-mars/[0.02] p-4 sm:p-5 animate-pulse" style={{ animationDelay: `${j * 0.15}s` }}>
                    <div className="w-20 h-2 rounded-full bg-mars/15 mb-3" />
                    <div className="space-y-2">
                      <div className="h-2.5 rounded-full bg-white/[0.04]" />
                      <div className="h-2.5 rounded-full bg-white/[0.03] w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Perspectives error — retry ── */}
          {perspectivesRevealed && !perspectivesLoading && !(currentPlay.perspectives?.length) && marsError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] px-4 py-8 sm:p-10 animate-fade-in text-center">
              <p className="text-red-400/70 text-sm mb-4">{marsError}</p>
              <button
                onClick={() => { setMarsError(null); fetchPerspectives(); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mars/40 bg-mars/[0.06] hover:bg-mars/[0.12] hover:border-mars/60 transition-all"
              >
                <span className="text-mars font-bold text-[11px] uppercase tracking-[0.2em]">{lang === "sk" ? "Skúsiť znova" : lang === "cs" ? "Zkusit znovu" : "Try again"}</span>
              </button>
            </div>
          )}

          {/* ── Perspectives — unified panel, color-coded by character type ── */}
          {currentPlay.perspectives && currentPlay.perspectives.length > 0 && (perspectivesRevealed || !currentPlay.simulation) && (
            <div className="rounded-2xl border border-mars/[0.12] bg-gradient-to-b from-mars/[0.04] to-transparent px-4 py-7 sm:p-10 animate-fade-in">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8" style={currentPlay.simulation ? { animation: "perspectiveReveal 0.8s ease-out forwards" } : undefined}>
                <p className="text-mars/60 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold mb-2">{t.whatTheStageRevealed}</p>
                <h3 className="font-mercure italic text-white/85 text-[18px] sm:text-[26px] leading-[1.25]">
                  {t.landingStageShowedYou}
                </h3>
              </div>

              {/* Perspectives — hero author + characters grid */}
              {(() => {
                const structured = currentPlay.perspectives!
                  .map((p) => (typeof p === "object" ? (p as Perspective) : null))
                  .filter((p): p is Perspective => p !== null);
                const isAuthorP = (sp: Perspective) => {
                  const matched = currentPlay.characters.find(
                    (c) => c.name.toLowerCase() === sp.character.toLowerCase()
                  );
                  return !matched && !!sp.character;
                };
                const authorP = structured.find(isAuthorP);
                const charPs = structured.filter((p) => !isAuthorP(p));

                const showAuthor = !currentPlay.simulation || visiblePerspectives >= 1;

                return (
                  <>
                    {authorP && showAuthor && (
                      <div
                        className="relative rounded-2xl border-2 border-[rgba(255,215,0,0.35)] bg-gradient-to-b from-[rgba(255,215,0,0.08)] to-[rgba(255,215,0,0.02)] px-5 py-8 sm:p-10 shadow-[0_0_40px_-16px_rgba(255,215,0,0.35)] sm:shadow-[0_0_80px_-20px_rgba(255,215,0,0.35)] mb-6 sm:mb-8 mt-3"
                        style={{ animation: !currentPlay.simulation ? `fadeIn 0.6s ease 0s both` : undefined }}
                      >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 max-w-[calc(100%-24px)] px-2.5 sm:px-3 py-1 rounded-full bg-black border border-[rgba(255,215,0,0.5)] whitespace-nowrap overflow-hidden">
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em] sm:tracking-[0.25em] text-[rgba(255,215,0,0.95)] truncate block">
                            {authorP.character} · {t.landingYouBadge}
                          </span>
                        </div>
                        <p className="text-white text-[17px] sm:text-[24px] leading-[1.45] sm:leading-[1.4] font-mercure italic text-center">
                          {authorP.insight}
                        </p>
                      </div>
                    )}

                    {charPs.length > 0 && (
                      <>
                        <div className="flex items-center gap-3 mb-4 sm:mb-5">
                          <div className="h-px flex-1 bg-white/[0.08]" />
                          <span className="text-white/35 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">
                            {t.characters}
                          </span>
                          <div className="h-px flex-1 bg-white/[0.08]" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                          {charPs.map((sp, i) => {
                            const isVisible = !currentPlay.simulation || visiblePerspectives >= i + 2;
                            if (!isVisible) return null;
                            const matched = currentPlay.characters.find(
                              (c) => c.name.toLowerCase() === sp.character.toLowerCase()
                            );
                            const isAbstract = matched?.description?.toLowerCase() === "abstract";
                            const accent = isAbstract
                              ? { dot: "bg-white/70", text: "text-white/70", border: "border-white/[0.12]", bg: "bg-white/[0.02]" }
                              : { dot: "bg-mars shadow-[0_0_6px_rgba(255,85,0,0.5)]", text: "text-mars", border: "border-mars/20", bg: "bg-mars/[0.04]" };
                            return (
                              <div
                                key={i}
                                className={`rounded-xl border ${accent.border} ${accent.bg} p-4 sm:p-5 animate-fade-in`}
                                style={{ animation: !currentPlay.simulation ? `fadeIn 0.6s ease ${(i + 1) * 0.15}s both` : undefined }}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${accent.dot}`} />
                                  <p className={`${accent.text} text-[10px] font-bold uppercase tracking-[0.18em] truncate`}>
                                    {sp.character}
                                  </p>
                                </div>
                                <p className="text-white/85 text-[15px] leading-[1.5] font-mercure italic">
                                  {sp.insight}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* ── Follow-up question — typewriter reveal ── */}
          {currentPlay.followUpQuestion && perspectivesRevealed && visiblePerspectives >= (currentPlay.perspectives?.length || 0) && (
            <div className="relative animate-fade-in">
              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">{t.nextQuestion}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              </div>

              <button
                onClick={typingDone ? () => onAskQuestion?.(currentPlay.followUpQuestion!) : undefined}
                className={`w-full text-left ${typingDone ? "group cursor-pointer" : "cursor-default"}`}
              >
                <div className={`rounded-2xl border px-6 sm:px-8 py-6 transition-all ${
                  typingDone
                    ? "border-mars/30 hover:border-mars/50 bg-mars/[0.08] hover:bg-mars/[0.12] shadow-[0_0_30px_-8px_rgba(255,85,0,0.15)]"
                    : "border-mars/10 bg-mars/[0.04]"
                }`}>
                  <p className="text-white group-hover:text-white text-base sm:text-lg font-mercure italic leading-relaxed transition-colors">
                    &ldquo;{currentPlay.simulation && !typingDone
                      ? currentPlay.followUpQuestion.slice(0, typedChars)
                      : currentPlay.followUpQuestion
                    }{currentPlay.simulation && !typingDone && <span className="inline-block w-[2px] h-[1em] bg-mars ml-0.5 animate-pulse" />}&rdquo;
                  </p>
                  {typingDone && (
                    <span className="text-mars group-hover:text-mars-light text-xs font-black uppercase tracking-widest mt-3 block transition-colors animate-fade-in">
                      {t.askThis}
                    </span>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Actions — only after everything is revealed */}
          {typingDone && perspectivesRevealed && visiblePerspectives >= (currentPlay.perspectives?.length || 0) && (
            <div className="flex gap-3 pt-2 animate-fade-in">
              <a
                href="https://www.stageonmars.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all text-center bg-mars/15 border border-mars/30 hover:bg-mars/25 hover:border-mars/50 text-mars hover:text-mars-light shadow-[0_0_20px_-4px_rgba(255,85,0,0.2)] hover:shadow-[0_0_30px_-4px_rgba(255,85,0,0.3)]"
              >
                {t.prescribe}
              </a>
              <button
                onClick={handleShareLink}
                disabled={shareLoading}
                className="py-3 px-4 rounded-xl border border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/20 text-sm font-medium transition-all disabled:opacity-50"
              >
                {shareLoading ? t.sharing : copied ? t.linkCopied : t.shareLink}
              </button>
              <button
                onClick={handlePrescribe}
                className="py-3 px-4 rounded-xl border border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/20 text-sm font-medium transition-all"
              >
                {t.sharePlay}
              </button>
            </div>
          )}

          {/* Actions — before simulation (no gate needed) */}
          {!currentPlay.simulation && !marsLoading && (
            <div className="animate-fade-slide-up stagger-7 flex gap-3 pt-2">
              <a
                href="https://www.stageonmars.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all text-center bg-mars/15 border border-mars/30 hover:bg-mars/25 hover:border-mars/50 text-mars hover:text-mars-light shadow-[0_0_20px_-4px_rgba(255,85,0,0.2)] hover:shadow-[0_0_30px_-4px_rgba(255,85,0,0.3)]"
              >
                {t.prescribe}
              </a>
              <button
                onClick={handlePrescribe}
                className="py-3 px-4 rounded-xl border border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/20 text-sm font-medium transition-all"
              >
                {t.sharePlay}
              </button>
            </div>
          )}
        </div>
      </div>

      {showPrescription && (
        <Prescription
          play={currentPlay}
          question={question || ""}
          rxNumber={rxNumber}
          onClose={() => setShowPrescription(false)}
        />
      )}
    </>
  );
}

function SectionLabel({
  color,
  children,
}: {
  color: "mars" | "blue" | "green" | "purple" | "white";
  children: React.ReactNode;
}) {
  const colors = {
    mars: "text-mars-light/60",
    blue: "text-blue-400/60",
    green: "text-green-400/60",
    purple: "text-purple-400/60",
    white: "text-white/40",
  };

  return (
    <span
      className={`text-[11px] font-bold uppercase tracking-widest ${colors[color]}`}
    >
      {children}
    </span>
  );
}
