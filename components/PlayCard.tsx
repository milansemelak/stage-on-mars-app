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
        await navigator.share({ title: currentPlay.name, text });
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
              <span className="font-mercure italic text-mars/50">{currentPlay.mood}</span>
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
                className="w-full py-5 rounded-2xl bg-mars hover:bg-mars-light text-white font-black text-lg sm:text-xl tracking-widest uppercase transition-all shadow-lg shadow-mars/20 hover:shadow-mars/40"
              >
                {t.fromMars}
              </button>
            </div>
          )}

          {marsLoading && (
            <div className="animate-fade-slide-up stagger-6 flex flex-col items-center gap-3 py-6">
              <div className="w-6 h-6 border-2 border-mars/20 border-t-mars rounded-full animate-spin" />
              <p className="font-mercure text-white/30 text-sm italic">{t.loadingMars}</p>
            </div>
          )}

          {/* ── What Happens on Stage ── */}
          {currentPlay.simulation && (
            <div className="animate-fade-slide-up stagger-6 relative mt-4">
              {/* Divider line */}
              <div className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mars/30 to-transparent" />

              <div className="relative rounded-2xl overflow-hidden">
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-mars/[0.06] via-mars/[0.02] to-transparent" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-mars via-mars/40 to-transparent rounded-full" />

                <div className="relative p-6 sm:p-8 pl-7 sm:pl-10">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-mars">
                      {t.simulationTitle}
                    </span>
                    <span className="text-[10px] text-white/20 font-mercure italic tracking-wide">
                      {t.simulationSub}
                    </span>
                  </div>
                  <p className="font-mercure italic text-white/70 text-base sm:text-lg leading-[1.8] tracking-wide">
                    {currentPlay.simulation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Perspectives ── */}
          {currentPlay.perspectives && currentPlay.perspectives.length > 0 && (
            <div className="animate-fade-slide-up stagger-7 relative">
              <div className="rounded-2xl border border-mars/20 overflow-hidden">
                {/* Header bar */}
                <div className="bg-mars/[0.08] border-b border-mars/15 px-6 sm:px-8 py-4 flex items-center gap-3">
                  <div className="w-1.5 h-7 rounded-full bg-mars shadow-[0_0_12px_rgba(255,85,0,0.3)]" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white/90">
                    {t.perspectivesTitle}
                  </span>
                </div>

                {/* Perspective items */}
                <div className="divide-y divide-white/[0.04]">
                  {currentPlay.perspectives.map((p, i) => (
                    <div key={i} className="flex gap-5 items-start px-6 sm:px-8 py-5 sm:py-6 hover:bg-white/[0.02] transition-colors">
                      <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-mars/40 to-mars/15 border border-mars/40 flex items-center justify-center shadow-[0_0_8px_rgba(255,85,0,0.15)]">
                        <span className="text-white font-bold text-xs">
                          {i + 1}
                        </span>
                      </div>
                      <p className="text-white/90 text-base sm:text-lg leading-relaxed pt-1 font-medium">
                        {p}
                      </p>
                    </div>
                  ))}
                </div>
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
                  : "bg-white/8 border border-white/10 hover:bg-white/12 hover:border-white/20 text-white/70 hover:text-white"
              }`}
            >
              {prescribed ? "✓ " + t.prescribed : t.prescribe}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/20 text-sm font-medium transition-all"
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
