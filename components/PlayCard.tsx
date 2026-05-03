"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Perspective } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { STORAGE_KEYS, MAX_HISTORY, userKey } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import Prescription from "./Prescription";
import StageSimulation from "./StageSimulation";
import ShareMenu from "./ShareMenu";

type Props = {
  play: Play;
  question?: string;
  onPlayUpdate?: (play: Play) => void;
  onPlayCompleted?: () => void;
  onAskQuestion?: (question: string) => void;
  onContinueThread?: () => void;
  favorite?: boolean;
  onToggleFavorite?: () => void;
  rxNumber?: string;
  clientName?: string;
};

export default function PlayCard({ play, question, onPlayUpdate, onPlayCompleted, onAskQuestion, onContinueThread, favorite, onToggleFavorite, rxNumber, clientName }: Props) {
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
        takeawayWord: data.takeawayWord || undefined,
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
      <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        {/* Top-right utility cluster — Edit, Favorite, Save/Cancel */}
        <div className="absolute top-4 right-4 lg:top-5 lg:right-5 z-10 flex items-center gap-2">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`text-lg lg:text-xl transition-all ${favorite ? "text-mars scale-110" : "text-white/25 hover:text-white/55"}`}
              title={favorite ? t.unfavorite : t.favorite}
            >
              {favorite ? "★" : "☆"}
            </button>
          )}
          {!editing ? (
            <button
              onClick={startEditing}
              className="text-white/30 hover:text-white/60 text-xs lg:text-sm border border-white/10 hover:border-white/25 rounded-lg px-2.5 py-1 lg:px-3 lg:py-1.5 transition-colors"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={saveEdits}
                className="text-green-400/80 hover:text-green-400 text-xs lg:text-sm border border-green-500/30 hover:border-green-500/50 rounded-lg px-2.5 py-1 lg:px-3 lg:py-1.5 transition-colors"
              >
                Save
              </button>
              <button
                onClick={cancelEdits}
                className="text-white/40 hover:text-white/60 text-xs lg:text-sm border border-white/10 hover:border-white/25 rounded-lg px-2.5 py-1 lg:px-3 lg:py-1.5 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-8 lg:p-8 xl:p-10 space-y-6 sm:space-y-8 lg:space-y-7">
          {/* DASHBOARD GRID — only static play info; post-play sections stay linear below */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-x-7 lg:gap-y-7">
          {/* Play name — hero element, full width */}
          <div className="animate-fade-slide-up stagger-1 lg:col-span-12 pr-24 lg:pr-28">
            {editing ? (
              <input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight bg-transparent border-b border-mars/40 focus:outline-none focus:border-mars w-full"
              />
            ) : (
              <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-[-0.02em]">
                {currentPlay.name}
              </h3>
            )}
            <div className="flex items-center gap-3 lg:gap-4 mt-2 lg:mt-4 text-xs lg:text-sm text-white/55">
              <span className="font-mercure italic text-mars/80">{currentPlay.mood}</span>
              <span className="text-white/15">|</span>
              <span>{currentPlay.duration}</span>
              <span className="text-white/15">|</span>
              <span>
                {currentPlay.playerCount.min}-{currentPlay.playerCount.max} {t.players}
              </span>
            </div>
          </div>

          {/* The Image / Stage Directions */}
          <div className="animate-fade-slide-up stagger-2 lg:col-span-7 lg:rounded-2xl lg:border lg:border-white/[0.06] lg:bg-white/[0.015] lg:p-5 xl:p-6 lg:h-full">
            <SectionLabel color="mars">{t.theImage}</SectionLabel>
            {editing ? (
              <textarea
                value={editData.image}
                onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                rows={3}
                className="w-full text-white/70 text-sm sm:text-base leading-relaxed mt-2 bg-transparent border border-white/10 rounded-lg p-3 focus:outline-none focus:border-mars/40 resize-none"
              />
            ) : (
              <p className="text-white/85 text-sm sm:text-[15px] lg:text-[15px] leading-[1.6] mt-2 font-mercure italic">
                {currentPlay.image}
              </p>
            )}
          </div>

          {/* Music for the play — sits next to Image on lg+ */}
          {currentPlay.music?.track && currentPlay.music?.artist && (
            <a
              href={`https://open.spotify.com/search/${encodeURIComponent(`${currentPlay.music.track} ${currentPlay.music.artist}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block animate-fade-slide-up stagger-5 lg:col-span-5 lg:h-full rounded-2xl border border-mars/25 bg-mars/[0.06] hover:bg-mars/[0.10] hover:border-mars/40 p-4 sm:p-5 lg:p-5 xl:p-6 transition-all group"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <svg className="w-3.5 h-3.5 text-mars shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span className="text-mars/80 text-[10px] font-bold uppercase tracking-[0.18em]">{t.musicLabel}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white text-[15px] lg:text-base font-bold truncate">
                    {currentPlay.music.track}
                  </p>
                  <p className="text-mars-light/85 text-[13px] lg:text-sm truncate font-mercure italic mt-0.5">
                    {currentPlay.music.artist}
                  </p>
                </div>
                <span className="text-mars/50 group-hover:text-mars-light text-[10px] font-bold uppercase tracking-[0.15em] shrink-0 transition-colors">
                  {t.openOnSpotify} →
                </span>
              </div>
              {currentPlay.music.reason && (
                <p className="text-white/55 text-[13px] mt-2 leading-[1.55] font-mercure italic">
                  {currentPlay.music.reason}
                </p>
              )}
            </a>
          )}

          {/* Characters — HERO casting tiles. Each character is the role someone will step into. */}
          <div className="animate-fade-slide-up stagger-3 lg:col-span-12">
            <SectionLabel color="mars">{t.characters}</SectionLabel>
            <div className="mt-3 lg:mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Author tile — always first, distinct gold treatment */}
              <div className="char-reveal char-delay-0 group relative rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.04] hover:border-amber-500/70 hover:from-amber-500/[0.18] hover:to-amber-500/[0.06] transition-all duration-300 hover:-translate-y-0.5 px-4 py-5 sm:px-5 sm:py-7 lg:px-5 lg:py-8 flex flex-col items-center text-center overflow-hidden">
                {/* Aura behind the dot */}
                <div className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-amber-400/20 blur-xl pointer-events-none group-hover:bg-amber-400/30 transition-colors" />
                <span className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(255,200,80,0.85)] mb-3 sm:mb-4 animate-pulse-glow" />
                <span className="font-black text-base sm:text-lg lg:text-xl text-amber-200 leading-tight tracking-tight break-words">
                  {clientName || t.author}
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-amber-400/60 font-bold mt-1.5 sm:mt-2">
                  {t.landingYouBadge}
                </span>
              </div>
              {currentPlay.characters.map((char, i) => {
                const isAbstract =
                  char.description?.toLowerCase() === "abstract";
                return (
                  <div
                    key={i}
                    className={`char-reveal char-delay-${Math.min(i, 5)} group relative rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 px-4 py-5 sm:px-5 sm:py-7 lg:px-5 lg:py-8 flex flex-col items-center text-center overflow-hidden ${
                      isAbstract
                        ? "bg-gradient-to-b from-white/[0.04] to-white/[0.01] border-white/15 hover:border-white/40 hover:from-white/[0.06]"
                        : "bg-gradient-to-b from-mars/[0.14] to-mars/[0.04] border-mars/40 hover:border-mars/70 hover:from-mars/[0.20]"
                    }`}
                  >
                    {/* Aura behind the dot */}
                    <div className={`absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full blur-xl pointer-events-none transition-colors ${
                      isAbstract ? "bg-white/[0.06] group-hover:bg-white/[0.12]" : "bg-mars/30 group-hover:bg-mars/45"
                    }`} />
                    {editing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleCharacterType(i)}
                          aria-label={isAbstract ? t.abstract : t.concrete}
                          title={isAbstract ? t.abstract : t.concrete}
                          className={`relative shrink-0 mb-3 sm:mb-4 rounded-full cursor-pointer hover:scale-110 transition-transform w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            isAbstract
                              ? "border-2 border-white/55"
                              : "bg-mars shadow-[0_0_18px_rgba(255,85,0,0.85)] animate-pulse-glow"
                          }`}
                        />
                        <input
                          value={char.name}
                          onChange={(e) => updateCharacterName(i, e.target.value)}
                          className={`relative w-full text-center font-black text-base sm:text-lg lg:text-xl bg-transparent border-b focus:outline-none ${
                            isAbstract ? "text-white/85 font-mercure italic border-white/20 focus:border-white/40" : "text-[#ffb380] border-mars/30 focus:border-mars/60"
                          }`}
                        />
                        {currentPlay.characters.length > 2 && (
                          <button
                            onClick={() => removeCharacter(i)}
                            className="absolute top-2 right-2 text-white/25 hover:text-red-400/80 transition-colors text-lg leading-none"
                            title="Remove"
                          >
                            ×
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <span
                          className={`relative shrink-0 mb-3 sm:mb-4 rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            isAbstract
                              ? "border-2 border-white/55"
                              : "bg-mars shadow-[0_0_18px_rgba(255,85,0,0.85)] animate-pulse-glow"
                          }`}
                        />
                        <span
                          className={`relative font-black text-base sm:text-lg lg:text-xl leading-tight tracking-tight break-words ${
                            isAbstract ? "text-white/90 font-mercure italic" : "text-[#ffb380]"
                          }`}
                        >
                          {char.name}
                        </span>
                        <span className={`relative text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mt-1.5 sm:mt-2 ${
                          isAbstract ? "text-white/30" : "text-mars/60"
                        }`}>
                          {isAbstract ? t.abstract : t.concrete}
                        </span>
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
          <div className="animate-fade-slide-up stagger-4 lg:col-span-7 lg:rounded-2xl lg:border lg:border-white/[0.06] lg:bg-white/[0.015] lg:p-5 xl:p-6 lg:h-full">
            <SectionLabel color="mars">{t.authorsRole}</SectionLabel>
            {editing ? (
              <textarea
                value={editData.authorRole}
                onChange={(e) => setEditData({ ...editData, authorRole: e.target.value })}
                rows={2}
                className="w-full text-white/70 text-sm sm:text-base leading-relaxed mt-2 bg-transparent border border-white/10 rounded-lg p-3 focus:outline-none focus:border-mars/40 resize-none"
              />
            ) : (
              <p className="text-white/85 text-sm sm:text-[15px] lg:text-[15px] leading-[1.6] mt-2">
                {currentPlay.authorRole}
              </p>
            )}
          </div>

          {/* Ending Perspective — always visible, it's an instruction for live play */}
          <div className="animate-fade-slide-up stagger-5 lg:col-span-5 lg:rounded-2xl lg:border lg:border-white/[0.06] lg:bg-white/[0.015] lg:p-5 xl:p-6 lg:h-full">
            <SectionLabel color="mars">{t.endingPerspective}</SectionLabel>
            {editing ? (
              <textarea
                value={editData.endingPerspective}
                onChange={(e) => setEditData({ ...editData, endingPerspective: e.target.value })}
                rows={2}
                className="w-full text-white/70 text-sm sm:text-base leading-relaxed mt-2 bg-transparent border border-white/10 rounded-lg p-3 focus:outline-none focus:border-mars/40 resize-none"
              />
            ) : (
              <p className="text-white/85 text-sm sm:text-[15px] lg:text-[15px] leading-[1.6] mt-2">
                {currentPlay.endingPerspective}
              </p>
            )}
          </div>
          </div>{/* end DASHBOARD GRID */}

          {/* ── Step 2: See what happens ── */}
          {!currentPlay.simulation && !marsLoading && (
            <div className="animate-fade-slide-up stagger-6">
              {marsError && (
                <p className="text-red-400/70 text-xs mb-3 text-center">{marsError}</p>
              )}
              <button
                onClick={fetchFromMars}
                className="group relative w-full py-5 lg:py-7 rounded-2xl text-white font-black text-lg sm:text-xl lg:text-2xl tracking-widest uppercase transition-all overflow-hidden bg-gradient-to-b from-mars-light to-mars hover:from-mars-light hover:to-mars-light shadow-[0_0_60px_-12px_rgba(255,85,0,0.55)] hover:shadow-[0_0_80px_-8px_rgba(255,85,0,0.75)] active:scale-[0.99]"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-3">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  {t.fromMars}
                </span>
                <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
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
                image={currentPlay.image}
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

          {/* ── Perspectives loading — cinematic transition ── */}
          {perspectivesLoading && perspectivesRevealed && !(currentPlay.perspectives?.length) && (
            <div className="text-center animate-fade-in py-10 sm:py-14">
              <div className="inline-flex items-center justify-center w-10 h-10 mb-5">
                <div className="w-8 h-8 border-2 border-mars/20 border-t-mars rounded-full animate-spin" />
              </div>
              <p className="font-mercure italic text-white/40 text-[15px] sm:text-[18px] leading-relaxed animate-pulse">
                {t.landingStageShowedYou}...
              </p>
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
                <p className="text-mars/50 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold mb-2">{t.whatTheStageRevealed}</p>
                <h3 className="text-white/80 text-[18px] sm:text-[24px] font-bold tracking-[-0.02em] leading-[1.2]">
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
                        <p className="text-white/90 text-[15px] sm:text-[18px] leading-[1.6] sm:leading-[1.55] text-center">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                                className={`rounded-xl border ${accent.border} ${accent.bg} px-5 py-5 sm:px-6 sm:py-6 animate-fade-in`}
                                style={{ animation: !currentPlay.simulation ? `fadeIn 0.6s ease ${(i + 1) * 0.15}s both` : undefined }}
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${accent.dot}`} />
                                  <p className={`${accent.text} text-[10px] font-bold uppercase tracking-[0.18em]`}>
                                    {sp.character}
                                  </p>
                                </div>
                                <p className="text-white/70 text-sm leading-[1.7]">
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

          {/* ── Takeaway word — the souvenir the author leaves with ── */}
          {(perspectivesRevealed || !currentPlay.simulation) && visiblePerspectives >= (currentPlay.perspectives?.length || 0) && (() => {
            // Prefer model-generated takeawayWord; fall back to shortest perspective for legacy plays
            const word = currentPlay.takeawayWord?.trim();
            let fallback: string | null = null;
            if (!word && currentPlay.perspectives?.length) {
              const persp = currentPlay.perspectives
                .map((p) => typeof p === "object" ? (p as Perspective).insight : p)
                .filter(Boolean);
              if (persp.length > 0) {
                fallback = [...persp].sort((a, b) => a.length - b.length)[0];
              }
            }
            const display = word || fallback;
            if (!display) return null;
            return (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-400/50">{t.playSynthesis}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent" />
                </div>
                <p className="text-center font-mercure italic text-amber-200/85 text-xl sm:text-2xl leading-[1.3] px-4 tracking-tight">
                  &ldquo;{display}&rdquo;
                </p>
                <p className="text-center text-white/25 text-[10px] uppercase tracking-[0.25em] mt-4 font-bold">
                  {t.sayItAloud}
                </p>
              </div>
            );
          })()}

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
                onClick={() => {
                  if (typingDone) {
                    onAskQuestion?.(currentPlay.followUpQuestion!);
                  } else {
                    // Skip typewriter: show the whole question instantly
                    if (typingRef.current) clearInterval(typingRef.current);
                    setTypedChars(currentPlay.followUpQuestion!.length);
                    setTypingDone(true);
                  }
                }}
                className="group w-full text-left cursor-pointer"
              >
                <div className={`rounded-2xl border px-6 sm:px-8 py-6 transition-all ${
                  typingDone
                    ? "border-mars/30 hover:border-mars/50 bg-mars/[0.08] hover:bg-mars/[0.12] shadow-[0_0_30px_-8px_rgba(255,85,0,0.15)]"
                    : "border-mars/10 bg-mars/[0.04] hover:border-mars/20"
                }`}>
                  <p className="text-white group-hover:text-white text-base sm:text-lg font-mercure italic leading-relaxed transition-colors">
                    &ldquo;{currentPlay.simulation && !typingDone
                      ? currentPlay.followUpQuestion.slice(0, typedChars)
                      : currentPlay.followUpQuestion
                    }{currentPlay.simulation && !typingDone && <span className="inline-block w-[2px] h-[1em] bg-mars ml-0.5 animate-pulse" />}&rdquo;
                  </p>
                  {typingDone ? (
                    <span className="text-mars group-hover:text-mars-light text-xs font-black uppercase tracking-widest mt-3 block transition-colors animate-fade-in">
                      {t.askThis}
                    </span>
                  ) : (
                    <span className="text-white/25 text-[10px] uppercase tracking-[0.2em] mt-3 block">
                      {t.tapToContinue}
                    </span>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Continue thread — shown in history context */}
          {onContinueThread && currentPlay.perspectives && currentPlay.perspectives.length > 0 && (
            <button
              onClick={onContinueThread}
              className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all text-center bg-white/[0.03] border border-white/[0.08] hover:border-mars/30 hover:bg-mars/[0.04] text-white/40 hover:text-mars animate-fade-in"
            >
              {t.continueThread} →
            </button>
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
              <ShareMenu
                play={currentPlay}
                question={question}
                clientName={clientName}
                onOpenPrescription={handlePrescribe}
              />
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
              <ShareMenu
                play={currentPlay}
                question={question}
                clientName={clientName}
                onOpenPrescription={handlePrescribe}
              />
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
    mars: "text-mars-light/80",
    blue: "text-blue-400/80",
    green: "text-green-400/80",
    purple: "text-purple-400/80",
    white: "text-white/55",
  };

  return (
    <span
      className={`text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.22em] lg:tracking-[0.26em] ${colors[color]}`}
    >
      {children}
    </span>
  );
}
