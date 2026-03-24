"use client";

import { useRef, useState, useCallback } from "react";
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
  const [sharing, setSharing] = useState(false);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const saveAsImage = useCallback(async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const { toPng } = await import("html-to-image");

      // Hide buttons before capture
      const closeBtn = cardRef.current.querySelector("[data-close-btn]") as HTMLElement;
      if (closeBtn) closeBtn.style.visibility = "hidden";

      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
        cacheBust: true,
      });

      // Restore
      if (closeBtn) closeBtn.style.visibility = "";

      const link = document.createElement("a");
      link.download = `stage-on-mars-${play.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to save image:", err);
      // Fallback: try again without options
      try {
        const { toPng } = await import("html-to-image");
        const dataUrl = await toPng(cardRef.current!, { cacheBust: true });
        const link = document.createElement("a");
        link.download = `stage-on-mars-${play.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err2) {
        console.error("Fallback also failed:", err2);
        alert("Failed to save image. Please try taking a screenshot instead.");
      }
    } finally {
      setSaving(false);
    }
  }, [play.name, saving]);

  const shareViaEmail = useCallback(async () => {
    if (!cardRef.current || sharing) return;
    setSharing(true);

    const fileName = `stage-on-mars-${play.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`;
    const subject = `Stage on Mars — ${play.name}`;
    const bodyText =
      `${t.prescribedFor}: "${question}"\n\n` +
      `${play.name}\n` +
      `${play.mood} · ${play.duration} · ${play.playerCount.min}-${play.playerCount.max} ${t.players}\n\n` +
      `${t.theImage}:\n${play.image}\n\n` +
      `${t.characters}:\n${play.characters.map((c) => `• ${c.name} — ${c.description}`).join("\n")}\n\n` +
      `${t.authorsRole}:\n${play.authorRole}\n\n` +
      `${t.endingPerspective}:\n${play.endingPerspective}\n\n` +
      (play.perspectives && play.perspectives.length > 0
        ? `${t.perspectivesTitle}:\n${play.perspectives.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n`
        : "") +
      `---\n${t.takeToStage}\nhttps://www.stageonmars.com`;

    try {
      // Generate PNG
      const { toPng } = await import("html-to-image");
      const closeBtn = cardRef.current.querySelector("[data-close-btn]") as HTMLElement;
      if (closeBtn) closeBtn.style.visibility = "hidden";

      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
        cacheBust: true,
      });

      if (closeBtn) closeBtn.style.visibility = "";

      // Convert data URL to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: "image/png" });

      // Try Web Share API (supports file sharing on mobile + modern browsers)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: subject,
          text: bodyText,
          files: [file],
        });
      } else {
        // Fallback: download image + open mailto
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        link.click();

        // Small delay then open email with text
        setTimeout(() => {
          window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText + "\n\n(The play card image has been downloaded — attach it to your email.)")}`;
        }, 500);
      }
    } catch (err) {
      console.error("Share failed:", err);
      // Last resort: just open mailto with text
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    } finally {
      setSharing(false);
    }
  }, [play, question, t, sharing]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg my-4 sm:my-8">
        {/* Close button - outside the card so it's always accessible */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center text-lg font-bold transition-colors backdrop-blur-sm border border-white/20"
        >
          ✕
        </button>

        {/* The card (captured for image export) */}
        <div
          ref={cardRef}
          className="bg-[#0a0a0a] border-2 border-mars/50 rounded-xl overflow-hidden shadow-2xl shadow-mars/10"
        >
          {/* Header stripe */}
          <div className="bg-mars px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <span className="text-black font-bold text-sm sm:text-lg tracking-wide">
              The Stage on Mars Experience
            </span>
            <button
              data-close-btn
              onClick={onClose}
              className="text-black/40 hover:text-black font-bold text-xl leading-none transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Title */}
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-mars-light">
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
            <h2 className="text-xl sm:text-2xl font-bold text-white">{play.name}</h2>

            {/* Mood + meta */}
            <div className="flex items-center gap-4 text-xs text-white/40">
              <span className="italic text-mars-light/60">{play.mood}</span>
              <span>{play.duration}</span>
              <span>
                {play.playerCount.min}-{play.playerCount.max} {t.players}
              </span>
            </div>

            {/* Components - condensed */}
            <div className="space-y-3 text-sm">
              <PrescriptionLine label={t.theImage} text={play.image} />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-mars-light/60 font-bold">
                  {t.characters}
                </span>
                <div className="mt-1 space-y-1">
                  {play.characters.map((c, i) => (
                    <p key={i} className="text-white/60 leading-relaxed text-sm">
                      <span className="font-bold text-white/80">{c.name}</span> — {c.description}
                    </p>
                  ))}
                </div>
              </div>
              <PrescriptionLine label={t.authorsRole} text={play.authorRole} />
              <PrescriptionLine
                label={t.endingPerspective}
                text={play.endingPerspective}
              />
            </div>

            {/* First perspective — pull quote */}
            {play.perspectives && play.perspectives.length > 0 && (
              <div className="rounded-lg border border-mars/30 bg-mars/[0.07] px-4 py-3">
                <span className="text-[10px] uppercase tracking-wider text-mars-light/70 font-bold">
                  {t.perspectivesTitle}
                </span>
                <p className="text-white/90 leading-relaxed mt-1.5 font-medium italic text-sm">
                  &ldquo;{play.perspectives[0]}&rdquo;
                </p>
              </div>
            )}

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
              className="block w-full text-center px-6 py-3 rounded-lg bg-mars hover:bg-mars-light text-white font-bold text-sm transition-colors"
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
            className="px-5 py-2.5 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-40"
          >
            📷 {saving ? "Saving..." : t.saveImage}
          </button>
          <button
            onClick={shareViaEmail}
            disabled={sharing}
            className="px-5 py-2.5 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-40"
          >
            ✉️ {sharing ? "Preparing..." : t.shareEmail}
          </button>
        </div>
      </div>
    </div>
  );
}

function PrescriptionLine({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-wider text-mars-light/60 font-bold">
        {label}
      </span>
      <p className="text-white/60 leading-relaxed">{text}</p>
    </div>
  );
}
