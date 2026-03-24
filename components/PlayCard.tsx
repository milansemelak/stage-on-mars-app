"use client";

import { useState } from "react";
import { Play } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import Prescription from "./Prescription";

type Props = {
  play: Play;
  question?: string;
  onPlayUpdate?: (play: Play) => void;
};

export default function PlayCard({ play, question, onPlayUpdate }: Props) {
  const { lang, t } = useI18n();
  const [currentPlay, setCurrentPlay] = useState(play);
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescribed, setPrescribed] = useState(false);
  const [marsLoading, setMarsLoading] = useState(false);
  const [marsError, setMarsError] = useState<string | null>(null);

  async function fetchFromMars() {
    setMarsLoading(true);
    setMarsError(null);
    try {
      const response = await fetch("/api/generate-mars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ play: currentPlay, question, lang }),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      const updated = { ...currentPlay, simulation: data.simulation, perspectives: data.perspectives };
      setCurrentPlay(updated);
      onPlayUpdate?.(updated);
    } catch {
      setMarsError(t.marsError);
    } finally {
      setMarsLoading(false);
    }
  }

  function handlePrescribe() {
    const prescriptions = JSON.parse(
      localStorage.getItem("som-prescriptions") || "[]"
    );
    prescriptions.unshift({
      play: currentPlay,
      question: question || "",
      timestamp: Date.now(),
      rxNumber: `SOM-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    });
    localStorage.setItem(
      "som-prescriptions",
      JSON.stringify(prescriptions.slice(0, 50))
    );

    setPrescribed(true);
    setShowPrescription(true);
  }

  async function handleShare() {
    const text = `${currentPlay.name}\n\n"${question}"\n\n${t.theImage}: ${currentPlay.image}\n\n${t.characters}: ${currentPlay.characters.map((c) => c.name).join(", ")}\n\n${t.authorsRole}: ${currentPlay.authorRole}\n\nhttps://playbook.stageonmars.com`;

    if (navigator.share) {
      try {
        await navigator.share({ title: play.name, text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  }

  return (
    <>
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
          {/* Play name — hero element */}
          <div className="animate-fade-slide-up stagger-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {currentPlay.name}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
              <span className="italic text-mars/50">{currentPlay.mood}</span>
              <span className="text-white/10">|</span>
              <span>{currentPlay.duration}</span>
              <span className="text-white/10">|</span>
              <span>
                {currentPlay.playerCount.min}-{currentPlay.playerCount.max} {t.players}
              </span>
            </div>
          </div>

          {/* The Image / Stage Directions */}
          <div className="animate-fade-slide-up stagger-2">
            <SectionLabel color="mars">{t.theImage}</SectionLabel>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-2">
              {currentPlay.image}
            </p>
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
                    className={`rounded-2xl border px-5 py-4 transition-all hover:scale-[1.01] ${
                      isAbstract
                        ? "bg-white/[0.02] border-white/10 hover:border-white/20"
                        : "bg-mars/8 border-mars/20 hover:border-mars/35"
                    }`}
                  >
                    <div
                      className={`font-bold text-sm sm:text-base ${
                        isAbstract ? "text-white/70 italic" : "text-[#ffb380]"
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* Author's Role */}
          <div className="animate-fade-slide-up stagger-4">
            <SectionLabel color="green">{t.authorsRole}</SectionLabel>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-2">
              {currentPlay.authorRole}
            </p>
          </div>

          {/* Ending Perspective */}
          <div className="animate-fade-slide-up stagger-5">
            <SectionLabel color="purple">{t.endingPerspective}</SectionLabel>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-2">
              {currentPlay.endingPerspective}
            </p>
          </div>

          {/* ── Step 2: From Mars ── */}
          {!currentPlay.simulation && !marsLoading && (
            <div className="animate-fade-slide-up stagger-6">
              {marsError && (
                <p className="text-red-400/70 text-xs mb-3 text-center">{marsError}</p>
              )}
              <button
                onClick={fetchFromMars}
                className="w-full py-4 rounded-2xl border border-mars/40 bg-mars/[0.06] hover:bg-mars/[0.12] hover:border-mars/60 text-mars-light font-bold text-sm tracking-wide transition-all"
              >
                {t.fromMars} →
              </button>
            </div>
          )}

          {marsLoading && (
            <div className="animate-fade-slide-up stagger-6 flex flex-col items-center gap-3 py-6">
              <div className="w-6 h-6 border-2 border-mars/20 border-t-mars rounded-full animate-spin" />
              <p className="text-white/30 text-sm italic">{t.loadingMars}</p>
            </div>
          )}

          {/* What Happens on Stage */}
          {currentPlay.simulation && (
            <div className="animate-fade-slide-up stagger-6 rounded-xl border border-mars/15 bg-mars/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-mars-light/70">
                  {t.simulationTitle}
                </span>
                <span className="text-xs text-white/20 italic">
                  {t.simulationSub}
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                {currentPlay.simulation}
              </p>
            </div>
          )}

          {/* Perspectives */}
          {currentPlay.perspectives && currentPlay.perspectives.length > 0 && (
            <div className="animate-fade-slide-up stagger-7 rounded-2xl border border-mars/30 bg-gradient-to-br from-mars/[0.10] to-mars/[0.04] p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-mars" />
                <span className="text-sm font-bold uppercase tracking-widest text-white/80">
                  {t.perspectivesTitle}
                </span>
              </div>
              <div className="space-y-5">
                {currentPlay.perspectives.map((p, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-mars/25 border border-mars/50 flex items-center justify-center">
                      <span className="text-mars-light font-bold text-xs">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-white text-base sm:text-lg leading-relaxed pt-0.5 font-medium">
                      {p}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="animate-fade-slide-up stagger-7 flex gap-3 pt-2">
            <button
              onClick={handlePrescribe}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                prescribed
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-mars hover:bg-mars-light text-white"
              }`}
            >
              {prescribed ? "✓ " + t.prescribed : t.prescribe}
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 text-sm transition-all"
            >
              {t.sharePlay}
            </button>
          </div>
        </div>
      </div>

      {showPrescription && (
        <Prescription
          play={currentPlay}
          question={question || ""}
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
