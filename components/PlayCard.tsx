"use client";

import { useState } from "react";
import { Play } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import Prescription from "./Prescription";

const ENERGY_COLORS: Record<string, string> = {
  quiet: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  loud: "bg-red-500/15 text-red-300 border-red-500/25",
  tense: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
  flowing: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  grounded: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  searching: "bg-purple-500/15 text-purple-300 border-purple-500/25",
  burning: "bg-orange-500/15 text-orange-300 border-orange-500/25",
  frozen: "bg-slate-400/15 text-slate-300 border-slate-400/25",
};

type Props = {
  play: Play;
  question?: string;
};

export default function PlayCard({ play, question }: Props) {
  const { t } = useI18n();
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescribed, setPrescribed] = useState(false);

  function handlePrescribe() {
    const prescriptions = JSON.parse(
      localStorage.getItem("som-prescriptions") || "[]"
    );
    prescriptions.unshift({
      play,
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
    const text = `${play.name}\n\n"${question}"\n\n${t.theImage}: ${play.image}\n\n${t.characters}: ${play.characters.map((c) => c.name).join(", ")}\n\n${t.authorsRole}: ${play.authorRole}\n\nhttps://playbook.stageonmars.com`;

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
              {play.name}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
              <span className="italic text-orange-400/50">{play.mood}</span>
              <span className="text-white/10">|</span>
              <span>{play.duration}</span>
              <span className="text-white/10">|</span>
              <span>
                {play.playerCount.min}-{play.playerCount.max} {t.players}
              </span>
            </div>
          </div>

          {/* The Image / Scene */}
          <div className="animate-fade-slide-up stagger-2">
            <SectionLabel color="orange">{t.theImage}</SectionLabel>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-2">
              {play.image}
            </p>
          </div>

          {/* Characters — energy-coded pills */}
          <div className="animate-fade-slide-up stagger-3">
            <SectionLabel color="blue">{t.characters}</SectionLabel>
            <div className="mt-3 flex flex-wrap gap-2">
              {play.characters.map((char, i) => {
                const energyClass =
                  ENERGY_COLORS[char.description?.toLowerCase()] ||
                  ENERGY_COLORS["searching"];
                return (
                  <div
                    key={i}
                    className={`rounded-full border px-4 py-2 ${energyClass} transition-all hover:scale-105`}
                  >
                    <span className="font-bold text-sm">{char.name}</span>
                    {char.description && (
                      <span className="ml-1.5 text-xs opacity-50">
                        {char.description}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Author's Role */}
          <div className="animate-fade-slide-up stagger-4">
            <SectionLabel color="green">{t.authorsRole}</SectionLabel>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-2">
              {play.authorRole}
            </p>
          </div>

          {/* Ending Perspective */}
          <div className="animate-fade-slide-up stagger-5">
            <SectionLabel color="purple">{t.endingPerspective}</SectionLabel>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-2">
              {play.endingPerspective}
            </p>
          </div>

          {/* Simulation Scenario */}
          {play.simulation && (
            <div className="animate-fade-slide-up stagger-6 rounded-xl border border-orange-500/15 bg-orange-500/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400/70">
                  {t.simulationTitle}
                </span>
                <span className="text-xs text-white/20 italic">
                  {t.simulationSub}
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed italic">
                {play.simulation}
              </p>
            </div>
          )}

          {/* Perspectives */}
          {play.perspectives && play.perspectives.length > 0 && (
            <div className="animate-fade-slide-up stagger-7 space-y-3">
              <SectionLabel color="white">{t.perspectivesTitle}</SectionLabel>
              {play.perspectives.map((p, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start pl-1"
                >
                  <span className="text-orange-500/50 font-mono text-sm mt-0.5 shrink-0">
                    0{i + 1}
                  </span>
                  <p className="text-white/60 text-sm leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="animate-fade-slide-up stagger-7 flex gap-3 pt-2">
            <button
              onClick={handlePrescribe}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                prescribed
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-orange-500 hover:bg-orange-400 text-white"
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
          play={play}
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
  color: "orange" | "blue" | "green" | "purple" | "white";
  children: React.ReactNode;
}) {
  const colors = {
    orange: "text-orange-400/60",
    blue: "text-blue-400/60",
    green: "text-green-400/60",
    purple: "text-purple-400/60",
    white: "text-white/40",
  };

  return (
    <span className={`text-[11px] font-bold uppercase tracking-widest ${colors[color]}`}>
      {children}
    </span>
  );
}
