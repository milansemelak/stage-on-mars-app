"use client";

import { Play } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  play: Play;
  question: string;
  onClose: () => void;
};

export default function Prescription({ play, question, onClose }: Props) {
  const { t } = useI18n();

  const rxNumber = `SOM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/40 hover:text-white text-sm transition-colors"
        >
          ✕ close
        </button>

        {/* Prescription card */}
        <div className="bg-[#0a0a0a] border-2 border-orange-500/50 rounded-xl overflow-hidden shadow-2xl shadow-orange-500/10">
          {/* Header stripe */}
          <div className="bg-orange-500 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black tracking-tighter text-black">
                ℞
              </span>
              <span className="text-sm font-bold text-black uppercase tracking-wider">
                {t.prescriptionTitle}
              </span>
            </div>
            <span className="text-xs font-mono text-black/60">
              {rxNumber}
            </span>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Question / Prescribed for */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-white/30 font-bold">
                {t.prescribedFor}
              </span>
              <p className="text-white/80 text-sm italic border-b border-white/10 pb-2">
                &ldquo;{question}&rdquo;
              </p>
            </div>

            {/* Play name */}
            <h2 className="text-2xl font-bold text-white">{play.name}</h2>

            {/* Mood + meta */}
            <div className="flex items-center gap-4 text-xs text-white/40">
              <span className="italic text-orange-300/60">{play.mood}</span>
              <span>{play.duration}</span>
              <span>
                {play.playerCount.min}-{play.playerCount.max} {t.players}
              </span>
            </div>

            {/* Components - condensed */}
            <div className="space-y-3 text-sm">
              <PrescriptionLine label={t.theImage} text={play.image} />
              <PrescriptionLine label={t.characters} text={play.characters} />
              <PrescriptionLine label={t.authorsRole} text={play.authorRole} />
              <PrescriptionLine
                label={t.endingPerspective}
                text={play.endingPerspective}
              />
            </div>

            {/* Date */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-white/30">
                {t.prescriptionDate}: {today}
              </span>
              <span className="text-[10px] text-white/20 font-mono">
                Stage on Mars
              </span>
            </div>

            {/* CTA */}
            <a
              href="https://www.stageonmars.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-colors"
            >
              {t.takeToStage} →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrescriptionLine({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-wider text-orange-400/60 font-bold">
        {label}
      </span>
      <p className="text-white/60 leading-relaxed">{text}</p>
    </div>
  );
}
