"use client";

import { useState, useCallback, useEffect } from "react";
import { Play, Perspective } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { STORAGE_KEYS, MAX_HISTORY } from "@/lib/constants";
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
  const [currentPlay, setCurrentPlay] = useState(play);

  // Sync when parent passes a new play (e.g. regeneration)
  useEffect(() => {
    setCurrentPlay(play);
  }, [play]);

  const [showPrescription, setShowPrescription] = useState(false);
  const [prescribed, setPrescribed] = useState(false);
  const [marsLoading, setMarsLoading] = useState(false);
  const [marsError, setMarsError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: play.name,
    image: play.image,
    authorRole: play.authorRole,
    endingPerspective: play.endingPerspective,
  });
  const [copied, setCopied] = useState(false);
  // Show perspectives immediately if they already exist (history/reload), hide until ritual if fresh
  const [perspectivesRevealed, setPerspectivesRevealed] = useState(
    !!(play.perspectives && play.perspectives.length > 0)
  );

  async function fetchFromMars() {
    setMarsLoading(true);
    setMarsError(null);
    setPerspectivesRevealed(false);
    try {
      const response = await fetch("/api/generate-mars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ play: currentPlay, question, lang, clientName }),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      const updated = {
        ...currentPlay,
        simulation: data.simulation,
        simulationSteps: data.simulationSteps,
        perspectives: data.perspectives,
        followUpQuestion: data.followUpQuestion || undefined,
      };
      setCurrentPlay(updated);
      onPlayUpdate?.(updated);
      onPlayCompleted?.();
    } catch {
      setMarsError(t.marsError);
    } finally {
      setMarsLoading(false);
    }
  }

  function handlePrescribe() {
    const prescriptions = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.prescriptions) || "[]"
    );
    prescriptions.unshift({
      play: currentPlay,
      question: question || "",
      timestamp: Date.now(),
      rxNumber: rxNumber || `SOM-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    });
    localStorage.setItem(
      STORAGE_KEYS.prescriptions,
      JSON.stringify(prescriptions.slice(0, MAX_HISTORY))
    );

    setPrescribed(true);
    setShowPrescription(true);
  }

  async function handleShare() {
    const text = `${currentPlay.name}\n\n"${question}"\n\n${t.theImage}: ${currentPlay.image}\n\n${t.characters}: ${currentPlay.characters.map((c) => c.name).join(", ")}\n\n${t.authorsRole}: ${currentPlay.authorRole}\n\nhttps://playbook.stageonmars.com`;

    if (navigator.share) {
      try {
        await navigator.share({ title: currentPlay.name, text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
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

          {/* Ending Perspective — only show before simulation exists (as preview) */}
          {!currentPlay.simulation && !marsLoading && (
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
          )}

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
                onEnd={() => setPerspectivesRevealed(true)}
              />
            </div>
          )}

          {/* ── Ending Perspective — after simulation, as conclusion ── */}
          {currentPlay.simulation && perspectivesRevealed && (
            <div
              className="relative"
              style={{ animation: "perspectiveReveal 0.8s ease-out forwards" }}
            >
              <div className="rounded-xl border border-purple-500/10 bg-purple-500/[0.03] px-5 sm:px-6 py-5">
                <SectionLabel color="purple">{t.endingPerspective}</SectionLabel>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-2">
                  {currentPlay.endingPerspective}
                </p>
              </div>
            </div>
          )}

          {/* ── Perspectives from the stage ── */}
          {currentPlay.perspectives && currentPlay.perspectives.length > 0 && (perspectivesRevealed || !currentPlay.simulation) && (
            <div
              className="relative"
              style={{ animation: currentPlay.simulation ? "perspectiveReveal 1s ease-out 0.4s forwards" : undefined, opacity: currentPlay.simulation ? 0 : 1 }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-mars/20 to-transparent" />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-mars/50">{t.whatTheStageRevealed}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-mars/20 to-transparent" />
              </div>

              {/* Perspectives */}
              <div className="space-y-4">
                {currentPlay.perspectives.map((p, i) => {
                  const isStructured = typeof p === "object" && p !== null;
                  const perspective = isStructured ? (p as Perspective) : null;
                  const insightText = perspective ? perspective.insight : (p as string);
                  const charName = perspective?.character;
                  const isFirst = i === 0;

                  // Find matching character for color
                  const matchedChar = charName
                    ? currentPlay.characters.find(
                        (c) => c.name.toLowerCase() === charName.toLowerCase()
                      )
                    : null;
                  const isAbstract = matchedChar?.description?.toLowerCase() === "abstract";

                  // Hero perspective (first) — dominant card
                  if (isFirst) {
                    return (
                      <div
                        key={i}
                        className="relative rounded-2xl overflow-hidden"
                        style={currentPlay.simulation ? {
                          animation: `perspectiveItemReveal 0.8s ease-out 0.6s both`,
                        } : undefined}
                      >
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-mars/60 to-transparent" />
                        <div className="bg-gradient-to-b from-mars/[0.08] via-mars/[0.04] to-transparent border border-mars/15 rounded-2xl px-6 sm:px-8 pt-7 pb-8">
                          <p className="text-white/95 text-lg sm:text-xl leading-relaxed font-medium">
                            &ldquo;{insightText}&rdquo;
                          </p>
                          {charName && (
                            <div className="mt-5 flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${isAbstract ? "bg-white/25" : "bg-mars/50"}`} />
                              <span className={`text-xs font-bold uppercase tracking-widest ${
                                isAbstract ? "text-white/35 font-mercure italic" : "text-mars-light/50"
                              }`}>
                                {charName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Supporting perspectives — each in its own subtle card
                  return (
                    <div
                      key={i}
                      className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 sm:px-6 py-4"
                      style={currentPlay.simulation ? {
                        animation: `perspectiveItemReveal 0.6s ease-out ${0.7 + i * 0.15}s both`,
                      } : undefined}
                    >
                      <div className="flex gap-4 items-start">
                        <div
                          className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                            isAbstract ? "bg-white/20" : "bg-mars/30"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white/75 text-sm sm:text-base leading-relaxed">
                            {insightText}
                          </p>
                          {charName && (
                            <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 block ${
                              isAbstract ? "text-white/20 font-mercure italic" : "text-mars-light/30"
                            }`}>
                              {charName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Follow-up question — prominent next chapter ── */}
          {currentPlay.followUpQuestion && perspectivesRevealed && (
            <div
              className="relative"
              style={currentPlay.simulation ? { animation: "perspectiveItemReveal 0.8s ease-out 1.5s both" } : undefined}
            >
              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">{t.nextQuestion}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              </div>

              <button
                onClick={() => onAskQuestion?.(currentPlay.followUpQuestion!)}
                className="w-full text-left group"
              >
                <div className="rounded-2xl border border-mars/15 hover:border-mars/35 bg-gradient-to-b from-mars/[0.05] to-transparent hover:from-mars/[0.08] px-6 sm:px-8 py-6 transition-all">
                  <p className="text-white/90 group-hover:text-white text-base sm:text-lg font-mercure italic leading-relaxed transition-colors">
                    &ldquo;{currentPlay.followUpQuestion}&rdquo;
                  </p>
                  <span className="text-mars/50 group-hover:text-mars/80 text-xs font-bold uppercase tracking-widest mt-3 block transition-colors">
                    {t.askThis}
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Actions — only after perspectives are revealed */}
          {perspectivesRevealed && (
            <div className="flex gap-3 pt-2" style={currentPlay.simulation ? { animation: "perspectiveItemReveal 0.6s ease-out 2s both" } : undefined}>
              <button
                onClick={handlePrescribe}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                  prescribed
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-white/8 border border-white/10 hover:bg-white/12 hover:border-white/20 text-white/70 hover:text-white"
                }`}
              >
                {prescribed ? "✓ " + t.prescribed : t.prescribe}
              </button>
              <button
                onClick={handleShare}
                className="py-3 px-4 rounded-xl border border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/20 text-sm font-medium transition-all"
              >
                {t.sharePlay}
              </button>
            </div>
          )}

          {/* Actions — before simulation (no gate needed) */}
          {!currentPlay.simulation && !marsLoading && (
            <div className="animate-fade-slide-up stagger-7 flex gap-3 pt-2">
              <button
                onClick={handlePrescribe}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                  prescribed
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-white/8 border border-white/10 hover:bg-white/12 hover:border-white/20 text-white/70 hover:text-white"
                }`}
              >
                {prescribed ? "✓ " + t.prescribed : t.prescribe}
              </button>
              <button
                onClick={handleShare}
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
