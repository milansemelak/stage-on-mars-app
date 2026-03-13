"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { Play } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  play: Play;
  question: string;
  onClose: () => void;
};

export default function Prescription({ play, question, onClose }: Props) {
  const { t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  async function saveAsImage() {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0a0a",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `stage-on-mars-${play.name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to save image:", err);
    } finally {
      setSaving(false);
    }
  }

  function sendToEmail() {
    const subject = encodeURIComponent(`Stage on Mars — ${play.name}`);
    const body = encodeURIComponent(
      `${t.prescribedFor}: "${question}"\n\n` +
        `${play.name}\n` +
        `${play.mood} · ${play.duration} · ${play.playerCount.min}-${play.playerCount.max} ${t.players}\n\n` +
        `${t.theImage}:\n${play.image}\n\n` +
        `${t.characters}:\n${play.characters}\n\n` +
        `${t.authorsRole}:\n${play.authorRole}\n\n` +
        `${t.endingPerspective}:\n${play.endingPerspective}\n\n` +
        `---\n${t.takeToStage}\nhttps://www.stageonmars.com`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg my-8">
        {/* The card (captured for image export) */}
        <div
          ref={cardRef}
          className="bg-[#0a0a0a] border-2 border-orange-500/50 rounded-xl overflow-hidden shadow-2xl shadow-orange-500/10"
        >
          {/* Header stripe with logo */}
          <div className="bg-orange-500 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Stage On Mars"
                width={120}
                height={30}
                className="h-[28px] w-auto"
              />
            </div>
            <button
              onClick={onClose}
              className="text-black/40 hover:text-black font-bold text-lg leading-none transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Title */}
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                {t.prescriptionTitle}
              </span>
            </div>

            {/* Question */}
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

            {/* Date + branding */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-white/30">
                {t.prescriptionDate}: {today}
              </span>
              <span className="text-[10px] text-white/20 font-mono">
                stageonmars.com
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

        {/* Action buttons below card */}
        <div className="flex gap-3 mt-4 justify-center">
          <button
            onClick={saveAsImage}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm font-medium transition-colors flex items-center gap-2"
          >
            📷 {saving ? "..." : t.saveImage}
          </button>
          <button
            onClick={sendToEmail}
            className="px-5 py-2.5 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm font-medium transition-colors flex items-center gap-2"
          >
            ✉️ {t.shareEmail}
          </button>
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
