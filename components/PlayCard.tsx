"use client";

import { useState } from "react";
import { Play } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import Prescription from "./Prescription";

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

  return (
    <>
      <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-orange-500/30 transition-colors">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-white">{play.name}</h3>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span>{play.duration}</span>
              <span>
                {play.playerCount.min}-{play.playerCount.max} {t.players}
              </span>
            </div>
          </div>

          {/* Mood */}
          <div className="text-sm text-orange-300/70 italic">{play.mood}</div>

          {/* The Image */}
          <Section label={t.theImage} color="orange">
            {play.image}
          </Section>

          {/* Characters — structured grid */}
          <div>
            <div className="mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {t.characters}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {play.characters.map((char, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 hover:border-blue-500/40 transition-colors"
                >
                  <div className="font-bold text-white text-sm mb-1">
                    {char.name}
                  </div>
                  <div className="text-white/40 text-xs leading-relaxed">
                    {char.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Author's Role */}
          <Section label={t.authorsRole} color="green">
            {play.authorRole}
          </Section>

          {/* Ending Perspective */}
          <Section label={t.endingPerspective} color="purple">
            {play.endingPerspective}
          </Section>

          {/* Simulation Scenario */}
          {play.simulation && (
            <div className="mt-6 rounded-lg border-2 border-dashed border-orange-500/30 bg-orange-500/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  ▶ {t.simulationTitle}
                </span>
                <span className="text-xs text-white/30 italic">
                  {t.simulationSub}
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed italic font-light">
                {play.simulation}
              </p>
            </div>
          )}

          {/* Perspectives */}
          {play.perspectives && play.perspectives.length > 0 && (
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                  {t.perspectivesTitle}
                </span>
              </div>
              <div className="space-y-3">
                {play.perspectives.map((p, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-orange-400 font-bold text-sm mt-0.5">
                      {i + 1}.
                    </span>
                    <p className="text-white/70 text-sm leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prescribe button */}
          <div className="pt-2">
            <button
              onClick={handlePrescribe}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                prescribed
                  ? "bg-green-500/10 border border-green-500/30 text-green-400 cursor-default"
                  : "bg-orange-500/10 border-2 border-orange-500/40 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/60"
              }`}
            >
              {prescribed ? t.prescribed : t.prescribe}
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

function Section({
  label,
  color,
  children,
}: {
  label: string;
  color: "orange" | "green" | "purple";
  children: React.ReactNode;
}) {
  const colors = {
    orange: "border-orange-500/30 bg-orange-500/5",
    green: "border-green-500/30 bg-green-500/5",
    purple: "border-purple-500/30 bg-purple-500/5",
  };

  const labelColors = {
    orange: "text-orange-400",
    green: "text-green-400",
    purple: "text-purple-400",
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <div className="mb-2">
        <span
          className={`text-xs font-bold uppercase tracking-wider ${labelColors[color]}`}
        >
          {label}
        </span>
      </div>
      <p className="text-white/80 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
